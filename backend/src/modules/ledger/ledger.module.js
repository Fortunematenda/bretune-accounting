const { Module } = require('@nestjs/common');
const { PrismaModule } = require('../../config/prisma.module');
const { AccountingPeriodsModule } = require('../accounting-periods/accounting-periods.module');
const { AuditModule } = require('../audit/audit.module');
const { LedgerController } = require('./ledger.controller');
const { LedgerService } = require('./ledger.service');

@Module({
  imports: [PrismaModule, AccountingPeriodsModule, AuditModule],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
class LedgerModule {}

module.exports = { LedgerModule };
