const { Body, Controller, Get, Inject, Param, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { AccountingPeriodsService } = require('./accounting-periods.service');

@ApiTags('Accounting Periods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounting-periods')
class AccountingPeriodsController {
  constructor(@Inject(AccountingPeriodsService) accountingPeriodsService) {
    this.accountingPeriodsService = accountingPeriodsService;
  }

  @Get()
  async list(@Query() query, @Request() req) {
    return this.accountingPeriodsService.findAll(query);
  }

  @Get('locked-through')
  async getLockedThrough(@Request() req) {
    const date = await this.accountingPeriodsService.getLockedThroughDate();
    return { lockedThrough: date ? date.toISOString().slice(0, 10) : null };
  }

  @Post()
  async create(@Body() body, @Request() req) {
    return this.accountingPeriodsService.create(body);
  }

  @Post(':id/close')
  async close(@Param('id') id, @Request() req) {
    return this.accountingPeriodsService.close(id, req?.user?.id);
  }

  @Post(':id/reopen')
  async reopen(@Param('id') id, @Request() req) {
    return this.accountingPeriodsService.reopen(id, req?.user?.id);
  }
}

module.exports = { AccountingPeriodsController };
