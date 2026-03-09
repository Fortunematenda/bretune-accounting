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
const { TasksService } = require('./tasks.service');
const { CreateTaskDto } = require('./dto/create-task.dto');
const { UpdateTaskDto } = require('./dto/update-task.dto');
const { CompleteTaskDto } = require('./dto/complete-task.dto');

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
class TasksController {
  constructor(@Inject(TasksService) tasksService) {
    this.tasksService = tasksService;
  }

  @Post()
  async create(@Request() req, @Body() dto) {
    return this.tasksService.create(req.user.id, dto, { currentUser: req?.user });
  }

  @Get()
  async findAll(@Query() query, @Request() req) {
    return this.tasksService.findAll(query, { currentUser: req?.user });
  }

  @Get('dashboard-summary')
  async dashboardSummary(@Request() req) {
    return this.tasksService.dashboardSummary(req.user.id, { currentUser: req?.user });
  }

  @Get('calendar')
  async calendar(@Query() query, @Request() req) {
    return this.tasksService.calendar(query, { currentUser: req?.user });
  }

  @Get(':id')
  async findOne(@Param('id') id, @Request() req) {
    return this.tasksService.findOne(id, { currentUser: req?.user });
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id, @Body() dto) {
    return this.tasksService.update(req.user.id, id, dto, { currentUser: req?.user });
  }

  @Post(':id/complete')
  async complete(@Request() req, @Param('id') id, @Body() dto) {
    return this.tasksService.complete(req.user.id, id, dto, { currentUser: req?.user });
  }

  @Post(':id/cancel')
  async cancel(@Request() req, @Param('id') id) {
    return this.tasksService.cancel(req.user.id, id, { currentUser: req?.user });
  }

  @Post(':id/reschedule')
  async reschedule(@Request() req, @Param('id') id, @Body() body) {
    return this.tasksService.reschedule(req.user.id, id, body, { currentUser: req?.user });
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id) {
    return this.tasksService.remove(req.user.id, id, { currentUser: req?.user });
  }
}

module.exports = { TasksController };
