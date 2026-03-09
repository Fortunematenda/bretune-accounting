const { Injectable, InternalServerErrorException } = require('@nestjs/common');
const { PrismaClient } = require('@prisma/client');

@Injectable()
class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Soft delete helper
  async softDelete(model, id) {
    return this[model].update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Pagination helper
  async paginate(model, { page = 1, limit = 10, where = {}, orderBy = {}, include, select }) {
    if (!this[model]) {
      throw new InternalServerErrorException(
        `Prisma Client is missing model delegate "${model}". Run prisma generate/migrate and restart the server.`
      );
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this[model].findMany({
        where,
        ...(include ? { include } : {}),
        ...(select ? { select } : {}),
        orderBy,
        skip,
        take: limit,
      }),
      this[model].count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = { PrismaService };
