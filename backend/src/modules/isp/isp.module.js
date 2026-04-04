const { Module } = require('@nestjs/common');
const { ISPService } = require('./isp.service');
const { ISPController } = require('./isp.controller');
const { MikroTikService } = require('./mikrotik.service');
const { IspBillingService } = require('./isp-billing.service');

@Module({
  controllers: [ISPController],
  providers: [ISPService, MikroTikService, IspBillingService],
  exports: [ISPService, MikroTikService, IspBillingService],
})
class ISPModule {}

module.exports = { ISPModule };
