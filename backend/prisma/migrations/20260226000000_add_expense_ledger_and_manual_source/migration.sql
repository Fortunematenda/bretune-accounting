-- AlterEnum
ALTER TYPE "JournalSourceType" ADD VALUE 'EXPENSE';
ALTER TYPE "JournalSourceType" ADD VALUE 'MANUAL';

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN "journalEntryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "expenses_journalEntryId_key" ON "expenses"("journalEntryId");

-- CreateIndex
CREATE INDEX "expenses_journalEntryId_idx" ON "expenses"("journalEntryId");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
