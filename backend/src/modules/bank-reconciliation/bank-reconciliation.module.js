const { Module } = require('@nestjs/common');
const { BankReconciliationController } = require('./bank-reconciliation.controller');
const { BankReconciliationService } = require('./bank-reconciliation.service');
const { LedgerModule } = require('../ledger/ledger.module');
const { PaymentsModule } = require('../payments/payments.module');

@Module({
  imports: [LedgerModule, PaymentsModule],
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService],
  exports: [BankReconciliationService],
})
class BankReconciliationModule {}

module.exports = { BankReconciliationModule };
