/*
  Warnings:

  - You are about to drop the column `taxId` on the `clients` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClientTaxType" AS ENUM ('NONE', 'VAT_REGISTERED', 'VAT_EXEMPT');

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "taxId",
ADD COLUMN     "taxNumber" TEXT,
ADD COLUMN     "taxType" "ClientTaxType" NOT NULL DEFAULT 'NONE';
