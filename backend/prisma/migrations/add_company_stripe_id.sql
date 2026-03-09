-- Add stripeCustomerId column to companies table
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "stripeCustomerId" VARCHAR(255);
