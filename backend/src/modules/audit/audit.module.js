const { Module } = require('@nestjs/common');
const { AuditService } = require('./audit.service');
const { PrismaModule } = require('../../config/prisma.module');

@Module({
  imports: [PrismaModule],
  providers: [AuditService],
  exports: [AuditService],
})
class AuditModule {}

module.exports = { AuditModule };
