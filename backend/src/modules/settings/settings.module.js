const { Module } = require('@nestjs/common');
const { SettingsController } = require('./settings.controller');
const { SettingsService } = require('./settings.service');

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
class SettingsModule {}

module.exports = { SettingsModule };
