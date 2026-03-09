-- AlterTable
ALTER TABLE "business_bank_accounts" ADD COLUMN "openingBalance" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "bank_transactions" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "debit" DECIMAL(15,2),
    "credit" DECIMAL(15,2),
    "amount" DECIMAL(15,2) NOT NULL,
    "balance" DECIMAL(15,2),
    "hash" TEXT NOT NULL,
    "isReconciled" BOOLEAN NOT NULL DEFAULT false,
    "matchedType" TEXT,
    "matchedId" TEXT,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_transactions_bankAccountId_hash_key" ON "bank_transactions"("bankAccountId", "hash");

-- CreateIndex
CREATE INDEX "bank_transactions_bankAccountId_idx" ON "bank_transactions"("bankAccountId");

-- CreateIndex
CREATE INDEX "bank_transactions_transactionDate_idx" ON "bank_transactions"("transactionDate");

-- CreateIndex
CREATE INDEX "bank_transactions_isReconciled_idx" ON "bank_transactions"("isReconciled");

-- CreateIndex
CREATE INDEX "bank_transactions_ownerCompanyName_idx" ON "bank_transactions"("ownerCompanyName");

-- AddForeignKey
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "business_bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
