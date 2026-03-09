const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { ownerCompanyFilter } = require('../../common/utils/company-scope');
const { LedgerService, SYSTEM_ACCOUNTS } = require('../ledger/ledger.service');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

@Injectable()
class BankAccountsService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Inject(LedgerService) ledgerService,
  ) {
    this.prisma = prismaService;
    this.ledgerService = ledgerService;
  }

  async create(userId, dto, { currentUser } = {}) {
    const bankName = cleanString(dto.bankName);
    if (!bankName) throw new BadRequestException('bankName is required');
    const accountName = cleanString(dto.accountName);
    if (!accountName) throw new BadRequestException('accountName is required');
    const company = (currentUser?.companyName || '').trim();
    const ledgerAccountCode = cleanString(dto.ledgerAccountCode) || SYSTEM_ACCOUNTS.BANK.code;

    const account = await this.prisma.ledgerAccount.findUnique({ where: { code: ledgerAccountCode } });
    if (!account) throw new BadRequestException('ledgerAccountCode does not exist');

    return this.prisma.businessBankAccount.create({
      data: {
        bankName,
        accountName,
        accountNumber: cleanString(dto.accountNumber),
        accountHolder: cleanString(dto.accountHolder),
        branchCode: cleanString(dto.branchCode),
        currency: cleanString(dto.currency) || 'ZAR',
        ledgerAccountCode,
        isActive: dto.isActive !== false,
        ownerCompanyName: company || null,
        createdByUserId: userId,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findAll({ page = 1, limit = 50, isActive, currentUser } = {}) {
    const where = { ...ownerCompanyFilter(currentUser) };
    if (isActive !== undefined) where.isActive = isActive === true || isActive === 'true';

    return this.prisma.paginate('businessBankAccount', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const where = { id, ...ownerCompanyFilter(currentUser) };
    const account = await this.prisma.businessBankAccount.findFirst({
      where,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!account) throw new NotFoundException('Bank account not found');
    return account;
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    const company = (currentUser?.companyName || '').trim();

    if (dto.ledgerAccountCode) {
      const acc = await this.prisma.ledgerAccount.findUnique({ where: { code: cleanString(dto.ledgerAccountCode) } });
      if (!acc) throw new BadRequestException('ledgerAccountCode does not exist');
    }

    return this.prisma.businessBankAccount.update({
      where: { id },
      data: {
        ...(dto.bankName != null ? { bankName: cleanString(dto.bankName) } : {}),
        ...(dto.accountName != null ? { accountName: cleanString(dto.accountName) } : {}),
        ...(dto.accountNumber !== undefined ? { accountNumber: cleanString(dto.accountNumber) } : {}),
        ...(dto.accountHolder !== undefined ? { accountHolder: cleanString(dto.accountHolder) } : {}),
        ...(dto.branchCode !== undefined ? { branchCode: cleanString(dto.branchCode) } : {}),
        ...(dto.currency !== undefined ? { currency: cleanString(dto.currency) || 'ZAR' } : {}),
        ...(dto.ledgerAccountCode !== undefined ? { ledgerAccountCode: cleanString(dto.ledgerAccountCode) } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(company ? { ownerCompanyName: company } : {}),
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    const hasReconciliations = await this.prisma.bankReconciliation.count({
      where: { bankAccountId: id },
    });
    if (hasReconciliations > 0) {
      throw new BadRequestException('Cannot delete bank account with existing reconciliations. Deactivate it instead.');
    }
    await this.prisma.businessBankAccount.delete({ where: { id } });
    return { ok: true };
  }
}

module.exports = { BankAccountsService };
