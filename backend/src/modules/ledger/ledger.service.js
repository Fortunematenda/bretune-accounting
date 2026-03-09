const { BadRequestException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { AccountingPeriodsService } = require('../accounting-periods/accounting-periods.service');
const { AuditService } = require('../audit/audit.service');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function formatJournalEntryNumber(sequenceValue) {
  const v = Number(sequenceValue);
  if (!Number.isFinite(v) || v <= 0) return `JE-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
  return `JE-${String(v).padStart(6, '0')}`;
}

async function nextJournalEntryNumber(tx) {
  const counter = await tx.documentCounter.upsert({
    where: { key: 'journal_entry' },
    create: { key: 'journal_entry', value: 1 },
    update: { value: { increment: 1 } },
  });

  return formatJournalEntryNumber(counter.value);
}

const SYSTEM_ACCOUNTS = {
  BANK: { code: '1000', name: 'Bank', type: 'ASSET' },
  CASH: { code: '1010', name: 'Cash', type: 'ASSET' },
  ACCOUNTS_RECEIVABLE: { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
  LOANS_RECEIVABLE: { code: '1300', name: 'Loans Receivable', type: 'ASSET' },
  SUPPLIER_CREDITS: { code: '1100', name: 'Supplier Credits', type: 'ASSET' },
  ACCOUNTS_PAYABLE: { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
  SALES_REVENUE: { code: '4000', name: 'Sales Revenue', type: 'INCOME' },
  TAX_PAYABLE: { code: '2100', name: 'Tax Payable', type: 'LIABILITY' },
  PURCHASES: { code: '5000', name: 'Purchases', type: 'EXPENSE' },
};

@Injectable()
class LedgerService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(AccountingPeriodsService) accountingPeriodsService = null,
    @Optional() @Inject(AuditService) auditService = null,
  ) {
    this.prisma = prismaService;
    this.accountingPeriodsService = accountingPeriodsService;
    this.auditService = auditService;
  }

  async ensureSystemAccounts(tx) {
    const accounts = Object.values(SYSTEM_ACCOUNTS);
    for (const a of accounts) {
      await tx.ledgerAccount.upsert({
        where: { code: a.code },
        create: {
          code: a.code,
          name: a.name,
          type: a.type,
          isSystem: true,
          isActive: true,
        },
        update: {
          name: a.name,
          type: a.type,
          isSystem: true,
          isActive: true,
        },
      });
    }
  }

  validateBalancedLines(lines) {
    const list = Array.isArray(lines) ? lines : [];
    if (list.length < 2) throw new BadRequestException('Journal entry must have at least 2 lines');

    let debitTotal = toDecimal('0');
    let creditTotal = toDecimal('0');

    for (let i = 0; i < list.length; i += 1) {
      const l = list[i] || {};
      const debit = toDecimal(l.debit || '0');
      const credit = toDecimal(l.credit || '0');

      if (debit.lt(0) || credit.lt(0)) {
        throw new BadRequestException('Journal line amounts must be non-negative');
      }
      if (debit.gt(0) && credit.gt(0)) {
        throw new BadRequestException('Journal line cannot have both debit and credit');
      }
      if (debit.lte(0) && credit.lte(0)) {
        throw new BadRequestException('Journal line must have a debit or credit amount');
      }

      debitTotal = debitTotal.add(debit);
      creditTotal = creditTotal.add(credit);
    }

    if (!debitTotal.eq(creditTotal)) {
      throw new BadRequestException('Journal entry must balance (total debits must equal total credits)');
    }

    return { debitTotal, creditTotal };
  }

  async getAccountIdByCode(tx, code) {
    const acc = await tx.ledgerAccount.findUnique({ where: { code } });
    if (!acc) throw new NotFoundException('Ledger account not found');
    if (acc.isActive === false) throw new BadRequestException('Ledger account is inactive');
    return acc.id;
  }

  async postEntry(tx, { createdByUserId, date, memo, sourceType, sourceId, lines } = {}) {
    if (!createdByUserId) throw new BadRequestException('createdByUserId is required');

    if (this.accountingPeriodsService) {
      await this.accountingPeriodsService.assertDateAllowedForPosting(date);
    }

    await this.ensureSystemAccounts(tx);
    this.validateBalancedLines(lines);

    const entryNumber = await nextJournalEntryNumber(tx);
    const entryDate = date ? new Date(date) : new Date();

    const normalizedLines = [];
    for (const l of lines || []) {
      const accountCode = cleanString(l.accountCode);
      if (!accountCode) throw new BadRequestException('Journal line accountCode is required');
      const accountId = await this.getAccountIdByCode(tx, accountCode);

      normalizedLines.push({
        accountId,
        debit: String(toDecimal(l.debit || '0')),
        credit: String(toDecimal(l.credit || '0')),
        memo: cleanString(l.memo),
      });
    }

    const entry = await tx.journalEntry.create({
      data: {
        entryNumber,
        date: entryDate,
        memo: cleanString(memo),
        sourceType: sourceType || null,
        sourceId: cleanString(sourceId),
        createdByUserId,
        lines: {
          create: normalizedLines,
        },
      },
      include: { lines: true },
    });

    return entry;
  }

  async reverseEntry(tx, { entryId, createdByUserId, date, memo } = {}) {
    if (!entryId) throw new BadRequestException('entryId is required');
    if (!createdByUserId) throw new BadRequestException('createdByUserId is required');

    const original = await tx.journalEntry.findUnique({
      where: { id: entryId },
      include: { lines: { include: { account: true } } },
    });

    if (!original) throw new NotFoundException('Journal entry not found');
    if (original.status !== 'POSTED') {
      throw new BadRequestException('Only POSTED journal entries can be reversed');
    }
    if (original.reversedEntryId) {
      return tx.journalEntry.findUnique({ where: { id: original.reversedEntryId }, include: { lines: true } });
    }

    const reversalLines = (original.lines || []).map((l) => ({
      accountCode: l.account.code,
      debit: String(toDecimal(l.credit || '0')),
      credit: String(toDecimal(l.debit || '0')),
      memo: cleanString(l.memo),
    }));

    const reversal = await this.postEntry(tx, {
      createdByUserId,
      date: date || new Date(),
      memo: memo || (original.memo ? `Reversal: ${original.memo}` : 'Reversal'),
      sourceType: original.sourceType || null,
      sourceId: original.sourceId || null,
      lines: reversalLines,
    });

    await tx.journalEntry.update({
      where: { id: original.id },
      data: {
        status: 'REVERSED',
        reversedAt: new Date(),
        reversedEntryId: reversal.id,
      },
    });

    if (this.auditService && createdByUserId) {
      await this.auditService.log({
        entityType: 'JournalEntry',
        entityId: original.id,
        action: 'REVERSE',
        userId: createdByUserId,
        oldValues: { status: 'POSTED' },
        newValues: { status: 'REVERSED', reversedEntryId: reversal.id },
      });
    }

    return reversal;
  }

  getCreditAccountCodeForSupplierPaymentMethod(method) {
    const m = String(method || '').toUpperCase();
    if (m === 'CASH') return SYSTEM_ACCOUNTS.CASH.code;
    if (m === 'CREDIT_NOTE') return SYSTEM_ACCOUNTS.SUPPLIER_CREDITS.code;
    return SYSTEM_ACCOUNTS.BANK.code;
  }

  getPayablesAccountCode() {
    return SYSTEM_ACCOUNTS.ACCOUNTS_PAYABLE.code;
  }

  getPurchasesExpenseAccountCode() {
    return SYSTEM_ACCOUNTS.PURCHASES.code;
  }

  getReceivablesAccountCode() {
    return SYSTEM_ACCOUNTS.ACCOUNTS_RECEIVABLE.code;
  }

  getSalesRevenueAccountCode() {
    return SYSTEM_ACCOUNTS.SALES_REVENUE.code;
  }

  getCreditAccountCodeForPaymentMethod(method) {
    const m = String(method || '').toUpperCase();
    if (m === 'CASH') return SYSTEM_ACCOUNTS.CASH.code;
    if (m === 'CREDIT_NOTE') return SYSTEM_ACCOUNTS.SUPPLIER_CREDITS.code;
    return SYSTEM_ACCOUNTS.BANK.code;
  }

  /**
   * Build journal lines for invoice posting (when invoice is sent/issued)
   * Dr A/R (totalAmount), Cr Sales Revenue (subtotal), Cr Tax Payable (taxAmount)
   */
  buildInvoiceEntryLines({ subtotal, taxAmount, totalAmount }) {
    const sub = toDecimal(subtotal || '0');
    const tax = toDecimal(taxAmount || '0');
    const total = toDecimal(totalAmount || '0');
    if (total.lte(0)) return [];
    return [
      { accountCode: SYSTEM_ACCOUNTS.ACCOUNTS_RECEIVABLE.code, debit: String(total), credit: '0' },
      { accountCode: SYSTEM_ACCOUNTS.SALES_REVENUE.code, debit: '0', credit: String(sub) },
      ...(tax.gt(0) ? [{ accountCode: SYSTEM_ACCOUNTS.TAX_PAYABLE.code, debit: '0', credit: String(tax) }] : []),
    ];
  }

  /**
   * Build journal lines for payment posting (when payment is completed)
   * Dr Bank/Cash (amount), Cr A/R (amount)
   * @param {string} [bankAccountCode] - Override bank account (e.g. when reconciling a specific account)
   */
  buildPaymentEntryLines({ amount, method, bankAccountCode }) {
    const amt = toDecimal(amount || '0');
    if (amt.lte(0)) return [];
    let creditAccount = this.getCreditAccountCodeForPaymentMethod(method);
    if (bankAccountCode && (creditAccount === SYSTEM_ACCOUNTS.BANK.code || creditAccount === SYSTEM_ACCOUNTS.CASH.code)) {
      creditAccount = bankAccountCode;
    }
    return [
      { accountCode: creditAccount, debit: String(amt), credit: '0' },
      { accountCode: SYSTEM_ACCOUNTS.ACCOUNTS_RECEIVABLE.code, debit: '0', credit: String(amt) },
    ];
  }

  /**
   * Build journal lines for bill posting
   * Dr Purchases (totalAmount), Cr A/P (totalAmount)
   */
  buildBillEntryLines({ totalAmount }) {
    const amt = toDecimal(totalAmount || '0');
    if (amt.lte(0)) return [];
    return [
      { accountCode: SYSTEM_ACCOUNTS.PURCHASES.code, debit: String(amt), credit: '0' },
      { accountCode: SYSTEM_ACCOUNTS.ACCOUNTS_PAYABLE.code, debit: '0', credit: String(amt) },
    ];
  }

  /**
   * Build journal lines for supplier payment (when paid to supplier)
   * Dr A/P (amount), Cr Bank/Cash (amount)
   */
  buildSupplierPaymentEntryLines({ amount, method }) {
    const amt = toDecimal(amount || '0');
    if (amt.lte(0)) return [];
    const creditAccount = this.getCreditAccountCodeForSupplierPaymentMethod(method);
    return [
      { accountCode: SYSTEM_ACCOUNTS.ACCOUNTS_PAYABLE.code, debit: String(amt), credit: '0' },
      { accountCode: creditAccount, debit: '0', credit: String(amt) },
    ];
  }

  /**
   * Build journal lines for expense reimbursement (when expense is reimbursed)
   * Dr Expense account (category's ledgerAccount or Purchases), Cr Bank/Cash
   */
  /**
   * Build journal lines for a new loan given out
   * Dr Loans Receivable (amount), Cr Bank (amount)
   */
  buildLoanDisbursementLines({ amount }) {
    const amt = toDecimal(amount || '0');
    if (amt.lte(0)) return [];
    return [
      { accountCode: SYSTEM_ACCOUNTS.LOANS_RECEIVABLE.code, debit: String(amt), credit: '0' },
      { accountCode: SYSTEM_ACCOUNTS.BANK.code, debit: '0', credit: String(amt) },
    ];
  }

  /**
   * Build journal lines when a loan repayment is received
   * Dr Bank (amount), Cr Loans Receivable (amount)
   */
  buildLoanRepaymentLines({ amount }) {
    const amt = toDecimal(amount || '0');
    if (amt.lte(0)) return [];
    return [
      { accountCode: SYSTEM_ACCOUNTS.BANK.code, debit: String(amt), credit: '0' },
      { accountCode: SYSTEM_ACCOUNTS.LOANS_RECEIVABLE.code, debit: '0', credit: String(amt) },
    ];
  }

  buildExpenseEntryLines({ totalAmount, expenseAccountCode, paymentMethod }) {
    const amt = toDecimal(totalAmount || '0');
    if (amt.lte(0)) return [];
    const debitAccount = cleanString(expenseAccountCode) || SYSTEM_ACCOUNTS.PURCHASES.code;
    const creditAccount = this.getCreditAccountCodeForSupplierPaymentMethod(paymentMethod);
    return [
      { accountCode: debitAccount, debit: String(amt), credit: '0' },
      { accountCode: creditAccount, debit: '0', credit: String(amt) },
    ];
  }

  async findAllAccounts({ page = 1, limit = 100, type, isActive, q } = {}) {
    const where = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === true || isActive === 'true';
    if (q) {
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('ledgerAccount', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOneAccount(id) {
    const acc = await this.prisma.ledgerAccount.findUnique({ where: { id } });
    if (!acc) throw new NotFoundException('Ledger account not found');
    return acc;
  }

  async createAccount(userId, dto) {
    const code = cleanString(dto.code);
    if (!code) throw new BadRequestException('code is required');
    const name = cleanString(dto.name);
    if (!name) throw new BadRequestException('name is required');
    const type = dto.type;
    if (!['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'].includes(type)) {
      throw new BadRequestException('type must be ASSET, LIABILITY, EQUITY, INCOME, or EXPENSE');
    }

    const existing = await this.prisma.ledgerAccount.findUnique({ where: { code } });
    if (existing) throw new BadRequestException('Account code already exists');

    return this.prisma.ledgerAccount.create({
      data: {
        code,
        name,
        type,
        isSystem: false,
        isActive: dto.isActive !== false,
      },
    });
  }

  async updateAccount(id, dto) {
    const acc = await this.findOneAccount(id);
    if (acc.isSystem) throw new BadRequestException('Cannot modify system accounts');

    const data = {};
    if (dto.name !== undefined) data.name = cleanString(dto.name) || acc.name;
    if (dto.isActive !== undefined) data.isActive = dto.isActive === true || dto.isActive === 'true';

    return this.prisma.ledgerAccount.update({
      where: { id },
      data,
    });
  }

  async deleteAccount(id) {
    const acc = await this.findOneAccount(id);
    if (acc.isSystem) throw new BadRequestException('Cannot delete system accounts');

    const hasLines = await this.prisma.journalLine.count({
      where: { accountId: id },
    });
    if (hasLines > 0) {
      throw new BadRequestException('Cannot delete account with existing journal lines');
    }

    await this.prisma.ledgerAccount.delete({ where: { id } });
    return { ok: true };
  }

  async findAllEntries({ page = 1, limit = 20, from, to, sourceType, status } = {}) {
    const where = {};
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) {
        const d = new Date(to);
        d.setHours(23, 59, 59, 999);
        where.date.lte = d;
      }
    }
    if (sourceType) where.sourceType = sourceType;
    if (status) where.status = status;

    return this.prisma.paginate('journalEntry', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        lines: { include: { account: true } },
      },
    });
  }

  async findOneEntry(id) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        lines: { include: { account: true } },
        reversedEntry: { include: { lines: { include: { account: true } } } },
      },
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async createManualEntry(userId, dto) {
    const lines = Array.isArray(dto.lines) ? dto.lines : [];
    if (lines.length < 2) throw new BadRequestException('At least 2 journal lines are required');

    const postImmediately = dto.status !== 'DRAFT';
    if (postImmediately) {
      return this.prisma.$transaction(async (tx) => {
        return this.postEntry(tx, {
          createdByUserId: userId,
          date: dto.date || new Date(),
          memo: cleanString(dto.memo),
          sourceType: 'MANUAL',
          sourceId: null,
          lines,
        });
      });
    }

    const entryNumber = `JE-DRAFT-${Date.now()}`;
    const entryDate = dto.date ? new Date(dto.date) : new Date();
    this.validateBalancedLines(lines);

    return this.prisma.$transaction(async (tx) => {
      await this.ensureSystemAccounts(tx);
      const normalizedLines = [];
      for (const l of lines) {
        const accountCode = cleanString(l.accountCode);
        if (!accountCode) throw new BadRequestException('Journal line accountCode is required');
        const accountId = await this.getAccountIdByCode(tx, accountCode);
        normalizedLines.push({
          accountId,
          debit: String(toDecimal(l.debit || '0')),
          credit: String(toDecimal(l.credit || '0')),
          memo: cleanString(l.memo),
          foreignAmount: l.foreignAmount ? String(toDecimal(l.foreignAmount)) : null,
          foreignCurrencyCode: cleanString(l.foreignCurrencyCode),
        });
      }
      const created = await tx.journalEntry.create({
        data: {
          entryNumber,
          date: entryDate,
          memo: cleanString(dto.memo),
          sourceType: 'MANUAL',
          sourceId: null,
          status: 'DRAFT',
          createdByUserId: userId,
          lines: { create: normalizedLines },
        },
        include: { lines: { include: { account: true } } },
      });
      if (this.auditService) {
        await this.auditService.log({
          entityType: 'JournalEntry',
          entityId: created.id,
          action: 'CREATE',
          userId,
          newValues: { status: 'DRAFT', entryNumber: created.entryNumber },
        });
      }
      return created;
    });
  }

  async approveEntry(entryId, userId) {
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.findUnique({
        where: { id: entryId },
        include: { lines: { include: { account: true } } },
      });
      if (!entry) throw new NotFoundException('Journal entry not found');
      if (entry.status !== 'DRAFT' && entry.status !== 'PENDING_APPROVAL') {
        throw new BadRequestException('Only draft or pending entries can be approved');
      }

      if (this.accountingPeriodsService) {
        await this.accountingPeriodsService.assertDateAllowedForPosting(entry.date);
      }

      const entryNumber = await nextJournalEntryNumber(tx);
      await tx.journalEntry.update({
        where: { id: entryId },
        data: {
          entryNumber,
          status: 'POSTED',
          approvedByUserId: userId,
          approvedAt: new Date(),
        },
      });

      if (this.auditService) {
        await this.auditService.log({
          entityType: 'JournalEntry',
          entityId: entryId,
          action: 'APPROVE',
          userId,
          oldValues: { status: entry.status },
          newValues: { status: 'POSTED', entryNumber, approvedByUserId: userId },
        });
      }

      return tx.journalEntry.findUnique({
        where: { id: entryId },
        include: {
          lines: { include: { account: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          approvedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });
  }

  async reverseEntryById(entryId, userId, { date, memo } = {}, { currentUser } = {}) {
    return this.prisma.$transaction(async (tx) => {
      return this.reverseEntry(tx, {
        entryId,
        createdByUserId: userId,
        date: date ? new Date(date) : undefined,
        memo: memo ? cleanString(memo) : undefined,
      });
    });
  }
}

module.exports = { LedgerService, SYSTEM_ACCOUNTS };

