const { BadRequestException, Body, Controller, Get, Inject, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } = require('@nestjs/common');
const { FileInterceptor } = require('@nestjs/platform-express');
const { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { BankReconciliationService } = require('./bank-reconciliation.service');
const { extractLinesFromText, extractBalances } = require('../../common/utils/pdf-statement-parser');

async function parsePdfBuffer(buffer) {
  const { PDFParse } = require('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result?.text ?? '';
}

@ApiTags('Bank Reconciliation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bank-reconciliation')
class BankReconciliationController {
  constructor(@Inject(BankReconciliationService) bankReconciliationService) {
    this.bankReconciliationService = bankReconciliationService;
  }

  @Get()
  async list(@Query() query, @Request() req) {
    return this.bankReconciliationService.findAll(query);
  }

  @Get('unreconciled')
  async getUnreconciled(@Query() query, @Request() req) {
    return this.bankReconciliationService.getUnreconciledLedgerActivity(
      query.accountCode,
      query.asOf
    );
  }

  @Get(':id')
  async getOne(@Param('id') id, @Request() req) {
    return this.bankReconciliationService.findOne(id);
  }

  @Post()
  async create(@Body() body, @Request() req) {
    return this.bankReconciliationService.create(req?.user?.id, body);
  }

  @Post('import')
  async importStatement(@Body() body, @Request() req) {
    return this.bankReconciliationService.importStatement(req?.user?.id, body);
  }

  @Post('import-pdf-preview')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        statementDate: { type: 'string', description: 'Optional; year used for short dates like "02 Jan"' },
        debug: { type: 'string' },
      },
      required: ['file'],
    },
  })
  async importPdfPreview(@UploadedFile() file, @Body() body, @Request() req) {
    if (!file || !file.buffer) throw new BadRequestException('PDF file is required');
    const mimetype = (file.mimetype || '').toLowerCase();
    if (!mimetype.includes('pdf')) throw new BadRequestException('Only PDF files are accepted');
    if (file.size > 50 * 1024 * 1024) throw new BadRequestException('File size must be under 50MB');

    const text = await parsePdfBuffer(file.buffer);
    const lines = extractLinesFromText(text, body?.statementDate);
    const balances = extractBalances(text);

    const result = {
      openingBalance: balances.openingBalance != null ? balances.openingBalance : null,
      closingBalance: balances.closingBalance != null ? balances.closingBalance : null,
      lines,
    };
    if (body.debug === 'true' || body.debug === '1') {
      result._debug = { rawTextLines: text.split(/\r?\n/).slice(0, 100), totalRawLines: text.split(/\r?\n/).length };
    }
    return result;
  }

  @Post('import-pdf')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        statementDate: { type: 'string' },
        openingBalance: { type: 'string' },
        closingBalance: { type: 'string' },
        bankAccountId: { type: 'string' },
        accountCode: { type: 'string' },
      },
      required: ['file'],
    },
  })
  async importPdf(@UploadedFile() file, @Body() body, @Request() req) {
    if (!file || !file.buffer) throw new BadRequestException('PDF file is required');
    const mimetype = (file.mimetype || '').toLowerCase();
    if (!mimetype.includes('pdf')) throw new BadRequestException('Only PDF files are accepted');
    if (file.size > 50 * 1024 * 1024) throw new BadRequestException('File size must be under 50MB');

    const text = await parsePdfBuffer(file.buffer);
    const lines = extractLinesFromText(text, body?.statementDate);
    const balances = extractBalances(text);

    const openingFromPdf = balances.openingBalance != null ? String(balances.openingBalance) : null;
    const closingFromPdf = balances.closingBalance != null ? String(balances.closingBalance) : null;

    if (lines.length === 0 && !openingFromPdf && !closingFromPdf) {
      throw new BadRequestException('No transactions or balances found in PDF. Try exporting your statement as CSV for better results.');
    }

    const payload = {
      statementDate: body.statementDate || new Date().toISOString().slice(0, 10),
      openingBalance: openingFromPdf || body.openingBalance || '0',
      closingBalance: closingFromPdf || body.closingBalance || '0',
      lines,
    };
    if (body.bankAccountId) payload.bankAccountId = body.bankAccountId;
    if (body.accountCode) payload.accountCode = body.accountCode;

    return this.bankReconciliationService.importStatement(req?.user?.id, payload);
  }

  @Post(':id/lines')
  async addLines(@Param('id') id, @Body() body, @Request() req) {
    return this.bankReconciliationService.addStatementLines(id, body.lines || []);
  }

  @Post(':id/match')
  async match(@Param('id') id, @Body() body, @Request() req) {
    return this.bankReconciliationService.match(id, body);
  }

  @Post(':id/unmatch')
  async unmatch(@Param('id') id, @Body() body, @Request() req) {
    return this.bankReconciliationService.unmatch(id, body);
  }

  @Post(':id/record-payment')
  async recordPayment(@Param('id') id, @Body() body, @Request() req) {
    return this.bankReconciliationService.recordPaymentFromStatement(
      req?.user?.id,
      id,
      body,
      { currentUser: req?.user }
    );
  }

  @Post(':id/complete')
  async complete(@Param('id') id, @Request() req) {
    return this.bankReconciliationService.complete(id, req?.user?.id);
  }
}

module.exports = { BankReconciliationController };
