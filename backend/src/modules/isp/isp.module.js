const { Module } = require('@nestjs/common');
const { ISPService } = require('./isp.service');
const { ISPController } = require('./isp.controller');
const { MikroTikService } = require('./mikrotik.service');
const { IspBillingService } = require('./isp-billing.service');
const { IspNotificationService } = require('./isp-notification.service');
const { AutomationModule } = require('../automation/automation.module');

@Module({
  imports: [AutomationModule],
  controllers: [ISPController],
  providers: [ISPService, MikroTikService, IspBillingService, IspNotificationService],
  exports: [ISPService, MikroTikService, IspBillingService, IspNotificationService],
})
class ISPModule {}

module.exports = { ISPModule };
