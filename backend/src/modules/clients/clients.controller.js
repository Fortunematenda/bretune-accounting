const { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ClientsService } = require('./clients.service');
const { CreateClientDto } = require('./dto/create-client.dto');
const { UpdateClientDto } = require('./dto/update-client.dto');

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
class ClientsController {
  constructor(@Inject(ClientsService) clientsService) {
    this.clientsService = clientsService;
  }

  @Post()
  async create(@Body() dto, @Request() req) {
    return this.clientsService.create(dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.clientsService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.clientsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.clientsService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.clientsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { ClientsController };
