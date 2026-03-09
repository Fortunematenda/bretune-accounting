const PLANS = {
  starter: {
    name: 'Starter',
    price: 250,
    max_users: 1,
    max_clients: 50,
    max_invoices_per_month: 50,
    inventory_enabled: false,
    advanced_reports: false,
  },
  standard: {
    name: 'Standard',
    price: 350,
    max_users: 5,
    max_clients: 500,
    max_invoices_per_month: 500,
    inventory_enabled: true,
    advanced_reports: false,
  },
  premium: {
    name: 'Premium',
    price: 450,
    max_users: null,
    max_clients: null,
    max_invoices_per_month: null,
    inventory_enabled: true,
    advanced_reports: true,
  },
};

const PLAN_NAME_TO_KEY = {
  STARTER: 'starter',
  GROWTH: 'standard',
  STANDARD: 'standard',
  PROFESSIONAL: 'premium',
  PREMIUM: 'premium',
};

function getPlanKey(planName) {
  if (!planName) return 'starter';
  const key = PLAN_NAME_TO_KEY[String(planName).toUpperCase()];
  return key || 'starter';
}

function getPlanLimits(planKey) {
  return PLANS[planKey] || PLANS.starter;
}

module.exports = { PLANS, PLAN_NAME_TO_KEY, getPlanKey, getPlanLimits };
