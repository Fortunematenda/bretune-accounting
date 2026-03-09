-- AlterTable
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "ownerCompanyName" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "customers_ownerCompanyName_idx" ON "customers"("ownerCompanyName");

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN IF NOT EXISTS "ownerCompanyName" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "suppliers_ownerCompanyName_idx" ON "suppliers"("ownerCompanyName");

-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ownerCompanyName" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_ownerCompanyName_idx" ON "products"("ownerCompanyName");
