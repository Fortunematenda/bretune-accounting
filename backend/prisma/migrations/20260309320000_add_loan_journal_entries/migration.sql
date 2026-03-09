-- AlterEnum: add LOAN and LOAN_REPAYMENT to JournalSourceType
ALTER TYPE "JournalSourceType" ADD VALUE IF NOT EXISTS 'LOAN';
ALTER TYPE "JournalSourceType" ADD VALUE IF NOT EXISTS 'LOAN_REPAYMENT';

-- AlterTable loans: add journalEntryId
ALTER TABLE "loans" ADD COLUMN IF NOT EXISTS "journalEntryId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "loans_journalEntryId_key" ON "loans"("journalEntryId");
CREATE INDEX IF NOT EXISTS "loans_journalEntryId_idx" ON "loans"("journalEntryId");

-- AlterTable loan_repayments: add journalEntryId
ALTER TABLE "loan_repayments" ADD COLUMN IF NOT EXISTS "journalEntryId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "loan_repayments_journalEntryId_key" ON "loan_repayments"("journalEntryId");
CREATE INDEX IF NOT EXISTS "loan_repayments_journalEntryId_idx" ON "loan_repayments"("journalEntryId");

-- AddForeignKey loans -> journal_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'loans_journalEntryId_fkey'
  ) THEN
    ALTER TABLE "loans" ADD CONSTRAINT "loans_journalEntryId_fkey"
      FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey loan_repayments -> journal_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'loan_repayments_journalEntryId_fkey'
  ) THEN
    ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_journalEntryId_fkey"
      FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Tell Prisma this migration is applied
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
  gen_random_uuid()::text,
  'manually_applied',
  NOW(),
  '20260309320000_add_loan_journal_entries',
  NULL,
  NULL,
  NOW(),
  1
) ON CONFLICT DO NOTHING;
