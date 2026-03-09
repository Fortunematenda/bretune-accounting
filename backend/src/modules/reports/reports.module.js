const { Module } = require('@nestjs/common');
const { ReportsController } = require('./reports.controller');
const { ReportsService } = require('./reports.service');
const { SubscriptionsModule } = require('../subscriptions/subscriptions.module');
const { CurrenciesModule } = require('../currencies/currencies.module');

@Module({
  imports: [SubscriptionsModule, CurrenciesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
class ReportsModule {}

module.exports = { ReportsModule };
