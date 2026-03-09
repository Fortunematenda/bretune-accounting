/*
  Warnings:

  - A unique constraint covering the columns `[clientSeq]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "clientSeq" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clients_clientSeq_key" ON "clients"("clientSeq");
