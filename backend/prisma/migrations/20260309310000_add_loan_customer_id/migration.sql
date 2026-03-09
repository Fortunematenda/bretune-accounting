-- AlterTable: add customerId to loans
ALTER TABLE "loans" ADD COLUMN IF NOT EXISTS "customerId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "loans_customerId_idx" ON "loans"("customerId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'loans_customerId_fkey'
  ) THEN
    ALTER TABLE "loans" ADD CONSTRAINT "loans_customerId_fkey"
      FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Tell Prisma this migration is applied
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
  gen_random_uuid()::text,
  'manually_applied',
  NOW(),
  '20260309310000_add_loan_customer_id',
  NULL,
  NULL,
  NOW(),
  1
) ON CONFLICT DO NOTHING;
