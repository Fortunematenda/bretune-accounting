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
const { LoansService } = require('./loans.service');

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loans')
class LoansController {
  constructor(@Inject(LoansService) loansService) {
    this.loansService = loansService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.loansService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get('summary')
  async summary(@Request() req) {
    return this.loansService.summary({ currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.loansService.findAll(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.loansService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.loansService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.loansService.remove(id, { currentUser: req?.user });
  }

  @Post(':id/repayments')
  async addRepayment(@Param('id') id, @Body() dto, @Request() req) {
    return this.loansService.addRepayment(id, dto, { currentUser: req?.user });
  }

  @Delete(':id/repayments/:repaymentId')
  async removeRepayment(@Param('id') id, @Param('repaymentId') repaymentId, @Request() req) {
    return this.loansService.removeRepayment(id, repaymentId, { currentUser: req?.user });
  }
}

module.exports = { LoansController };
