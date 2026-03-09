const { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { PayrollService } = require('./payroll.service');

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payroll')
class PayrollController {
  constructor(@Inject(PayrollService) payrollService) {
    this.payrollService = payrollService;
  }

  @Get('pay-runs')
  async listPayRuns(@Query() query) {
    return this.payrollService.findAll(query);
  }

  @Get('pay-runs/:id')
  async getPayRun(@Param('id') id) {
    return this.payrollService.findOne(id);
  }

  @Post('pay-runs')
  async createPayRun(@Body() body) {
    return this.payrollService.createPayRun(body);
  }

  @Post('pay-runs/:id/lines')
  async addLine(@Param('id') id, @Body() body) {
    return this.payrollService.addLine(id, body);
  }
}

module.exports = { PayrollController };
