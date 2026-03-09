const { Module } = require('@nestjs/common');
const { BillsController } = require('./bills.controller');
const { BillsService } = require('./bills.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
class BillsModule {}

module.exports = { BillsModule };
