const { Inject, Injectable, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

@Injectable()
class AuditService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async log({ entityType, entityId, action, userId, oldValues, newValues, ipAddress, userAgent } = {}) {
    if (!entityType || !entityId || !action) return null;
    try {
      return await this.prisma.auditLog.create({
        data: {
          entityType,
          entityId,
          action,
          userId: userId || null,
          oldValues: oldValues || undefined,
          newValues: newValues || undefined,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
        },
      });
    } catch (err) {
      console.warn('[Audit] Failed to log:', err.message);
      return null;
    }
  }

  async findByEntity(entityType, entityId, { limit = 50 } = {}) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { changedAt: 'desc' },
      take: Number(limit),
    });
  }
}

module.exports = { AuditService };
