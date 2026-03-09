const { Module } = require('@nestjs/common');
const { PayrollController } = require('./payroll.controller');
const { PayrollService } = require('./payroll.service');
const { PrismaModule } = require('../../config/prisma.module');

@Module({
  imports: [PrismaModule],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
class PayrollModule {}

module.exports = { PayrollModule };
