const {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { calculateDocumentTotals, toDecimal } = require('../../common/utils/money');
const { userCompanyFilter, userIdsForCompanyFilter } = require('../../common/utils/company-scope');
const { nextInvoiceNumber, peekNextInvoiceNumber } = require('../../common/utils/numbering');
const { PlanLimitService } = require('../subscriptions/plan-limit.service');
const { LedgerService } = require('../ledger/ledger.service');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

@Injectable()
class InvoicesService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(PlanLimitService) planLimitService = null,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.planLimitService = planLimitService;
    this.ledgerService = ledgerService;
  }

  async create(userId, dto, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceCreateInvoice(currentUser);
    }

    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date();
    if (Number.isNaN(issueDate.getTime())) {
      throw new BadRequestException('issueDate must be a valid date');
    }

    const clientWhere = { id: dto.clientId };
    if (currentUser?.companyName) {
      clientWhere.ownerCompanyName = { equals: (currentUser.companyName || '').trim(), mode: 'insensitive' };
    } else {
      clientWhere.ownerCompanyName = null;
    }
    const client = await this.prisma.client.findFirst({ where: clientWhere });
    if (!client) {
      throw new BadRequestException('clientId is invalid');
    }

    const itemsForTotals = (dto.items || []).map((i) => ({
      ...i,
      taxRate:
        client.taxType === 'VAT_REGISTERED'
          ? i.taxRate
          : '0',
    }));

    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : addDays(issueDate, client.paymentTermsDays || 30);

    if (Number.isNaN(dueDate.getTime())) {
      throw new BadRequestException('dueDate must be a valid date');
    }

    if (dueDate < issueDate) {
      throw new BadRequestException('dueDate must be on or after issueDate');
    }

    const totals = calculateDocumentTotals(itemsForTotals);
    const status = dto.send ? 'SENT' : 'DRAFT';

    return this.prisma.$transaction(async (tx) => {
      const invoiceNumber = await nextInvoiceNumber(tx);

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: dto.clientId,
          userId,
          status,
          issueDate,
          dueDate,
          notes: dto.notes,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          totalAmount: totals.totalAmount,
          amountPaid: '0.00',
          balanceDue: totals.totalAmount,
          items: {
            create: totals.items.map((i) => ({
              productId: i.productId,
              description: i.description,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              discount: i.discount,
              taxRate: i.taxRate,
              total: i.total,
            })),
          },
        },
        include: { items: true },
      });

      if (status === 'SENT' && this.ledgerService) {
        const lines = this.ledgerService.buildInvoiceEntryLines({
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          totalAmount: totals.totalAmount,
        });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: userId,
            date: issueDate,
            memo: `Invoice ${invoiceNumber}`,
            sourceType: 'INVOICE',
            sourceId: invoice.id,
            lines,
          });
          await tx.invoice.update({
            where: { id: invoice.id },
            data: { journalEntryId: entry.id },
          });
          invoice.journalEntryId = entry.id;
        }
      }

      return invoice;
    });
  }

  async getNextInvoiceNumber() {
    return peekNextInvoiceNumber(this.prisma);
  }

  async findAll(query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const userIdFilter = await userIdsForCompanyFilter(this.prisma, query.currentUser);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    await this.prisma.invoice.updateMany({
      where: {
        ...userIdFilter,
        status: { in: ['SENT', 'PARTIALLY_PAID'] },
        dueDate: { lt: todayStart },
        balanceDue: { gt: toDecimal('0') },
      },
      data: { status: 'OVERDUE' },
    });

    const where = { ...userIdFilter };
    if (query.clientId) where.clientId = query.clientId;
    if (query.status) where.status = query.status;

    if (query.q) {
      where.OR = [
        { invoiceNumber: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.overdue === 'true') {
      where.dueDate = { lt: todayStart };
      where.balanceDue = { gt: toDecimal('0') };
      where.status = { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] };
    }

    return this.prisma.paginate('invoice', {
      page,
      limit,
      where,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const where = { id, ...userIdFilter };
    const invoice = await this.prisma.invoice.findFirst({
      where,
      include: {
        items: { include: { product: { select: { name: true, sku: true } } } },
        payments: { include: { allocations: true } },
        client: true,
        user: { select: { companyName: true } },
        quote: { select: { id: true, quoteNumber: true, status: true } },
        recurringInvoice: { select: { id: true, templateName: true, frequency: true } },
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id, dto, { currentUser } = {}) {
    const invoice = await this.findOne(id, { currentUser });

    const issueDate = dto.issueDate ? new Date(dto.issueDate) : invoice.issueDate;
    if (dto.issueDate && Number.isNaN(issueDate.getTime())) {
      throw new BadRequestException('issueDate must be a valid date');
    }

    const dueDate = dto.dueDate ? new Date(dto.dueDate) : invoice.dueDate;
    if (dto.dueDate && Number.isNaN(dueDate.getTime())) {
      throw new BadRequestException('dueDate must be a valid date');
    }

    if (dueDate < issueDate) {
      throw new BadRequestException('dueDate must be on or after issueDate');
    }

    const totals = dto.items ? calculateDocumentTotals(dto.items) : null;

    return this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      }

      const updated = await tx.invoice.update({
        where: { id },
        data: {
          clientId: dto.clientId,
          issueDate,
          dueDate,
          notes: dto.notes,
          ...(totals
            ? {
                subtotal: totals.subtotal,
                taxAmount: totals.taxAmount,
                totalAmount: totals.totalAmount,
                balanceDue: totals.totalAmount,
                amountPaid: '0.00',
                items: {
                  create: totals.items.map((i) => ({
                    productId: i.productId,
                    description: i.description,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    discount: i.discount,
                    taxRate: i.taxRate,
                    total: i.total,
                  })),
                },
              }
            : {}),
        },
        include: { items: true },
      });

      return updated;
    });
  }

  async send(id, { currentUser } = {}) {
    const invoice = await this.findOne(id, { currentUser });
    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT invoices can be sent');
    }

    return this.prisma.$transaction(async (tx) => {
      let journalEntryId = null;
      if (this.ledgerService) {
        const lines = this.ledgerService.buildInvoiceEntryLines({
          subtotal: invoice.subtotal,
          taxAmount: invoice.taxAmount,
          totalAmount: invoice.totalAmount,
        });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: invoice.userId,
            date: invoice.issueDate,
            memo: `Invoice ${invoice.invoiceNumber}`,
            sourceType: 'INVOICE',
            sourceId: id,
            lines,
          });
          journalEntryId = entry.id;
        }
      }

      return tx.invoice.update({
        where: { id },
        data: { status: 'SENT', ...(journalEntryId ? { journalEntryId } : {}) },
        include: { items: true, client: true },
      });
    });
  }

  async cancel(id, { currentUser } = {}) {
    const invoice = await this.findOne(id, { currentUser });
    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT invoices can be cancelled');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async recalculate(id, { currentUser } = {}) {
    const invoice = await this.findOne(id, { currentUser });

    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT invoices can be recalculated');
    }

    const items = invoice?.items || [];
    const totals = calculateDocumentTotals(
      items.map((i) => ({
        productId: i.productId,
        description: i.description,
        quantity: String(i.quantity),
        unitPrice: String(i.unitPrice),
        discount: String(i.discount),
        taxRate: String(i.taxRate),
      })),
    );

    return this.prisma.invoice.update({
      where: { id },
      data: {
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        balanceDue: totals.totalAmount,
        amountPaid: '0.00',
      },
    });
  }

  async markOverdue({ currentUser } = {}) {
    const now = new Date();
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);

    const updated = await this.prisma.invoice.updateMany({
      where: {
        ...userIdFilter,
        status: { in: ['SENT', 'PARTIALLY_PAID'] },
        dueDate: { lt: now },
        balanceDue: { gt: toDecimal('0') },
      },
      data: { status: 'OVERDUE' },
    });

    return { updated: updated.count };
  }
}

module.exports = { InvoicesService };
