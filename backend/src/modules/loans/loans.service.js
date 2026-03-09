const { BadRequestException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { LedgerService } = require('../ledger/ledger.service');
const { ownerCompanyFilter, getOwnerCompany } = require('../../common/utils/company-scope');

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

function toDecimalStr(v) {
  const n = parseFloat(String(v ?? '0').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(n) || n < 0) throw new BadRequestException('Invalid numeric value');
  return String(n);
}

function mapLoan(loan) {
  if (!loan) return loan;
  return {
    ...loan,
    amount: Number(loan.amount),
    outstandingBalance: Number(loan.outstandingBalance),
    interestRate: loan.interestRate != null ? Number(loan.interestRate) : null,
    repayments: (loan.repayments || []).map((r) => ({
      ...r,
      amount: Number(r.amount),
    })),
    customer: loan.customer
      ? { id: loan.customer.id, contactName: loan.customer.contactName, companyName: loan.customer.companyName, email: loan.customer.email, phone: loan.customer.phone }
      : null,
  };
}

@Injectable()
class LoansService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(LedgerService) ledgerService = null,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async summary({ currentUser } = {}) {
    const where = ownerCompanyFilter(currentUser);
    const loans = await this.prisma.loan.findMany({ where, select: { amount: true, outstandingBalance: true, status: true, borrowerName: true } });
    const totalLoaned = loans.reduce((s, l) => s + parseFloat(String(l.amount)), 0);
    const totalOutstanding = loans.reduce((s, l) => s + parseFloat(String(l.outstandingBalance)), 0);
    const totalRepaid = totalLoaned - totalOutstanding;
    const uniqueBorrowers = new Set(loans.map((l) => l.borrowerName.trim().toLowerCase())).size;
    const byStatus = loans.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

    // Group by borrower name for dashboard bar chart
    const borrowerMap = {};
    for (const l of loans) {
      const key = l.borrowerName.trim().toLowerCase();
      if (!borrowerMap[key]) borrowerMap[key] = { name: l.borrowerName, loaned: 0, outstanding: 0 };
      borrowerMap[key].loaned += parseFloat(String(l.amount));
      borrowerMap[key].outstanding += parseFloat(String(l.outstandingBalance));
    }
    const topBorrowers = Object.values(borrowerMap)
      .filter((b) => b.outstanding > 0.01)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 8);

    return { totalLoaned, totalOutstanding, totalRepaid, totalLoans: loans.length, uniqueBorrowers, byStatus, topBorrowers };
  }

  async findAll(query = {}, { currentUser } = {}) {
    const { q, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...ownerCompanyFilter(currentUser),
    };

    if (cleanString(q)) {
      where.OR = [
        { borrowerName: { contains: q, mode: 'insensitive' } },
        { borrowerContact: { contains: q, mode: 'insensitive' } },
        { purpose: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (cleanString(status)) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        orderBy: { loanDate: 'desc' },
        skip,
        take: Number(limit),
        include: { repayments: { orderBy: { paymentDate: 'desc' } }, customer: { select: { id: true, contactName: true, companyName: true, email: true, phone: true } } },
      }),
      this.prisma.loan.count({ where }),
    ]);

    return {
      data: data.map(mapLoan),
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(id, { currentUser } = {}) {
    const loan = await this.prisma.loan.findFirst({
      where: { id, ...ownerCompanyFilter(currentUser) },
      include: { repayments: { orderBy: { paymentDate: 'desc' } }, customer: { select: { id: true, contactName: true, companyName: true, email: true, phone: true } } },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return mapLoan(loan);
  }

  async _findOrCreateCustomer(borrowerName, borrowerContact, ownerCompanyName) {
    const name = cleanString(borrowerName);
    if (!name) return null;

    const contactStr = cleanString(borrowerContact);
    const isEmail = contactStr && contactStr.includes('@');
    const isPhone = contactStr && !isEmail;

    // Try to find existing customer by name (case-insensitive)
    const existing = await this.prisma.client.findFirst({
      where: {
        OR: [
          { contactName: { equals: name, mode: 'insensitive' } },
          { companyName: { equals: name, mode: 'insensitive' } },
        ],
        ownerCompanyName: ownerCompanyName ?? null,
      },
      select: { id: true },
    });
    if (existing) return existing.id;

    // Create a new customer
    const created = await this.prisma.client.create({
      data: {
        contactName: name,
        email: isEmail ? contactStr : null,
        phone: isPhone ? contactStr : null,
        ownerCompanyName: ownerCompanyName ?? null,
      },
      select: { id: true },
    });
    return created.id;
  }

  async create(userId, dto, { currentUser } = {}) {
    const amount = parseFloat(toDecimalStr(dto.amount));
    if (amount <= 0) throw new BadRequestException('amount must be greater than 0');

    const loanDate = toDateOrNull(dto.loanDate, 'loanDate') || new Date();
    const dueDate = toDateOrNull(dto.dueDate, 'dueDate');

    const borrowerName = cleanString(dto.borrowerName) || (() => { throw new BadRequestException('borrowerName is required'); })();
    const ownerCompanyName = getOwnerCompany(currentUser);

    // Use provided customerId or auto find/create customer
    let customerId = cleanString(dto.customerId) || null;
    if (!customerId) {
      customerId = await this._findOrCreateCustomer(borrowerName, cleanString(dto.borrowerContact), ownerCompanyName);
    }

    const loan = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loan.create({
        data: {
          borrowerName,
          borrowerContact: cleanString(dto.borrowerContact),
          amount: String(amount),
          outstandingBalance: String(amount),
          loanDate,
          dueDate,
          interestRate: dto.interestRate != null ? String(parseFloat(dto.interestRate) || 0) : null,
          purpose: cleanString(dto.purpose),
          status: 'ACTIVE',
          notes: cleanString(dto.notes),
          ownerCompanyName,
          createdById: userId,
          customerId,
        },
        include: { repayments: true, customer: { select: { id: true, contactName: true, companyName: true, email: true, phone: true } } },
      });

      if (this.ledgerService) {
        const lines = this.ledgerService.buildLoanDisbursementLines({ amount: String(amount) });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: userId,
            date: loanDate,
            memo: `Loan to ${borrowerName}${cleanString(dto.purpose) ? ' — ' + cleanString(dto.purpose) : ''}`,
            sourceType: 'LOAN',
            sourceId: created.id,
            lines,
          });
          await tx.loan.update({ where: { id: created.id }, data: { journalEntryId: entry.id } });
          created.journalEntryId = entry.id;
        }
      }

      return created;
    });

    return mapLoan(loan);
  }

  async update(id, dto, { currentUser } = {}) {
    const existing = await this.prisma.loan.findFirst({
      where: { id, ...ownerCompanyFilter(currentUser) },
    });
    if (!existing) throw new NotFoundException('Loan not found');

    const data = {};
    if (dto.borrowerName != null) data.borrowerName = cleanString(dto.borrowerName);
    if (dto.borrowerContact !== undefined) data.borrowerContact = cleanString(dto.borrowerContact);
    if (dto.loanDate != null) data.loanDate = toDateOrNull(dto.loanDate, 'loanDate');
    if (dto.dueDate !== undefined) data.dueDate = toDateOrNull(dto.dueDate, 'dueDate');
    if (dto.interestRate !== undefined) data.interestRate = dto.interestRate != null ? String(parseFloat(dto.interestRate) || 0) : null;
    if (dto.purpose !== undefined) data.purpose = cleanString(dto.purpose);
    if (dto.notes !== undefined) data.notes = cleanString(dto.notes);
    if (dto.status != null) data.status = dto.status;
    if (dto.customerId !== undefined) data.customerId = cleanString(dto.customerId) || null;

    const updated = await this.prisma.loan.update({
      where: { id },
      data,
      include: { repayments: { orderBy: { paymentDate: 'desc' } }, customer: { select: { id: true, contactName: true, companyName: true, email: true, phone: true } } },
    });

    return mapLoan(updated);
  }

  async remove(id, { currentUser } = {}) {
    const existing = await this.prisma.loan.findFirst({
      where: { id, ...ownerCompanyFilter(currentUser) },
    });
    if (!existing) throw new NotFoundException('Loan not found');

    await this.prisma.$transaction(async (tx) => {
      if (this.ledgerService && existing.journalEntryId) {
        await this.ledgerService.reverseEntry(tx, {
          entryId: existing.journalEntryId,
          createdByUserId: existing.createdById,
          memo: `Reversal: Loan to ${existing.borrowerName} deleted`,
        });
      }
      await tx.loan.delete({ where: { id } });
    });

    return { success: true };
  }

  async addRepayment(loanId, dto, { currentUser } = {}) {
    const loan = await this.prisma.loan.findFirst({
      where: { id: loanId, ...ownerCompanyFilter(currentUser) },
    });
    if (!loan) throw new NotFoundException('Loan not found');

    const repaymentAmount = parseFloat(toDecimalStr(dto.amount));
    if (repaymentAmount <= 0) throw new BadRequestException('Repayment amount must be greater than 0');

    const outstanding = parseFloat(String(loan.outstandingBalance));
    if (repaymentAmount > outstanding + 0.01) {
      throw new BadRequestException(`Repayment amount cannot exceed outstanding balance of ${outstanding}`);
    }

    const paymentDate = toDateOrNull(dto.paymentDate, 'paymentDate') || new Date();

    const newBalance = Math.max(0, outstanding - repaymentAmount);
    const newStatus = newBalance < 0.01 ? 'REPAID' : 'PARTIALLY_REPAID';

    const repayment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loanRepayment.create({
        data: {
          loanId,
          amount: String(repaymentAmount),
          paymentDate,
          notes: cleanString(dto.notes),
        },
      });

      await tx.loan.update({
        where: { id: loanId },
        data: { outstandingBalance: String(newBalance), status: newStatus },
      });

      if (this.ledgerService) {
        const lines = this.ledgerService.buildLoanRepaymentLines({ amount: String(repaymentAmount) });
        if (lines.length > 0) {
          const entry = await this.ledgerService.postEntry(tx, {
            createdByUserId: loan.createdById,
            date: paymentDate,
            memo: `Loan repayment from ${loan.borrowerName}`,
            sourceType: 'LOAN_REPAYMENT',
            sourceId: created.id,
            lines,
          });
          await tx.loanRepayment.update({ where: { id: created.id }, data: { journalEntryId: entry.id } });
          created.journalEntryId = entry.id;
        }
      }

      return created;
    });

    return { ...repayment, amount: Number(repayment.amount) };
  }

  async removeRepayment(loanId, repaymentId, { currentUser } = {}) {
    const loan = await this.prisma.loan.findFirst({
      where: { id: loanId, ...ownerCompanyFilter(currentUser) },
      include: { repayments: true },
    });
    if (!loan) throw new NotFoundException('Loan not found');

    const repayment = loan.repayments.find((r) => r.id === repaymentId);
    if (!repayment) throw new NotFoundException('Repayment not found');

    const repaidAmount = parseFloat(String(repayment.amount));
    const currentOutstanding = parseFloat(String(loan.outstandingBalance));
    const totalLoan = parseFloat(String(loan.amount));
    const newBalance = Math.min(totalLoan, currentOutstanding + repaidAmount);
    const newStatus = newBalance >= totalLoan - 0.01 ? 'ACTIVE' : 'PARTIALLY_REPAID';

    await this.prisma.$transaction(async (tx) => {
      if (this.ledgerService && repayment.journalEntryId) {
        await this.ledgerService.reverseEntry(tx, {
          entryId: repayment.journalEntryId,
          createdByUserId: loan.createdById,
          memo: `Reversal: Repayment from ${loan.borrowerName} removed`,
        });
      }
      await tx.loanRepayment.delete({ where: { id: repaymentId } });
      await tx.loan.update({
        where: { id: loanId },
        data: { outstandingBalance: String(newBalance), status: newStatus },
      });
    });

    return { success: true };
  }
}

module.exports = { LoansService };
