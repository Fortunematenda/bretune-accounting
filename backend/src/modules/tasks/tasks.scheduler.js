const { Cron } = require('@nestjs/schedule');
const { Inject, Injectable, Logger } = require('@nestjs/common');
const { JobLockService } = require('../automation/job-lock.service');
const { TasksService } = require('./tasks.service');

@Injectable()
class TasksScheduler {
  constructor(
    @Inject(TasksService) tasksService,
    @Inject(JobLockService) jobLockService,
  ) {
    this.tasksService = tasksService;
    this.jobLockService = jobLockService;
    this.logger = new Logger(TasksScheduler.name);
  }

  // Every 5 minutes
  @Cron('*/5 * * * *')
  async generateRecurringTasks() {
    const lockName = 'tasks:generate-recurring';
    const gotLock = await this.jobLockService.acquireLock(lockName, {
      lockedBy: process.env.HOSTNAME || 'local',
      ttlMs: 10 * 60 * 1000,
    });

    if (!gotLock) return;

    try {
      const res = await this.tasksService.runDueRecurrences();
      if (res && (res.recurrencesProcessed || res.tasksCreated)) {
        this.logger.log(`Task recurrence: recurrences=${res.recurrencesProcessed}, tasks=${res.tasksCreated}`);
      }
    } catch (e) {
      this.logger.error(`Task recurrence failed: ${e.message}`);
    } finally {
      await this.jobLockService.releaseLock(lockName);
    }
  }
}

module.exports = { TasksScheduler };
