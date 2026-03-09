const { Inject, Injectable, Logger } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

@Injectable()
class JobLockService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
    this.logger = new Logger(JobLockService.name);
  }

  async acquireLock(name, { lockedBy, ttlMs = 10 * 60 * 1000 } = {}) {
    const now = new Date();

    try {
      await this.prisma.jobLock.create({
        data: {
          name,
          lockedAt: now,
          lockedBy: lockedBy || null,
          ttlMs,
        },
      });

      return true;
    } catch (e) {
      // If lock exists, try to steal if expired
      const existing = await this.prisma.jobLock.findUnique({ where: { name } });
      if (!existing) return false;

      const ageMs = now.getTime() - new Date(existing.lockedAt).getTime();
      if (ageMs < ttlMs) {
        return false;
      }

      try {
        await this.prisma.jobLock.update({
          where: { name },
          data: { lockedAt: now, lockedBy: lockedBy || null, ttlMs },
        });
        this.logger.warn(`Stole expired lock: ${name}`);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }

  async releaseLock(name) {
    try {
      await this.prisma.jobLock.delete({ where: { name } });
    } catch (e) {
      // ignore
    }
  }
}

module.exports = { JobLockService };
