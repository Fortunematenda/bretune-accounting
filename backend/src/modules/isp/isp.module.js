const { Module } = require('@nestjs/common');
const { ISPService } = require('./isp.service');
const { ISPController } = require('./isp.controller');
const { MikroTikService } = require('./mikrotik.service');
const { RadiusService } = require('./radius.service');
const { IspBillingService } = require('./isp-billing.service');
const { IspNotificationService } = require('./isp-notification.service');
const { AutomationModule } = require('../automation/automation.module');

@Module({
  imports: [AutomationModule],
  controllers: [ISPController],
  providers: [ISPService, MikroTikService, RadiusService, IspBillingService, IspNotificationService],
  exports: [ISPService, MikroTikService, RadiusService, IspBillingService, IspNotificationService],
})
class ISPModule {}

module.exports = { ISPModule };
