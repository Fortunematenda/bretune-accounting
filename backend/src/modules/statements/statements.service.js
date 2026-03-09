const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { ownerCompanyFilter, userCompanyFilter } = require('../../common/utils/company-scope');

@Injectable()
class StatementsService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
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

    // inclusive end-of-day
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    return { fromDate, toDate };
  }

  async getClientStatement(clientId, { from, to, currentUser } = {}) {
    const { fromDate, toDate } = this.normalizeRange(from, to);

    const clientWhere = { id: clientId, ...ownerCompanyFilter(currentUser) };
    const client = await this.prisma.client.findFirst({
      where: clientWhere,
      select: {
        id: true,
        type: true,
        companyName: true,
        contactName: true,
        email: true,
        openingBalance: true,
        creditBalance: true,
      },
    });

    if (!client) throw new NotFoundException('Client not found');

    const invFilter = userCompanyFilter(currentUser);
    const pmtFilter = userCompanyFilter(currentUser);
    // Compute opening as-of fromDate
    const invoiceBeforeWhere = {
      ...invFilter,
      clientId,
      status: { not: 'CANCELLED' },
    };
    const paymentBeforeWhere = {
      ...pmtFilter,
      clientId,
      status: 'COMPLETED',
    };
    const loanBeforeWhere = {
      customerId: clientId,
      ...ownerCompanyFilter(currentUser),
    };
    const repaymentBeforeWhere = {
      loan: {
        customerId: clientId,
        ...ownerCompanyFilter(currentUser),
      },
    };

    if (fromDate) {
      invoiceBeforeWhere.issueDate = { lt: fromDate };
      paymentBeforeWhere.paymentDate = { lt: fromDate };
      loanBeforeWhere.loanDate = { lt: fromDate };
      repaymentBeforeWhere.paymentDate = { lt: fromDate };
    }

    const [invBeforeAgg, payBeforeAgg, loanBeforeAgg, repayBeforeAgg] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: invoiceBeforeWhere,
        _sum: { totalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: paymentBeforeWhere,
        _sum: { amount: true },
      }),
      this.prisma.loan.aggregate({
        where: loanBeforeWhere,
        _sum: { amount: true },
      }),
      this.prisma.loanRepayment.aggregate({
        where: repaymentBeforeWhere,
        _sum: { amount: true },
      }),
    ]);

    const openingBalance = toDecimal(client.openingBalance || '0')
      .add(toDecimal(invBeforeAgg._sum.totalAmount || '0'))
      .sub(toDecimal(payBeforeAgg._sum.amount || '0'))
      .add(toDecimal(loanBeforeAgg._sum.amount || '0'))
      .sub(toDecimal(repayBeforeAgg._sum.amount || '0'));

    const whereInvoice = {
      ...invFilter,
      clientId,
      status: { not: 'CANCELLED' },
    };
    const wherePayment = {
      ...pmtFilter,
      clientId,
      status: 'COMPLETED',
    };
    const whereLoan = {
      customerId: clientId,
      ...ownerCompanyFilter(currentUser),
    };
    const whereLoanRepayment = {
      loan: {
        customerId: clientId,
        ...ownerCompanyFilter(currentUser),
      },
    };

    if (fromDate || toDate) {
      const invoiceRange = {};
      const paymentRange = {};
      const loanRange = {};
      const loanRepaymentRange = {};
      if (fromDate) {
        invoiceRange.gte = fromDate;
        paymentRange.gte = fromDate;
        loanRange.gte = fromDate;
        loanRepaymentRange.gte = fromDate;
      }
      if (toDate) {
        invoiceRange.lte = toDate;
        paymentRange.lte = toDate;
        loanRange.lte = toDate;
        loanRepaymentRange.lte = toDate;
      }
      whereInvoice.issueDate = invoiceRange;
      wherePayment.paymentDate = paymentRange;
      whereLoan.loanDate = loanRange;
      whereLoanRepayment.paymentDate = loanRepaymentRange;
    }

    const [invoices, payments, loans, loanRepayments, loanBalanceAgg] = await Promise.all([
      this.prisma.invoice.findMany({
        where: whereInvoice,
        orderBy: { issueDate: 'asc' },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          issueDate: true,
          dueDate: true,
          totalAmount: true,
          amountPaid: true,
          balanceDue: true,
        },
      }),
      this.prisma.payment.findMany({
        where: wherePayment,
        orderBy: { paymentDate: 'asc' },
        select: {
          id: true,
          paymentNumber: true,
          amount: true,
          method: true,
          paymentDate: true,
          invoiceId: true,
          allocations: {
            select: {
              invoiceId: true,
              amount: true,
            },
          },
        },
      }),
      this.prisma.loan.findMany({
        where: whereLoan,
        orderBy: { loanDate: 'asc' },
        select: {
          id: true,
          borrowerName: true,
          loanDate: true,
          dueDate: true,
          amount: true,
          outstandingBalance: true,
          status: true,
        },
      }),
      this.prisma.loanRepayment.findMany({
        where: whereLoanRepayment,
        orderBy: { paymentDate: 'asc' },
        select: {
          id: true,
          loanId: true,
          amount: true,
          paymentDate: true,
          notes: true,
          loan: {
            select: {
              borrowerName: true,
            },
          },
        },
      }),
      this.prisma.loan.aggregate({
        where: {
          customerId: clientId,
          ...ownerCompanyFilter(currentUser),
        },
        _sum: {
          outstandingBalance: true,
          amount: true,
        },
        _count: { _all: true },
      }),
    ]);

    const events = [];

    for (const inv of invoices) {
      events.push({
        type: 'INVOICE',
        date: inv.issueDate,
        reference: inv.invoiceNumber,
        invoiceId: inv.id,
        debit: String(inv.totalAmount),
        credit: '0.00',
      });
    }

    for (const pay of payments) {
      const allocations = Array.isArray(pay.allocations) ? pay.allocations : [];

      if (allocations.length > 0) {
        for (const a of allocations) {
          events.push({
            type: 'PAYMENT',
            date: pay.paymentDate,
            reference: pay.paymentNumber,
            invoiceId: a.invoiceId,
            debit: '0.00',
            credit: String(a.amount),
            method: pay.method,
          });
        }
        continue;
      }

      events.push({
        type: 'PAYMENT',
        date: pay.paymentDate,
        reference: pay.paymentNumber,
        invoiceId: pay.invoiceId,
        debit: '0.00',
        credit: String(pay.amount),
        method: pay.method,
      });
    }

    for (const loan of loans) {
      events.push({
        type: 'LOAN',
        date: loan.loanDate,
        reference: `Loan ${loan.id.slice(-6)}`,
        loanId: loan.id,
        debit: String(loan.amount),
        credit: '0.00',
        borrowerName: loan.borrowerName,
      });
    }

    for (const repayment of loanRepayments) {
      events.push({
        type: 'LOAN_REPAYMENT',
        date: repayment.paymentDate,
        reference: `Repayment ${repayment.id.slice(-6)}`,
        loanId: repayment.loanId,
        debit: '0.00',
        credit: String(repayment.amount),
        borrowerName: repayment.loan?.borrowerName,
      });
    }

    // Sort by date, then invoices first (consistent)
    events.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) return da - db;
      if (a.type === b.type) return 0;
      const order = { INVOICE: 0, LOAN: 1, PAYMENT: 2, LOAN_REPAYMENT: 3 };
      return (order[a.type] ?? 99) - (order[b.type] ?? 99);
    });

    let running = openingBalance;
    const ledger = events.map((e) => {
      const debit = toDecimal(e.debit || '0');
      const credit = toDecimal(e.credit || '0');
      running = running.add(debit).sub(credit);
      return {
        ...e,
        runningBalance: String(running),
      };
    });

    return {
      client,
      range: {
        from: fromDate ? fromDate.toISOString() : null,
        to: toDate ? toDate.toISOString() : null,
      },
      openingBalance: String(openingBalance),
      closingBalance: String(running),
      invoices,
      payments,
      loans,
      loanRepayments,
      loansSummary: {
        totalLoaned: String(loanBalanceAgg?._sum?.amount || '0'),
        outstandingLoanBalance: String(loanBalanceAgg?._sum?.outstandingBalance || '0'),
        loanCount: loanBalanceAgg?._count?._all || 0,
      },
      ledger,
    };
  }
}

module.exports = { StatementsService };
