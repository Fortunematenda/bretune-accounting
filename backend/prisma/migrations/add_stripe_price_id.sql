-- Add stripePriceId column to subscription_plans table
ALTER TABLE "subscription_plans" ADD COLUMN IF NOT EXISTS "stripePriceId" VARCHAR(255);
