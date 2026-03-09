const { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { LedgerService } = require('./ledger.service');

@ApiTags('Ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ledger')
class LedgerController {
  constructor(@Inject(LedgerService) ledgerService) {
    this.ledgerService = ledgerService;
  }

  @Get('accounts')
  async listAccounts(@Query() query, @Request() req) {
    return this.ledgerService.findAllAccounts({ ...query, currentUser: req?.user });
  }

  @Get('accounts/:id')
  async getAccount(@Param('id') id, @Request() req) {
    return this.ledgerService.findOneAccount(id, { currentUser: req?.user });
  }

  @Post('accounts')
  async createAccount(@Body() body, @Request() req) {
    return this.ledgerService.createAccount(req?.user?.id, body, { currentUser: req?.user });
  }

  @Patch('accounts/:id')
  async updateAccount(@Param('id') id, @Body() body, @Request() req) {
    return this.ledgerService.updateAccount(id, body, { currentUser: req?.user });
  }

  @Delete('accounts/:id')
  async deleteAccount(@Param('id') id, @Request() req) {
    return this.ledgerService.deleteAccount(id, { currentUser: req?.user });
  }

  @Get('journal-entries')
  async listJournalEntries(@Query() query, @Request() req) {
    return this.ledgerService.findAllEntries({ ...query, currentUser: req?.user });
  }

  @Get('journal-entries/:id')
  async getJournalEntry(@Param('id') id, @Request() req) {
    return this.ledgerService.findOneEntry(id, { currentUser: req?.user });
  }

  @Post('journal-entries')
  async createJournalEntry(@Body() body, @Request() req) {
    return this.ledgerService.createManualEntry(req?.user?.id, body, { currentUser: req?.user });
  }

  @Post('journal-entries/:id/approve')
  async approveJournalEntry(@Param('id') id, @Request() req) {
    return this.ledgerService.approveEntry(id, req?.user?.id);
  }

  @Post('journal-entries/:id/reverse')
  async reverseJournalEntry(@Param('id') id, @Body() body, @Request() req) {
    return this.ledgerService.reverseEntryById(id, req?.user?.id, body, { currentUser: req?.user });
  }
}

module.exports = { LedgerController };
