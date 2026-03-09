const { Module } = require('@nestjs/common');
const { TasksController } = require('./tasks.controller');
const { TasksService } = require('./tasks.service');
const { TasksScheduler } = require('./tasks.scheduler');
const { AutomationModule } = require('../automation/automation.module');

@Module({
  imports: [AutomationModule],
  controllers: [TasksController],
  providers: [TasksService, TasksScheduler],
  exports: [TasksService],
})
class TasksModule {}

module.exports = { TasksModule };
