const { Body, Controller, Get, Inject, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { CurrenciesService } = require('./currencies.service');

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('currencies')
class CurrenciesController {
  constructor(@Inject(CurrenciesService) currenciesService) {
    this.currenciesService = currenciesService;
  }

  @Get()
  async list() {
    return this.currenciesService.findAll();
  }

  @Get('rates')
  async listRates(@Query() query) {
    return this.currenciesService.listRates(query);
  }

  @Get('rates/history')
  async getRateHistory(@Query() query) {
    const { from, to, fromDate, toDate } = query;
    const toCodes = to ? to.split(',').map((s) => s.trim()).filter(Boolean) : [];
    return this.currenciesService.getRateHistory({
      fromCode: from,
      toCodes,
      fromDate,
      toDate,
    });
  }

  @Get('rates/lookup')
  async getRate(@Query() query) {
    const { from, to, asOf, live } = query;
    if (!from || !to) {
      return { rate: '1' };
    }
    try {
      // Use live Frankfurter API for converter to guarantee correct rates
      const rate = live === 'true' || live === '1'
        ? await this.currenciesService.getLiveRate(from, to)
        : await this.currenciesService.getExchangeRate(from, to, asOf);
      return { rate: String(rate) };
    } catch (err) {
      return { rate: null, error: err.message || 'Rate not found' };
    }
  }

  @Post('rates')
  async setRate(@Body() body, @Request() req) {
    return this.currenciesService.setExchangeRate(req?.user?.id || null, body);
  }

  @Post('rates/sync')
  async syncRates() {
    return this.currenciesService.syncRatesFromOnlineApi();
  }
}

module.exports = { CurrenciesController };
