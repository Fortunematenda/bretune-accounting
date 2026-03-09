const { Inject, Injectable, Logger } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const Stripe = require('stripe');

@Injectable()
class StripeService {
  constructor(@Inject(ConfigService) configService) {
    const secretKey = configService.get('STRIPE_SECRET') || configService.get('STRIPE_SECRET_KEY');
    this.logger = new Logger(StripeService.name);
    
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET not configured. Stripe features will be disabled.');
      this.stripe = null;
    } else {
      this.stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
    }
    
    this.webhookSecret = configService.get('STRIPE_WEBHOOK_SECRET');
    this.frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';
  }

  ensureStripe() {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    return this.stripe;
  }

  isConfigured() {
    return !!this.stripe;
  }

  async createCustomer(company, user) {
    const stripe = this.ensureStripe();
    const customer = await stripe.customers.create({
      email: user.email,
      name: company.name || user.companyName || user.email,
      metadata: {
        companyId: company.id,
        userId: user.id,
      },
    });
    return customer;
  }

  async getOrCreateCustomer(company, user, stripeCustomerId) {
    const stripe = this.ensureStripe();
    if (stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(stripeCustomerId);
        if (customer && !customer.deleted) {
          return customer;
        }
      } catch {
        // Customer not found, create new
      }
    }
    return this.createCustomer(company, user);
  }

  async createCheckoutSession(company, user, plan, stripeCustomerId, mode = 'subscription') {
    const stripe = this.ensureStripe();
    const customer = await this.getOrCreateCustomer(company, user, stripeCustomerId);

    const priceId = plan.stripePriceId;
    if (!priceId) {
      throw new Error('Plan does not have a Stripe price ID configured');
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${this.frontendUrl}/settings?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/settings?subscription=cancel`,
      metadata: {
        companyId: company.id,
        userId: user.id,
        planId: plan.id,
        mode: 'upgrade',
      },
    });

    return { sessionId: session.id, url: session.url, customerId: customer.id };
  }

  async createBillingPortalSession(stripeCustomerId) {
    const stripe = this.ensureStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${this.frontendUrl}/settings`,
    });
    return { url: session.url };
  }

  async constructEvent(payload, signature) {
    const stripe = this.ensureStripe();
    if (!this.webhookSecret) {
      throw new Error('Webhook secret not configured');
    }
    return stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }

  async retrieveSession(sessionId) {
    const stripe = this.ensureStripe();
    return stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });
  }

  async cancelSubscription(stripeSubscriptionId) {
    const stripe = this.ensureStripe();
    return stripe.subscriptions.cancel(stripeSubscriptionId);
  }
}

module.exports = { StripeService };
