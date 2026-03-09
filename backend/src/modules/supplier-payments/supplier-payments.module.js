const { Module } = require('@nestjs/common');
const { SupplierPaymentsController } = require('./supplier-payments.controller');
const { SupplierPaymentsService } = require('./supplier-payments.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [SupplierPaymentsController],
  providers: [SupplierPaymentsService],
  exports: [SupplierPaymentsService],
})
class SupplierPaymentsModule {}

module.exports = { SupplierPaymentsModule };
