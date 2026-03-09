const { BadRequestException, Inject, Injectable, NotFoundException, Optional } = require('@nestjs/common');
const bcrypt = require('bcryptjs');
const { PrismaService } = require('../../config/prisma.service');
const { PlanLimitService } = require('../subscriptions/plan-limit.service');

@Injectable()
class UsersService {
  constructor(
    @Inject(PrismaService) prismaService,
    @Optional() @Inject(PlanLimitService) planLimitService = null,
  ) {
    this.prisma = prismaService;
    this.planLimitService = planLimitService;
    this.saltRounds = 12;
  }

  async list({ page = 1, limit = 20, q, currentUser } = {}) {
    const p = Number(page) || 1;
    const l = Number(limit) || 20;
    const skip = (p - 1) * l;

    const conditions = [];

    // Company scoping: admins see all users; others see same company + self.
    // (Company filter can exclude users when companyName differs slightly - relax for admin.)
    const company = (currentUser?.companyName || '').trim();
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.roleRef?.name === 'Admin';
    if (!isAdmin && company && currentUser?.id) {
      conditions.push({
        OR: [
          { companyName: { equals: company, mode: 'insensitive' } },
          { id: currentUser.id },
        ],
      });
    }

    if (q) {
      conditions.push({
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { id: 'asc' },
        skip,
        take: l,
        select: {
          id: true,
          userNumber: true,
          email: true,
          firstName: true,
          lastName: true,
          companyName: true,
          companyId: true,
          role: true,
          roleId: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          roleRef: { select: { id: true, name: true, color: true } },
          company: {
            select: {
              subscriptionStatus: true,
              trialEndsAt: true,
              subscriptions: {
                take: 1,
                orderBy: { createdAt: 'desc' },
                select: { status: true, plan: { select: { id: true, name: true, price: true } } },
              },
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
      },
    };
  }

  async create(dto, { currentUser } = {}) {
    if (this.planLimitService) {
      await this.planLimitService.enforceCreateUser(currentUser);
    }

    const emailNormalized = String(dto.email || '').trim().toLowerCase();
    if (!emailNormalized) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.prisma.user.findFirst({
      where: { email: { equals: emailNormalized, mode: 'insensitive' } },
    });
    if (existing) throw new BadRequestException('A user with this email already exists. Please use a different email.');

    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

    // Admins can only add users to their own company
    const rawCompany = currentUser?.companyName || dto.companyName || null;
    const companyName = rawCompany ? String(rawCompany).trim() || null : null;

    let role = dto.role || 'ACCOUNTANT';
    let roleId = dto.roleId || null;
    if (roleId) {
      const r = await this.prisma.role.findUnique({ where: { id: roleId } });
      if (r) {
        role = { Admin: 'ADMIN', Manager: 'MANAGER', Accountant: 'ACCOUNTANT' }[r.name] || 'ACCOUNTANT';
      } else {
        roleId = null;
      }
    }

    const created = await this.prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyName,
        role,
        roleId,
        isActive: dto.isActive != null ? Boolean(dto.isActive) : true,
      },
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        role: true,
        roleId: true,
        isActive: true,
        createdAt: true,
      },
    });

    return created;
  }

  async update(id, dto, { currentUserId, currentUser } = {}) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Admins can only manage users in their own company
    if (currentUser?.companyName) {
      const userCompany = (user.companyName || '').trim().toLowerCase();
      const adminCompany = (currentUser.companyName || '').trim().toLowerCase();
      if (userCompany !== adminCompany) {
        throw new NotFoundException('User not found');
      }
    }

    if (currentUserId && id === currentUserId && dto?.isActive === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    const email = dto.email != null ? String(dto.email).trim().toLowerCase() : undefined;
    if (email && email.toLowerCase() !== (user.email || '').toLowerCase()) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: { equals: email, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (existing) {
        throw new BadRequestException('A user with this email already exists. Please use a different email.');
      }
    }

    const data = {
      ...(dto.firstName != null ? { firstName: String(dto.firstName).trim() } : {}),
      ...(dto.lastName != null ? { lastName: String(dto.lastName).trim() } : {}),
      ...(dto.companyName !== undefined
        ? currentUser?.companyName
          ? { companyName: currentUser.companyName } // Admins cannot change company
          : { companyName: String(dto.companyName || '').trim() ? String(dto.companyName).trim() : null }
        : {}),
      ...(email != null ? { email } : {}),
      ...(dto.role != null ? { role: dto.role } : {}),
      ...(dto.isActive != null ? { isActive: Boolean(dto.isActive) } : {}),
    };

    if (dto.password != null) {
      const nextPassword = String(dto.password);
      if (nextPassword.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters');
      }
      data.password = await bcrypt.hash(nextPassword, this.saltRounds);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async remove(id, { currentUserId, currentUser } = {}) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Admins can only remove users in their own company
    if (currentUser?.companyName) {
      const userCompany = (user.companyName || '').trim().toLowerCase();
      const adminCompany = (currentUser.companyName || '').trim().toLowerCase();
      if (userCompany !== adminCompany) {
        throw new NotFoundException('User not found');
      }
    }

    if (currentUserId && id === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }

  async updateRole(id, dto, { currentUserId, currentUser } = {}) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Admins can only manage users in their own company
    if (currentUser?.companyName) {
      const userCompany = (user.companyName || '').trim().toLowerCase();
      const adminCompany = (currentUser.companyName || '').trim().toLowerCase();
      if (userCompany !== adminCompany) {
        throw new NotFoundException('User not found');
      }
    }

    const data = {};
    if (dto.roleId !== undefined) {
      if (dto.roleId) {
        const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
        if (!role) throw new BadRequestException('Role not found');
        data.roleId = dto.roleId;
        data.role = { Admin: 'ADMIN', Manager: 'MANAGER', Accountant: 'ACCOUNTANT' }[role.name] || 'ACCOUNTANT';
      } else {
        data.roleId = null;
      }
    }
    if (dto.isActive !== undefined) {
      if (currentUserId && id === currentUserId && dto.isActive === false) {
        throw new BadRequestException('You cannot deactivate your own account');
      }
      data.isActive = Boolean(dto.isActive);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        userNumber: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        role: true,
        roleId: true,
        isActive: true,
        lastLogin: true,
        roleRef: { select: { id: true, name: true, color: true } },
      },
    });
    return updated;
  }
}

module.exports = { UsersService };
