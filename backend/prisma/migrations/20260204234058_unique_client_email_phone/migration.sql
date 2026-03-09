/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceSeq]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quoteSeq]` on the table `quotes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "invoiceSeq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "quoteSeq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "userNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_key" ON "clients"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceSeq_key" ON "invoices"("invoiceSeq");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quoteSeq_key" ON "quotes"("quoteSeq");

-- CreateIndex
CREATE UNIQUE INDEX "users_userNumber_key" ON "users"("userNumber");
