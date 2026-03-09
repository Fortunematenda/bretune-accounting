const { Controller, Get, Inject, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { PermissionGuard } = require('../../common/guards/permission.guard');
const { Permission } = require('../../common/decorators/permission.decorator');
const { PermissionsService } = require('./permissions.service');

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard)
class PermissionsController {
  constructor(@Inject(PermissionsService) permissionsService) {
    this.permissionsService = permissionsService;
  }

  @Get()
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async list() {
    return this.permissionsService.list();
  }
}

module.exports = { PermissionsController };
