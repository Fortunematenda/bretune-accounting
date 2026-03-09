/*
  Warnings:

  - Added the required column `ttlMs` to the `job_locks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_locks" ADD COLUMN     "ttlMs" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "document_counters" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_counters_pkey" PRIMARY KEY ("key")
);
