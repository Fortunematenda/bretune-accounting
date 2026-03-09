const {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { PermissionGuard } = require('../../common/guards/permission.guard');
const { Permission } = require('../../common/decorators/permission.decorator');
const { RolesService } = require('./roles.service');
const { validateDto } = require('../../common/utils/validate-dto');
const CreateRoleDto = require('./dto/create-role.dto');
const UpdateRoleDto = require('./dto/update-role.dto');
const UpdateRolePermissionsDto = require('./dto/update-role-permissions.dto');

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
class RolesController {
  constructor(@Inject(RolesService) rolesService) {
    this.rolesService = rolesService;
  }

  @Get()
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async list(@Query() query) {
    return this.rolesService.list(query);
  }

  @Get(':id')
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async getById(@Param('id') id) {
    return this.rolesService.getById(id);
  }

  @Post()
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async create(@Body() body) {
    const dto = await validateDto(CreateRoleDto, body);
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async update(@Param('id') id, @Body() body) {
    const dto = await validateDto(UpdateRoleDto, body);
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async remove(@Param('id') id) {
    return this.rolesService.remove(id);
  }

  @Put(':id/permissions')
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async updatePermissions(@Param('id') id, @Body() body) {
    const dto = await validateDto(UpdateRolePermissionsDto, body);
    return this.rolesService.update(id, { permissionIds: dto.permissionIds });
  }

  @Post(':id/duplicate')
  @Permission('roles.manage')
  @UseGuards(PermissionGuard)
  async duplicate(@Param('id') id) {
    return this.rolesService.duplicate(id);
  }
}

module.exports = { RolesController };
