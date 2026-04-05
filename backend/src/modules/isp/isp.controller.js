const { Controller, Get, Post, Put, Delete, Inject, Query, Param, Body, UseGuards, Req, Optional } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ISPService } = require('./isp.service');
const { MikroTikService } = require('./mikrotik.service');
const { RadiusService } = require('./radius.service');
const { IspBillingService } = require('./isp-billing.service');
const { IspNotificationService } = require('./isp-notification.service');

@ApiTags('ISP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('isp')
class ISPController {
  constructor(
    @Inject(ISPService) ispService,
    @Inject(MikroTikService) mikroTikService,
    @Inject(RadiusService) radiusService,
    @Inject(IspBillingService) billingService,
    @Optional() @Inject(IspNotificationService) notificationService = null,
  ) {
    this.ispService = ispService;
    this.mikroTik = mikroTikService;
    this.radius = radiusService;
    this.billing = billingService;
    this.notifications = notificationService;
  }

  // ── Dashboard ────────────────────────────────

  @Get('dashboard')
  async dashboard(@Req() req) {
    return this.ispService.getDashboardSummary(req.user?.companyName || null);
  }

  // ── Devices ──────────────────────────────────

  @Get('devices')
  async listDevices(@Req() req, @Query() query) {
    return this.ispService.listDevices(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
      type: query.type || undefined,
      status: query.status || undefined,
    });
  }

  @Get('devices/:id')
  async getDevice(@Param('id') id) {
    return this.ispService.getDevice(id);
  }

  @Post('devices')
  async createDevice(@Req() req, @Body() body) {
    return this.ispService.createDevice({
      name: body.name,
      type: body.type,
      status: body.status || 'OFFLINE',
      ipAddress: body.ipAddress || null,
      macAddress: body.macAddress || null,
      location: body.location || null,
      model: body.model || null,
      serialNumber: body.serialNumber || null,
      firmwareVersion: body.firmwareVersion || null,
      parentDeviceId: body.parentDeviceId || null,
      snmpCommunity: body.snmpCommunity || null,
      managementUrl: body.managementUrl || null,
      notes: body.notes || null,
      ownerCompanyName: req.user?.companyName || null,
    });
  }

  @Put('devices/:id')
  async updateDevice(@Param('id') id, @Body() body) {
    const data = {};
    const fields = ['name', 'type', 'status', 'ipAddress', 'macAddress', 'location', 'model',
      'serialNumber', 'firmwareVersion', 'parentDeviceId', 'snmpCommunity', 'managementUrl',
      'uptimeSeconds', 'cpuPercent', 'memoryPercent', 'lastSeenAt', 'notes'];
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    return this.ispService.updateDevice(id, data);
  }

  @Delete('devices/:id')
  async deleteDevice(@Param('id') id) {
    return this.ispService.deleteDevice(id);
  }

  // ── Service Plans ────────────────────────────

  @Get('plans')
  async listPlans(@Req() req, @Query() query) {
    return this.ispService.listPlans(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
    });
  }

  @Post('plans')
  async createPlan(@Req() req, @Body() body) {
    return this.ispService.createPlan({
      name: body.name,
      description: body.description || null,
      downloadSpeed: body.downloadSpeed,
      uploadSpeed: body.uploadSpeed,
      monthlyPrice: body.monthlyPrice,
      dataCapGb: body.dataCapGb || null,
      isActive: body.isActive !== false,
      ownerCompanyName: req.user?.companyName || null,
    });
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id, @Body() body) {
    const data = {};
    const fields = ['name', 'description', 'downloadSpeed', 'uploadSpeed', 'monthlyPrice', 'dataCapGb', 'isActive'];
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    return this.ispService.updatePlan(id, data);
  }

  @Delete('plans/:id')
  async deletePlan(@Param('id') id) {
    return this.ispService.deletePlan(id);
  }

  // ── Client Network Links ─────────────────────

  @Get('client-links')
  async listClientLinks(@Req() req, @Query() query) {
    return this.ispService.listClientLinks(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
      clientId: query.clientId || undefined,
      serviceStatus: query.serviceStatus || undefined,
    });
  }

  @Post('client-links')
  async createClientLink(@Req() req, @Body() body) {
    return this.ispService.createClientLink({
      clientId: body.clientId,
      deviceId: body.deviceId || null,
      servicePlanId: body.servicePlanId || null,
      serviceStatus: body.serviceStatus || 'PENDING',
      ipAddress: body.ipAddress || null,
      macAddress: body.macAddress || null,
      pppoeUsername: body.pppoeUsername || null,
      installationDate: body.installationDate ? new Date(body.installationDate) : null,
      billingDay: body.billingDay || 1,
      autoBilling: body.autoBilling !== false,
      notes: body.notes || null,
      ownerCompanyName: req.user?.companyName || null,
    });
  }

  @Put('client-links/:id')
  async updateClientLink(@Param('id') id, @Body() body) {
    const data = {};
    const fields = ['deviceId', 'servicePlanId', 'serviceStatus', 'ipAddress', 'macAddress',
      'pppoeUsername', 'billingDay', 'autoBilling', 'notes'];
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    if (body.installationDate !== undefined) data.installationDate = body.installationDate ? new Date(body.installationDate) : null;
    return this.ispService.updateClientLink(id, data);
  }

  @Put('client-links/:id/suspend')
  async suspendClient(@Param('id') id, @Body() body) {
    return this.ispService.suspendClient(id, body.reason);
  }

  @Put('client-links/:id/reactivate')
  async reactivateClient(@Param('id') id) {
    return this.ispService.reactivateClient(id);
  }

  @Put('client-links/:id/terminate')
  async terminateClient(@Param('id') id) {
    return this.ispService.terminateClient(id);
  }

  // ── Alerts ───────────────────────────────────

  @Get('alerts')
  async listAlerts(@Req() req, @Query() query) {
    return this.ispService.listAlerts(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
      severity: query.severity || undefined,
      isResolved: query.isResolved,
    });
  }

  @Put('alerts/:id/resolve')
  async resolveAlert(@Req() req, @Param('id') id) {
    return this.ispService.resolveAlert(id, req.user?.id || req.user?.userId);
  }

  // ── Billing Helpers ──────────────────────────

  @Get('billing/due')
  async clientsDueBilling(@Req() req) {
    return this.ispService.getClientsDueBilling(req.user?.companyName || null);
  }

  @Get('billing/auto-suspend')
  async clientsForAutoSuspension(@Req() req, @Query() query) {
    return this.ispService.getClientsForAutoSuspension(req.user?.companyName || null, {
      overdueDays: query.overdueDays ? Number(query.overdueDays) : 30,
    });
  }

  // ── ISP Customers (Splynx-style profiles) ──────

  @Get('customers')
  async listIspCustomers(@Req() req, @Query() query) {
    return this.ispService.listIspCustomers(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 100,
      status: query.status || undefined,
      search: query.search || undefined,
    });
  }

  @Get('customers/by-username/:username')
  async getIspCustomerByUsername(@Param('username') username) {
    return this.ispService.getIspCustomerByUsername(username);
  }

  @Get('customers/:id')
  async getIspCustomer(@Param('id') id) {
    return this.ispService.getIspCustomer(id);
  }

  @Post('customers')
  async createIspCustomer(@Req() req, @Body() body) {
    const fields = ['pppoeUsername', 'firstName', 'lastName', 'companyName', 'email', 'billingEmail',
      'phone', 'street', 'city', 'zipCode', 'province', 'country', 'geoLat', 'geoLng',
      'status', 'category', 'billingType', 'partner', 'location', 'vatId', 'paymentNote',
      'paymentDate', 'debitOrder', 'wifiSsid', 'wifiPassword', 'contactPerson', 'notes'];
    const data = { ownerCompanyName: req.user?.companyName || null };
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    return this.ispService.createIspCustomer(data);
  }

  @Put('customers/:id')
  async updateIspCustomer(@Param('id') id, @Body() body) {
    const fields = ['firstName', 'lastName', 'companyName', 'email', 'billingEmail',
      'phone', 'street', 'city', 'zipCode', 'province', 'country', 'geoLat', 'geoLng',
      'status', 'category', 'billingType', 'partner', 'location', 'vatId', 'paymentNote',
      'paymentDate', 'debitOrder', 'wifiSsid', 'wifiPassword', 'contactPerson', 'notes'];
    const data = {};
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    return this.ispService.updateIspCustomer(id, data);
  }

  @Put('customers/by-username/:username')
  async upsertIspCustomerByUsername(@Param('username') username, @Req() req, @Body() body) {
    const fields = ['firstName', 'lastName', 'companyName', 'email', 'billingEmail',
      'phone', 'street', 'city', 'zipCode', 'province', 'country', 'geoLat', 'geoLng',
      'status', 'category', 'billingType', 'partner', 'location', 'vatId', 'paymentNote',
      'paymentDate', 'debitOrder', 'wifiSsid', 'wifiPassword', 'contactPerson', 'notes'];
    const data = { ownerCompanyName: req.user?.companyName || null };
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    return this.ispService.updateIspCustomerByUsername(username, data);
  }

  @Post('customers/:id/convert')
  async convertLeadToCustomer(@Param('id') id, @Body() body) {
    return this.ispService.convertLeadToCustomer(id, {
      pppoePassword: body.pppoePassword,
      profile: body.profile,
    });
  }

  @Delete('customers/:id')
  async deleteIspCustomer(@Param('id') id) {
    return this.ispService.deleteIspCustomer(id);
  }

  // ── MikroTik Router Live Data ──────────────────
  // All router endpoints wrapped with try-catch so the app
  // returns a graceful { offline: true } instead of 500 errors.

  _routerOffline(err) {
    return { offline: true, error: 'Router unreachable', message: err?.message || 'Connection failed' };
  }

  @Get('router/dashboard')
  async routerDashboard() {
    try {
      const result = await this.mikroTik.getRouterDashboard();
      // If MikroTik returned offline/empty, fall back to RADIUS DB
      if (!result.connected && this.radius) {
        const radiusData = await this.radius.getRadiusDashboard();
        return radiusData;
      }
      return result;
    } catch (err) {
      // Router unreachable — serve clients from RADIUS database
      try {
        if (this.radius) return await this.radius.getRadiusDashboard();
      } catch (e) { this.logger.error?.(`RADIUS fallback failed: ${e.message}`); }
      return this._routerOffline(err);
    }
  }

  @Get('router/system')
  async routerSystem() {
    try { return await this.mikroTik.getSystemResource(); }
    catch (err) { return this._routerOffline(err); }
  }

  @Get('router/active')
  async routerActiveConnections() {
    try { return await this.mikroTik.getActiveConnections(); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/secrets')
  async routerSecrets() {
    try { return await this.mikroTik.getSecrets(); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/secrets/:username')
  async routerSecret(@Param('username') username) {
    try { return await this.mikroTik.getSecret(username); }
    catch (err) { return this._routerOffline(err); }
  }

  @Post('router/secrets')
  async routerCreateSecret(@Body() body) {
    try {
      return await this.mikroTik.createSecret({
        name: body.name,
        password: body.password,
        profile: body.profile,
        service: body.service || 'pppoe',
        comment: body.comment || '',
      });
    } catch (err) { return this._routerOffline(err); }
  }

  @Put('router/secrets/:id')
  async routerUpdateSecret(@Param('id') id, @Body() body) {
    try { return await this.mikroTik.updateSecret(id, body); }
    catch (err) { return this._routerOffline(err); }
  }

  @Delete('router/secrets/:id')
  async routerDeleteSecret(@Param('id') id) {
    try { return await this.mikroTik.deleteSecret(id); }
    catch (err) { return this._routerOffline(err); }
  }

  @Get('router/profiles')
  async routerProfiles() {
    try { return await this.mikroTik.getProfiles(); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/interfaces')
  async routerInterfaces() {
    try { return await this.mikroTik.getInterfaces(); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/interfaces/:name/traffic')
  async routerInterfaceTraffic(@Param('name') name) {
    try { return await this.mikroTik.getInterfaceTraffic(name); }
    catch (err) { return this._routerOffline(err); }
  }

  @Get('router/queues')
  async routerQueues() {
    try { return await this.mikroTik.getQueues(); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/logs')
  async routerLogs(@Query() query) {
    try { return await this.mikroTik.getLogs(query.limit ? Number(query.limit) : 50); }
    catch (err) { return { offline: true, error: 'Router unreachable', items: [] }; }
  }

  @Get('router/bandwidth')
  async routerBandwidth() {
    try { return await this.mikroTik.getAllBandwidth(); }
    catch (err) { return this._routerOffline(err); }
  }

  @Get('router/traffic/:username')
  async routerUserTraffic(@Param('username') username) {
    try { return await this.mikroTik.getLiveTrafficForUser(username); }
    catch (err) { return this._routerOffline(err); }
  }

  @Post('router/disconnect/:username')
  async routerDisconnect(@Param('username') username) {
    try { return await this.mikroTik.disconnectByUsername(username); }
    catch (err) { return this._routerOffline(err); }
  }

  @Post('router/disable/:username')
  async routerDisable(@Param('username') username) {
    try { return await this.mikroTik.disableSecret(username); }
    catch (err) { return this._routerOffline(err); }
  }

  @Post('router/enable/:username')
  async routerEnable(@Param('username') username) {
    try { return await this.mikroTik.enableSecret(username); }
    catch (err) { return this._routerOffline(err); }
  }

  // ── Billing Settings ──────────────────────────

  @Get('billing/settings')
  async billingSettings() {
    return this.billing.getSettings();
  }

  @Put('billing/settings')
  async updateBillingSettings(@Body() body) {
    return this.billing.updateSettings(body);
  }

  // ── Billing Dashboard ─────────────────────────

  @Get('billing/dashboard')
  async billingDashboard() {
    return this.billing.getDashboardStats();
  }

  // ── Invoices ──────────────────────────────────

  @Get('billing/invoices')
  async listInvoices(@Query() query) {
    return this.billing.listInvoices({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
      status: query.status || undefined,
      customerId: query.customerId || undefined,
      search: query.search || undefined,
    });
  }

  @Get('billing/invoices/:id')
  async getInvoice(@Param('id') id) {
    return this.billing.getInvoice(id);
  }

  @Post('billing/invoices')
  async createInvoice(@Body() body) {
    return this.billing.createInvoice(body);
  }

  @Put('billing/invoices/:id/status')
  async updateInvoiceStatus(@Param('id') id, @Body() body) {
    return this.billing.updateInvoiceStatus(id, body.status);
  }

  @Delete('billing/invoices/:id')
  async deleteInvoice(@Param('id') id) {
    return this.billing.deleteInvoice(id);
  }

  // ── Payments ──────────────────────────────────

  @Get('billing/payments')
  async listPayments(@Query() query) {
    return this.billing.listPayments({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
      invoiceId: query.invoiceId || undefined,
    });
  }

  @Post('billing/payments')
  async recordPayment(@Body() body) {
    return this.billing.recordPayment(body);
  }

  // ── Customer Billing ──────────────────────────

  @Get('billing/customer/:customerId')
  async customerBilling(@Param('customerId') customerId) {
    return this.billing.getCustomerBillingSummary(customerId);
  }

  // ── Auto-generate & Overdue ───────────────────

  @Post('billing/generate-monthly')
  async generateMonthly(@Body() body) {
    return this.billing.generateMonthlyInvoices(body.servicePlans || {});
  }

  @Post('billing/mark-overdue')
  async markOverdue() {
    return this.billing.markOverdueInvoices();
  }

  // ── Suspension ────────────────────────────────

  @Get('billing/suspension-summary')
  async suspensionSummary() {
    return this.billing.getSuspensionSummary();
  }

  @Post('billing/auto-suspend')
  async autoSuspend() {
    return this.billing.autoSuspendOverdueClients();
  }

  @Post('billing/suspend/:customerId')
  async suspendClient(@Param('customerId') customerId) {
    return this.billing.suspendClient(customerId);
  }

  @Post('billing/unsuspend/:customerId')
  async unsuspendClient(@Param('customerId') customerId) {
    return this.billing.unsuspendClient(customerId);
  }

  // ── Notifications ──────────────────────────────

  @Get('notifications/log')
  async notificationLog(@Req() req, @Query() query) {
    if (!this.notifications) return { items: [], total: 0 };
    return this.notifications.getNotificationLog(req.user?.companyName || null, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
      type: query.type || undefined,
      channel: query.channel || undefined,
      customerId: query.customerId || undefined,
    });
  }

  @Get('notifications/stats')
  async notificationStats(@Req() req) {
    if (!this.notifications) return { total: 0, sentToday: 0, sentThisMonth: 0, failed: 0 };
    return this.notifications.getNotificationStats(req.user?.companyName || null);
  }

  @Post('notifications/test')
  async sendTestNotification(@Req() req, @Body() body) {
    if (!this.notifications) return { error: 'Notification service not available' };
    const customer = await this.ispService.getIspCustomer(body.customerId);
    return this.notifications.notify(customer, 'INVOICE_CREATED', {
      subject: 'Test Notification from Bretune ISP',
      html: '<h2>Test Notification</h2><p>This is a test notification from your ISP billing system. If you received this, notifications are working correctly!</p>',
      smsMessage: 'Test notification from Bretune ISP. Notifications are working correctly!',
    });
  }

  // ── RADIUS ───────────────────────────────────────

  @Get('radius/nas')
  async listNas() {
    return this.radius.listNas();
  }

  @Post('radius/nas')
  async addNas(@Body() body) {
    return this.radius.addNas({
      nasname: body.nasname,
      shortname: body.shortname || body.nasname,
      secret: body.secret,
      type: body.type || 'mikrotik',
      description: body.description || '',
    });
  }

  @Put('radius/nas/:id')
  async updateNas(@Param('id') id, @Body() body) {
    return this.radius.updateNas(Number(id), body);
  }

  @Delete('radius/nas/:id')
  async deleteNas(@Param('id') id) {
    return this.radius.deleteNas(Number(id));
  }

  @Get('radius/sessions')
  async radiusActiveSessions() {
    return this.radius.getActiveSessions();
  }

  @Get('radius/sessions/:username')
  async radiusUserSessions(@Param('username') username, @Query() query) {
    return this.radius.getUserSessions(username, { limit: query.limit ? Number(query.limit) : 50 });
  }

  @Get('radius/usage/:username')
  async radiusUserUsage(@Param('username') username, @Query() query) {
    return this.radius.getUserUsage(username, {
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get('radius/usage-summary')
  async radiusUsageSummary(@Query() query) {
    return this.radius.getUsageSummary({
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get('radius/auth-logs')
  async radiusAuthLogs(@Query() query) {
    return this.radius.getAuthLogs({
      limit: query.limit ? Number(query.limit) : 100,
      username: query.username || undefined,
    });
  }

  @Post('radius/provision/:username')
  async radiusProvision(@Param('username') username, @Body() body) {
    await this.radius.provisionUser(username, body.password, body.planGroup, {
      staticIp: body.staticIp,
    });
    return { success: true, message: `User ${username} provisioned in RADIUS` };
  }

  @Post('radius/suspend/:username')
  async radiusSuspend(@Param('username') username) {
    await this.radius.suspendUser(username);
    return { success: true, message: `User ${username} suspended in RADIUS` };
  }

  @Post('radius/reactivate/:username')
  async radiusReactivate(@Param('username') username) {
    await this.radius.reactivateUser(username);
    return { success: true, message: `User ${username} reactivated in RADIUS` };
  }

  @Post('radius/change-plan/:username')
  async radiusChangePlan(@Param('username') username, @Body() body) {
    await this.radius.changeUserPlan(username, body.planGroup);
    return { success: true, message: `User ${username} plan changed to ${body.planGroup}` };
  }

  @Post('radius/change-password/:username')
  async radiusChangePassword(@Param('username') username, @Body() body) {
    await this.radius.changeUserPassword(username, body.password);
    return { success: true, message: `Password changed for ${username}` };
  }

  @Delete('radius/deprovision/:username')
  async radiusDeprovision(@Param('username') username) {
    await this.radius.deprovisionUser(username);
    return { success: true, message: `User ${username} deprovisioned from RADIUS` };
  }

  @Post('radius/plan-group')
  async radiusCreatePlanGroup(@Body() body) {
    await this.radius.createPlanGroup(body.planName, {
      downloadKbps: body.downloadKbps,
      uploadKbps: body.uploadKbps,
      burstDownKbps: body.burstDownKbps,
      burstUpKbps: body.burstUpKbps,
      burstThresholdDown: body.burstThresholdDown,
      burstThresholdUp: body.burstThresholdUp,
      burstTime: body.burstTime,
    });
    return { success: true, message: `Plan group ${body.planName} created` };
  }
}

module.exports = { ISPController };
