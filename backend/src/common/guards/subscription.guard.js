const { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } = require('@nestjs/common');
const { PrismaService } = require('../../config/prisma.service');

@Injectable()
class CheckSubscriptionGuard {
  constructor(@Inject(PrismaService) prismaService) {
    this.prisma = prismaService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    const userId = user.id || user.sub;
    if (!userId) return true;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!dbUser?.companyId || !dbUser.company) {
      return true;
    }

    const status = dbUser.company.subscriptionStatus;
    if (status === 'TRIAL' || status === 'ACTIVE') {
      return true;
    }

    if (status === 'EXPIRED' || status === 'CANCELLED') {
      throw new ForbiddenException({
        message: status === 'EXPIRED' ? 'Your trial has expired' : 'Your subscription has been cancelled',
        requires_subscription: true,
      });
    }

    return true;
  }
}

module.exports = { CheckSubscriptionGuard };
