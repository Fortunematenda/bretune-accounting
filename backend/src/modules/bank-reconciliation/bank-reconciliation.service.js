const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { LedgerService, SYSTEM_ACCOUNTS } = require('../ledger/ledger.service');
const { PaymentsService } = require('../payments/payments.service');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

@Injectable()
class BankReconciliationService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(LedgerService) ledgerService,
    @Inject(PaymentsService) paymentsService,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
    this.paymentsService = paymentsService;
  }

  async create(userId, dto) {
    let accountCode = cleanString(dto.accountCode);
    let bankAccountId = cleanString(dto.bankAccountId);
    if (bankAccountId && !accountCode) {
      const bank = await this.prisma.businessBankAccount.findFirst({
        where: { id: bankAccountId },
        select: { ledgerAccountCode: true },
      });
      if (bank) accountCode = bank.ledgerAccountCode;
    }
    accountCode = accountCode || SYSTEM_ACCOUNTS.BANK.code;
    const statementDate = dto.statementDate ? new Date(dto.statementDate) : new Date();
    const openingBalance = toDecimal(dto.openingBalance || '0');
    const closingBalance = toDecimal(dto.closingBalance || '0');

    const reconciliation = await this.prisma.bankReconciliation.create({
      data: {
        accountCode,
        bankAccountId: bankAccountId || null,
        statementDate,
        openingBalance: String(openingBalance),
        closingBalance: String(closingBalance),
        status: 'DRAFT',
        createdByUserId: userId,
      },
    });

    if (Array.isArray(dto.lines) && dto.lines.length > 0) {
      await this.prisma.bankStatementLine.createMany({
        data: dto.lines.map((l) => ({
          reconciliationId: reconciliation.id,
          lineDate: l.date ? new Date(l.date) : statementDate,
          description: cleanString(l.description),
          reference: cleanString(l.reference),
          amount: String(toDecimal(l.amount || '0')),
        })),
      });
    }

    return this.findOne(reconciliation.id);
  }

  async findAll({ page = 1, limit = 20, accountCode, bankAccountId, status } = {}) {
    const where = {};
    if (accountCode) where.accountCode = accountCode;
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (status) where.status = status;

    return this.prisma.paginate('bankReconciliation', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { statementDate: 'desc' },
    });
  }

  async findOne(id) {
    const rec = await this.prisma.bankReconciliation.findUnique({
      where: { id },
      include: {
        bankAccount: { select: { id: true, bankName: true, accountName: true, accountNumber: true } },
        statementLines: { orderBy: { lineDate: 'asc' } },
        matches: {
          include: {
            statementLine: true,
            journalLine: {
              include: {
                account: true,
                entry: { select: { id: true, entryNumber: true, date: true, memo: true, sourceType: true } },
              },
            },
          },
        },
      },
    });
    if (!rec) throw new NotFoundException('Bank reconciliation not found');
    return rec;
  }

  async addStatementLines(id, lines) {
    const rec = await this.prisma.bankReconciliation.findUnique({ where: { id } });
    if (!rec) throw new NotFoundException('Bank reconciliation not found');
    if (rec.status === 'COMPLETED') throw new BadRequestException('Cannot modify completed reconciliation');

    const data = (Array.isArray(lines) ? lines : [lines]).map((l) => ({
      reconciliationId: id,
      lineDate: l.date ? new Date(l.date) : rec.statementDate,
      description: cleanString(l.description),
      reference: cleanString(l.reference),
      amount: String(toDecimal(l.amount || '0')),
    }));

    await this.prisma.bankStatementLine.createMany({ data });
    return this.findOne(id);
  }

  async getUnreconciledLedgerActivity(accountCode, asOfDate) {
    const code = cleanString(accountCode) || SYSTEM_ACCOUNTS.BANK.code;
    const acc = await this.prisma.ledgerAccount.findUnique({ where: { code } });
    if (!acc) return [];

    const endOfDay = new Date(asOfDate || new Date());
    endOfDay.setHours(23, 59, 59, 999);

    const matchedIds = await this.prisma.bankReconciliationMatch.findMany({
      where: { reconciliation: { accountCode: code } },
      select: { journalLineId: true },
    });
    const excludedIds = matchedIds.map((m) => m.journalLineId);

    const lines = await this.prisma.journalLine.findMany({
      where: {
        accountId: acc.id,
        entry: { status: 'POSTED', date: { lte: endOfDay } },
        ...(excludedIds.length > 0 ? { id: { notIn: excludedIds } } : {}),
      },
      include: {
        account: true,
        entry: {
          select: {
            id: true,
            entryNumber: true,
            date: true,
            memo: true,
            sourceType: true,
            sourceId: true,
          },
        },
      },
      orderBy: { entry: { date: 'asc' } },
    });

    // Enrich PAYMENT entries with invoice numbers
    const paymentIds = [...new Set(
      lines
        .filter((l) => l.entry?.sourceType === 'PAYMENT' && l.entry?.sourceId)
        .map((l) => l.entry.sourceId)
    )];
    const paymentToInvoices = {};
    if (paymentIds.length > 0) {
      const payments = await this.prisma.payment.findMany({
        where: { id: { in: paymentIds } },
        include: {
          allocations: {
            include: { invoice: { select: { invoiceNumber: true } } },
          },
        },
      });
      for (const p of payments) {
        const invNums = (p.allocations || [])
          .map((a) => a.invoice?.invoiceNumber)
          .filter(Boolean);
        paymentToInvoices[p.id] = invNums;
      }
    }

    return lines.map((l) => {
      const debit = toDecimal(l.debit || '0');
      const credit = toDecimal(l.credit || '0');
      const amount = debit.gt(0) ? debit.negated() : credit;
      const base = {
        id: l.id,
        date: l.entry.date,
        entryNumber: l.entry.entryNumber,
        memo: l.entry.memo || l.memo,
        sourceType: l.entry.sourceType,
        debit: String(l.debit),
        credit: String(l.credit),
        amount: String(amount),
      };
      if (l.entry?.sourceType === 'PAYMENT' && l.entry?.sourceId) {
        base.invoiceNumbers = paymentToInvoices[l.entry.sourceId] || [];
      }
      return base;
    });
  }

  async match(reconciliationId, { statementLineId, journalLineId }) {
    const rec = await this.prisma.bankReconciliation.findUnique({ where: { id: reconciliationId } });
    if (!rec) throw new NotFoundException('Bank reconciliation not found');
    if (rec.status === 'COMPLETED') throw new BadRequestException('Cannot modify completed reconciliation');

    const stmtLine = await this.prisma.bankStatementLine.findFirst({
      where: { id: statementLineId, reconciliationId },
    });
    if (!stmtLine) throw new NotFoundException('Statement line not found');

    const journalLine = await this.prisma.journalLine.findUnique({
      where: { id: journalLineId },
      include: { account: true },
    });
    if (!journalLine) throw new NotFoundException('Journal line not found');

    const acc = await this.prisma.ledgerAccount.findUnique({ where: { code: rec.accountCode } });
    if (journalLine.accountId !== acc.id) {
      throw new BadRequestException('Journal line must be for the same bank account');
    }

    await this.prisma.bankReconciliationMatch.upsert({
      where: {
        reconciliationId_statementLineId_journalLineId: {
          reconciliationId,
          statementLineId,
          journalLineId,
        },
      },
      create: { reconciliationId, statementLineId, journalLineId },
      update: {},
    });

    return this.findOne(reconciliationId);
  }

  async unmatch(reconciliationId, { statementLineId, journalLineId }) {
    const rec = await this.prisma.bankReconciliation.findUnique({ where: { id: reconciliationId } });
    if (!rec) throw new NotFoundException('Bank reconciliation not found');
    if (rec.status === 'COMPLETED') throw new BadRequestException('Cannot modify completed reconciliation');

    await this.prisma.bankReconciliationMatch.deleteMany({
      where: { reconciliationId, statementLineId, journalLineId },
    });

    return this.findOne(reconciliationId);
  }

  /**
   * Record a customer payment from a bank deposit and match it to a statement line.
   * Creates the payment (allocating to invoices), posts to the bank account, and links it.
   */
  async recordPaymentFromStatement(userId, reconciliationId, { statementLineId, clientId, amount, allocations }, { currentUser } = {}) {
    const rec = await this.prisma.bankReconciliation.findUnique({ where: { id: reconciliationId } });
    if (!rec) throw new NotFoundException('Bank reconciliation not found');
    if (rec.status === 'COMPLETED') throw new BadRequestException('Cannot modify completed reconciliation');

    const stmtLine = await this.prisma.bankStatementLine.findFirst({
      where: { id: statementLineId, reconciliationId },
    });
    if (!stmtLine) throw new NotFoundException('Statement line not found');

    const existingMatch = await this.prisma.bankReconciliationMatch.findFirst({
      where: { reconciliationId, statementLineId },
    });
    if (existingMatch) throw new BadRequestException('This statement line is already matched');

    const amt = toDecimal(stmtLine.amount || '0');
    if (amt.lte(0)) throw new BadRequestException('Can only allocate payments to deposits (positive amounts). Use Match for withdrawals.');

    const paymentDate = stmtLine.lineDate ? new Date(stmtLine.lineDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

    const payment = await this.paymentsService.create(
      userId,
      {
        clientId,
        amount: String(amt),
        method: 'BANK_TRANSFER',
        paymentDate,
        bankAccountCode: rec.accountCode,
        allocations: allocations || [],
      },
      { currentUser }
    );

    if (!payment?.journalEntryId) {
      throw new BadRequestException('Payment was created but no journal entry was posted. Please match manually.');
    }

    const bankAcc = await this.prisma.ledgerAccount.findUnique({ where: { code: rec.accountCode } });
    if (!bankAcc) throw new NotFoundException('Bank account not found');

    const bankLine = await this.prisma.journalLine.findFirst({
      where: {
        entryId: payment.journalEntryId,
        accountId: bankAcc.id,
      },
    });
    if (!bankLine) throw new BadRequestException('Payment posted but bank line not found. Please match manually.');

    await this.prisma.bankReconciliationMatch.create({
      data: { reconciliationId, statementLineId, journalLineId: bankLine.id },
    });

    return this.findOne(reconciliationId);
  }

  async importStatement(userId, { bankAccountId, accountCode, statementDate, openingBalance, closingBalance, lines }) {
    const code = cleanString(accountCode) || (bankAccountId ? null : SYSTEM_ACCOUNTS.BANK.code);
    let resolvedCode = code;
    if (bankAccountId && !code) {
      const bank = await this.prisma.businessBankAccount.findFirst({
        where: { id: bankAccountId },
        select: { ledgerAccountCode: true },
      });
      if (!bank) throw new NotFoundException('Bank account not found');
      resolvedCode = bank.ledgerAccountCode;
    }
    resolvedCode = resolvedCode || SYSTEM_ACCOUNTS.BANK.code;
    const stmtDate = statementDate ? new Date(statementDate) : new Date();
    const openBal = toDecimal(openingBalance || '0');
    const closeBal = toDecimal(closingBalance || '0');

    const rec = await this.prisma.bankReconciliation.create({
      data: {
        accountCode: resolvedCode,
        bankAccountId: bankAccountId || null,
        statementDate: stmtDate,
        openingBalance: String(openBal),
        closingBalance: String(closeBal),
        status: 'DRAFT',
        createdByUserId: userId,
      },
    });

    if (Array.isArray(lines) && lines.length > 0) {
      // DECIMAL(12,2) max is 9,999,999,999.99 - clamp to avoid overflow
      const MAX_AMOUNT = '9999999999.99';
      const MIN_AMOUNT = '-9999999999.99';
      const safeLines = lines.map((l) => {
        let amt = toDecimal(l.amount || '0');
        if (amt.gt(MAX_AMOUNT)) amt = toDecimal(MAX_AMOUNT);
        if (amt.lt(MIN_AMOUNT)) amt = toDecimal(MIN_AMOUNT);
        return {
          reconciliationId: rec.id,
          lineDate: l.date ? new Date(l.date) : stmtDate,
          description: cleanString(l.description),
          reference: cleanString(l.reference),
          amount: String(amt),
        };
      });
      await this.prisma.bankStatementLine.createMany({
        data: safeLines,
      });
    }
    return this.findOne(rec.id);
  }

  async complete(id, userId) {
    const rec = await this.findOne(id);
    if (rec.status === 'COMPLETED') throw new BadRequestException('Reconciliation already completed');

    await this.prisma.bankReconciliation.update({
      where: { id },
      data: { status: 'COMPLETED', closedAt: new Date(), closedByUserId: userId },
    });

    return this.findOne(id);
  }
}

module.exports = { BankReconciliationService };
