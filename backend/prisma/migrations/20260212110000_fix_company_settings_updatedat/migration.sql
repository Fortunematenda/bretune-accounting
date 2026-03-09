-- Fix updatedAt to have DEFAULT so Prisma create works when row doesn't exist
ALTER TABLE "company_settings" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
