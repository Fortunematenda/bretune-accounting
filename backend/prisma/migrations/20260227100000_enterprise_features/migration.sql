-- AlterEnum
ALTER TYPE "JournalEntryStatus" ADD VALUE 'DRAFT';
ALTER TYPE "JournalEntryStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterTable Company
ALTER TABLE "companies" ADD COLUMN "baseCurrencyCode" TEXT NOT NULL DEFAULT 'ZAR';

-- CreateTable AccountingEntity
CREATE TABLE "accounting_entities" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseCurrencyCode" TEXT NOT NULL DEFAULT 'ZAR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_entities_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "accounting_entities_companyId_code_key" ON "accounting_entities"("companyId", "code");
ALTER TABLE "accounting_entities" ADD CONSTRAINT "accounting_entities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable Currency
CREATE TABLE "currencies" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "decimals" INTEGER NOT NULL DEFAULT 2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable ExchangeRate
CREATE TABLE "exchange_rates" (
    "id" TEXT NOT NULL,
    "fromCurrencyCode" TEXT NOT NULL,
    "toCurrencyCode" TEXT NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "asOfDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "exchange_rates_fromCurrencyCode_toCurrencyCode_asOfDate_key" ON "exchange_rates"("fromCurrencyCode", "toCurrencyCode", "asOfDate");
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_fromCurrencyCode_fkey" FOREIGN KEY ("fromCurrencyCode") REFERENCES "currencies"("code") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_toCurrencyCode_fkey" FOREIGN KEY ("toCurrencyCode") REFERENCES "currencies"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable AuditLog
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");
CREATE INDEX "audit_logs_changedAt_idx" ON "audit_logs"("changedAt");

-- AlterTable JournalEntry
ALTER TABLE "journal_entries" ADD COLUMN "approvedByUserId" TEXT;
ALTER TABLE "journal_entries" ADD COLUMN "approvedAt" TIMESTAMP(3);
CREATE INDEX "journal_entries_status_idx" ON "journal_entries"("status");
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable JournalLine
ALTER TABLE "journal_lines" ADD COLUMN "foreignAmount" DECIMAL(12,2);
ALTER TABLE "journal_lines" ADD COLUMN "foreignCurrencyCode" TEXT;

-- AlterTable Product
ALTER TABLE "products" ADD COLUMN "trackInventory" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN "quantityOnHand" DECIMAL(12,4) NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN "reorderLevel" DECIMAL(12,4);

-- CreateEnum InventoryMovementType
CREATE TYPE "InventoryMovementType" AS ENUM ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'TRANSFER');

-- CreateTable InventoryMovement
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" DECIMAL(12,4) NOT NULL,
    "unitCost" DECIMAL(10,2),
    "reference" TEXT,
    "referenceType" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "inventory_movements_productId_idx" ON "inventory_movements"("productId");
CREATE INDEX "inventory_movements_createdAt_idx" ON "inventory_movements"("createdAt");
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum DepreciationMethod
CREATE TYPE "DepreciationMethod" AS ENUM ('STRAIGHT_LINE', 'DECLINING_BALANCE');

-- CreateTable FixedAsset
CREATE TABLE "fixed_assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetCode" TEXT,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "residualValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "usefulLifeYears" INTEGER NOT NULL,
    "depreciationMethod" "DepreciationMethod" NOT NULL DEFAULT 'STRAIGHT_LINE',
    "accumulatedDepreciation" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "disposedAt" TIMESTAMP(3),
    "disposedAmount" DECIMAL(12,2),
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_assets_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "fixed_assets_journalEntryId_key" ON "fixed_assets"("journalEntryId");
CREATE INDEX "fixed_assets_status_idx" ON "fixed_assets"("status");

-- CreateTable DepreciationRun
CREATE TABLE "depreciation_runs" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "runDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "depreciation_runs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "depreciation_runs_assetId_idx" ON "depreciation_runs"("assetId");
CREATE INDEX "depreciation_runs_runDate_idx" ON "depreciation_runs"("runDate");
ALTER TABLE "depreciation_runs" ADD CONSTRAINT "depreciation_runs_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum PayRunStatus
CREATE TYPE "PayRunStatus" AS ENUM ('DRAFT', 'PROCESSED', 'PAID', 'CANCELLED');

-- CreateTable PayRun
CREATE TABLE "pay_runs" (
    "id" TEXT NOT NULL,
    "payPeriodStart" TIMESTAMP(3) NOT NULL,
    "payPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "PayRunStatus" NOT NULL DEFAULT 'DRAFT',
    "totalGross" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalNet" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "journalEntryId" TEXT,
    "processedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pay_runs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_runs_status_idx" ON "pay_runs"("status");
CREATE INDEX "pay_runs_payPeriodStart_idx" ON "pay_runs"("payPeriodStart");

-- CreateTable PayRunLine
CREATE TABLE "pay_run_lines" (
    "id" TEXT NOT NULL,
    "payRunId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "grossPay" DECIMAL(12,2) NOT NULL,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "netPay" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "pay_run_lines_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_run_lines_payRunId_idx" ON "pay_run_lines"("payRunId");
CREATE INDEX "pay_run_lines_employeeId_idx" ON "pay_run_lines"("employeeId");
ALTER TABLE "pay_run_lines" ADD CONSTRAINT "pay_run_lines_payRunId_fkey" FOREIGN KEY ("payRunId") REFERENCES "pay_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pay_run_lines" ADD CONSTRAINT "pay_run_lines_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default currencies
INSERT INTO "currencies" ("code", "name", "symbol", "decimals", "updatedAt") VALUES
('ZAR', 'South African Rand', 'R', 2, CURRENT_TIMESTAMP),
('USD', 'US Dollar', '$', 2, CURRENT_TIMESTAMP),
('EUR', 'Euro', '€', 2, CURRENT_TIMESTAMP),
('GBP', 'British Pound', '£', 2, CURRENT_TIMESTAMP);
