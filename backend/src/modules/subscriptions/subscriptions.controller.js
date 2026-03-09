const { BadRequestException, Body, Controller, Get, Headers, Inject, Post, RawBody, Request, UseGuards } = require('@nestjs/common');
const { ApiBearerAuth, ApiTags } = require('@nestjs/swagger');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { SubscriptionService } = require('./subscription.service');
const { PrismaService } = require('../../config/prisma.service');
const { StripeService } = require('./stripe.service');

@ApiTags('Subscriptions')
@Controller('subscriptions')
class SubscriptionsController {
  constructor(
    @Inject(SubscriptionService) subscriptionService,
    @Inject(PrismaService) prisma,
    @Inject(StripeService) stripeService,
  ) {
    this.subscriptionService = subscriptionService;
    this.prisma = prisma;
    this.stripeService = stripeService;
  }

  @Get('plans')
  async listPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    return { data: plans };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('status')
  async getStatus(@Request() req) {
    const user = req.user;
    if (!user?.companyId) {
      return { status: null, trialEndsAt: null, subscription: null };
    }
    return this.subscriptionService.getCompanySubscriptionStatus(user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('checkout')
  async createCheckout(@Request() req, @Body() body) {
    const user = req.user;
    if (!user?.companyId) {
      throw new BadRequestException('No company associated with user');
    }

    const { planId } = body;
    if (!planId) {
      throw new BadRequestException('planId is required');
    }

    const [company, plan] = await Promise.all([
      this.prisma.company.findUnique({ where: { id: user.companyId } }),
      this.prisma.subscriptionPlan.findFirst({ where: { id: planId, isActive: true } }),
    ]);

    if (!company) {
      throw new BadRequestException('Company not found');
    }
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    const checkout = await this.stripeService.createCheckoutSession(
      company,
      user,
      plan,
      company.stripeCustomerId,
    );

    // Store customer ID if new
    if (checkout.customerId && !company.stripeCustomerId) {
      await this.prisma.company.update({
        where: { id: company.id },
        data: { stripeCustomerId: checkout.customerId },
      });
    }

    return { checkoutUrl: checkout.url, sessionId: checkout.sessionId };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('verify-session')
  async verifySession(@Request() req, @Body() body) {
    const user = req.user;
    if (!user?.companyId) {
      throw new BadRequestException('No company associated with user');
    }

    const { sessionId } = body;
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }

    // Retrieve session from Stripe
    const session = await this.stripeService.retrieveSession(sessionId);
    
    if (session.status !== 'complete') {
      throw new BadRequestException('Payment not completed');
    }

    const { companyId, planId, mode } = session.metadata || {};
    
    if (companyId !== user.companyId) {
      throw new BadRequestException('Session does not belong to this company');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { id: planId },
    });

    if (!company || !plan) {
      throw new BadRequestException('Company or plan not found');
    }

    // Activate subscription
    await this.subscriptionService.activateSubscription(company, plan);
    
    // Store Stripe subscription ID if available
    if (session.subscription) {
      await this.prisma.companySubscription.updateMany({
        where: { companyId },
        data: { stripeSubscriptionId: session.subscription },
      });
    }

    return { success: true, status: 'ACTIVE', plan: plan.name };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('portal')
  async createBillingPortal(@Request() req) {
    const user = req.user;
    if (!user?.companyId) {
      throw new BadRequestException('No company associated with user');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });

    if (!company?.stripeCustomerId) {
      throw new BadRequestException('No billing account found');
    }

    const portal = await this.stripeService.createBillingPortalSession(company.stripeCustomerId);
    return { url: portal.url };
  }

  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature, @RawBody() rawBody) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      event = await this.stripeService.constructEvent(rawBody, signature);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { companyId, planId, mode } = session.metadata || {};

      if (companyId && planId && mode === 'upgrade') {
        const company = await this.prisma.company.findUnique({
          where: { id: companyId },
        });
        const plan = await this.prisma.subscriptionPlan.findFirst({
          where: { id: planId },
        });

        if (company && plan) {
          await this.subscriptionService.activateSubscription(company, plan);
          // Store Stripe subscription ID if available
          if (session.subscription) {
            await this.prisma.companySubscription.updateMany({
              where: { companyId },
              data: { stripeSubscriptionId: session.subscription },
            });
          }
        }
      }
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const companySub = await this.prisma.companySubscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (companySub) {
        const newStatus = subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'canceled' ? 'EXPIRED' : companySub.status;
        await this.prisma.companySubscription.update({
          where: { id: companySub.id },
          data: { status: newStatus },
        });
        await this.prisma.company.update({
          where: { id: companySub.companyId },
          data: { subscriptionStatus: newStatus },
        });
      }
    }

    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upgrade')
  async upgrade(@Request() req, @Body() body) {
    const user = req.user;
    if (!user?.companyId) {
      throw new BadRequestException('No company associated with user');
    }
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }
    const planId = body.planId;
    if (!planId) {
      throw new BadRequestException('planId is required');
    }
    return this.subscriptionService.activateSubscription(company, { id: planId });
  }
}

module.exports = { SubscriptionsController };
