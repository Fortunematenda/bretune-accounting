const { Module } = require('@nestjs/common');
const { AutomationService } = require('./automation.service');
const { AutomationController } = require('./automation.controller');
const { EmailService } = require('./email.service');
const { JobLockService } = require('./job-lock.service');
const { RecurringInvoicesModule } = require('../recurring-invoices/recurring-invoices.module');
const { StatementsModule } = require('../statements/statements.module');
const { SettingsModule } = require('../settings/settings.module');

@Module({
  imports: [RecurringInvoicesModule, StatementsModule, SettingsModule],
  controllers: [AutomationController],
  providers: [AutomationService, EmailService, JobLockService],
  exports: [EmailService, JobLockService],
})
class AutomationModule {}

module.exports = { AutomationModule };
