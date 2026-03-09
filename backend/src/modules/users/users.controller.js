const {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { RolesGuard } = require('../../common/guards/roles.guard');
const { Roles } = require('../../common/decorators/roles.decorator');
const { UsersService } = require('./users.service');
const { CreateUserDto } = require('./dto/create-user.dto');
const { UpdateUserDto } = require('./dto/update-user.dto');
const { validateDto } = require('../../common/utils/validate-dto');
const UpdateUserRoleDto = require('./dto/update-user-role.dto');

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
class UsersController {
  constructor(@Inject(UsersService) usersService) {
    this.usersService = usersService;
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'ACCOUNTANT')
  async list(@Query() query, @Request() req) {
    return this.usersService.list({
      ...query,
      currentUser: req?.user,
    });
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto, @Request() req) {
    return this.usersService.create(dto, { currentUser: req?.user });
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Request() req, @Param('id') id, @Body() dto) {
    return this.usersService.update(id, dto, {
      currentUserId: req?.user?.id,
      currentUser: req?.user,
    });
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Request() req, @Param('id') id) {
    return this.usersService.remove(id, {
      currentUserId: req?.user?.id,
      currentUser: req?.user,
    });
  }

  @Put(':id/role')
  @Roles('ADMIN')
  async updateRole(@Request() req, @Param('id') id, @Body() body) {
    const dto = await validateDto(UpdateUserRoleDto, body);
    return this.usersService.updateRole(id, dto, {
      currentUserId: req?.user?.id,
      currentUser: req?.user,
    });
  }
}

module.exports = { UsersController };
