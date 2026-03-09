const { Body, Controller, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { PaymentsService } = require('./payments.service');
const { CreatePaymentDto } = require('./dto/create-payment.dto');
const { UpdatePaymentAllocationsDto } = require('./dto/update-payment-allocations.dto');
const { VoidPaymentDto } = require('./dto/void-payment.dto');

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
class PaymentsController {
  constructor(@Inject(PaymentsService) paymentsService) {
    this.paymentsService = paymentsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.paymentsService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.paymentsService.findAll({ ...query, currentUser: req?.user });
  }

  @Patch(':id/allocations')
  async updateAllocations(@Request() req, @Param('id') id, @Body() dto) {
    return this.paymentsService.updateAllocations(req.user.id, id, { ...dto, currentUser: req?.user });
  }

  @Post(':id/void')
  async voidPayment(@Request() req, @Param('id') id, @Body() dto) {
    return this.paymentsService.void(req.user.id, id, { ...dto, currentUser: req?.user });
  }
}

module.exports = { PaymentsController };
