const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const crypto = require('crypto');
const { toDecimal } = require('../../common/utils/money');
const { ownerCompanyFilter } = require('../../common/utils/company-scope');

const COLUMN_KEYS = ['date', 'description', 'reference', 'debit', 'credit', 'balance', 'amount'];

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function parseAmount(val) {
  if (val == null || String(val).trim() === '') return null;
  const s = String(val).replace(/[^\d.-]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function generateHash(date, amount, description) {
  const str = `${date}|${amount}|${description || ''}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

@Injectable()
class BankStatementImportService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  parseCSV(text, columnMapping = {}) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s/g, ''));
    const aliases = {
      date: ['date', 'transactiondate', 'valuedate', 'postingdate'],
      description: ['description', 'desc', 'detail', 'memo', 'narrative', 'particulars'],
      reference: ['reference', 'ref', 'transactionref', 'chequeno'],
      debit: ['debit', 'withdrawals', 'out'],
      credit: ['credit', 'deposits', 'in'],
      balance: ['balance', 'runningbalance'],
      amount: ['amount', 'value', 'sum'],
    };
    const mapping = {};
    for (const key of COLUMN_KEYS) {
      if (columnMapping[key] != null && Number.isFinite(columnMapping[key])) {
        mapping[key] = columnMapping[key];
      } else if (typeof columnMapping[key] === 'string') {
        const idx = headers.findIndex((h) => h === String(columnMapping[key]).toLowerCase().replace(/\s/g, ''));
        if (idx >= 0) mapping[key] = idx;
      } else {
        const idx = headers.findIndex((h) => (aliases[key] || []).some((a) => h.includes(a)));
        if (idx >= 0) mapping[key] = idx;
      }
    }
    const dateIdx = mapping.date ?? headers.findIndex((h) => h.includes('date'));
    const descIdx = mapping.description ?? headers.findIndex((h) => h.includes('desc') || h.includes('memo') || h.includes('detail'));
    const refIdx = mapping.reference ?? headers.findIndex((h) => h.includes('ref'));
    const debitIdx = mapping.debit ?? headers.findIndex((h) => h.includes('debit'));
    const creditIdx = mapping.credit ?? headers.findIndex((h) => h.includes('credit'));
    const balanceIdx = mapping.balance ?? headers.findIndex((h) => h.includes('balance'));
    const amtIdx = mapping.amount ?? headers.findIndex((h) => h.includes('amount') || h.includes('value'));

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const get = (idx) => (idx >= 0 && cells[idx] !== undefined ? cells[idx] : '');
      const dateStr = get(dateIdx);
      const description = get(descIdx);
      const reference = get(refIdx);
      const debitVal = parseAmount(get(debitIdx));
      const creditVal = parseAmount(get(creditIdx));
      const balanceVal = parseAmount(get(balanceIdx));
      const amountVal = parseAmount(get(amtIdx));
      let amount = amountVal;
      if (amount == null && (debitVal != null || creditVal != null)) {
        amount = (creditVal || 0) - (debitVal || 0);
      }
      if (amount == null || amount === 0) continue;
      const date = dateStr ? new Date(dateStr) : new Date();
      if (Number.isNaN(date.getTime())) continue;
      rows.push({
        date,
        description: cleanString(description) || null,
        reference: cleanString(reference) || null,
        debit: debitVal != null ? debitVal : (amount < 0 ? Math.abs(amount) : 0),
        credit: creditVal != null ? creditVal : (amount > 0 ? amount : 0),
        amount,
        balance: balanceVal,
      });
    }
    return rows;
  }

  async importFromCSV(bankAccountId, csvText, { columnMapping, currentUser } = {}) {
    const bankAccount = await this.prisma.businessBankAccount.findFirst({
      where: { id: bankAccountId, ...ownerCompanyFilter(currentUser) },
    });
    if (!bankAccount) throw new NotFoundException('Bank account not found');
    const company = (currentUser?.companyName || '').trim();

    const rows = this.parseCSV(csvText, columnMapping || {});
    let inserted = 0;
    let skippedDuplicates = 0;

    for (const row of rows) {
      const amountDec = toDecimal(String(row.amount));
      const hash = generateHash(row.date.toISOString().slice(0, 10), String(row.amount), row.description || '');
      const existing = await this.prisma.bankTransaction.findUnique({
        where: { bankAccountId_hash: { bankAccountId, hash } },
      });
      if (existing) {
        skippedDuplicates++;
        continue;
      }
      await this.prisma.bankTransaction.create({
        data: {
          bankAccountId,
          transactionDate: row.date,
          description: row.description,
          reference: row.reference,
          debit: row.debit != null && row.debit > 0 ? String(row.debit) : null,
          credit: row.credit != null && row.credit > 0 ? String(row.credit) : null,
          amount: String(amountDec),
          balance: row.balance != null ? String(row.balance) : null,
          hash,
          ownerCompanyName: company || null,
        },
      });
      inserted++;
    }

    return { total_rows: rows.length, inserted, skipped_duplicates: skippedDuplicates };
  }
}

module.exports = { BankStatementImportService };
