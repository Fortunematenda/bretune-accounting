const {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { InvoicesService } = require('./invoices.service');
const { SettingsService } = require('../settings/settings.service');
const { generateInvoicePdfBuffer } = require('../../common/utils/pdf-generator');

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
class InvoicesController {
  constructor(
    @Inject(InvoicesService) invoicesService,
    @Inject(SettingsService) settingsService,
  ) {
    this.invoicesService = invoicesService;
    this.settingsService = settingsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.invoicesService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.invoicesService.findAll({ ...query, currentUser: req?.user });
  }

  @Get('next-number')
  async getNextNumber() {
    const invoiceNumber = await this.invoicesService.getNextInvoiceNumber();
    return { invoiceNumber };
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id, @Request() req, @Res() res) {
    const invoice = await this.invoicesService.findOne(id, { currentUser: req?.user });
    const companySettings = await this.settingsService.getCompanySettings();
    const pdfRaw = await generateInvoicePdfBuffer(invoice, companySettings);
    const pdf = Buffer.isBuffer(pdfRaw) ? pdfRaw : Buffer.from(pdfRaw || '');

    if (!pdf || pdf.length === 0) {
      throw new InternalServerErrorException('Failed to generate invoice PDF');
    }

    const fileName = `bretune-accounting-invoice-${invoice.invoiceNumber}.pdf`;
    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', pdf.length);
    res.send(pdf);
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.invoicesService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.invoicesService.update(id, dto, { currentUser: req?.user });
  }

  @Post(':id/send')
  async send(@Param('id') id, @Request() req) {
    return this.invoicesService.send(id, { currentUser: req?.user });
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id, @Request() req) {
    return this.invoicesService.cancel(id, { currentUser: req?.user });
  }

  @Post(':id/recalculate')
  async recalculate(@Param('id') id, @Request() req) {
    return this.invoicesService.recalculate(id, { currentUser: req?.user });
  }

  @Post('jobs/mark-overdue')
  async markOverdue(@Request() req) {
    return this.invoicesService.markOverdue({ currentUser: req?.user });
  }
}

module.exports = { InvoicesController };
