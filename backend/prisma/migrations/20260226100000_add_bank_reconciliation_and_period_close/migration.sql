-- CreateEnum
CREATE TYPE "BankReconciliationStatus" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AccountingPeriodStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "RecurringJournalFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateTable
CREATE TABLE "bank_reconciliations" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "openingBalance" DECIMAL(12,2) NOT NULL,
    "closingBalance" DECIMAL(12,2) NOT NULL,
    "status" "BankReconciliationStatus" NOT NULL DEFAULT 'DRAFT',
    "closedAt" TIMESTAMP(3),
    "closedByUserId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_statement_lines" (
    "id" TEXT NOT NULL,
    "reconciliationId" TEXT NOT NULL,
    "lineDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_statement_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_reconciliation_matches" (
    "id" TEXT NOT NULL,
    "reconciliationId" TEXT NOT NULL,
    "statementLineId" TEXT NOT NULL,
    "journalLineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_reconciliation_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_periods" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "AccountingPeriodStatus" NOT NULL DEFAULT 'OPEN',
    "closedAt" TIMESTAMP(3),
    "closedByUserId" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_journal_entries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memo" TEXT,
    "frequency" "RecurringJournalFrequency" NOT NULL,
    "nextRunDate" TIMESTAMP(3) NOT NULL,
    "linesJson" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bank_reconciliations_accountCode_idx" ON "bank_reconciliations"("accountCode");

-- CreateIndex
CREATE INDEX "bank_reconciliations_statementDate_idx" ON "bank_reconciliations"("statementDate");

-- CreateIndex
CREATE INDEX "bank_reconciliations_status_idx" ON "bank_reconciliations"("status");

-- CreateIndex
CREATE INDEX "bank_statement_lines_reconciliationId_idx" ON "bank_statement_lines"("reconciliationId");

-- CreateIndex
CREATE INDEX "bank_reconciliation_matches_reconciliationId_idx" ON "bank_reconciliation_matches"("reconciliationId");

-- CreateIndex
CREATE INDEX "bank_reconciliation_matches_journalLineId_idx" ON "bank_reconciliation_matches"("journalLineId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_reconciliation_matches_reconciliationId_statementLineId_jour_key" ON "bank_reconciliation_matches"("reconciliationId", "statementLineId", "journalLineId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_periods_startDate_endDate_key" ON "accounting_periods"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "accounting_periods_status_idx" ON "accounting_periods"("status");

-- CreateIndex
CREATE INDEX "recurring_journal_entries_isActive_nextRunDate_idx" ON "recurring_journal_entries"("isActive", "nextRunDate");

-- AddForeignKey
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES "bank_reconciliations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliation_matches" ADD CONSTRAINT "bank_reconciliation_matches_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES "bank_reconciliations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliation_matches" ADD CONSTRAINT "bank_reconciliation_matches_statementLineId_fkey" FOREIGN KEY ("statementLineId") REFERENCES "bank_statement_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliation_matches" ADD CONSTRAINT "bank_reconciliation_matches_journalLineId_fkey" FOREIGN KEY ("journalLineId") REFERENCES "journal_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
