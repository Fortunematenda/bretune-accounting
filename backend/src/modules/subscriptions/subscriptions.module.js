const { Module } = require('@nestjs/common');
const { PrismaModule } = require('../../config/prisma.module');
const { SubscriptionService } = require('./subscription.service');
const { PlanLimitService } = require('./plan-limit.service');
const { SubscriptionsScheduler } = require('./subscriptions.scheduler');
const { SubscriptionsController } = require('./subscriptions.controller');
const { StripeService } = require('./stripe.service');

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionService, PlanLimitService, SubscriptionsScheduler, StripeService],
  exports: [SubscriptionService, PlanLimitService, StripeService],
})
class SubscriptionsModule {}

module.exports = { SubscriptionsModule };
