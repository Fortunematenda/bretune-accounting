const { Inject, Injectable, Logger } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

/**
 * Normalize a description string for fuzzy matching.
 */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Simple token-overlap similarity (Jaccard-like) between two strings.
 * Returns 0..1.
 */
function similarity(a, b) {
  const ta = new Set(normalize(a).split(' ').filter(Boolean));
  const tb = new Set(normalize(b).split(' ').filter(Boolean));
  if (ta.size === 0 && tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Amount-closeness score.  Returns 0..1  (1 = exact match).
 */
function amountCloseness(a, b) {
  const na = Math.abs(Number(a) || 0);
  const nb = Math.abs(Number(b) || 0);
  if (na === 0 && nb === 0) return 1;
  const max = Math.max(na, nb);
  if (max === 0) return 0;
  return 1 - Math.abs(na - nb) / max;
}

@Injectable()
class AIService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
    this.logger = new Logger(AIService.name);
  }

  // ──────────────────────────────────────────────
  // 1. SMART TRANSACTION CATEGORIZATION
  // ──────────────────────────────────────────────

  /**
   * For each uncategorized bank transaction, suggest an expense category
   * based on historical patterns and automation rules.
   */
  async categorizeTransactions(ownerCompanyName, { limit = 50 } = {}) {
    // Fetch unmatched bank transactions
    const transactions = await this.prisma.bankTransaction.findMany({
      where: {
        ownerCompanyName,
        isReconciled: false,
        matchedType: null,
      },
      orderBy: { transactionDate: 'desc' },
      take: limit,
    });

    if (transactions.length === 0) return { processed: 0, suggestions: [] };

    // Build historical pattern map: description → categoryId (from past expenses)
    const pastExpenses = await this.prisma.expense.findMany({
      where: { categoryId: { not: null } },
      select: { description: true, categoryId: true, amount: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const categories = await this.prisma.expenseCategory.findMany({
      select: { id: true, name: true, ledgerAccount: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Load active automation rules of type CATEGORIZE
    const rules = await this.prisma.automationRule.findMany({
      where: { isActive: true, action: 'CATEGORIZE', ownerCompanyName },
      orderBy: { priority: 'desc' },
    });

    const suggestions = [];

    for (const txn of transactions) {
      let bestMatch = null;
      let bestScore = 0;
      let reasoning = '';

      // Phase 1: Check automation rules first
      for (const rule of rules) {
        const conditions = Array.isArray(rule.conditionsJson) ? rule.conditionsJson : [];
        if (this._evaluateConditions(conditions, txn)) {
          const params = rule.actionParamsJson || {};
          bestMatch = params.categoryId || null;
          bestScore = 0.95;
          reasoning = `Matched rule "${rule.name}"`;
          // Bump rule usage counter
          await this.prisma.automationRule.update({
            where: { id: rule.id },
            data: { timesApplied: { increment: 1 }, lastAppliedAt: new Date() },
          });
          break;
        }
      }

      // Phase 2: Pattern matching from historical expenses
      if (!bestMatch) {
        for (const exp of pastExpenses) {
          const descScore = similarity(txn.description, exp.description);
          const amtScore = amountCloseness(txn.amount, exp.amount);
          const combined = descScore * 0.7 + amtScore * 0.3;
          if (combined > bestScore && combined >= 0.4) {
            bestScore = combined;
            bestMatch = exp.categoryId;
            const cat = categoryMap.get(exp.categoryId);
            reasoning = `Similar to past expense "${exp.description}" → ${cat?.name || 'Unknown'}`;
          }
        }
      }

      if (bestMatch && bestScore >= 0.4) {
        const cat = categoryMap.get(bestMatch);
        const suggestion = await this.prisma.aISuggestion.create({
          data: {
            type: 'CATEGORIZE_TRANSACTION',
            status: 'PENDING',
            confidence: Math.min(bestScore, 1),
            sourceEntityType: 'bankTransaction',
            sourceEntityId: txn.id,
            targetEntityType: 'expenseCategory',
            targetEntityId: bestMatch,
            reasoning,
            metaJson: {
              transactionDescription: txn.description,
              transactionAmount: Number(txn.amount),
              categoryName: cat?.name,
            },
            ownerCompanyName,
          },
        });
        suggestions.push(suggestion);
      }
    }

    return { processed: transactions.length, suggestions };
  }

  // ──────────────────────────────────────────────
  // 2. AUTO INVOICE / BILL MATCHING
  // ──────────────────────────────────────────────

  /**
   * Match unreconciled bank deposits to outstanding invoices,
   * and bank withdrawals to outstanding bills.
   */
  async matchTransactions(ownerCompanyName, { limit = 50 } = {}) {
    const transactions = await this.prisma.bankTransaction.findMany({
      where: {
        ownerCompanyName,
        isReconciled: false,
        matchedType: null,
      },
      orderBy: { transactionDate: 'desc' },
      take: limit,
    });

    if (transactions.length === 0) return { processed: 0, suggestions: [] };

    // Separate deposits (positive) and withdrawals (negative)
    const deposits = transactions.filter((t) => Number(t.amount) > 0);
    const withdrawals = transactions.filter((t) => Number(t.amount) < 0);

    // Fetch outstanding invoices and bills
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] } },
      include: { client: { select: { companyName: true, contactName: true } } },
    });

    const bills = await this.prisma.bill.findMany({
      where: { status: { in: ['OPEN', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID'] } },
      include: { supplier: { select: { supplierName: true } } },
    });

    const suggestions = [];

    // Match deposits → invoices
    for (const dep of deposits) {
      let bestInvoice = null;
      let bestScore = 0;

      for (const inv of invoices) {
        const amtScore = amountCloseness(dep.amount, inv.balanceDue);
        const clientName = inv.client?.companyName || inv.client?.contactName || '';
        const descScore = similarity(dep.description || '', clientName);
        const refScore = (dep.reference && inv.invoiceNumber &&
          normalize(dep.reference).includes(normalize(inv.invoiceNumber))) ? 0.5 : 0;

        const combined = amtScore * 0.5 + descScore * 0.3 + refScore * 0.2;
        if (combined > bestScore && combined >= 0.45) {
          bestScore = combined;
          bestInvoice = inv;
        }
      }

      if (bestInvoice) {
        const suggestion = await this.prisma.aISuggestion.create({
          data: {
            type: 'MATCH_INVOICE',
            status: 'PENDING',
            confidence: Math.min(bestScore, 1),
            sourceEntityType: 'bankTransaction',
            sourceEntityId: dep.id,
            targetEntityType: 'invoice',
            targetEntityId: bestInvoice.id,
            reasoning: `Deposit of ${Number(dep.amount).toFixed(2)} matches invoice #${bestInvoice.invoiceNumber} (${Number(bestInvoice.balanceDue).toFixed(2)} due)`,
            metaJson: {
              transactionAmount: Number(dep.amount),
              invoiceNumber: bestInvoice.invoiceNumber,
              invoiceBalanceDue: Number(bestInvoice.balanceDue),
              clientName: bestInvoice.client?.companyName || bestInvoice.client?.contactName,
            },
            ownerCompanyName,
          },
        });
        suggestions.push(suggestion);
      }
    }

    // Match withdrawals → bills
    for (const wd of withdrawals) {
      let bestBill = null;
      let bestScore = 0;
      const absAmount = Math.abs(Number(wd.amount));

      for (const bill of bills) {
        const amtScore = amountCloseness(absAmount, bill.balanceDue);
        const vendorName = bill.supplier?.supplierName || bill.vendorName || '';
        const descScore = similarity(wd.description || '', vendorName);
        const combined = amtScore * 0.5 + descScore * 0.35 + 0.15;

        if (combined > bestScore && combined >= 0.5) {
          bestScore = combined;
          bestBill = bill;
        }
      }

      if (bestBill) {
        const suggestion = await this.prisma.aISuggestion.create({
          data: {
            type: 'MATCH_BILL',
            status: 'PENDING',
            confidence: Math.min(bestScore, 1),
            sourceEntityType: 'bankTransaction',
            sourceEntityId: wd.id,
            targetEntityType: 'bill',
            targetEntityId: bestBill.id,
            reasoning: `Withdrawal of ${absAmount.toFixed(2)} matches bill #${bestBill.billNumber} (${Number(bestBill.balanceDue).toFixed(2)} due to ${bestBill.vendorName})`,
            metaJson: {
              transactionAmount: absAmount,
              billNumber: bestBill.billNumber,
              billBalanceDue: Number(bestBill.balanceDue),
              vendorName: bestBill.vendorName,
            },
            ownerCompanyName,
          },
        });
        suggestions.push(suggestion);
      }
    }

    return { processed: transactions.length, suggestions };
  }

  // ──────────────────────────────────────────────
  // 3. DUPLICATE DETECTION
  // ──────────────────────────────────────────────

  /**
   * Scan recent invoices, bills, and expenses for potential duplicates.
   */
  async detectDuplicates(ownerCompanyName, { daysBack = 90 } = {}) {
    const since = new Date();
    since.setDate(since.getDate() - daysBack);
    const suggestions = [];

    // --- Duplicate invoices ---
    const invoices = await this.prisma.invoice.findMany({
      where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
      include: { client: { select: { companyName: true, contactName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    for (let i = 0; i < invoices.length; i++) {
      for (let j = i + 1; j < invoices.length; j++) {
        const a = invoices[i];
        const b = invoices[j];
        if (a.clientId !== b.clientId) continue;
        const amtScore = amountCloseness(a.totalAmount, b.totalAmount);
        const dateDiff = Math.abs(new Date(a.issueDate) - new Date(b.issueDate)) / (1000 * 60 * 60 * 24);
        const dateScore = dateDiff <= 3 ? 1 : dateDiff <= 7 ? 0.7 : dateDiff <= 14 ? 0.4 : 0;
        const combined = amtScore * 0.6 + dateScore * 0.4;

        if (combined >= 0.75) {
          // Check if suggestion already exists
          const existing = await this.prisma.aISuggestion.findFirst({
            where: {
              type: 'DUPLICATE_INVOICE',
              sourceEntityId: a.id,
              targetEntityId: b.id,
              status: 'PENDING',
            },
          });
          if (!existing) {
            const clientName = a.client?.companyName || a.client?.contactName || '';
            const s = await this.prisma.aISuggestion.create({
              data: {
                type: 'DUPLICATE_INVOICE',
                status: 'PENDING',
                confidence: Math.min(combined, 1),
                sourceEntityType: 'invoice',
                sourceEntityId: a.id,
                targetEntityType: 'invoice',
                targetEntityId: b.id,
                reasoning: `Invoice #${a.invoiceNumber} and #${b.invoiceNumber} for ${clientName} have similar amounts (${Number(a.totalAmount).toFixed(2)} vs ${Number(b.totalAmount).toFixed(2)}) within ${Math.round(dateDiff)} days`,
                metaJson: {
                  invoiceA: { id: a.id, number: a.invoiceNumber, amount: Number(a.totalAmount) },
                  invoiceB: { id: b.id, number: b.invoiceNumber, amount: Number(b.totalAmount) },
                },
                ownerCompanyName,
              },
            });
            suggestions.push(s);
          }
        }
      }
    }

    // --- Duplicate bills ---
    const bills = await this.prisma.bill.findMany({
      where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'desc' },
    });

    for (let i = 0; i < bills.length; i++) {
      for (let j = i + 1; j < bills.length; j++) {
        const a = bills[i];
        const b = bills[j];
        if ((a.supplierId || a.vendorName) !== (b.supplierId || b.vendorName)) continue;
        const amtScore = amountCloseness(a.totalAmount, b.totalAmount);
        const dateDiff = Math.abs(new Date(a.billDate) - new Date(b.billDate)) / (1000 * 60 * 60 * 24);
        const dateScore = dateDiff <= 3 ? 1 : dateDiff <= 7 ? 0.7 : 0;
        const combined = amtScore * 0.6 + dateScore * 0.4;

        if (combined >= 0.75) {
          const existing = await this.prisma.aISuggestion.findFirst({
            where: { type: 'DUPLICATE_BILL', sourceEntityId: a.id, targetEntityId: b.id, status: 'PENDING' },
          });
          if (!existing) {
            const s = await this.prisma.aISuggestion.create({
              data: {
                type: 'DUPLICATE_BILL',
                status: 'PENDING',
                confidence: Math.min(combined, 1),
                sourceEntityType: 'bill',
                sourceEntityId: a.id,
                targetEntityType: 'bill',
                targetEntityId: b.id,
                reasoning: `Bill #${a.billNumber} and #${b.billNumber} from ${a.vendorName} have similar amounts within ${Math.round(dateDiff)} days`,
                metaJson: {
                  billA: { id: a.id, number: a.billNumber, amount: Number(a.totalAmount) },
                  billB: { id: b.id, number: b.billNumber, amount: Number(b.totalAmount) },
                },
                ownerCompanyName,
              },
            });
            suggestions.push(s);
          }
        }
      }
    }

    // --- Duplicate expenses ---
    const expenses = await this.prisma.expense.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    });

    for (let i = 0; i < expenses.length; i++) {
      for (let j = i + 1; j < expenses.length; j++) {
        const a = expenses[i];
        const b = expenses[j];
        const amtScore = amountCloseness(a.totalAmount, b.totalAmount);
        const descScore = similarity(a.description, b.description);
        const dateDiff = Math.abs(new Date(a.expenseDate) - new Date(b.expenseDate)) / (1000 * 60 * 60 * 24);
        const dateScore = dateDiff <= 1 ? 1 : dateDiff <= 3 ? 0.7 : 0;
        const combined = amtScore * 0.4 + descScore * 0.35 + dateScore * 0.25;

        if (combined >= 0.7) {
          const existing = await this.prisma.aISuggestion.findFirst({
            where: { type: 'DUPLICATE_EXPENSE', sourceEntityId: a.id, targetEntityId: b.id, status: 'PENDING' },
          });
          if (!existing) {
            const s = await this.prisma.aISuggestion.create({
              data: {
                type: 'DUPLICATE_EXPENSE',
                status: 'PENDING',
                confidence: Math.min(combined, 1),
                sourceEntityType: 'expense',
                sourceEntityId: a.id,
                targetEntityType: 'expense',
                targetEntityId: b.id,
                reasoning: `Expenses "${a.description || 'N/A'}" (${Number(a.totalAmount).toFixed(2)}) and "${b.description || 'N/A'}" (${Number(b.totalAmount).toFixed(2)}) appear to be duplicates`,
                metaJson: {
                  expA: { id: a.id, desc: a.description, amount: Number(a.totalAmount) },
                  expB: { id: b.id, desc: b.description, amount: Number(b.totalAmount) },
                },
                ownerCompanyName,
              },
            });
            suggestions.push(s);
          }
        }
      }
    }

    return { suggestions };
  }

  // ──────────────────────────────────────────────
  // 4. SUGGESTION MANAGEMENT
  // ──────────────────────────────────────────────

  async getSuggestions(ownerCompanyName, { status, type, page = 1, limit = 20 } = {}) {
    const where = { ownerCompanyName };
    if (status) where.status = status;
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      this.prisma.aISuggestion.findMany({
        where,
        orderBy: [{ status: 'asc' }, { confidence: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.aISuggestion.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async resolveSuggestion(id, { status, userId }) {
    return this.prisma.aISuggestion.update({
      where: { id },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedByUserId: userId,
      },
    });
  }

  async getSuggestionStats(ownerCompanyName) {
    const [pending, accepted, dismissed] = await Promise.all([
      this.prisma.aISuggestion.count({ where: { ownerCompanyName, status: 'PENDING' } }),
      this.prisma.aISuggestion.count({ where: { ownerCompanyName, status: 'ACCEPTED' } }),
      this.prisma.aISuggestion.count({ where: { ownerCompanyName, status: 'DISMISSED' } }),
    ]);

    // Count by type (pending only)
    const byType = await this.prisma.aISuggestion.groupBy({
      by: ['type'],
      where: { ownerCompanyName, status: 'PENDING' },
      _count: { _all: true },
    });

    return {
      pending,
      accepted,
      dismissed,
      total: pending + accepted + dismissed,
      byType: byType.reduce((acc, g) => { acc[g.type] = g._count?._all || 0; return acc; }, {}),
    };
  }

  // ──────────────────────────────────────────────
  // 5. AUTOMATION RULES CRUD
  // ──────────────────────────────────────────────

  async listRules(ownerCompanyName, { page = 1, limit = 20 } = {}) {
    const where = { ownerCompanyName };
    const [items, total] = await Promise.all([
      this.prisma.automationRule.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.automationRule.count({ where }),
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async createRule(data) {
    return this.prisma.automationRule.create({ data });
  }

  async updateRule(id, data) {
    return this.prisma.automationRule.update({ where: { id }, data });
  }

  async deleteRule(id) {
    return this.prisma.automationRule.delete({ where: { id } });
  }

  // ──────────────────────────────────────────────
  // INTERNAL HELPERS
  // ──────────────────────────────────────────────

  /**
   * Evaluate an array of conditions against a bank transaction.
   * Conditions: [{ field: 'description', operator: 'contains', value: 'paypal' }]
   */
  _evaluateConditions(conditions, txn) {
    for (const cond of conditions) {
      const field = String(cond.field || '');
      const op = String(cond.operator || '');
      const val = String(cond.value || '');
      const actual = String(txn[field] ?? '');

      switch (op) {
        case 'contains':
          if (!normalize(actual).includes(normalize(val))) return false;
          break;
        case 'equals':
          if (normalize(actual) !== normalize(val)) return false;
          break;
        case 'startsWith':
          if (!normalize(actual).startsWith(normalize(val))) return false;
          break;
        case 'gt':
          if (Number(actual) <= Number(val)) return false;
          break;
        case 'lt':
          if (Number(actual) >= Number(val)) return false;
          break;
        case 'gte':
          if (Number(actual) < Number(val)) return false;
          break;
        case 'lte':
          if (Number(actual) > Number(val)) return false;
          break;
        default:
          return false;
      }
    }
    return conditions.length > 0;
  }
}

module.exports = { AIService };
