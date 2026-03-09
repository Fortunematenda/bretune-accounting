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

function toDateOrNull(v, fieldName) {
  if (v == null || String(v).trim() === '') return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new BadRequestException(`${fieldName} must be a valid date`);
  return d;
}

function computeBillStatus({ totalAmount, amountPaid, dueDate, currentStatus }) {
  const status = String(currentStatus || '').toUpperCase();
  if (['DRAFT', 'CANCELLED'].includes(status)) return { status, paidDate: null };

  const total = toDecimal(totalAmount || '0');
  const paid = toDecimal(amountPaid || '0');
  const balanceDue = total.sub(paid);
  const hasDue = Boolean(dueDate);
  const due = hasDue ? new Date(dueDate) : null;
  const overdue = due && !Number.isNaN(due.getTime()) && due < new Date() && balanceDue.gt(0);

  if (balanceDue.lte(0)) return { status: 'PAID', paidDate: new Date() };
  if (paid.gt(0)) return { status: overdue ? 'OVERDUE' : 'PARTIALLY_PAID', paidDate: null };
  return { status: overdue ? 'OVERDUE' : 'UNPAID', paidDate: null };
}

@Injectable()
class BillsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async recalculateBillFinancials(tx, billId) {
    const bill = await tx.bill.findUnique({ where: { id: billId } });
    if (!bill) throw new NotFoundException('Bill not found');

    const allocations = await tx.supplierPaymentAllocation.findMany({
      where: {
        billId,
        payment: { status: 'COMPLETED' },
      },
      select: { amount: true },
    });

    let amountPaid = toDecimal('0');
    for (const a of allocations) {
      amountPaid = amountPaid.add(toDecimal(a.amount || '0'));
    }

    const totalAmount = toDecimal(bill.totalAmount || '0');
    const rawBalance = totalAmount.sub(amountPaid);
    const balanceDue = rawBalance.lt(0) ? toDecimal('0') : rawBalance;

    const { status, paidDate } = computeBillStatus({
      totalAmount,
      amountPaid,
      dueDate: bill.dueDate,
      currentStatus: bill.status,
    });

    await tx.bill.update({
      where: { id: billId },
      data: {
        amountPaid: String(amountPaid),
        balanceDue: String(balanceDue),
        status,
        paidDate,
      },
    });
  }

  async create(userId, dto, { currentUser } = {}) {
    let vendorName = String(dto.vendorName || '').trim();

    const totalAmount = toDecimal(dto.totalAmount, 'totalAmount');
    if (totalAmount.lte(0)) throw new BadRequestException('totalAmount must be greater than 0');

    const billDate = toDateOrNull(dto.billDate, 'billDate') || new Date();
    const dueDate = toDateOrNull(dto.dueDate, 'dueDate');
    if (dueDate && dueDate < billDate) {
      throw new BadRequestException('dueDate must be on or after billDate');
    }

    const clientId = cleanString(dto.clientId);
    if (clientId) {
      const clientWhere = { id: clientId, ...ownerCompanyFilter(currentUser) };
      const client = await this.prisma.client.findFirst({ where: clientWhere, select: { id: true } });
      if (!client) throw new BadRequestException('clientId is invalid');
    }

    const supplierId = cleanString(dto.supplierId);
    let supplier = null;
    if (supplierId) {
      const suppWhere = { id: supplierId, ...ownerCompanyFilter(currentUser) };
      supplier = await this.prisma.supplier.findFirst({ where: suppWhere, select: { id: true, supplierName: true } });
      if (!supplier) throw new BadRequestException('supplierId is invalid');
      if (!vendorName) vendorName = supplier.supplierName;
    }

    if (!vendorName) throw new BadRequestException('vendorName is required');

    const initialStatus = dto.status || 'UNPAID';
    const { status, paidDate } = computeBillStatus({
      totalAmount,
      amountPaid: '0',
      dueDate,
      currentStatus: initialStatus,
    });

    return this.prisma.$transaction(async (tx) => {
      const bill = await tx.bill.create({
        data: {
          userId,
          clientId,
          supplierId,
          vendorName,
          reference: cleanString(dto.reference),
          description: cleanString(dto.description),
          billDate,
          dueDate,
          status,
          totalAmount: String(totalAmount),
          amountPaid: '0.00',
          balanceDue: String(totalAmount),
          paidDate,
        },
        include: {
          client: { select: { id: true, companyName: true, contactName: true } },
          supplier: { select: { id: true, supplierName: true } },
        },
      });

      if (this.ledgerService && status !== 'DRAFT') {
        const lines = this.ledgerService.buildBillEntryLines({ totalAmount: bill.totalAmount });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: userId,
            date: billDate,
            memo: `Bill ${bill.billNumber || bill.vendorName}`,
            sourceType: 'BILL',
            sourceId: bill.id,
            lines,
          });
          await tx.bill.update({
            where: { id: bill.id },
            data: { journalEntryId: entry.id },
          });
          bill.journalEntryId = entry.id;
        }
      }

      return bill;
    });
  }

  async findAll({ page = 1, limit = 20, q, status, statuses, clientId, supplierId, currentUser } = {}) {
    const where = { ...userCompanyFilter(currentUser) };

    if (status) where.status = status;
    if (statuses) {
      const list = String(statuses)
        .split(',')
        .map((s) => String(s).trim())
        .filter(Boolean);
      if (list.length > 0) where.status = { in: list };
    }
    if (clientId) where.clientId = clientId;
    if (supplierId) where.supplierId = supplierId;

    if (q) {
      where.OR = [
        { vendorName: { contains: q, mode: 'insensitive' } },
        { reference: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('bill', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
        supplier: { select: { id: true, supplierName: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const where = { id, ...userCompanyFilter(currentUser) };
    const bill = await this.prisma.bill.findFirst({
      where,
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
        supplier: { select: { id: true, supplierName: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        tasks: { select: { id: true, title: true, status: true, dueDate: true, priority: true } },
        allocations: {
          select: {
            id: true,
            amount: true,
            payment: { select: { id: true, paymentNumber: true, paymentDate: true, method: true, status: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const billDate = dto.billDate !== undefined ? (dto.billDate ? toDateOrNull(dto.billDate, 'billDate') : null) : undefined;
    const dueDate = dto.dueDate !== undefined ? (dto.dueDate ? toDateOrNull(dto.dueDate, 'dueDate') : null) : undefined;

    if (billDate && dueDate && dueDate < billDate) {
      throw new BadRequestException('dueDate must be on or after billDate');
    }

    const clientId = dto.clientId !== undefined ? cleanString(dto.clientId) : undefined;
    if (clientId) {
      const clientWhere = { id: clientId, ...ownerCompanyFilter(currentUser) };
      const client = await this.prisma.client.findFirst({ where: clientWhere, select: { id: true } });
      if (!client) throw new BadRequestException('clientId is invalid');
    }

    const supplierId = dto.supplierId !== undefined ? cleanString(dto.supplierId) : undefined;
    let supplier = null;
    if (supplierId) {
      const suppWhere = { id: supplierId, ...ownerCompanyFilter(currentUser) };
      supplier = await this.prisma.supplier.findFirst({ where: suppWhere, select: { id: true, supplierName: true } });
      if (!supplier) throw new BadRequestException('supplierId is invalid');
    }

    const totalAmount = dto.totalAmount !== undefined ? toDecimal(dto.totalAmount, 'totalAmount') : undefined;
    if (totalAmount && totalAmount.lte(0)) throw new BadRequestException('totalAmount must be greater than 0');

    const updated = await this.prisma.bill.update({
      where: { id },
      data: {
        ...(dto.vendorName != null ? { vendorName: String(dto.vendorName).trim() } : {}),
        ...(dto.reference !== undefined ? { reference: cleanString(dto.reference) } : {}),
        ...(dto.description !== undefined ? { description: cleanString(dto.description) } : {}),
        ...(billDate !== undefined ? { billDate } : {}),
        ...(dueDate !== undefined ? { dueDate } : {}),
        ...(dto.status != null ? { status: dto.status } : {}),
        ...(totalAmount !== undefined ? { totalAmount: String(totalAmount) } : {}),
        ...(clientId !== undefined ? { clientId } : {}),
        ...(supplierId !== undefined ? { supplierId } : {}),
      },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
        supplier: { select: { id: true, supplierName: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // If financial fields could have changed (amount or dates), recalc to enforce status engine.
    await this.prisma.$transaction(async (tx) => {
      await this.recalculateBillFinancials(tx, id);
    });

    // Preserve existing vendorName if supplierId changed but vendorName wasn't explicitly patched.
    if (supplier && dto.vendorName == null) {
      await this.prisma.bill.update({ where: { id }, data: { vendorName: supplier.supplierName } });
    }

    // Post to ledger when bill moves from DRAFT to OPEN/UNPAID (no entry yet).
    const fresh = await this.findOne(id, { currentUser });
    if (this.ledgerService && fresh && fresh.status !== 'DRAFT' && !fresh.journalEntryId) {
      await this.prisma.$transaction(async (tx) => {
        const lines = this.ledgerService.buildBillEntryLines({ totalAmount: fresh.totalAmount });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: fresh.userId,
            date: fresh.billDate || new Date(),
            memo: `Bill ${fresh.billNumber || fresh.vendorName}`,
            sourceType: 'BILL',
            sourceId: fresh.id,
            lines,
          });
          await tx.bill.update({ where: { id }, data: { journalEntryId: entry.id } });
        }
      });
      return this.findOne(id, { currentUser });
    }

    return fresh;
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const allocCount = await this.prisma.supplierPaymentAllocation.count({ where: { billId: id } });
    if (allocCount > 0) {
      throw new ConflictException('Cannot delete this bill because it has related supplier payments. Void the payment or reallocate first.');
    }

    const taskCount = await this.prisma.task.count({ where: { billId: id } });
    if (taskCount > 0) {
      throw new ConflictException('Cannot delete this bill because it has related tasks.');
    }

    await this.prisma.bill.delete({ where: { id } });
    return { ok: true };
  }
}

module.exports = { BillsService };
