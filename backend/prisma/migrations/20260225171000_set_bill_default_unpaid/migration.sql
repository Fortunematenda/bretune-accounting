-- Set Bill status default to UNPAID (must be in separate migration - PostgreSQL
-- requires new enum values to be committed before they can be used)
ALTER TABLE "bills" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
