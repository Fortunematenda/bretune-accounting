-- Ensure table name is "customers" (legacy migrations created "clients")
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clients'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'customers'
  ) THEN
    ALTER TABLE "clients" RENAME TO "customers";
  END IF;
END $$;

-- Drop unique constraints/indexes on customers email/phone
ALTER TABLE "customers" DROP CONSTRAINT IF EXISTS "customers_email_key";
ALTER TABLE "customers" DROP CONSTRAINT IF EXISTS "customers_phone_key";

DROP INDEX IF EXISTS "customers_email_key";
DROP INDEX IF EXISTS "customers_phone_key";
DROP INDEX IF EXISTS "clients_email_key";
DROP INDEX IF EXISTS "clients_phone_key";

-- Ensure customer email/phone are nullable
ALTER TABLE "customers" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "customers" ALTER COLUMN "phone" DROP NOT NULL;

-- Add missing enum values for payments
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'VOIDED';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'CREDIT_NOTE';

-- Payments table changes for allocations/voiding
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "unallocatedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "voidedAt" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "voidReason" TEXT;

-- invoiceId becomes optional and uses ON DELETE SET NULL
ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_invoiceId_fkey";
ALTER TABLE "payments" ALTER COLUMN "invoiceId" DROP NOT NULL;
ALTER TABLE "payments"
  ADD CONSTRAINT "payments_invoiceId_fkey"
  FOREIGN KEY ("invoiceId")
  REFERENCES "invoices"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Payment allocations table
CREATE TABLE IF NOT EXISTS "payment_allocations" (
  "id" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payment_allocations" DROP CONSTRAINT IF EXISTS "payment_allocations_paymentId_fkey";
ALTER TABLE "payment_allocations"
  ADD CONSTRAINT "payment_allocations_paymentId_fkey"
  FOREIGN KEY ("paymentId")
  REFERENCES "payments"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "payment_allocations" DROP CONSTRAINT IF EXISTS "payment_allocations_invoiceId_fkey";
ALTER TABLE "payment_allocations"
  ADD CONSTRAINT "payment_allocations_invoiceId_fkey"
  FOREIGN KEY ("invoiceId")
  REFERENCES "invoices"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "payment_allocations_paymentId_idx" ON "payment_allocations"("paymentId");
CREATE INDEX IF NOT EXISTS "payment_allocations_invoiceId_idx" ON "payment_allocations"("invoiceId");

-- Non-unique indexes for customers email/phone (optional but keeps lookups fast)
CREATE INDEX IF NOT EXISTS "customers_email_idx" ON "customers"("email");
CREATE INDEX IF NOT EXISTS "customers_phone_idx" ON "customers"("phone");
