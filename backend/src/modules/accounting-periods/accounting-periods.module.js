const { Module } = require('@nestjs/common');
const { AccountingPeriodsController } = require('./accounting-periods.controller');
const { AccountingPeriodsService } = require('./accounting-periods.service');
const { PrismaModule } = require('../../config/prisma.module');

@Module({
  imports: [PrismaModule],
  controllers: [AccountingPeriodsController],
  providers: [AccountingPeriodsService],
  exports: [AccountingPeriodsService],
})
class AccountingPeriodsModule {}

module.exports = { AccountingPeriodsModule };
