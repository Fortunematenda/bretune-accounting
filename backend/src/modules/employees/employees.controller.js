const {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { EmployeesService } = require('./employees.service');
const { CreateEmployeeDto } = require('./dto/create-employee.dto');
const { UpdateEmployeeDto } = require('./dto/update-employee.dto');

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employees')
class EmployeesController {
  constructor(@Inject(EmployeesService) employeesService) {
    this.employeesService = employeesService;
  }

  @Post()
  async create(@Body() dto) {
    return this.employeesService.create(dto);
  }

  @Get()
  async findAll(@Query() query) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto) {
    return this.employeesService.update(id, dto);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id) {
    return this.employeesService.update(id, { isActive: false });
  }

  @Patch(':id/activate')
  async activate(@Param('id') id) {
    return this.employeesService.update(id, { isActive: true });
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    return this.employeesService.remove(id);
  }
}

module.exports = { EmployeesController };
