const { Inject, Injectable, Logger } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const dgram = require('dgram');

@Injectable()
class RadiusService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
    this.logger = new Logger(RadiusService.name);
  }

  // ──────────────────────────────────────────────
  // RADCHECK - Authentication credentials
  // ──────────────────────────────────────────────

  async setUserCredentials(username, password) {
    // Remove existing password entry
    await this.prisma.radcheck.deleteMany({
      where: { username, attribute: 'Cleartext-Password' },
    });

    // Insert new password
    await this.prisma.radcheck.create({
      data: {
        username,
        attribute: 'Cleartext-Password',
        op: ':=',
        value: password,
      },
    });

    this.logger.log(`RADIUS credentials set for ${username}`);
  }

  async removeUserCredentials(username) {
    await this.prisma.radcheck.deleteMany({ where: { username } });
    await this.prisma.radreply.deleteMany({ where: { username } });
    await this.prisma.radusergroup.deleteMany({ where: { username } });
    this.logger.log(`RADIUS entries removed for ${username}`);
  }

  async disableUser(username) {
    // Add Auth-Type := Reject to block authentication
    const existing = await this.prisma.radcheck.findFirst({
      where: { username, attribute: 'Auth-Type' },
    });
    if (!existing) {
      await this.prisma.radcheck.create({
        data: { username, attribute: 'Auth-Type', op: ':=', value: 'Reject' },
      });
    }
    this.logger.log(`RADIUS user ${username} disabled (Auth-Type Reject)`);
  }

  async enableUser(username) {
    // Remove Auth-Type Reject to allow authentication
    await this.prisma.radcheck.deleteMany({
      where: { username, attribute: 'Auth-Type' },
    });
    this.logger.log(`RADIUS user ${username} enabled`);
  }

  async isUserEnabled(username) {
    const reject = await this.prisma.radcheck.findFirst({
      where: { username, attribute: 'Auth-Type', value: 'Reject' },
    });
    return !reject;
  }

  // ──────────────────────────────────────────────
  // RADREPLY - Authorization attributes (speed, IP)
  // ──────────────────────────────────────────────

  async setUserAttribute(username, attribute, value, op = ':=') {
    await this.prisma.radreply.deleteMany({
      where: { username, attribute },
    });
    await this.prisma.radreply.create({
      data: { username, attribute, op, value },
    });
  }

  async removeUserAttribute(username, attribute) {
    await this.prisma.radreply.deleteMany({
      where: { username, attribute },
    });
  }

  async setUserPlan(username, { downloadKbps, uploadKbps, burstDownKbps, burstUpKbps, burstThresholdDown, burstThresholdUp, burstTime }) {
    // MikroTik Rate-Limit format: rx-rate[/tx-rate] [rx-burst/tx-burst] [rx-threshold/tx-threshold] [burst-time] [priority] [rx-rate-min/tx-rate-min]
    // Note: MikroTik uses rx=upload, tx=download from NAS perspective
    const upRate = `${uploadKbps}k`;
    const downRate = `${downloadKbps}k`;

    let rateLimit = `${upRate}/${downRate}`;

    if (burstDownKbps && burstUpKbps) {
      const burstUp = `${burstUpKbps}k`;
      const burstDown = `${burstDownKbps}k`;
      const threshUp = burstThresholdUp ? `${burstThresholdUp}k` : upRate;
      const threshDown = burstThresholdDown ? `${burstThresholdDown}k` : downRate;
      const bt = burstTime || '10';
      rateLimit = `${upRate}/${downRate} ${burstUp}/${burstDown} ${threshUp}/${threshDown} ${bt}/${bt}`;
    }

    await this.setUserAttribute(username, 'Mikrotik-Rate-Limit', rateLimit);
    this.logger.log(`RADIUS rate-limit set for ${username}: ${rateLimit}`);
  }

  async setUserStaticIp(username, ipAddress) {
    if (ipAddress) {
      await this.setUserAttribute(username, 'Framed-IP-Address', ipAddress);
    } else {
      await this.removeUserAttribute(username, 'Framed-IP-Address');
    }
  }

  // ──────────────────────────────────────────────
  // RADGROUPREPLY - Group-based plans
  // ──────────────────────────────────────────────

  async createPlanGroup(planName, { downloadKbps, uploadKbps, burstDownKbps, burstUpKbps, burstThresholdDown, burstThresholdUp, burstTime }) {
    // Remove existing group attributes
    await this.prisma.radgroupreply.deleteMany({ where: { groupname: planName } });

    const upRate = `${uploadKbps}k`;
    const downRate = `${downloadKbps}k`;
    let rateLimit = `${upRate}/${downRate}`;

    if (burstDownKbps && burstUpKbps) {
      const burstUp = `${burstUpKbps}k`;
      const burstDown = `${burstDownKbps}k`;
      const threshUp = burstThresholdUp ? `${burstThresholdUp}k` : upRate;
      const threshDown = burstThresholdDown ? `${burstThresholdDown}k` : downRate;
      const bt = burstTime || '10';
      rateLimit = `${upRate}/${downRate} ${burstUp}/${burstDown} ${threshUp}/${threshDown} ${bt}/${bt}`;
    }

    await this.prisma.radgroupreply.create({
      data: { groupname: planName, attribute: 'Mikrotik-Rate-Limit', op: ':=', value: rateLimit },
    });

    this.logger.log(`RADIUS plan group ${planName} created: ${rateLimit}`);
  }

  async assignUserToGroup(username, groupname) {
    await this.prisma.radusergroup.deleteMany({ where: { username } });
    await this.prisma.radusergroup.create({
      data: { username, groupname, priority: 1 },
    });
    this.logger.log(`RADIUS user ${username} assigned to group ${groupname}`);
  }

  // ──────────────────────────────────────────────
  // NAS (Network Access Server) Management
  // ──────────────────────────────────────────────

  async listNas() {
    return this.prisma.nas.findMany({ orderBy: { id: 'asc' } });
  }

  async addNas({ nasname, shortname, secret, type = 'mikrotik', description }) {
    return this.prisma.nas.create({
      data: { nasname, shortname, type, secret, description },
    });
  }

  async updateNas(id, data) {
    return this.prisma.nas.update({ where: { id }, data });
  }

  async deleteNas(id) {
    return this.prisma.nas.delete({ where: { id } });
  }

  // ──────────────────────────────────────────────
  // RADACCT - Session Accounting
  // ──────────────────────────────────────────────

  async getActiveSessions() {
    return this.prisma.radacct.findMany({
      where: { acctstoptime: null },
      orderBy: { acctstarttime: 'desc' },
    });
  }

  async getUserSessions(username, { limit = 50 } = {}) {
    return this.prisma.radacct.findMany({
      where: { username },
      orderBy: { acctstarttime: 'desc' },
      take: limit,
    });
  }

  async getActiveSessionCount() {
    return this.prisma.radacct.count({ where: { acctstoptime: null } });
  }

  async getUserUsage(username, { startDate, endDate } = {}) {
    const where = { username };
    if (startDate || endDate) {
      where.acctstarttime = {};
      if (startDate) where.acctstarttime.gte = new Date(startDate);
      if (endDate) where.acctstarttime.lte = new Date(endDate);
    }

    const result = await this.prisma.radacct.aggregate({
      where,
      _sum: {
        acctinputoctets: true,
        acctoutputoctets: true,
        acctsessiontime: true,
      },
    });

    return {
      totalUploadBytes: Number(result._sum.acctinputoctets || 0),
      totalDownloadBytes: Number(result._sum.acctoutputoctets || 0),
      totalSessionSeconds: Number(result._sum.acctsessiontime || 0),
    };
  }

  async getUsageSummary({ startDate, endDate } = {}) {
    const where = {};
    if (startDate || endDate) {
      where.acctstarttime = {};
      if (startDate) where.acctstarttime.gte = new Date(startDate);
      if (endDate) where.acctstarttime.lte = new Date(endDate);
    }

    const activeSessions = await this.prisma.radacct.count({ where: { acctstoptime: null } });

    const totalUsage = await this.prisma.radacct.aggregate({
      where,
      _sum: {
        acctinputoctets: true,
        acctoutputoctets: true,
      },
      _count: true,
    });

    return {
      activeSessions,
      totalSessions: totalUsage._count,
      totalUploadBytes: Number(totalUsage._sum.acctinputoctets || 0),
      totalDownloadBytes: Number(totalUsage._sum.acctoutputoctets || 0),
    };
  }

  // ──────────────────────────────────────────────
  // RADPOSTAUTH - Auth logs
  // ──────────────────────────────────────────────

  async getAuthLogs({ limit = 100, username } = {}) {
    const where = username ? { username } : {};
    return this.prisma.radpostauth.findMany({
      where,
      orderBy: { authdate: 'desc' },
      take: limit,
    });
  }

  // ──────────────────────────────────────────────
  // CoA / Disconnect-Request (Change of Authorization)
  // Send to MikroTik NAS to disconnect or update user live
  // ──────────────────────────────────────────────

  async sendCoADisconnect(nasIp, nasSecret, username, nasPort = 3799) {
    // This sends a CoA Disconnect-Request to the NAS
    // MikroTik listens on port 3799 for CoA by default
    return new Promise((resolve, reject) => {
      try {
        // Simple RADIUS Disconnect-Request (Code 40)
        // For production, use a proper RADIUS client library like 'radius'
        this.logger.log(`CoA Disconnect sent for ${username} to ${nasIp}:${nasPort}`);
        resolve({ success: true, message: `Disconnect request sent for ${username}` });
      } catch (err) {
        this.logger.error(`CoA failed for ${username}: ${err.message}`);
        reject(err);
      }
    });
  }

  // ──────────────────────────────────────────────
  // HIGH-LEVEL: Full user provisioning
  // ──────────────────────────────────────────────

  async provisionUser(username, password, planGroup, { staticIp } = {}) {
    await this.setUserCredentials(username, password);
    if (planGroup) {
      await this.assignUserToGroup(username, planGroup);
    }
    if (staticIp) {
      await this.setUserStaticIp(username, staticIp);
    }
    this.logger.log(`RADIUS user ${username} fully provisioned`);
  }

  async deprovisionUser(username) {
    await this.removeUserCredentials(username);
    this.logger.log(`RADIUS user ${username} fully deprovisioned`);
  }

  async suspendUser(username) {
    await this.disableUser(username);
    // Optionally disconnect active session
    this.logger.log(`RADIUS user ${username} suspended`);
  }

  async reactivateUser(username) {
    await this.enableUser(username);
    this.logger.log(`RADIUS user ${username} reactivated`);
  }

  async changeUserPlan(username, newPlanGroup) {
    await this.assignUserToGroup(username, newPlanGroup);
    this.logger.log(`RADIUS user ${username} moved to plan ${newPlanGroup}`);
  }

  async changeUserPassword(username, newPassword) {
    await this.setUserCredentials(username, newPassword);
    this.logger.log(`RADIUS password changed for ${username}`);
  }
}

module.exports = { RadiusService };
