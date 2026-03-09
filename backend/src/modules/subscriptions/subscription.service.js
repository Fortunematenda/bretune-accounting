const { BadRequestException, Inject, Injectable } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

const TRIAL_DAYS = 30;

@Injectable()
class SubscriptionService {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async startTrial(company) {
    const existing = await this.prisma.companySubscription.findUnique({
      where: { companyId: company.id },
    });
    if (existing) {
      throw new BadRequestException('Trial can only occur once per company');
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    await this.prisma.$transaction([
      this.prisma.company.update({
        where: { id: company.id },
        data: {
          trialEndsAt,
          subscriptionStatus: 'TRIAL',
        },
      }),
      this.prisma.companySubscription.create({
        data: {
          companyId: company.id,
          status: 'TRIAL',
          trialEndsAt,
        },
      }),
    ]);

    return this.prisma.company.findUnique({
      where: { id: company.id },
      include: { subscriptions: true },
    });
  }

  async activateSubscription(company, plan) {
    const planRecord = await this.prisma.subscriptionPlan.findFirst({
      where: { id: plan.id || plan, isActive: true },
    });
    if (!planRecord) {
      throw new BadRequestException('Invalid or inactive plan');
    }

    const subEndsAt = new Date();
    subEndsAt.setMonth(subEndsAt.getMonth() + 1);

    const existing = await this.prisma.companySubscription.findUnique({
      where: { companyId: company.id },
    });

    const isUpgradeFromTrial = existing?.status === 'TRIAL';
    const isPlanChange = existing?.status === 'ACTIVE' && existing?.planId;
    const isNewSubscription = !existing || existing?.status === 'EXPIRED';

    if (!isUpgradeFromTrial && !isPlanChange && !isNewSubscription) {
      throw new BadRequestException('Company already has an active subscription');
    }

    await this.prisma.$transaction([
      this.prisma.company.update({
        where: { id: company.id },
        data: {
          trialEndsAt: isUpgradeFromTrial ? null : undefined,
          subscriptionStatus: 'ACTIVE',
        },
      }),
      existing
        ? this.prisma.companySubscription.update({
            where: { companyId: company.id },
            data: {
              planId: planRecord.id,
              status: 'ACTIVE',
              trialEndsAt: isUpgradeFromTrial ? null : undefined,
              subscriptionEndsAt: subEndsAt,
            },
          })
        : this.prisma.companySubscription.create({
            data: {
              companyId: company.id,
              planId: planRecord.id,
              status: 'ACTIVE',
              subscriptionEndsAt: subEndsAt,
            },
          }),
    ]);

    return this.prisma.company.findUnique({
      where: { id: company.id },
      include: { subscriptions: { include: { plan: true } } },
    });
  }

  async expireSubscription(company) {
    await this.prisma.$transaction([
      this.prisma.company.update({
        where: { id: company.id },
        data: { subscriptionStatus: 'EXPIRED' },
      }),
      this.prisma.companySubscription.updateMany({
        where: { companyId: company.id, status: 'TRIAL' },
        data: { status: 'EXPIRED' },
      }),
    ]);

    return this.prisma.company.findUnique({
      where: { id: company.id },
      include: { subscriptions: true },
    });
  }

  async checkExpirations() {
    const now = new Date();
    const expiredTrials = await this.prisma.companySubscription.findMany({
      where: {
        status: 'TRIAL',
        trialEndsAt: { lt: now },
      },
      include: { company: true },
    });

    let count = 0;
    for (const sub of expiredTrials) {
      await this.expireSubscription(sub.company);
      count++;
    }
    return count;
  }

  async getCompanySubscriptionStatus(companyId) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { subscriptions: { include: { plan: true } } },
    });
    if (!company) return null;
    return {
      status: company.subscriptionStatus,
      trialEndsAt: company.trialEndsAt,
      subscription: company.subscriptions?.[0],
    };
  }
}

module.exports = { SubscriptionService };
