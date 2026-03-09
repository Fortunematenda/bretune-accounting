const { Module } = require('@nestjs/common');
const { InvoicesController } = require('./invoices.controller');
const { InvoicesService } = require('./invoices.service');
const { SettingsModule } = require('../settings/settings.module');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [SettingsModule, SubscriptionsModule, LedgerModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
class InvoicesModule {}

module.exports = { InvoicesModule };
