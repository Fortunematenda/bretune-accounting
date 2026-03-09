-- Remove failed migration record so it can be re-applied
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20260309000000_add_customer_documents_and_product_type';

-- Apply changes idempotently

-- 1. customer_documents table
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "customer_documents" ADD COLUMN IF NOT EXISTS "description" TEXT;

CREATE INDEX IF NOT EXISTS "customer_documents_clientId_idx" ON "customer_documents"("clientId");
CREATE INDEX IF NOT EXISTS "customer_documents_createdAt_idx" ON "customer_documents"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_documents_clientId_fkey'
  ) THEN
    ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 2. products type column
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'PRODUCT';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'products_ownerId_type_idx') THEN
    CREATE INDEX "products_ownerId_type_idx" ON "products"("ownerId", "type");
  END IF;
END $$;

-- 3. Re-insert migration as successfully applied
INSERT INTO "_prisma_migrations" (
  id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
)
SELECT
  gen_random_uuid()::text,
  'fixed',
  now(),
  '20260309000000_add_customer_documents_and_product_type',
  NULL,
  NULL,
  now(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE migration_name = '20260309000000_add_customer_documents_and_product_type'
);
