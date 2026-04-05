const { Inject, Injectable, Logger, NotFoundException, BadRequestException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { MikroTikService } = require('./mikrotik.service');
const { RadiusService } = require('./radius.service');

@Injectable()
class ISPService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(MikroTikService) mikroTikService,
    @Inject(RadiusService) radiusService,
  ) {
    this.prisma = prismaService;
    this.mikroTik = mikroTikService;
    this.radius = radiusService;
    this.logger = new Logger(ISPService.name);
  }

  // ──────────────────────────────────────────────
  // NETWORK DEVICES
  // ──────────────────────────────────────────────

  async listDevices(ownerCompanyName, { page = 1, limit = 20, type, status } = {}) {
    const where = { ownerCompanyName };
    if (type) where.type = type;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.networkDevice.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { clientLinks: true, interfaces: true, alerts: true } },
          parentDevice: { select: { id: true, name: true } },
        },
      }),
      this.prisma.networkDevice.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async getDevice(id) {
    const device = await this.prisma.networkDevice.findUnique({
      where: { id },
      include: {
        interfaces: { orderBy: { name: 'asc' } },
        clientLinks: {
          include: {
            client: { select: { id: true, companyName: true, contactName: true, email: true } },
            servicePlan: { select: { id: true, name: true, downloadSpeed: true, uploadSpeed: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        alerts: { where: { isResolved: false }, orderBy: { createdAt: 'desc' }, take: 20 },
        parentDevice: { select: { id: true, name: true } },
        childDevices: { select: { id: true, name: true, type: true, status: true } },
      },
    });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async createDevice(data) {
    return this.prisma.networkDevice.create({ data });
  }

  async updateDevice(id, data) {
    return this.prisma.networkDevice.update({ where: { id }, data });
  }

  async deleteDevice(id) {
    return this.prisma.networkDevice.delete({ where: { id } });
  }

  // ──────────────────────────────────────────────
  // SERVICE PLANS
  // ──────────────────────────────────────────────

  async listPlans(ownerCompanyName, { page = 1, limit = 50 } = {}) {
    const where = { ownerCompanyName };
    const [items, total] = await Promise.all([
      this.prisma.servicePlan.findMany({
        where,
        orderBy: { monthlyPrice: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { clientLinks: true } } },
      }),
      this.prisma.servicePlan.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async createPlan(data) {
    return this.prisma.servicePlan.create({ data });
  }

  async updatePlan(id, data) {
    return this.prisma.servicePlan.update({ where: { id }, data });
  }

  async deletePlan(id) {
    return this.prisma.servicePlan.delete({ where: { id } });
  }

  // ──────────────────────────────────────────────
  // CLIENT NETWORK LINKS
  // ──────────────────────────────────────────────

  async listClientLinks(ownerCompanyName, { page = 1, limit = 20, clientId, serviceStatus } = {}) {
    const where = { ownerCompanyName };
    if (clientId) where.clientId = clientId;
    if (serviceStatus) where.serviceStatus = serviceStatus;

    const [items, total] = await Promise.all([
      this.prisma.clientNetworkLink.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          client: { select: { id: true, companyName: true, contactName: true, email: true, phone: true } },
          device: { select: { id: true, name: true, type: true, status: true } },
          servicePlan: { select: { id: true, name: true, downloadSpeed: true, uploadSpeed: true, monthlyPrice: true } },
        },
      }),
      this.prisma.clientNetworkLink.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async createClientLink(data) {
    return this.prisma.clientNetworkLink.create({
      data,
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
        servicePlan: { select: { id: true, name: true } },
      },
    });
  }

  async updateClientLink(id, data) {
    return this.prisma.clientNetworkLink.update({ where: { id }, data });
  }

  async suspendClient(id, reason) {
    return this.prisma.clientNetworkLink.update({
      where: { id },
      data: {
        serviceStatus: 'SUSPENDED',
        suspendedAt: new Date(),
        suspendReason: reason || 'Non-payment',
      },
    });
  }

  async reactivateClient(id) {
    return this.prisma.clientNetworkLink.update({
      where: { id },
      data: {
        serviceStatus: 'ACTIVE',
        suspendedAt: null,
        suspendReason: null,
      },
    });
  }

  async terminateClient(id) {
    return this.prisma.clientNetworkLink.update({
      where: { id },
      data: {
        serviceStatus: 'TERMINATED',
        terminatedAt: new Date(),
      },
    });
  }

  // ──────────────────────────────────────────────
  // NETWORK ALERTS
  // ──────────────────────────────────────────────

  async listAlerts(ownerCompanyName, { page = 1, limit = 20, severity, isResolved } = {}) {
    const where = { ownerCompanyName };
    if (severity) where.severity = severity;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true' || isResolved === true;

    const [items, total] = await Promise.all([
      this.prisma.networkAlert.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { device: { select: { id: true, name: true, type: true, ipAddress: true } } },
      }),
      this.prisma.networkAlert.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async resolveAlert(id, userId) {
    return this.prisma.networkAlert.update({
      where: { id },
      data: { isResolved: true, resolvedAt: new Date(), resolvedByUserId: userId },
    });
  }

  // ──────────────────────────────────────────────
  // DASHBOARD SUMMARY
  // ──────────────────────────────────────────────

  async getDashboardSummary(ownerCompanyName) {
    const [
      totalDevices,
      onlineDevices,
      offlineDevices,
      degradedDevices,
      totalClients,
      activeClients,
      suspendedClients,
      pendingClients,
      unresolvedAlerts,
      criticalAlerts,
    ] = await Promise.all([
      this.prisma.networkDevice.count({ where: { ownerCompanyName } }),
      this.prisma.networkDevice.count({ where: { ownerCompanyName, status: 'ONLINE' } }),
      this.prisma.networkDevice.count({ where: { ownerCompanyName, status: 'OFFLINE' } }),
      this.prisma.networkDevice.count({ where: { ownerCompanyName, status: 'DEGRADED' } }),
      this.prisma.clientNetworkLink.count({ where: { ownerCompanyName } }),
      this.prisma.clientNetworkLink.count({ where: { ownerCompanyName, serviceStatus: 'ACTIVE' } }),
      this.prisma.clientNetworkLink.count({ where: { ownerCompanyName, serviceStatus: 'SUSPENDED' } }),
      this.prisma.clientNetworkLink.count({ where: { ownerCompanyName, serviceStatus: 'PENDING' } }),
      this.prisma.networkAlert.count({ where: { ownerCompanyName, isResolved: false } }),
      this.prisma.networkAlert.count({ where: { ownerCompanyName, isResolved: false, severity: 'CRITICAL' } }),
    ]);

    // Recent alerts
    const recentAlerts = await this.prisma.networkAlert.findMany({
      where: { ownerCompanyName, isResolved: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { device: { select: { id: true, name: true, type: true } } },
    });

    return {
      devices: { total: totalDevices, online: onlineDevices, offline: offlineDevices, degraded: degradedDevices },
      clients: { total: totalClients, active: activeClients, suspended: suspendedClients, pending: pendingClients },
      alerts: { unresolved: unresolvedAlerts, critical: criticalAlerts, recent: recentAlerts },
    };
  }

  // ──────────────────────────────────────────────
  // AUTO-BILLING (generate invoices for due clients)
  // ──────────────────────────────────────────────

  async getClientsDueBilling(ownerCompanyName) {
    const today = new Date();
    const dayOfMonth = today.getDate();

    return this.prisma.clientNetworkLink.findMany({
      where: {
        ownerCompanyName,
        serviceStatus: 'ACTIVE',
        autoBilling: true,
        billingDay: dayOfMonth,
        OR: [
          { lastBilledAt: null },
          { nextBillDate: { lte: today } },
        ],
      },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
        servicePlan: true,
      },
    });
  }

  // ──────────────────────────────────────────────
  // AUTO-SUSPENSION (suspend clients with overdue invoices)
  // ──────────────────────────────────────────────

  async getClientsForAutoSuspension(ownerCompanyName, { overdueDays = 30 } = {}) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - overdueDays);

    // Find active client links whose clients have overdue invoices
    const links = await this.prisma.clientNetworkLink.findMany({
      where: {
        ownerCompanyName,
        serviceStatus: 'ACTIVE',
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            invoices: {
              where: {
                status: 'OVERDUE',
                dueDate: { lte: cutoff },
              },
              select: { id: true, invoiceNumber: true, balanceDue: true, dueDate: true },
              take: 5,
            },
          },
        },
        servicePlan: { select: { name: true } },
      },
    });

    // Only return links where client has overdue invoices
    return links.filter((l) => l.client?.invoices?.length > 0);
  }

  // ──────────────────────────────────────────────
  // ISP CUSTOMERS (Splynx-style profiles)
  // ──────────────────────────────────────────────

  async listIspCustomers(ownerCompanyName, { page = 1, limit = 100, status, search } = {}) {
    const conditions = [];
    if (ownerCompanyName) {
      conditions.push({ OR: [{ ownerCompanyName }, { ownerCompanyName: null }] });
    }
    if (status) conditions.push({ status });
    if (search) {
      conditions.push({
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { pppoeUsername: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { street: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [items, total] = await Promise.all([
      this.prisma.ispCustomer.findMany({
        where,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ispCustomer.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async getIspCustomer(id) {
    const customer = await this.prisma.ispCustomer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('ISP Customer not found');
    return customer;
  }

  async getIspCustomerByUsername(pppoeUsername) {
    return this.prisma.ispCustomer.findUnique({ where: { pppoeUsername } });
  }

  async createIspCustomer(data) {
    return this.prisma.ispCustomer.create({ data });
  }

  async updateIspCustomer(id, data) {
    return this.prisma.ispCustomer.update({ where: { id }, data });
  }

  async updateIspCustomerByUsername(pppoeUsername, data) {
    return this.prisma.ispCustomer.upsert({
      where: { pppoeUsername },
      update: data,
      create: { pppoeUsername, ...data },
    });
  }

  async convertLeadToCustomer(id, { pppoePassword, profile }) {
    const customer = await this.prisma.ispCustomer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('ISP Customer not found');
    if (customer.status !== 'LEAD') {
      throw new BadRequestException('Only leads can be converted to customers');
    }
    if (!pppoePassword || !profile) {
      throw new BadRequestException('PPPoE password and profile are required');
    }

    // RADIUS: provision user in radcheck + assign plan group
    try {
      await this.radius.provisionUser(customer.pppoeUsername, pppoePassword, profile);
    } catch (e) {
      this.logger.warn(`RADIUS provision failed for ${customer.pppoeUsername}: ${e.message}`);
    }

    // MikroTik API: create PPPoE secret (legacy/fallback)
    try {
      await this.mikroTik.createSecret({
        name: customer.pppoeUsername,
        password: pppoePassword,
        profile,
        comment: `${customer.firstName} ${customer.lastName}`,
      });
    } catch (e) {
      this.logger.warn(`MikroTik createSecret failed for ${customer.pppoeUsername}: ${e.message}`);
    }

    // Update status to ACTIVE
    return this.prisma.ispCustomer.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async deleteIspCustomer(id) {
    return this.prisma.ispCustomer.delete({ where: { id } });
  }
}

module.exports = { ISPService };
