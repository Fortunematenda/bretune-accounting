const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { ownerCompanyFilter, userIdsForCompanyFilter } = require('../../common/utils/company-scope');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

@Injectable()
class BankingReconciliationService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject('PaymentsService') paymentsService,
    @Inject('SupplierPaymentsService') supplierPaymentsService,
    @Inject('ExpensesService') expensesService,
  ) {
    this.prisma = prismaService;
    this.paymentsService = paymentsService;
    this.supplierPaymentsService = supplierPaymentsService;
    this.expensesService = expensesService;
  }

  async matchTransaction(userId, transactionId, { type, recordId, currentUser } = {}) {
    const tx = await this.prisma.bankTransaction.findFirst({
      where: { id: transactionId, ...ownerCompanyFilter(currentUser) },
      include: { bankAccount: true },
    });
    if (!tx) throw new NotFoundException('Bank transaction not found');
    if (tx.isReconciled) throw new ConflictException('Transaction already reconciled');
    if (!type || !recordId) throw new BadRequestException('type and recordId are required');

    const amount = toDecimal(tx.amount || '0');
    const absAmount = amount.abs();

    return this.prisma.$transaction(async (dbTx) => {
      if (type === 'invoice') {
        const invoice = await dbTx.invoice.findFirst({
          where: { id: recordId },
          include: { client: true },
        });
        if (!invoice) throw new NotFoundException('Invoice not found');
        if (amount.lte(0)) throw new BadRequestException('Invoice payments must be positive amounts');
        const balanceDue = toDecimal(invoice.balanceDue || '0');
        if (absAmount.gt(balanceDue.add(0.01))) throw new BadRequestException('Amount exceeds invoice balance due');
        await this.paymentsService.create(userId, {
          clientId: invoice.clientId,
          amount: String(absAmount),
          method: 'BANK_TRANSFER',
          paymentDate: tx.transactionDate,
          allocations: [{ invoiceId: recordId, amount: String(absAmount) }],
          notes: `Matched from bank transaction ${tx.reference || tx.description || ''}`,
        }, { currentUser });
      } else if (type === 'bill') {
        const bill = await dbTx.bill.findFirst({
          where: { id: recordId },
        });
        if (!bill) throw new NotFoundException('Bill not found');
        if (!bill.supplierId) throw new BadRequestException('Bill has no supplier linked');
        if (amount.gte(0)) throw new BadRequestException('Bill payments must be negative amounts');
        const balanceDue = toDecimal(bill.balanceDue || '0');
        if (absAmount.gt(balanceDue.add(0.01))) throw new BadRequestException('Amount exceeds bill balance due');
        await this.supplierPaymentsService.create(userId, {
          supplierId: bill.supplierId,
          amount: String(absAmount),
          method: 'BANK_TRANSFER',
          allocations: [{ billId: recordId, amount: String(absAmount) }],
        }, { currentUser });
      } else if (type === 'expense') {
        const expense = await dbTx.expense.findFirst({
          where: { id: recordId },
        });
        if (!expense) throw new NotFoundException('Expense not found');
        if (amount.gte(0)) throw new BadRequestException('Expense payments must be negative amounts');
        const expAmount = toDecimal(expense.totalAmount || expense.amount || '0');
        if (!absAmount.eq(expAmount) && !absAmount.sub(expAmount).abs().lte(0.01)) {
          throw new BadRequestException('Amount does not match expense total');
        }
        await this.expensesService.update(recordId, { status: 'APPROVED' }, { currentUser });
      } else if (type === 'journal' || type === 'transfer') {
      } else {
        throw new BadRequestException('Invalid match type');
      }

      await dbTx.bankTransaction.update({
        where: { id: transactionId },
        data: {
          isReconciled: true,
          matchedType: type,
          matchedId: recordId,
        },
      });

      return this.prisma.bankTransaction.findUnique({
        where: { id: transactionId },
        include: { bankAccount: true },
      });
    });
  }

  async unmatchTransaction(transactionId, { currentUser } = {}) {
    const tx = await this.prisma.bankTransaction.findFirst({
      where: { id: transactionId, ...ownerCompanyFilter(currentUser) },
    });
    if (!tx) throw new NotFoundException('Bank transaction not found');
    if (!tx.isReconciled) return tx;
    if (tx.matchedType && tx.matchedId) {
      throw new BadRequestException('Cannot unmatch: reverse the payment or expense first');
    }
    await this.prisma.bankTransaction.update({
      where: { id: transactionId },
      data: { isReconciled: false, matchedType: null, matchedId: null },
    });
    return this.prisma.bankTransaction.findUnique({
      where: { id: transactionId },
      include: { bankAccount: true },
    });
  }

  async createExpenseFromTransaction(userId, transactionId, dto, { currentUser } = {}) {
    const tx = await this.prisma.bankTransaction.findFirst({
      where: { id: transactionId, ...ownerCompanyFilter(currentUser) },
      include: { bankAccount: true },
    });
    if (!tx) throw new NotFoundException('Bank transaction not found');
    if (tx.isReconciled) throw new ConflictException('Transaction already reconciled');
    if (toDecimal(tx.amount || '0').gte(0)) throw new BadRequestException('Only withdrawals can be created as expenses');

    const absAmount = toDecimal(tx.amount || '0').abs();
    const categoryId = cleanString(dto.categoryId);
    if (!categoryId) throw new BadRequestException('categoryId is required');

    const expense = await this.expensesService.create(userId, {
      amount: String(absAmount),
      totalAmount: String(absAmount),
      expenseDate: tx.transactionDate,
      description: dto.description || tx.description || 'Bank withdrawal',
      categoryId,
      supplierId: dto.supplierId,
      status: 'DRAFT',
      paymentMethod: 'BANK_TRANSFER',
      notes: `Created from bank transaction: ${tx.reference || ''}`,
    }, { currentUser });

    await this.expensesService.approve(expense.id, { currentUser });
    await this.expensesService.reimburse(expense.id, { currentUser });

    await this.prisma.bankTransaction.update({
      where: { id: transactionId },
      data: { isReconciled: true, matchedType: 'expense', matchedId: expense.id },
    });

    return {
      expense: await this.expensesService.findOne(expense.id, { currentUser }),
      transaction: await this.prisma.bankTransaction.findUnique({
        where: { id: transactionId },
        include: { bankAccount: true },
      }),
    };
  }
}

module.exports = { BankingReconciliationService };
