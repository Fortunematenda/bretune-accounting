-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "customer_documents" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "description" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "uploadedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "customer_documents_clientId_idx" ON "customer_documents"("clientId");
CREATE INDEX IF NOT EXISTS "customer_documents_createdAt_idx" ON "customer_documents"("createdAt");

-- Add description column if missing (table may already exist without it)
ALTER TABLE "customer_documents" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- AddForeignKey (idempotent via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'customer_documents_clientId_fkey'
  ) THEN
    ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AlterTable: add type column to products (idempotent)
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'PRODUCT';

-- CreateIndex (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'products_ownerCompanyName_type_idx'
  ) THEN
    CREATE INDEX "products_ownerCompanyName_type_idx" ON "products"("ownerCompanyName", "type");
  END IF;
END $$;
