const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

function normalizeEmail(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.toLowerCase();
}

@Injectable()
class EmployeesService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(dto) {
    const firstName = String(dto.firstName || '').trim();
    const lastName = String(dto.lastName || '').trim();
    if (!firstName || !lastName) {
      throw new BadRequestException('firstName and lastName are required');
    }

    const email = normalizeEmail(dto.email);

    try {
      return await this.prisma.employee.create({
        data: {
          email,
          firstName,
          lastName,
          phone: dto.phone != null && String(dto.phone).trim() ? String(dto.phone).trim() : null,
          title: dto.title != null && String(dto.title).trim() ? String(dto.title).trim() : null,
          isActive: dto.isActive != null ? Boolean(dto.isActive) : true,
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new ConflictException('An employee with this email already exists');
      }
      throw e;
    }
  }

  async findAll({ page = 1, limit = 20, q, isActive } = {}) {
    const where = {};

    if (isActive != null && isActive !== '') {
      where.isActive = String(isActive).toLowerCase() === 'true';
    }

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('employee', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id, dto) {
    await this.findOne(id);

    const email = dto.email !== undefined ? normalizeEmail(dto.email) : undefined;

    try {
      return await this.prisma.employee.update({
        where: { id },
        data: {
          ...(dto.firstName != null ? { firstName: String(dto.firstName).trim() } : {}),
          ...(dto.lastName != null ? { lastName: String(dto.lastName).trim() } : {}),
          ...(email !== undefined ? { email } : {}),
          ...(dto.phone !== undefined
            ? { phone: dto.phone != null && String(dto.phone).trim() ? String(dto.phone).trim() : null }
            : {}),
          ...(dto.title !== undefined
            ? { title: dto.title != null && String(dto.title).trim() ? String(dto.title).trim() : null }
            : {}),
          ...(dto.isActive != null ? { isActive: Boolean(dto.isActive) } : {}),
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new ConflictException('An employee with this email already exists');
      }
      throw e;
    }
  }

  async remove(id) {
    await this.findOne(id);
    await this.prisma.employee.delete({ where: { id } });
    return { ok: true };
  }
}

module.exports = { EmployeesService };
