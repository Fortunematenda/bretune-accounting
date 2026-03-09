-- AlterEnum: Add INVOICE and PAYMENT to JournalSourceType
DO $$ BEGIN
  ALTER TYPE "JournalSourceType" ADD VALUE 'INVOICE';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "JournalSourceType" ADD VALUE 'PAYMENT';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "journalEntryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_journalEntryId_key" ON "invoices"("journalEntryId") WHERE "journalEntryId" IS NOT NULL;

-- AlterTable: Add journalEntryId to payments
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "journalEntryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "payments_journalEntryId_key" ON "payments"("journalEntryId") WHERE "journalEntryId" IS NOT NULL;

-- AddForeignKey (invoice -> journal_entry)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_journalEntryId_fkey'
  ) THEN
    ALTER TABLE "invoices" ADD CONSTRAINT "invoices_journalEntryId_fkey" 
      FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey (payment -> journal_entry)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_journalEntryId_fkey'
  ) THEN
    ALTER TABLE "payments" ADD CONSTRAINT "payments_journalEntryId_fkey" 
      FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Add relation from journal_entries to invoice and payment (we need to add optional invoiceId and paymentId to journal_entries)
-- Actually journal_entries uses sourceType and sourceId - so we don't need new columns. The Invoice and Payment have journalEntryId pointing to JournalEntry.
-- The relation is: Invoice.journalEntryId -> JournalEntry, Payment.journalEntryId -> JournalEntry. So we just need the FK from invoices and payments. Good.
