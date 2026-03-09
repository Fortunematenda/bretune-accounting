-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "businessEmail" TEXT,
    "businessPhone" TEXT,
    "addressLine" TEXT,
    "city" TEXT,
    "country" TEXT,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "branchCode" TEXT,
    "swiftCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);
