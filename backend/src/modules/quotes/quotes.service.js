const {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { calculateDocumentTotals } = require('../../common/utils/money');
const { userCompanyFilter } = require('../../common/utils/company-scope');
const { nextInvoiceNumber, nextQuoteNumber, peekNextQuoteNumber } = require('../../common/utils/numbering');

@Injectable()
class QuotesService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(userId, dto, { currentUser } = {}) {
    const expiry = new Date(dto.expiryDate);
    if (Number.isNaN(expiry.getTime())) {
      throw new BadRequestException('expiryDate must be a valid date');
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

    const totals = calculateDocumentTotals(itemsForTotals);

    return this.prisma.$transaction(async (tx) => {
      const quoteNumber = await nextQuoteNumber(tx);
      const quote = await tx.quote.create({
        data: {
          quoteNumber,
          clientId: dto.clientId,
          userId,
          status: 'DRAFT',
          expiryDate: expiry,
          notes: dto.notes,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          totalAmount: totals.totalAmount,
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

      return quote;
    });
  }

  async findAll(query) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const where = { ...userCompanyFilter(query.currentUser) };
    if (query.clientId) where.clientId = query.clientId;
    if (query.status) where.status = query.status;

    if (query.q) {
      where.OR = [
        { quoteNumber: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('quote', {
      page,
      limit,
      where,
      orderBy: { id: 'asc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true, email: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const where = { id, ...userCompanyFilter(currentUser) };
    const quote = await this.prisma.quote.findFirst({
      where,
      include: {
        items: { include: { product: { select: { name: true, sku: true } } } },
        client: true,
        user: { select: { companyName: true } },
        invoice: { select: { id: true, invoiceNumber: true, status: true } },
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async getNextQuoteNumber() {
    return peekNextQuoteNumber(this.prisma);
  }

  async update(id, dto, { currentUser } = {}) {
    const quote = await this.findOne(id, { currentUser });

    const expiry = dto.expiryDate ? new Date(dto.expiryDate) : quote.expiryDate;
    if (dto.expiryDate && Number.isNaN(expiry.getTime())) {
      throw new BadRequestException('expiryDate must be a valid date');
    }

    const totals = dto.items ? calculateDocumentTotals(dto.items) : null;

    return this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.quoteItem.deleteMany({ where: { quoteId: id } });
      }

      const updated = await tx.quote.update({
        where: { id },
        data: {
          clientId: dto.clientId,
          expiryDate: expiry,
          notes: dto.notes,
          ...(totals
            ? {
                subtotal: totals.subtotal,
                taxAmount: totals.taxAmount,
                totalAmount: totals.totalAmount,
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
    const quote = await this.findOne(id, { currentUser });
    if (quote.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT quotes can be sent');
    }

    if (new Date() > new Date(quote.expiryDate)) {
      throw new BadRequestException('Cannot send an expired quote');
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'SENT' },
    });
  }

  async accept(id, { currentUser } = {}) {
    const quote = await this.findOne(id, { currentUser });
    if (quote.status !== 'SENT') {
      throw new BadRequestException('Only SENT quotes can be accepted');
    }

    if (new Date() > new Date(quote.expiryDate)) {
      return this.prisma.quote.update({
        where: { id },
        data: { status: 'EXPIRED' },
      });
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });
  }

  async reject(id, { currentUser } = {}) {
    const quote = await this.findOne(id, { currentUser });
    if (quote.status !== 'SENT') {
      throw new BadRequestException('Only SENT quotes can be rejected');
    }

    if (new Date() > new Date(quote.expiryDate)) {
      return this.prisma.quote.update({
        where: { id },
        data: { status: 'EXPIRED' },
      });
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async convertToInvoice(id, userId, { currentUser } = {}) {
    const quote = await this.findOne(id, { currentUser });
    if (!quote) throw new NotFoundException('Quote not found');
    
    const quoteWithItems = await this.prisma.quote.findUnique({
      where: { id },
      include: { items: true, client: true, invoice: true },
    });
    const quoteData = quoteWithItems || quote;

    if (quoteData.status !== 'ACCEPTED') {
      throw new BadRequestException('Only ACCEPTED quotes can be converted to invoice');
    }

    if (quoteData.invoice) {
      throw new BadRequestException('This quote is already linked to an invoice');
    }

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    const terms = quoteData.client?.paymentTermsDays != null ? quoteData.client.paymentTermsDays : 30;
    dueDate.setDate(dueDate.getDate() + Number(terms));

    return this.prisma.$transaction(async (tx) => {
      const invoiceNumber = await nextInvoiceNumber(tx);
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: quoteData.clientId,
          userId,
          quoteId: quoteData.id,
          status: 'DRAFT',
          issueDate,
          dueDate,
          notes: quoteData.notes,
          subtotal: quoteData.subtotal,
          taxAmount: quoteData.taxAmount,
          totalAmount: quoteData.totalAmount,
          amountPaid: '0.00',
          balanceDue: quoteData.totalAmount,
          items: {
            create: (quoteData.items || []).map((i) => ({
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

      return invoice;
    });
  }
}

module.exports = { QuotesService };
