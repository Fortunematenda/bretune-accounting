const { Injectable, Logger } = require('@nestjs/common');
const { RouterOSAPI } = require('node-routeros');
const net = require('net');

@Injectable()
class MikroTikService {
  constructor() {
    this.logger = new Logger(MikroTikService.name);
    this.conn = null;
    this.config = {
      host: process.env.MIKROTIK_HOST || '102.222.12.129',
      user: process.env.MIKROTIK_USER || 'admin',
      password: process.env.MIKROTIK_PASSWORD || 'Rachfort24',
      port: Number(process.env.MIKROTIK_PORT || 8728),
      timeout: 5,
    };
  }

  isReachable() {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      socket.once('connect', () => { socket.destroy(); resolve(true); });
      socket.once('error', () => { socket.destroy(); resolve(false); });
      socket.once('timeout', () => { socket.destroy(); resolve(false); });
      socket.connect(this.config.port, this.config.host);
    });
  }

  async getConnection() {
    try {
      if (this.conn && this.conn.connected) {
        return this.conn;
      }
      this.conn = new RouterOSAPI(this.config);
      this.conn.on('error', (err) => {
        this.logger.warn(`MikroTik connection error event: ${err?.message || err}`);
        this.conn = null;
      });
      await this.conn.connect();
      this.logger.log(`Connected to MikroTik at ${this.config.host}:${this.config.port}`);
      return this.conn;
    } catch (err) {
      this.logger.warn(`Failed to connect to MikroTik: ${err?.message || err}`);
      this.conn = null;
      throw err;
    }
  }

  async execute(command, params = []) {
    const reachable = await this.isReachable();
    if (!reachable) {
      this.conn = null;
      throw new Error('MikroTik unreachable');
    }
    const conn = await this.getConnection();
    try {
      return await conn.write(command, params);
    } catch (err) {
      this.conn = null;
      this.logger.warn(`MikroTik command failed: ${command} - ${err?.message || err}`);
      throw err;
    }
  }

  // ──────────────────────────────────────────────
  // SYSTEM
  // ──────────────────────────────────────────────

  async getSystemResource() {
    const [resource] = await this.execute('/system/resource/print');
    return {
      uptime: resource.uptime || null,
      cpuLoad: Number(resource['cpu-load'] || 0),
      freeMemory: Number(resource['free-memory'] || 0),
      totalMemory: Number(resource['total-memory'] || 0),
      memoryPercent: Math.round(
        ((Number(resource['total-memory'] || 0) - Number(resource['free-memory'] || 0)) /
          Number(resource['total-memory'] || 1)) *
          100,
      ),
      freeHddSpace: Number(resource['free-hdd-space'] || 0),
      totalHddSpace: Number(resource['total-hdd-space'] || 0),
      version: resource.version || null,
      boardName: resource['board-name'] || null,
      platform: resource.platform || null,
      architecture: resource['architecture-name'] || null,
    };
  }

  async getIdentity() {
    const [identity] = await this.execute('/system/identity/print');
    return identity?.name || 'Unknown';
  }

  // ──────────────────────────────────────────────
  // PPPoE ACTIVE CONNECTIONS
  // ──────────────────────────────────────────────

  async getActiveConnections() {
    const active = await this.execute('/ppp/active/print');
    return active.map((c) => ({
      id: c['.id'],
      name: c.name || '',
      service: c.service || '',
      callerId: c['caller-id'] || '',
      address: c.address || '',
      uptime: c.uptime || '',
      encoding: c.encoding || '',
      sessionId: c['session-id'] || '',
      radius: c.radius === 'true',
    }));
  }

  async disconnectUser(connectionId) {
    await this.execute('/ppp/active/remove', [`=.id=${connectionId}`]);
    return { success: true, message: 'User disconnected' };
  }

  async disconnectByUsername(username) {
    const active = await this.execute('/ppp/active/print', [`?name=${username}`]);
    if (!active.length) {
      return { success: false, message: 'User not currently connected' };
    }
    for (const conn of active) {
      await this.execute('/ppp/active/remove', [`=.id=${conn['.id']}`]);
    }
    return { success: true, message: `Disconnected ${active.length} session(s) for ${username}` };
  }

  // ──────────────────────────────────────────────
  // PPPoE SECRETS (USER ACCOUNTS)
  // ──────────────────────────────────────────────

  async getSecrets() {
    const secrets = await this.execute('/ppp/secret/print');
    return secrets.map((s) => ({
      id: s['.id'],
      name: s.name || '',
      password: '********',
      service: s.service || 'pppoe',
      profile: s.profile || '',
      localAddress: s['local-address'] || '',
      remoteAddress: s['remote-address'] || '',
      disabled: s.disabled === 'true',
      comment: s.comment || '',
      lastLoggedOut: s['last-logged-out'] || '',
      lastCallerId: s['last-caller-id'] || '',
    }));
  }

  async getSecret(username) {
    const secrets = await this.execute('/ppp/secret/print', [`?name=${username}`]);
    if (!secrets.length) return null;
    const s = secrets[0];
    return {
      id: s['.id'],
      name: s.name || '',
      password: s.password || '',
      service: s.service || 'pppoe',
      profile: s.profile || '',
      localAddress: s['local-address'] || '',
      remoteAddress: s['remote-address'] || '',
      disabled: s.disabled === 'true',
      comment: s.comment || '',
      lastLoggedOut: s['last-logged-out'] || '',
      lastCallerId: s['last-caller-id'] || '',
    };
  }

  async createSecret({ name, password, profile, service = 'pppoe', comment = '' }) {
    const params = [
      `=name=${name}`,
      `=password=${password}`,
      `=profile=${profile}`,
      `=service=${service}`,
    ];
    if (comment) params.push(`=comment=${comment}`);
    await this.execute('/ppp/secret/add', params);
    return { success: true, message: `PPPoE user ${name} created with profile ${profile}` };
  }

  async updateSecret(secretId, data) {
    const params = [`=.id=${secretId}`];
    if (data.password) params.push(`=password=${data.password}`);
    if (data.profile) params.push(`=profile=${data.profile}`);
    if (data.comment !== undefined) params.push(`=comment=${data.comment}`);
    if (data.disabled !== undefined) params.push(`=disabled=${data.disabled ? 'yes' : 'no'}`);
    await this.execute('/ppp/secret/set', params);
    return { success: true, message: 'PPPoE user updated' };
  }

  async disableSecret(username) {
    const secret = await this.getSecret(username);
    if (!secret) throw new Error(`PPPoE user ${username} not found`);
    await this.execute('/ppp/secret/set', [`=.id=${secret.id}`, '=disabled=yes']);
    await this.disconnectByUsername(username);
    return { success: true, message: `PPPoE user ${username} disabled and disconnected` };
  }

  async enableSecret(username) {
    const secret = await this.getSecret(username);
    if (!secret) throw new Error(`PPPoE user ${username} not found`);
    await this.execute('/ppp/secret/set', [`=.id=${secret.id}`, '=disabled=no']);
    return { success: true, message: `PPPoE user ${username} enabled` };
  }

  async deleteSecret(secretId) {
    await this.execute('/ppp/secret/remove', [`=.id=${secretId}`]);
    return { success: true, message: 'PPPoE user deleted' };
  }

  // ──────────────────────────────────────────────
  // PPP PROFILES (SPEED PLANS)
  // ──────────────────────────────────────────────

  async getProfiles() {
    const profiles = await this.execute('/ppp/profile/print');
    return profiles.map((p) => ({
      id: p['.id'],
      name: p.name || '',
      localAddress: p['local-address'] || '',
      remoteAddress: p['remote-address'] || '',
      rateLimit: p['rate-limit'] || '',
      onlyOne: p['only-one'] || '',
      comment: p.comment || '',
    }));
  }

  // ──────────────────────────────────────────────
  // INTERFACES
  // ──────────────────────────────────────────────

  async getInterfaces() {
    const ifaces = await this.execute('/interface/print');
    return ifaces.map((i) => ({
      id: i['.id'],
      name: i.name || '',
      type: i.type || '',
      mtu: i.mtu || '',
      running: i.running === 'true',
      disabled: i.disabled === 'true',
      txByte: Number(i['tx-byte'] || 0),
      rxByte: Number(i['rx-byte'] || 0),
      txPacket: Number(i['tx-packet'] || 0),
      rxPacket: Number(i['rx-packet'] || 0),
      comment: i.comment || '',
    }));
  }

  async getInterfaceTraffic(interfaceName) {
    const stats = await this.execute('/interface/monitor-traffic', [
      `=interface=${interfaceName}`,
      '=once=',
    ]);
    if (!stats.length) return null;
    const s = stats[0];
    return {
      name: s.name || interfaceName,
      rxBitsPerSecond: Number(s['rx-bits-per-second'] || 0),
      txBitsPerSecond: Number(s['tx-bits-per-second'] || 0),
      rxPacketsPerSecond: Number(s['rx-packets-per-second'] || 0),
      txPacketsPerSecond: Number(s['tx-packets-per-second'] || 0),
    };
  }

  // ──────────────────────────────────────────────
  // QUEUES (BANDWIDTH LIMITS)
  // ──────────────────────────────────────────────

  async getQueues() {
    const queues = await this.execute('/queue/simple/print');
    return queues.map((q) => ({
      id: q['.id'],
      name: q.name || '',
      target: q.target || '',
      maxLimit: q['max-limit'] || '',
      burstLimit: q['burst-limit'] || '',
      burstThreshold: q['burst-threshold'] || '',
      burstTime: q['burst-time'] || '',
      bytes: q.bytes || '',
      packets: q.packets || '',
      disabled: q.disabled === 'true',
      comment: q.comment || '',
    }));
  }

  // ──────────────────────────────────────────────
  // LOGS
  // ──────────────────────────────────────────────

  async getLogs(limit = 50) {
    const logs = await this.execute('/log/print');
    return logs.slice(-limit).map((l) => ({
      id: l['.id'],
      time: l.time || '',
      topics: l.topics || '',
      message: l.message || '',
    }));
  }

  // ──────────────────────────────────────────────
  // BANDWIDTH / TRAFFIC PER USER
  // ──────────────────────────────────────────────

  async getPPPoEInterfaceStats() {
    try {
      const ifaces = await this.execute('/interface/print', [
        '?type=pppoe-in',
      ]);
      const stats = {};
      for (const i of ifaces) {
        const name = (i.name || '').replace(/^<pppoe-/, '').replace(/>$/, '');
        if (name) {
          stats[name] = {
            txBytes: Number(i['tx-byte'] || 0),
            rxBytes: Number(i['rx-byte'] || 0),
            txPackets: Number(i['tx-packet'] || 0),
            rxPackets: Number(i['rx-packet'] || 0),
          };
        }
      }
      return stats;
    } catch (err) {
      this.logger.warn(`Failed to get PPPoE interface stats: ${err.message}`);
      return {};
    }
  }

  async getDynamicQueueStats() {
    try {
      const queues = await this.execute('/queue/simple/print');
      const stats = {};
      for (const q of queues) {
        const target = q.target || '';
        const name = q.name || '';
        const bytesStr = q.bytes || '0/0';
        const [txBytes, rxBytes] = bytesStr.split('/').map(Number);
        const rateStr = q.rate || '0/0';
        const [txRate, rxRate] = rateStr.split('/').map(Number);
        const maxLimit = q['max-limit'] || '';
        const [maxUp, maxDown] = (maxLimit || '').split('/').map((v) => v || '0');
        const key = name.replace(/^<pppoe-/, '').replace(/>$/, '') || target;
        if (key) {
          stats[key] = {
            queueName: q.name,
            target,
            txBytes: txBytes || 0,
            rxBytes: rxBytes || 0,
            txRate: txRate || 0,
            rxRate: rxRate || 0,
            maxLimitUp: maxUp,
            maxLimitDown: maxDown,
            disabled: q.disabled === 'true',
          };
        }
      }
      return stats;
    } catch (err) {
      this.logger.warn(`Failed to get queue stats: ${err.message}`);
      return {};
    }
  }

  async getAllBandwidth() {
    try {
      const [ifaceStats, queueStats] = await Promise.all([
        this.getPPPoEInterfaceStats(),
        this.getDynamicQueueStats(),
      ]);
      const usernames = new Set([...Object.keys(ifaceStats), ...Object.keys(queueStats)]);
      const result = {};
      for (const name of usernames) {
        const iStats = ifaceStats[name] || null;
        const qStats = queueStats[name] || null;
        result[name] = {
          txBytes: iStats?.txBytes || qStats?.txBytes || 0,
          rxBytes: iStats?.rxBytes || qStats?.rxBytes || 0,
          txRate: qStats?.txRate || 0,
          rxRate: qStats?.rxRate || 0,
          maxLimitUp: qStats?.maxLimitUp || '',
          maxLimitDown: qStats?.maxLimitDown || '',
        };
      }
      return result;
    } catch (err) {
      this.logger.warn(`Failed to get all bandwidth: ${err.message}`);
      return {};
    }
  }

  async getLiveTrafficForUser(username) {
    try {
      const ifaces = await this.execute('/interface/print', [
        `?name=<pppoe-${username}>`,
      ]);
      if (!ifaces.length) return null;
      const stats = await this.execute('/interface/monitor-traffic', [
        `=interface=<pppoe-${username}>`,
        '=once=',
      ]);
      if (!stats.length) return null;
      const s = stats[0];
      return {
        rxBitsPerSecond: Number(s['rx-bits-per-second'] || 0),
        txBitsPerSecond: Number(s['tx-bits-per-second'] || 0),
        rxPacketsPerSecond: Number(s['rx-packets-per-second'] || 0),
        txPacketsPerSecond: Number(s['tx-packets-per-second'] || 0),
      };
    } catch (err) {
      this.logger.warn(`Failed to get live traffic for ${username}: ${err.message}`);
      return null;
    }
  }

  // ──────────────────────────────────────────────
  // FULL DASHBOARD
  // ──────────────────────────────────────────────

  async getRouterDashboard() {
    try {
      const [resource, identity, active, secrets, profiles, interfaces, ifaceStats, queueStats] = await Promise.all([
        this.getSystemResource(),
        this.getIdentity(),
        this.getActiveConnections(),
        this.getSecrets(),
        this.getProfiles(),
        this.getInterfaces(),
        this.getPPPoEInterfaceStats(),
        this.getDynamicQueueStats(),
      ]);

      const activeUsernames = new Set(active.map((a) => a.name));
      const enrichedSecrets = secrets.map((s) => {
        const iStats = ifaceStats[s.name] || null;
        const qStats = queueStats[s.name] || null;
        return {
          ...s,
          isOnline: activeUsernames.has(s.name),
          activeSession: active.find((a) => a.name === s.name) || null,
          bandwidth: iStats || qStats ? {
            txBytes: iStats?.txBytes || qStats?.txBytes || 0,
            rxBytes: iStats?.rxBytes || qStats?.rxBytes || 0,
            txRate: qStats?.txRate || 0,
            rxRate: qStats?.rxRate || 0,
            maxLimitUp: qStats?.maxLimitUp || '',
            maxLimitDown: qStats?.maxLimitDown || '',
          } : null,
        };
      });

      return {
        connected: true,
        identity,
        system: resource,
        activeConnections: active.length,
        totalSecrets: secrets.length,
        onlineClients: active.length,
        offlineClients: secrets.filter((s) => !activeUsernames.has(s.name) && !s.disabled).length,
        disabledClients: secrets.filter((s) => s.disabled).length,
        clients: enrichedSecrets,
        profiles,
        interfaces: interfaces.filter((i) => i.running || i.type === 'pppoe-in'),
      };
    } catch (err) {
      this.logger.warn(`Router dashboard failed: ${err?.message || err}`);
      return {
        connected: false,
        error: err?.message || 'Connection failed',
        activeConnections: 0,
        totalSecrets: 0,
        onlineClients: 0,
        offlineClients: 0,
        disabledClients: 0,
        clients: [],
        profiles: [],
        interfaces: [],
      };
    }
  }

  async onModuleDestroy() {
    if (this.conn) {
      try {
        this.conn.close();
      } catch {
        // ignore
      }
    }
  }
}

module.exports = { MikroTikService };
