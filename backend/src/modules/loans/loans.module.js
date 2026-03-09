const { Module } = require('@nestjs/common');
const { LoansController } = require('./loans.controller');
const { LoansService } = require('./loans.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
class LoansModule {}

module.exports = { LoansModule };
