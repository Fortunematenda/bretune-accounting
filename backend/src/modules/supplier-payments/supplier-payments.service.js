const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { LedgerService } = require('../ledger/ledger.service');
const { toDecimal } = require('../../common/utils/money');
const { userCompanyFilter, ownerCompanyFilter } = require('../../common/utils/company-scope');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function clampNonNegative(decimal) {
  return decimal.lt(0) ? toDecimal('0') : decimal;
}

function formatSupplierPaymentNumber(sequenceValue) {
  const v = Number(sequenceValue);
  if (!Number.isFinite(v) || v <= 0) return `SPAY-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
  return `SPAY-${String(v).padStart(3, '0')}`;
}

async function nextSupplierPaymentNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'supplier_payment' },
    create: { key: 'supplier_payment', value: 1 },
    update: { value: { increment: 1 } },
  });
  return formatSupplierPaymentNumber(counter.value);
}

function normalizeAllocationItems(items) {
  const list = Array.isArray(items) ? items : [];
  const allocations = [];
  let allocated = toDecimal('0');

  for (let i = 0; i < list.length; i += 1) {
    const it = list[i];
    if (!it?.billId) throw new BadRequestException(`allocations[${i}].billId is required`);
    const amt = toDecimal(it.amount, `allocations[${i}].amount`);
    if (amt.lte(0)) throw new BadRequestException(`allocations[${i}].amount must be greater than 0`);
    allocated = allocated.add(amt);
    allocations.push({ billId: it.billId, amount: String(amt) });
  }

  // Merge duplicates by billId
  const merged = new Map();
  for (const a of allocations) {
    const prev = merged.get(a.billId);
    if (!prev) merged.set(a.billId, toDecimal(a.amount));
    else merged.set(a.billId, prev.add(toDecimal(a.amount)));
  }

  const normalized = Array.from(merged.entries()).map(([billId, amt]) => ({ billId, amount: String(amt) }));
  const normalizedAllocated = normalized.reduce((sum, a) => sum.add(toDecimal(a.amount)), toDecimal('0'));

  return { allocations: normalized, allocated: normalizedAllocated };
}

@Injectable()
class SupplierPaymentsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async recalculateSupplierBalances(tx, supplierId) {
    const supplier = await tx.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');

    const billedAgg = await tx.bill.aggregate({
      where: { supplierId, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
    });

    const paidAgg = await tx.supplierPayment.aggregate({
      where: {
        supplierId,
        status: 'COMPLETED',
        method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] },
      },
      _sum: { amount: true },
    });

    const openAgg = await tx.bill.aggregate({
      where: {
        supplierId,
        status: { in: ['OPEN', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID'] },
      },
      _sum: { balanceDue: true },
    });

    const creditAgg = await tx.supplierPayment.aggregate({
      where: { supplierId, status: 'COMPLETED' },
      _sum: { unallocatedAmount: true },
    });

    const totalBilled = toDecimal(billedAgg._sum.totalAmount || '0');
    const totalPaid = toDecimal(paidAgg._sum.amount || '0');
    const outstanding = toDecimal(openAgg._sum.balanceDue || '0');
    const creditBalance = toDecimal(creditAgg._sum.unallocatedAmount || '0');

    await tx.supplier.update({
      where: { id: supplierId },
      data: {
        totalBilled: String(totalBilled),
        totalPaid: String(totalPaid),
        outstandingBalance: String(outstanding),
        creditBalance: String(creditBalance),
      },
    });
  }

  async validateAllocationsAgainstBills(tx, supplierId, allocations, paymentAmount) {
    const allocatedTotal = allocations.reduce((sum, a) => sum.add(toDecimal(a.amount)), toDecimal('0'));
    if (allocatedTotal.gt(paymentAmount)) {
      throw new BadRequestException('Allocated total cannot exceed payment amount');
    }

    if (allocations.length === 0) return;

    const bills = await tx.bill.findMany({
      where: { id: { in: allocations.map((a) => a.billId) } },
      select: { id: true, supplierId: true, status: true, balanceDue: true },
    });

    const byId = new Map(bills.map((b) => [b.id, b]));

    for (const a of allocations) {
      const b = byId.get(a.billId);
      if (!b) throw new NotFoundException('Bill not found');
      if (b.supplierId !== supplierId) throw new BadRequestException('Payment supplier does not match bill supplier');

      const st = String(b.status || '').toUpperCase();
      if (['DRAFT', 'CANCELLED', 'PAID'].includes(st)) {
        throw new BadRequestException('Cannot allocate to bills in this status');
      }

      const allocAmt = toDecimal(a.amount || '0');
      const balanceDue = toDecimal(b.balanceDue || '0');
      if (allocAmt.gt(balanceDue)) {
        throw new BadRequestException('Allocation amount cannot exceed bill outstanding balance');
      }
    }
  }

  async create(userId, dto, { currentUser } = {}) {
    const supplierId = cleanString(dto.supplierId);
    if (!supplierId) throw new BadRequestException('supplierId is required');

    const supplierWhere = { id: supplierId, ...ownerCompanyFilter(currentUser) };
    const supplier = await this.prisma.supplier.findFirst({ where: supplierWhere, select: { id: true } });
    if (!supplier) throw new BadRequestException('supplierId is invalid');

    const amount = toDecimal(dto.amount, 'amount');
    if (amount.lte(0)) throw new BadRequestException('amount must be greater than 0');

    const status = dto.status || 'COMPLETED';

    return this.prisma.$transaction(async (tx) => {
      const paymentNumber = await nextSupplierPaymentNumber(tx);

      const normalized = normalizeAllocationItems(dto.allocations);
      await this.validateAllocationsAgainstBills(tx, supplierId, normalized.allocations, amount);

      const unallocated = clampNonNegative(amount.sub(normalized.allocated));

      const payment = await tx.supplierPayment.create({
        data: {
          paymentNumber,
          supplierId,
          userId,
          amount: String(amount),
          unallocatedAmount: String(unallocated),
          status,
          method: dto.method,
          reference: cleanString(dto.reference),
          notes: cleanString(dto.notes),
          ...(dto.paymentDate ? { paymentDate: new Date(dto.paymentDate) } : {}),
        },
      });

      if (normalized.allocations.length > 0) {
        await tx.supplierPaymentAllocation.createMany({
          data: normalized.allocations.map((a) => ({
            paymentId: payment.id,
            billId: a.billId,
            amount: a.amount,
          })),
        });
      }

      if (status === 'COMPLETED') {
        if (this.ledgerService) {
          const lines = this.ledgerService.buildSupplierPaymentEntryLines({
            amount: payment.amount,
            method: payment.method,
          });
          if (lines.length > 0) {
            const entry = await this.ledgerService.postEntry(tx, {
              createdByUserId: userId,
              date: payment.paymentDate || new Date(),
              memo: `Supplier payment ${payment.paymentNumber}`,
              sourceType: 'SUPPLIER_PAYMENT',
              sourceId: payment.id,
              lines,
            });
            await tx.supplierPayment.update({
              where: { id: payment.id },
              data: { journalEntryId: entry.id, processedAt: new Date() },
            });
            payment.journalEntryId = entry.id;
            payment.processedAt = entry.date;
          }
        } else {
          await tx.supplierPayment.update({
            where: { id: payment.id },
            data: { processedAt: new Date() },
          });
        }
      }

      if (status === 'COMPLETED') {
        const billIds = Array.from(new Set(normalized.allocations.map((a) => a.billId)));
        for (const billId of billIds) {
          // Bills service method lives in bills module; we recalc inline by calling a transaction update.
          // We rely on bills.service.js recalculateBillFinancials being available via Prisma delegate.
          // For now, reuse the same aggregation approach: sum allocations.
          const allocs = await tx.supplierPaymentAllocation.findMany({
            where: { billId, payment: { status: 'COMPLETED' } },
            select: { amount: true },
          });

          let amountPaid = toDecimal('0');
          for (const a of allocs) amountPaid = amountPaid.add(toDecimal(a.amount || '0'));

          const bill = await tx.bill.findUnique({ where: { id: billId } });
          if (!bill) throw new NotFoundException('Bill not found');

          const totalAmount = toDecimal(bill.totalAmount || '0');
          const rawBalance = totalAmount.sub(amountPaid);
          const balanceDue = clampNonNegative(rawBalance);

          // Status engine
          const st = String(bill.status || '').toUpperCase();
          let nextStatus = st;
          let paidDate = bill.paidDate;

          if (!['DRAFT', 'CANCELLED'].includes(st)) {
            const due = bill.dueDate ? new Date(bill.dueDate) : null;
            const overdue = due && !Number.isNaN(due.getTime()) && due < new Date() && balanceDue.gt(0);

            if (rawBalance.lte(0)) {
              nextStatus = 'PAID';
              paidDate = new Date();
            } else if (amountPaid.gt(0)) {
              nextStatus = overdue ? 'OVERDUE' : 'PARTIALLY_PAID';
              paidDate = null;
            } else {
              nextStatus = overdue ? 'OVERDUE' : 'UNPAID';
              paidDate = null;
            }
          }

          await tx.bill.update({
            where: { id: billId },
            data: {
              amountPaid: String(amountPaid),
              balanceDue: String(balanceDue),
              status: nextStatus,
              paidDate,
            },
          });
        }

        await this.recalculateSupplierBalances(tx, supplierId);
      }

      const result = await tx.supplierPayment.findUnique({
        where: { id: payment.id },
        include: {
          supplier: { select: { id: true, supplierName: true } },
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          allocations: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              amount: true,
              bill: { select: { id: true, reference: true, billNumber: true, billDate: true, dueDate: true, totalAmount: true, balanceDue: true, status: true } },
            },
          },
        },
      });
      if (!result) throw new NotFoundException('Supplier payment not found');
      return result;
    });
  }

  async findAll({ page = 1, limit = 20, q, supplierId, status, method, from, to } = {}, { currentUser } = {}) {
    const where = { ...userCompanyFilter(currentUser) };

    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;
    if (method) where.method = method;

    if (from || to) {
      where.paymentDate = {};
      if (from) where.paymentDate.gte = new Date(from);
      if (to) where.paymentDate.lte = new Date(to);
    }

    if (q) {
      where.OR = [
        { paymentNumber: { contains: q, mode: 'insensitive' } },
        { reference: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
        { supplier: { supplierName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.paginate('supplierPayment', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { paymentDate: 'desc' },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        allocations: {
          select: {
            id: true,
            amount: true,
            bill: { select: { id: true, reference: true, billNumber: true, billDate: true, dueDate: true, totalAmount: true, balanceDue: true, status: true } },
          },
        },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const payment = await this.prisma.supplierPayment.findFirst({
      where: { id, ...userCompanyFilter(currentUser) },
      include: {
        supplier: { select: { id: true, supplierName: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        allocations: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            bill: { select: { id: true, reference: true, billNumber: true, billDate: true, dueDate: true, totalAmount: true, balanceDue: true, status: true } },
          },
        },
      },
    });

    if (!payment) throw new NotFoundException('Supplier payment not found');
    return payment;
  }

  async void(userId, paymentId, { reason } = {}, { currentUser } = {}) {
    const payment = await this.prisma.supplierPayment.findFirst({
      where: { id: paymentId, ...userCompanyFilter(currentUser) },
      include: { allocations: true },
    });

    if (!payment) throw new NotFoundException('Supplier payment not found');
    if (payment.userId !== userId) throw new BadRequestException('You cannot void this payment');
    if (payment.status === 'VOIDED') return this.findOne(paymentId);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.supplierPayment.update({
        where: { id: paymentId },
        data: {
          status: 'VOIDED',
          voidedAt: new Date(),
          voidReason: cleanString(reason),
        },
      });

      // Recalculate impacted bills
      const billIds = Array.from(new Set((payment.allocations || []).map((a) => a.billId).filter(Boolean)));
      for (const billId of billIds) {
        const allocs = await tx.supplierPaymentAllocation.findMany({
          where: { billId, payment: { status: 'COMPLETED' } },
          select: { amount: true },
        });

        let amountPaid = toDecimal('0');
        for (const a of allocs) amountPaid = amountPaid.add(toDecimal(a.amount || '0'));

        const bill = await tx.bill.findUnique({ where: { id: billId } });
        if (!bill) continue;

        const totalAmount = toDecimal(bill.totalAmount || '0');
        const rawBalance = totalAmount.sub(amountPaid);
        const balanceDue = clampNonNegative(rawBalance);

        const st = String(bill.status || '').toUpperCase();
        let nextStatus = st;
        let paidDate = bill.paidDate;

        if (!['DRAFT', 'CANCELLED'].includes(st)) {
          const due = bill.dueDate ? new Date(bill.dueDate) : null;
          const overdue = due && !Number.isNaN(due.getTime()) && due < new Date() && balanceDue.gt(0);

          if (rawBalance.lte(0)) {
            nextStatus = 'PAID';
            paidDate = new Date();
          } else if (amountPaid.gt(0)) {
            nextStatus = overdue ? 'OVERDUE' : 'PARTIALLY_PAID';
            paidDate = null;
          } else {
            nextStatus = overdue ? 'OVERDUE' : 'UNPAID';
            paidDate = null;
          }
        }

        await tx.bill.update({
          where: { id: billId },
          data: {
            amountPaid: String(amountPaid),
            balanceDue: String(balanceDue),
            status: nextStatus,
            paidDate,
          },
        });
      }

      await this.recalculateSupplierBalances(tx, payment.supplierId);

      return this.findOne(updated.id, { currentUser });
    });
  }

  async updateAllocations(userId, paymentId, { allocations } = {}, { currentUser } = {}) {
    const payment = await this.prisma.supplierPayment.findFirst({
      where: { id: paymentId, ...userCompanyFilter(currentUser) },
      include: { allocations: true },
    });

    if (!payment) throw new NotFoundException('Supplier payment not found');
    if (payment.userId !== userId) throw new BadRequestException('You cannot edit this payment');
    if (payment.status === 'VOIDED') throw new ConflictException('Cannot allocate a voided payment');

    const amount = toDecimal(payment.amount || '0');

    return this.prisma.$transaction(async (tx) => {
      const normalized = normalizeAllocationItems(allocations);
      await this.validateAllocationsAgainstBills(tx, payment.supplierId, normalized.allocations, amount);

      const unallocated = clampNonNegative(amount.sub(normalized.allocated));

      await tx.supplierPayment.update({
        where: { id: paymentId },
        data: { unallocatedAmount: String(unallocated) },
      });

      // Replace allocations
      await tx.supplierPaymentAllocation.deleteMany({ where: { paymentId } });

      if (normalized.allocations.length > 0) {
        await tx.supplierPaymentAllocation.createMany({
          data: normalized.allocations.map((a) => ({
            paymentId,
            billId: a.billId,
            amount: a.amount,
          })),
        });
      }

      // Recalc impacted bills
      const impactedBillIds = Array.from(
        new Set([
          ...(payment.allocations || []).map((a) => a.billId),
          ...normalized.allocations.map((a) => a.billId),
        ].filter(Boolean))
      );

      for (const billId of impactedBillIds) {
        const allocs = await tx.supplierPaymentAllocation.findMany({
          where: { billId, payment: { status: 'COMPLETED' } },
          select: { amount: true },
        });

        let amountPaid = toDecimal('0');
        for (const a of allocs) amountPaid = amountPaid.add(toDecimal(a.amount || '0'));

        const bill = await tx.bill.findUnique({ where: { id: billId } });
        if (!bill) continue;

        const totalAmount = toDecimal(bill.totalAmount || '0');
        const rawBalance = totalAmount.sub(amountPaid);
        const balanceDue = clampNonNegative(rawBalance);

        const st = String(bill.status || '').toUpperCase();
        let nextStatus = st;
        let paidDate = bill.paidDate;

        if (!['DRAFT', 'CANCELLED'].includes(st)) {
          const due = bill.dueDate ? new Date(bill.dueDate) : null;
          const overdue = due && !Number.isNaN(due.getTime()) && due < new Date() && balanceDue.gt(0);

          if (rawBalance.lte(0)) {
            nextStatus = 'PAID';
            paidDate = new Date();
          } else if (amountPaid.gt(0)) {
            nextStatus = overdue ? 'OVERDUE' : 'PARTIALLY_PAID';
            paidDate = null;
          } else {
            nextStatus = overdue ? 'OVERDUE' : 'UNPAID';
            paidDate = null;
          }
        }

        await tx.bill.update({
          where: { id: billId },
          data: {
            amountPaid: String(amountPaid),
            balanceDue: String(balanceDue),
            status: nextStatus,
            paidDate,
          },
        });
      }

      await this.recalculateSupplierBalances(tx, payment.supplierId);

      return this.findOne(paymentId, { currentUser });
    });
  }
}

module.exports = { SupplierPaymentsService };
