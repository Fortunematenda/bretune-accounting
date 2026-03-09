const { Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { ownerCompanyFilter, userIdsForCompanyFilter } = require('../../common/utils/company-scope');

const DATE_TOLERANCE_DAYS = 3;

function extractInvoiceNumber(str) {
  if (!str || typeof str !== 'string') return null;
  const match = str.match(/(?:inv|invoice)[\s#:-]*(\d+)/i) || str.match(/\b(\d{4,})\b/);
  return match ? match[1] : null;
}

@Injectable()
class BankTransactionMatcherService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async suggestMatches(transactionId, { currentUser } = {}) {
    const tx = await this.prisma.bankTransaction.findFirst({
      where: { id: transactionId, ...ownerCompanyFilter(currentUser) },
      include: { bankAccount: true },
    });
    if (!tx) throw new NotFoundException('Bank transaction not found');
    if (tx.isReconciled) return { transaction: tx, suggestions: [] };

    const amount = toDecimal(tx.amount || '0').abs();
    const txDate = new Date(tx.transactionDate);
    const desc = (tx.description || '') + ' ' + (tx.reference || '');
    const suggestions = [];
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);

    const startWindow = new Date(txDate);
    startWindow.setDate(startWindow.getDate() - DATE_TOLERANCE_DAYS);
    const endWindow = new Date(txDate);
    endWindow.setDate(endWindow.getDate() + DATE_TOLERANCE_DAYS);

    const invNum = extractInvoiceNumber(desc);

    if (amount.gt(0)) {
      const invoices = await this.prisma.invoice.findMany({
        where: {
          ...userIdFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: 0 },
        },
        take: 10,
        include: { client: { select: { companyName: true, contactName: true } } },
      });
      for (const inv of invoices) {
        const bal = toDecimal(inv.balanceDue || '0');
        if (!bal.eq(amount) && !bal.sub(amount).abs().lte(0.01)) continue;
        const issueDate = inv.issueDate ? new Date(inv.issueDate) : null;
        let score = 50;
        if (issueDate && issueDate >= startWindow && issueDate <= endWindow) score += 20;
        if (invNum && String(inv.invoiceNumber || '').includes(invNum)) score += 30;
        if ((desc || '').toLowerCase().includes(String(inv.invoiceNumber || '').toLowerCase())) score += 25;
        suggestions.push({
          type: 'invoice',
          id: inv.id,
          reference: inv.invoiceNumber,
          amount: String(inv.balanceDue),
          clientName: inv.client?.companyName || inv.client?.contactName,
          confidence: Math.min(100, score),
          meta: { invoiceNumber: inv.invoiceNumber },
        });
      }
    } else {
      const negAmount = amount;

      const bills = await this.prisma.bill.findMany({
        where: {
          ...userIdFilter,
          status: { in: ['UNPAID', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: 0 },
        },
        take: 10,
        include: { supplier: { select: { supplierName: true } } },
      });
      for (const bill of bills) {
        const bal = toDecimal(bill.balanceDue || '0');
        if (!bal.eq(negAmount) && !bal.sub(negAmount).abs().lte(0.01)) continue;
        const dueDate = bill.dueDate ? new Date(bill.dueDate) : null;
        let score = 50;
        if (dueDate && dueDate >= startWindow && dueDate <= endWindow) score += 20;
        if ((desc || '').toLowerCase().includes(String(bill.vendorName || '').toLowerCase())) score += 25;
        if ((bill.reference || '') && desc.includes(bill.reference)) score += 20;
        suggestions.push({
          type: 'bill',
          id: bill.id,
          reference: bill.reference || bill.billNumber,
          amount: String(bill.balanceDue),
          vendorName: bill.vendorName || bill.supplier?.supplierName,
          confidence: Math.min(100, score),
          meta: { billNumber: bill.billNumber, vendorName: bill.vendorName },
        });
      }

      const expenses = await this.prisma.expense.findMany({
        where: {
          ...userIdFilter,
          status: { in: ['DRAFT', 'PENDING'] },
        },
        take: 10,
        include: { supplier: { select: { supplierName: true } }, category: { select: { name: true } } },
      });
      for (const exp of expenses) {
        const amt = toDecimal(exp.totalAmount || exp.amount || '0');
        if (!amt.eq(negAmount) && !amt.sub(negAmount).abs().lte(0.01)) continue;
        const expDate = exp.expenseDate ? new Date(exp.expenseDate) : null;
        let score = 40;
        if (expDate && expDate >= startWindow && expDate <= endWindow) score += 15;
        const supplierName = exp.supplier?.supplierName || '';
        if (supplierName && (desc || '').toLowerCase().includes(supplierName.toLowerCase())) score += 30;
        if ((exp.description || '').length > 0 && desc.toLowerCase().includes((exp.description || '').toLowerCase())) score += 15;
        suggestions.push({
          type: 'expense',
          id: exp.id,
          reference: exp.description || exp.id,
          amount: String(exp.totalAmount || exp.amount),
          supplierName,
          categoryName: exp.category?.name,
          confidence: Math.min(100, score),
          meta: { description: exp.description },
        });
      }
    }

    suggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    return { transaction: tx, suggestions: suggestions.slice(0, 10) };
  }
}

module.exports = { BankTransactionMatcherService };
