const { Module } = require('@nestjs/common');
const { RolesController } = require('./roles.controller');
const { RolesService } = require('./roles.service');

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
class RolesModule {}

module.exports = { RolesModule };
