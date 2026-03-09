const { ForbiddenException, Inject, Injectable } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');
const { getPlanKey, getPlanLimits } = require('../../config/plans');

@Injectable()
class PlanLimitService {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  async resolvePlan(currentUser) {
    const companyId = currentUser?.companyId;
    const companyName = (currentUser?.companyName || '').trim();

    if (!companyId && !companyName) {
      return { planKey: 'starter', limits: getPlanLimits('starter'), planName: 'Starter' };
    }

    let company = null;
    if (companyId) {
      company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { subscriptions: { include: { plan: true } } },
      });
    }
    if (!company && companyName) {
      company = await this.prisma.company.findFirst({
        where: { name: { equals: companyName, mode: 'insensitive' } },
        include: { subscriptions: { include: { plan: true } } },
      });
    }

    if (!company) {
      return { planKey: 'starter', limits: getPlanLimits('starter'), planName: 'Starter' };
    }

    const sub = company.subscriptions?.[0];
    const plan = sub?.plan;
    const planKey = getPlanKey(plan?.name);
    const limits = getPlanLimits(planKey);

    return {
      planKey,
      limits,
      planName: limits.name,
      companyId: company.id,
    };
  }

  async canCreateUser(currentUser) {
    const { limits, planName } = await this.resolvePlan(currentUser);
    if (limits.max_users == null) return { allowed: true };

    const companyId = currentUser?.companyId;
    const companyName = (currentUser?.companyName || '').trim();

    let where = {};
    if (companyId) {
      where = { companyId };
    } else if (companyName) {
      where = { companyName: { equals: companyName, mode: 'insensitive' } };
    } else {
      return { allowed: true };
    }

    const count = await this.prisma.user.count({ where });
    const allowed = count < limits.max_users;
    return {
      allowed,
      current: count,
      limit: limits.max_users,
      planName,
    };
  }

  async canCreateClient(currentUser) {
    const { limits, planName } = await this.resolvePlan(currentUser);
    if (limits.max_clients == null) return { allowed: true };

    const ownerCompany = (currentUser?.companyName || '').trim() || null;
    const where = ownerCompany
      ? { ownerCompanyName: { equals: ownerCompany, mode: 'insensitive' } }
      : { ownerCompanyName: null };

    const count = await this.prisma.client.count({ where });
    const allowed = count < limits.max_clients;
    return {
      allowed,
      current: count,
      limit: limits.max_clients,
      planName,
    };
  }

  async canCreateInvoice(currentUser) {
    const { limits, planName } = await this.resolvePlan(currentUser);
    if (limits.max_invoices_per_month == null) return { allowed: true };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const companyName = (currentUser?.companyName || '').trim();
    const userWhere = companyName
      ? { companyName: { equals: companyName, mode: 'insensitive' } }
      : { companyName: null };
    const users = await this.prisma.user.findMany({ where: userWhere, select: { id: true } });
    const userIds = users.map((u) => u.id);
    if (userIds.length === 0) return { allowed: true };

    const count = await this.prisma.invoice.count({
      where: {
        userId: { in: userIds },
        issueDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const allowed = count < limits.max_invoices_per_month;
    return {
      allowed,
      current: count,
      limit: limits.max_invoices_per_month,
      planName,
    };
  }

  hasInventoryAccess(currentUser) {
    return this.resolvePlan(currentUser).then(({ limits }) => ({
      allowed: limits.inventory_enabled,
      planName: limits.name,
    }));
  }

  async hasAdvancedReportsAccess(currentUser) {
    const { limits } = await this.resolvePlan(currentUser);
    return {
      allowed: limits.advanced_reports,
      planName: limits.name,
    };
  }

  async enforceCreateUser(currentUser) {
    const result = await this.canCreateUser(currentUser);
    if (!result.allowed) {
      throw new ForbiddenException({
        message: 'Plan limit reached. Upgrade required.',
        upgrade_hint: true,
        current_limit: result.limit,
        current_usage: result.current,
        plan_name: result.planName,
      });
    }
    return result;
  }

  async enforceCreateClient(currentUser) {
    const result = await this.canCreateClient(currentUser);
    if (!result.allowed) {
      throw new ForbiddenException({
        message: 'Plan limit reached. Upgrade required.',
        upgrade_hint: true,
        current_limit: result.limit,
        current_usage: result.current,
        plan_name: result.planName,
      });
    }
    return result;
  }

  async enforceCreateInvoice(currentUser) {
    const result = await this.canCreateInvoice(currentUser);
    if (!result.allowed) {
      throw new ForbiddenException({
        message: 'Plan limit reached. Upgrade required.',
        upgrade_hint: true,
        current_limit: result.limit,
        current_usage: result.current,
        plan_name: result.planName,
      });
    }
    return result;
  }

  async enforceInventoryAccess(currentUser) {
    const result = await this.hasInventoryAccess(currentUser);
    if (!result.allowed) {
      throw new ForbiddenException({
        message: 'Plan limit reached. Upgrade required.',
        upgrade_hint: true,
        plan_name: result.planName,
      });
    }
    return result;
  }

  async enforceAdvancedReportsAccess(currentUser) {
    const result = await this.hasAdvancedReportsAccess(currentUser);
    if (!result.allowed) {
      throw new ForbiddenException({
        message: 'Plan limit reached. Upgrade required.',
        upgrade_hint: true,
        plan_name: result.planName,
      });
    }
    return result;
  }
}

module.exports = { PlanLimitService };
