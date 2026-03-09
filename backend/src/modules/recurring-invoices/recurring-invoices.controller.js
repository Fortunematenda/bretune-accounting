const {
  Body,
  Controller,
  Delete,
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
const { RecurringInvoicesService } = require('./recurring-invoices.service');

@ApiTags('Recurring Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring-invoices')
class RecurringInvoicesController {
  constructor(@Inject(RecurringInvoicesService) recurringInvoicesService) {
    this.recurringInvoicesService = recurringInvoicesService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.recurringInvoicesService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.recurringInvoicesService.findAll(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.recurringInvoicesService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.recurringInvoicesService.update(id, dto, { currentUser: req?.user });
  }

  @Post(':id/pause')
  async pause(@Param('id') id, @Request() req) {
    return this.recurringInvoicesService.pause(id, { currentUser: req?.user });
  }

  @Post(':id/resume')
  async resume(@Param('id') id, @Request() req) {
    return this.recurringInvoicesService.resume(id, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.recurringInvoicesService.remove(id, { currentUser: req?.user });
  }

  @Post('run-due')
  async runDue(@Request() req) {
    return this.recurringInvoicesService.runDue(req.user.id);
  }
}

module.exports = { RecurringInvoicesController };
