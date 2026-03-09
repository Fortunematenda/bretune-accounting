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
  StreamableFile,
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { QuotesService } = require('./quotes.service');
const { CreateQuoteDto } = require('./dto/create-quote.dto');
const { UpdateQuoteDto } = require('./dto/update-quote.dto');
const { SettingsService } = require('../settings/settings.service');
const { generateQuotePdfBuffer } = require('../../common/utils/pdf-generator');

@ApiTags('Quotes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotes')
class QuotesController {
  constructor(
    @Inject(QuotesService) quotesService,
    @Inject(SettingsService) settingsService,
  ) {
    this.quotesService = quotesService;
    this.settingsService = settingsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.quotesService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.quotesService.findAll({ ...query, currentUser: req?.user });
  }

  @Get('next-number')
  async getNextNumber() {
    const quoteNumber = await this.quotesService.getNextQuoteNumber();
    return { quoteNumber };
  }

  @Post(':id/convert-to-invoice')
  async convertToInvoice(@Request() req, @Param('id') id) {
    return this.quotesService.convertToInvoice(id, req.user.id, { currentUser: req?.user });
  }

  @Post(':id/send')
  async send(@Param('id') id, @Request() req) {
    return this.quotesService.send(id, { currentUser: req?.user });
  }

  @Post(':id/accept')
  async accept(@Param('id') id, @Request() req) {
    return this.quotesService.accept(id, { currentUser: req?.user });
  }

  @Post(':id/reject')
  async reject(@Param('id') id, @Request() req) {
    return this.quotesService.reject(id, { currentUser: req?.user });
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id, @Request() req) {
    const quote = await this.quotesService.findOne(id, { currentUser: req?.user });
    const companySettings = await this.settingsService.getCompanySettings();
    const pdfRaw = await generateQuotePdfBuffer(quote, companySettings);
    const pdf = Buffer.isBuffer(pdfRaw) ? pdfRaw : Buffer.from(pdfRaw || '');

    if (!pdf || pdf.length === 0) {
      throw new InternalServerErrorException('Failed to generate quote PDF');
    }

    const fileName = `bretune-accounting-quote-${quote.quoteNumber}.pdf`;
    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: `inline; filename="${fileName}"`,
      length: pdf.length,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.quotesService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.quotesService.update(id, dto, { currentUser: req?.user });
  }
}

module.exports = { QuotesController };
