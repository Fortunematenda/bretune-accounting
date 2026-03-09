const { Module } = require('@nestjs/common');
const { ExpensesController } = require('./expenses.controller');
const { ExpensesService } = require('./expenses.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
class ExpensesModule {}

module.exports = { ExpensesModule };
