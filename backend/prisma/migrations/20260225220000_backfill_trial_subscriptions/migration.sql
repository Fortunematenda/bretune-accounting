-- Backfill trial for companies that don't have a company_subscriptions record
-- Sets trialEndsAt = 30 days from now, subscriptionStatus = 'TRIAL', and creates CompanySubscription

INSERT INTO "company_subscriptions" ("id", "companyId", "planId", "status", "trialEndsAt", "subscriptionEndsAt", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  c.id,
  NULL,
  'TRIAL'::"SubscriptionStatus",
  (CURRENT_TIMESTAMP + INTERVAL '30 days')::timestamp(3),
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "companies" c
WHERE NOT EXISTS (
  SELECT 1 FROM "company_subscriptions" cs WHERE cs."companyId" = c.id
);

-- Update companies that have no trialEndsAt and are in TRIAL status
UPDATE "companies"
SET
  "trialEndsAt" = COALESCE("trialEndsAt", (CURRENT_TIMESTAMP + INTERVAL '30 days')::timestamp(3)),
  "subscriptionStatus" = 'TRIAL'::"SubscriptionStatus",
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "subscriptionStatus" = 'TRIAL'
  AND "trialEndsAt" IS NULL;
