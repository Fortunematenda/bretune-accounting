-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "NetworkDeviceType" AS ENUM ('ROUTER', 'SWITCH', 'ACCESS_POINT', 'OLT', 'ONT', 'RADIO', 'SERVER', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NetworkDeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DEGRADED', 'MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ClientServiceStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING', 'TERMINATED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NetworkAlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "network_devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NetworkDeviceType" NOT NULL,
    "status" "NetworkDeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "location" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "firmwareVersion" TEXT,
    "parentDeviceId" TEXT,
    "snmpCommunity" TEXT,
    "managementUrl" TEXT,
    "uptimeSeconds" INTEGER,
    "cpuPercent" DECIMAL(5,2),
    "memoryPercent" DECIMAL(5,2),
    "lastSeenAt" TIMESTAMP(3),
    "notes" TEXT,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "network_interfaces" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ifIndex" INTEGER,
    "speed" TEXT,
    "macAddress" TEXT,
    "ipAddress" TEXT,
    "isUp" BOOLEAN NOT NULL DEFAULT false,
    "rxBytes" BIGINT NOT NULL DEFAULT 0,
    "txBytes" BIGINT NOT NULL DEFAULT 0,
    "rxErrors" INTEGER NOT NULL DEFAULT 0,
    "txErrors" INTEGER NOT NULL DEFAULT 0,
    "lastPolledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_interfaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "service_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "downloadSpeed" TEXT NOT NULL,
    "uploadSpeed" TEXT NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "dataCapGb" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "client_network_links" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "deviceId" TEXT,
    "servicePlanId" TEXT,
    "serviceStatus" "ClientServiceStatus" NOT NULL DEFAULT 'PENDING',
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "pppoeUsername" TEXT,
    "installationDate" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "suspendReason" TEXT,
    "terminatedAt" TIMESTAMP(3),
    "billingDay" INTEGER NOT NULL DEFAULT 1,
    "autoBilling" BOOLEAN NOT NULL DEFAULT true,
    "lastBilledAt" TIMESTAMP(3),
    "nextBillDate" TIMESTAMP(3),
    "notes" TEXT,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_network_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "network_alerts" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "severity" "NetworkAlertSeverity" NOT NULL,
    "message" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "ownerCompanyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "network_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "network_devices_type_idx" ON "network_devices"("type");
CREATE INDEX IF NOT EXISTS "network_devices_status_idx" ON "network_devices"("status");
CREATE INDEX IF NOT EXISTS "network_devices_ipAddress_idx" ON "network_devices"("ipAddress");
CREATE INDEX IF NOT EXISTS "network_devices_parentDeviceId_idx" ON "network_devices"("parentDeviceId");
CREATE INDEX IF NOT EXISTS "network_devices_ownerCompanyName_idx" ON "network_devices"("ownerCompanyName");

CREATE INDEX IF NOT EXISTS "network_interfaces_deviceId_idx" ON "network_interfaces"("deviceId");

CREATE INDEX IF NOT EXISTS "service_plans_isActive_idx" ON "service_plans"("isActive");
CREATE INDEX IF NOT EXISTS "service_plans_ownerCompanyName_idx" ON "service_plans"("ownerCompanyName");

CREATE INDEX IF NOT EXISTS "client_network_links_clientId_idx" ON "client_network_links"("clientId");
CREATE INDEX IF NOT EXISTS "client_network_links_deviceId_idx" ON "client_network_links"("deviceId");
CREATE INDEX IF NOT EXISTS "client_network_links_servicePlanId_idx" ON "client_network_links"("servicePlanId");
CREATE INDEX IF NOT EXISTS "client_network_links_serviceStatus_idx" ON "client_network_links"("serviceStatus");
CREATE INDEX IF NOT EXISTS "client_network_links_ownerCompanyName_idx" ON "client_network_links"("ownerCompanyName");

CREATE INDEX IF NOT EXISTS "network_alerts_deviceId_idx" ON "network_alerts"("deviceId");
CREATE INDEX IF NOT EXISTS "network_alerts_severity_isResolved_idx" ON "network_alerts"("severity", "isResolved");
CREATE INDEX IF NOT EXISTS "network_alerts_ownerCompanyName_idx" ON "network_alerts"("ownerCompanyName");
CREATE INDEX IF NOT EXISTS "network_alerts_createdAt_idx" ON "network_alerts"("createdAt");

-- AddForeignKey (idempotent)
DO $$ BEGIN
  ALTER TABLE "network_devices" ADD CONSTRAINT "network_devices_parentDeviceId_fkey" FOREIGN KEY ("parentDeviceId") REFERENCES "network_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "network_interfaces" ADD CONSTRAINT "network_interfaces_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "network_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "client_network_links" ADD CONSTRAINT "client_network_links_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "client_network_links" ADD CONSTRAINT "client_network_links_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "network_devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "client_network_links" ADD CONSTRAINT "client_network_links_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "network_alerts" ADD CONSTRAINT "network_alerts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "network_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
