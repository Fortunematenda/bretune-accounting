-- CreateTable
CREATE TABLE "business_bank_accounts" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT,
    "accountHolder" TEXT,
    "branchCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "ledgerAccountCode" TEXT NOT NULL DEFAULT '1000',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerCompanyName" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "bank_reconciliations" ADD COLUMN "bankAccountId" TEXT;

-- CreateIndex
CREATE INDEX "business_bank_accounts_ownerCompanyName_idx" ON "business_bank_accounts"("ownerCompanyName");

-- CreateIndex
CREATE INDEX "business_bank_accounts_ledgerAccountCode_idx" ON "business_bank_accounts"("ledgerAccountCode");

-- CreateIndex
CREATE INDEX "bank_reconciliations_bankAccountId_idx" ON "bank_reconciliations"("bankAccountId");

-- AddForeignKey
ALTER TABLE "business_bank_accounts" ADD CONSTRAINT "business_bank_accounts_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "business_bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
