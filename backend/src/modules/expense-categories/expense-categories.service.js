const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

@Injectable()
class ExpenseCategoriesService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(dto) {
    const name = cleanString(dto.name);
    if (!name) throw new BadRequestException('name is required');

    const defaultTaxRate = dto.defaultTaxRate != null ? toDecimal(String(dto.defaultTaxRate || '0')) : toDecimal('0');
    const ledgerAccount = cleanString(dto.ledgerAccount);

    return this.prisma.expenseCategory.create({
      data: {
        name,
        defaultTaxRate: String(defaultTaxRate),
        ledgerAccount,
      },
    });
  }

  async findAll({ page = 1, limit = 1000 } = {}) {
    return this.prisma.paginate('expenseCategory', {
      page: Number(page),
      limit: Number(limit),
      where: {},
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id) {
    const category = await this.prisma.expenseCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  async update(id, dto) {
    await this.findOne(id);

    const name = dto.name !== undefined ? cleanString(dto.name) : undefined;
    if (name !== undefined && !name) throw new BadRequestException('name cannot be empty');

    const defaultTaxRate =
      dto.defaultTaxRate !== undefined ? toDecimal(String(dto.defaultTaxRate || '0')) : undefined;
    const ledgerAccount = dto.ledgerAccount !== undefined ? cleanString(dto.ledgerAccount) : undefined;

    return this.prisma.expenseCategory.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(defaultTaxRate !== undefined ? { defaultTaxRate: String(defaultTaxRate) } : {}),
        ...(ledgerAccount !== undefined ? { ledgerAccount } : {}),
      },
    });
  }

  async remove(id) {
    await this.findOne(id);

    const count = await this.prisma.expense.count({
      where: { categoryId: id },
    });
    if (count > 0) {
      throw new BadRequestException(
        `Cannot delete this category because ${count} expense(s) are linked to it. Reassign or delete them first.`
      );
    }

    await this.prisma.expenseCategory.delete({ where: { id } });
    return { ok: true };
  }
}

module.exports = { ExpenseCategoriesService };
