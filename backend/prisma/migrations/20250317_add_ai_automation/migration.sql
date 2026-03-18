-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "AutomationRuleAction" AS ENUM ('CATEGORIZE', 'MATCH_INVOICE', 'MATCH_BILL', 'TAG', 'NOTIFY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AISuggestionType" AS ENUM ('CATEGORIZE_TRANSACTION', 'MATCH_INVOICE', 'MATCH_BILL', 'DUPLICATE_INVOICE', 'DUPLICATE_BILL', 'DUPLICATE_EXPENSE', 'EXPENSE_SUGGESTION');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AISuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DISMISSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "automation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "action" "AutomationRuleAction" NOT NULL,
    "conditionsJson" JSONB NOT NULL,
    "actionParamsJson" JSONB,
    "timesApplied" INTEGER NOT NULL DEFAULT 0,
    "lastAppliedAt" TIMESTAMP(3),
    "createdByUserId" TEXT NOT NULL,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ai_suggestions" (
    "id" TEXT NOT NULL,
    "type" "AISuggestionType" NOT NULL,
    "status" "AISuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "confidence" DECIMAL(5,4) NOT NULL,
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityType" TEXT,
    "targetEntityId" TEXT,
    "reasoning" TEXT,
    "metaJson" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "automation_rules_isActive_priority_idx" ON "automation_rules"("isActive", "priority");
CREATE INDEX IF NOT EXISTS "automation_rules_action_idx" ON "automation_rules"("action");
CREATE INDEX IF NOT EXISTS "automation_rules_ownerCompanyName_idx" ON "automation_rules"("ownerCompanyName");

CREATE INDEX IF NOT EXISTS "ai_suggestions_type_status_idx" ON "ai_suggestions"("type", "status");
CREATE INDEX IF NOT EXISTS "ai_suggestions_sourceEntityType_sourceEntityId_idx" ON "ai_suggestions"("sourceEntityType", "sourceEntityId");
CREATE INDEX IF NOT EXISTS "ai_suggestions_ownerCompanyName_idx" ON "ai_suggestions"("ownerCompanyName");
CREATE INDEX IF NOT EXISTS "ai_suggestions_createdAt_idx" ON "ai_suggestions"("createdAt");
