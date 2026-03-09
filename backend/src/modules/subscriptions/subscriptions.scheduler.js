const { Cron } = require('@nestjs/schedule');
const { Inject, Injectable, Logger } = require('@nestjs/common');
const { SubscriptionService } = require('./subscription.service');

@Injectable()
class SubscriptionsScheduler {
  constructor(@Inject(SubscriptionService) subscriptionService) {
    this.subscriptionService = subscriptionService;
    this.logger = new Logger(SubscriptionsScheduler.name);
  }

  @Cron('0 0 * * *')
  async checkExpirations() {
    try {
      const count = await this.subscriptionService.checkExpirations();
      if (count > 0) {
        this.logger.log(`Subscriptions: expired ${count} trial(s)`);
      }
    } catch (e) {
      this.logger.error(`Subscription expiration check failed: ${e.message}`);
    }
  }
}

module.exports = { SubscriptionsScheduler };
