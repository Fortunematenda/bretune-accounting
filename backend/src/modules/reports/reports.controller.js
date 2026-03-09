const { Controller, Get, Inject, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ReportsService } = require('./reports.service');

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
class ReportsController {
  constructor(@Inject(ReportsService) reportsService) {
    this.reportsService = reportsService;
  }

  @Get('notifications')
  async notifications(@Request() req) {
    return this.reportsService.getNotifications({ currentUser: req?.user });
  }

  @Get('dashboard-summary')
  async dashboardSummary(@Query() query, @Request() req) {
    return this.reportsService.dashboardSummary({ ...query, currentUser: req?.user });
  }

  @Get('dashboard-summary-quick')
  async dashboardSummaryQuick(@Query() query, @Request() req) {
    return this.reportsService.dashboardSummaryQuick({ ...query, currentUser: req?.user });
  }

  @Get('outstanding-invoices')
  async outstandingInvoices(@Query() query, @Request() req) {
    return this.reportsService.outstandingInvoices({ ...query, currentUser: req?.user });
  }

  @Get('aging')
  async aging(@Query() query, @Request() req) {
    return this.reportsService.aging({ ...query, currentUser: req?.user });
  }

  @Get('monthly-revenue')
  async monthlyRevenue(@Query() query, @Request() req) {
    return this.reportsService.monthlyRevenue({ ...query, currentUser: req?.user });
  }

  @Get('trial-balance')
  async trialBalance(@Query() query, @Request() req) {
    return this.reportsService.trialBalance({ ...query, currentUser: req?.user });
  }

  @Get('balance-sheet')
  async balanceSheet(@Query() query, @Request() req) {
    return this.reportsService.balanceSheet({ ...query, currentUser: req?.user });
  }

  @Get('profit-loss')
  async profitLoss(@Query() query, @Request() req) {
    return this.reportsService.profitLoss({ ...query, currentUser: req?.user });
  }
}

module.exports = { ReportsController };
