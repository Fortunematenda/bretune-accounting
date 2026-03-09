const { Body, Controller, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { RecurringJournalService } = require('./recurring-journal.service');

@ApiTags('Recurring Journal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring-journal')
class RecurringJournalController {
  constructor(@Inject(RecurringJournalService) recurringJournalService) {
    this.recurringJournalService = recurringJournalService;
  }

  @Get()
  async list(@Query() query, @Request() req) {
    return this.recurringJournalService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id, @Request() req) {
    return this.recurringJournalService.findOne(id);
  }

  @Post()
  async create(@Body() body, @Request() req) {
    return this.recurringJournalService.create(req?.user?.id, body);
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() body, @Request() req) {
    return this.recurringJournalService.update(id, body);
  }

  @Post('process-due')
  async processDue(@Request() req) {
    return this.recurringJournalService.processDueEntries();
  }
}

module.exports = { RecurringJournalController };
