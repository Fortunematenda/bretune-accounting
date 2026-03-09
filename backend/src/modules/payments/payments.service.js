const { BadRequestException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { LedgerService } = require('../ledger/ledger.service');
const { userCompanyFilter, userIdsForCompanyFilter } = require('../../common/utils/company-scope');
const { toDecimal } = require('../../common/utils/money');
const { nextPaymentNumber, nextCreditNoteNumber } = require('../../common/utils/numbering');

function clampNonNegative(decimal) {
  return decimal.lt(0) ? toDecimal('0') : decimal;
}

@Injectable()
class PaymentsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async recalculateInvoiceFinancials(tx, invoiceId) {
    const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const payments = await tx.payment.findMany({
      where: {
        status: 'COMPLETED',
        OR: [
          { invoiceId },
          { allocations: { some: { invoiceId } } },
        ],
      },
      include: { allocations: true },
    });

    let amountPaid = toDecimal('0');
    for (const p of payments) {
      if (Array.isArray(p.allocations) && p.allocations.length > 0) {
        for (const a of p.allocations) {
          if (a.invoiceId === invoiceId) {
            amountPaid = amountPaid.add(toDecimal(a.amount || '0'));
          }
        }
      } else if (p.invoiceId === invoiceId) {
        amountPaid = amountPaid.add(toDecimal(p.amount || '0'));
      }
    }

    const totalAmount = toDecimal(invoice.totalAmount);
    const rawBalanceDue = totalAmount.sub(amountPaid);
    const balanceDue = clampNonNegative(rawBalanceDue);

    let status = invoice.status;
    let paidDate = invoice.paidDate;

    if (rawBalanceDue.lte(0)) {
      status = 'PAID';
      paidDate = new Date();
    } else if (amountPaid.gt(0)) {
      status = 'PARTIALLY_PAID';
      paidDate = null;
    } else if (['PAID', 'PARTIALLY_PAID'].includes(String(invoice.status || '').toUpperCase())) {
      status = 'SENT';
      paidDate = null;
    }

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: String(amountPaid),
        balanceDue: String(balanceDue),
        status,
        paidDate,
      },
    });
  }

  async normalizeAllocations(tx, dto, amount) {
    const items = Array.isArray(dto.allocations) ? dto.allocations : null;

    if (dto.method === 'CREDIT_NOTE') {
      if (items && items.length > 0) {
        if (items.length !== 1) {
          throw new BadRequestException('Credit notes can only be applied to a single invoice');
        }
        if (!items[0]?.invoiceId) throw new BadRequestException('allocations[0].invoiceId is required');
        const creditAmt = toDecimal(items[0].amount, 'allocations[0].amount');
        if (!creditAmt.eq(amount)) {
          throw new BadRequestException('Credit note amount must match allocation amount');
        }
        return { allocations: [{ invoiceId: items[0].invoiceId, amount: String(creditAmt) }], primaryInvoiceId: items[0].invoiceId, allocated: creditAmt };
      }

      if (!dto.invoiceId) {
        throw new BadRequestException('invoiceId is required for credit notes');
      }
      return { allocations: [{ invoiceId: dto.invoiceId, amount: String(amount) }], primaryInvoiceId: dto.invoiceId, allocated: amount };
    }

    if (items && items.length > 0) {
      const allocations = [];
      let allocated = toDecimal('0');
      for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        if (!it?.invoiceId) throw new BadRequestException(`allocations[${i}].invoiceId is required`);
        const aAmt = toDecimal(it.amount, `allocations[${i}].amount`);
        if (aAmt.lte(0)) throw new BadRequestException(`allocations[${i}].amount must be greater than 0`);
        allocated = allocated.add(aAmt);
        allocations.push({ invoiceId: it.invoiceId, amount: String(aAmt) });
      }

      if (allocated.gt(amount)) {
        throw new BadRequestException('Allocated total cannot exceed payment amount');
      }

      return { allocations, primaryInvoiceId: allocations[0]?.invoiceId || null, allocated };
    }

    if (dto.invoiceId) {
      return { allocations: [{ invoiceId: dto.invoiceId, amount: String(amount) }], primaryInvoiceId: dto.invoiceId, allocated: amount };
    }

    return { allocations: [], primaryInvoiceId: null, allocated: toDecimal('0') };
  }

  async recalculateClientBalance(tx, clientId) {
    const client = await tx.client.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client not found');

    const openAgg = await tx.invoice.aggregate({
      where: {
        clientId,
        status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
      },
      _sum: { balanceDue: true },
    });

    const paidAgg = await tx.payment.aggregate({
      where: { clientId, status: 'COMPLETED', method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] } },
      _sum: { amount: true },
    });

    const outstanding = toDecimal(openAgg._sum.balanceDue || '0');
    const totalPaid = toDecimal(paidAgg._sum.amount || '0');

    const opening = toDecimal(client.openingBalance || '0');
    const credit = toDecimal(client.creditBalance || '0');

    // balance represents current AR net of credit
    const balance = opening.add(outstanding).sub(credit);

    await tx.client.update({
      where: { id: clientId },
      data: {
        totalPaid: String(totalPaid),
        balance: String(balance),
      },
    });
  }

  async create(userId, dto, { currentUser } = {}) {
    const amount = toDecimal(dto.amount, 'amount');
    if (amount.lte(0)) {
      throw new BadRequestException('amount must be greater than 0');
    }

    const clientWhere = { id: dto.clientId };
    if (currentUser?.companyName) {
      clientWhere.ownerCompanyName = { equals: (currentUser.companyName || '').trim(), mode: 'insensitive' };
    } else {
      clientWhere.ownerCompanyName = null;
    }
    const client = await this.prisma.client.findFirst({ where: clientWhere });
    if (!client) throw new BadRequestException('clientId is invalid');

    return this.prisma.$transaction(async (tx) => {
      let { allocations, primaryInvoiceId, allocated } = await this.normalizeAllocations(tx, dto, amount);

      if (allocations.length > 0) {
        const invoices = await tx.invoice.findMany({
          where: { id: { in: allocations.map((a) => a.invoiceId) } },
          select: { id: true, clientId: true, status: true, balanceDue: true },
        });
        const byId = new Map(invoices.map((i) => [i.id, i]));

        const cappedAllocations = [];
        let totalAllocated = toDecimal('0');

        for (const a of allocations) {
          const inv = byId.get(a.invoiceId);
          if (!inv) throw new NotFoundException('Invoice not found');
          if (inv.clientId !== dto.clientId) {
            throw new BadRequestException('clientId does not match invoice client');
          }

          const invStatus = String(inv.status || '').toUpperCase();
          if (['DRAFT', 'CANCELLED'].includes(invStatus)) {
            throw new BadRequestException('Cannot allocate payments to invoices in this status');
          }

          const allocAmt = toDecimal(a.amount || '0');
          const balanceDue = toDecimal(inv.balanceDue || '0');

          if (dto.method === 'CREDIT_NOTE') {
            if (['DRAFT', 'CANCELLED', 'PAID'].includes(invStatus)) {
              throw new BadRequestException('Cannot credit an invoice in this status');
            }
            if (balanceDue.lte(0)) {
              throw new BadRequestException('Invoice has no outstanding balance to credit');
            }
            if (allocAmt.gt(balanceDue)) {
              throw new BadRequestException('Credit amount cannot exceed invoice balance due');
            }
            cappedAllocations.push({ invoiceId: a.invoiceId, amount: String(allocAmt) });
            totalAllocated = totalAllocated.add(allocAmt);
          } else {
            const cappedAmt = allocAmt.gt(balanceDue) ? balanceDue : allocAmt;
            if (cappedAmt.gt(0)) {
              cappedAllocations.push({ invoiceId: a.invoiceId, amount: String(cappedAmt) });
              totalAllocated = totalAllocated.add(cappedAmt);
            }
          }
        }

        allocations.length = 0;
        allocations.push(...cappedAllocations);
        allocated = totalAllocated;
        if (cappedAllocations.length > 0) {
          primaryInvoiceId = cappedAllocations[0].invoiceId;
        }
      } else if (dto.method === 'CREDIT_NOTE') {
        throw new BadRequestException('invoiceId is required for credit notes');
      }

      const isCreditNote = dto.method === 'CREDIT_NOTE';
      const paymentNumber = isCreditNote ? await nextCreditNoteNumber(tx) : await nextPaymentNumber(tx);
      const unallocated = amount.sub(allocated);

      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId: primaryInvoiceId,
          clientId: dto.clientId,
          userId,
          amount: String(amount),
          unallocatedAmount: String(unallocated),
          status: dto.status || 'COMPLETED',
          method: dto.method,
          transactionId: dto.transactionId,
          notes: dto.notes,
          ...(dto.paymentDate ? { paymentDate: new Date(dto.paymentDate) } : {}),
        },
      });

      if (allocations.length > 0) {
        await tx.paymentAllocation.createMany({
          data: allocations.map((a) => ({
            paymentId: payment.id,
            invoiceId: a.invoiceId,
            amount: a.amount,
          })),
        });
      }

      // Update invoice amounts if payment completed
      if ((dto.status || 'COMPLETED') === 'COMPLETED') {
        if (this.ledgerService) {
          const lines = this.ledgerService.buildPaymentEntryLines({
            amount: payment.amount,
            method: dto.method,
            bankAccountCode: dto.bankAccountCode,
          });
          if (lines.length > 0) {
            const entry = await this.ledgerService.postEntry(tx, {
              createdByUserId: userId,
              date: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
              memo: `Payment ${payment.paymentNumber}`,
              sourceType: 'PAYMENT',
              sourceId: payment.id,
              lines,
            });
            await tx.payment.update({
              where: { id: payment.id },
              data: { journalEntryId: entry.id },
            });
            payment.journalEntryId = entry.id;
          }
        }

        const invoiceIds = Array.from(new Set(allocations.map((a) => a.invoiceId)));
        for (const invoiceId of invoiceIds) {
          await this.recalculateInvoiceFinancials(tx, invoiceId);
        }

        if (unallocated.gt(0)) {
          await tx.client.update({
            where: { id: dto.clientId },
            data: {
              creditBalance: {
                increment: String(unallocated),
              },
            },
          });
        }

        // Maintain running client balance + totals
        await this.recalculateClientBalance(tx, dto.clientId);
      }

      return payment;
    });
  }

  async void(userId, paymentId, { reason, currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const where = { id: paymentId, ...userIdFilter };
    const payment = await this.prisma.payment.findFirst({
      where,
      include: { allocations: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === 'VOIDED') {
      return payment;
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'VOIDED',
          voidedAt: new Date(),
          voidReason: reason || null,
        },
        include: { allocations: true },
      });

      if (payment.status === 'COMPLETED') {
        const unallocated = toDecimal(payment.unallocatedAmount || '0');
        if (unallocated.gt(0)) {
          await tx.client.update({
            where: { id: payment.clientId },
            data: {
              creditBalance: {
                decrement: String(unallocated),
              },
            },
          });
        }

        const invoiceIds = Array.from(new Set((payment.allocations || []).map((a) => a.invoiceId).filter(Boolean)));
        for (const invoiceId of invoiceIds) {
          await this.recalculateInvoiceFinancials(tx, invoiceId);
        }

        await this.recalculateClientBalance(tx, payment.clientId);
      }

      return updated;
    });
  }

  async updateAllocations(userId, paymentId, { allocations, currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const where = { id: paymentId, ...userIdFilter };
    const payment = await this.prisma.payment.findFirst({
      where,
      include: { allocations: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Only COMPLETED payments can be reallocated');
    }
    if (payment.status === 'VOIDED') {
      throw new BadRequestException('Cannot reallocate a voided payment');
    }
    if (payment.method === 'CREDIT_NOTE') {
      throw new BadRequestException('Credit note payments cannot be reallocated');
    }

    const amount = toDecimal(payment.amount || '0');
    const items = Array.isArray(allocations) ? allocations : [];
    const next = [];
    let allocated = toDecimal('0');

    for (let i = 0; i < items.length; i += 1) {
      const it = items[i];
      if (!it?.invoiceId) throw new BadRequestException(`allocations[${i}].invoiceId is required`);
      const aAmt = toDecimal(it.amount, `allocations[${i}].amount`);
      if (aAmt.lte(0)) throw new BadRequestException(`allocations[${i}].amount must be greater than 0`);
      allocated = allocated.add(aAmt);
      next.push({ invoiceId: it.invoiceId, amount: String(aAmt) });
    }

    if (allocated.gt(amount)) {
      throw new BadRequestException('Allocated total cannot exceed payment amount');
    }

    const invoiceIds = Array.from(new Set(next.map((a) => a.invoiceId)));
    if (invoiceIds.length > 0) {
      const prevAllocByInvoiceId = new Map();
      for (const a of Array.isArray(payment.allocations) ? payment.allocations : []) {
        const key = a.invoiceId;
        const prev = prevAllocByInvoiceId.get(key) || toDecimal('0');
        prevAllocByInvoiceId.set(key, prev.add(toDecimal(a.amount || '0')));
      }

      const invoices = await this.prisma.invoice.findMany({
        where: { id: { in: invoiceIds } },
        select: { id: true, clientId: true, status: true, balanceDue: true },
      });
      const byId = new Map(invoices.map((i) => [i.id, i]));

      const cappedNext = [];
      for (const a of next) {
        const inv = byId.get(a.invoiceId);
        if (!inv) throw new NotFoundException('Invoice not found');
        if (inv.clientId !== payment.clientId) {
          throw new BadRequestException('Invoice client does not match payment client');
        }

        const invStatus = String(inv.status || '').toUpperCase();
        if (['DRAFT', 'CANCELLED'].includes(invStatus)) {
          throw new BadRequestException('Cannot allocate payments to invoices in this status');
        }

        const allocAmt = toDecimal(a.amount || '0');
        const balanceDue = toDecimal(inv.balanceDue || '0');
        const prevAlloc = prevAllocByInvoiceId.get(a.invoiceId) || toDecimal('0');
        const allowed = balanceDue.add(prevAlloc);
        const cappedAmt = allocAmt.gt(allowed) ? allowed : allocAmt;
        if (cappedAmt.gt(0)) {
          cappedNext.push({ invoiceId: a.invoiceId, amount: String(cappedAmt) });
        }
      }
      next.length = 0;
      next.push(...cappedNext);
    }

    const cappedAllocated = next.reduce((sum, a) => sum.add(toDecimal(a.amount || '0')), toDecimal('0'));

    const newUnallocated = amount.sub(cappedAllocated);
    const oldUnallocated = toDecimal(payment.unallocatedAmount || '0');
    const delta = newUnallocated.sub(oldUnallocated);

    return this.prisma.$transaction(async (tx) => {
      if (!delta.eq(0)) {
        if (delta.gt(0)) {
          await tx.client.update({
            where: { id: payment.clientId },
            data: { creditBalance: { increment: String(delta) } },
          });
        } else {
          await tx.client.update({
            where: { id: payment.clientId },
            data: { creditBalance: { decrement: String(delta.abs()) } },
          });
        }
      }

      await tx.paymentAllocation.deleteMany({ where: { paymentId } });
      if (next.length > 0) {
        await tx.paymentAllocation.createMany({
          data: next.map((a) => ({ paymentId, invoiceId: a.invoiceId, amount: a.amount })),
        });
      }

      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: {
          invoiceId: next[0]?.invoiceId || null,
          unallocatedAmount: String(newUnallocated),
        },
        include: { allocations: true },
      });

      const affected = new Set([
        ...(payment.allocations || []).map((a) => a.invoiceId),
        ...invoiceIds,
      ]);
      for (const invId of Array.from(affected).filter(Boolean)) {
        await this.recalculateInvoiceFinancials(tx, invId);
      }
      await this.recalculateClientBalance(tx, payment.clientId);

      return updated;
    });
  }

  async findAll(query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const userIdFilter = await userIdsForCompanyFilter(this.prisma, query.currentUser);
    const where = { ...userIdFilter };
    if (query.clientId) where.clientId = query.clientId;
    if (query.invoiceId) {
      where.OR = [
        { invoiceId: query.invoiceId },
        { allocations: { some: { invoiceId: query.invoiceId } } },
      ];
    }
    if (query.status) where.status = query.status;

    if (query.q) {
      const qOr = [
        { paymentNumber: { contains: query.q, mode: 'insensitive' } },
        { transactionId: { contains: query.q, mode: 'insensitive' } },
        { notes: { contains: query.q, mode: 'insensitive' } },
      ];

      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: qOr }];
        delete where.OR;
      } else {
        where.OR = qOr;
      }
    }

    return this.prisma.paginate('payment', {
      page,
      limit,
      where,
      include: {
        allocations: {
          select: {
            id: true,
            invoiceId: true,
            amount: true,
            invoice: { select: { id: true, invoiceNumber: true } },
          },
        },
        client: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }
}

module.exports = { PaymentsService };
