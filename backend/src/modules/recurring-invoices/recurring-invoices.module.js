const { Module } = require('@nestjs/common');
const { RecurringInvoicesController } = require('./recurring-invoices.controller');
const { RecurringInvoicesService } = require('./recurring-invoices.service');

@Module({
  controllers: [RecurringInvoicesController],
  providers: [RecurringInvoicesService],
  exports: [RecurringInvoicesService],
})
class RecurringInvoicesModule {}

module.exports = { RecurringInvoicesModule };
