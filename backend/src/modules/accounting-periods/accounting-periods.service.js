const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

function cleanString(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

@Injectable()
class AccountingPeriodsService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async getLockedThroughDate() {
    const closed = await this.prisma.accountingPeriod.findFirst({
      where: { status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
    });
    return closed ? closed.endDate : null;
  }

  async assertDateAllowedForPosting(date) {
    const lockedThrough = await this.getLockedThroughDate();
    if (!lockedThrough) return;
    const d = date ? new Date(date) : new Date();
    if (d <= lockedThrough) {
      throw new BadRequestException(
        `Cannot post to closed period. Accounting is locked through ${lockedThrough.toISOString().slice(0, 10)}.`
      );
    }
  }

  async findAll({ page = 1, limit = 50, status } = {}) {
    const where = {};
    if (status) where.status = status;

    return this.prisma.paginate('accountingPeriod', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { startDate: 'desc' },
    });
  }

  async create(dto) {
    const startDate = dto.startDate ? new Date(dto.startDate) : null;
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (!startDate || !endDate) throw new BadRequestException('startDate and endDate are required');
    if (endDate < startDate) throw new BadRequestException('endDate must be on or after startDate');

    const name = cleanString(dto.name) || `${startDate.toISOString().slice(0, 7)}`;

    return this.prisma.accountingPeriod.create({
      data: {
        startDate,
        endDate,
        name,
        status: 'OPEN',
      },
    });
  }

  async close(id, userId) {
    const period = await this.prisma.accountingPeriod.findUnique({ where: { id } });
    if (!period) throw new NotFoundException('Accounting period not found');
    if (period.status === 'CLOSED') throw new BadRequestException('Period already closed');

    return this.prisma.accountingPeriod.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closedByUserId: userId,
      },
    });
  }

  async reopen(id, userId) {
    const period = await this.prisma.accountingPeriod.findUnique({ where: { id } });
    if (!period) throw new NotFoundException('Accounting period not found');
    if (period.status !== 'CLOSED') throw new BadRequestException('Period is not closed');

    const laterClosed = await this.prisma.accountingPeriod.findFirst({
      where: { status: 'CLOSED', endDate: { gt: period.endDate } },
    });
    if (laterClosed) {
      throw new BadRequestException(
        'Cannot reopen: a later period is already closed. Reopen periods in reverse order.'
      );
    }

    return this.prisma.accountingPeriod.update({
      where: { id },
      data: {
        status: 'OPEN',
        closedAt: null,
        closedByUserId: null,
      },
    });
  }
}

module.exports = { AccountingPeriodsService };
