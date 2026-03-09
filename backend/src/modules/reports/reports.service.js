const { Inject, Injectable, BadRequestException } = require('@nestjs/common');
const { Prisma } = require('@prisma/client');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { userCompanyFilter, ownerCompanyFilter, userIdsForCompanyFilter, rawInvoiceCompanyCondition, rawPaymentCompanyCondition, rawJournalEntryCompanyCondition } = require('../../common/utils/company-scope');
const { PlanLimitService } = require('../subscriptions/plan-limit.service');
const { CurrenciesService } = require('../currencies/currencies.service');

@Injectable()
class ReportsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(PlanLimitService) planLimitService,
    @Inject(CurrenciesService) currenciesService,
  ) {
    this.prisma = prismaService;
    this.planLimitService = planLimitService;
    this.currenciesService = currenciesService;
  }

  computeTrend(currentValue, previousValue) {
    const cur = Number(currentValue || 0);
    const prev = Number(previousValue || 0);

    if (!Number.isFinite(cur) || !Number.isFinite(prev)) {
      return { direction: 'flat', percent: 0 };
    }

    if (prev === 0) {
      if (cur === 0) return { direction: 'flat', percent: 0 };
      return { direction: 'up', percent: 100 };
    }

    const pct = ((cur - prev) / prev) * 100;
    const direction = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
    return { direction, percent: Math.round(Math.abs(pct) * 10) / 10 };
  }

  async getNotifications({ currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const invFilter = { ...userIdFilter };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [overdueAgg, emailPending, emailFailed, overdueInvoices] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          dueDate: { lt: todayStart },
        },
        _count: { _all: true },
      }),
      this.prisma.emailOutbox.count({ where: { status: 'PENDING' } }),
      this.prisma.emailOutbox.count({ where: { status: 'FAILED' } }),
      this.prisma.invoice.findMany({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          dueDate: { lt: todayStart },
        },
        orderBy: [{ dueDate: 'asc' }],
        take: 10,
        select: {
          id: true,
          clientId: true,
          invoiceNumber: true,
          dueDate: true,
          balanceDue: true,
          client: { select: { companyName: true, contactName: true } },
        },
      }),
    ]);

    return {
      overdue: { count: overdueAgg._count._all },
      emailOutbox: { pending: emailPending, failed: emailFailed },
      overdueInvoices: overdueInvoices.map((inv) => ({
        id: inv.id,
        clientId: inv.clientId,
        invoiceNumber: inv.invoiceNumber,
        dueDate: inv.dueDate,
        amountDue: String(inv.balanceDue || 0),
        customerName: inv.client?.companyName || inv.client?.contactName || 'Client',
      })),
    };
  }

  async dashboardSummaryQuick({ asOf, currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const invFilter = { ...userIdFilter };
    const pmtFilter = { ...userIdFilter };
    const billFilter = { ...userIdFilter };

    const openBillStatuses = ['OPEN', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID'];

    const now = asOf ? new Date(asOf) : new Date();
    if (Number.isNaN(now.getTime())) {
      throw new BadRequestException('Invalid date parameter');
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const { allowed: hasAdvancedReports } = await this.planLimitService.hasAdvancedReportsAccess(currentUser);

    const [
      outstandingAgg,
      overdueAgg,
      agingTotals,
      upcomingBills,
      overdueBillsResult,
      recentPayments,
      cashCollectedAgg,
      invoicesIssuedAgg,
      revenueAccrualAgg,
    ] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          dueDate: { lt: todayStart },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      hasAdvancedReports
        ? this.prisma.$queryRaw`
            WITH base AS (
              SELECT
                i."balanceDue" AS "balanceDue",
                GREATEST(0, (${now}::date - i."dueDate"::date)) AS "daysPastDue"
              FROM invoices i
              WHERE i.status IN ('SENT','OVERDUE','PARTIALLY_PAID')
                AND i."balanceDue" > 0
                AND ${rawInvoiceCompanyCondition(Prisma, currentUser)}
            )
            SELECT
              SUM(CASE WHEN b."daysPastDue" BETWEEN 0 AND 30 THEN b."balanceDue" ELSE 0 END) AS "bucket_0_30",
              SUM(CASE WHEN b."daysPastDue" BETWEEN 31 AND 60 THEN b."balanceDue" ELSE 0 END) AS "bucket_31_60",
              SUM(CASE WHEN b."daysPastDue" BETWEEN 61 AND 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_61_90",
              SUM(CASE WHEN b."daysPastDue" > 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_90_plus"
            FROM base b;
          `
        : Promise.resolve([{ bucket_0_30: 0, bucket_31_60: 0, bucket_61_90: 0, bucket_90_plus: 0 }]),
      this.prisma.bill.findMany({
        where: {
          ...billFilter,
          status: { in: openBillStatuses },
          balanceDue: { gt: toDecimal('0') },
          dueDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lte: (() => {
              const d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              d.setHours(23, 59, 59, 999);
              return d;
            })(),
          },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        select: {
          id: true,
          billNumber: true,
          vendorName: true,
          dueDate: true,
          totalAmount: true,
          balanceDue: true,
        },
      }),
      Promise.all([
        this.prisma.bill.aggregate({
          where: {
            ...billFilter,
            status: { in: openBillStatuses },
            balanceDue: { gt: toDecimal('0') },
            dueDate: { lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
          },
          _sum: { balanceDue: true },
          _count: { _all: true },
        }),
        this.prisma.bill.findMany({
          where: {
            ...billFilter,
            status: { in: openBillStatuses },
            balanceDue: { gt: toDecimal('0') },
            dueDate: { lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
          },
          orderBy: { dueDate: 'asc' },
          take: 20,
          select: { id: true, billNumber: true, vendorName: true, dueDate: true, balanceDue: true },
        }),
      ]).then(([agg, list]) => ({ agg, list })),
      this.prisma.payment.findMany({
        where: {
          ...pmtFilter,
          status: 'COMPLETED',
          method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] },
        },
        orderBy: { paymentDate: 'desc' },
        take: 5,
        select: {
          id: true,
          amount: true,
          method: true,
          paymentDate: true,
          client: { select: { id: true, companyName: true, contactName: true } },
          invoice: { select: { id: true, invoiceNumber: true } },
        },
      }),
    ]);

    const agingRow = Array.isArray(agingTotals) ? agingTotals[0] : agingTotals;
    const agingSummary = {
      bucket_0_30: String(agingRow?.bucket_0_30 || 0),
      bucket_31_60: String(agingRow?.bucket_31_60 || 0),
      bucket_61_90: String(agingRow?.bucket_61_90 || 0),
      bucket_90_plus: String(agingRow?.bucket_90_plus || 0),
    };

    const recentInvoicePayments = (recentPayments || []).map((p) => ({
      invoiceNumber: p.invoice?.invoiceNumber || '-',
      contact: p.client?.companyName || p.client?.contactName || 'Client',
      dateReceived: p.paymentDate,
      amount: String(p.amount || 0),
    }));

    return {
      asOf: now.toISOString(),
      kpis: {
        outstandingReceivables: {
          value: String(outstandingAgg._sum.balanceDue || 0),
          count: outstandingAgg._count._all,
          trend: { direction: 'flat', percent: 0 },
        },
        overdueReceivables: {
          value: String(overdueAgg._sum.balanceDue || 0),
          count: overdueAgg._count._all,
          trend: { direction: 'flat', percent: 0 },
        },
        cashCollectedMtd: {
          value: String(cashCollectedAgg?._sum?.amount || 0),
          count: cashCollectedAgg?._count?._all || 0,
          trend: { direction: 'flat', percent: 0 },
          isWholeTotal: false,
        },
        invoicesIssuedMtd: {
          value: Number(invoicesIssuedAgg?._count?._all || 0),
          trend: { direction: 'flat', percent: 0 },
        },
        revenueAccrualMtd: {
          value: String(revenueAccrualAgg?._sum?.totalAmount || 0),
          count: revenueAccrualAgg?._count?._all || 0,
          trend: { direction: 'flat', percent: 0 },
          isWholeTotal: false,
        },
      },
      agingSummary,
      tiles: {
        topUnpaidCustomers: [],
        unpaidSplit: [],
        arAgingByCustomer: [],
        unpaidTransactions: [],
      },
      enterprise: {
        fixedAssetCount: 0,
        journalEntriesMtd: 0,
        currencyInfo: { baseCurrencyCode: 'ZAR', displayCurrencyCode: 'ZAR', rateCount: 0, rateVsUsd: null },
        payRunStatus: { DRAFT: 0, PROCESSED: 0, PAID: 0, CANCELLED: 0 },
        upcomingBills: (upcomingBills || []).map((b) => ({
          id: b.id,
          billNumber: b.billNumber,
          vendorName: b.vendorName,
          dueDate: b.dueDate,
          totalAmount: String(b.totalAmount || 0),
          balanceDue: String(b.balanceDue || 0),
        })),
        overdueBills: {
          amount: String(overdueBillsResult?.agg?._sum?.balanceDue || 0),
          count: overdueBillsResult?.agg?._count?._all || 0,
          bills: (overdueBillsResult?.list || []).map((b) => ({
            id: b.id,
            billNumber: b.billNumber,
            vendorName: b.vendorName,
            dueDate: b.dueDate,
            balanceDue: String(b.balanceDue || 0),
          })),
        },
      },
      recentActivity: [],
      recentInvoicePayments,
    };
  }

  async dashboardSummary({ asOf, start, end, currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const rangeStart = start ? new Date(start) : null;
    const rangeEnd = end ? new Date(end) : null;
    const asOfDate = asOf ? new Date(asOf) : null;

    const now = rangeEnd || asOfDate || new Date();
    const { allowed: hasAdvancedReports } = await this.planLimitService.hasAdvancedReportsAccess(currentUser);
    if (Number.isNaN(now.getTime())) {
      throw new BadRequestException('Invalid date parameter');
    }
    if (rangeStart && Number.isNaN(rangeStart.getTime())) {
      throw new BadRequestException('start must be a valid date');
    }
    if (rangeEnd && Number.isNaN(rangeEnd.getTime())) {
      throw new BadRequestException('end must be a valid date');
    }
    if (rangeStart && rangeEnd && rangeEnd < rangeStart) {
      throw new BadRequestException('end must be on or after start');
    }

    const useCustomRange = rangeStart && rangeEnd;
    const monthStart = useCustomRange
      ? new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate())
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = useCustomRange
      ? new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate(), 23, 59, 59, 999)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0);
    if (!useCustomRange) monthEnd.setHours(23, 59, 59, 999);

    const prevMonthStart = useCustomRange
      ? new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1)
      : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = useCustomRange
      ? new Date(monthStart.getFullYear(), monthStart.getMonth(), 0, 23, 59, 59, 999)
      : new Date(now.getFullYear(), now.getMonth(), 0);
    prevMonthEnd.setHours(23, 59, 59, 999);

    const invFilter = { ...userIdFilter };
    const pmtFilter = { ...userIdFilter };
    const clientFilter = ownerCompanyFilter(currentUser);
    const billFilter = { ...userIdFilter };
    const journalFilter = userIdFilter.userId ? { createdByUserId: userIdFilter.userId } : {};

    const openBillStatuses = ['OPEN', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID'];

    const asOfDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      outstandingAgg,
      overdueAgg,
      prevOutstandingAgg,
      prevOverdueAgg,
      emailPendingCount,
      emailFailedCount,
      monthlyRevenueAgg,
      invoicesIssuedAgg,
      cashCollectedAgg,
      prevMonthlyRevenueAgg,
      prevInvoicesIssuedAgg,
      prevCashCollectedAgg,
      agingTotals,
      topUnpaidByCustomer,
      unpaidTransactions,
      agingByCustomer,
      recentInvoices,
      recentPayments,
      recentStatements,
      fixedAssetCount,
      journalEntriesMtd,
      payRunCounts,
      upcomingBills,
      overdueBillsResult,
      currencyInfo,
    ] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          dueDate: { lt: asOfDayStart },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          issueDate: { lte: prevMonthEnd },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
          dueDate: { lte: prevMonthEnd },
        },
        _sum: { balanceDue: true },
        _count: { _all: true },
      }),
      this.prisma.emailOutbox.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.emailOutbox.count({
        where: { status: 'FAILED' },
      }),
      // Revenue (Accrual): when no date specified → whole total (all time); when date specified → MTD for that range
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { notIn: ['DRAFT', 'CANCELLED'] },
          ...(useCustomRange ? { issueDate: { gte: monthStart, lte: monthEnd } } : {}),
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { notIn: ['DRAFT', 'CANCELLED'] },
          ...(useCustomRange ? { issueDate: { gte: monthStart, lte: monthEnd } } : {}),
        },
        _count: { _all: true },
      }),
      // Cash Collected: when no date specified → whole total; when date specified → MTD for that range
      this.prisma.payment.aggregate({
        where: {
          ...pmtFilter,
          status: 'COMPLETED',
          method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] },
          ...(useCustomRange ? { paymentDate: { gte: monthStart, lte: monthEnd } } : {}),
        },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { notIn: ['DRAFT', 'CANCELLED'] },
          issueDate: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          ...invFilter,
          status: { notIn: ['DRAFT', 'CANCELLED'] },
          issueDate: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _count: { _all: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          ...pmtFilter,
          status: 'COMPLETED',
          method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] },
          paymentDate: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      hasAdvancedReports
        ? this.prisma.$queryRaw`
            WITH base AS (
              SELECT
                i."balanceDue" AS "balanceDue",
                GREATEST(0, (${now}::date - i."dueDate"::date)) AS "daysPastDue"
              FROM invoices i
              WHERE i.status IN ('SENT','OVERDUE','PARTIALLY_PAID')
                AND i."balanceDue" > 0
                AND ${rawInvoiceCompanyCondition(Prisma, currentUser)}
            )
            SELECT
              SUM(CASE WHEN b."daysPastDue" BETWEEN 0 AND 30 THEN b."balanceDue" ELSE 0 END) AS "bucket_0_30",
              SUM(CASE WHEN b."daysPastDue" BETWEEN 31 AND 60 THEN b."balanceDue" ELSE 0 END) AS "bucket_31_60",
              SUM(CASE WHEN b."daysPastDue" BETWEEN 61 AND 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_61_90",
              SUM(CASE WHEN b."daysPastDue" > 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_90_plus"
            FROM base b;
          `
        : Promise.resolve([{ bucket_0_30: 0, bucket_31_60: 0, bucket_61_90: 0, bucket_90_plus: 0 }]),

      this.prisma.invoice.groupBy({
        by: ['clientId'],
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
        },
        _sum: { balanceDue: true },
        orderBy: { _sum: { balanceDue: 'desc' } },
        take: 10,
      }),

      this.prisma.invoice.findMany({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          balanceDue: { gt: toDecimal('0') },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        take: 10,
        select: {
          id: true,
          clientId: true,
          invoiceNumber: true,
          issueDate: true,
          dueDate: true,
          totalAmount: true,
          balanceDue: true,
          client: { select: { id: true, companyName: true, contactName: true } },
        },
      }),

      hasAdvancedReports
        ? this.aging({ asOf: now.toISOString(), currentUser })
        : Promise.resolve([]),
      this.prisma.invoice.findMany({
        where: {
          ...invFilter,
          status: { in: ['SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'] },
          ...(useCustomRange && { updatedAt: { gte: monthStart, lte: monthEnd } }),
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          invoiceNumber: true,
          updatedAt: true,
          client: { select: { id: true, companyName: true, contactName: true } },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          ...pmtFilter,
          status: 'COMPLETED',
          method: { in: ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'ONLINE'] },
          ...(useCustomRange && { paymentDate: { gte: monthStart, lte: monthEnd } }),
        },
        orderBy: { paymentDate: 'desc' },
        take: 10,
        select: {
          id: true,
          amount: true,
          method: true,
          paymentDate: true,
          client: { select: { id: true, companyName: true, contactName: true } },
          invoice: { select: { id: true, invoiceNumber: true } },
        },
      }),
      this.prisma.emailOutbox.findMany({
        where: {
          client: clientFilter,
          status: 'SENT',
          documentType: 'STATEMENT',
          ...(useCustomRange && { sentAt: { gte: monthStart, lte: monthEnd } }),
        },
        orderBy: { sentAt: 'desc' },
        take: 10,
        select: {
          id: true,
          sentAt: true,
          updatedAt: true,
          client: { select: { id: true, companyName: true, contactName: true } },
        },
      }),
      this.prisma.fixedAsset.count({ where: { status: 'ACTIVE' } }),
      this.prisma.journalEntry.count({
        where: {
          ...journalFilter,
          sourceType: 'MANUAL',
          status: 'POSTED',
          date: { gte: monthStart, lte: monthEnd },
        },
      }),
      this.prisma.payRun.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.bill.findMany({
        where: {
          ...billFilter,
          status: { in: openBillStatuses },
          balanceDue: { gt: toDecimal('0') },
          dueDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lte: (() => {
              const d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              d.setHours(23, 59, 59, 999);
              return d;
            })(),
          },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        select: {
          id: true,
          billNumber: true,
          vendorName: true,
          dueDate: true,
          totalAmount: true,
          balanceDue: true,
        },
      }),
      Promise.all([
        this.prisma.bill.aggregate({
          where: {
            ...billFilter,
            status: { in: openBillStatuses },
            balanceDue: { gt: toDecimal('0') },
            dueDate: { lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
          },
          _sum: { balanceDue: true },
          _count: { _all: true },
        }),
        this.prisma.bill.findMany({
          where: {
            ...billFilter,
            status: { in: openBillStatuses },
            balanceDue: { gt: toDecimal('0') },
            dueDate: { lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
          },
          orderBy: { dueDate: 'asc' },
          take: 20,
          select: { id: true, billNumber: true, vendorName: true, dueDate: true, balanceDue: true },
        }),
      ]).then(([agg, list]) => ({ agg, list })),
      (async () => {
        const company = await this.prisma.company.findFirst({
          select: { baseCurrencyCode: true },
        });
        const settings = await this.prisma.companySettings.findUnique({
          where: { id: 'default' },
        }).catch(() => null);
        const displayCurrencyCode = (settings?.displayCurrencyCode || company?.baseCurrencyCode || 'ZAR').trim() || 'ZAR';
        const rateCount = await this.prisma.exchangeRate.count();
        let rateVsUsd = null;
        if (displayCurrencyCode && displayCurrencyCode !== 'USD') {
          try {
            const rate = await Promise.race([
              this.currenciesService.getLiveRate('USD', displayCurrencyCode),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
            ]);
            rateVsUsd = String(rate);
          } catch (err) {
            // API may be unavailable or slow; leave null
          }
        } else if (displayCurrencyCode === 'USD') {
          rateVsUsd = '1';
        }
        return {
          baseCurrencyCode: company?.baseCurrencyCode || 'ZAR',
          displayCurrencyCode,
          rateCount,
          rateVsUsd,
        };
      })(),
    ]);

    const cashTrend = useCustomRange
      ? this.computeTrend(
          String(cashCollectedAgg._sum.amount || 0),
          String(prevCashCollectedAgg._sum.amount || 0)
        )
      : { direction: 'flat', percent: 0 };
    const outstandingTrend = this.computeTrend(
      String(outstandingAgg._sum.balanceDue || 0),
      String(prevOutstandingAgg._sum.balanceDue || 0)
    );
    const overdueTrend = this.computeTrend(
      String(overdueAgg._sum.balanceDue || 0),
      String(prevOverdueAgg._sum.balanceDue || 0)
    );
    const invoicesIssuedTrend = this.computeTrend(
      Number(invoicesIssuedAgg._count._all || 0),
      Number(prevInvoicesIssuedAgg._count._all || 0)
    );
    const accrualRevenueTrend = useCustomRange
      ? this.computeTrend(
          String(monthlyRevenueAgg._sum.totalAmount || 0),
          String(prevMonthlyRevenueAgg._sum.totalAmount || 0)
        )
      : { direction: 'flat', percent: 0 };

    const agingRow = Array.isArray(agingTotals) ? agingTotals[0] : agingTotals;
    const agingSummary = {
      bucket_0_30: String(agingRow?.bucket_0_30 || 0),
      bucket_31_60: String(agingRow?.bucket_31_60 || 0),
      bucket_61_90: String(agingRow?.bucket_61_90 || 0),
      bucket_90_plus: String(agingRow?.bucket_90_plus || 0),
    };

    const topClientIds = (topUnpaidByCustomer || []).map((r) => r.clientId).filter(Boolean);
    const topClients = topClientIds.length
      ? await this.prisma.client.findMany({
          where: { id: { in: topClientIds } },
          select: { id: true, companyName: true, contactName: true },
        })
      : [];

    const clientNameById = new Map(
      topClients.map((c) => [c.id, c.companyName || c.contactName || 'Client'])
    );

    const topUnpaidCustomers = (topUnpaidByCustomer || []).map((r) => ({
      clientId: r.clientId,
      customerName: clientNameById.get(r.clientId) || 'Client',
      amountDue: String(r._sum?.balanceDue || 0),
    }));

    const unpaidSplit = topUnpaidCustomers.map((r) => ({
      label: r.customerName,
      value: r.amountDue,
    }));

    const agingByCustomerRows = Array.isArray(agingByCustomer) ? agingByCustomer : [];
    const agingClientIds = agingByCustomerRows.map((r) => r.clientId).filter(Boolean);
    const agingClients = agingClientIds.length
      ? await this.prisma.client.findMany({
          where: { id: { in: agingClientIds } },
          select: { id: true, companyName: true, contactName: true },
        })
      : [];
    const agingNameById = new Map(
      agingClients.map((c) => [c.id, c.companyName || c.contactName || 'Client'])
    );

    const arAgingByCustomer = agingByCustomerRows.map((r) => ({
      clientId: r.clientId,
      customerName: agingNameById.get(r.clientId) || 'Client',
      bucket_0_30: String(r.bucket_0_30 || 0),
      bucket_31_60: String(r.bucket_31_60 || 0),
      bucket_61_90: String(r.bucket_61_90 || 0),
      bucket_90_plus: String(r.bucket_90_plus || 0),
    }));

    const unpaidTransactionsTile = (unpaidTransactions || []).map((inv) => ({
      id: inv.id,
      clientId: inv.clientId,
      invoiceNumber: inv.invoiceNumber,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      amountDue: String(inv.balanceDue || 0),
      customerName: inv.client?.companyName || inv.client?.contactName || 'Client',
      contactName: inv.client?.contactName || null,
    }));

    const activity = [];
    recentInvoices.forEach((inv) => {
      const clientName = inv.client?.companyName || inv.client?.contactName || 'Client';
      const status = String(inv.status);
      if (status === 'SENT') {
        activity.push({
          type: 'INVOICE_SENT',
          timestamp: inv.updatedAt,
          clientName,
          description: `Invoice ${inv.invoiceNumber} sent`,
        });
      } else if (status === 'PAID' || status === 'PARTIALLY_PAID') {
        activity.push({
          type: 'PAYMENT_APPLIED',
          timestamp: inv.updatedAt,
          clientName,
          description: `Payment applied to ${inv.invoiceNumber}`,
        });
      }
    });
    recentPayments.forEach((p) => {
      const clientName = p.client?.companyName || p.client?.contactName || 'Client';
      activity.push({
        type: 'PAYMENT_RECEIVED',
        timestamp: p.paymentDate,
        clientName,
        description: p.invoice?.invoiceNumber
          ? `Payment received for ${p.invoice.invoiceNumber}`
          : 'Payment received',
      });
    });
    recentStatements.forEach((s) => {
      const clientName = s.client?.companyName || s.client?.contactName || 'Client';
      activity.push({
        type: 'STATEMENT_EMAILED',
        timestamp: s.sentAt || s.updatedAt,
        clientName,
        description: 'Statement emailed',
      });
    });

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivity = activity.slice(0, 12).map((a) => ({
      ...a,
      timestamp: new Date(a.timestamp).toISOString(),
    }));

    const recentInvoicePayments = (recentPayments || []).map((p) => ({
      invoiceNumber: p.invoice?.invoiceNumber || '-',
      contact: p.client?.companyName || p.client?.contactName || 'Client',
      dateReceived: p.paymentDate,
      amount: String(p.amount || 0),
    }));

    return {
      asOf: now.toISOString(),
      outstanding: {
        count: outstandingAgg._count._all,
        amount: String(outstandingAgg._sum.balanceDue || 0),
      },
      overdue: {
        count: overdueAgg._count._all,
        amount: String(overdueAgg._sum.balanceDue || 0),
      },
      emailOutbox: {
        pending: emailPendingCount,
        failed: emailFailedCount,
      },
      monthlyRevenue: {
        monthStart: monthStart.toISOString(),
        monthEnd: monthEnd.toISOString(),
        invoiceCount: monthlyRevenueAgg._count._all,
        amount: String(monthlyRevenueAgg._sum.totalAmount || 0),
        isWholeTotal: !useCustomRange,
      },

      kpis: {
        outstandingReceivables: {
          value: String(outstandingAgg._sum.balanceDue || 0),
          count: outstandingAgg._count._all,
          trend: outstandingTrend,
        },
        overdueReceivables: {
          value: String(overdueAgg._sum.balanceDue || 0),
          count: overdueAgg._count._all,
          trend: overdueTrend,
        },
        cashCollectedMtd: {
          value: String(cashCollectedAgg._sum.amount || 0),
          count: cashCollectedAgg._count._all,
          trend: cashTrend,
          isWholeTotal: !useCustomRange,
        },
        invoicesIssuedMtd: {
          value: Number(invoicesIssuedAgg._count._all || 0),
          trend: invoicesIssuedTrend,
        },
        revenueAccrualMtd: {
          value: String(monthlyRevenueAgg._sum.totalAmount || 0),
          count: monthlyRevenueAgg._count._all,
          trend: accrualRevenueTrend,
        },
      },

      agingSummary,
      tiles: {
        topUnpaidCustomers,
        unpaidSplit,
        arAgingByCustomer,
        unpaidTransactions: unpaidTransactionsTile,
      },
      enterprise: {
        fixedAssetCount,
        journalEntriesMtd,
        currencyInfo,
        payRunStatus: (payRunCounts || []).reduce(
          (acc, r) => {
            acc[r.status] = r._count._all;
            return acc;
          },
          { DRAFT: 0, PROCESSED: 0, PAID: 0, CANCELLED: 0 }
        ),
        upcomingBills: (upcomingBills || []).map((b) => ({
          id: b.id,
          billNumber: b.billNumber,
          vendorName: b.vendorName,
          dueDate: b.dueDate,
          totalAmount: String(b.totalAmount || 0),
          balanceDue: String(b.balanceDue || 0),
        })),
        overdueBills: {
          amount: String(overdueBillsResult?.agg?._sum?.balanceDue || 0),
          count: overdueBillsResult?.agg?._count?._all || 0,
          bills: (overdueBillsResult?.list || []).map((b) => ({
            id: b.id,
            billNumber: b.billNumber,
            vendorName: b.vendorName,
            dueDate: b.dueDate,
            balanceDue: String(b.balanceDue || 0),
          })),
        },
      },
      recentActivity,
      recentInvoicePayments,
    };
  }

  normalizeRange(from, to) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (fromDate && Number.isNaN(fromDate.getTime())) {
      throw new BadRequestException('from must be a valid date');
    }
    if (toDate && Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('to must be a valid date');
    }
    if (fromDate && toDate && toDate < fromDate) {
      throw new BadRequestException('to must be on or after from');
    }

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    return { fromDate, toDate };
  }

  async outstandingInvoices({ clientId, page = 1, limit = 50, currentUser } = {}) {
    const userIdFilter = await userIdsForCompanyFilter(this.prisma, currentUser);
    const where = {
      ...userIdFilter,
      balanceDue: { gt: toDecimal('0') },
      status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
    };

    if (clientId) where.clientId = clientId;

    return this.prisma.paginate('invoice', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
      },
    });
  }

  async aging({ asOf, currentUser } = {}) {
    await this.planLimitService.enforceAdvancedReportsAccess(currentUser);
    const asOfDate = asOf ? new Date(asOf) : new Date();
    if (Number.isNaN(asOfDate.getTime())) {
      throw new BadRequestException('asOf must be a valid date');
    }

    const invCond = rawInvoiceCompanyCondition(Prisma, currentUser);
    // Bucket by days past due
    const rows = await this.prisma.$queryRaw`
      WITH base AS (
        SELECT
          i."clientId" AS "clientId",
          i."balanceDue" AS "balanceDue",
          GREATEST(0, (${asOfDate}::date - i."dueDate"::date)) AS "daysPastDue"
        FROM invoices i
        WHERE i.status IN ('SENT','OVERDUE','PARTIALLY_PAID')
          AND i."balanceDue" > 0
          AND ${invCond}
      )
      SELECT
        b."clientId" as "clientId",
        SUM(CASE WHEN b."daysPastDue" BETWEEN 0 AND 30 THEN b."balanceDue" ELSE 0 END) AS "bucket_0_30",
        SUM(CASE WHEN b."daysPastDue" BETWEEN 31 AND 60 THEN b."balanceDue" ELSE 0 END) AS "bucket_31_60",
        SUM(CASE WHEN b."daysPastDue" BETWEEN 61 AND 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_61_90",
        SUM(CASE WHEN b."daysPastDue" > 90 THEN b."balanceDue" ELSE 0 END) AS "bucket_90_plus"
      FROM base b
      GROUP BY b."clientId"
      ORDER BY (SUM(b."balanceDue")) DESC;
    `;

    // Enrich with customer names via Prisma (uses correct table mapping)
    const clientIds = (rows || []).map((r) => r.clientId).filter(Boolean);
    const clientWhere = clientIds.length ? { id: { in: clientIds }, ...ownerCompanyFilter(currentUser) } : { id: { in: [] } };
    const clients = clientIds.length
      ? await this.prisma.client.findMany({
          where: clientWhere,
          select: { id: true, companyName: true, contactName: true },
        })
      : [];
    const nameById = new Map(
      clients.map((c) => {
        const name = (c.companyName || '').trim() || (c.contactName || '').trim() || 'Unknown';
        return [c.id, name];
      })
    );

    return (rows || []).map((r) => ({
      ...r,
      customerName: nameById.get(r.clientId) || 'Unknown',
    }));
  }

  async monthlyRevenue({ from, to, mode = 'accrual', currentUser } = {}) {
    await this.planLimitService.enforceAdvancedReportsAccess(currentUser);
    const { fromDate, toDate } = this.normalizeRange(from, to);

    if (mode !== 'accrual' && mode !== 'cash') {
      throw new BadRequestException('mode must be accrual or cash');
    }

    const invCond = rawInvoiceCompanyCondition(Prisma, currentUser);
    const pmtCond = rawPaymentCompanyCondition(Prisma, currentUser);

    if (mode === 'accrual') {
      const rows = await this.prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', i."issueDate") AS month,
          SUM(i."totalAmount") AS revenue
        FROM invoices i
        WHERE i.status NOT IN ('DRAFT','CANCELLED')
          AND (${fromDate}::timestamptz IS NULL OR i."issueDate" >= ${fromDate})
          AND (${toDate}::timestamptz IS NULL OR i."issueDate" <= ${toDate})
          AND ${invCond}
        GROUP BY 1
        ORDER BY 1;
      `;
      return rows;
    }

    const rows = await this.prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', p."paymentDate") AS month,
        SUM(p.amount) AS cash_received
      FROM payments p
      WHERE p.status = 'COMPLETED'
        AND p.method <> 'CREDIT_NOTE'
        AND (${fromDate}::timestamptz IS NULL OR p."paymentDate" >= ${fromDate})
        AND (${toDate}::timestamptz IS NULL OR p."paymentDate" <= ${toDate})
        AND ${pmtCond}
      GROUP BY 1
      ORDER BY 1;
    `;

    return rows;
  }

  async trialBalance({ asOf, currentUser } = {}) {
    await this.planLimitService.enforceAdvancedReportsAccess(currentUser);
    const asOfDate = asOf ? new Date(asOf) : new Date();
    if (Number.isNaN(asOfDate.getTime())) {
      throw new BadRequestException('asOf must be a valid date');
    }
    const endOfDay = new Date(asOfDate);
    endOfDay.setHours(23, 59, 59, 999);

    const jeCondition = rawJournalEntryCompanyCondition(Prisma, currentUser);
    const rows = await this.prisma.$queryRaw`
      SELECT
        la.code AS "accountCode",
        la.name AS "accountName",
        la.type AS "accountType",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0)::decimal AS "debits",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0)::decimal AS "credits"
      FROM ledger_accounts la
      LEFT JOIN journal_lines jl ON jl."accountId" = la.id
      LEFT JOIN journal_entries je ON je.id = jl."entryId" AND je.status = 'POSTED' AND je.date <= ${endOfDay} AND ${jeCondition}
      WHERE la."isActive" = true
      GROUP BY la.id, la.code, la.name, la.type
      HAVING COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0) <> COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0)
      ORDER BY la.code;
    `;

    const totalDebits = (rows || []).reduce((sum, r) => sum.add(toDecimal(r.debits || '0')), toDecimal('0'));
    const totalCredits = (rows || []).reduce((sum, r) => sum.add(toDecimal(r.credits || '0')), toDecimal('0'));

    return {
      asOf: endOfDay.toISOString(),
      accounts: (rows || []).map((r) => ({
        accountCode: r.accountCode,
        accountName: r.accountName,
        accountType: r.accountType,
        debits: String(r.debits || '0'),
        credits: String(r.credits || '0'),
      })),
      totalDebits: String(totalDebits),
      totalCredits: String(totalCredits),
    };
  }

  async balanceSheet({ asOf, currentUser } = {}) {
    await this.planLimitService.enforceAdvancedReportsAccess(currentUser);
    const asOfDate = asOf ? new Date(asOf) : new Date();
    if (Number.isNaN(asOfDate.getTime())) {
      throw new BadRequestException('asOf must be a valid date');
    }
    const endOfDay = new Date(asOfDate);
    endOfDay.setHours(23, 59, 59, 999);

    const jeCondition = rawJournalEntryCompanyCondition(Prisma, currentUser);
    const rows = await this.prisma.$queryRaw`
      SELECT
        la.code AS "accountCode",
        la.name AS "accountName",
        la.type AS "accountType",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0)::decimal AS "debits",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0)::decimal AS "credits"
      FROM ledger_accounts la
      LEFT JOIN journal_lines jl ON jl."accountId" = la.id
      LEFT JOIN journal_entries je ON je.id = jl."entryId" AND je.status = 'POSTED' AND je.date <= ${endOfDay} AND ${jeCondition}
      WHERE la."isActive" = true AND la.type IN ('ASSET', 'LIABILITY', 'EQUITY')
      GROUP BY la.id, la.code, la.name, la.type
      ORDER BY la.type, la.code;
    `;

    const outstandingLoansAgg = await this.prisma.loan.aggregate({
      where: {
        ...ownerCompanyFilter(currentUser),
        loanDate: { lte: endOfDay },
      },
      _sum: { outstandingBalance: true },
    });

    const outstandingLoans = toDecimal(outstandingLoansAgg?._sum?.outstandingBalance || '0');

    let totalAssets = toDecimal('0');
    let totalLiabilities = toDecimal('0');
    let totalEquity = toDecimal('0');

    const assets = [];
    const liabilities = [];
    const equity = [];

    for (const r of rows || []) {
      const debits = toDecimal(r.debits || '0');
      const credits = toDecimal(r.credits || '0');

      if (r.accountType === 'ASSET') {
        let balance = debits.sub(credits);
        if (r.accountCode === '1300') {
          balance = outstandingLoans;
        }
        totalAssets = totalAssets.add(balance);
        if (!balance.eq(0)) assets.push({ accountCode: r.accountCode, accountName: r.accountName, amount: String(balance) });
      } else if (r.accountType === 'LIABILITY') {
        const balance = credits.sub(debits);
        totalLiabilities = totalLiabilities.add(balance);
        if (!balance.eq(0)) liabilities.push({ accountCode: r.accountCode, accountName: r.accountName, amount: String(balance) });
      } else if (r.accountType === 'EQUITY') {
        const balance = credits.sub(debits);
        totalEquity = totalEquity.add(balance);
        if (!balance.eq(0)) equity.push({ accountCode: r.accountCode, accountName: r.accountName, amount: String(balance) });
      }
    }

    const hasLoansReceivable = assets.some((a) => a.accountCode === '1300');
    if (!hasLoansReceivable && !outstandingLoans.eq(0)) {
      assets.push({ accountCode: '1300', accountName: 'Loans Receivable', amount: String(outstandingLoans) });
      totalAssets = totalAssets.add(outstandingLoans);
    }

    const incomeExpenseTotals = await this._incomeExpenseTotalsAsOf(endOfDay, currentUser);
    const netIncome = await this._netIncomeAsOf(endOfDay, currentUser);
    totalEquity = totalEquity.add(netIncome);

    const imbalance = totalAssets.sub(totalLiabilities).sub(totalEquity);

    return {
      asOf: endOfDay.toISOString(),
      assets: { accounts: assets, total: String(totalAssets) },
      liabilities: { accounts: liabilities, total: String(totalLiabilities) },
      equity: { accounts: equity, netIncome: String(netIncome), total: String(totalEquity) },
      reconciliation: {
        income: String(incomeExpenseTotals.income),
        expenses: String(incomeExpenseTotals.expenses),
        netIncome: String(netIncome),
        imbalanceAmount: String(imbalance),
      },
      balanced: imbalance.abs().lte(toDecimal('0.01')),
    };
  }

  async profitLoss({ from, to, currentUser } = {}) {
    await this.planLimitService.enforceAdvancedReportsAccess(currentUser);
    const { fromDate, toDate } = this.normalizeRange(from, to);

    const jeCondition = rawJournalEntryCompanyCondition(Prisma, currentUser);
    const rows = await this.prisma.$queryRaw`
      SELECT
        la.code AS "accountCode",
        la.name AS "accountName",
        la.type AS "accountType",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0)::decimal AS "debits",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0)::decimal AS "credits"
      FROM ledger_accounts la
      LEFT JOIN journal_lines jl ON jl."accountId" = la.id
      LEFT JOIN journal_entries je ON je.id = jl."entryId" AND je.status = 'POSTED'
        AND (${fromDate}::timestamptz IS NULL OR je.date >= ${fromDate})
        AND (${toDate}::timestamptz IS NULL OR je.date <= ${toDate})
        AND ${jeCondition}
      WHERE la."isActive" = true AND la.type IN ('INCOME', 'EXPENSE')
      GROUP BY la.id, la.code, la.name, la.type
      ORDER BY la.type, la.code;
    `;

    let totalIncome = toDecimal('0');
    let totalExpenses = toDecimal('0');
    const income = [];
    const expenses = [];

    for (const r of rows || []) {
      const debits = toDecimal(r.debits || '0');
      const credits = toDecimal(r.credits || '0');

      if (r.accountType === 'INCOME') {
        const amt = credits.sub(debits);
        totalIncome = totalIncome.add(amt);
        if (amt.gt(0)) income.push({ accountCode: r.accountCode, accountName: r.accountName, amount: String(amt) });
      } else if (r.accountType === 'EXPENSE') {
        const amt = debits.sub(credits);
        totalExpenses = totalExpenses.add(amt);
        if (amt.gt(0)) expenses.push({ accountCode: r.accountCode, accountName: r.accountName, amount: String(amt) });
      }
    }

    const netIncome = totalIncome.sub(totalExpenses);

    return {
      from: (fromDate || toDate || new Date()).toISOString(),
      to: (toDate || fromDate || new Date()).toISOString(),
      income: { accounts: income, total: String(totalIncome) },
      expenses: { accounts: expenses, total: String(totalExpenses) },
      netIncome: String(netIncome),
    };
  }

  async _netIncomeAsOf(asOfDate, currentUser) {
    const totals = await this._incomeExpenseTotalsAsOf(asOfDate, currentUser);
    return totals.income.sub(totals.expenses);
  }

  async _incomeExpenseTotalsAsOf(asOfDate, currentUser) {
    const jeCondition = rawJournalEntryCompanyCondition(Prisma, currentUser);
    const rows = await this.prisma.$queryRaw`
      SELECT
        la.type AS "accountType",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.debit ELSE 0 END), 0)::decimal AS "debits",
        COALESCE(SUM(CASE WHEN je.id IS NOT NULL THEN jl.credit ELSE 0 END), 0)::decimal AS "credits"
      FROM ledger_accounts la
      LEFT JOIN journal_lines jl ON jl."accountId" = la.id
      LEFT JOIN journal_entries je ON je.id = jl."entryId" AND je.status = 'POSTED' AND je.date <= ${asOfDate} AND ${jeCondition}
      WHERE la."isActive" = true AND la.type IN ('INCOME', 'EXPENSE')
      GROUP BY la.type;
    `;

    let income = toDecimal('0');
    let expenses = toDecimal('0');
    for (const r of rows || []) {
      const debits = toDecimal(r.debits || '0');
      const credits = toDecimal(r.credits || '0');
      if (r.accountType === 'INCOME') income = income.add(credits.sub(debits));
      else if (r.accountType === 'EXPENSE') expenses = expenses.add(debits.sub(credits));
    }
    return { income, expenses };
  }
}

module.exports = { ReportsService };
