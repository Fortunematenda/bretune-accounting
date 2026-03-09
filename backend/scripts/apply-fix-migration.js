/**
 * One-off script: clears the failed migration record and applies schema changes
 * idempotently, then re-marks the migration as applied.
 * Run with: node scripts/apply-fix-migration.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MIGRATION_NAME = '20260309000000_add_customer_documents_and_product_type';

async function run(sql) {
  await prisma.$executeRawUnsafe(sql);
}

async function main() {
  console.log('Applying fix migration...');

  // Remove failed migration record
  await prisma.$executeRawUnsafe(
    `DELETE FROM "_prisma_migrations" WHERE migration_name = '${MIGRATION_NAME}'`
  );
  console.log('Cleared failed migration record.');

  // 1. customer_documents table
  await run(`
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
    )
  `);
  console.log('customer_documents table ensured.');

  await run(`ALTER TABLE "customer_documents" ADD COLUMN IF NOT EXISTS "description" TEXT`);
  await run(`CREATE INDEX IF NOT EXISTS "customer_documents_clientId_idx" ON "customer_documents"("clientId")`);
  await run(`CREATE INDEX IF NOT EXISTS "customer_documents_createdAt_idx" ON "customer_documents"("createdAt")`);

  await run(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_documents_clientId_fkey') THEN
        ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_clientId_fkey"
          FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  console.log('customer_documents FK ensured.');

  // 2. products type column
  await run(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'PRODUCT'`);
  await run(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'products_ownerCompanyName_type_idx') THEN
        CREATE INDEX "products_ownerCompanyName_type_idx" ON "products"("ownerCompanyName", "type");
      END IF;
    END $$
  `);
  console.log('products.type column ensured.');

  // 3. Mark migration as applied
  await run(`
    INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
    SELECT gen_random_uuid()::text, 'manually-applied', now(), '${MIGRATION_NAME}', NULL, NULL, now(), 1
    WHERE NOT EXISTS (
      SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '${MIGRATION_NAME}' AND finished_at IS NOT NULL
    )
  `);
  console.log('Migration marked as applied.');

  await prisma.$disconnect();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
