const { Inject, Injectable, NotFoundException, BadRequestException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { ownerCompanyFilter, getOwnerCompany } = require('../../common/utils/company-scope');
const { PlanLimitService } = require('../subscriptions/plan-limit.service');

@Injectable()
class ProductsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(PlanLimitService) planLimitService = null,
  ) {
    this.prisma = prismaService;
    this.planLimitService = planLimitService;
  }

  async create(data, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceInventoryAccess(currentUser);
    }
    if (data.isRecurring && !data.recurringFrequency) {
      throw new BadRequestException('recurringFrequency is required when isRecurring is true');
    }

    if (!data.isRecurring) {
      data.recurringFrequency = null;
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        type: data.type != null ? String(data.type).toUpperCase() : 'PRODUCT',
        description: data.description,
        sku: data.sku,
        price: data.price,
        cost: data.cost,
        taxRate: data.taxRate != null ? data.taxRate : '0.00',
        isRecurring: data.isRecurring,
        recurringFrequency: data.recurringFrequency,
        isActive: data.isActive,
        ownerCompanyName: getOwnerCompany(currentUser),
      },
    });
  }

  async findAll({ page = 1, limit = 20, q, isActive, isRecurring, type, currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceInventoryAccess(currentUser);
    }
    const where = { ...ownerCompanyFilter(currentUser) };

    if (isActive != null) {
      where.isActive = String(isActive).toLowerCase() === 'true';
    }

    if (isRecurring != null) {
      where.isRecurring = String(isRecurring).toLowerCase() === 'true';
    }

    if (type != null && String(type).trim() !== '') {
      where.type = String(type).trim().toUpperCase();
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('product', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceInventoryAccess(currentUser);
    }
    const where = { id, ...ownerCompanyFilter(currentUser) };
    const product = await this.prisma.product.findFirst({
      where,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id, data, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceInventoryAccess(currentUser);
    }
    await this.findOne(id, { currentUser });

    if (data.isRecurring === true && !data.recurringFrequency) {
      throw new BadRequestException('recurringFrequency is required when isRecurring is true');
    }

    if (data.isRecurring === false) {
      data.recurringFrequency = null;
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type != null ? String(data.type).toUpperCase() : undefined,
        description: data.description,
        sku: data.sku,
        price: data.price,
        cost: data.cost,
        taxRate: data.taxRate,
        isRecurring: data.isRecurring,
        recurringFrequency: data.recurringFrequency,
        isActive: data.isActive,
      },
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    return this.prisma.product.delete({ where: { id } });
  }

  async deactivate(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

module.exports = { ProductsService };
