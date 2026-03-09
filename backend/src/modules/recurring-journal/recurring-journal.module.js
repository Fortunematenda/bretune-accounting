const { Module } = require('@nestjs/common');
const { RecurringJournalController } = require('./recurring-journal.controller');
const { RecurringJournalProcessor } = require('./recurring-journal.processor');
const { RecurringJournalService } = require('./recurring-journal.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [RecurringJournalController],
  providers: [RecurringJournalService, RecurringJournalProcessor],
  exports: [RecurringJournalService],
})
class RecurringJournalModule {}

module.exports = { RecurringJournalModule };
