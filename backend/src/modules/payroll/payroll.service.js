const { BadRequestException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { toDecimal } = require('../../common/utils/money');

@Injectable()
class PayrollService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async createPayRun(dto) {
    const start = dto.payPeriodStart ? new Date(dto.payPeriodStart) : new Date();
    const end = dto.payPeriodEnd ? new Date(dto.payPeriodEnd) : new Date();
    if (end < start) throw new BadRequestException('Pay period end must be after start');

    return this.prisma.payRun.create({
      data: {
        payPeriodStart: start,
        payPeriodEnd: end,
        status: 'DRAFT',
      },
    });
  }

  async addLine(payRunId, dto) {
    const run = await this.prisma.payRun.findUnique({ where: { id: payRunId } });
    if (!run) throw new NotFoundException('Pay run not found');
    if (run.status !== 'DRAFT') throw new BadRequestException('Can only add lines to DRAFT pay runs');

    const gross = toDecimal(dto.grossPay || '0');
    const deductions = toDecimal(dto.deductions || '0');
    const net = gross.sub(deductions);

    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.payRunLine.create({
      data: {
        payRunId,
        employeeId: dto.employeeId,
        grossPay: String(gross),
        deductions: String(deductions),
        netPay: String(net),
        notes: dto.notes,
      },
    });
  }

  async findAll({ page = 1, limit = 20, status } = {}) {
    const where = {};
    if (status) where.status = status;

    return this.prisma.paginate('payRun', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { payPeriodStart: 'desc' },
      include: { lines: { include: { employee: true } } },
    });
  }

  async findOne(id) {
    const run = await this.prisma.payRun.findUnique({
      where: { id },
      include: { lines: { include: { employee: true } } },
    });
    if (!run) throw new NotFoundException('Pay run not found');
    return run;
  }
}

module.exports = { PayrollService };
