const { Controller, Get, Inject } = require('@nestjs/common');
const { SkipThrottle } = require('@nestjs/throttler');
const { PrismaService } = require('../../config/prisma.service');

@Controller('health')
@SkipThrottle()
class HealthController {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  @Get()
  async check() {
    const dbOk = await this.checkDb();
    const status = dbOk ? 'healthy' : 'unhealthy';
    return {
      status,
      timestamp: new Date().toISOString(),
      version: '1.0',
      database: dbOk ? 'connected' : 'disconnected',
    };
  }

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  async checkDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { HealthController };
