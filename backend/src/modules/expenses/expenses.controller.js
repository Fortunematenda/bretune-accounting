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
const { ExpensesService } = require('./expenses.service');

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
class ExpensesController {
  constructor(@Inject(ExpensesService) expensesService) {
    this.expensesService = expensesService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.expensesService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.expensesService.findAll(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.expensesService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.expensesService.update(id, dto, { currentUser: req?.user });
  }

  @Post(':id/approve')
  async approve(@Param('id') id, @Request() req) {
    return this.expensesService.approve(id, { currentUser: req?.user });
  }

  @Post(':id/reimburse')
  async reimburse(@Param('id') id, @Request() req) {
    return this.expensesService.reimburse(id, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.expensesService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { ExpensesController };
