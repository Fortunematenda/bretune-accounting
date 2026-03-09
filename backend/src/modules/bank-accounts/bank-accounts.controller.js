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
const { BankAccountsService } = require('./bank-accounts.service');

@ApiTags('Bank Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bank-accounts')
class BankAccountsController {
  constructor(@Inject(BankAccountsService) bankAccountsService) {
    this.bankAccountsService = bankAccountsService;
  }

  @Post()
  async create(@Body() dto, @Request() req) {
    return this.bankAccountsService.create(req?.user?.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.bankAccountsService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.bankAccountsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.bankAccountsService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.bankAccountsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { BankAccountsController };
