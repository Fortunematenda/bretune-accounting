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
  UseGuards,
} = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { ExpenseCategoriesService } = require('./expense-categories.service');

@ApiTags('Expense Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expense-categories')
class ExpenseCategoriesController {
  constructor(@Inject(ExpenseCategoriesService) expenseCategoriesService) {
    this.expenseCategoriesService = expenseCategoriesService;
  }

  @Post()
  async create(@Body() dto) {
    return this.expenseCategoriesService.create(dto);
  }

  @Get()
  async findAll(@Query() query) {
    return this.expenseCategoriesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return this.expenseCategoriesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto) {
    return this.expenseCategoriesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    return this.expenseCategoriesService.remove(id);
  }
}

module.exports = { ExpenseCategoriesController };
