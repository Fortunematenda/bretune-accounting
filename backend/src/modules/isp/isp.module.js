const { Module } = require('@nestjs/common');
const { ISPService } = require('./isp.service');
const { ISPController } = require('./isp.controller');
const { MikroTikService } = require('./mikrotik.service');

@Module({
  controllers: [ISPController],
  providers: [ISPService, MikroTikService],
  exports: [ISPService, MikroTikService],
})
class ISPModule {}

module.exports = { ISPModule };
