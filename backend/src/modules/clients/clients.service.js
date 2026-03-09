const {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  BadRequestException,
} = require('@nestjs/common');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { PrismaService } = require('../../config/prisma.service');
const { ownerCompanyFilter, getOwnerCompany } = require('../../common/utils/company-scope');
const { PlanLimitService } = require('../subscriptions/plan-limit.service');

@Injectable()
class ClientsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(PlanLimitService) planLimitService = null,
  ) {
    this.prisma = prismaService;
    this.planLimitService = planLimitService;
  }

  documentsBaseDir() {
    return path.resolve(process.cwd(), 'uploads', 'customer-documents');
  }

  resolveDocumentPath(storageKey) {
    const parts = String(storageKey || '')
      .split('/')
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => p !== '.' && p !== '..');
    return path.join(this.documentsBaseDir(), ...parts);
  }

  async assertClientAccess(id, { currentUser } = {}) {
    const client = await this.prisma.client.findFirst({
      where: { id, ...ownerCompanyFilter(currentUser) },
      select: { id: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async create(data, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceCreateClient(currentUser);
    }

    const ownerCompany = getOwnerCompany(currentUser);
    const openingBalance = data.openingBalance != null ? data.openingBalance : '0.00';
    const creditLimit = data.creditLimit != null ? data.creditLimit : '0.00';

    const contactName = String(data.contactName || '').trim();
    const companyNameRaw = data.companyName != null ? String(data.companyName).trim() : '';
    const companyName = companyNameRaw ? companyNameRaw : null;

    const emailRaw = data.email != null ? String(data.email).trim() : '';
    const email = emailRaw || null;
    const phone = data.phone != null && String(data.phone).trim() ? String(data.phone).trim() : null;

    const address = data.address != null && String(data.address).trim() ? String(data.address).trim() : null;
    const city = data.city != null && String(data.city).trim() ? String(data.city).trim() : null;
    const state = data.state != null && String(data.state).trim() ? String(data.state).trim() : null;
    const country = data.country != null && String(data.country).trim() ? String(data.country).trim() : null;
    const postalCode = data.postalCode != null && String(data.postalCode).trim() ? String(data.postalCode).trim() : null;
    const taxNumber = data.taxNumber != null && String(data.taxNumber).trim() ? String(data.taxNumber).trim() : null;

    const paymentTermsDays =
      data.paymentTermsDays != null && data.paymentTermsDays !== ''
        ? Number(data.paymentTermsDays)
        : 30;

    // Email is unique per company - no duplicate emails within the same owner company
    if (email) {
      const parseEmails = (s) =>
        !s ? [] : String(s).split(/[,;]/).map((e) => e.trim().toLowerCase()).filter(Boolean);
      const newEmails = parseEmails(email);
      if (newEmails.length > 0) {
        const others = await this.prisma.client.findMany({
          where: ownerCompanyFilter(currentUser),
          select: { email: true },
        });
        const existing = new Set();
        others.forEach((c) => parseEmails(c?.email).forEach((e) => existing.add(e)));
        const dup = newEmails.find((e) => existing.has(e));
        if (dup) {
          throw new ConflictException('A client with this email already exists in your company.');
        }
      }
    }

    try {
      return await this.prisma.client.create({
        data: {
          type: data.type,
          companyName,
          contactName,
          email,
          phone,
          address,
          city,
          state,
          country,
          postalCode,
          taxType: data.taxType,
          taxNumber,
          status: data.status,
          paymentTermsDays,
          notes: data.notes,
          openingBalance,
          balance: openingBalance,
          creditLimit,
          ownerCompanyName: ownerCompany,
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new ConflictException('User exists');
      }
      throw e;
    }
  }

  async findAll({ page = 1, limit = 20, q, status, currentUser } = {}) {
    const where = { ...ownerCompanyFilter(currentUser) };

    if (status) {
      where.status = status;
    }

    if (q) {
      const isSingleLetter = /^[a-zA-Z]$/.test(String(q).trim());
      if (isSingleLetter) {
        const letter = String(q).trim().toLowerCase();
        where.OR = [
          { contactName: { startsWith: letter, mode: 'insensitive' } },
          { companyName: { startsWith: letter, mode: 'insensitive' } },
        ];
      } else {
        where.OR = [
          { contactName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
        ];
      }
    }

    const res = await this.prisma.paginate('client', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });

    const ids = (res?.data || []).map((c) => c.id).filter(Boolean);
    if (ids.length === 0) return res;

    const [invoiceTotals, invoiceOutstanding, paymentTotals] = await Promise.all([
      this.prisma.invoice.groupBy({
        by: ['clientId'],
        where: {
          clientId: { in: ids },
          status: { notIn: ['DRAFT', 'CANCELLED'] },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.invoice.groupBy({
        by: ['clientId'],
        where: {
          clientId: { in: ids },
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: 0 },
        },
        _sum: { balanceDue: true },
      }),
      this.prisma.payment.groupBy({
        by: ['clientId'],
        where: {
          clientId: { in: ids },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
    ]);

    const invoicedMap = new Map(invoiceTotals.map((r) => [r.clientId, Number(r?._sum?.totalAmount || 0)]));
    const dueMap = new Map(invoiceOutstanding.map((r) => [r.clientId, Number(r?._sum?.balanceDue || 0)]));
    const paidMap = new Map(paymentTotals.map((r) => [r.clientId, Number(r?._sum?.amount || 0)]));

    res.data = (res.data || []).map((c) => {
      const opening = Number(c?.openingBalance || 0);
      const due = dueMap.get(c.id) || 0;
      const credit = Number(c?.creditBalance || 0);
      return {
        ...c,
        totalInvoiced: invoicedMap.get(c.id) || 0,
        totalPaid: paidMap.get(c.id) || 0,
        balance: opening + due - credit,
        creditBalance: credit,
      };
    });

    return res;
  }

  async findOne(id, { currentUser } = {}) {
    const where = { id, ...ownerCompanyFilter(currentUser) };
    const client = await this.prisma.client.findFirst({
      where,
      include: {
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            issueDate: true,
            dueDate: true,
            totalAmount: true,
            balanceDue: true,
          },
        },
        quotes: {
          select: {
            id: true,
            quoteNumber: true,
            status: true,
            issueDate: true,
            expiryDate: true,
            totalAmount: true,
          },
        },
        payments: { select: { id: true, paymentNumber: true, amount: true, status: true, paymentDate: true, invoiceId: true, method: true } },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const invoices = Array.isArray(client.invoices) ? client.invoices : [];
    const payments = Array.isArray(client.payments) ? client.payments : [];

    const totalInvoiced = invoices
      .filter((i) => {
        const s = String(i?.status || '').toUpperCase();
        return s !== 'DRAFT' && s !== 'CANCELLED';
      })
      .reduce((sum, i) => sum + Number(i?.totalAmount || 0), 0);

    const dueTotal = invoices
      .filter((i) => {
        const s = String(i?.status || '').toUpperCase();
        return s === 'SENT' || s === 'OVERDUE' || s === 'PARTIALLY_PAID';
      })
      .reduce((sum, i) => sum + Number(i?.balanceDue || 0), 0);

    const totalPaid = payments
      .filter((p) => String(p?.status || '').toUpperCase() === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p?.amount || 0), 0);

    const opening = Number(client?.openingBalance || 0);
    const credit = Number(client?.creditBalance || 0);

    return {
      ...client,
      totalInvoiced,
      totalPaid,
      balance: opening + dueTotal - credit,
      creditBalance: credit,
    };
  }

  async listDocuments(clientId, { currentUser } = {}) {
    await this.assertClientAccess(clientId, { currentUser });
    return this.prisma.customerDocument.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clientId: true,
        originalName: true,
        description: true,
        mimeType: true,
        size: true,
        uploadedByUserId: true,
        createdAt: true,
      },
    });
  }

  async uploadDocument(clientId, file, dto = {}, { currentUser } = {}) {
    await this.assertClientAccess(clientId, { currentUser });
    const originalName = file?.originalname != null ? String(file.originalname) : 'document';
    const descriptionRaw = dto?.description != null ? String(dto.description).trim() : '';
    const description = descriptionRaw ? descriptionRaw : null;
    const mimeType = file?.mimetype != null ? String(file.mimetype) : 'application/octet-stream';
    const size = Number(file?.size || (file?.buffer ? file.buffer.length : 0));
    if (!file?.buffer || size <= 0) throw new BadRequestException('File is required');

    const extRaw = path.extname(originalName || '').slice(0, 10);
    const uuid = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const storageKey = `${clientId}/${uuid}${extRaw || ''}`;
    const targetPath = this.resolveDocumentPath(storageKey);
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });

    await fs.promises.writeFile(targetPath, file.buffer);

    try {
      return await this.prisma.customerDocument.create({
        data: {
          clientId,
          originalName,
          description,
          mimeType,
          size,
          storageKey,
          uploadedByUserId: currentUser?.id || null,
        },
        select: {
          id: true,
          clientId: true,
          originalName: true,
          description: true,
          mimeType: true,
          size: true,
          uploadedByUserId: true,
          createdAt: true,
        },
      });
    } catch (e) {
      try {
        await fs.promises.unlink(targetPath);
      } catch {
        // ignore
      }
      throw e;
    }
  }

  async downloadDocument(clientId, documentId, res, { currentUser } = {}) {
    await this.assertClientAccess(clientId, { currentUser });
    const doc = await this.prisma.customerDocument.findFirst({
      where: { id: documentId, clientId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const filePath = this.resolveDocumentPath(doc.storageKey);
    try {
      await fs.promises.access(filePath);
    } catch {
      throw new NotFoundException('Document file not found');
    }

    const fileName = doc.originalName || `customer-document-${doc.id}`;
    res.status(200);
    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName.replace(/\"/g, '')}"`);

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      try {
        res.status(500).end();
      } catch {
        // ignore
      }
    });
    stream.pipe(res);
  }

  async deleteDocument(clientId, documentId, { currentUser } = {}) {
    await this.assertClientAccess(clientId, { currentUser });
    const doc = await this.prisma.customerDocument.findFirst({
      where: { id: documentId, clientId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    await this.prisma.customerDocument.delete({ where: { id: doc.id } });
    const filePath = this.resolveDocumentPath(doc.storageKey);
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // ignore
    }
    return { ok: true };
  }

  async update(id, data, { currentUser } = {}) {
    const current = await this.findOne(id, { currentUser });

    const emailRaw = data.email != null ? String(data.email).trim() : undefined;
    const email = emailRaw !== undefined ? (emailRaw || null) : undefined;
    const phone = data.phone != null ? (String(data.phone).trim() ? String(data.phone).trim() : null) : undefined;

    const paymentTermsDays =
      data.paymentTermsDays != null && data.paymentTermsDays !== ''
        ? Number(data.paymentTermsDays)
        : undefined;

    const nextContactName = data.contactName != null ? String(data.contactName).trim() : String(current?.contactName || '').trim();
    const nextCompanyNameRaw = data.companyName != null ? String(data.companyName).trim() : (current?.companyName != null ? String(current.companyName).trim() : '');
    const nextCompanyName = nextCompanyNameRaw ? nextCompanyNameRaw : null;
    const nextEmail = email !== undefined ? email : (current?.email ? String(current.email).trim() : null);
    const nextPhone = phone !== undefined ? phone : (current?.phone != null && String(current.phone).trim() ? String(current.phone).trim() : null);

    const nextAddress = data.address != null ? (String(data.address).trim() ? String(data.address).trim() : null) : (current?.address != null && String(current.address).trim() ? String(current.address).trim() : null);
    const nextCity = data.city != null ? (String(data.city).trim() ? String(data.city).trim() : null) : (current?.city != null && String(current.city).trim() ? String(current.city).trim() : null);
    const nextState = data.state != null ? (String(data.state).trim() ? String(data.state).trim() : null) : (current?.state != null && String(current.state).trim() ? String(current.state).trim() : null);
    const nextCountry = data.country != null ? (String(data.country).trim() ? String(data.country).trim() : null) : (current?.country != null && String(current.country).trim() ? String(current.country).trim() : null);
    const nextPostalCode = data.postalCode != null ? (String(data.postalCode).trim() ? String(data.postalCode).trim() : null) : (current?.postalCode != null && String(current.postalCode).trim() ? String(current.postalCode).trim() : null);
    const nextTaxType = data.taxType != null ? data.taxType : current?.taxType;
    const nextTaxNumber = data.taxNumber != null ? (String(data.taxNumber).trim() ? String(data.taxNumber).trim() : null) : (current?.taxNumber != null && String(current.taxNumber).trim() ? String(current.taxNumber).trim() : null);
    const nextType = data.type != null ? data.type : current?.type;

    // Email is unique per company - no duplicate emails within the same owner company
    if (nextEmail) {
      const parseEmails = (s) =>
        !s ? [] : String(s).split(/[,;]/).map((e) => e.trim().toLowerCase()).filter(Boolean);
      const newEmails = parseEmails(nextEmail);
      if (newEmails.length > 0) {
        const others = await this.prisma.client.findMany({
          where: { ...ownerCompanyFilter(currentUser), id: { not: id } },
          select: { email: true },
        });
        const existing = new Set();
        others.forEach((c) => parseEmails(c?.email).forEach((e) => existing.add(e)));
        const dup = newEmails.find((e) => existing.has(e));
        if (dup) {
          throw new ConflictException('A client with this email already exists in your company.');
        }
      }
    }

    try {
      return await this.prisma.client.update({
        where: { id },
        data: {
          type: data.type,
          companyName: data.companyName != null ? (String(data.companyName).trim() || null) : undefined,
          contactName: data.contactName,
          email,
          phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          taxType: data.taxType,
          taxNumber: data.taxNumber,
          status: data.status,
          ...(paymentTermsDays != null ? { paymentTermsDays } : {}),
          notes: data.notes,
          ...(data.openingBalance != null ? { openingBalance: data.openingBalance, balance: data.openingBalance } : {}),
          ...(data.creditLimit != null ? { creditLimit: data.creditLimit } : {}),
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new ConflictException('User exists');
      }
      throw e;
    }
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const [paymentCount, invoiceCount, quoteCount, recurringCount, outboxCount] = await Promise.all([
      this.prisma.payment.count({ where: { clientId: id } }),
      this.prisma.invoice.count({ where: { clientId: id } }),
      this.prisma.quote.count({ where: { clientId: id } }),
      this.prisma.recurringInvoice.count({ where: { clientId: id } }),
      this.prisma.emailOutbox.count({ where: { clientId: id } }),
    ]);

    if (paymentCount > 0 || invoiceCount > 0 || quoteCount > 0 || recurringCount > 0 || outboxCount > 0) {
      throw new ConflictException(
        'Cannot delete this client because it has related records (invoices, payments, quotes, recurring invoices, or email history). Set the client status to INACTIVE instead.'
      );
    }

    try {
      return await this.prisma.client.delete({ where: { id } });
    } catch (e) {
      if (e?.code === 'P2003') {
        throw new ConflictException(
          'Cannot delete this client because it is referenced by other records (for example payments). Set the client status to INACTIVE instead.'
        );
      }
      throw e;
    }
  }
}

module.exports = { ClientsService };
