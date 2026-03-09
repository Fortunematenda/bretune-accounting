const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { clientOwnerCompanyFilter, ownerCompanyFilter } = require('../../common/utils/company-scope');

@Injectable()
class ProjectsService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async create(dto, { currentUser } = {}) {
    const name = String(dto.name || '').trim();
    if (!name) throw new BadRequestException('name is required');

    let clientId = dto.clientId != null && String(dto.clientId).trim() ? String(dto.clientId).trim() : null;
    if (clientId) {
      const clientWhere = { id: clientId, ...ownerCompanyFilter(currentUser) };
      const client = await this.prisma.client.findFirst({ where: clientWhere, select: { id: true } });
      if (!client) throw new BadRequestException('clientId is invalid');
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : null;
    const endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (startDate && Number.isNaN(startDate.getTime())) throw new BadRequestException('startDate must be a valid date');
    if (endDate && Number.isNaN(endDate.getTime())) throw new BadRequestException('endDate must be a valid date');
    if (startDate && endDate && endDate < startDate) throw new BadRequestException('endDate must be on or after startDate');

    return this.prisma.project.create({
      data: {
        name,
        description: dto.description != null && String(dto.description).trim() ? String(dto.description).trim() : null,
        status: dto.status || 'ACTIVE',
        startDate,
        endDate,
        clientId,
      },
    });
  }

  async findAll({ page = 1, limit = 20, q, status, clientId } = {}, { currentUser } = {}) {
    const where = { ...clientOwnerCompanyFilter(currentUser) };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.paginate('project', {
      page: Number(page),
      limit: Number(limit),
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
      },
    });
  }

  async findOne(id, { currentUser } = {}) {
    const project = await this.prisma.project.findFirst({
      where: { id, ...clientOwnerCompanyFilter(currentUser) },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
        tasks: { select: { id: true, title: true, status: true, dueDate: true, priority: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id, dto, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const startDate = dto.startDate !== undefined ? (dto.startDate ? new Date(dto.startDate) : null) : undefined;
    const endDate = dto.endDate !== undefined ? (dto.endDate ? new Date(dto.endDate) : null) : undefined;

    if (startDate && Number.isNaN(startDate.getTime())) throw new BadRequestException('startDate must be a valid date');
    if (endDate && Number.isNaN(endDate.getTime())) throw new BadRequestException('endDate must be a valid date');
    if (startDate && endDate && endDate < startDate) throw new BadRequestException('endDate must be on or after startDate');

    const clientId = dto.clientId !== undefined
      ? (dto.clientId != null && String(dto.clientId).trim() ? String(dto.clientId).trim() : null)
      : undefined;

    if (clientId) {
      const clientWhere = { id: clientId, ...ownerCompanyFilter(currentUser) };
      const client = await this.prisma.client.findFirst({ where: clientWhere, select: { id: true } });
      if (!client) throw new BadRequestException('clientId is invalid');
    }

    return this.prisma.project.update({
      where: { id, ...clientOwnerCompanyFilter(currentUser) },
      data: {
        ...(dto.name != null ? { name: String(dto.name).trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description != null && String(dto.description).trim() ? String(dto.description).trim() : null }
          : {}),
        ...(dto.status != null ? { status: dto.status } : {}),
        ...(startDate !== undefined ? { startDate } : {}),
        ...(endDate !== undefined ? { endDate } : {}),
        ...(clientId !== undefined ? { clientId } : {}),
      },
      include: {
        client: { select: { id: true, companyName: true, contactName: true } },
      },
    });
  }

  async remove(id, { currentUser } = {}) {
    await this.findOne(id, { currentUser });

    const taskCount = await this.prisma.task.count({ where: { projectId: id } });
    if (taskCount > 0) {
      throw new ConflictException('Cannot delete this project because it has related tasks. Set status to CANCELLED instead.');
    }

    await this.prisma.project.delete({ where: { id, ...clientOwnerCompanyFilter(currentUser) } });
    return { ok: true };
  }
}

module.exports = { ProjectsService };
