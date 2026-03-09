const { Module } = require('@nestjs/common');
const { BankAccountsController } = require('./bank-accounts.controller');
const { BankAccountsService } = require('./bank-accounts.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
class BankAccountsModule {}

module.exports = { BankAccountsModule };
