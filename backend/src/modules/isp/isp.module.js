const { Module } = require('@nestjs/common');
const { ISPService } = require('./isp.service');
const { ISPController } = require('./isp.controller');

@Module({
  controllers: [ISPController],
  providers: [ISPService],
  exports: [ISPService],
})
class ISPModule {}

module.exports = { ISPModule };
