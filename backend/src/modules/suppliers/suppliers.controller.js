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
  Request,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { SuppliersService } = require('./suppliers.service');
const { CreateSupplierDto } = require('./dto/create-supplier.dto');
const { UpdateSupplierDto } = require('./dto/update-supplier.dto');

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
class SuppliersController {
  constructor(@Inject(SuppliersService) suppliersService) {
    this.suppliersService = suppliersService;
  }

  @Post()
  async create(@Body() dto, @Request() req) {
    return this.suppliersService.create(dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.suppliersService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.suppliersService.findOne(id, { currentUser: req?.user });
  }

  @Put(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.suppliersService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.suppliersService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { SuppliersController };
