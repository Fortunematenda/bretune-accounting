-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN IF NOT EXISTS "accountType" TEXT;

-- DropColumn (only if swiftCode exists - SQLite doesn't support IF EXISTS for columns, PostgreSQL does)
ALTER TABLE "company_settings" DROP COLUMN IF EXISTS "swiftCode";
