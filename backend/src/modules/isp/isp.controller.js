const { Controller, Get, Post, Put, Delete, Inject, Query, Param, Body, UseGuards, Req } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ISPService } = require('./isp.service');
const { MikroTikService } = require('./mikrotik.service');

@ApiTags('ISP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('isp')
class ISPController {
  constructor(@Inject(ISPService) ispService, @Inject(MikroTikService) mikroTikService) {
    this.ispService = ispService;
    this.mikroTik = mikroTikService;
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

  @Delete('customers/:id')
  async deleteIspCustomer(@Param('id') id) {
    return this.ispService.deleteIspCustomer(id);
  }

  // ── MikroTik Router Live Data ──────────────────

  @Get('router/dashboard')
  async routerDashboard() {
    return this.mikroTik.getRouterDashboard();
  }

  @Get('router/system')
  async routerSystem() {
    return this.mikroTik.getSystemResource();
  }

  @Get('router/active')
  async routerActiveConnections() {
    return this.mikroTik.getActiveConnections();
  }

  @Get('router/secrets')
  async routerSecrets() {
    return this.mikroTik.getSecrets();
  }

  @Get('router/secrets/:username')
  async routerSecret(@Param('username') username) {
    return this.mikroTik.getSecret(username);
  }

  @Post('router/secrets')
  async routerCreateSecret(@Body() body) {
    return this.mikroTik.createSecret({
      name: body.name,
      password: body.password,
      profile: body.profile,
      service: body.service || 'pppoe',
      comment: body.comment || '',
    });
  }

  @Put('router/secrets/:id')
  async routerUpdateSecret(@Param('id') id, @Body() body) {
    return this.mikroTik.updateSecret(id, body);
  }

  @Delete('router/secrets/:id')
  async routerDeleteSecret(@Param('id') id) {
    return this.mikroTik.deleteSecret(id);
  }

  @Get('router/profiles')
  async routerProfiles() {
    return this.mikroTik.getProfiles();
  }

  @Get('router/interfaces')
  async routerInterfaces() {
    return this.mikroTik.getInterfaces();
  }

  @Get('router/interfaces/:name/traffic')
  async routerInterfaceTraffic(@Param('name') name) {
    return this.mikroTik.getInterfaceTraffic(name);
  }

  @Get('router/queues')
  async routerQueues() {
    return this.mikroTik.getQueues();
  }

  @Get('router/logs')
  async routerLogs(@Query() query) {
    return this.mikroTik.getLogs(query.limit ? Number(query.limit) : 50);
  }

  @Get('router/bandwidth')
  async routerBandwidth() {
    return this.mikroTik.getAllBandwidth();
  }

  @Get('router/traffic/:username')
  async routerUserTraffic(@Param('username') username) {
    return this.mikroTik.getLiveTrafficForUser(username);
  }

  @Post('router/disconnect/:username')
  async routerDisconnect(@Param('username') username) {
    return this.mikroTik.disconnectByUsername(username);
  }

  @Post('router/disable/:username')
  async routerDisable(@Param('username') username) {
    return this.mikroTik.disableSecret(username);
  }

  @Post('router/enable/:username')
  async routerEnable(@Param('username') username) {
    return this.mikroTik.enableSecret(username);
  }
}

module.exports = { ISPController };
