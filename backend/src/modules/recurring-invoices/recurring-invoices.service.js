const {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { calculateDocumentTotals, toDecimal } = require('../../common/utils/money');
const { nextInvoiceNumber } = require('../../common/utils/numbering');
const { userCompanyFilter, ownerCompanyFilter } = require('../../common/utils/company-scope');

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

function addFrequency(date, frequency, intervalValue) {
  const d = new Date(date);
  const i = Number(intervalValue || 1);

  switch (frequency) {
    case 'DAILY':
      d.setDate(d.getDate() + i);
      break;
    case 'WEEKLY':
      d.setDate(d.getDate() + 7 * i);
      break;
    case 'BI_WEEKLY':
      d.setDate(d.getDate() + 14 * i);
      break;
    case 'MONTHLY':
      d.setMonth(d.getMonth() + i);
      break;
    case 'QUARTERLY':
      d.setMonth(d.getMonth() + 3 * i);
      break;
    case 'YEARLY':
      d.setFullYear(d.getFullYear() + i);
      break;
    default:
      throw new BadRequestException('Invalid recurring frequency');
  }

  return d;
}

@Injectable()
class RecurringInvoicesService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(userId, dto, { currentUser } = {}) {
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    const nextRunDate = new Date(dto.nextRunDate);

    if (Number.isNaN(startDate.getTime())) throw new BadRequestException('startDate must be a valid date');
    if (endDate && Number.isNaN(endDate.getTime())) throw new BadRequestException('endDate must be a valid date');
    if (Number.isNaN(nextRunDate.getTime())) throw new BadRequestException('nextRunDate must be a valid date');

    if (endDate && endDate < startDate) {
      throw new BadRequestException('endDate must be on or after startDate');
    }

    if (nextRunDate < startDate) {
      throw new BadRequestException('nextRunDate must be on or after startDate');
    }

    const clientWhere = { id: dto.clientId, ...ownerCompanyFilter(currentUser) };
    const client = await this.prisma.client.findFirst({ where: clientWhere });
    if (!client) throw new BadRequestException('clientId is invalid');

    const itemsForTotals = (dto.items || []).map((i) => ({
      ...i,
      taxRate:
        client.taxType === 'VAT_REGISTERED'
          ? i.taxRate
          : '0',
    }));

    const totals = calculateDocumentTotals(itemsForTotals);

    return this.prisma.$transaction(async (tx) => {
      const recurring = await tx.recurringInvoice.create({
        data: {
          clientId: dto.clientId,
          userId,
          templateName: dto.templateName,
          frequency: dto.frequency,
          intervalValue: dto.intervalValue || 1,
          startDate,
          endDate,
          nextRunDate,
          isActive: dto.isActive !== false,
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

      return recurring;
    });
  }

  async findAll(query, { currentUser } = {}) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const where = { ...userCompanyFilter(currentUser) };
    if (query.clientId) where.clientId = query.clientId;
    if (query.isActive != null) where.isActive = String(query.isActive).toLowerCase() === 'true';
    if (query.q) {
      where.OR = [
        { templateName: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('recurringInvoice', {
      page,
      limit,
      where,
      orderBy: { id: 'asc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const recurring = await this.prisma.recurringInvoice.findFirst({
      where: { id, ...userCompanyFilter(currentUser) },
      include: {
        items: true,
        client: true,
        invoices: { select: { id: true, invoiceNumber: true, status: true, issueDate: true, totalAmount: true } },
      },
    });

    if (!recurring) throw new NotFoundException('Recurring invoice not found');
    return recurring;
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const startDate = dto.startDate ? new Date(dto.startDate) : null;
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    const nextRunDate = dto.nextRunDate ? new Date(dto.nextRunDate) : null;

    if (startDate && Number.isNaN(startDate.getTime())) throw new BadRequestException('startDate must be a valid date');
    if (endDate && Number.isNaN(endDate.getTime())) throw new BadRequestException('endDate must be a valid date');
    if (nextRunDate && Number.isNaN(nextRunDate.getTime())) throw new BadRequestException('nextRunDate must be a valid date');

    const totals = dto.items ? calculateDocumentTotals(dto.items) : null;

    return this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.recurringInvoiceItem.deleteMany({ where: { recurringInvoiceId: id } });
      }

      const updated = await tx.recurringInvoice.update({
        where: { id, ...userCompanyFilter(currentUser) },
        data: {
          clientId: dto.clientId,
          templateName: dto.templateName,
          frequency: dto.frequency,
          intervalValue: dto.intervalValue,
          startDate: startDate || undefined,
          endDate: endDate === null ? undefined : endDate,
          nextRunDate: nextRunDate || undefined,
          isActive: dto.isActive,
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

  async pause(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    return this.prisma.recurringInvoice.update({
      where: { id, ...userCompanyFilter(currentUser) },
      data: { isActive: false },
    });
  }

  async resume(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    return this.prisma.recurringInvoice.update({
      where: { id, ...userCompanyFilter(currentUser) },
      data: { isActive: true },
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    return this.prisma.$transaction(async (tx) => {
      await tx.invoice.updateMany({
        where: { recurringInvoiceId: id },
        data: { recurringInvoiceId: null },
      });

      await tx.recurringInvoice.delete({ where: { id, ...userCompanyFilter(currentUser) } });
      return { success: true };
    });
  }

  async runDue(userId) {
    const now = new Date();
    const dueTemplates = await this.prisma.recurringInvoice.findMany({
      where: {
        isActive: true,
        nextRunDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: {
        client: true,
        items: true,
      },
    });

    let created = 0;

    await this.prisma.$transaction(async (tx) => {
      for (const template of dueTemplates) {
        // Idempotency guard: do not generate more than 1 invoice per template per day
        const existing = await tx.invoice.findFirst({
          where: {
            recurringInvoiceId: template.id,
            issueDate: { gte: startOfDay(now), lte: endOfDay(now) },
          },
          select: { id: true },
        });

        if (existing) {
          await tx.recurringInvoiceRun.create({
            data: {
              recurringInvoiceId: template.id,
              status: 'FAILED',
              attempt: 1,
              error: 'Skipped: already generated invoice for this template today',
            },
          });

          const next = addFrequency(template.nextRunDate, template.frequency, template.intervalValue);
          await tx.recurringInvoice.update({
            where: { id: template.id },
            data: {
              lastGenerated: now,
              nextRunDate: next,
            },
          });

          continue;
        }

        const issueDate = now;
        const dueDate = addDays(issueDate, template.client?.paymentTermsDays || 30);

        const totals = calculateDocumentTotals(
          template.items.map((i) => ({
            productId: i.productId,
            description: i.description,
            quantity: String(i.quantity),
            unitPrice: String(i.unitPrice),
            discount: String(i.discount),
            taxRate: String(i.taxRate),
          })),
        );

        let invoice;
        try {
          invoice = await tx.invoice.create({
          data: {
            invoiceNumber: await nextInvoiceNumber(tx),
            clientId: template.clientId,
            userId: userId || template.userId,
            recurringInvoiceId: template.id,
            status: 'DRAFT',
            issueDate,
            dueDate,
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
        });
        } catch (e) {
          await tx.recurringInvoiceRun.create({
            data: {
              recurringInvoiceId: template.id,
              status: 'FAILED',
              attempt: 1,
              error: e.message,
            },
          });
          continue;
        }

        created += 1;

        await tx.recurringInvoiceRun.create({
          data: {
            recurringInvoiceId: template.id,
            status: 'SUCCESS',
            attempt: 1,
            invoiceId: invoice.id,
          },
        });

        // Queue email (auto-email)
        const to = template.client?.email;
        if (to) {
          const subject = `Invoice ${invoice.invoiceNumber} from Bretune Accounting`;
          const body = `<p>Hello ${template.client?.contactName || ''},</p><p>Your invoice <strong>${invoice.invoiceNumber}</strong> has been generated.</p><p>Total: ${invoice.totalAmount}</p><p>Thank you,<br/>Bretune Accounting</p>`;

          await tx.emailOutbox.create({
            data: {
              documentType: 'INVOICE',
              invoiceId: invoice.id,
              clientId: template.clientId,
              to,
              subject,
              body,
              status: 'PENDING',
              attempts: 0,
              nextAttemptAt: new Date(),
            },
          });
        }

        const next = addFrequency(template.nextRunDate, template.frequency, template.intervalValue);

        await tx.recurringInvoice.update({
          where: { id: template.id },
          data: {
            lastGenerated: now,
            nextRunDate: next,
          },
        });
      }
    });

    return { templatesProcessed: dueTemplates.length, invoicesCreated: created };
  }
}

module.exports = { RecurringInvoicesService };
