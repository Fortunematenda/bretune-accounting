const { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { FixedAssetsService } = require('./fixed-assets.service');

@ApiTags('Fixed Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fixed-assets')
class FixedAssetsController {
  constructor(@Inject(FixedAssetsService) fixedAssetsService) {
    this.fixedAssetsService = fixedAssetsService;
  }

  @Get()
  async list(@Query() query) {
    return this.fixedAssetsService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id) {
    return this.fixedAssetsService.findOne(id);
  }

  @Post()
  async create(@Body() body) {
    return this.fixedAssetsService.create(body);
  }
}

module.exports = { FixedAssetsController };
