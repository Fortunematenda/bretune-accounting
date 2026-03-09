const { Module } = require('@nestjs/common');
const { PaymentsController } = require('./payments.controller');
const { PaymentsService } = require('./payments.service');
const { LedgerModule } = require('../ledger/ledger.module');

@Module({
  imports: [LedgerModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
class PaymentsModule {}

module.exports = { PaymentsModule };
