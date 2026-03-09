const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');
const { ownerCompanyFilter, getOwnerCompany } = require('../../common/utils/company-scope');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function normalizeEmail(v) {
  const s = cleanString(v);
  if (!s) return null;
  return s.toLowerCase();
}

function toIntOrDefault(v, defaultValue) {
  if (v == null || String(v).trim() === '') return defaultValue;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 365) {
    throw new BadRequestException('paymentTermsDays must be between 0 and 365');
  }
  return Math.floor(n);
}

@Injectable()
class SuppliersService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  computeAgingBuckets(bills) {
    const now = new Date();
    const buckets = {
      current: toDecimal('0'),
      d1_30: toDecimal('0'),
      d31_60: toDecimal('0'),
      d61_90: toDecimal('0'),
      d90_plus: toDecimal('0'),
    };

    for (const b of bills || []) {
      const bal = toDecimal(b?.balanceDue || '0');
      if (bal.lte(0)) continue;

      const due = b?.dueDate ? new Date(b.dueDate) : null;
      if (!due || Number.isNaN(due.getTime())) {
        buckets.current = buckets.current.add(bal);
        continue;
      }

      const days = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 0) buckets.current = buckets.current.add(bal);
      else if (days <= 30) buckets.d1_30 = buckets.d1_30.add(bal);
      else if (days <= 60) buckets.d31_60 = buckets.d31_60.add(bal);
      else if (days <= 90) buckets.d61_90 = buckets.d61_90.add(bal);
      else buckets.d90_plus = buckets.d90_plus.add(bal);
    }

    return {
      current: String(buckets.current),
      d1_30: String(buckets.d1_30),
      d31_60: String(buckets.d31_60),
      d61_90: String(buckets.d61_90),
      d90_plus: String(buckets.d90_plus),
    };
  }

  async create(dto, { currentUser } = {}) {
    const supplierName = String(dto.supplierName || dto.name || '').trim();
    if (!supplierName) throw new BadRequestException('supplierName is required');

    const email = normalizeEmail(dto.email);
    const phone = cleanString(dto.phone);
    const ownerCompany = getOwnerCompany(currentUser);

    if (email) {
      const existing = await this.prisma.supplier.findFirst({
        where: { ...ownerCompanyFilter(currentUser), email },
        select: { id: true },
      });
      if (existing) throw new ConflictException('A supplier with this email already exists');
    }

    if (phone) {
      const existing = await this.prisma.supplier.findFirst({
        where: { ...ownerCompanyFilter(currentUser), phone },
        select: { id: true },
      });
      if (existing) throw new ConflictException('A supplier with this phone already exists');
    }

    return this.prisma.supplier.create({
      data: {
        supplierName,
        companyName: cleanString(dto.companyName),
        contactPerson: cleanString(dto.contactPerson),
        email,
        phone,
        address: cleanString(dto.address),
        taxNumber: cleanString(dto.taxNumber),
        paymentTermsDays: toIntOrDefault(dto.paymentTermsDays, 30),
        status: dto.status || 'ACTIVE',
        notes: cleanString(dto.notes),
        ownerCompanyName: ownerCompany,
      },
    });
  }

  async findAll({ page = 1, limit = 20, q, status, currentUser } = {}) {
    const where = { ...ownerCompanyFilter(currentUser) };

    if (status) where.status = status;

    if (q) {
      where.OR = [
        { supplierName: { contains: q, mode: 'insensitive' } },
        { companyName: { contains: q, mode: 'insensitive' } },
        { contactPerson: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('supplier', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const where = { id, ...ownerCompanyFilter(currentUser) };
    const supplier = await this.prisma.supplier.findFirst({
      where,
      include: {
        bills: {
          orderBy: { billDate: 'desc' },
          take: 100,
          select: {
            id: true,
            billNumber: true,
            reference: true,
            vendorName: true,
            billDate: true,
            dueDate: true,
            status: true,
            totalAmount: true,
            amountPaid: true,
            balanceDue: true,
            paidDate: true,
            createdAt: true,
          },
        },
        supplierPayments: {
          orderBy: { paymentDate: 'desc' },
          take: 100,
          select: {
            id: true,
            paymentNumber: true,
            amount: true,
            unallocatedAmount: true,
            status: true,
            method: true,
            reference: true,
            paymentDate: true,
            createdAt: true,
          },
        },
      },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');

    const openBills = (supplier.bills || []).filter((b) => {
      const s = String(b?.status || '').toUpperCase();
      return ['OPEN', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID'].includes(s);
    });

    const outstandingBalance = openBills.reduce((sum, b) => sum.add(toDecimal(b.balanceDue || '0')), toDecimal('0'));
    const totalBills = Number(supplier?.bills?.length || 0);
    const totalPaid = toDecimal(supplier?.totalPaid || '0');
    const aging = this.computeAgingBuckets(openBills);

    return {
      ...supplier,
      analytics: {
        totalBills,
        totalPaid: String(totalPaid),
        outstandingBalance: String(outstandingBalance),
        aging,
      },
      payments: supplier.supplierPayments,
      transactions: [],
    };
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const email = dto.email !== undefined ? normalizeEmail(dto.email) : undefined;
    const phone = dto.phone !== undefined ? cleanString(dto.phone) : undefined;

    if (email != null) {
      const existing = await this.prisma.supplier.findFirst({
        where: { ...ownerCompanyFilter(currentUser), id: { not: id }, email },
        select: { id: true },
      });
      if (existing) throw new ConflictException('A supplier with this email already exists');
    }

    if (phone != null) {
      const existing = await this.prisma.supplier.findFirst({
        where: { ...ownerCompanyFilter(currentUser), id: { not: id }, phone },
        select: { id: true },
      });
      if (existing) throw new ConflictException('A supplier with this phone already exists');
    }

    const paymentTermsDays =
      dto.paymentTermsDays !== undefined ? toIntOrDefault(dto.paymentTermsDays, 30) : undefined;

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...(dto.supplierName != null || dto.name != null
          ? { supplierName: String(dto.supplierName || dto.name).trim() }
          : {}),
        ...(dto.companyName !== undefined ? { companyName: cleanString(dto.companyName) } : {}),
        ...(dto.contactPerson !== undefined ? { contactPerson: cleanString(dto.contactPerson) } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(dto.address !== undefined ? { address: cleanString(dto.address) } : {}),
        ...(dto.taxNumber !== undefined ? { taxNumber: cleanString(dto.taxNumber) } : {}),
        ...(paymentTermsDays !== undefined ? { paymentTermsDays } : {}),
        ...(dto.status != null ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: cleanString(dto.notes) } : {}),
      },
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });
    await this.prisma.supplier.delete({ where: { id } });
    return { ok: true };
  }
}

module.exports = { SuppliersService };
