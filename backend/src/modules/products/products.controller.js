const { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ProductsService } = require('./products.service');

@ApiTags('Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['items', 'products'])
class ProductsController {
  constructor(@Inject(ProductsService) productsService) {
    this.productsService = productsService;
  }

  @Post()
  async create(@Body() dto, @Request() req) {
    return this.productsService.create(dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.productsService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.productsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.productsService.update(id, dto, { currentUser: req?.user });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id, @Request() req) {
    return this.productsService.deactivate(id, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.productsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { ProductsController };
