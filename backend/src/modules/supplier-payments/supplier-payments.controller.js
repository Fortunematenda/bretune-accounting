const {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { SupplierPaymentsService } = require('./supplier-payments.service');
const { CreateSupplierPaymentDto } = require('./dto/create-supplier-payment.dto');
const { UpdateSupplierPaymentAllocationsDto } = require('./dto/update-supplier-payment-allocations.dto');
const { VoidSupplierPaymentDto } = require('./dto/void-supplier-payment.dto');

@ApiTags('SupplierPayments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('supplier-payments')
class SupplierPaymentsController {
  constructor(@Inject(SupplierPaymentsService) supplierPaymentsService) {
    this.supplierPaymentsService = supplierPaymentsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.supplierPaymentsService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.supplierPaymentsService.findAll(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.supplierPaymentsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id/allocations')
  async updateAllocations(@Request() req, @Param('id') id, @Body() dto) {
    return this.supplierPaymentsService.updateAllocations(req.user.id, id, dto, { currentUser: req?.user });
  }

  @Post(':id/void')
  async voidPayment(@Request() req, @Param('id') id, @Body() dto) {
    return this.supplierPaymentsService.void(req.user.id, id, dto || {}, { currentUser: req?.user });
  }
}

module.exports = { SupplierPaymentsController };
