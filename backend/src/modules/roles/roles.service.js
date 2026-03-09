const { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

@Injectable()
class RolesService {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  async list({ page = 1, limit = 50, q } = {}) {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (p - 1) * l;
    const where = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: l,
        include: {
          _count: { select: { rolePermissions: true, users: true } },
        },
      }),
      this.prisma.role.count({ where }),
    ]);
    return {
      data: data.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        color: r.color,
        createdAt: r.createdAt,
        permissionCount: r._count.rolePermissions,
        userCount: r._count.users,
      })),
      meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) },
    };
  }

  async getById(id) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return {
      ...role,
      permissions: role.rolePermissions.map((rp) => rp.permission),
      userCount: role._count.users,
    };
  }

  async create(dto) {
    const name = (dto.name || '').trim();
    if (!name) throw new BadRequestException('Role name is required');
    const existing = await this.prisma.role.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existing) throw new ConflictException('A role with this name already exists');
    const role = await this.prisma.role.create({
      data: {
        name,
        description: (dto.description || '').trim() || null,
        isSystem: false,
        color: (dto.color || '').trim() || null,
      },
    });
    if (dto.permissionIds && Array.isArray(dto.permissionIds) && dto.permissionIds.length) {
      await this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((pid) => ({ roleId: role.id, permissionId: pid })),
        skipDuplicates: true,
      });
    }
    return this.getById(role.id);
  }

  async update(id, dto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem && dto.name && dto.name.trim() !== role.name) {
      throw new BadRequestException('System roles cannot be renamed');
    }
    const name = (dto.name || '').trim();
    if (name) {
      const existing = await this.prisma.role.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (existing) throw new ConflictException('A role with this name already exists');
    }
    const data = {};
    if (dto.name !== undefined) data.name = name || role.name;
    if (dto.description !== undefined) data.description = (dto.description || '').trim() || null;
    if (dto.color !== undefined) data.color = (dto.color || '').trim() || null;
    if (Object.keys(data).length) {
      await this.prisma.role.update({ where: { id }, data });
    }
    if (dto.permissionIds && Array.isArray(dto.permissionIds)) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
      if (dto.permissionIds.length) {
        await this.prisma.rolePermission.createMany({
          data: dto.permissionIds.map((pid) => ({ roleId: id, permissionId: pid })),
          skipDuplicates: true,
        });
      }
    }
    return this.getById(id);
  }

  async remove(id) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted');
    }
    const userCount = await this.prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new BadRequestException(`Cannot delete role: ${userCount} user(s) are assigned to it`);
    }
    await this.prisma.role.delete({ where: { id } });
    return { ok: true };
  }

  async duplicate(id) {
    const source = await this.getById(id);
    const newName = `${source.name} (Copy)`;
    const exists = await this.prisma.role.findFirst({
      where: { name: { equals: newName, mode: 'insensitive' } },
    });
    const baseName = exists ? `${source.name} (Copy ${Date.now()})` : newName;
    const permissionIds = source.permissions.map((p) => p.id);
    return this.create({ name: baseName, description: source.description, color: source.color, permissionIds });
  }
}

module.exports = { RolesService };
