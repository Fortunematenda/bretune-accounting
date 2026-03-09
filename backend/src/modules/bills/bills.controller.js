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
const { BillsService } = require('./bills.service');
const { CreateBillDto } = require('./dto/create-bill.dto');
const { UpdateBillDto } = require('./dto/update-bill.dto');

@ApiTags('Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bills')
class BillsController {
  constructor(@Inject(BillsService) billsService) {
    this.billsService = billsService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.billsService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.billsService.findAll({ ...query, currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.billsService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto, @Request() req) {
    return this.billsService.update(id, dto, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Param('id') id, @Request() req) {
    return this.billsService.remove(id, { currentUser: req?.user });
  }
}

module.exports = { BillsController };
