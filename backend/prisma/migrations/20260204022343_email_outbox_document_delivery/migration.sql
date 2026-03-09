-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('INVOICE', 'STATEMENT');

-- AlterTable
ALTER TABLE "email_outbox" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "documentType" "DocumentType" NOT NULL DEFAULT 'INVOICE',
ADD COLUMN     "statementFrom" TIMESTAMP(3),
ADD COLUMN     "statementTo" TIMESTAMP(3),
ALTER COLUMN "invoiceId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "email_outbox_clientId_idx" ON "email_outbox"("clientId");

-- AddForeignKey
ALTER TABLE "email_outbox" ADD CONSTRAINT "email_outbox_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
