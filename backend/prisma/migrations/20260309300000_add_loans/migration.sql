-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'PARTIALLY_REPAID', 'REPAID', 'WRITTEN_OFF');

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "borrowerName" TEXT NOT NULL,
    "borrowerContact" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "outstandingBalance" DECIMAL(10,2) NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "interestRate" DECIMAL(5,2),
    "purpose" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "ownerCompanyName" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_repayments" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_repayments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loans_ownerCompanyName_idx" ON "loans"("ownerCompanyName");

-- CreateIndex
CREATE INDEX "loans_createdById_idx" ON "loans"("createdById");

-- CreateIndex
CREATE INDEX "loan_repayments_loanId_idx" ON "loan_repayments"("loanId");

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
