const { Module } = require('@nestjs/common');
const { PermissionsController } = require('./permissions.controller');
const { PermissionsService } = require('./permissions.service');

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
class PermissionsModule {}

module.exports = { PermissionsModule };
