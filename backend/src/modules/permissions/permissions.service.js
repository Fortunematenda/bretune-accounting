const { Inject, Injectable } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

@Injectable()
class PermissionsService {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  async list() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { key: 'asc' }],
    });
    const byModule = {};
    for (const p of permissions) {
      if (!byModule[p.module]) byModule[p.module] = [];
      byModule[p.module].push({
        id: p.id,
        key: p.key,
        description: p.description,
        module: p.module,
      });
    }
    return {
      data: permissions,
      byModule: Object.entries(byModule).map(([module, perms]) => ({
        module,
        permissions: perms,
      })),
    };
  }
}

module.exports = { PermissionsService };
