const { BadRequestException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { LedgerService } = require('../ledger/ledger.service');
const { toDecimal } = require('../../common/utils/money');
const { userCompanyFilter, ownerCompanyFilter } = require('../../common/utils/company-scope');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function toDateOrNull(v, fieldName) {
  if (v == null || String(v).trim() === '') return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new BadRequestException(`${fieldName} must be a valid date`);
  return d;
}

function mapExpense(e) {
  if (!e) return e;
  return {
    ...e,
    expenseNumber: e.expenseSeq != null ? String(e.expenseSeq) : e.id,
    date: e.expenseDate,
    supplierName: e.supplier?.supplierName ?? null,
    categoryName: e.category?.name ?? null,
  };
}

@Injectable()
class ExpensesService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async create(userId, dto, { currentUser } = {}) {
    const amount = toDecimal(dto.amount ?? dto.totalAmount ?? '0');
    if (amount.lte(0)) throw new BadRequestException('amount must be greater than 0');

    const expenseDate = toDateOrNull(dto.expenseDate ?? dto.date, 'expenseDate') || new Date();
    const taxRate = dto.taxRate != null ? toDecimal(String(dto.taxRate || '0')) : toDecimal('0');
    const taxAmount = dto.taxAmount != null ? toDecimal(String(dto.taxAmount || '0')) : amount.mul(taxRate).div(100);
    const totalAmount = dto.totalAmount != null ? toDecimal(String(dto.totalAmount)) : amount.add(taxAmount);

    const supplierId = cleanString(dto.supplierId);
    if (supplierId) {
      const supplierWhere = { id: supplierId, ...ownerCompanyFilter(currentUser) };
      const supplier = await this.prisma.supplier.findFirst({ where: supplierWhere, select: { id: true } });
      if (!supplier) throw new BadRequestException('supplierId is invalid');
    }

    const categoryId = cleanString(dto.categoryId);
    if (categoryId) {
      const category = await this.prisma.expenseCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
      if (!category) throw new BadRequestException('categoryId is invalid');
    }

    const status = dto.status || 'DRAFT';

    const expense = await this.prisma.expense.create({
      data: {
        userId,
        supplierId,
        categoryId,
        expenseDate,
        description: cleanString(dto.description),
        amount: String(amount),
        taxRate: String(taxRate),
        taxAmount: String(taxAmount),
        totalAmount: String(totalAmount),
        status,
        paymentMethod: cleanString(dto.paymentMethod),
        notes: cleanString(dto.notes),
      },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return mapExpense(expense);
  }

  async findAll({ page = 1, limit = 20, q, status, supplierId, categoryId, from, to } = {}, { currentUser } = {}) {
    const where = { ...userCompanyFilter(currentUser) };

    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    if (categoryId) where.categoryId = categoryId;

    if (from || to) {
      where.expenseDate = {};
      if (from) {
        const d = toDateOrNull(from, 'from');
        if (d) where.expenseDate.gte = d;
      }
      if (to) {
        const d = toDateOrNull(to, 'to');
        if (d) {
          d.setHours(23, 59, 59, 999);
          where.expenseDate.lte = d;
        }
      }
    }

    if (q) {
      where.OR = [
        { description: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
        { supplier: { supplierName: { contains: q, mode: 'insensitive' } } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const result = await this.prisma.paginate('expense', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return {
      ...result,
      data: (result.data || []).map(mapExpense),
    };
  }

  async findOne(id, { currentUser } = {}) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, ...userCompanyFilter(currentUser) },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        category: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return mapExpense(expense);
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const amount = dto.amount !== undefined ? toDecimal(String(dto.amount || '0')) : undefined;
    if (amount !== undefined && amount.lte(0)) throw new BadRequestException('amount must be greater than 0');

    const expenseDate = dto.expenseDate !== undefined ? toDateOrNull(dto.expenseDate, 'expenseDate') : undefined;
    const taxRate = dto.taxRate !== undefined ? toDecimal(String(dto.taxRate || '0')) : undefined;
    const taxAmount = dto.taxAmount !== undefined ? toDecimal(String(dto.taxAmount || '0')) : undefined;
    const totalAmount = dto.totalAmount !== undefined ? toDecimal(String(dto.totalAmount)) : undefined;

    const supplierId = dto.supplierId !== undefined ? cleanString(dto.supplierId) : undefined;
    if (supplierId !== undefined && supplierId) {
      const supplierWhere = { id: supplierId, ...ownerCompanyFilter(currentUser) };
      const supplier = await this.prisma.supplier.findFirst({ where: supplierWhere, select: { id: true } });
      if (!supplier) throw new BadRequestException('supplierId is invalid');
    }

    const categoryId = dto.categoryId !== undefined ? cleanString(dto.categoryId) : undefined;
    if (categoryId !== undefined && categoryId) {
      const category = await this.prisma.expenseCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
      if (!category) throw new BadRequestException('categoryId is invalid');
    }

    const expense = await this.prisma.expense.update({
      where: { id, ...userCompanyFilter(currentUser) },
      data: {
        ...(expenseDate !== undefined ? { expenseDate } : {}),
        ...(dto.description !== undefined ? { description: cleanString(dto.description) } : {}),
        ...(amount !== undefined ? { amount: String(amount) } : {}),
        ...(taxRate !== undefined ? { taxRate: String(taxRate) } : {}),
        ...(taxAmount !== undefined ? { taxAmount: String(taxAmount) } : {}),
        ...(totalAmount !== undefined ? { totalAmount: String(totalAmount) } : {}),
        ...(dto.status != null ? { status: dto.status } : {}),
        ...(dto.paymentMethod !== undefined ? { paymentMethod: cleanString(dto.paymentMethod) } : {}),
        ...(dto.notes !== undefined ? { notes: cleanString(dto.notes) } : {}),
        ...(supplierId !== undefined ? { supplierId } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return mapExpense(expense);
  }

  async approve(id, { currentUser } = {}) {
    const expense = await this.findOne(id, { currentUser });
    const s = String(expense.status || '').toUpperCase();
    if (s !== 'DRAFT') throw new BadRequestException(`Cannot approve expense with status ${expense.status}`);
    return this.update(id, { status: 'APPROVED' }, { currentUser });
  }

  async reimburse(id, { currentUser } = {}) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, ...userCompanyFilter(currentUser) },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        category: { select: { id: true, name: true, ledgerAccount: true } },
      },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    const s = String(expense.status || '').toUpperCase();
    if (s !== 'APPROVED') throw new BadRequestException(`Cannot reimburse expense with status ${expense.status}`);

    return this.prisma.$transaction(async (tx) => {
      let journalEntryId = null;
      if (this.ledgerService) {
        const lines = this.ledgerService.buildExpenseEntryLines({
          totalAmount: expense.totalAmount,
          expenseAccountCode: expense.category?.ledgerAccount,
          paymentMethod: expense.paymentMethod || 'BANK_TRANSFER',
        });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: expense.userId,
            date: expense.expenseDate || new Date(),
            memo: `Expense #${expense.expenseSeq || expense.id} reimbursement`,
            sourceType: 'EXPENSE',
            sourceId: expense.id,
            lines,
          });
          journalEntryId = entry.id;
        }
      }

      const updated = await tx.expense.update({
        where: { id, ...userCompanyFilter(currentUser) },
        data: {
          status: 'REIMBURSED',
          ...(journalEntryId ? { journalEntryId } : {}),
        },
        include: {
          supplier: { select: { id: true, supplierName: true } },
          category: { select: { id: true, name: true } },
        },
      });

      return mapExpense(updated);
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    await this.prisma.expense.delete({ where: { id, ...userCompanyFilter(currentUser) } });
    return { ok: true };
  }
}

module.exports = { ExpensesService };
