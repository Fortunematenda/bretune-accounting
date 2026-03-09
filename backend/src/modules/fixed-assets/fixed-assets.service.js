const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');

@Injectable()
class FixedAssetsService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(dto) {
    const cost = toDecimal(dto.cost || '0');
    if (cost.lte(0)) throw new BadRequestException('Cost must be greater than 0');
    const usefulLife = Number(dto.usefulLifeYears || 0);
    if (usefulLife <= 0) throw new BadRequestException('Useful life must be greater than 0');

    return this.prisma.fixedAsset.create({
      data: {
        name: dto.name,
        description: dto.description,
        assetCode: dto.assetCode,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : new Date(),
        cost: String(cost),
        residualValue: String(toDecimal(dto.residualValue || '0')),
        usefulLifeYears: usefulLife,
        depreciationMethod: dto.depreciationMethod || 'STRAIGHT_LINE',
        status: 'ACTIVE',
      },
    });
  }

  async findAll({ page = 1, limit = 20, status } = {}) {
    const where = {};
    if (status) where.status = status;

    return this.prisma.paginate('fixedAsset', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id) {
    const asset = await this.prisma.fixedAsset.findUnique({
      where: { id },
      include: { depreciationRuns: { orderBy: { runDate: 'desc' }, take: 12 } },
    });
    if (!asset) throw new NotFoundException('Fixed asset not found');
    return asset;
  }

  computeDepreciation(asset) {
    const cost = toDecimal(asset.cost || '0');
    const residual = toDecimal(asset.residualValue || '0');
    const accumulated = toDecimal(asset.accumulatedDepreciation || '0');
    const depreciable = cost.sub(residual);
    if (depreciable.lte(0)) return toDecimal('0');
    const remaining = depreciable.sub(accumulated);
    if (remaining.lte(0)) return toDecimal('0');

    const years = Number(asset.usefulLifeYears || 1);
    if (asset.depreciationMethod === 'DECLINING_BALANCE') {
      const rate = 2 / years;
      return toDecimal(accumulated.add(remaining).mul(rate).div(12));
    }
    return remaining.div(years).div(12);
  }
}

module.exports = { FixedAssetsService };
