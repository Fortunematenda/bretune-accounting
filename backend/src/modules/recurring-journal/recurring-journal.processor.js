const { Inject, Injectable } = require('@nestjs/common');
const { Cron } = require('@nestjs/schedule');
const { RecurringJournalService } = require('./recurring-journal.service');

@Injectable()
class RecurringJournalProcessor {
  constructor(@Inject(RecurringJournalService) recurringJournalService) {
    this.recurringJournalService = recurringJournalService;
  }

  @Cron('0 1 * * *') // 1 AM daily
  async handleCron() {
    try {
      const result = await this.recurringJournalService.processDueEntries();
      if (result.processed > 0 && result.results?.length > 0) {
        const errors = result.results.filter((r) => r.status === 'error');
        if (errors.length > 0) {
          console.warn('[RecurringJournal] Some entries failed:', errors);
        }
      }
    } catch (err) {
      console.error('[RecurringJournal] Cron failed:', err);
    }
  }
}

module.exports = { RecurringJournalProcessor };
