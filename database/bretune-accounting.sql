--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-04-04 12:32:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 203574)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5950 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 926 (class 1247 OID 276442)
-- Name: AISuggestionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AISuggestionStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DISMISSED'
);


ALTER TYPE public."AISuggestionStatus" OWNER TO postgres;

--
-- TOC entry 929 (class 1247 OID 276450)
-- Name: AISuggestionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AISuggestionType" AS ENUM (
    'CATEGORIZE_TRANSACTION',
    'MATCH_INVOICE',
    'MATCH_BILL',
    'DUPLICATE_INVOICE',
    'DUPLICATE_BILL',
    'DUPLICATE_EXPENSE',
    'EXPENSE_SUGGESTION'
);


ALTER TYPE public."AISuggestionType" OWNER TO postgres;

--
-- TOC entry 1178 (class 1247 OID 204726)
-- Name: AccountingPeriodStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountingPeriodStatus" AS ENUM (
    'OPEN',
    'CLOSED'
);


ALTER TYPE public."AccountingPeriodStatus" OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 276466)
-- Name: AutomationRuleAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AutomationRuleAction" AS ENUM (
    'CATEGORIZE',
    'MATCH_INVOICE',
    'MATCH_BILL',
    'TAG',
    'NOTIFY'
);


ALTER TYPE public."AutomationRuleAction" OWNER TO postgres;

--
-- TOC entry 1175 (class 1247 OID 204721)
-- Name: BankReconciliationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BankReconciliationStatus" AS ENUM (
    'DRAFT',
    'COMPLETED'
);


ALTER TYPE public."BankReconciliationStatus" OWNER TO postgres;

--
-- TOC entry 1076 (class 1247 OID 204096)
-- Name: BillStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BillStatus" AS ENUM (
    'DRAFT',
    'OPEN',
    'PAID',
    'CANCELLED',
    'UNPAID',
    'PARTIALLY_PAID',
    'OVERDUE'
);


ALTER TYPE public."BillStatus" OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 276478)
-- Name: ClientServiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClientServiceStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'PENDING',
    'TERMINATED'
);


ALTER TYPE public."ClientServiceStatus" OWNER TO postgres;

--
-- TOC entry 989 (class 1247 OID 203598)
-- Name: ClientStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClientStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."ClientStatus" OWNER TO postgres;

--
-- TOC entry 1055 (class 1247 OID 203963)
-- Name: ClientTaxType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClientTaxType" AS ENUM (
    'NONE',
    'VAT_REGISTERED',
    'VAT_EXEMPT'
);


ALTER TYPE public."ClientTaxType" OWNER TO postgres;

--
-- TOC entry 986 (class 1247 OID 203592)
-- Name: ClientType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClientType" AS ENUM (
    'INDIVIDUAL',
    'COMPANY'
);


ALTER TYPE public."ClientType" OWNER TO postgres;

--
-- TOC entry 1217 (class 1247 OID 204907)
-- Name: DepreciationMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DepreciationMethod" AS ENUM (
    'STRAIGHT_LINE',
    'DECLINING_BALANCE'
);


ALTER TYPE public."DepreciationMethod" OWNER TO postgres;

--
-- TOC entry 1052 (class 1247 OID 203950)
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentType" AS ENUM (
    'INVOICE',
    'STATEMENT'
);


ALTER TYPE public."DocumentType" OWNER TO postgres;

--
-- TOC entry 1037 (class 1247 OID 203891)
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
);


ALTER TYPE public."EmailStatus" OWNER TO postgres;

--
-- TOC entry 1145 (class 1247 OID 204540)
-- Name: ExpenseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExpenseStatus" AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REIMBURSED'
);


ALTER TYPE public."ExpenseStatus" OWNER TO postgres;

--
-- TOC entry 1211 (class 1247 OID 204881)
-- Name: InventoryMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryMovementType" AS ENUM (
    'PURCHASE',
    'SALE',
    'ADJUSTMENT',
    'RETURN',
    'TRANSFER'
);


ALTER TYPE public."InventoryMovementType" OWNER TO postgres;

--
-- TOC entry 992 (class 1247 OID 203606)
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'PAID',
    'PARTIALLY_PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- TOC entry 1040 (class 1247 OID 203898)
-- Name: JobRunStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobRunStatus" AS ENUM (
    'SUCCESS',
    'FAILED'
);


ALTER TYPE public."JobRunStatus" OWNER TO postgres;

--
-- TOC entry 1124 (class 1247 OID 204390)
-- Name: JournalEntryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JournalEntryStatus" AS ENUM (
    'POSTED',
    'REVERSED',
    'DRAFT',
    'PENDING_APPROVAL'
);


ALTER TYPE public."JournalEntryStatus" OWNER TO postgres;

--
-- TOC entry 1127 (class 1247 OID 204396)
-- Name: JournalSourceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JournalSourceType" AS ENUM (
    'BILL',
    'SUPPLIER_PAYMENT',
    'INVOICE',
    'PAYMENT',
    'EXPENSE',
    'MANUAL',
    'LOAN',
    'LOAN_REPAYMENT'
);


ALTER TYPE public."JournalSourceType" OWNER TO postgres;

--
-- TOC entry 1121 (class 1247 OID 204378)
-- Name: LedgerAccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LedgerAccountType" AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'INCOME',
    'EXPENSE'
);


ALTER TYPE public."LedgerAccountType" OWNER TO postgres;

--
-- TOC entry 965 (class 1247 OID 244925)
-- Name: LoanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoanStatus" AS ENUM (
    'ACTIVE',
    'PARTIALLY_REPAID',
    'REPAID',
    'WRITTEN_OFF'
);


ALTER TYPE public."LoanStatus" OWNER TO postgres;

--
-- TOC entry 938 (class 1247 OID 276488)
-- Name: NetworkAlertSeverity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkAlertSeverity" AS ENUM (
    'INFO',
    'WARNING',
    'CRITICAL'
);


ALTER TYPE public."NetworkAlertSeverity" OWNER TO postgres;

--
-- TOC entry 941 (class 1247 OID 276496)
-- Name: NetworkDeviceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkDeviceStatus" AS ENUM (
    'ONLINE',
    'OFFLINE',
    'DEGRADED',
    'MAINTENANCE'
);


ALTER TYPE public."NetworkDeviceStatus" OWNER TO postgres;

--
-- TOC entry 944 (class 1247 OID 276506)
-- Name: NetworkDeviceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkDeviceType" AS ENUM (
    'ROUTER',
    'SWITCH',
    'ACCESS_POINT',
    'OLT',
    'ONT',
    'RADIO',
    'SERVER',
    'OTHER'
);


ALTER TYPE public."NetworkDeviceType" OWNER TO postgres;

--
-- TOC entry 1226 (class 1247 OID 204941)
-- Name: PayRunStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PayRunStatus" AS ENUM (
    'DRAFT',
    'PROCESSED',
    'PAID',
    'CANCELLED'
);


ALTER TYPE public."PayRunStatus" OWNER TO postgres;

--
-- TOC entry 1001 (class 1247 OID 203642)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'CHECK',
    'ONLINE',
    'CREDIT_NOTE'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- TOC entry 998 (class 1247 OID 203632)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'VOIDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 1073 (class 1247 OID 204086)
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'ON_HOLD',
    'CANCELLED'
);


ALTER TYPE public."ProjectStatus" OWNER TO postgres;

--
-- TOC entry 995 (class 1247 OID 203620)
-- Name: QuoteStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuoteStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED'
);


ALTER TYPE public."QuoteStatus" OWNER TO postgres;

--
-- TOC entry 1004 (class 1247 OID 203656)
-- Name: RecurringFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RecurringFrequency" AS ENUM (
    'DAILY',
    'WEEKLY',
    'BI_WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'YEARLY'
);


ALTER TYPE public."RecurringFrequency" OWNER TO postgres;

--
-- TOC entry 1181 (class 1247 OID 204732)
-- Name: RecurringJournalFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RecurringJournalFrequency" AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'YEARLY'
);


ALTER TYPE public."RecurringJournalFrequency" OWNER TO postgres;

--
-- TOC entry 1163 (class 1247 OID 204637)
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'TRIAL',
    'ACTIVE',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO postgres;

--
-- TOC entry 1115 (class 1247 OID 204354)
-- Name: SupplierStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SupplierStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."SupplierStatus" OWNER TO postgres;

--
-- TOC entry 1088 (class 1247 OID 204138)
-- Name: TaskActivityAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskActivityAction" AS ENUM (
    'CREATED',
    'UPDATED',
    'STATUS_CHANGED',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED',
    'ASSIGNED',
    'DELETED'
);


ALTER TYPE public."TaskActivityAction" OWNER TO postgres;

--
-- TOC entry 1091 (class 1247 OID 204156)
-- Name: TaskNotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskNotificationType" AS ENUM (
    'REMINDER',
    'OVERDUE'
);


ALTER TYPE public."TaskNotificationType" OWNER TO postgres;

--
-- TOC entry 1082 (class 1247 OID 204118)
-- Name: TaskPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."TaskPriority" OWNER TO postgres;

--
-- TOC entry 1085 (class 1247 OID 204128)
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."TaskStatus" OWNER TO postgres;

--
-- TOC entry 1079 (class 1247 OID 204106)
-- Name: TaskType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskType" AS ENUM (
    'GENERAL',
    'FINANCE',
    'CLIENT',
    'PROJECT',
    'SUPPORT'
);


ALTER TYPE public."TaskType" OWNER TO postgres;

--
-- TOC entry 1007 (class 1247 OID 203670)
-- Name: TaxType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaxType" AS ENUM (
    'PERCENTAGE',
    'FIXED'
);


ALTER TYPE public."TaxType" OWNER TO postgres;

--
-- TOC entry 983 (class 1247 OID 203585)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'MANAGER',
    'ACCOUNTANT'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 203575)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 204816)
-- Name: accounting_entities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounting_entities (
    id text NOT NULL,
    "companyId" text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "baseCurrencyCode" text DEFAULT 'ZAR'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.accounting_entities OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 204764)
-- Name: accounting_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounting_periods (
    id text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status public."AccountingPeriodStatus" DEFAULT 'OPEN'::public."AccountingPeriodStatus" NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "closedByUserId" text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.accounting_periods OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 276523)
-- Name: ai_suggestions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_suggestions (
    id text NOT NULL,
    type public."AISuggestionType" NOT NULL,
    status public."AISuggestionStatus" DEFAULT 'PENDING'::public."AISuggestionStatus" NOT NULL,
    confidence numeric(5,4) NOT NULL,
    "sourceEntityType" text NOT NULL,
    "sourceEntityId" text NOT NULL,
    "targetEntityType" text,
    "targetEntityId" text,
    reasoning text,
    "metaJson" jsonb,
    "resolvedAt" timestamp(3) without time zone,
    "resolvedByUserId" text,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ai_suggestions OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 204862)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    action text NOT NULL,
    "userId" text,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "oldValues" jsonb,
    "newValues" jsonb,
    "ipAddress" text,
    "userAgent" text
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 276530)
-- Name: automation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.automation_rules (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    action public."AutomationRuleAction" NOT NULL,
    "conditionsJson" jsonb NOT NULL,
    "actionParamsJson" jsonb,
    "timesApplied" integer DEFAULT 0 NOT NULL,
    "lastAppliedAt" timestamp(3) without time zone,
    "createdByUserId" text NOT NULL,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.automation_rules OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 204756)
-- Name: bank_reconciliation_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_reconciliation_matches (
    id text NOT NULL,
    "reconciliationId" text NOT NULL,
    "statementLineId" text NOT NULL,
    "journalLineId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bank_reconciliation_matches OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 204739)
-- Name: bank_reconciliations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_reconciliations (
    id text NOT NULL,
    "accountCode" text NOT NULL,
    "statementDate" timestamp(3) without time zone NOT NULL,
    "openingBalance" numeric(12,2) NOT NULL,
    "closingBalance" numeric(12,2) NOT NULL,
    status public."BankReconciliationStatus" DEFAULT 'DRAFT'::public."BankReconciliationStatus" NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "closedByUserId" text,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "bankAccountId" text
);


ALTER TABLE public.bank_reconciliations OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 204748)
-- Name: bank_statement_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_statement_lines (
    id text NOT NULL,
    "reconciliationId" text NOT NULL,
    "lineDate" timestamp(3) without time zone NOT NULL,
    description text,
    reference text,
    amount numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bank_statement_lines OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 221837)
-- Name: bank_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_transactions (
    id text NOT NULL,
    "bankAccountId" text NOT NULL,
    "transactionDate" timestamp(3) without time zone NOT NULL,
    description text,
    reference text,
    debit numeric(15,2),
    credit numeric(15,2),
    amount numeric(15,2) NOT NULL,
    balance numeric(15,2),
    hash text NOT NULL,
    "isReconciled" boolean DEFAULT false NOT NULL,
    "matchedType" text,
    "matchedId" text,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bank_transactions OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 204184)
-- Name: bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bills (
    id text NOT NULL,
    "billNumber" integer NOT NULL,
    reference text,
    "vendorName" text NOT NULL,
    description text,
    "billDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone,
    status public."BillStatus" DEFAULT 'UNPAID'::public."BillStatus" NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "clientId" text,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "amountPaid" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "balanceDue" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "journalEntryId" text,
    "paidDate" timestamp(3) without time zone,
    "supplierId" text
);


ALTER TABLE public.bills OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 204183)
-- Name: bills_billNumber_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."bills_billNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."bills_billNumber_seq" OWNER TO postgres;

--
-- TOC entry 5952 (class 0 OID 0)
-- Dependencies: 243
-- Name: bills_billNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."bills_billNumber_seq" OWNED BY public.bills."billNumber";


--
-- TOC entry 280 (class 1259 OID 221812)
-- Name: business_bank_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business_bank_accounts (
    id text NOT NULL,
    "bankName" text NOT NULL,
    "accountName" text NOT NULL,
    "accountNumber" text,
    "accountHolder" text,
    "branchCode" text,
    currency text DEFAULT 'ZAR'::text NOT NULL,
    "ledgerAccountCode" text DEFAULT '1000'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "ownerCompanyName" text,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "openingBalance" numeric(15,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.business_bank_accounts OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 276539)
-- Name: client_network_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_network_links (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "deviceId" text,
    "servicePlanId" text,
    "serviceStatus" public."ClientServiceStatus" DEFAULT 'PENDING'::public."ClientServiceStatus" NOT NULL,
    "ipAddress" text,
    "macAddress" text,
    "pppoeUsername" text,
    "installationDate" timestamp(3) without time zone,
    "suspendedAt" timestamp(3) without time zone,
    "suspendReason" text,
    "terminatedAt" timestamp(3) without time zone,
    "billingDay" integer DEFAULT 1 NOT NULL,
    "autoBilling" boolean DEFAULT true NOT NULL,
    "lastBilledAt" timestamp(3) without time zone,
    "nextBillDate" timestamp(3) without time zone,
    notes text,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.client_network_links OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 203685)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id text NOT NULL,
    type public."ClientType" DEFAULT 'COMPANY'::public."ClientType" NOT NULL,
    "companyName" text,
    "contactName" text NOT NULL,
    email text,
    phone text,
    address text,
    city text,
    state text,
    country text,
    "postalCode" text,
    status public."ClientStatus" DEFAULT 'ACTIVE'::public."ClientStatus" NOT NULL,
    "paymentTermsDays" integer DEFAULT 30 NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "openingBalance" numeric(10,2) DEFAULT 0.00 NOT NULL,
    balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    "creditLimit" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalInvoiced" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalPaid" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "creditBalance" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "taxNumber" text,
    "taxType" public."ClientTaxType" DEFAULT 'NONE'::public."ClientTaxType" NOT NULL,
    "clientSeq" integer NOT NULL,
    "ownerCompanyName" text
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 204016)
-- Name: clients_clientSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."clients_clientSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."clients_clientSeq_seq" OWNER TO postgres;

--
-- TOC entry 5953 (class 0 OID 0)
-- Dependencies: 235
-- Name: clients_clientSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."clients_clientSeq_seq" OWNED BY public.customers."clientSeq";


--
-- TOC entry 263 (class 1259 OID 204645)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id text NOT NULL,
    name text NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "subscriptionStatus" public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "baseCurrencyCode" text DEFAULT 'ZAR'::text NOT NULL,
    "stripeCustomerId" text
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 204045)
-- Name: company_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_settings (
    id text NOT NULL,
    "businessEmail" text,
    "businessPhone" text,
    "addressLine" text,
    city text,
    country text,
    "bankName" text,
    "accountName" text,
    "accountNumber" text,
    "branchCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accountType" text,
    "displayCurrencyCode" text,
    tagline text
);


ALTER TABLE public.company_settings OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 204664)
-- Name: company_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_subscriptions (
    id text NOT NULL,
    "companyId" text NOT NULL,
    "planId" text,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "subscriptionEndsAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.company_subscriptions OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 204832)
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currencies (
    code text NOT NULL,
    name text NOT NULL,
    symbol text,
    decimals integer DEFAULT 2 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 240478)
-- Name: customer_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_documents (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "originalName" text NOT NULL,
    "mimeType" text NOT NULL,
    size integer NOT NULL,
    "storageKey" text NOT NULL,
    "uploadedByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text
);


ALTER TABLE public.customer_documents OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 204925)
-- Name: depreciation_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.depreciation_runs (
    id text NOT NULL,
    "assetId" text NOT NULL,
    "runDate" timestamp(3) without time zone NOT NULL,
    amount numeric(12,2) NOT NULL,
    "journalEntryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.depreciation_runs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 203970)
-- Name: document_counters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_counters (
    key text NOT NULL,
    value integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.document_counters OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 203912)
-- Name: email_outbox; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_outbox (
    id text NOT NULL,
    "invoiceId" text,
    "to" text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    status public."EmailStatus" DEFAULT 'PENDING'::public."EmailStatus" NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "lastError" text,
    "nextAttemptAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clientId" text,
    "documentType" public."DocumentType" DEFAULT 'INVOICE'::public."DocumentType" NOT NULL,
    "statementFrom" timestamp(3) without time zone,
    "statementTo" timestamp(3) without time zone
);


ALTER TABLE public.email_outbox OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 204162)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id text NOT NULL,
    "employeeNumber" integer NOT NULL,
    email text,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text,
    title text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 204161)
-- Name: employees_employeeNumber_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."employees_employeeNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."employees_employeeNumber_seq" OWNER TO postgres;

--
-- TOC entry 5954 (class 0 OID 0)
-- Dependencies: 239
-- Name: employees_employeeNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."employees_employeeNumber_seq" OWNED BY public.employees."employeeNumber";


--
-- TOC entry 273 (class 1259 OID 204843)
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    id text NOT NULL,
    "fromCurrencyCode" text NOT NULL,
    "toCurrencyCode" text NOT NULL,
    rate numeric(18,8) NOT NULL,
    "asOfDate" timestamp(3) without time zone NOT NULL,
    source text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 204549)
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id text NOT NULL,
    name text NOT NULL,
    "defaultTaxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    "ledgerAccount" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 204559)
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id text NOT NULL,
    "expenseSeq" integer NOT NULL,
    "expenseDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    "taxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    "taxAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status public."ExpenseStatus" DEFAULT 'DRAFT'::public."ExpenseStatus" NOT NULL,
    "paymentMethod" text,
    notes text,
    "supplierId" text,
    "categoryId" text,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "journalEntryId" text
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 204558)
-- Name: expenses_expenseSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."expenses_expenseSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."expenses_expenseSeq_seq" OWNER TO postgres;

--
-- TOC entry 5955 (class 0 OID 0)
-- Dependencies: 258
-- Name: expenses_expenseSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."expenses_expenseSeq_seq" OWNED BY public.expenses."expenseSeq";


--
-- TOC entry 276 (class 1259 OID 204911)
-- Name: fixed_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fixed_assets (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "assetCode" text,
    "purchaseDate" timestamp(3) without time zone NOT NULL,
    cost numeric(12,2) NOT NULL,
    "residualValue" numeric(12,2) DEFAULT 0 NOT NULL,
    "usefulLifeYears" integer NOT NULL,
    "depreciationMethod" public."DepreciationMethod" DEFAULT 'STRAIGHT_LINE'::public."DepreciationMethod" NOT NULL,
    "accumulatedDepreciation" numeric(12,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "disposedAt" timestamp(3) without time zone,
    "disposedAmount" numeric(12,2),
    "journalEntryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.fixed_assets OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 204891)
-- Name: inventory_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_movements (
    id text NOT NULL,
    "productId" text NOT NULL,
    type public."InventoryMovementType" NOT NULL,
    quantity numeric(12,4) NOT NULL,
    "unitCost" numeric(10,2),
    reference text,
    "referenceType" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text
);


ALTER TABLE public.inventory_movements OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 203744)
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "productId" text,
    description text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    discount numeric(5,2) DEFAULT 0.00 NOT NULL,
    "taxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 203732)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "clientId" text NOT NULL,
    "userId" text NOT NULL,
    "quoteId" text,
    "recurringInvoiceId" text,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "paidDate" timestamp(3) without time zone,
    notes text,
    subtotal numeric(10,2) NOT NULL,
    "taxAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "amountPaid" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "balanceDue" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "invoiceSeq" integer NOT NULL,
    "journalEntryId" text
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 203978)
-- Name: invoices_invoiceSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."invoices_invoiceSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."invoices_invoiceSeq_seq" OWNER TO postgres;

--
-- TOC entry 5956 (class 0 OID 0)
-- Dependencies: 232
-- Name: invoices_invoiceSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."invoices_invoiceSeq_seq" OWNED BY public.invoices."invoiceSeq";


--
-- TOC entry 230 (class 1259 OID 203923)
-- Name: job_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_locks (
    name text NOT NULL,
    "lockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lockedBy" text,
    "ttlMs" integer NOT NULL
);


ALTER TABLE public.job_locks OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 204442)
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entries (
    id text NOT NULL,
    "entryNumber" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    memo text,
    "sourceType" public."JournalSourceType",
    "sourceId" text,
    status public."JournalEntryStatus" DEFAULT 'POSTED'::public."JournalEntryStatus" NOT NULL,
    "reversedAt" timestamp(3) without time zone,
    "reversedEntryId" text,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "approvedByUserId" text,
    "approvedAt" timestamp(3) without time zone
);


ALTER TABLE public.journal_entries OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 204452)
-- Name: journal_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_lines (
    id text NOT NULL,
    "entryId" text NOT NULL,
    "accountId" text NOT NULL,
    debit numeric(12,2) DEFAULT 0.00 NOT NULL,
    credit numeric(12,2) DEFAULT 0.00 NOT NULL,
    memo text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "foreignAmount" numeric(12,2),
    "foreignCurrencyCode" text
);


ALTER TABLE public.journal_lines OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 204432)
-- Name: ledger_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ledger_accounts (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type public."LedgerAccountType" NOT NULL,
    "isSystem" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ledger_accounts OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 244943)
-- Name: loan_repayments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_repayments (
    id text NOT NULL,
    "loanId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "journalEntryId" text
);


ALTER TABLE public.loan_repayments OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 244933)
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    id text NOT NULL,
    "borrowerName" text NOT NULL,
    "borrowerContact" text,
    amount numeric(10,2) NOT NULL,
    "outstandingBalance" numeric(10,2) NOT NULL,
    "loanDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "interestRate" numeric(5,2),
    purpose text,
    status public."LoanStatus" DEFAULT 'ACTIVE'::public."LoanStatus" NOT NULL,
    notes text,
    "ownerCompanyName" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customerId" text,
    "journalEntryId" text
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 276548)
-- Name: network_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network_alerts (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    severity public."NetworkAlertSeverity" NOT NULL,
    message text NOT NULL,
    "isResolved" boolean DEFAULT false NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    "resolvedByUserId" text,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.network_alerts OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 276555)
-- Name: network_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network_devices (
    id text NOT NULL,
    name text NOT NULL,
    type public."NetworkDeviceType" NOT NULL,
    status public."NetworkDeviceStatus" DEFAULT 'OFFLINE'::public."NetworkDeviceStatus" NOT NULL,
    "ipAddress" text,
    "macAddress" text,
    location text,
    model text,
    "serialNumber" text,
    "firmwareVersion" text,
    "parentDeviceId" text,
    "snmpCommunity" text,
    "managementUrl" text,
    "uptimeSeconds" integer,
    "cpuPercent" numeric(5,2),
    "memoryPercent" numeric(5,2),
    "lastSeenAt" timestamp(3) without time zone,
    notes text,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.network_devices OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 276562)
-- Name: network_interfaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network_interfaces (
    id text NOT NULL,
    "deviceId" text NOT NULL,
    name text NOT NULL,
    "ifIndex" integer,
    speed text,
    "macAddress" text,
    "ipAddress" text,
    "isUp" boolean DEFAULT false NOT NULL,
    "rxBytes" bigint DEFAULT 0 NOT NULL,
    "txBytes" bigint DEFAULT 0 NOT NULL,
    "rxErrors" integer DEFAULT 0 NOT NULL,
    "txErrors" integer DEFAULT 0 NOT NULL,
    "lastPolledAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.network_interfaces OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 204029)
-- Name: password_resets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_resets (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_resets OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 204962)
-- Name: pay_run_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pay_run_lines (
    id text NOT NULL,
    "payRunId" text NOT NULL,
    "employeeId" text NOT NULL,
    "grossPay" numeric(12,2) NOT NULL,
    deductions numeric(12,2) DEFAULT 0 NOT NULL,
    "netPay" numeric(12,2) NOT NULL,
    notes text
);


ALTER TABLE public.pay_run_lines OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 204949)
-- Name: pay_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pay_runs (
    id text NOT NULL,
    "payPeriodStart" timestamp(3) without time zone NOT NULL,
    "payPeriodEnd" timestamp(3) without time zone NOT NULL,
    status public."PayRunStatus" DEFAULT 'DRAFT'::public."PayRunStatus" NOT NULL,
    "totalGross" numeric(12,2) DEFAULT 0 NOT NULL,
    "totalNet" numeric(12,2) DEFAULT 0 NOT NULL,
    "journalEntryId" text,
    "processedAt" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pay_runs OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 204063)
-- Name: payment_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_allocations (
    id text NOT NULL,
    "paymentId" text NOT NULL,
    "invoiceId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payment_allocations OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 203764)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "paymentNumber" text NOT NULL,
    "invoiceId" text,
    "clientId" text NOT NULL,
    "userId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    method public."PaymentMethod" NOT NULL,
    "transactionId" text,
    notes text,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "unallocatedAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "voidedAt" timestamp(3) without time zone,
    "voidReason" text,
    "journalEntryId" text
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 204603)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    key text NOT NULL,
    description text,
    module text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 203701)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    sku text,
    price numeric(10,2) NOT NULL,
    cost numeric(10,2),
    "taxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "recurringFrequency" public."RecurringFrequency",
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "trackInventory" boolean DEFAULT false NOT NULL,
    "quantityOnHand" numeric(12,4) DEFAULT 0 NOT NULL,
    "reorderLevel" numeric(12,4),
    "ownerCompanyName" text,
    type text DEFAULT 'PRODUCT'::text NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 204173)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id text NOT NULL,
    "projectNumber" integer NOT NULL,
    name text NOT NULL,
    description text,
    status public."ProjectStatus" DEFAULT 'ACTIVE'::public."ProjectStatus" NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "clientId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 204172)
-- Name: projects_projectNumber_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."projects_projectNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."projects_projectNumber_seq" OWNER TO postgres;

--
-- TOC entry 5957 (class 0 OID 0)
-- Dependencies: 241
-- Name: projects_projectNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."projects_projectNumber_seq" OWNED BY public.projects."projectNumber";


--
-- TOC entry 222 (class 1259 OID 203723)
-- Name: quote_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quote_items (
    id text NOT NULL,
    "quoteId" text NOT NULL,
    "productId" text,
    description text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    discount numeric(5,2) DEFAULT 0.00 NOT NULL,
    "taxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.quote_items OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 203712)
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id text NOT NULL,
    "quoteNumber" text NOT NULL,
    "clientId" text NOT NULL,
    "userId" text NOT NULL,
    status public."QuoteStatus" DEFAULT 'DRAFT'::public."QuoteStatus" NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp(3) without time zone NOT NULL,
    notes text,
    subtotal numeric(10,2) NOT NULL,
    "taxAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "quoteSeq" integer NOT NULL
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 203991)
-- Name: quotes_quoteSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."quotes_quoteSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."quotes_quoteSeq_seq" OWNER TO postgres;

--
-- TOC entry 5958 (class 0 OID 0)
-- Dependencies: 233
-- Name: quotes_quoteSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."quotes_quoteSeq_seq" OWNED BY public.quotes."quoteSeq";


--
-- TOC entry 227 (class 1259 OID 203864)
-- Name: recurring_invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_invoice_items (
    id text NOT NULL,
    "recurringInvoiceId" text NOT NULL,
    "productId" text,
    description text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0.00 NOT NULL,
    "taxRate" numeric(5,4) DEFAULT 0.00 NOT NULL,
    total numeric(10,2) NOT NULL
);


ALTER TABLE public.recurring_invoice_items OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 203903)
-- Name: recurring_invoice_runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_invoice_runs (
    id text NOT NULL,
    "recurringInvoiceId" text NOT NULL,
    "runAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."JobRunStatus" NOT NULL,
    attempt integer DEFAULT 1 NOT NULL,
    "invoiceId" text,
    error text
);


ALTER TABLE public.recurring_invoice_runs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 203753)
-- Name: recurring_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_invoices (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "userId" text NOT NULL,
    "templateName" text NOT NULL,
    frequency public."RecurringFrequency" NOT NULL,
    "intervalValue" integer DEFAULT 1 NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "lastGenerated" timestamp(3) without time zone,
    "nextRunDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "taxAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.recurring_invoices OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 204773)
-- Name: recurring_journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_journal_entries (
    id text NOT NULL,
    name text NOT NULL,
    memo text,
    frequency public."RecurringJournalFrequency" NOT NULL,
    "nextRunDate" timestamp(3) without time zone NOT NULL,
    "linesJson" jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastRunAt" timestamp(3) without time zone,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.recurring_journal_entries OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 204611)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 204594)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    color text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 276573)
-- Name: service_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_plans (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "downloadSpeed" text NOT NULL,
    "uploadSpeed" text NOT NULL,
    "monthlyPrice" numeric(10,2) NOT NULL,
    "dataCapGb" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "ownerCompanyName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.service_plans OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 204654)
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id text NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    "billingCycle" text DEFAULT 'monthly'::text NOT NULL,
    "featuresJson" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "stripePriceId" text
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 204424)
-- Name: supplier_payment_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_payment_allocations (
    id text NOT NULL,
    "paymentId" text NOT NULL,
    "billId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.supplier_payment_allocations OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 204413)
-- Name: supplier_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_payments (
    id text NOT NULL,
    "paymentNumber" text NOT NULL,
    "supplierId" text NOT NULL,
    "userId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "unallocatedAmount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    method public."PaymentMethod" NOT NULL,
    reference text,
    notes text,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "voidedAt" timestamp(3) without time zone,
    "voidReason" text,
    "journalEntryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.supplier_payments OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 204360)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id text NOT NULL,
    "supplierSeq" integer NOT NULL,
    "supplierName" text NOT NULL,
    "companyName" text,
    "contactPerson" text,
    email text,
    phone text,
    address text,
    "taxNumber" text,
    "paymentTermsDays" integer DEFAULT 30 NOT NULL,
    status public."SupplierStatus" DEFAULT 'ACTIVE'::public."SupplierStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "creditBalance" numeric(12,2) DEFAULT 0.00 NOT NULL,
    "outstandingBalance" numeric(12,2) DEFAULT 0.00 NOT NULL,
    "totalBilled" numeric(12,2) DEFAULT 0.00 NOT NULL,
    "totalPaid" numeric(12,2) DEFAULT 0.00 NOT NULL,
    "ownerCompanyName" text
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 204359)
-- Name: suppliers_supplierSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."suppliers_supplierSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."suppliers_supplierSeq_seq" OWNER TO postgres;

--
-- TOC entry 5959 (class 0 OID 0)
-- Dependencies: 250
-- Name: suppliers_supplierSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."suppliers_supplierSeq_seq" OWNED BY public.suppliers."supplierSeq";


--
-- TOC entry 248 (class 1259 OID 204220)
-- Name: task_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_activities (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "actorUserId" text,
    action public."TaskActivityAction" NOT NULL,
    "fromStatus" public."TaskStatus",
    "toStatus" public."TaskStatus",
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.task_activities OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 204228)
-- Name: task_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_notifications (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL,
    type public."TaskNotificationType" DEFAULT 'REMINDER'::public."TaskNotificationType" NOT NULL,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.task_notifications OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 204195)
-- Name: task_recurrences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_recurrences (
    id text NOT NULL,
    frequency public."RecurringFrequency" NOT NULL,
    "intervalValue" integer DEFAULT 1 NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "lastGenerated" timestamp(3) without time zone,
    "nextRunDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.task_recurrences OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 204206)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    "taskSeq" integer NOT NULL,
    title text NOT NULL,
    description text,
    type public."TaskType" DEFAULT 'GENERAL'::public."TaskType" NOT NULL,
    priority public."TaskPriority" DEFAULT 'MEDIUM'::public."TaskPriority" NOT NULL,
    status public."TaskStatus" DEFAULT 'PENDING'::public."TaskStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "reminderEnabled" boolean DEFAULT false NOT NULL,
    "reminderAt" timestamp(3) without time zone,
    "isTemplate" boolean DEFAULT false NOT NULL,
    "generatedFromTaskId" text,
    "assignedUserId" text,
    "assignedEmployeeId" text,
    "clientId" text,
    "invoiceId" text,
    "billId" text,
    "projectId" text,
    "recurrenceId" text,
    "createdByUserId" text NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 204205)
-- Name: tasks_taskSeq_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."tasks_taskSeq_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."tasks_taskSeq_seq" OWNER TO postgres;

--
-- TOC entry 5960 (class 0 OID 0)
-- Dependencies: 246
-- Name: tasks_taskSeq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."tasks_taskSeq_seq" OWNED BY public.tasks."taskSeq";


--
-- TOC entry 218 (class 1259 OID 203675)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."UserRole" DEFAULT 'ACCOUNTANT'::public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "refreshToken" text,
    "lastLogin" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyName" text,
    "userNumber" integer NOT NULL,
    "roleId" text,
    "companyId" text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 204002)
-- Name: users_userNumber_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."users_userNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."users_userNumber_seq" OWNER TO postgres;

--
-- TOC entry 5961 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_userNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."users_userNumber_seq" OWNED BY public.users."userNumber";


--
-- TOC entry 5195 (class 2604 OID 276680)
-- Name: bills billNumber; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills ALTER COLUMN "billNumber" SET DEFAULT nextval('public."bills_billNumber_seq"'::regclass);


--
-- TOC entry 5144 (class 2604 OID 276681)
-- Name: customers clientSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN "clientSeq" SET DEFAULT nextval('public."clients_clientSeq_seq"'::regclass);


--
-- TOC entry 5189 (class 2604 OID 276682)
-- Name: employees employeeNumber; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN "employeeNumber" SET DEFAULT nextval('public."employees_employeeNumber_seq"'::regclass);


--
-- TOC entry 5238 (class 2604 OID 276683)
-- Name: expenses expenseSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN "expenseSeq" SET DEFAULT nextval('public."expenses_expenseSeq_seq"'::regclass);


--
-- TOC entry 5164 (class 2604 OID 276684)
-- Name: invoices invoiceSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN "invoiceSeq" SET DEFAULT nextval('public."invoices_invoiceSeq_seq"'::regclass);


--
-- TOC entry 5192 (class 2604 OID 276685)
-- Name: projects projectNumber; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN "projectNumber" SET DEFAULT nextval('public."projects_projectNumber_seq"'::regclass);


--
-- TOC entry 5156 (class 2604 OID 276686)
-- Name: quotes quoteSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes ALTER COLUMN "quoteSeq" SET DEFAULT nextval('public."quotes_quoteSeq_seq"'::regclass);


--
-- TOC entry 5214 (class 2604 OID 276687)
-- Name: suppliers supplierSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN "supplierSeq" SET DEFAULT nextval('public."suppliers_supplierSeq_seq"'::regclass);


--
-- TOC entry 5204 (class 2604 OID 276688)
-- Name: tasks taskSeq; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN "taskSeq" SET DEFAULT nextval('public."tasks_taskSeq_seq"'::regclass);


--
-- TOC entry 5132 (class 2604 OID 276689)
-- Name: users userNumber; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN "userNumber" SET DEFAULT nextval('public."users_userNumber_seq"'::regclass);


--
-- TOC entry 5870 (class 0 OID 203575)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f2309007-3b75-4532-9915-c50b30df030b	af7c041c68a8dca6d98f8baa8636840e8e2bf78f6245f9775b9835a171f6cc8a	2026-02-27 03:25:30.006994+02	20260225220000_backfill_trial_subscriptions	\N	\N	2026-02-27 03:25:29.997048+02	1
8fe1c253-e632-4306-b661-aefe3ae480b7	a8f1260b96dd30b5c85b33c17401d0e315d0bd9aad0e14f09447518397d97ce5	2026-02-27 03:25:28.836055+02	20260204012841_init_schema	\N	\N	2026-02-27 03:25:28.643178+02	1
25b8cc81-94f1-4ac2-a6e2-93feafacad85	fd47daeefdddc2b71f6c4e30038ca43005f84996faa018a8bc45d84971b5c641	2026-02-27 03:25:29.42928+02	20260223220000_payment_allocations_and_customer_constraints	\N	\N	2026-02-27 03:25:29.361278+02	1
b0566f4d-1ed3-4df4-a79c-99f8429ea9c3	523b38ae62070d7b6485f91bbd44963242a2bf72b1f26127222982ea8db8db5a	2026-02-27 03:25:28.926317+02	20260204013823_add_recurring_invoice_items	\N	\N	2026-02-27 03:25:28.893002+02	1
a262f646-8dd4-4260-928e-8c67da2bf492	a54bcdcd73fa7665c85ca3c0ec02853a554fc318dfaaa386b04a91670666776d	2026-02-27 03:25:28.932312+02	20260204020032_add_client_credit_balance	\N	\N	2026-02-27 03:25:28.928008+02	1
d6395bd0-4934-4cc6-9ee0-e379f2a641d7	2555b1c6d926d63c2b42c73f6783c0ff04385acb47236e58e827a73d213aa764	2026-02-27 03:25:28.988407+02	20260204021112_add_automation_tables	\N	\N	2026-02-27 03:25:28.947648+02	1
a1b38bbc-7767-42fc-8980-43010988d9f5	ddccbde376af76fc5e674ad20fc535893a39079b8f36f27a0144ba3b237954b3	2026-02-27 03:25:29.652347+02	20260224160418_	\N	\N	2026-02-27 03:25:29.472843+02	1
fdb1bb06-e22a-4d0d-b6e0-e899e08ddd5c	cc8d5110de2ad8dfb0fe2b1d35ae0d0da4e0d613a523a00d13a6078928c80bf8	2026-02-27 03:25:29.037121+02	20260204022343_email_outbox_document_delivery	\N	\N	2026-02-27 03:25:29.027554+02	1
29570912-08a2-4b03-b8b5-ee7c83f1a961	6d9f37d2ba5e988970ec1e55b3ddb70e4d3ed317b461bde87113774666381314	2026-02-27 03:25:29.06229+02	20260204035806_add_client_tax_fields	\N	\N	2026-02-27 03:25:29.055401+02	1
f57db14b-d9e1-4c65-88f5-683e7d2a85ee	55e07413315bd61146b69c3d93b735113f1f50930ed84919fb7790c4d5930521	2026-02-27 03:25:30.23879+02	20260227100000_enterprise_features	\N	\N	2026-02-27 03:25:30.118005+02	1
066f0a0f-a713-475f-9bb5-87ce0e3b49e7	51cfb058aaf30e196c8b7ec6ea19c32452c29419383b964933e87ac7bbb5d33a	2026-02-27 03:25:29.07575+02	20260204072124_document_counters	\N	\N	2026-02-27 03:25:29.063846+02	1
b3ca4a3b-e4fb-4420-83e3-fe05e3fe5ee2	fcd6b2a3424d2bf360905cb769282dfc404bff9b39e6cdfaba8d664a4b4a1702	2026-02-27 03:25:29.751438+02	20260224200856_mate	\N	\N	2026-02-27 03:25:29.710023+02	1
abc250e3-a516-443a-adcc-06e7ce8fab1d	30fa91b83bb81c86569062c6eba3ebd4303a49dea521f89b693c5c3ef6bc5ded	2026-02-27 03:25:29.2091+02	20260204234058_unique_client_email_phone	\N	\N	2026-02-27 03:25:29.099874+02	1
26dc11fe-ebc5-4dd9-92cf-7951c03dc1d3	5f1efa3190824817904203acfce73e5fd5f51abdfa45f91cadc2dc1be203f381	2026-02-27 03:25:29.246449+02	20260204235353_matenda	\N	\N	2026-02-27 03:25:29.210592+02	1
1cce2338-9448-439c-b539-8df536ff9303	fc0638b0536399273a7405d0434e89ff03a77e54833f8b247bbc681b8c5fb927	2026-02-27 03:25:30.034259+02	20260225230000_add_double_entry_full_accounting	\N	\N	2026-02-27 03:25:30.008768+02	1
c5ad8681-9781-4b51-b64d-99199c7af203	18d1d47b66ddb2b0072a9aa957a1792305d6a47d105cf73e6f91f675fc04f686	2026-02-27 03:25:29.322644+02	20260212000000_add_password_reset	\N	\N	2026-02-27 03:25:29.301976+02	1
c1c74312-ab6e-40a2-a047-ff7193ef0e21	6429adff4a2459d455b662385333f6505177e1878eeb468fcb8491adff7af2ab	2026-02-27 03:25:29.864691+02	20260225170812_fortu	\N	\N	2026-02-27 03:25:29.75265+02	1
0d0d4599-5081-46b0-865a-038a96c5d8c5	0a396226b3d315f60360fb5a9200b4ec4b02cf78c6ea76df93ce6226ada5011b	2026-02-27 03:25:29.335542+02	20260212100000_add_company_settings	\N	\N	2026-02-27 03:25:29.324477+02	1
203e5e60-807c-40d7-8246-e363688d7baf	ae3879d18e16cadae4a14cc80edd341541bb69452c253a4055b9ba62e4d3abd4	2026-02-27 03:25:29.341106+02	20260212110000_fix_company_settings_updatedat	\N	\N	2026-02-27 03:25:29.337065+02	1
286bbcb4-8e86-4b58-b6f1-eaf4ef83202a	0025b18cd919ab3f04782d90e56fa3732ca41be5ebf1bb361a386e8035bc5b5d	2026-02-27 03:25:29.346561+02	20260212120000_replace_swift_with_account_type	\N	\N	2026-02-27 03:25:29.343242+02	1
aaf20dda-9785-47e1-b39d-8e37e12e8f17	e5b5c3e8ddd16e9b416d5b6d564638ad88aade9a6ed5acd14acd8778c92fdea2	2026-02-27 03:25:29.869133+02	20260225171000_set_bill_default_unpaid	\N	\N	2026-02-27 03:25:29.865721+02	1
b4f0f710-3331-4288-a049-b263b834e711	465eed403d65aa42f95e005d6064892d5c2375789c744b10afbc9b12d4c8f482	2026-02-27 03:25:29.910704+02	20260225180000_add_expenses	\N	\N	2026-02-27 03:25:29.870041+02	1
c3c0839a-f5a9-4f3f-9664-4e2587ff1530	6b70173f1ba4a3aaa4d40147308b4441b79c2ef1b87439119ea2e68db3dbfc6e	2026-02-27 03:25:30.04072+02	20260225240000_add_display_currency_code	\N	\N	2026-02-27 03:25:30.035449+02	1
70d60440-4356-4c4f-9dc9-bdd16d8755dc	49e4a2db268c63723249504ccb077e5838a7ee64701f4e8d65550fefbafcc150	2026-02-27 03:25:29.945635+02	20260225200000_add_rbac	\N	\N	2026-02-27 03:25:29.911829+02	1
d332a00f-6792-45c3-a471-bff24fcd316c	44c707d9c0747b01b06c4894aa4b9db9685794f66294ce6879e87c51944937df	2026-02-27 03:25:29.996104+02	20260225210000_add_subscription_system	\N	\N	2026-02-27 03:25:29.946893+02	1
cc266a3d-0dbd-497c-a76c-2268cd0d57fd	d2bd7069d6cd0c1a4fc78f3a774aa729a227728da07a1ad9d8e3ead059e24dc1	2026-02-27 03:27:59.315902+02	20260225250000_add_owner_company_name	\N	\N	2026-02-27 03:27:59.294973+02	1
646f12f6-cc99-437e-850d-1592969affec	2f79a090a692239c43e691588615dd689af3f8bee3fe3944b8707410c943ad4a	2026-02-27 03:25:30.054689+02	20260226000000_add_expense_ledger_and_manual_source	\N	\N	2026-02-27 03:25:30.042298+02	1
567b9fb2-bd5c-486a-b9dc-6a8fa65857f1	1130c1d695875c05c60b1da855cc08550b9f9045314efcce4743377b370cb581	2026-02-27 03:25:30.11702+02	20260226100000_add_bank_reconciliation_and_period_close	\N	\N	2026-02-27 03:25:30.055832+02	1
201470f2-091c-4d35-96e7-1c3f689a607d	ac5a7dd2f4ef26aad8d517483bc3bbf44dc7199741e5082324ba389a09d2708f	2026-02-28 21:02:03.974475+02	20260227210000_add_bank_transactions_mvp	\N	\N	2026-02-28 21:02:03.916227+02	1
45dfc092-26f2-4598-b534-37b8ba18da84	517d9870e471844b4df9ac9b1610f21a75107ab54347a7929e78cb48e84f60ab	2026-02-27 04:05:49.966039+02	20260225260000_add_tagline	\N	\N	2026-02-27 04:05:49.947559+02	1
ce98baa7-2346-4ebb-bdca-d8e2abb4e288	335a81e83a7bc54bce8e8ec16e2d7f50baafba40d3d72fcc2b8c0ea6713df91d	2026-02-28 20:53:45.751468+02	20260227200000_add_business_bank_accounts	\N	\N	2026-02-28 20:53:45.549835+02	1
af6ac561-807a-4f11-9ab5-601ce0c496d7	ccfba8c7c546b065ac38c82ba2fa8defea266eb58f2e312bdedc5db100b26f5d	2026-03-01 01:29:05.298129+02	20260211000000_add_task_address	\N	\N	2026-03-01 01:29:05.292142+02	1
c90dfd5b-a10d-4e48-9c2e-cb09c0173f5e	manually-applied	2026-03-09 13:40:36.016653+02	20260309000000_add_customer_documents_and_product_type	\N	\N	2026-03-09 13:40:36.016653+02	1
5456afcc-176c-4627-950c-3c979196c2f7	manually_applied	2026-03-09 14:36:36.454524+02	20260309300000_add_loans	\N	\N	2026-03-09 14:36:36.454524+02	1
\.


--
-- TOC entry 5924 (class 0 OID 204816)
-- Dependencies: 271
-- Data for Name: accounting_entities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounting_entities (id, "companyId", code, name, "baseCurrencyCode", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5922 (class 0 OID 204764)
-- Dependencies: 269
-- Data for Name: accounting_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounting_periods (id, "startDate", "endDate", status, "closedAt", "closedByUserId", name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5938 (class 0 OID 276523)
-- Dependencies: 285
-- Data for Name: ai_suggestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_suggestions (id, type, status, confidence, "sourceEntityType", "sourceEntityId", "targetEntityType", "targetEntityId", reasoning, "metaJson", "resolvedAt", "resolvedByUserId", "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
cmmv4fro90002daz7b2n78u4f	DUPLICATE_INVOICE	ACCEPTED	0.9172	invoice	cmmaeu6iz002kkgp40387fpce	invoice	cmmaerbl20020kgp46yapihs9	Invoice #INV-043 and #INV-042 for Fortune Matenda have similar amounts (500.00 vs 580.00) within 0 days	{"invoiceA": {"id": "cmmaeu6iz002kkgp40387fpce", "amount": 500, "number": "INV-043"}, "invoiceB": {"id": "cmmaerbl20020kgp46yapihs9", "amount": 580, "number": "INV-042"}}	2026-03-17 21:26:08.427	cmm47pax500048s6ob25tkito	Bretune Technologies	2026-03-17 21:25:27.129	2026-03-17 21:26:08.428
cmmv4frnw0001daz7e1jp5xur	DUPLICATE_INVOICE	ACCEPTED	0.7600	invoice	cmmv3g1y300i314c1stlqlwv2	invoice	cmmfdycnu00ushwgvl4d5twun	Invoice #INV-047 and #INV-045 for Murdock Valley NHW have similar amounts (500.00 vs 500.00) within 13 days	{"invoiceA": {"id": "cmmv3g1y300i314c1stlqlwv2", "amount": 500, "number": "INV-047"}, "invoiceB": {"id": "cmmfdycnu00ushwgvl4d5twun", "amount": 500, "number": "INV-045"}}	2026-03-17 21:26:12.281	cmm47pax500048s6ob25tkito	Bretune Technologies	2026-03-17 21:25:27.117	2026-03-17 21:26:12.282
\.


--
-- TOC entry 5927 (class 0 OID 204862)
-- Dependencies: 274
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "entityType", "entityId", action, "userId", "changedAt", "oldValues", "newValues", "ipAddress", "userAgent") FROM stdin;
\.


--
-- TOC entry 5939 (class 0 OID 276530)
-- Dependencies: 286
-- Data for Name: automation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.automation_rules (id, name, description, "isActive", priority, action, "conditionsJson", "actionParamsJson", "timesApplied", "lastAppliedAt", "createdByUserId", "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5921 (class 0 OID 204756)
-- Dependencies: 268
-- Data for Name: bank_reconciliation_matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_reconciliation_matches (id, "reconciliationId", "statementLineId", "journalLineId", "createdAt") FROM stdin;
cmm6qtq5n0001sth2pbxzc2l5	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0003j1gflsakoygx	cmm54smhn004vs8x60dy17dok	2026-02-28 19:57:55.499
cmm6qts9b0003sth2ijddxfeb	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0004j1gfup42xx70	cmm54dqwi002rs8x6t0gmrjgx	2026-02-28 19:57:58.224
cmm6qttrv0005sth2pj2bniqt	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0005j1gf08mku63v	cmm6f3t4k000yzvp1rahu1u7p	2026-02-28 19:58:00.187
cmm6qtvyf0007sth2n8qyru35	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0006j1gf1myz6l4i	cmm6fftsf000f2fmqa73gndx8	2026-02-28 19:58:03.015
cmm6qtxbs0009sth227zxx2ad	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0007j1gf0ts5ku4r	cmm6fq7da000n1klqmh7x94no	2026-02-28 19:58:04.792
cmm6qtydt000bsth2pw1da3cc	cmm6q8fz80002j1gfi80d1db4	cmm6q8g0a0008j1gf4mlyu35i	cmm6o3sui000g8nod12q4kq17	2026-02-28 19:58:06.161
\.


--
-- TOC entry 5919 (class 0 OID 204739)
-- Dependencies: 266
-- Data for Name: bank_reconciliations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_reconciliations (id, "accountCode", "statementDate", "openingBalance", "closingBalance", status, "closedAt", "closedByUserId", "createdByUserId", "createdAt", "updatedAt", "bankAccountId") FROM stdin;
cmm5a6uyj003o125156limbnp	1000	2026-02-27 00:00:00	0.00	0.00	COMPLETED	2026-02-27 19:24:46.77	cmm47pax500048s6ob25tkito	cmm47pax500048s6ob25tkito	2026-02-27 19:24:28.602	2026-02-27 19:24:46.772	\N
cmm6p7szu0001847gnlegvxtc	1000	2026-02-28 00:00:00	0.00	0.00	COMPLETED	2026-02-28 19:13:43.267	cmm47pax500048s6ob25tkito	cmm47pax500048s6ob25tkito	2026-02-28 19:12:53.13	2026-02-28 19:13:43.282	cmm6owzex0001wlelvj9uxzh0
cmm6p6ffh00013r8cv8l45prj	1000	2026-02-28 00:00:00	0.00	0.00	COMPLETED	2026-02-28 19:16:29.927	cmm47pax500048s6ob25tkito	cmm47pax500048s6ob25tkito	2026-02-28 19:11:48.862	2026-02-28 19:16:29.931	cmm6owzex0001wlelvj9uxzh0
cmm6picse0001e903yv99xxyt	1000	2026-02-28 00:00:00	810.85	190.89	COMPLETED	2026-02-28 19:23:39.471	cmm47pax500048s6ob25tkito	cmm47pax500048s6ob25tkito	2026-02-28 19:21:05.282	2026-02-28 19:23:39.472	cmm6owzex0001wlelvj9uxzh0
cmm6po2ob0002prmdavgijz6a	1000	2026-02-28 00:00:00	810.85	190.89	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 19:25:32.171	2026-02-28 19:25:32.171	cmm6owzex0001wlelvj9uxzh0
cmm6puqqq001oh0gavtz0fs6n	1000	2026-02-28 00:00:00	810.85	190.89	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 19:30:43.298	2026-02-28 19:30:43.298	cmm6owzex0001wlelvj9uxzh0
cmm6pw3ho001rh0gac59qa1c5	1000	2026-02-28 00:00:00	810.85	190.89	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 19:31:46.477	2026-02-28 19:31:46.477	cmm6owzex0001wlelvj9uxzh0
cmm6q8fz80002j1gfi80d1db4	1000	2026-02-28 00:00:00	810.85	190.89	COMPLETED	2026-02-28 19:58:08.312	cmm47pax500048s6ob25tkito	cmm47pax500048s6ob25tkito	2026-02-28 19:41:22.508	2026-02-28 19:58:08.314	cmm6owzex0001wlelvj9uxzh0
cmm6qxmay001ohg427bomy4ye	1000	2026-02-28 00:00:00	810.85	190.89	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:00:57.13	2026-02-28 20:00:57.13	cmm6owzex0001wlelvj9uxzh0
cmm6r7dep003mhg42jq6c6jcw	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:08:32.161	2026-02-28 20:08:32.161	cmm6r6sr9003khg423c9qkayp
cmm6rgshb0001eb59vx9pgml9	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:15:51.547	2026-02-28 20:15:51.547	cmm6r6sr9003khg423c9qkayp
cmm6rs6eu0001xpkcnatybimm	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:24:42.871	2026-02-28 20:24:42.871	cmm6r6sr9003khg423c9qkayp
cmm6rvinv0001134cw8d0ajl3	1000	2026-02-28 00:00:00	810.85	190.89	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:27:18.715	2026-02-28 20:27:18.715	cmm6owzex0001wlelvj9uxzh0
cmm6rwasu003r134ce3r3t84t	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:27:55.182	2026-02-28 20:27:55.182	cmm6r6sr9003khg423c9qkayp
cmm6s3rl30001prby9boa3yy7	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 20:33:43.48	2026-02-28 20:33:43.48	cmm6r6sr9003khg423c9qkayp
cmm6uywgm0002twnatsns630r	1000	2026-02-28 00:00:00	1.00	0.00	DRAFT	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 21:53:55.366	2026-02-28 21:53:55.366	cmm6r6sr9003khg423c9qkayp
\.


--
-- TOC entry 5920 (class 0 OID 204748)
-- Dependencies: 267
-- Data for Name: bank_statement_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_statement_lines (id, "reconciliationId", "lineDate", description, reference, amount, "createdAt") FROM stdin;
cmm6p7t010002847gq9wyi5n2	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Delivery Method F1 R	\N	2.00	2026-02-28 19:12:53.137
cmm6p7t010003847go2r917xj	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	\N	\N	620.00	2026-02-28 19:12:53.137
cmm6p7t010004847g1lkl13uh	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	\N	\N	1426330.00	2026-02-28 19:12:53.137
cmm6p7t010005847g4xnp4qnk	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	BBST6	\N	678347.00	2026-02-28 19:12:53.137
cmm6p7t010006847g982n0ejq	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	\N	\N	7975.00	2026-02-28 19:12:53.137
cmm6p7t010007847g3af4e79a	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	6 P O Box	\N	5711.00	2026-02-28 19:12:53.137
cmm6p7t010008847gjkc8urnu	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Weltevreden Park ,	\N	1709.00	2026-02-28 19:12:53.137
cmm6p7t010009847gkd9wm1nb	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Universal Branch Code	\N	250655.00	2026-02-28 19:12:53.137
cmm6p7t01000a847gk8sxhxkb	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Lost Cards 087-575	\N	-9406.00	2026-02-28 19:12:53.137
cmm6p7t01000b847gpxzxwo4a	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Account Enquiries 087-736	\N	-2247.00	2026-02-28 19:12:53.137
cmm6p7t01000c847gq6rqq4ld	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Fraud 087-575	\N	-9444.00	2026-02-28 19:12:53.137
cmm6p7t01000d847gu4wh61do	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	4 (021) 659	\N	-5063.00	2026-02-28 19:12:53.137
cmm6p7t01000e847g89ml3eb3	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Tax Invoice/Statement Number :	\N	6.00	2026-02-28 19:12:53.137
cmm6p7t01000f847gz1xg9xzr	cmm6p7szu0001847gnlegvxtc	2025-12-30 00:00:00	Statement Period : to 31 January	\N	2026.00	2026-02-28 19:12:53.137
cmm6p7t01000g847g2bvv7tog	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Statement Date : 31 January	\N	2026.00	2026-02-28 19:12:53.137
cmm6p7t01000h847g2z95ih2t	cmm6p7szu0001847gnlegvxtc	0100-12-30 00:00:00	02 Jan Fuel Purchase Valley Motors BP 485442*1856 .02 710.83 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t01000i847gb9qe79am	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	03 Jan ADT Cash Deposit Lngbeach Previous Ndlovu 350.00 Cr 1,060.83 Cr	\N	10.44	2026-02-28 19:12:53.137
cmm6p7t01000j847gdyjt76na	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	05 Jan ADT Cash Deposit 02478002 Izaya 400.00 Cr 1,460.83 Cr	\N	10.44	2026-02-28 19:12:53.137
cmm6p7t01000k847gcpxptqdf	cmm6p7szu0001847gnlegvxtc	0310-01-02 00:00:00	06 Jan POS Purchase Suburban Motor Spar 485442*1856 .00 985.83 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t01000l847grpc13tsq	cmm6p7szu0001847gnlegvxtc	0300-01-03 00:00:00	07 Jan Fuel Purchase Total Portlands C 485442*1856 .00 685.83 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t01000m847g1243kn8t	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	07 Jan Digital Content Voucher 1Voucher 26010622312344178 100.00 585.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t01000n847gzg9pka6k	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	07 Jan Digital Content Voucher 1Voucher 26010623242648979 100.00 485.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t01000o847ghcf0x0zq	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	08 Jan Digital Content Voucher 1Voucher 26010723483557233 100.00 385.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t01000p847g5aj4wemq	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	09 Jan Digital Content Voucher Ott Voucher 26010901564282969 100.00 285.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000q847gybwxur05	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	10 Jan Digital Content Voucher 1Voucher 26011002524799354 100.00 185.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000r847g84egdypq	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	10 Jan Digital Content Voucher 1Voucher 2601100357481129 100.00 85.83 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000s847g6asqunc2	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	12 Jan Digital Content Voucher 1Voucher 26011200190492796 100.00 453.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000t847gl2f2uhdk	cmm6p7szu0001847gnlegvxtc	0200-01-10 00:00:00	13 Jan Fuel Purchase Biz Afrika 693 Pty 485442*1856 .00 497.15 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t02000u847gaazqe6nl	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	13 Jan Digital Content Voucher 1Voucher 26011223193269084 20.00 477.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000v847gt1wlxp21	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	13 Jan Digital Content Voucher 1Voucher 26011222430966284 100.00 377.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000w847gt8eloyy0	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	13 Jan Digital Content Voucher 1Voucher 26011223002667670 100.00 277.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02000x847g1gioe8jv	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	16 Jan Payshap Account Off-Us Wages 800.00 802.15 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02000y847gsxy4l7f5	cmm6p7szu0001847gnlegvxtc	0200-01-13 00:00:00	16 Jan Fuel Purchase Sasol Kommetjie 485442*1856 .00 602.15 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t02000z847g8dry06dh	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	Delivery Method F1 R	\N	2.00	2026-02-28 19:12:53.137
cmm6p7t020010847gsie9iagj	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	\N	\N	620.00	2026-02-28 19:12:53.137
cmm6p7t020011847g8kn9mpr5	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	\N	\N	1426331.00	2026-02-28 19:12:53.137
cmm6p7t020012847gz2re0hws	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	17 Jan Send Money App Dr Send Madzimai Madzimai 250.00 8,933.65 Cr	\N	9.86	2026-02-28 19:12:53.137
cmm6p7t020013847gzo7msg5y	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	17 Jan Payshap Account Off-Us Wages 500.00 8,433.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t020014847g2rc7r9tq	cmm6p7szu0001847gnlegvxtc	0454-01-15 00:00:00	19 Jan POS Purchase Checkers Sunvalley 485442*1856 .00 7,979.65 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t020015847g0zujbw08	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	19 Jan Digital Content Voucher 1Voucher 26011803081893820 100.00 7,879.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t020016847g7wkl3vxr	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	20 Jan Payshap Account Off-Us Wages 500.00 7,379.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t020017847gc55kfi51	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	20 Jan Digital Content Voucher 1Voucher 26012018312210450 100.00 7,279.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t020018847gej2aby90	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	20 Jan Digital Content Voucher 1Voucher 26011921194339177 100.00 7,179.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t020019847gcd5xj894	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher 1Voucher 26012100400750431 100.00 7,079.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001a847gfkd6qk9n	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Blu Flexi Voucher 26012100470450671 100.00 6,979.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001b847g70znog0t	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Ott Voucher 26012100552550957 100.00 6,879.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001c847gih4u133l	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher 1Voucher 26012101022051180 100.00 6,779.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001d847gbt0mrj2u	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Ott Voucher 26012101074851360 100.00 6,679.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001e847goc4kkur8	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher 1Voucher 26012101131451513 100.00 6,579.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001f847gsplxt4r8	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Blu Flexi Voucher 26012101243551821 100.00 6,479.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001g847g57jh1yu3	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Ott Voucher 26012101374452143 100.00 6,379.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001h847g76xosmp1	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Digital Content Voucher Ott Voucher 26012102103352987 100.00 6,279.65 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001i847glmz6glfd	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 200.00 6,079.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001j847g51l8s45i	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,979.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001k847g15mhom0c	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,879.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001l847gbbqkiwkf	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 200.00 5,679.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001m847gtzr6y43c	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,579.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001n847g0i8gnb68	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,479.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001o847glgcrhg0h	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,379.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001p847gu0e6t98z	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan Payshap Account Off-Us Wages 100.00 5,279.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001q847gduf5e8zg	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	21 Jan POS Purchase Scoop Distribution- 485442*1856 19 Jan 4,335.50 2,644.15 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t02001r847gfoxbigue	cmm6p7szu0001847gnlegvxtc	0300-01-18 00:00:00	21 Jan Fuel Purchase Cottage Diep River 485442*1856 .00 2,344.15 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t02001s847gfqchn970	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	22 Jan Send Money App Dr Send Tendai Fuma Cell 1,000.00 1,344.15 Cr	\N	28.20	2026-02-28 19:12:53.137
cmm6p7t02001t847g1y7l9vpa	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Payshap Account Off-Us Wages 300.00 1,044.15 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t02001u847g67gqq31q	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Digital Content Voucher 1Voucher 26012415512053683 100.00 944.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001v847gz5r6h9ei	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Digital Content Voucher 1Voucher 26012421280399380 60.00 884.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001w847g4k6c6r0i	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Digital Content Voucher Ott Voucher 26012321454144267 100.00 784.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001x847g7rks9lcp	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Digital Content Voucher 1Voucher 26012321592246502 100.00 684.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001y847g8aofn8i3	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	24 Jan Digital Content Voucher 1Voucher 26012321321541976 100.00 584.15 Cr	\N	2.70	2026-02-28 19:12:53.137
cmm6p7t02001z847gq314d42m	cmm6p7szu0001847gnlegvxtc	0217-01-22 00:00:00	27 Jan POS Purchase Communica Cape Town 485442*1856 .50 366.65 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t020020847g061wxl1f	cmm6p7szu0001847gnlegvxtc	0200-01-22 00:00:00	27 Jan Fuel Purchase Total Observatory C 485442*1856 .00 166.65 Cr	\N	3.68	2026-02-28 19:12:53.137
cmm6p7t020021847gr5ia4gpw	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	31 Jan Payshap Account Off-Us Wages 1,600.00 431.65 Cr	\N	3.00	2026-02-28 19:12:53.137
cmm6p7t020022847g90t774cr	cmm6p7szu0001847gnlegvxtc	2026-02-28 00:00:00	31 Jan 0.00 431.65 Cr	\N	5.00	2026-02-28 19:12:53.137
cmm6pictg0002e903zgigr94r	cmm6picse0001e903yv99xxyt	0100-12-30 00:00:00	02 Jan Fuel Purchase Valley Motors BP 485442*1856 .02 710.83 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0003e903jlznj7yc	cmm6picse0001e903yv99xxyt	0310-01-02 00:00:00	06 Jan POS Purchase Suburban Motor Spar 485442*1856 .00 985.83 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0004e903qjflhnle	cmm6picse0001e903yv99xxyt	0300-01-03 00:00:00	07 Jan Fuel Purchase Total Portlands C 485442*1856 .00 685.83 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0005e903i0h0i55x	cmm6picse0001e903yv99xxyt	2032-01-09 00:00:00	.	\N	553.15	2026-02-28 19:21:05.38
cmm6pictg0006e903424ue0x0	cmm6picse0001e903yv99xxyt	0200-01-10 00:00:00	13 Jan Fuel Purchase Biz Afrika 693 Pty 485442*1856 .00 497.15 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0007e903vrgsq855	cmm6picse0001e903yv99xxyt	0200-01-13 00:00:00	16 Jan Fuel Purchase Sasol Kommetjie 485442*1856 .00 602.15 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0008e903sku2ni3b	cmm6picse0001e903yv99xxyt	0454-01-15 00:00:00	19 Jan POS Purchase Checkers Sunvalley 485442*1856 .00 7,979.65 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg0009e903os312233	cmm6picse0001e903yv99xxyt	0300-01-18 00:00:00	21 Jan Fuel Purchase Cottage Diep River 485442*1856 .00 2,344.15 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg000ae903hu1w8svw	cmm6picse0001e903yv99xxyt	0217-01-22 00:00:00	27 Jan POS Purchase Communica Cape Town 485442*1856 .50 366.65 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg000be903brtydp2i	cmm6picse0001e903yv99xxyt	0200-01-22 00:00:00	27 Jan Fuel Purchase Total Observatory C 485442*1856 .00 166.65 Cr	\N	3.68	2026-02-28 19:21:05.38
cmm6pictg000ce9036lje3it9	cmm6picse0001e903yv99xxyt	2049-01-30 00:00:00	.	\N	382.65	2026-02-28 19:21:05.38
cmm6pictg000de903xj9pqivv	cmm6picse0001e903yv99xxyt	0191-01-30 00:00:00	.	\N	190.89	2026-02-28 19:21:05.38
cmm6pictg000ee903r4cr8gwr	cmm6picse0001e903yv99xxyt	2025-11-20 00:00:00	On , the Prime Lending Rate changed to	\N	10.25	2026-02-28 19:21:05.38
cmm6po2oh0003prmdnm1akd2z	cmm6po2ob0002prmdavgijz6a	0100-12-30 00:00:00	02 Jan Fuel Purchase Valley Motors BP 485442*1856 .02 710.83 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oh0004prmdp9pw3o8p	cmm6po2ob0002prmdavgijz6a	0310-01-02 00:00:00	06 Jan POS Purchase Suburban Motor Spar 485442*1856 .00 985.83 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi0005prmdomlf2e4t	cmm6po2ob0002prmdavgijz6a	0300-01-03 00:00:00	07 Jan Fuel Purchase Total Portlands C 485442*1856 .00 685.83 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi0006prmdon84k5nt	cmm6po2ob0002prmdavgijz6a	2032-01-09 00:00:00	.	\N	553.15	2026-02-28 19:25:32.178
cmm6po2oi0007prmdg2jhpn1w	cmm6po2ob0002prmdavgijz6a	0200-01-10 00:00:00	13 Jan Fuel Purchase Biz Afrika 693 Pty 485442*1856 .00 497.15 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi0008prmdjmd48yrs	cmm6po2ob0002prmdavgijz6a	0200-01-13 00:00:00	16 Jan Fuel Purchase Sasol Kommetjie 485442*1856 .00 602.15 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi0009prmdpy529gn0	cmm6po2ob0002prmdavgijz6a	0454-01-15 00:00:00	19 Jan POS Purchase Checkers Sunvalley 485442*1856 .00 7,979.65 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi000aprmd7c04may5	cmm6po2ob0002prmdavgijz6a	0300-01-18 00:00:00	21 Jan Fuel Purchase Cottage Diep River 485442*1856 .00 2,344.15 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi000bprmdm7m2aptn	cmm6po2ob0002prmdavgijz6a	0217-01-22 00:00:00	27 Jan POS Purchase Communica Cape Town 485442*1856 .50 366.65 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi000cprmdxc16g17j	cmm6po2ob0002prmdavgijz6a	0200-01-22 00:00:00	27 Jan Fuel Purchase Total Observatory C 485442*1856 .00 166.65 Cr	\N	3.68	2026-02-28 19:25:32.178
cmm6po2oi000dprmds55qi7y9	cmm6po2ob0002prmdavgijz6a	2049-01-30 00:00:00	.	\N	382.65	2026-02-28 19:25:32.178
cmm6po2oi000eprmdwf311az6	cmm6po2ob0002prmdavgijz6a	0191-01-30 00:00:00	.	\N	190.89	2026-02-28 19:25:32.178
cmm6rgsig000geb59l88ayxge	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6po2oi000fprmdho4kpi8f	cmm6po2ob0002prmdavgijz6a	2025-11-20 00:00:00	On , the Prime Lending Rate changed to	\N	10.25	2026-02-28 19:25:32.178
cmm6puqqt001ph0gaa6ja9j99	cmm6puqqq001oh0gavtz0fs6n	2025-11-20 00:00:00	On , the Prime Lending Rate changed to	\N	-10.25	2026-02-28 19:30:43.301
cmm6pw3hr001sh0gayw6civ9n	cmm6pw3ho001rh0gac59qa1c5	2025-11-20 00:00:00	On , the Prime Lending Rate changed to	\N	10.25	2026-02-28 19:31:46.479
cmm6q8g0a0003j1gflsakoygx	cmm6q8fz80002j1gfi80d1db4	2025-01-01 00:00:00	Bank Charges Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 19:41:22.57
cmm6q8g0a0004j1gfup42xx70	cmm6q8fz80002j1gfi80d1db4	2025-01-01 00:00:00	Charges Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 19:41:22.57
cmm6q8g0a0005j1gf08mku63v	cmm6q8fz80002j1gfi80d1db4	2025-01-01 00:00:00	Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 19:41:22.57
cmm6q8g0a0006j1gf1myz6l4i	cmm6q8fz80002j1gfi80d1db4	2025-01-02 00:00:00	ADT Cash Deposit Lngbeach Previous Ndlovu	\N	350.00	2026-02-28 19:41:22.57
cmm6q8g0a0007j1gf0ts5ku4r	cmm6q8fz80002j1gfi80d1db4	2025-01-04 00:00:00	ADT Cash Deposit 02478002 Izaya	\N	400.00	2026-02-28 19:41:22.57
cmm6q8g0a0008j1gf4mlyu35i	cmm6q8fz80002j1gfi80d1db4	2025-01-04 00:00:00	Internet Pmt To Balance Top 1774167832	\N	-165.00	2026-02-28 19:41:22.57
cmm6q8g0a0009j1gf22vsxyii	cmm6q8fz80002j1gfi80d1db4	2025-01-05 00:00:00	POS Purchase Suburban Motor Spar 485442*1856 03 Jan	\N	-310.00	2026-02-28 19:41:22.57
cmm6q8g0a000aj1gfiksjf70w	cmm6q8fz80002j1gfi80d1db4	2025-01-06 00:00:00	Fuel Purchase Total Portlands C 485442*1856 04 Jan	\N	-300.00	2026-02-28 19:41:22.57
cmm6q8g0a000bj1gf8av3zwvl	cmm6q8fz80002j1gfi80d1db4	2025-01-06 00:00:00	Digital Content Voucher 1Voucher 26010622312344	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000cj1gfgmdi0hxd	cmm6q8fz80002j1gfi80d1db4	2025-01-06 00:00:00	Digital Content Voucher 1Voucher 26010623242648	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000dj1gfsiryx92w	cmm6q8fz80002j1gfi80d1db4	2025-01-07 00:00:00	Digital Content Voucher 1Voucher 26010723483557	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000ej1gfpljqhtw8	cmm6q8fz80002j1gfi80d1db4	2025-01-08 00:00:00	Digital Content Voucher Ott Voucher 26010901564282	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000fj1gfqmf9h0sa	cmm6q8fz80002j1gfi80d1db4	2025-01-09 00:00:00	Digital Content Voucher 1Voucher 26011002524799	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000gj1gfaxqbpys9	cmm6q8fz80002j1gfi80d1db4	2025-01-09 00:00:00	Digital Content Voucher 1Voucher 2601100357481	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000hj1gfpg6l46lq	cmm6q8fz80002j1gfi80d1db4	2025-01-09 00:00:00	Payshap Credit T Harsant	\N	500.00	2026-02-28 19:41:22.57
cmm6q8g0a000ij1gferfuh9na	cmm6q8fz80002j1gfi80d1db4	2025-01-09 00:00:00	\N	\N	-32.68	2026-02-28 19:41:22.57
cmm6q8g0a000jj1gf6kn5201j	cmm6q8fz80002j1gfi80d1db4	2025-01-11 00:00:00	Digital Content Voucher 1Voucher 26011200190492	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000kj1gfo1xp43kx	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	Magtape Credit Investecpb15 Patrick	\N	250.00	2026-02-28 19:41:22.57
cmm6q8g0a000lj1gf6vqwuc90	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	\N	\N	-6.00	2026-02-28 19:41:22.57
cmm6q8g0a000mj1gf24nf5wtb	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	Fuel Purchase Biz Afrika 693 Pty 485442*1856 11 Jan	\N	-200.00	2026-02-28 19:41:22.57
cmm6q8g0a000nj1gfae3ohq77	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	Digital Content Voucher 1Voucher 26011223193269	\N	-20.00	2026-02-28 19:41:22.57
cmm6q8g0a000oj1gfgl142s7h	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	Digital Content Voucher 1Voucher 26011222430966	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000pj1gfz6j7jcpw	cmm6q8fz80002j1gfi80d1db4	2025-01-12 00:00:00	Digital Content Voucher 1Voucher 26011223002667	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a000qj1gf7voa193l	cmm6q8fz80002j1gfi80d1db4	2025-01-15 00:00:00	Payshap Credit T Harsant	\N	1325.00	2026-02-28 19:41:22.57
cmm6q8g0a000rj1gflr6n81qx	cmm6q8fz80002j1gfi80d1db4	2025-01-15 00:00:00	Payshap Account Off-Us Wages	\N	-800.00	2026-02-28 19:41:22.57
cmm6q8g0a000sj1gfiobtcfex	cmm6q8fz80002j1gfi80d1db4	2025-01-15 00:00:00	Fuel Purchase Sasol Kommetjie 485442*1856 14 Jan	\N	-200.00	2026-02-28 19:41:22.57
cmm6q8g0a000tj1gfp0kxesfz	cmm6q8fz80002j1gfi80d1db4	2025-01-16 00:00:00	FNB OB Pmt Mvs-Nhw	\N	8581.50	2026-02-28 19:41:22.57
cmm6q8g0a000uj1gf9eff75mx	cmm6q8fz80002j1gfi80d1db4	2025-01-16 00:00:00	Bank Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 19:41:22.57
cmm6q8g0a000vj1gft64gohw0	cmm6q8fz80002j1gfi80d1db4	2025-01-16 00:00:00	Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 19:41:22.57
cmm6q8g0a000wj1gfcl9p39w1	cmm6q8fz80002j1gfi80d1db4	2025-01-16 00:00:00	Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 19:41:22.57
cmm6q8g0a000xj1gfhatfi94d	cmm6q8fz80002j1gfi80d1db4	2025-01-16 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 19:41:22.57
cmm6q8g0a000yj1gfj69sb3wr	cmm6q8fz80002j1gfi80d1db4	2025-01-18 00:00:00	POS Purchase Checkers Sunvalley 485442*1856 16 Jan	\N	-454.00	2026-02-28 19:41:22.57
cmm6q8g0a000zj1gfd9y0i2fx	cmm6q8fz80002j1gfi80d1db4	2025-01-18 00:00:00	Digital Content Voucher 1Voucher 26011803081893	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0010j1gflvnvx259	cmm6q8fz80002j1gfi80d1db4	2025-01-19 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 19:41:22.57
cmm6q8g0a0011j1gfw4iytota	cmm6q8fz80002j1gfi80d1db4	2025-01-19 00:00:00	Digital Content Voucher 1Voucher 26012018312210	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0012j1gfpbdv9gtc	cmm6q8fz80002j1gfi80d1db4	2025-01-19 00:00:00	Digital Content Voucher 1Voucher 26011921194339	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0013j1gfo9rnco8t	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher 1Voucher 26012100400750	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0014j1gfl48v1xth	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher 26012100470450	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0015j1gfnd2tk8ff	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012100552550	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0016j1gf6h9f3gom	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher 1Voucher 26012101022051	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0017j1gfmsosyqe5	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012101074851	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0018j1gfc3wdf8hr	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher 1Voucher 26012101131451	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0a0019j1gf37te167n	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher 26012101243551	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001aj1gf2093fm6m	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012101374452	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001bj1gfv3ivqrch	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012102103352	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001cj1gfunm8xewl	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-200.00	2026-02-28 19:41:22.57
cmm6q8g0b001dj1gfjn4ced16	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001ej1gfbj7whefg	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Magtape Credit Fortune	\N	700.00	2026-02-28 19:41:22.57
cmm6q8g0b001fj1gf6m2wukos	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Magtape Credit Muirleniumtech	\N	1000.00	2026-02-28 19:41:22.57
cmm6q8g0b001gj1gfmstmo88f	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	POS Purchase Scoop Distribution- 485442*1856 19 Jan	\N	-4335.50	2026-02-28 19:41:22.57
cmm6q8g0b001hj1gfjdresnbv	cmm6q8fz80002j1gfi80d1db4	2025-01-20 00:00:00	Fuel Purchase Cottage Diep River 485442*1856 19 Jan	\N	-300.00	2026-02-28 19:41:22.57
cmm6q8g0b001ij1gfx5yhdp4t	cmm6q8fz80002j1gfi80d1db4	2025-01-21 00:00:00	Send Money App Dr Send Tendai Fuma Cell	\N	-1000.00	2026-02-28 19:41:22.57
cmm6q8g0b001jj1gfa1lfhfhv	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Payshap Account Off-Us Wages	\N	-300.00	2026-02-28 19:41:22.57
cmm6q8g0b001kj1gfrsktpfi9	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Digital Content Voucher 1Voucher 26012415512053	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001lj1gf9lpxoskp	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Digital Content Voucher 1Voucher 26012421280399	\N	-60.00	2026-02-28 19:41:22.57
cmm6q8g0b001mj1gfqhz5alho	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Digital Content Voucher Ott Voucher 26012321454144	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001nj1gfch4881up	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Digital Content Voucher 1Voucher 26012321592246	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001oj1gf5bnvmo1h	cmm6q8fz80002j1gfi80d1db4	2025-01-23 00:00:00	Digital Content Voucher 1Voucher 26012321321541	\N	-100.00	2026-02-28 19:41:22.57
cmm6q8g0b001pj1gfh41r8p6u	cmm6q8fz80002j1gfi80d1db4	2025-01-26 00:00:00	POS Purchase Communica Cape Town 485442*1856 23 Jan	\N	-217.50	2026-02-28 19:41:22.57
cmm6q8g0b001qj1gfadt58jg7	cmm6q8fz80002j1gfi80d1db4	2025-01-26 00:00:00	Fuel Purchase Total Observatory C 485442*1856 23 Jan	\N	-200.00	2026-02-28 19:41:22.57
cmm6q8g0b001rj1gfebjvgc2m	cmm6q8fz80002j1gfi80d1db4	2025-01-28 00:00:00	Magtape Credit Sharon Harsant	\N	1500.00	2026-02-28 19:41:22.57
cmm6q8g0b001sj1gfqn6mm9gr	cmm6q8fz80002j1gfi80d1db4	2025-01-29 00:00:00	Magtape Credit Andisiwe	\N	365.00	2026-02-28 19:41:22.57
cmm6q8g0b001tj1gf15d4m5yq	cmm6q8fz80002j1gfi80d1db4	2025-01-30 00:00:00	Payshap Account Off-Us Wages	\N	-1600.00	2026-02-28 19:41:22.57
cmm6q8g0b001uj1gf3le2kpex	cmm6q8fz80002j1gfi80d1db4	2025-01-30 00:00:00	\N	\N	-49.00	2026-02-28 19:41:22.57
cmm6q8g0b001vj1gffbdbpik1	cmm6q8fz80002j1gfi80d1db4	2025-01-30 00:00:00	\N	\N	-191.76	2026-02-28 19:41:22.57
cmm6qxmb6001phg42qmkaxvyd	cmm6qxmay001ohg427bomy4ye	2026-01-01 00:00:00	Bank Charges Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 20:00:57.139
cmm6qxmb6001qhg42hzaa2eru	cmm6qxmay001ohg427bomy4ye	2026-01-01 00:00:00	Charges Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 20:00:57.139
cmm6qxmb6001rhg42rbki7cub	cmm6qxmay001ohg427bomy4ye	2026-01-01 00:00:00	Fuel Purchase Valley Motors BP 485442*1856 31 Dec	\N	-100.02	2026-02-28 20:00:57.139
cmm6qxmb6001shg42nrf2mx2c	cmm6qxmay001ohg427bomy4ye	2026-01-02 00:00:00	ADT Cash Deposit Lngbeach Previous Ndlovu	\N	350.00	2026-02-28 20:00:57.139
cmm6qxmb6001thg42vok5cjtf	cmm6qxmay001ohg427bomy4ye	2026-01-04 00:00:00	ADT Cash Deposit 02478002 Izaya	\N	400.00	2026-02-28 20:00:57.139
cmm6qxmb6001uhg42v46qb45h	cmm6qxmay001ohg427bomy4ye	2026-01-04 00:00:00	Internet Pmt To Balance Top 1774167832	\N	-165.00	2026-02-28 20:00:57.139
cmm6qxmb6001vhg4275gz4ima	cmm6qxmay001ohg427bomy4ye	2026-01-05 00:00:00	POS Purchase Suburban Motor Spar 485442*1856 03 Jan	\N	-310.00	2026-02-28 20:00:57.139
cmm6qxmb7001whg42cw4ac97x	cmm6qxmay001ohg427bomy4ye	2026-01-06 00:00:00	Fuel Purchase Total Portlands C 485442*1856 04 Jan	\N	-300.00	2026-02-28 20:00:57.139
cmm6qxmb7001xhg42f5zyy1w2	cmm6qxmay001ohg427bomy4ye	2026-01-06 00:00:00	Digital Content Voucher 1Voucher 26010622312344	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7001yhg42oou9m6b9	cmm6qxmay001ohg427bomy4ye	2026-01-06 00:00:00	Digital Content Voucher 1Voucher 26010623242648	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7001zhg429027rcvh	cmm6qxmay001ohg427bomy4ye	2026-01-07 00:00:00	Digital Content Voucher 1Voucher 26010723483557	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70020hg42cl9mqnu8	cmm6qxmay001ohg427bomy4ye	2026-01-08 00:00:00	Digital Content Voucher Ott Voucher 26010901564282	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70021hg426cl1ntgs	cmm6qxmay001ohg427bomy4ye	2026-01-09 00:00:00	Digital Content Voucher 1Voucher 26011002524799	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70022hg42ex6xoq8n	cmm6qxmay001ohg427bomy4ye	2026-01-09 00:00:00	Digital Content Voucher 1Voucher 2601100357481	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70023hg4288upbz73	cmm6qxmay001ohg427bomy4ye	2026-01-09 00:00:00	Payshap Credit T Harsant	\N	500.00	2026-02-28 20:00:57.139
cmm6qxmb70024hg42v9m773dd	cmm6qxmay001ohg427bomy4ye	2026-01-09 00:00:00	\N	\N	-32.68	2026-02-28 20:00:57.139
cmm6qxmb70025hg42iftd95q4	cmm6qxmay001ohg427bomy4ye	2026-01-11 00:00:00	Digital Content Voucher 1Voucher 26011200190492	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70026hg42pzabe0ht	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	Magtape Credit Investecpb15 Patrick	\N	250.00	2026-02-28 20:00:57.139
cmm6qxmb70027hg42yzd8bvcl	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	\N	\N	-6.00	2026-02-28 20:00:57.139
cmm6qxmb70028hg425vj4oe11	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	Fuel Purchase Biz Afrika 693 Pty 485442*1856 11 Jan	\N	-200.00	2026-02-28 20:00:57.139
cmm6qxmb70029hg42beujhzko	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	Digital Content Voucher 1Voucher 26011223193269	\N	-20.00	2026-02-28 20:00:57.139
cmm6qxmb7002ahg42ufk0gy4n	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	Digital Content Voucher 1Voucher 26011222430966	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002bhg42dzfm2pda	cmm6qxmay001ohg427bomy4ye	2026-01-12 00:00:00	Digital Content Voucher 1Voucher 26011223002667	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002chg42pleoorc9	cmm6qxmay001ohg427bomy4ye	2026-01-15 00:00:00	Payshap Credit T Harsant	\N	1325.00	2026-02-28 20:00:57.139
cmm6qxmb7002dhg42wamotzkj	cmm6qxmay001ohg427bomy4ye	2026-01-15 00:00:00	Payshap Account Off-Us Wages	\N	-800.00	2026-02-28 20:00:57.139
cmm6qxmb7002ehg420ybtzum7	cmm6qxmay001ohg427bomy4ye	2026-01-15 00:00:00	Fuel Purchase Sasol Kommetjie 485442*1856 14 Jan	\N	-200.00	2026-02-28 20:00:57.139
cmm6qxmb7002fhg42vuaj6jjd	cmm6qxmay001ohg427bomy4ye	2026-01-16 00:00:00	FNB OB Pmt Mvs-Nhw	\N	8581.50	2026-02-28 20:00:57.139
cmm6qxmb7002ghg42nafe1ghp	cmm6qxmay001ohg427bomy4ye	2026-01-16 00:00:00	Bank Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:00:57.139
cmm6qxmb7002hhg425iz11mcv	cmm6qxmay001ohg427bomy4ye	2026-01-16 00:00:00	Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:00:57.139
cmm6qxmb7002ihg423efhkxw6	cmm6qxmay001ohg427bomy4ye	2026-01-16 00:00:00	Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:00:57.139
cmm6qxmb7002jhg42o37vk1wm	cmm6qxmay001ohg427bomy4ye	2026-01-16 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 20:00:57.139
cmm6qxmb7002khg42ghwj214p	cmm6qxmay001ohg427bomy4ye	2026-01-18 00:00:00	POS Purchase Checkers Sunvalley 485442*1856 16 Jan	\N	-454.00	2026-02-28 20:00:57.139
cmm6qxmb7002lhg42t49clvwo	cmm6qxmay001ohg427bomy4ye	2026-01-18 00:00:00	Digital Content Voucher 1Voucher 26011803081893	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002mhg427r9gx3pb	cmm6qxmay001ohg427bomy4ye	2026-01-19 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 20:00:57.139
cmm6qxmb7002nhg42vgpgwewc	cmm6qxmay001ohg427bomy4ye	2026-01-19 00:00:00	Digital Content Voucher 1Voucher 26012018312210	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002ohg42dbfwreuw	cmm6qxmay001ohg427bomy4ye	2026-01-19 00:00:00	Digital Content Voucher 1Voucher 26011921194339	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002phg42akmbcmjw	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher 1Voucher 26012100400750	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002qhg42kla19i56	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher 26012100470450	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002rhg423ddn9lqh	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012100552550	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002shg427mu9mt62	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher 1Voucher 26012101022051	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002thg422yb0ap7u	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012101074851	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002uhg42vtyb4ns0	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher 1Voucher 26012101131451	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002vhg421u34i6eq	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher 26012101243551	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002whg42fqmzezu0	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012101374452	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002xhg42cfpb7zlc	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher 26012102103352	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7002yhg42p7cy85w4	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-200.00	2026-02-28 20:00:57.139
cmm6qxmb7002zhg429onmxqyl	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70030hg42earxxuxs	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Magtape Credit Fortune	\N	700.00	2026-02-28 20:00:57.139
cmm6qxmb70031hg42ut5uj4dg	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Magtape Credit Muirleniumtech	\N	1000.00	2026-02-28 20:00:57.139
cmm6qxmb70032hg42fwrs6ehu	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	POS Purchase Scoop Distribution- 485442*1856 19 Jan	\N	-4335.50	2026-02-28 20:00:57.139
cmm6qxmb70033hg424gx0ijta	cmm6qxmay001ohg427bomy4ye	2026-01-20 00:00:00	Fuel Purchase Cottage Diep River 485442*1856 19 Jan	\N	-300.00	2026-02-28 20:00:57.139
cmm6qxmb70034hg422gpzuxsv	cmm6qxmay001ohg427bomy4ye	2026-01-21 00:00:00	Send Money App Dr Send Tendai Fuma Cell	\N	-1000.00	2026-02-28 20:00:57.139
cmm6qxmb70035hg42lklp1sgn	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Payshap Account Off-Us Wages	\N	-300.00	2026-02-28 20:00:57.139
cmm6qxmb70036hg42cqqdlua8	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Digital Content Voucher 1Voucher 26012415512053	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70037hg42za164sg5	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Digital Content Voucher 1Voucher 26012421280399	\N	-60.00	2026-02-28 20:00:57.139
cmm6qxmb70038hg4277orzotp	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Digital Content Voucher Ott Voucher 26012321454144	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb70039hg42s1fshaym	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Digital Content Voucher 1Voucher 26012321592246	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7003ahg42bhqr0bam	cmm6qxmay001ohg427bomy4ye	2026-01-23 00:00:00	Digital Content Voucher 1Voucher 26012321321541	\N	-100.00	2026-02-28 20:00:57.139
cmm6qxmb7003bhg42b3sde9gd	cmm6qxmay001ohg427bomy4ye	2026-01-26 00:00:00	POS Purchase Communica Cape Town 485442*1856 23 Jan	\N	-217.50	2026-02-28 20:00:57.139
cmm6qxmb7003chg42gfkdc07a	cmm6qxmay001ohg427bomy4ye	2026-01-26 00:00:00	Fuel Purchase Total Observatory C 485442*1856 23 Jan	\N	-200.00	2026-02-28 20:00:57.139
cmm6qxmb7003dhg427t2w4uqk	cmm6qxmay001ohg427bomy4ye	2026-01-28 00:00:00	Magtape Credit Sharon Harsant	\N	1500.00	2026-02-28 20:00:57.139
cmm6qxmb7003ehg42o76irzoa	cmm6qxmay001ohg427bomy4ye	2026-01-29 00:00:00	Magtape Credit Andisiwe	\N	365.00	2026-02-28 20:00:57.139
cmm6qxmb7003fhg42dlouisxs	cmm6qxmay001ohg427bomy4ye	2026-01-30 00:00:00	Payshap Account Off-Us Wages	\N	-1600.00	2026-02-28 20:00:57.139
cmm6qxmb7003ghg42b6icb7mx	cmm6qxmay001ohg427bomy4ye	2026-01-30 00:00:00	\N	\N	-49.00	2026-02-28 20:00:57.139
cmm6qxmb7003hhg42cueu56l1	cmm6qxmay001ohg427bomy4ye	2026-01-30 00:00:00	\N	\N	-191.76	2026-02-28 20:00:57.139
cmm6r7dew003nhg42v5g2wdjv	cmm6r7dep003mhg42jq6c6jcw	2026-01-22 00:00:00	YOCO *PAHAR 5222*2828 CREDIT TRANSFER	\N	-3000.00	2026-02-28 20:08:32.168
cmm6r7dew003ohg42aexwi9qq	cmm6r7dep003mhg42jq6c6jcw	2026-01-27 00:00:00	BUCO LONGBEAC 5222*2828 IB PAYMENT TO	\N	-5100.00	2026-02-28 20:08:32.168
cmm6r7dew003phg42pzho806p	cmm6r7dep003mhg42jq6c6jcw	2026-01-28 00:00:00	S2S*ABDILAYEK 5222*2828 CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:08:32.168
cmm6r7dew003qhg424r6k0u73	cmm6r7dep003mhg42jq6c6jcw	2026-01-28 00:00:00	SASOL KOMMETJ 5222*2828 CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:08:32.168
cmm6r7dew003rhg42co8y5zll	cmm6r7dep003mhg42jq6c6jcw	2026-01-28 00:00:00	SCOOP DISTRIB 5222*2828 VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:08:32.168
cmm6r7dew003shg42hmb0vti9	cmm6r7dep003mhg42jq6c6jcw	2026-01-29 00:00:00	BUCO SIMONSTO 5222*2828 AUTOBANK CASH DEPOSIT	\N	-270.00	2026-02-28 20:08:32.168
cmm6r7dew003thg4215h4xg6s	cmm6r7dep003mhg42jq6c6jcw	2026-01-30 00:00:00	CHECKERS SUNV 5222*2828 CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:08:32.168
cmm6r7dew003uhg42weogavpj	cmm6r7dep003mhg42jq6c6jcw	2026-01-30 00:00:00	LIQUORSHOP SU 5222*2828 AUTOBANK CASH DEPOSIT	\N	-550.00	2026-02-28 20:08:32.168
cmm6r7dew003vhg42s30j707x	cmm6r7dep003mhg42jq6c6jcw	2026-01-31 00:00:00	0000H259 T18:11:29 52 CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 20:08:32.168
cmm6r7dew003whg42rfm8rkxk	cmm6r7dep003mhg42jq6c6jcw	2026-02-13 00:00:00	ASTRON ENERGY 5222*2828 CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:08:32.168
cmm6r7dew003xhg420b5e6y8t	cmm6r7dep003mhg42jq6c6jcw	2026-02-13 00:00:00	HPY*FISH AND 5222*2828 CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:08:32.168
cmm6r7dew003yhg4217nm0rhi	cmm6r7dep003mhg42jq6c6jcw	2026-02-13 00:00:00	SPAR FISH HOE 5222*2828 VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:08:32.168
cmm6r7dew003zhg42lz8jma49	cmm6r7dep003mhg42jq6c6jcw	2026-02-15 00:00:00	SHELL KOMMETJ 5222*2828 VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 20:08:32.168
cmm6r7dew0040hg42d0ve6mn4	cmm6r7dep003mhg42jq6c6jcw	2026-02-18 00:00:00	HPY*FISH AND 5222*2828 PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 20:08:32.168
cmm6rgsig0002eb59hn3jg2g5	cmm6rgshb0001eb59vx9pgml9	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER	\N	3000.00	2026-02-28 20:15:51.637
cmm6rgsig0003eb59j28u812t	cmm6rgshb0001eb59vx9pgml9	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 20:15:51.637
cmm6rgsig0004eb59uj96hml0	cmm6rgshb0001eb59vx9pgml9	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	3000.00	2026-02-28 20:15:51.637
cmm6rgsig0005eb59vqcabtxj	cmm6rgshb0001eb59vx9pgml9	2026-01-23 00:00:00	Month-end Balance R Details Service Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	6335.06	2026-02-28 20:15:51.637
cmm6rgsig0006eb598cvn1k6n	cmm6rgshb0001eb59vx9pgml9	2026-01-23 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	24410.89	2026-02-28 20:15:51.637
cmm6rgsig0007eb59d9qpzcyo	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsig0008eb59xrs1xbw5	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsig0009eb59vt5m3w1z	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsig000aeb59nrruppjb	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000beb59r141ez9z	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000ceb59z0wq158q	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000deb59hxb3vklh	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000eeb59hrg73pyx	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000feb59p4atg5zq	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsig000heb594iwpd3uq	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BETWAY	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsig000ieb59lul58uyf	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BETWAY FEE: VOUCHER ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsig000jeb59hfrv0swl	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BETWAY FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsig000keb59j0i7evm4	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000leb59k51pw7jo	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000meb594gu833b6	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ## - PAYSHAP PAYMENT FROM BETWAY	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000neb59udil892b	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000oeb59q3cv463j	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000peb59fjb2rrwo	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM BETWAY	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000qeb59274l8jel	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM BETWAY VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000reb59kxs5d0mk	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000seb59i9e1ms9l	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000teb59tm2pbcrz	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000ueb593zwgo3mi	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000veb59ruonyk6j	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000web59aktnlxjv	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig000xeb591fzs2l8f	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000yeb59m6u6j4o5	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig000zeb59vx8v0nay	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0010eb59ln8b6nv9	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0011eb59lf2297fr	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0012eb59la24n4d0	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER -- of --	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig0013eb59trbmnhxz	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER -- of -- BLUE ROUTE	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsig0014eb59i8c2ihoc	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	628.24	2026-02-28 20:15:51.637
cmm6rgsig0015eb59mzbxkjwg	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0016eb59kb5qqwk4	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0017eb59xk3trnec	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - PREPAID MOBILE PURCHASE - VAS VODA	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsig0018eb59b0ujaczy	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsih0019eb59np0ums9g	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsih001aeb598swa87y7	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsih001beb59xxi90gse	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001ceb59g2tyfepm	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001deb59xthqqsq2	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001eeb593z9iziee	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE - YOCO *PAHAR * JAN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001feb59cwu6usmq	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	CHEQUE CARD PURCHASE -	\N	-260.00	2026-02-28 20:15:51.637
cmm6rgsih001geb59qd3syem5	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	CHEQUE CARD PURCHASE - YOCO *PAHAR * JAN	\N	-260.00	2026-02-28 20:15:51.637
cmm6rgsih001heb59ukcamk65	cmm6rgshb0001eb59vx9pgml9	2026-01-25 00:00:00	CHEQUE CARD PURCHASE - YOCO *PAHAR * JAN CREDIT TRANSFER	\N	-260.00	2026-02-28 20:15:51.637
cmm6rgsih001ieb59xa5cj8zl	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsih001jeb59ql3ytmba	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsih001keb59shvu1siz	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsih001leb59u6mesjtq	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsih001meb59vlh6mblx	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsih001neb59sceb0pmg	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih001oeb59lwm73le8	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih001peb59a34zk0zp	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih001qeb59fn6tu2bk	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001reb59igs1zvlh	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001seb59x75gzyjp	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001teb594sheub1m	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001ueb593ivfn2lr	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001veb59tz5f4ber	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS -- of --	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih001web59nbzi9ykw	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS HOLLYWOODBETS -- of -- BLUE ROUTE	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih001xeb59571ohvy9	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	2435.69	2026-02-28 20:15:51.637
cmm6rgsih001yeb590j9kn50j	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih001zeb59rb3k676j	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih0020eb59ao7m5cig	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih0021eb59lzu6pvlu	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih0022eb598i2sk3dr	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih0023eb5992zqf35f	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih0024eb59tn583tek	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih0025eb59j7irkjj9	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih0026eb598tdlj6o6	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih0027eb592h7pns75	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsih0028eb599bbawxrj	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsih0029eb59blwmw7yt	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsih002aeb59gbyd4wtd	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih002beb59834up6ir	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih002ceb5922alb0f3	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih002deb59v8t670mw	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsih002eeb59taopm1o0	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsih002feb59g1r635xm	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsih002geb593jqlvlih	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsih002heb59tlot8s9b	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	H FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002ieb59vr1c1bbx	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002jeb59uyiv1p7b	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	H FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002keb593wf7ozmn	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002leb595cscv10j	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002meb59dufbbxew	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002neb59kmsmooda	cmm6rgshb0001eb59vx9pgml9	2026-01-26 00:00:00	FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE - VAS	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsih002oeb59l8f0r844	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	H ELECTRICITY PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002peb59ulroxhjs	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	H ELECTRICITY PURCHASE - VAS	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002qeb59vsqw6veb	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	H ELECTRICITY PURCHASE - VAS FEE: ELECTRICITY PURCHASE ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002reb59uih181gi	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	ELECTRICITY PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002seb59ysjfe5im	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	ELECTRICITY PURCHASE - VAS	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002teb594z47b77r	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	ELECTRICITY PURCHASE - VAS FEE: ELECTRICITY PURCHASE ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsih002ueb5955rqny77	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih002veb59lcj89qh2	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## - EDIT TRANSFER	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih002web5935q67cw0	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## - EDIT TRANSFER CAPITEC S WILLIAMS	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih002xeb59t8xbg7z0	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ## -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih002yeb5997izvvk1	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ## - EDIT TRANSFER	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih002zeb59pkrm6bkx	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ## - EDIT TRANSFER CAPITEC S WILLIAMS	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsih0030eb593chacaft	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO -	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsih0031eb59xuinajgr	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO - JOSEPH JOZE	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsih0032eb59s4rtz1b9	cmm6rgshb0001eb59vx9pgml9	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO - JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsih0033eb59ppwd0y3r	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsih0034eb598bcxxkis	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE - VAS VODA	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsih0035eb59bednp53k	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsih0036eb598huunxyk	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsih0037eb59jgdwsrp1	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsih0038eb590z05mvsl	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih0039eb59dwh3voja	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih003aeb59nckk1wtr	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih003beb59og4zg0bc	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih003ceb59ldwarb3f	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - CELLPHONE INSTANTMON CASH TO -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih003deb59iakk6e9g	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - CELLPHONE INSTANTMON CASH TO -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsih003eeb59v92cqr5o	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsih003feb5950k30rby	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsih003geb59ve1m41mg	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsih003heb59ytp12iua	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003ieb59g6swkfj9	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H FEE - INSTANT MONEY ## - -- of --	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003jeb59tgrnl6al	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003keb59j12rivfb	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003leb59wh0esi74	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE - INSTANT MONEY ## - -- of --	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003meb59fpdbis0z	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003neb59zceiqlkr	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsih003oeb59g81lw2sn	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H IB PAYMENT TO -	\N	6710.79	2026-02-28 20:15:51.637
cmm6rgsih003peb591thmnm0t	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H IB PAYMENT TO -	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003qeb59ax83e8cf	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H IB PAYMENT TO - PATRICK RENT	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003reb59m35kg2hj	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	H IB PAYMENT TO - PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003seb59epcjacrc	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	IB PAYMENT TO -	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003teb59xg4zve9a	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	IB PAYMENT TO - PATRICK RENT	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003ueb59a49qhcuj	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	IB PAYMENT TO - PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5050.00	2026-02-28 20:15:51.637
cmm6rgsih003veb59774e0bm6	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsih003web59d0u64jep	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## - AUTOBANK CASH DEPOSIT	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsih003xeb59br5kbg65	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsih003yeb59l0cyycy1	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - AUTOBANK CASH DEPOSIT	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsih003zeb59snuq510c	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT FEE - AUTOBANK ## -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsih0040eb597zd7g5c8	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsih0041eb59qau8lt4n	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsih0042eb594tdo0ejz	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsih0043eb59vbr05kf2	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER ISAAC MUGWAGWA	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsih0044eb59hl9mi368	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	S S*ABDILAYEK * CHEQUE CARD PURCHASE -	\N	-158.39	2026-02-28 20:15:51.637
cmm6rgsih0045eb59wel9rczy	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	S S*ABDILAYEK * CHEQUE CARD PURCHASE - BUCO LONGBEAC * JAN	\N	-158.39	2026-02-28 20:15:51.637
cmm6rgsih0046eb59p941pnnd	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	SASOL KOMMETJ * CHEQUE CARD PURCHASE -	\N	-969.45	2026-02-28 20:15:51.637
cmm6rgsih0047eb592qje8u91	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	SASOL KOMMETJ * CHEQUE CARD PURCHASE - SCOOP DISTRIB * JAN	\N	-969.45	2026-02-28 20:15:51.637
cmm6rgsih0048eb596zpngwez	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsih0049eb59ovrla0qo	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE - VAS VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii004aeb594j66ki7e	cmm6rgshb0001eb59vx9pgml9	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii004beb59bhkupukp	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER -	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004ceb59fbtvo046	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER - SBIB-MOBI FUN	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004deb59xilcmim7	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER - SBIB-MOBI FUN FEE - DEBIT ORDER ## -	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004eeb5931q6u1ce	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER -	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004feb594ixdii5c	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER - SBIB-MOBI FUN	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004geb5938dbrnxw	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER - SBIB-MOBI FUN FEE - DEBIT ORDER ## -	\N	-202.47	2026-02-28 20:15:51.637
cmm6rgsii004heb59726bemb5	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	SBIB-MOBI FUN FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsii004ieb5988rlqs2y	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	SBIB-MOBI FUN FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsii004jeb59w9ne29v9	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsii004keb59x05w5v9j	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsii004leb591zotl995	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE - S S*ABDILAYEK * JAN	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsii004meb59i5arf5na	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE -	\N	-142.00	2026-02-28 20:15:51.637
cmm6rgsii004neb59zv1n66jn	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE - S S*ABDILAYEK * JAN	\N	-142.00	2026-02-28 20:15:51.637
cmm6rgsii004oeb59wj3iojco	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE - S S*ABDILAYEK * JAN CHEQUE CARD PURCHASE -	\N	-142.00	2026-02-28 20:15:51.637
cmm6rgsii004peb593tappdwt	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE -	\N	-158.39	2026-02-28 20:15:51.637
cmm6rgsii004qeb59i5u3tude	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE - BUCO LONGBEAC * JAN	\N	-158.39	2026-02-28 20:15:51.637
cmm6rgsii004reb5915w0oh2i	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CHEQUE CARD PURCHASE - BUCO LONGBEAC * JAN IB PAYMENT TO -	\N	-158.39	2026-02-28 20:15:51.637
cmm6rgsii004seb59s15oec8d	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	IB PAYMENT TO -	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsii004teb5908u1smau	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	IB PAYMENT TO - JOSEPH JOZE	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsii004ueb59ki77b4nq	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	IB PAYMENT TO - JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5100.00	2026-02-28 20:15:51.637
cmm6rgsii004veb59i0bbkmy9	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsii004web593r82m056	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## - VOUCHER PURCHASE -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsii004xeb59ne27du6i	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsii004yeb59nsh576ss	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - VOUCHER PURCHASE -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsii004zeb59h3gdiao6	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0050eb59ojc8bjfi	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0051eb59fv5uq6s3	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0052eb59by1zgdxf	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0053eb59jmh55tot	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0054eb59c5ih0bh6	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0055eb59sva2kyd6	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0056eb59rb1qbtyg	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0057eb59oej76vv8	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0058eb59hjm9iuuq	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0059eb59muxnjnyt	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005aeb59tcrdf5ca	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii005beb59u8ze4ws9	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005ceb590qfnnbda	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005deb59mzytu5jl	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005eeb59gbtk2w4y	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005feb59sul7ozi8	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	JULIET CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii005geb59mcbaioa2	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	JULIET CASH DEPOSIT FEE - AUTOBANK ## - VOUCHER PURCHASE -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii005heb59d4c1gx6j	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii005ieb59wwycxzlu	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - VOUCHER PURCHASE -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii005jeb5904pq9716	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 20:15:51.637
cmm6rgsii005keb59g34ldrxw	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 20:15:51.637
cmm6rgsii005leb59bpjnuspx	cmm6rgshb0001eb59vx9pgml9	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	270.00	2026-02-28 20:15:51.637
cmm6rgsii005meb59m5zo81zv	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii005neb59xiynmlnh	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii005oeb5978qlrvaq	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii005peb598ij9kvtw	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii005qeb59k27lkq2t	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005reb59nw8fmxj3	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005seb599njmxmjb	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005teb59wg17ez2d	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005ueb59bs9rb4kl	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE - SASOL KOMMETJ * JAN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii005veb598g7wbd78	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii005web59xvbq8mxp	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE - SASOL KOMMETJ * JAN	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii005xeb59lwbzufhx	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE - SASOL KOMMETJ * JAN CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii005yeb594148dldc	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE -	\N	-969.45	2026-02-28 20:15:51.637
cmm6rgsii005zeb59018m3g9w	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE - SCOOP DISTRIB * JAN	\N	-969.45	2026-02-28 20:15:51.637
cmm6rgsii0060eb597b5qpceo	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHEQUE CARD PURCHASE - SCOOP DISTRIB * JAN VOUCHER PURCHASE -	\N	-969.45	2026-02-28 20:15:51.637
cmm6rgsii0061eb59ppg30pqg	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii0062eb59eiqmobdk	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii0063eb59lxins3is	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii0064eb59tau74snr	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii0065eb59b8yyw9gl	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0066eb59pfc65eq0	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0067eb59nfevj2hy	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM BET ZQTZSDKDQJI WF	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii0068eb59il0beph8	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT FEE - AUTOBANK ## -	\N	59.40	2026-02-28 20:15:51.637
cmm6rgsii0069eb59nneri59c	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT FEE - AUTOBANK ## - PAYSHAP PAYMENT FROM	\N	59.40	2026-02-28 20:15:51.637
cmm6rgsii006aeb59fzj3b8rw	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	59.40	2026-02-28 20:15:51.637
cmm6rgsii006beb59k22erbxv	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - PAYSHAP PAYMENT FROM	\N	59.40	2026-02-28 20:15:51.637
cmm6rgsii006ceb59hgbz0mrk	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006deb592dgukuie	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT FEE - AUTOBANK ## - VOUCHER PURCHASE -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006eeb59mdhfio1k	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006feb59z6ly3ogk	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - VOUCHER PURCHASE -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006geb59w9qa85na	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii006heb59sqy043xf	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006ieb59ddc4qear	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006jeb59s85rol06	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006keb599fgyn8yr	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006leb596fv21zt9	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006meb59gvlhvky3	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsii006neb59qmbu1sj4	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006oeb59vqynnxtt	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006peb597stsfq45	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT AUXILIA	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006qeb59dxzlzcnt	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT AUXILIA CASH DEPOSIT FEE - AUTOBANK ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii006reb59245cnand	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006seb59l598zpke	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT FEE - AUTOBANK ## - MONTHLY MANAGEMENT FEE ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006teb59o4t6nsw0	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - MONTHLY MANAGEMENT FEE ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsii006ueb5967yxjvzy	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ## -	\N	-7.50	2026-02-28 20:15:51.637
cmm6rgsii006veb59cpx0lnel	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ## - VOUCHER PURCHASE -	\N	-7.50	2026-02-28 20:15:51.637
cmm6rgsii006web59rvui4kiy	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-7.50	2026-02-28 20:15:51.637
cmm6rgsii006xeb59d8pr6dhn	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHECKERS SUNV * CHEQUE CARD PURCHASE -	\N	-191.29	2026-02-28 20:15:51.637
cmm6rgsii006yeb59u643bxst	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	CHECKERS SUNV * CHEQUE CARD PURCHASE - LIQUORSHOP SU * JAN	\N	-191.29	2026-02-28 20:15:51.637
cmm6rgsii006zeb598fdbdlql	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 20:15:51.637
cmm6rgsii0070eb59wq9k13ra	cmm6rgshb0001eb59vx9pgml9	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 20:15:51.637
cmm6rgsii0071eb59sepnmdym	cmm6rgshb0001eb59vx9pgml9	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## -	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsii0072eb59s0nqlmdl	cmm6rgshb0001eb59vx9pgml9	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## - IB PAYMENT TO -	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsii0073eb59almy93gp	cmm6rgshb0001eb59vx9pgml9	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## - IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsii0074eb59i6elthpw	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0075eb59skpulcsz	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0076eb59q1p6kufh	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER -- of --	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0077eb59ztqk68no	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER -- of -- BLUE ROUTE	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsii0078eb599mqgkf2f	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	6235.06	2026-02-28 20:15:51.637
cmm6rgsii0079eb59wrsu7a6w	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsii007aeb59j7lr0wj6	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007beb59u7n94yzv	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007ceb592zmw5o0n	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007deb5926bb8prd	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsij007eeb59drokyjga	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsij007feb59bdsfs6l7	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007geb59pw3cwmkv	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007heb59itlcvfsr	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007ieb590kfwn8km	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT SHELLA	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007jeb594o3ka174	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT SHELLA CASH DEPOSIT FEE - AUTOBANK ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij007keb59l8v6elwf	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	SHELLA CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij007leb59xro6a0kq	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	SHELLA CASH DEPOSIT FEE - AUTOBANK ## - IB PAYMENT TO -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij007meb590h8qvbif	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij007neb59wwc54ulb	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - IB PAYMENT TO -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij007oeb59c4av6u1p	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - IB PAYMENT TO - NURAAN SASMAAN	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij007peb59lourueal	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO -	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij007qeb59cf1xfaez	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - NURAAN SASMAAN	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij007reb595wtxf6q3	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij007seb59oi1guz0m	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij007teb590emv92lg	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij007ueb597y5aqggc	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - IB PAYMENT TO -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij007veb59fbpeqmny	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO -	\N	-915.00	2026-02-28 20:15:51.637
cmm6rgsij007web59gfir3j52	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - WIZA SOLUTIONS WIFI	\N	-915.00	2026-02-28 20:15:51.637
cmm6rgsij007xeb59upfs0qhd	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - WIZA SOLUTIONS WIFI FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-915.00	2026-02-28 20:15:51.637
cmm6rgsij007yeb593ec1hgn9	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	WIZA SOLUTIONS WIFI FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij007zeb59akltj9m7	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij0080eb59u0z2uder	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-2700.00	2026-02-28 20:15:51.637
cmm6rgsij0081eb599ac3vb91	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-2700.00	2026-02-28 20:15:51.637
cmm6rgsij0082eb59dsgscxsy	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsij0083eb59sw3q32q0	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE UNLOAD FROM VIRTUAL CARD	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsij0084eb59qbuvqgh4	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsij0085eb59fv506s70	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsij0086eb59e7us22tw	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsij0087eb59j6cnvfsb	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij0088eb59or66byji	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij0089eb5988xlb65b	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008aeb591up50442	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM SD	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008beb59v418dumc	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM SD AUTOBANK CASH WITHDRAWAL AT -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008ceb59w8dgve52	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT -	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008deb59w0vmal0h	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT - H - - T : :	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008eeb592wn6o432	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT - H - - T : : CASH WITHDRAWAL FEE ## -	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008feb59rbguhobs	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT -	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008geb5976rsj6yw	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT - H - - T : :	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008heb595mh2g6am	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT - H - - T : : CASH WITHDRAWAL FEE ## -	\N	-8000.00	2026-02-28 20:15:51.637
cmm6rgsij008ieb59j1yy4izh	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ## -	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsij008jeb59eebotm4e	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ## - IB PAYMENT TO -	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsij008keb5958arjgls	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ## - IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:15:51.637
cmm6rgsij008leb59d0qlb8pm	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO -	\N	-1900.00	2026-02-28 20:15:51.637
cmm6rgsij008meb59nqoxmmuk	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-1900.00	2026-02-28 20:15:51.637
cmm6rgsij008neb59m3advfya	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	IB PAYMENT TO - PJOHN SHEDZA RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1900.00	2026-02-28 20:15:51.637
cmm6rgsij008oeb593nev253h	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	PJOHN SHEDZA RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij008peb59ss16nqeb	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	576.20	2026-02-28 20:15:51.637
cmm6rgsij008qeb59alejrc2z	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsij008reb596jnpxlpl	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsij008seb59iftjcx0k	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008teb59svxqxqrm	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008ueb59fcjtl23y	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij008veb59w4g7rbmj	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij008web59p20096d8	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij008xeb593llv8om4	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij008yeb590mwod53t	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij008zeb594mozny5o	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij0090eb597nyy7qoo	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE - BUCO SIMONSTO * JAN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij0091eb5974fiay5n	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CHEQUE CARD PURCHASE -	\N	-99.99	2026-02-28 20:15:51.637
cmm6rgsij0092eb590coow6r9	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CHEQUE CARD PURCHASE - BUCO SIMONSTO * JAN	\N	-99.99	2026-02-28 20:15:51.637
cmm6rgsij0093eb59vwbct9id	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CHEQUE CARD PURCHASE - BUCO SIMONSTO * JAN AUTOBANK CASH DEPOSIT	\N	-99.99	2026-02-28 20:15:51.637
cmm6rgsij0094eb59iv9hju02	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsij0095eb59mzfaoxee	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT FEE - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsij0096eb59drh28z2u	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsij0097eb59xeqxcfu7	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsij0098eb59pyhulcxt	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij0099eb59pm4rxm3s	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij009aeb59m2406du6	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij009beb594rcmc0l4	cmm6rgshb0001eb59vx9pgml9	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER SOSO	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsij009ceb59dz95u9nl	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsij009deb59j6ylov8j	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsij009eeb59va2sggru	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsij009feb59x3gotr75	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsij009geb59n4na5na2	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsij009heb59ivctjrog	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsij009ieb59sy0aw0ts	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsij009jeb59ocx2orfz	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsij009keb59ms9rrs98	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009leb59qdmpiw6a	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009meb59mhj5pqwh	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009neb59p46au5xa	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009oeb59zg6nqouc	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009peb590b2o3wee	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009qeb59b5dvo0kt	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009reb59meihc5nx	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM MIKE MWIWA WIFI	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsij009seb59cw4b6abj	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	WAGES IB PAYMENT TO -	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009teb599zp64yva	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	WAGES IB PAYMENT TO - BLUEDOG TECHNOLOGY	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009ueb59gue3jfge	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	WAGES IB PAYMENT TO - BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009veb59rfjnc8ai	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	IB PAYMENT TO -	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009web59bjo3kt8h	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	IB PAYMENT TO - BLUEDOG TECHNOLOGY	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009xeb594xjv58j4	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	IB PAYMENT TO - BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1400.00	2026-02-28 20:15:51.637
cmm6rgsij009yeb595wfp21x0	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij009zeb5932qihgs5	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij00a0eb59vr8g0ccl	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsij00a1eb596mlzt2t8	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij00a2eb592evv080n	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij00a3eb59z7c9vc1t	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2000.00	2026-02-28 20:15:51.637
cmm6rgsij00a4eb59ednqxd38	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	H FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij00a5eb59p0qh1a26	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	H FEE - INSTANT MONEY ## - -- of --	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij00a6eb59jebcy5oo	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	H FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij00a7eb590voqfs37	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsij00a8eb59d6guu0ij	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE - INSTANT MONEY ## - -- of --	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00a9eb59gcctn755	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00aaeb5925wb9ubw	cmm6rgshb0001eb59vx9pgml9	2026-02-02 00:00:00	FEE - INSTANT MONEY ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00abeb59t0lsbhd6	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsik00aceb596n9w66j3	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsik00adeb59gyrydmy6	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsik00aeeb59zv2epxen	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:15:51.637
cmm6rgsik00afeb59bgs8d6uy	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-115.00	2026-02-28 20:15:51.637
cmm6rgsik00ageb591x8qaq1j	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - LOTTERY PURCHASE -	\N	-115.00	2026-02-28 20:15:51.637
cmm6rgsik00aheb595j2j7xba	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - LOTTERY PURCHASE - VAS POWERBALL	\N	-115.00	2026-02-28 20:15:51.637
cmm6rgsik00aieb59ccthv1v7	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00ajeb59xkiamjze	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00akeb59929cq6d8	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE - VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsik00aleb59o5xo2o11	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00ameb59yj5y9dqt	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aneb59z1jfii5z	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aoeb590jsw0bay	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00apeb59ztfjku5c	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aqeb59qsd73v7c	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsik00areb59dv0fhyu7	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE - VAS LOTTO	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsik00aseb59c5731tor	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	LOTTERY PURCHASE - VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsik00ateb59chgzieio	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aueb59rurqap1q	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aveb59pgkhrne9	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00aweb59hgtl5gpg	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00axeb59abf80vdo	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00ayeb593ardtb4e	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00azeb596kma16qg	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00b0eb590ndc2t4r	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b1eb59viq2pkjk	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b2eb599ddjddu4	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b3eb59qqxy9lyh	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b4eb59u1tv9khr	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b5eb59kk8y4tdb	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b6eb59n0ep1vw3	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b7eb597riqen0e	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b8eb59j3vmgwnq	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00b9eb59etpy7ua4	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00baeb59shvttotj	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bbeb59iebb7fr1	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bceb59840sysv8	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bdeb59rm1nrtm9	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	7598.26	2026-02-28 20:15:51.637
cmm6rgsik00beeb590tltqfrs	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bfeb59jski1fn3	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bgeb59dpr1je99	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00bheb59j0e930mf	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsik00bieb59d5wkm3np	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsik00bjeb59uy4e5v84	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsik00bkeb59huhiqhck	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsik00bleb59ma8nd7xo	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsik00bmeb59xx27k22u	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE UNLOAD FROM VIRTUAL CARD	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsik00bneb59ikuk098l	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE -	\N	-149.98	2026-02-28 20:15:51.637
cmm6rgsik00boeb59gtmys8dl	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE - CHECKERS SUNV * JAN	\N	-149.98	2026-02-28 20:15:51.637
cmm6rgsik00bpeb59rlvcaf41	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE - CHECKERS SUNV * JAN CHEQUE CARD PURCHASE -	\N	-149.98	2026-02-28 20:15:51.637
cmm6rgsik00bqeb59kyn5ahr0	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE -	\N	-191.29	2026-02-28 20:15:51.637
cmm6rgsik00breb596t73l4g4	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE - LIQUORSHOP SU * JAN	\N	-191.29	2026-02-28 20:15:51.637
cmm6rgsik00bseb599q9rvrvk	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CHEQUE CARD PURCHASE - LIQUORSHOP SU * JAN AUTOBANK CASH DEPOSIT	\N	-191.29	2026-02-28 20:15:51.637
cmm6rgsik00bteb59qoesrhvi	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT FEE - AUTOBANK ## -	\N	10.80	2026-02-28 20:15:51.637
cmm6rgsik00bueb59sbsfnekj	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT FEE - AUTOBANK ## - LOTTERY WINNINGS	\N	10.80	2026-02-28 20:15:51.637
cmm6rgsik00bveb59k5nv4uky	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	10.80	2026-02-28 20:15:51.637
cmm6rgsik00bweb59xmvghlci	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - LOTTERY WINNINGS	\N	10.80	2026-02-28 20:15:51.637
cmm6rgsik00bxeb59h0xfd3kq	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - LOTTERY WINNINGS VAS	\N	10.80	2026-02-28 20:15:51.637
cmm6rgsik00byeb59vyh4l7u2	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT FEE - AUTOBANK ## -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsik00bzeb59vwjtp8fd	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT FEE - AUTOBANK ## - PREPAID MOBILE PURCHASE -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsik00c0eb59fat68qk7	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsik00c1eb59j5jjs74x	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - PREPAID MOBILE PURCHASE -	\N	9.00	2026-02-28 20:15:51.637
cmm6rgsik00c2eb599tkgeuwt	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00c3eb59056nlled	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE - VAS TELKM	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00c4eb590bya6ggj	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE - VAS TELKM FEE: PREPAID MOBILE PURCHASE ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00c5eb59ncrxxgoj	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS TELKM FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsik00c6eb59uqqqo67d	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	VAS TELKM FEE: PREPAID MOBILE PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsik00c7eb59mthlsvqm	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsik00c8eb59s95zbfqj	cmm6rgshb0001eb59vx9pgml9	2026-02-03 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsik00c9eb59bakohbox	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-950.00	2026-02-28 20:15:51.637
cmm6rgsik00caeb59ekvmd6vp	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD - AUTOBANK CASH DEPOSIT	\N	-950.00	2026-02-28 20:15:51.637
cmm6rgsik00cbeb59ndyv02j6	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	SAM CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsik00cceb59gw6gxxek	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	SAM CASH DEPOSIT FEE - AUTOBANK ## - VALUE UNLOAD FROM VIRTUAL CARD	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsik00cdeb59dn7ohvux	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsik00ceeb59mlnuavg3	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - VALUE UNLOAD FROM VIRTUAL CARD	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsik00cfeb5951suln10	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00cgeb59m3axp3x4	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00cheb59czezyoy4	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00cieb59zgcehnzs	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cjeb59ip205vt8	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00ckeb59rgpyb9ri	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cleb59rmuq387n	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cmeb59nbowbq05	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cneb5903t6tz4l	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00coeb59zqxp9628	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cpeb59oyz8j7jp	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	7306.97	2026-02-28 20:15:51.637
cmm6rgsik00cqeb593mvzfdvg	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00creb59szlb3x0o	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cseb594y81v1wx	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cteb59ky5trwts	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cueb59lgnz0bkn	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00cveb59e6s9fhmn	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsik00cweb59n32xxfbw	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cxeb59rd604cr5	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00cyeb595ex0bosh	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00czeb59enj2nnqt	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsik00d0eb593uosagdx	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsik00d1eb59rp3mqdu0	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsik00d2eb593rxvdnw2	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsik00d3eb590mqs04k8	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	H FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsik00d4eb59wtibd7j0	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsik00d5eb59xjryhtv9	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	H FEE - INSTANT MONEY ## - H EDIT TRANSFER	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsik00d6eb59estym90m	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsik00d7eb59t366g6jd	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsik00d8eb594tmqm0a2	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE - INSTANT MONEY ## - H EDIT TRANSFER	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsil00d9eb59bnxqzzo4	cmm6rgshb0001eb59vx9pgml9	2026-02-04 00:00:00	FEE - INSTANT MONEY ## - H EDIT TRANSFER CAPITEC N NJOLI	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsil00daeb59oiuvjzc2	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00dbeb59o8dfvhrh	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00dceb59wnw1ksps	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00ddeb59y1yce9hx	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00deeb59b1bublxo	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00dfeb596xbcnk28	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00dgeb59u6tc448s	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00dheb596jf4hsg5	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00dieb59odjxs3bj	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00djeb59pceb3c1l	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00dkeb59fc9b9h7o	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-1000.00	2026-02-28 20:15:51.637
cmm6rgsil00dleb59ozkcd4tv	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-1000.00	2026-02-28 20:15:51.637
cmm6rgsil00dmeb59ba4dne0d	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-1000.00	2026-02-28 20:15:51.637
cmm6rgsil00dneb596l8l69r5	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	H FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00doeb59y0uim8qq	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dpeb591lab450u	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	H FEE - INSTANT MONEY ## - H LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dqeb59bvnuo500	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dreb597ntfjtyu	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dseb598mnby8ot	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE - INSTANT MONEY ## - H LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dteb599oi9fzde	cmm6rgshb0001eb59vx9pgml9	2026-02-05 00:00:00	FEE - INSTANT MONEY ## - H LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dueb59ceu2svhg	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	H LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dveb59807r4gb5	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	H LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dweb59ektvg2px	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	H LOTTERY PURCHASE - VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dxeb59z2uim68h	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dyeb593imdaj26	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00dzeb59h7qndx81	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE - VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00e0eb59flvqygab	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e1eb59bt37eeuo	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e2eb5948wwf8ot	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e3eb59zs0eqnpa	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e4eb599h6h50xp	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e5eb594wwpeek0	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsil00e6eb59u4eyj0f5	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE - VAS LOTTO	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsil00e7eb59lqruc0ah	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	LOTTERY PURCHASE - VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsil00e8eb59cupiqik3	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00e9eb59n4g4io33	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eaeb59ljm7j05w	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00ebeb59z6x652d8	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsil00eceb59bqaij8fz	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsil00edeb59vykf1v0i	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsil00eeeb59l26esk5l	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00efeb59wq7t7skv	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00egeb593wgbgo6b	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsil00eheb59v4pwcyuz	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eieb59f42hl83r	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00ejeb59x8h9n8dp	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00ekeb59siukk1uf	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eleb598jjg8mm0	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM HWB	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00emeb59yzy86ier	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - EAL TIME TRANSFER FROM HWB LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eneb59vvy501zp	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00eoeb59lzipr6et	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00epeb59z9e4aw4f	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00eqeb59r3k8l4ag	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00ereb59ft5n5lht	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eseb59g611od5o	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eteb5948hheaff	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eueb59ll3694n8	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eveb59obzfy5tw	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00eweb5992emlan6	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00exeb59yyr0p183	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00eyeb599smm3hi6	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - INSURANCE PREMIUM -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00ezeb599suc6n4p	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jceb594o9hvjdf	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	H FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00f0eb59ybys9r6w	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ## - INSURANCE PREMIUM -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00f1eb59jh3puems	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ## - INSURANCE PREMIUM - JAC P F T CIN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00f2eb59vqtrkmvu	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - INSURANCE PREMIUM -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00f3eb59ul119nyv	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE: VOUCHER ## - INSURANCE PREMIUM - JAC P F T CIN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00f4eb590eaak080	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	INSURANCE PREMIUM -	\N	-1076.81	2026-02-28 20:15:51.637
cmm6rgsil00f5eb597i82q7hz	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	INSURANCE PREMIUM - JAC P F T CIN	\N	-1076.81	2026-02-28 20:15:51.637
cmm6rgsil00f6eb59ozk8xrde	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	INSURANCE PREMIUM - JAC P F T CIN FEE - DEBIT ORDER ## -	\N	-1076.81	2026-02-28 20:15:51.637
cmm6rgsil00f7eb599vr57sup	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	JAC P F T CIN FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsil00f8eb597zqs35a1	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	JAC P F T CIN FEE - DEBIT ORDER ## - VOUCHER PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsil00f9eb592m1iir0w	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsil00faeb5948zbopsl	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE - DEBIT ORDER ## - VOUCHER PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsil00fbeb5911eitmz8	cmm6rgshb0001eb59vx9pgml9	2026-02-06 00:00:00	FEE - DEBIT ORDER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsil00fceb59vkg14sbi	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00fdeb590szufiuk	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00feeb5994hsg6x2	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00ffeb5993vawrf7	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00fgeb59ezr2dx4z	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fheb59u15bf260	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fieb59tplq7inh	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fjeb59pwt6khq6	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fkeb59bufwlelq	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fleb59u2dht8tl	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fmeb59wcokoqar	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fneb59u4uodqei	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsil00foeb598zhhe85e	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fpeb597eyxr8jx	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00fqeb59j8o877ym	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsil00freb59c75pae9r	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-2800.00	2026-02-28 20:15:51.637
cmm6rgsil00fseb59ph6jkddq	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-2800.00	2026-02-28 20:15:51.637
cmm6rgsil00fteb590tvr0f74	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2800.00	2026-02-28 20:15:51.637
cmm6rgsil00fueb598mipm6kj	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	H FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00fveb59sf7wd0vz	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00fweb59u7ouz2k4	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	H FEE - INSTANT MONEY ## - H VALUE LOADED TO VIRTUAL CARD -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00fxeb59hihwlw8b	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00fyeb59c4e46mp7	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00fzeb59u512sr1s	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	FEE - INSTANT MONEY ## - H VALUE LOADED TO VIRTUAL CARD -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsil00g0eb595ubkjb67	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00g1eb59vd5o7rkl	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00g2eb59bwoq5kwd	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00g3eb59wx6s8ya3	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00g4eb59odmd5paf	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsim00g5eb598topw248	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD - AUTOBANK CASH DEPOSIT	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsim00g6eb59fm21qist	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ## -	\N	753.34	2026-02-28 20:15:51.637
cmm6rgsim00g7eb59b5gyc0gl	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ## -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsim00g8eb59ghiwu28b	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsim00g9eb59m8907q6n	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsim00gaeb59ixeiy5ua	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	5.40	2026-02-28 20:15:51.637
cmm6rgsim00gbeb59ie7io6ct	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-350.00	2026-02-28 20:15:51.637
cmm6rgsim00gceb59bhca4t8u	cmm6rgshb0001eb59vx9pgml9	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE UNLOAD FROM VIRTUAL CARD	\N	-350.00	2026-02-28 20:15:51.637
cmm6rgsim00gdeb59xyenqd3y	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00geeb598kvdvyvb	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00gfeb59w5jhayic	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00ggeb59a1cufxs9	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00gheb598by8jz0k	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gieb59mh2cekos	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gjeb59u6zstzhd	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gkeb59dudatdqx	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gleb596bpw6peq	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gmeb592qi8nlev	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gneb59bndq5zz5	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00goeb59gwtvxf69	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gpeb590e4lb0hd	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00gqeb5986pewtl2	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00greb59lfmejrm4	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00gseb59s3my0vw4	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00gteb593zz7mg2y	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD -	\N	-365.00	2026-02-28 20:15:51.637
cmm6rgsim00gueb597ixsibyp	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD - LOTTERY PURCHASE -	\N	-365.00	2026-02-28 20:15:51.637
cmm6rgsim00gveb59llydsq2w	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-365.00	2026-02-28 20:15:51.637
cmm6rgsim00gweb59nl6pxv9s	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD - LOTTERY PURCHASE -	\N	-365.00	2026-02-28 20:15:51.637
cmm6rgsim00gxeb59t5jiur54	cmm6rgshb0001eb59vx9pgml9	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD - LOTTERY PURCHASE - VAS POWERBALL	\N	-365.00	2026-02-28 20:15:51.637
cmm6rgsim00gyeb594apwcqkk	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE -	\N	-45.00	2026-02-28 20:15:51.637
cmm6rgsim00gzeb59rpccle9y	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE - VAS POWERBALL	\N	-45.00	2026-02-28 20:15:51.637
cmm6rgsim00h0eb593p3exad3	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE - VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-45.00	2026-02-28 20:15:51.637
cmm6rgsim00h1eb59l6ok4lr3	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00h2eb59dbx5xr5q	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00h3eb592wzceoht	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00h4eb59lw5u4qew	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00h5eb59lhhgzjjc	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## - LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00h6eb5992t7mu07	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsim00h7eb59ay1kt5es	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE - VAS LOTTO	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsim00h8eb59uienrk4f	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	LOTTERY PURCHASE - VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-60.00	2026-02-28 20:15:51.637
cmm6rgsim00h9eb59qp97j7dy	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00haeb59dm5lyfkv	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hbeb59mp8kwtjh	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hceb593di6l8vd	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-1600.00	2026-02-28 20:15:51.637
cmm6rgsim00hdeb59jl9yb60r	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-1600.00	2026-02-28 20:15:51.637
cmm6rgsim00heeb59ljrkrptv	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-250.00	2026-02-28 20:15:51.637
cmm6rgsim00hfeb595yf117c0	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-250.00	2026-02-28 20:15:51.637
cmm6rgsim00hgeb594paqgn7x	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS VOUCHER	\N	-250.00	2026-02-28 20:15:51.637
cmm6rgsim00hheb59cuidcmc0	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00hieb59im9pdhar	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00hjeb59iml18o5x	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00hkeb595w4kaa27	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00hleb59ba1us5s6	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hmeb59y3867wdk	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hneb592s7eq5f4	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hoeb59dmopcgt0	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hpeb59k6f8gwvj	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hqeb59hdw9hoxy	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hreb59bjd1gp45	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hseb590w5a1ny3	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - EDIT TRANSFER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00hteb598qjvm45q	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## - EDIT TRANSFER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hueb59bw1gupuq	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## - EDIT TRANSFER PAYACCSYS C ADE A	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hveb591b4144pi	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - EDIT TRANSFER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hweb593wprpeox	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - EDIT TRANSFER PAYACCSYS C ADE A	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hxeb596efjq6y0	cmm6rgshb0001eb59vx9pgml9	2026-02-10 00:00:00	FEE: VOUCHER ## - EDIT TRANSFER PAYACCSYS C ADE A -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00hyeb594rf4hrc3	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	1325.81	2026-02-28 20:15:51.637
cmm6rgsim00hzeb59c4zoyabp	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00i0eb59y56ryuei	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE - VAS VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00i1eb59hiu1cp4f	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00i2eb59f59nazf5	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsim00i3eb59sh6t4a4m	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i4eb591vv5b4n4	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i5eb596zxq4phb	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i6eb59u1syahga	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i7eb594oivu3b9	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i8eb59f04pgeyd	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00i9eb5911581gml	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00iaeb590kl5g1u8	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ibeb597hz18hnr	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00iceb590mm3h4do	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ideb59xnrp9hay	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsim00ieeb59r81ko7mj	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsim00ifeb59zk3nb11a	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00igeb59k4x9ndx4	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00iheb59l4qi323h	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsim00iieb59t95h61rm	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-50.00	2026-02-28 20:15:51.637
cmm6rgsim00ijeb59rveoxear	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsim00ikeb597hy4mr6f	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsim00ileb590qvpqs53	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsim00imeb599d7pi648	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ineb599r5ga80n	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ioeb591q3c3e9a	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ipeb59u3crsar0	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00iqeb59jvf120st	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00ireb59ko1efn3a	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00iseb59lnzyqoyj	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsim00iteb593pho1e62	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00iueb59iii4o8uo	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO - BRIAN	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00iveb590kkxfedn	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO - BRIAN FEE: PAYSHAP PAYMENT ## -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00iweb59dxgiux8o	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	PAYSHAP PAYMENT TO -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00ixeb59jgll2i0e	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	PAYSHAP PAYMENT TO - BRIAN	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00iyeb59q9snziwj	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	PAYSHAP PAYMENT TO - BRIAN FEE: PAYSHAP PAYMENT ## -	\N	-300.00	2026-02-28 20:15:51.637
cmm6rgsim00izeb59hzbtj5rm	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	BRIAN FEE: PAYSHAP PAYMENT ## -	\N	-7.00	2026-02-28 20:15:51.637
cmm6rgsim00j0eb59dbob9oc6	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	BRIAN FEE: PAYSHAP PAYMENT ## - VALUE LOADED TO VIRTUAL CARD -	\N	-7.00	2026-02-28 20:15:51.637
cmm6rgsim00j1eb59zwcuvq9g	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: PAYSHAP PAYMENT ## -	\N	-7.00	2026-02-28 20:15:51.637
cmm6rgsim00j2eb592scg9i1d	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE: PAYSHAP PAYMENT ## - VALUE LOADED TO VIRTUAL CARD -	\N	-7.00	2026-02-28 20:15:51.637
cmm6rgsin00j3eb596ci5zdbi	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00j4eb59ovajmrud	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD - EAL TIME TRANSFER FROM	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00j5eb595b42ctkr	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO -	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00j6eb591bhrb1mv	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO - -- of --	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00j7eb59xdje9lpd	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO - -- of -- BLUE ROUTE	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00j8eb59qspkoe7g	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00j9eb59ycu2vmf1	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO - -- of --	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00jaeb59dn5r7ri1	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO - -- of -- BLUE ROUTE	\N	-5000.00	2026-02-28 20:15:51.637
cmm6rgsin00jbeb59infyq5mv	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H FEE - INSTANT MONEY ## -	\N	1590.31	2026-02-28 20:15:51.637
cmm6rgsin00jdeb59e6wa5m5r	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jeeb5983xt9d6c	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	H FEE - INSTANT MONEY ## - H VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jfeb59d089yzgt	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE - INSTANT MONEY ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jgeb59wssol806	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE - INSTANT MONEY ## - H	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jheb59yr30othq	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE - INSTANT MONEY ## - H VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jieb59m532dfuf	cmm6rgshb0001eb59vx9pgml9	2026-02-11 00:00:00	FEE - INSTANT MONEY ## - H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsin00jjeb59p85lq6ax	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	H VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00jkeb59jwmmw3ms	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00jleb59kmdb4z2g	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	H VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00jmeb59b1c03s7c	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00jneb59nqsaku36	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00joeb59h5ifgvji	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00jpeb59hjjjy8ga	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jqeb59axpjs4dv	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jreb59xlpmw0k3	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jseb59naedqv6j	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jteb59qes7s8at	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jueb59wodi1149	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00jveb59a6ilaa3q	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsin00jweb59bshplh2n	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsin00jxeb59ubm3tauf	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsin00jyeb59ekqk9yh1	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsin00jzeb597unycx36	cmm6rgshb0001eb59vx9pgml9	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsin00k0eb597s7p5qy1	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00k1eb59bj3zyex1	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD - CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00k2eb59fdn5qpe5	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00k3eb59ocq66lfb	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD - CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00k4eb59f6u0r8i7	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsin00k5eb59fe0jmmht	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsin00k6eb59sccxfnlj	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsin00k7eb59fv1zq7fc	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	H FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00k8eb59o5v4ulbl	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00k9eb59vcv2jgg0	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	H FEE - INSTANT MONEY ## - H VOUCHER PURCHASE -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00kaeb59gm1lb6ts	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00kbeb5989154czs	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00kceb59a9xnabue	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	FEE - INSTANT MONEY ## - H VOUCHER PURCHASE -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00kdeb59hgbz6xvi	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	FEE - INSTANT MONEY ## - H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsin00keeb59zrlk9hw8	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	ASTRON ENERGY * CHEQUE CARD PURCHASE -	\N	-120.00	2026-02-28 20:15:51.637
cmm6rgsin00kfeb595u413a5h	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	ASTRON ENERGY * CHEQUE CARD PURCHASE - HPY*FISH AND * FEB	\N	-120.00	2026-02-28 20:15:51.637
cmm6rgsin00kgeb596x9y9vjf	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	HPY*FISH AND * CHEQUE CARD PURCHASE -	\N	-106.17	2026-02-28 20:15:51.637
cmm6rgsin00kheb59nl3osvxm	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	HPY*FISH AND * CHEQUE CARD PURCHASE - SPAR FISH HOE * FEB	\N	-106.17	2026-02-28 20:15:51.637
cmm6rgsin00kieb59l0wiqj59	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	SPAR FISH HOE * VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsin00kjeb59krycdhcw	cmm6rgshb0001eb59vx9pgml9	2026-02-13 00:00:00	SPAR FISH HOE * VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsin00kkeb59abpdwnmp	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	H VOUCHER PURCHASE -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00kleb590k8fe4hb	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00kmeb59rubl9z59	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	H VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00kneb59i8ait6h9	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VOUCHER PURCHASE -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00koeb59q8qgd1px	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00kpeb595ckuie81	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsin00kqeb59hda78kzi	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kreb5992zitabc	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kseb59vepxan1s	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kteb590ywlko68	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kueb5956iwo449	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kveb5931pawcxa	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kweb597zrqphhg	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kxeb59vzb1t5ra	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - PREPAID MOBILE PURCHASE - VAS VODA	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00kyeb59v41wyj20	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsin00kzeb59uv589s9t	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsin00l0eb59oeyd30ax	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:15:51.637
cmm6rgsin00l1eb59kcmx80xw	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00l2eb59pcyfvebc	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00l3eb59bofhp0fk	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00l4eb59noi1z87a	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00l5eb59gnuqwkr1	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00l6eb59sw7v76vf	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00l7eb595nkiwv24	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00l8eb59fixaaq1j	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00l9eb59o0ptnzw9	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00laeb59i97iiny2	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	1116.94	2026-02-28 20:15:51.637
cmm6rgsin00lbeb59dhc9w5lu	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00lceb594q3b9fim	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00ldeb59brv4d18s	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM BET I ZRANTIEBMSA	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsin00leeb59pzrx2qam	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE -	\N	-29.00	2026-02-28 20:15:51.637
cmm6rgsin00lfeb599swdi2y3	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE - VAS VODA	\N	-29.00	2026-02-28 20:15:51.637
cmm6rgsin00lgeb59xdgvj3yn	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE -	\N	-29.00	2026-02-28 20:15:51.637
cmm6rgsin00lheb59guhmra2k	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA	\N	-29.00	2026-02-28 20:15:51.637
cmm6rgsin00lieb591w61bnw0	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE - VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-29.00	2026-02-28 20:15:51.637
cmm6rgsin00ljeb59zl8kxiho	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00lkeb59d5iu09z8	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsin00lleb5972def7xf	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-350.00	2026-02-28 20:15:51.637
cmm6rgsin00lmeb59m667c9t8	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD - AUTOBANK CASH DEPOSIT	\N	-350.00	2026-02-28 20:15:51.637
cmm6rgsin00lneb59se71cthg	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT FEE - AUTOBANK ## -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsin00loeb59c5ds0g3d	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsin00lpeb59m402jzv4	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsin00lqeb59nm2bxyxk	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - EDIT TRANSFER PAYACCSYS DCB	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsin00lreb59zhsu2300	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT -	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lseb59tyz14ji5	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT - WI ZA NETCASH	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lteb59a8vfxj3y	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT - WI ZA NETCASH FEE - DEBIT ORDER ## -	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lueb594abu64w5	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	SERVICE AGREEMENT -	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lveb5941e0g41x	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	SERVICE AGREEMENT - WI ZA NETCASH	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lweb593jotm83u	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	SERVICE AGREEMENT - WI ZA NETCASH FEE - DEBIT ORDER ## -	\N	-913.00	2026-02-28 20:15:51.637
cmm6rgsin00lxeb59t8g1aan3	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	WI ZA NETCASH FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsin00lyeb59vnx8s3kj	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	WI ZA NETCASH FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsin00lzeb591m1017ve	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE - DEBIT ORDER ## -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsin00m0eb59lboduyzy	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsin00m1eb59ti20s5yj	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	FEE - DEBIT ORDER ## - CHEQUE CARD PURCHASE - ASTRON ENERGY * FEB	\N	-3.50	2026-02-28 20:15:51.637
cmm6rgsin00m2eb59zjcpdroe	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 20:15:51.637
cmm6rgsin00m3eb59usioc806	cmm6rgshb0001eb59vx9pgml9	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD VOUCHER PURCHASE -	\N	-115.86	2026-02-28 20:15:51.637
cmm6rgsin00m4eb596se20nnh	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsin00m5eb59b6nx06lv	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - ASTRON ENERGY * FEB	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsio00m6eb59iboylq2z	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - ASTRON ENERGY * FEB CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsio00m7eb59fg8f4zby	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE -	\N	-120.00	2026-02-28 20:15:51.637
cmm6rgsio00m8eb59pyei32ic	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - HPY*FISH AND * FEB	\N	-120.00	2026-02-28 20:15:51.637
cmm6rgsio00m9eb592ho7s0uc	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - HPY*FISH AND * FEB CHEQUE CARD PURCHASE -	\N	-120.00	2026-02-28 20:15:51.637
cmm6rgsio00maeb599pg62rtp	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE -	\N	-106.17	2026-02-28 20:15:51.637
cmm6rgsio00mbeb59mdsx7je3	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - SPAR FISH HOE * FEB	\N	-106.17	2026-02-28 20:15:51.637
cmm6rgsio00mceb59qk2jvavw	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	CHEQUE CARD PURCHASE - SPAR FISH HOE * FEB VALUE LOADED TO VIRTUAL CARD -	\N	-106.17	2026-02-28 20:15:51.637
cmm6rgsio00mdeb59hs6trgfb	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsio00meeb59j1v3txt1	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:15:51.637
cmm6rgsio00mfeb59ouoh6uze	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-240.00	2026-02-28 20:15:51.637
cmm6rgsio00mgeb594flxqopo	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD - EDIT TRANSFER	\N	-240.00	2026-02-28 20:15:51.637
cmm6rgsio00mheb59hsz6lbaz	cmm6rgshb0001eb59vx9pgml9	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD - EDIT TRANSFER STP -	\N	-240.00	2026-02-28 20:15:51.637
cmm6rgsio00mieb59918e3s8g	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	STP - VOUCHER PURCHASE -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00mjeb597y3hn34v	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	STP - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00mkeb59pswc4x0r	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	STP - VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00mleb5969r68bkl	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00mmeb59nms5u0el	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00mneb59h54ajdn3	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:15:51.637
cmm6rgsio00moeb59t66c2ufu	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mpeb59gfb2oydc	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mqeb5963g6mhq8	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mreb59lkeaupqv	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mseb599fwwdhuy	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mteb59droavime	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mueb598x8jhxno	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00mveb59v1jg7s78	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	ROUTER IB PAYMENT TO -	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00mweb593dsvuhq0	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	ROUTER IB PAYMENT TO - JAYDI COMPUTERS INSURANCE	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00mxeb59nomyow9z	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	ROUTER IB PAYMENT TO - JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00myeb59ov1gac04	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	IB PAYMENT TO -	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00mzeb59dnojkal8	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	IB PAYMENT TO - JAYDI COMPUTERS INSURANCE	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00n0eb59mlt7kg3s	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	IB PAYMENT TO - JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2494.99	2026-02-28 20:15:51.637
cmm6rgsio00n1eb59dxxi6ld5	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00n2eb59ieayzgju	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00n3eb599fltidxo	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - PAYSHAP PAYMENT FROM	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00n4eb59qvwtvmiu	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-52.93	2026-02-28 20:15:51.637
cmm6rgsio00n5eb59lwhh0pmo	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-52.93	2026-02-28 20:15:51.637
cmm6rgsio00n6eb59b776v94o	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-52.93	2026-02-28 20:15:51.637
cmm6rgsio00n7eb59rnx36z99	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00n8eb598mosbao7	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00n9eb59f4v0ix2i	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00naeb59lrkcof2t	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nbeb59qbsj7x2a	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nceb59t69yyyb2	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00ndeb59lo8xbgl8	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-110.00	2026-02-28 20:15:51.637
cmm6rgsio00neeb59rc6vtb51	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-110.00	2026-02-28 20:15:51.637
cmm6rgsio00nfeb59t2yo66ls	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-110.00	2026-02-28 20:15:51.637
cmm6rgsio00ngeb59ekc4oj4f	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nheb59i57ff8lg	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nieb59r2qx2xm8	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE - SHELL KOMMETJ * FEB	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00njeb59mwm7pdyy	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsio00nkeb592thuzik9	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	CHEQUE CARD PURCHASE - SHELL KOMMETJ * FEB	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsio00nleb5924b4juuy	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	CHEQUE CARD PURCHASE - SHELL KOMMETJ * FEB VALUE UNLOAD FROM VIRTUAL CARD	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsio00nmeb5903e3f3py	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nneb59408l8clw	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00noeb59bngtujzp	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - LOTTERY WINNINGS VAS	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00npeb59vqaxueid	cmm6rgshb0001eb59vx9pgml9	2026-02-17 00:00:00	FEE: VOUCHER ## - LOTTERY WINNINGS VAS PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nqeb594zxpt3wc	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTERY PURCHASE -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nreb597fafp77g	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTERY PURCHASE - VAS LOTTO	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nseb59o5dt8ue1	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTERY PURCHASE - VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nteb59zsx4vmwk	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nueb59j7q4f4cs	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE - VAS LOTTO	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nveb59gtj13rx1	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE - VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:15:51.637
cmm6rgsio00nweb59cd3561ru	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nxeb597t4bdm93	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nyeb596c5he6vn	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00nzeb59f2tkuc78	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o0eb59bzfggdx7	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o1eb594ke1elvt	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o2eb59oy0ylkk8	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o3eb59rgp9ifgl	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD LOTTERY PURCHASE -	\N	398.51	2026-02-28 20:15:51.637
cmm6rgsio00o4eb5955bgzfsa	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsio00o5eb59lo612fw7	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsio00o6eb59tfnw3i50	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	LOTTERY PURCHASE - VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:15:51.637
cmm6rgsio00o7eb59klfavrfu	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o8eb59u6jeqcwf	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00o9eb59v30gq6bf	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## - PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00oaeb594v3sh72q	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE -	\N	-25.00	2026-02-28 20:15:51.637
cmm6rgsio00obeb59ipv8sfvk	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE - VAS CELLC	\N	-25.00	2026-02-28 20:15:51.637
cmm6rgsio00oceb5944t5yrcz	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE - VAS CELLC FEE: PREPAID MOBILE PURCHASE ## -	\N	-25.00	2026-02-28 20:15:51.637
cmm6rgsio00odeb59az31zgt7	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS CELLC FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsio00oeeb59rzfpsxxw	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	VAS CELLC FEE: PREPAID MOBILE PURCHASE ## - AUTOBANK CASH DEPOSIT	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsio00ofeb59730hnl4f	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE: PREPAID MOBILE PURCHASE ## -	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsio00ogeb594k1v87ls	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	FEE: PREPAID MOBILE PURCHASE ## - AUTOBANK CASH DEPOSIT	\N	-1.00	2026-02-28 20:15:51.637
cmm6rgsio00oheb59cinb0vhf	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT FEE - AUTOBANK ## -	\N	14.40	2026-02-28 20:15:51.637
cmm6rgsio00oieb5939h7z12n	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT FEE - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	14.40	2026-02-28 20:15:51.637
cmm6rgsio00ojeb599vzsftba	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	14.40	2026-02-28 20:15:51.637
cmm6rgsio00okeb5963r9131z	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	14.40	2026-02-28 20:15:51.637
cmm6rgsio00oleb59y3lmgw5y	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsio00omeb59c3sa8o07	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT FEE - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsio00oneb597oylm747	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsio00ooeb59u145fw0l	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	7.20	2026-02-28 20:15:51.637
cmm6rgsio00opeb59sb1e9fu3	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 20:15:51.637
cmm6rgsio00oqeb59cdh2dbrp	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA	\N	-800.00	2026-02-28 20:15:51.637
cmm6rgsio00oreb59fx5i114f	cmm6rgshb0001eb59vx9pgml9	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-800.00	2026-02-28 20:15:51.637
cmm6rgsio00oseb59mlcz8x7p	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oteb59o3qw21me	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD - IB PAYMENT TO -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oueb59mmw9r754	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD - IB PAYMENT TO - BLUEDOG TECHNOLOGY BENGO	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oveb59zsac17gd	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	IB PAYMENT TO -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oweb5934pjqa98	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	IB PAYMENT TO - BLUEDOG TECHNOLOGY BENGO	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oxeb59t3x5bbst	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	IB PAYMENT TO - BLUEDOG TECHNOLOGY BENGO FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-450.00	2026-02-28 20:15:51.637
cmm6rgsio00oyeb59mcrmp25z	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	BLUEDOG TECHNOLOGY BENGO FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00ozeb596gqcbnzx	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00p0eb5958fdgmfu	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## - VALUE UNLOAD FROM VIRTUAL CARD	\N	-2.00	2026-02-28 20:15:51.637
cmm6rgsio00p1eb59othw2w04	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00p2eb59sa25nq63	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00p3eb59l7knyo8b	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsio00p4eb59vbdxp67f	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00p5eb5944lyvi69	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00p6eb59danaon4p	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsio00p7eb59lp70yjd2	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00p8eb59vq20bhst	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00p9eb59v4tcpjql	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00paeb59i7qbz4l5	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	REF VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pbeb595ne27wyf	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	REF VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pceb594hupv3ii	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	REF VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pdeb5938cfj1bh	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00peeb59uf0i1h21	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pfeb59nzufo2w0	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pgeb59234wem8u	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pheb59rztffdgf	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pieb59roln2l72	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pjeb59apne67zu	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pkeb592aa8ihey	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pleb59tiz9cvyw	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00pmeb598qgd27ka	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pneb59u778sx31	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00poeb59jm65wtdz	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00ppeb59j38ur6ka	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pqeb5988kvorle	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00preb59j6u96qw6	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	996.14	2026-02-28 20:15:51.637
cmm6rgsip00pseb59ju4hr0vh	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pteb59ndpbx8wj	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pueb59lfk8un7j	cmm6rgshb0001eb59vx9pgml9	2026-02-19 00:00:00	FEE: VOUCHER ## - CHEQUE CARD PURCHASE - HPY*FISH AND * FEB	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00pveb594jcvxgq1	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CHEQUE CARD PURCHASE -	\N	-67.00	2026-02-28 20:15:51.637
cmm6rgsip00pweb59xte1kaid	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CHEQUE CARD PURCHASE - HPY*FISH AND * FEB	\N	-67.00	2026-02-28 20:15:51.637
cmm6rgsip00pxeb59iucjtw6k	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CHEQUE CARD PURCHASE - HPY*FISH AND * FEB PAYSHAP PAYMENT FROM	\N	-67.00	2026-02-28 20:15:51.637
cmm6rgsip00pyeb59fxk1idbo	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00pzeb59aj4bzxog	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO - H	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00q0eb59c86tldm8	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00q1eb59qitj5ofg	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00q2eb592wvbx5u2	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00q3eb594ffuueqn	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-400.00	2026-02-28 20:15:51.637
cmm6rgsip00q4eb59gubs39yl	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	H FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00q5eb59lis18ggq	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00q6eb59y4xucqj6	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	H FEE - INSTANT MONEY ## - H VALUE LOADED TO VIRTUAL CARD -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00q7eb59rgbns3go	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00q8eb591r5s1b8r	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00q9eb59k6gmfjae	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	FEE - INSTANT MONEY ## - H VALUE LOADED TO VIRTUAL CARD -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00qaeb59ac3ib1f1	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD -	\N	-340.00	2026-02-28 20:15:51.637
cmm6rgsip00qbeb59z3o7zjuw	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-340.00	2026-02-28 20:15:51.637
cmm6rgsip00qceb59bs1cr2e9	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-340.00	2026-02-28 20:15:51.637
cmm6rgsip00qdeb59vev3sya7	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-340.00	2026-02-28 20:15:51.637
cmm6rgsip00qeeb594pdp53a4	cmm6rgshb0001eb59vx9pgml9	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-340.00	2026-02-28 20:15:51.637
cmm6rgsip00qfeb59nzxognb2	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00qgeb59qt8dohcm	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00qheb59ws4nx9df	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsip00qieb59kz9zm1b0	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qjeb59pwoc8v00	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qkeb59222svnli	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qleb595jnrh24u	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qmeb59sxr2pm32	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00s4eb591mtf24yz	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsip00qneb5949e1ytdq	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qoeb597b1srvyg	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qpeb595dnewcvu	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM -- of --	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qqeb59bdr9zv08	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	555.54	2026-02-28 20:15:51.637
cmm6rgsip00qreb59dnfno7hi	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qseb59crz05ulr	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE: VOUCHER ## - PAYSHAP PAYMENT FROM EF AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsip00qteb59hcray72n	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT FEE - AUTOBANK ## -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsip00queb59ulay6vwd	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT FEE - AUTOBANK ## - CELLPHONE INSTANTMON CASH TO -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsip00qveb59wsx7yn2a	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsip00qweb59q3bwglng	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## - CELLPHONE INSTANTMON CASH TO -	\N	3.60	2026-02-28 20:15:51.637
cmm6rgsip00qxeb595rq3vgjq	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00qyeb59w6hd0vup	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO - H	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00qzeb59u69x6l0z	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00r0eb59nldezgjf	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r1eb59rtg5abw5	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r2eb59f5w2m8ch	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## - H EAL TIME TRANSFER FROM	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r3eb598874htzs	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r4eb59eqjpzxfd	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## - H	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r5eb59reh6pyic	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## - H EAL TIME TRANSFER FROM	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r6eb59xlh1n00w	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## - H EAL TIME TRANSFER FROM WI FI	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00r7eb59rmn7aytd	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00r8eb598e4xpvje	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO - H	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00r9eb597moygt3p	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsip00raeb591cd1urlq	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00rbeb59mdcqzjm4	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE -	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00rceb59d81zhxct	cmm6rgshb0001eb59vx9pgml9	2026-02-22 00:00:00	FEE - INSTANT MONEY ## - H ELECTRICITY PURCHASE - VAS	\N	-10.00	2026-02-28 20:15:51.637
cmm6rgsip00rdeb59bdeypiuz	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	H ELECTRICITY PURCHASE -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsip00reeb5901812s2a	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	H ELECTRICITY PURCHASE - VAS	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsip00rfeb59pplkr8rc	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	H ELECTRICITY PURCHASE - VAS FEE: ELECTRICITY PURCHASE ## -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsip00rgeb59b01h7xc7	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	ELECTRICITY PURCHASE -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsip00rheb59jnlq14vc	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	ELECTRICITY PURCHASE - VAS	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsip00rieb59y37fhknr	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	ELECTRICITY PURCHASE - VAS FEE: ELECTRICITY PURCHASE ## -	\N	-150.00	2026-02-28 20:15:51.637
cmm6rgsiq00rjeb59efguxdd4	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsiq00rkeb5900p1uurh	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## - VOUCHER PURCHASE -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsiq00rleb59v13dildz	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ## -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsiq00rmeb59t3nls8df	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ## - VOUCHER PURCHASE -	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsiq00rneb59v5lel1az	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-1.60	2026-02-28 20:15:51.637
cmm6rgsiq00roeb59lkueyl9p	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsiq00rpeb59i9tacz7j	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsiq00rqeb59k0w37a9k	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VOUCHER PURCHASE - VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:15:51.637
cmm6rgsiq00rreb594m3hmxpq	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rseb59deqjxrm2	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rteb59l7d51p1r	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rueb596b752yae	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rveb597dbc4zce	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: VOUCHER ## - VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rweb59upq4xsdp	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rxeb59ragnpjjo	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00ryeb5904b59ir4	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:15:51.637
cmm6rgsiq00rzeb59sprk0l1v	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD -	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsiq00s0eb59lqj8ag0q	cmm6rgshb0001eb59vx9pgml9	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-200.00	2026-02-28 20:15:51.637
cmm6rgsiq00s1eb591wakvn6n	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	VAS LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsiq00s2eb59a12ivqe1	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsiq00s3eb599jnnep1s	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsiq00s5eb598l0dwu8k	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsiq00s6eb59cpl68vt0	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:15:51.637
cmm6rgsiq00s7eb59he6lr8yx	cmm6rgshb0001eb59vx9pgml9	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM EF	\N	-9.10	2026-02-28 20:15:51.637
cmm6rs6fw0002xpkcinfwpdfn	cmm6rs6eu0001xpkcnatybimm	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER	\N	3000.00	2026-02-28 20:24:42.905
cmm6rs6fw0003xpkcuyd7vmfo	cmm6rs6eu0001xpkcnatybimm	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 20:24:42.905
cmm6rs6fw0004xpkcmc8na1s0	cmm6rs6eu0001xpkcnatybimm	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	3000.00	2026-02-28 20:24:42.905
cmm6rs6fw0005xpkcplvp92cm	cmm6rs6eu0001xpkcnatybimm	2026-01-23 00:00:00	Month-end Balance R Details Service Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	-6335.06	2026-02-28 20:24:42.905
cmm6rs6fw0006xpkc58wuv6v2	cmm6rs6eu0001xpkcnatybimm	2026-01-23 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	-24410.89	2026-02-28 20:24:42.905
cmm6rs6fw0007xpkcoub2k7fu	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fw0008xpkcrw367jwz	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE VAS VODA	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fw0009xpkcdd2vy7pi	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fw000axpkchvyunklt	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000bxpkc13avg5b6	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000cxpkc3fbs69ca	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000dxpkcves8vrgj	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000expkcvifbpjso	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000fxpkc8apenn1b	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE ## VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fw000gxpkcqolj643i	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fw000hxpkc27l39xcm	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BETWAY	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fw000ixpkciq83oyrq	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BETWAY FEE: VOUCHER ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fw000jxpkca7sbotyo	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BETWAY FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fw000kxpkcncjkrlvm	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000lxpkc07xc1nmv	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000mxpkcgegpbrmd	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER ## PAYSHAP PAYMENT FROM BETWAY	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000nxpkc2qs82jmc	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000oxpkcd9c68ico	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000pxpkco7mn2u4k	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM BETWAY	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000qxpkcu1skffh1	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM BETWAY VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000rxpkcbhn4ol07	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000sxpkcuco54tu3	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000txpkck717djyu	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000uxpkc2ziuw817	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000vxpkcc7mgzajf	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000wxpkccrgjr1th	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw000xxpkcj6kei5in	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000yxpkc4sf7tvul	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw000zxpkc6jq3iue4	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0010xpkc40y8qw8j	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0011xpkc8rlvapl9	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0012xpkcvbp2luvx	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER -- of --	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw0013xpkcq4w3uv21	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER -- of -- BLUE ROUTE	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fw0014xpkcd1cunbpu	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	-628.24	2026-02-28 20:24:42.905
cmm6rs6fw0015xpkcut6uhxco	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0016xpkcvu7w99tw	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0017xpkc4xlhtak7	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## PREPAID MOBILE PURCHASE - VAS VODA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0018xpkcuw8s9ww3	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6fw0019xpkciumlilfs	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6fw001axpkcfgnv8xl9	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6fw001bxpkcd7bysm8n	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001cxpkc9rkxolxj	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001dxpkcgv5r3c97	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001expkc90gnzhmw	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE - YOCO *PAHAR * JAN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001fxpkcj1kqqa1a	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	CHEQUE CARD PURCHASE	\N	-260.00	2026-02-28 20:24:42.905
cmm6rs6fw001gxpkcklbx7roi	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	CHEQUE CARD PURCHASE YOCO *PAHAR * JAN	\N	-260.00	2026-02-28 20:24:42.905
cmm6rs6fw001hxpkc1q0gimt5	cmm6rs6eu0001xpkcnatybimm	2026-01-25 00:00:00	CHEQUE CARD PURCHASE YOCO *PAHAR * JAN CREDIT TRANSFER	\N	-260.00	2026-02-28 20:24:42.905
cmm6rs6fw001ixpkcs94dyccw	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6fw001jxpkccbzo36v8	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6fw001kxpkcxzo8ogbw	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6fw001lxpkchywksbj6	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6fw001mxpkc33bd8p7b	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6fw001nxpkc4y6qw5fx	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw001oxpkcpcprrxfq	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw001pxpkcrxqiohk3	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw001qxpkc3v05u8kr	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001rxpkcz29qmffw	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001sxpkcwzbguodg	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001txpkcoohv1egh	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001uxpkcwenghqss	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS HOLLYWOODBETS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001vxpkcf16ysm98	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS -- of --	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw001wxpkc485ru7ey	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS HOLLYWOODBETS -- of -- BLUE ROUTE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw001xxpkcbhdxu0v8	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	-2435.69	2026-02-28 20:24:42.905
cmm6rs6fw001yxpkcdg5ay0qj	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw001zxpkcplzjlf32	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0020xpkc9ptpgefi	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw0021xpkcsklrzbzl	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw0022xpkc3q7n49f5	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fw0023xpkcpdjnrluv	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0024xpkcuuqs30jd	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0025xpkc4pqhx7jl	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0026xpkc8ny0fnq1	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fw0027xpkc9uwj6fjz	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx0028xpkci5b1pybq	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx0029xpkc8yjgh7i0	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx002axpkcjch300r0	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fx002bxpkcrj08m7fy	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fx002cxpkczlgufwth	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fx002dxpkckf8o5qae	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fx002expkck8erew18	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fx002fxpkc5k5wt1g7	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fx002gxpkc7rjow17m	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fx002hxpkcqaxu6eds	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fx002ixpkcg8iu422i	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	H FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002jxpkciuwabyn0	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	H FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002kxpkcix8e4cr6	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	H FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002lxpkcmdw1n14b	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002mxpkc0hxuxrsi	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002nxpkc98go8zoc	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002oxpkc4kc0xfon	cmm6rs6eu0001xpkcnatybimm	2026-01-26 00:00:00	FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE - VAS	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fx002pxpkcqx8f4spk	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	H ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002qxpkc5aowk7f9	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	H ELECTRICITY PURCHASE VAS	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002rxpkcdxdz3fyv	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	H ELECTRICITY PURCHASE VAS FEE: ELECTRICITY PURCHASE ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002sxpkcyq103fgc	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002txpkcgg4zll8w	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	ELECTRICITY PURCHASE VAS	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002uxpkct3evu6pn	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	ELECTRICITY PURCHASE VAS FEE: ELECTRICITY PURCHASE ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx002vxpkc8vczpe0z	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ##	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6fx002wxpkcmeo1he5z	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## EDIT TRANSFER	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g500nfxpkcymib97v4	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	ROUTER IB PAYMENT TO	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6fx002xxpkcw1927zib	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## EDIT TRANSFER CAPITEC S WILLIAMS	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6fx002yxpkcwvbb8z4o	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ##	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6fx002zxpkcj4w6nnwb	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ## EDIT TRANSFER	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6fx0030xpkc4wgv5leu	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE ## EDIT TRANSFER CAPITEC S WILLIAMS	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6fx0031xpkcmpkxzozf	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx0032xpkc90y8rmjh	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO JOSEPH JOZE	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx0033xpkc1k71rs2s	cmm6rs6eu0001xpkcnatybimm	2026-01-27 00:00:00	BUCO LONGBEAC * IB PAYMENT TO JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx0034xpkc4mo9dc27	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fx0035xpkcttj9xcua	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE VAS VODA	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fx0036xpkc6z0t6rwr	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fx0037xpkc3upp5k1x	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE VAS VODA	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fx0038xpkct7cf83fb	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6fx0039xpkcow7dld4j	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003axpkcmrlbja2d	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003bxpkcqxjwwzw4	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003cxpkc7w8otlvw	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003dxpkc33kdldul	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## CELLPHONE INSTANTMON CASH TO -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003expkc80ptcjex	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE ## CELLPHONE INSTANTMON CASH TO -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6fx003fxpkcu9c452eq	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6fx003gxpkc8fkc1k2j	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6fx003hxpkc5ogawhu7	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6fx003ixpkcjorl2my9	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003jxpkcti13qp2l	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H FEE - INSTANT MONEY ## -- of --	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003kxpkc8gthabu0	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H FEE - INSTANT MONEY ## -- of -- BLUE ROUTE	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003lxpkcdxnzysct	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003mxpkcc349blsy	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE - INSTANT MONEY ## -- of --	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003nxpkc96tnyuta	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE - INSTANT MONEY ## -- of -- BLUE ROUTE	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003oxpkcr67118d9	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE - INSTANT MONEY ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6fx003pxpkc1kgutz44	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H IB PAYMENT TO -	\N	-6710.79	2026-02-28 20:24:42.905
cmm6rs6fx003qxpkc6klv2tr7	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H IB PAYMENT TO	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003rxpkcrmdvua4r	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H IB PAYMENT TO PATRICK RENT	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003sxpkc04rgd8px	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	H IB PAYMENT TO PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003txpkc5n2szr4m	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	IB PAYMENT TO	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003uxpkc7kqzlbfn	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	IB PAYMENT TO PATRICK RENT	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003vxpkcinu5xpkd	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	IB PAYMENT TO PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5050.00	2026-02-28 20:24:42.905
cmm6rs6fx003wxpkcl51iwiv1	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx003xxpkced56b5ok	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## AUTOBANK CASH DEPOSIT	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx003yxpkcgb7c4aaz	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx003zxpkcxqq8aavk	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## AUTOBANK CASH DEPOSIT	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx0040xpkcskj6o0os	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT FEE - AUTOBANK ##	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6fx0041xpkcfm7tel6s	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6fx0042xpkcooolxxxo	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6fx0043xpkcv9rk2m5m	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6fx0044xpkcx4k3va3h	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER ISAAC MUGWAGWA	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6fx0045xpkckqf5pusl	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	S S*ABDILAYEK * CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:24:42.905
cmm6rs6fx0046xpkcqz7vz6j4	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	S S*ABDILAYEK * CHEQUE CARD PURCHASE BUCO LONGBEAC * JAN	\N	-158.39	2026-02-28 20:24:42.905
cmm6rs6fx0047xpkcagd1ixgu	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	SASOL KOMMETJ * CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:24:42.905
cmm6rs6fx0048xpkc3ydrpemt	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	SASOL KOMMETJ * CHEQUE CARD PURCHASE SCOOP DISTRIB * JAN	\N	-969.45	2026-02-28 20:24:42.905
cmm6rs6fx0049xpkc04cjkr2p	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx004axpkc19edg1kj	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE VAS VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx004bxpkciqdhih2x	cmm6rs6eu0001xpkcnatybimm	2026-01-28 00:00:00	SCOOP DISTRIB * VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fx004cxpkctu5jcyhp	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6g500owxpkcnt0z8hry	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE	\N	-25.00	2026-02-28 20:24:42.905
cmm6rs6fx004dxpkcpvgqluji	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER SBIB-MOBI FUN	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6fx004expkc2v0lytst	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER SBIB-MOBI FUN FEE - DEBIT ORDER ## -	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6fx004fxpkcyl6lkksv	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6fx004gxpkcbjxcqfbc	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER SBIB-MOBI FUN	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6fx004hxpkcjmgxfyr9	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER SBIB-MOBI FUN FEE - DEBIT ORDER ## -	\N	-202.47	2026-02-28 20:24:42.905
cmm6rs6fx004ixpkca0s5yvkf	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	SBIB-MOBI FUN FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6fx004jxpkc9cwja6o6	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	SBIB-MOBI FUN FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6fx004kxpkcuum9x24e	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6fx004lxpkcuadkaq19	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6fx004mxpkczlt2cjh7	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE - S S*ABDILAYEK * JAN	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6fx004nxpkcx0hohdly	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-142.00	2026-02-28 20:24:42.905
cmm6rs6fx004oxpkc6111no8x	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE S S*ABDILAYEK * JAN	\N	-142.00	2026-02-28 20:24:42.905
cmm6rs6fx004pxpkc8lnm1l8o	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE S S*ABDILAYEK * JAN CHEQUE CARD PURCHASE -	\N	-142.00	2026-02-28 20:24:42.905
cmm6rs6fx004qxpkchakl98wf	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:24:42.905
cmm6rs6fx004rxpkcxhzvs1df	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE BUCO LONGBEAC * JAN	\N	-158.39	2026-02-28 20:24:42.905
cmm6rs6fx004sxpkchulbm5y2	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CHEQUE CARD PURCHASE BUCO LONGBEAC * JAN IB PAYMENT TO -	\N	-158.39	2026-02-28 20:24:42.905
cmm6rs6fx004txpkciwmja4hk	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	IB PAYMENT TO	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx004uxpkcsyw8qjqg	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	IB PAYMENT TO JOSEPH JOZE	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx004vxpkc2yyavyyu	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	IB PAYMENT TO JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-5100.00	2026-02-28 20:24:42.905
cmm6rs6fx004wxpkc0n31z2nt	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx004xxpkcn046bg2x	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT ## VOUCHER PURCHASE -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx004yxpkcab8eilzc	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx004zxpkc5kqg9gdw	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## VOUCHER PURCHASE -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fx0050xpkc81xojlox	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx0051xpkcj5dwotry	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx0052xpkcy6wu0dh7	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fx0053xpkc4ibwcjr3	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy0054xpkcr7981rkk	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0055xpkckbyxwtog	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0056xpkc2hxxwwzw	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0057xpkcztgn31hx	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0058xpkc5vkyqidp	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0059xpkcfma1f771	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005axpkcvx9v0cjj	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005bxpkc1xa4r89x	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy005cxpkc7oi690ga	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005dxpkc8y1lr4im	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005expkc3cm09xe1	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005fxpkcdfndnpm3	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005gxpkcgltj3109	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005hxpkcdxgp5ro7	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	JULIET CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy005ixpkc3s20xa2x	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	JULIET CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy005jxpkczdt63o20	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy005kxpkcjfhunoik	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy005lxpkc5yyqsjlk	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE - VAS VOUCHER	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy005mxpkcfu96rnzj	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 20:24:42.905
cmm6rs6fy005nxpkch0z5wqe1	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 20:24:42.905
cmm6rs6fy005oxpkcr9c0rx1n	cmm6rs6eu0001xpkcnatybimm	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	270.00	2026-02-28 20:24:42.905
cmm6rs6fy005pxpkcd1jxdn91	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy005qxpkcykl19rpr	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy005rxpkcb6e8jek3	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy005sxpkcn84jsdmm	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy005txpkc0m0n3y43	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005uxpkcfojhtm7y	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005vxpkcorr8sf93	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005wxpkc6mclp9i0	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005xxpkc1037nt84	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE - SASOL KOMMETJ * JAN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy005yxpkcgxpfu971	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy005zxpkc85p3zlg3	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE SASOL KOMMETJ * JAN	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0060xpkc59v57rr9	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE SASOL KOMMETJ * JAN CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0061xpkcsduodryf	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:24:42.905
cmm6rs6fy0062xpkcso1f033g	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE SCOOP DISTRIB * JAN	\N	-969.45	2026-02-28 20:24:42.905
cmm6rs6fy0063xpkc1hkqarup	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHEQUE CARD PURCHASE SCOOP DISTRIB * JAN VOUCHER PURCHASE -	\N	-969.45	2026-02-28 20:24:42.905
cmm6rs6fy0064xpkcmplcl5vi	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0065xpkcg1l3gwz6	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0066xpkcr6y8o021	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0067xpkczwim2jai	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - PAYSHAP PAYMENT FROM	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy0068xpkcy1afd63n	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy0069xpkc8rvl6zkh	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM BET ZQTZSDKDQJI WF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006axpkckewqe4o9	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006bxpkc2odoh1on	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM BET ZQTZSDKDQJI WF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006cxpkc6lgd1gun	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT FEE - AUTOBANK ##	\N	-59.40	2026-02-28 20:24:42.905
cmm6rs6fy006dxpkcqlfqbyz9	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT FEE - AUTOBANK ## PAYSHAP PAYMENT FROM	\N	-59.40	2026-02-28 20:24:42.905
cmm6rs6fy006expkczu29rqfb	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-59.40	2026-02-28 20:24:42.905
cmm6rs6fy006fxpkc389pf0rp	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## PAYSHAP PAYMENT FROM	\N	-59.40	2026-02-28 20:24:42.905
cmm6rs6fy006gxpkccgm8dzdv	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006hxpkcnead2qcg	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006ixpkcp1nr45c9	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006jxpkcvr8fap2f	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006kxpkcmehfb76f	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VOUCHER PURCHASE - VAS VOUCHER	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006lxpkck5qvzr0d	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy006mxpkcu3ubyzve	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006nxpkcoxnah7bp	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006oxpkcrky12q8f	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006pxpkcmnrhmiv6	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006qxpkcqgij2xic	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006rxpkc8qyrqh7t	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fy006sxpkcv30js7ln	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006txpkclxnjvspi	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER ## AUTOBANK CASH DEPOSIT AUXILIA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006uxpkctaqtzrrg	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006vxpkcwpi9lwl8	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT AUXILIA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006wxpkchdyt529i	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT AUXILIA CASH DEPOSIT FEE - AUTOBANK ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy006xxpkcof3hn0aa	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006yxpkcgty7snad	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT FEE - AUTOBANK ## MONTHLY MANAGEMENT FEE ## -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy006zxpkcjub81rub	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## MONTHLY MANAGEMENT FEE ## -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy0070xpkcsvrbmt4f	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ##	\N	-7.50	2026-02-28 20:24:42.905
cmm6rs6fy0071xpkcy5z7wll9	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ## VOUCHER PURCHASE -	\N	-7.50	2026-02-28 20:24:42.905
cmm6rs6fy0072xpkcumfqo050	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE ## VOUCHER PURCHASE - VAS VOUCHER	\N	-7.50	2026-02-28 20:24:42.905
cmm6rs6fy0073xpkcwzrmtvlf	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHECKERS SUNV * CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:24:42.905
cmm6rs6fy0074xpkcllfohe4e	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	CHECKERS SUNV * CHEQUE CARD PURCHASE LIQUORSHOP SU * JAN	\N	-191.29	2026-02-28 20:24:42.905
cmm6rs6fy0075xpkcup6gf79j	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 20:24:42.905
cmm6rs6fy0076xpkcxjbhqlnc	cmm6rs6eu0001xpkcnatybimm	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 20:24:42.905
cmm6rs6fy0077xpkcpfsgaa4u	cmm6rs6eu0001xpkcnatybimm	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fy0078xpkcr4blrqt8	cmm6rs6eu0001xpkcnatybimm	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO -	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fy0079xpkcqctjuqb3	cmm6rs6eu0001xpkcnatybimm	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fy007axpkcivlziuk0	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007bxpkcd5j62fze	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007cxpkcy8tkjzzv	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER -- of --	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007dxpkc6mf3i0f2	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER -- of -- BLUE ROUTE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007expkcwsdxrmka	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER ## -	\N	-6235.06	2026-02-28 20:24:42.905
cmm6rs6fy007fxpkcmo3bjfd4	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007gxpkc7g0x79a6	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007hxpkcepxzn3wt	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007ixpkcipiwvmdj	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007jxpkcu7q5wd2p	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007kxpkc6vxrj3u4	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fy007lxpkcftzpiizz	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007mxpkcibr20m0c	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007nxpkcaf0jgdw0	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## AUTOBANK CASH DEPOSIT SHELLA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007oxpkcv7jq8nwi	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007pxpkcyzpenobf	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT SHELLA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007qxpkcd0jcyqu3	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## AUTOBANK CASH DEPOSIT SHELLA CASH DEPOSIT FEE - AUTOBANK ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fy007rxpkcil2om35v	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	SHELLA CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy007sxpkc2trzozev	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	SHELLA CASH DEPOSIT FEE - AUTOBANK ## IB PAYMENT TO -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy007txpkc01doo3vc	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy007uxpkcjrrriix5	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## IB PAYMENT TO -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy007vxpkcqacdrjqi	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## IB PAYMENT TO - NURAAN SASMAAN	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fy007wxpkclyznjsx6	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fy007xxpkc2xfhs4ck	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO NURAAN SASMAAN	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fz007yxpkc3m14o9r3	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fz007zxpkcod8tjurq	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0080xpkcgdpm4o7w	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT ## IB PAYMENT TO -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0081xpkczle9c52a	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0082xpkc240b7phs	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## IB PAYMENT TO -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0083xpkcwua0n1f6	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## IB PAYMENT TO - WIZA SOLUTIONS WIFI	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0084xpkccpen0mtx	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO	\N	-915.00	2026-02-28 20:24:42.905
cmm6rs6fz0085xpkc73qcuz13	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO WIZA SOLUTIONS WIFI	\N	-915.00	2026-02-28 20:24:42.905
cmm6rs6fz0086xpkcvxg21sir	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO WIZA SOLUTIONS WIFI FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-915.00	2026-02-28 20:24:42.905
cmm6rs6fz0087xpkc996otleu	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	WIZA SOLUTIONS WIFI FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0088xpkceb8b9cjh	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz0089xpkc7o0tpe4i	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-2700.00	2026-02-28 20:24:42.905
cmm6rs6fz008axpkceyzzxz5d	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-2700.00	2026-02-28 20:24:42.905
cmm6rs6fz008bxpkcxe4aeamj	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fz008cxpkcc03evdzt	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE UNLOAD FROM VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fz008dxpkchme11rxo	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fz008expkcnx78q8e6	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fz008fxpkcjomuyvkw	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6fz008gxpkc7jhzrw9x	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz008hxpkcgqtmwyxr	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz008ixpkcy01yxk9m	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz008jxpkcxyeh7fkk	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM SD	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz008kxpkccgukwuml	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM SD AUTOBANK CASH WITHDRAWAL AT -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz008lxpkcfz31jnb4	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008mxpkcj9fdnmtt	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT H - - T : :	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008nxpkcsm7f6x1k	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT H - - T : : CASH WITHDRAWAL FEE ## -	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008oxpkc6ow736d2	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008pxpkc4ojcgzsv	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT H - - T : :	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008qxpkclo6bdhlv	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT H - - T : : CASH WITHDRAWAL FEE ## -	\N	-8000.00	2026-02-28 20:24:42.905
cmm6rs6fz008rxpkc1a47af2x	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fz008sxpkctjo4p6nb	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ## IB PAYMENT TO -	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fz008txpkcgfsr2mwq	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH WITHDRAWAL FEE ## IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:24:42.905
cmm6rs6fz008uxpkcod0kutns	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO	\N	-1900.00	2026-02-28 20:24:42.905
cmm6rs6fz008vxpkchq9at9vn	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO PJOHN SHEDZA RENT	\N	-1900.00	2026-02-28 20:24:42.905
cmm6rs6fz008wxpkcwt3zk4kv	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	IB PAYMENT TO PJOHN SHEDZA RENT FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1900.00	2026-02-28 20:24:42.905
cmm6rs6fz008xxpkca9sd22qu	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	PJOHN SHEDZA RENT FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz008yxpkcr4bte9vw	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-576.20	2026-02-28 20:24:42.905
cmm6rs6fz008zxpkc8k5fn7su	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fz0090xpkckdy3b1iy	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6fz0091xpkcyow0ksvl	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz0092xpkcisoewy3g	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz0093xpkcpncyhoyg	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz0094xpkcclu90mwm	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz0095xpkcn0x4rin1	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz0096xpkcy0t6tnzm	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - CHEQUE CARD PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz0097xpkc1s7zrpy2	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz0098xpkchw9yqiuz	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz0099xpkcltei5n91	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE - BUCO SIMONSTO * JAN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009axpkc2wfj4jzy	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CHEQUE CARD PURCHASE	\N	-99.99	2026-02-28 20:24:42.905
cmm6rs6fz009bxpkc1z1y17on	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CHEQUE CARD PURCHASE BUCO SIMONSTO * JAN	\N	-99.99	2026-02-28 20:24:42.905
cmm6rs6fz009cxpkcwf4zfb2g	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CHEQUE CARD PURCHASE BUCO SIMONSTO * JAN AUTOBANK CASH DEPOSIT	\N	-99.99	2026-02-28 20:24:42.905
cmm6rs6fz009dxpkce3z4g6i8	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT FEE - AUTOBANK ##	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6fz009expkce5z02h8g	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT FEE - AUTOBANK ## AUTOBANK CASH DEPOSIT	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6fz009fxpkc7sv4huh9	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6fz009gxpkcv1nmnjlr	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## AUTOBANK CASH DEPOSIT	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6fz009hxpkcbrowyilr	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fz009ixpkch9mufk3s	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fz009jxpkcsil30gpl	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fz009kxpkc8gjnk7qm	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER SOSO	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fz009lxpkcbr7xtmlh	cmm6rs6eu0001xpkcnatybimm	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER SOSO VALUE LOADED TO VIRTUAL CARD -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6fz009mxpkcuuw53s61	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6fz009nxpkcqe0axl05	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6fz009oxpkcos48ysl5	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6fz009pxpkc43qrhybz	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6fz009qxpkc9m2zh5p9	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6fz009rxpkcvqshhpxv	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fz009sxpkcrf3pk6xb	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fz009txpkcm0utn2vo	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6fz009uxpkc9xpsbfu2	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009vxpkcov4o800h	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009wxpkcrgn5wagn	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009xxpkcl7xtwj1t	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009yxpkc5icwww2m	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz009zxpkcwqbgszgg	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz00a0xpkcd7h0vfbu	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz00a1xpkclb2bbk2q	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM MIKE MWIWA WIFI	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6fz00a2xpkcfd8bntge	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	WAGES IB PAYMENT TO	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a3xpkcxaf21ruw	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	WAGES IB PAYMENT TO BLUEDOG TECHNOLOGY	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a4xpkc6cb2x2gb	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	WAGES IB PAYMENT TO BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a5xpkck4pg5jd0	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	IB PAYMENT TO	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a6xpkca32oecwp	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	IB PAYMENT TO BLUEDOG TECHNOLOGY	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a7xpkcckw8p18x	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	IB PAYMENT TO BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-1400.00	2026-02-28 20:24:42.905
cmm6rs6fz00a8xpkcmgzyte0s	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz00a9xpkcf70wplcv	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz00aaxpkcxsrzzboe	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## CELLPHONE INSTANTMON CASH TO -	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6fz00abxpkcvd7a5pwq	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fz00acxpkcly9yy1n5	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fz00adxpkclc9aypmv	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-2000.00	2026-02-28 20:24:42.905
cmm6rs6fz00aexpkc3jg1oclt	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	H FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00afxpkc2v5ecyjf	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	H FEE - INSTANT MONEY ## -- of --	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00agxpkcb0lct180	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	H FEE - INSTANT MONEY ## -- of -- BLUE ROUTE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00ahxpkc3hp7e5sa	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00aixpkch9ohrjp4	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE - INSTANT MONEY ## -- of --	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00ajxpkctq2erwhs	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE - INSTANT MONEY ## -- of -- BLUE ROUTE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00akxpkca9s9pkr4	cmm6rs6eu0001xpkcnatybimm	2026-02-02 00:00:00	FEE - INSTANT MONEY ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6fz00alxpkcgvyfuek0	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fz00amxpkc7ew9bfeb	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fz00anxpkcgo5atshm	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fz00aoxpkco09u977g	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-1500.00	2026-02-28 20:24:42.905
cmm6rs6fz00apxpkcbxvp16xx	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-115.00	2026-02-28 20:24:42.905
cmm6rs6fz00aqxpkcg7w382nn	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD LOTTERY PURCHASE -	\N	-115.00	2026-02-28 20:24:42.905
cmm6rs6fz00arxpkc6ej13wp8	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD LOTTERY PURCHASE - VAS POWERBALL	\N	-115.00	2026-02-28 20:24:42.905
cmm6rs6fz00asxpkch1241084	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g000atxpkcvgi72qf4	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE VAS POWERBALL	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g000auxpkcfjgpsoh5	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g000avxpkcw4d38fom	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000awxpkc380z0r6n	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000axxpkc2okj1i74	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000ayxpkcc2ptspjx	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000azxpkcgjnkmsqy	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000b0xpkc5mvzbxtu	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g000b1xpkcicgvbttt	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE VAS LOTTO	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g000b2xpkcstt56usy	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	LOTTERY PURCHASE VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g000b3xpkc85y4kmue	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000b4xpkcf5wmc4oz	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000b5xpkcrgw8qpnr	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000b6xpkcq03ymlv7	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE LOTTERY PURCHASE ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000b7xpkctickmg63	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000b8xpkc6kciq73q	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000b9xpkc6duuu03f	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000baxpkcpcagkvf5	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bbxpkcxtpke345	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bcxpkcl4kzdu0u	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bdxpkcrbpmpkvo	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bexpkcbuqf2xqz	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bfxpkc2k1pthy3	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bgxpkcmsa2l7bx	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bhxpkcum7m2ttt	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bixpkcfsdsw5af	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bjxpkcj1rbhkjy	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bkxpkcfnvqs3xd	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000blxpkcy3fnbbyq	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bmxpkc1te8pppo	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rvio8003b134czumlhki6	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Jan Jan	\N	431.65	2026-02-28 20:27:18.726
cmm6rs6g000bnxpkcs9fyafx9	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-7598.26	2026-02-28 20:24:42.905
cmm6rs6g000boxpkceec8i60h	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bpxpkc5q217a1y	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000bqxpkcbh9pn3pp	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000brxpkc5q5z68pc	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g000bsxpkcb2a3wsle	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g000btxpkc7ytbf14x	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g000buxpkcsbwqx98n	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g000bvxpkcl18rozlp	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g000bwxpkc654zfbw6	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE UNLOAD FROM VIRTUAL CARD	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g000bxxpkcjk65p88l	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-149.98	2026-02-28 20:24:42.905
cmm6rs6g000byxpkcgvniclde	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE CHECKERS SUNV * JAN	\N	-149.98	2026-02-28 20:24:42.905
cmm6rs6g000bzxpkc7cs9nl8y	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE CHECKERS SUNV * JAN CHEQUE CARD PURCHASE -	\N	-149.98	2026-02-28 20:24:42.905
cmm6rs6g000c0xpkcl4e87vvo	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:24:42.905
cmm6rs6g000c1xpkcl97q4u1x	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE LIQUORSHOP SU * JAN	\N	-191.29	2026-02-28 20:24:42.905
cmm6rs6g000c2xpkc1k7eregm	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CHEQUE CARD PURCHASE LIQUORSHOP SU * JAN AUTOBANK CASH DEPOSIT	\N	-191.29	2026-02-28 20:24:42.905
cmm6rs6g000c3xpkchcviic17	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT FEE - AUTOBANK ##	\N	-10.80	2026-02-28 20:24:42.905
cmm6rs6g000c4xpkclcwisqe5	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT FEE - AUTOBANK ## LOTTERY WINNINGS	\N	-10.80	2026-02-28 20:24:42.905
cmm6rs6g000c5xpkcm31eq63p	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-10.80	2026-02-28 20:24:42.905
cmm6rs6g000c6xpkc69c5grrc	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## LOTTERY WINNINGS	\N	-10.80	2026-02-28 20:24:42.905
cmm6rs6g000c7xpkcvty51p7n	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## LOTTERY WINNINGS VAS	\N	-10.80	2026-02-28 20:24:42.905
cmm6rs6g000c8xpkc76ubv1t9	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT FEE - AUTOBANK ##	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6g000c9xpkcuhtvyfdo	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT FEE - AUTOBANK ## PREPAID MOBILE PURCHASE -	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6g000caxpkc1m9b6k9a	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6g000cbxpkcl6lcyce5	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## PREPAID MOBILE PURCHASE -	\N	-9.00	2026-02-28 20:24:42.905
cmm6rs6g000ccxpkcv6yvf35k	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000cdxpkcdasfez7b	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE VAS TELKM	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000cexpkc1nsmw5zu	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE VAS TELKM FEE: PREPAID MOBILE PURCHASE ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000cfxpkc5mwbescm	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS TELKM FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g000cgxpkcqk9s2ks5	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	VAS TELKM FEE: PREPAID MOBILE PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g000chxpkc1rxqgtbb	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g000cixpkckkrgy7hn	cmm6rs6eu0001xpkcnatybimm	2026-02-03 00:00:00	FEE: PREPAID MOBILE PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g000cjxpkce2a7y2kk	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-950.00	2026-02-28 20:24:42.905
cmm6rs6g000ckxpkcylubx0l4	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD AUTOBANK CASH DEPOSIT	\N	-950.00	2026-02-28 20:24:42.905
cmm6rs6g000clxpkc9rji559t	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	SAM CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g000cmxpkc2v19qfsj	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	SAM CASH DEPOSIT FEE - AUTOBANK ## VALUE UNLOAD FROM VIRTUAL CARD	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g000cnxpkchki13emm	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g000coxpkcr1thb6p6	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VALUE UNLOAD FROM VIRTUAL CARD	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g000cpxpkciuyf2kjw	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000cqxpkcz73v8val	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000crxpkc4f8fd4vz	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000csxpkcs5qk2r9t	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000ctxpkcl47mlbg0	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000cuxpkcda5dua4p	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000cvxpkcnel4wcxu	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000cwxpkciz9buggx	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000cxxpkco9g3p9nb	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000cyxpkccpcase9h	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000czxpkch6bjf3c0	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-7306.97	2026-02-28 20:24:42.905
cmm6rs6g000d0xpkc0pgymg4x	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d1xpkcimaaaer9	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d2xpkcewqvw89l	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d3xpkccfr4in8c	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d4xpkc6b9u350g	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000d5xpkcb16yqckm	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g000d6xpkcd6o0h2lw	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d7xpkcgwt9o0tg	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d8xpkcp6whstj5	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000d9xpkc0suuxaf3	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000daxpkc3o43tx1h	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g000dbxpkco6s2s4x5	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g000dcxpkcbjtmtdw3	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g000ddxpkc48how23b	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g000dexpkcrmo25tsc	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	H FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g000dfxpkcsuo9w364	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	H FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g000dgxpkcbtcvof7t	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	H FEE - INSTANT MONEY ## H EDIT TRANSFER	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g000dhxpkcwfnkufot	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g000dixpkc3wksusfr	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g100djxpkc5h1llfn2	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE - INSTANT MONEY ## H EDIT TRANSFER	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g100dkxpkc8n7xrafz	cmm6rs6eu0001xpkcnatybimm	2026-02-04 00:00:00	FEE - INSTANT MONEY ## H EDIT TRANSFER CAPITEC N NJOLI	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g100dlxpkc824jfnda	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100dmxpkcr3ek35gz	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100dnxpkcweneglkk	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100doxpkcor2erwec	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100dpxpkcvh89nckm	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100dqxpkcu656szmr	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100drxpkcyuygx7bq	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100dsxpkc70rx1yur	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100dtxpkceka8zluo	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100duxpkctsgi1b0c	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100dvxpkcb7ld276q	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100dwxpkc7s0mk716	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100dxxpkcluu5tbv8	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1000.00	2026-02-28 20:24:42.905
cmm6rs6g100dyxpkcm3axk5pq	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-1000.00	2026-02-28 20:24:42.905
cmm6rs6g100dzxpkcsj1bejx3	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-1000.00	2026-02-28 20:24:42.905
cmm6rs6g100e0xpkcn6x6027s	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	H FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e1xpkch027j56c	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	H FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e2xpkcyu9r74ny	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	H FEE - INSTANT MONEY ## H LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e3xpkckbkcxj6x	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e4xpkclayy6bnt	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e5xpkcve5edts8	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE - INSTANT MONEY ## H LOTTERY PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e6xpkc5c2rhs02	cmm6rs6eu0001xpkcnatybimm	2026-02-05 00:00:00	FEE - INSTANT MONEY ## H LOTTERY PURCHASE - VAS POWERBALL	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e7xpkcfbmnuklm	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	H LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e8xpkce35nolxx	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	H LOTTERY PURCHASE VAS POWERBALL	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100e9xpkcqxgurn7u	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	H LOTTERY PURCHASE VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100eaxpkcpoyxajqb	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100ebxpkch7it9qba	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE VAS POWERBALL	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100ecxpkcu2y2roj1	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g100edxpkc4wqw109y	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100eexpkc5va06snq	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100efxpkcoydsec91	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100egxpkc9xf8dd2g	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100ehxpkcnqguln50	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100eixpkci7gwphn4	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g100ejxpkcmc30euh2	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE VAS LOTTO	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g100ekxpkcjp1vkkr5	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	LOTTERY PURCHASE VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g100elxpkcsajk5p6v	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100emxpkcn1u0t2gp	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100enxpkc9vj60c2i	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE LOTTERY PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100eoxpkcwbhf1hub	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g100epxpkci3qg1nwf	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g100eqxpkctqlhoqf8	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g100erxpkctk1q0q7w	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100esxpkckuyqren1	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100etxpkcme1n77qp	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g100euxpkc94ekyk56	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100evxpkc2hky8wd7	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100ewxpkcogk36rv0	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100exxpkcf2fbmsr2	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100eyxpkceg08dgv6	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM HWB	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100ezxpkc97c35jjm	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## EAL TIME TRANSFER FROM HWB LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f0xpkc818ast1u	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100f1xpkcljuk2426	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100f2xpkcayajvoz6	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS BLU VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100f3xpkcdwkcxt6y	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f4xpkcte02ur9x	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS BLU VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f5xpkc8cx4idsx	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f6xpkct3h1brfy	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS BLU VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f7xpkcs54dg9yq	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f8xpkcwft2mkxg	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100f9xpkcz7rb10d7	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100faxpkc90ttni8w	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100fbxpkcn79af5e6	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - INSURANCE PREMIUM -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100fcxpkcxslb39r6	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fdxpkcpd1w49xb	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ## INSURANCE PREMIUM -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fexpkcelk33y3i	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER ## INSURANCE PREMIUM - JAC P F T CIN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100ffxpkclszr4lwt	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## INSURANCE PREMIUM -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fgxpkc8p5vcsbu	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## INSURANCE PREMIUM - JAC P F T CIN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fhxpkc4hcrdisd	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE: VOUCHER ## INSURANCE PREMIUM - JAC P F T CIN FEE - DEBIT ORDER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fixpkckd08g17a	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	INSURANCE PREMIUM	\N	-1076.81	2026-02-28 20:24:42.905
cmm6rs6g100fjxpkcyrsc97j9	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	INSURANCE PREMIUM JAC P F T CIN	\N	-1076.81	2026-02-28 20:24:42.905
cmm6rs6g100fkxpkcnnkuyxo4	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	INSURANCE PREMIUM JAC P F T CIN FEE - DEBIT ORDER ## -	\N	-1076.81	2026-02-28 20:24:42.905
cmm6rs6g100flxpkcy3d4zz03	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	JAC P F T CIN FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g100fmxpkcy6hfttl7	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	JAC P F T CIN FEE - DEBIT ORDER ## VOUCHER PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g100fnxpkcooe8b5ir	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g100foxpkcrrv3ddxl	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE - DEBIT ORDER ## VOUCHER PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g100fpxpkcgartnriy	cmm6rs6eu0001xpkcnatybimm	2026-02-06 00:00:00	FEE - DEBIT ORDER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g100fqxpkc3bhp3svy	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100frxpkcot63z9na	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100fsxpkcp9wnqq5d	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100ftxpkczqy0ws54	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g100fuxpkc048euftw	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g100fvxpkcazhdkj7k	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200fwxpkcustw9s7d	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200fxxpkcs66kg996	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200fyxpkc15q1w516	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200fzxpkc4jb5lwwj	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g0xpkc29yg5lto	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g1xpkc07sfm039	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - CELLPHONE INSTANTMON CASH TO -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200g2xpkcd8ib395g	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g3xpkc6i6x90t4	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g4xpkc2emer3ti	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g5xpkcuy256vs7	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE: VOUCHER ## CELLPHONE INSTANTMON CASH TO - H FEE - INSTANT MONEY ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200g6xpkcoxra3brc	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2800.00	2026-02-28 20:24:42.905
cmm6rs6g200g7xpkcotni6f4v	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-2800.00	2026-02-28 20:24:42.905
cmm6rs6g200g8xpkcpa781prt	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-2800.00	2026-02-28 20:24:42.905
cmm6rs6g200g9xpkcd4kef32d	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	H FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gaxpkcxdxw46l3	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	H FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gbxpkchl87jz1l	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	H FEE - INSTANT MONEY ## H VALUE LOADED TO VIRTUAL CARD -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gcxpkcxaer54zy	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gdxpkcbecjiu42	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gexpkcwlysuh4c	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	FEE - INSTANT MONEY ## H VALUE LOADED TO VIRTUAL CARD -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g200gfxpkc3pjlhho6	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200ggxpkc49sy1tq1	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200ghxpkcx5so6u38	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200gixpkcbdpkbgay	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200gjxpkcizwj2ktl	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g200gkxpkclpmk28tb	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD AUTOBANK CASH DEPOSIT	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g200glxpkcqm5uwokq	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ## -	\N	-753.34	2026-02-28 20:24:42.905
cmm6rs6g200gmxpkcnl0wbcxf	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ##	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6g200gnxpkc03j1s6cg	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT FEE - AUTOBANK ## VALUE LOADED TO VIRTUAL CARD -	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6g200goxpkcrj5kjjmh	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6g200gpxpkcan198vbu	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VALUE LOADED TO VIRTUAL CARD -	\N	-5.40	2026-02-28 20:24:42.905
cmm6rs6g200gqxpkcgpfp9d0x	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:24:42.905
cmm6rs6g200grxpkcx3jfbw6r	cmm6rs6eu0001xpkcnatybimm	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE UNLOAD FROM VIRTUAL CARD	\N	-350.00	2026-02-28 20:24:42.905
cmm6rs6g200gsxpkch64hjc6i	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200gtxpkc6c7hh94n	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200guxpkcb34wfkzs	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200gvxpkcy0jjhfgo	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200gwxpkc4ypdh9f0	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200gxxpkcre2vzszb	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200gyxpkcv4vemasw	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200gzxpkc5vr7os8f	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h0xpkca6zlpd6o	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h1xpkcr8xy8z8j	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h2xpkcnfnmbaog	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h3xpkcyf998oe3	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g200h4xpkcwngsgjim	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h5xpkct6dc3k06	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h6xpkcul0o2k4r	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200h7xpkc2c81q4pu	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200h8xpkc1coihxvi	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD PAYSHAP PAYMENT FROM	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200h9xpkc4h8zwenq	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD PAYSHAP PAYMENT FROM WAGES	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g200haxpkc0a4ikm41	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:24:42.905
cmm6rs6g200hbxpkc6j4vhzdz	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD LOTTERY PURCHASE -	\N	-365.00	2026-02-28 20:24:42.905
cmm6rs6g200hcxpkc9egs62w4	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:24:42.905
cmm6rs6g200hdxpkcxen8qs6u	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD LOTTERY PURCHASE -	\N	-365.00	2026-02-28 20:24:42.905
cmm6rs6g200hexpkcio3mja58	cmm6rs6eu0001xpkcnatybimm	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD LOTTERY PURCHASE - VAS POWERBALL	\N	-365.00	2026-02-28 20:24:42.905
cmm6rs6g200hfxpkc38bvk70h	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-45.00	2026-02-28 20:24:42.905
cmm6rs6g200hgxpkcxzj4cho4	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE VAS POWERBALL	\N	-45.00	2026-02-28 20:24:42.905
cmm6rs6g200hhxpkcwruoztxa	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-45.00	2026-02-28 20:24:42.905
cmm6rs6g200hixpkcoic0wqzy	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200hjxpkcvm4khjjq	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200hkxpkcdzw3ff7s	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200hlxpkcxt9v9qjx	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200hmxpkcoz7drbqc	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## LOTTERY PURCHASE - VAS LOTTO	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g200hnxpkc95r1e31m	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6g300hoxpkcb0dq3q54	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE VAS LOTTO	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6g300hpxpkc2netr6jz	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	LOTTERY PURCHASE VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-60.00	2026-02-28 20:24:42.905
cmm6rs6g300hqxpkc5zefq141	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300hrxpkckcxpqjvm	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300hsxpkci2ydedfe	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE LOTTERY PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300htxpkckqc7neh4	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1600.00	2026-02-28 20:24:42.905
cmm6rs6g300huxpkcfswqinhv	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-1600.00	2026-02-28 20:24:42.905
cmm6rs6g300hvxpkcdurc1ekc	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-250.00	2026-02-28 20:24:42.905
cmm6rs6g300hwxpkct5tpbtb6	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-250.00	2026-02-28 20:24:42.905
cmm6rs6g300hxxpkcgktqmwuo	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS VOUCHER	\N	-250.00	2026-02-28 20:24:42.905
cmm6rs6g300hyxpkcwmz5h54q	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300hzxpkcaegzv852	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300i0xpkc0f499v9k	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300i1xpkcgj6ljhr6	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300i2xpkcj7so8khl	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i3xpkczk8xomqw	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i4xpkcke6zjd8t	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i5xpkcl6hg9qnt	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i6xpkcn26mr9kb	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i7xpkcevmlfr74	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i8xpkcc780w6p2	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300i9xpkcfpwm4yhg	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - EDIT TRANSFER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300iaxpkcvldi4nz0	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## EDIT TRANSFER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ibxpkcj892j6fr	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER ## EDIT TRANSFER PAYACCSYS C ADE A	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300icxpkchrrg6veo	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## EDIT TRANSFER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300idxpkcpboey9sr	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## EDIT TRANSFER PAYACCSYS C ADE A	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300iexpkcjael5m0s	cmm6rs6eu0001xpkcnatybimm	2026-02-10 00:00:00	FEE: VOUCHER ## EDIT TRANSFER PAYACCSYS C ADE A -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ifxpkcryaijr2f	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-1325.81	2026-02-28 20:24:42.905
cmm6rs6g300igxpkctncdus24	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300ihxpkcksd9cabh	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300iixpkcoe017drm	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300ijxpkc1u7zc1z8	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300ikxpkchwxcglai	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ilxpkccb9hy8cv	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300imxpkch1t6j0tr	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300inxpkcd5z3z3qt	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ioxpkc2dexjvlz	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ipxpkcoer6frh6	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300iqxpkco8gybtj3	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS VOUCHER FEE: VOUCHER ## -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300irxpkci9ltkl4c	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS VOUCHER FEE: VOUCHER ## - VALUE LOADED TO VIRTUAL CARD -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g300isxpkcqzqlkmuc	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300itxpkct2v504hl	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300iuxpkcn3fgcl71	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300ivxpkcl2vz1myv	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g300iwxpkckrk7vayp	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g300ixxpkcjjlq50pt	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300iyxpkcmg06yu24	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300izxpkcjystfmp6	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g300j0xpkc2hmq7nt8	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-50.00	2026-02-28 20:24:42.905
cmm6rs6g300j1xpkc1jt7brkz	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g300j2xpkcxnop8fxo	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g300j3xpkcrdhwdfg9	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g300j4xpkcw6nj0v84	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300j5xpkcg2qvneeg	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300j6xpkcq1x40gvx	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300j7xpkc9elkok9k	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300j8xpkc6nh3k81w	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300j9xpkck8u9u5r9	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300jaxpkcw86qrrnr	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g300jbxpkca7uy6o25	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jcxpkcxiwh7pzr	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO BRIAN	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jdxpkc4uawvc3m	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO BRIAN FEE: PAYSHAP PAYMENT ## -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jexpkcrj8icqmc	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jfxpkc9q2yg6f9	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	PAYSHAP PAYMENT TO BRIAN	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jgxpkcg95calet	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	PAYSHAP PAYMENT TO BRIAN FEE: PAYSHAP PAYMENT ## -	\N	-300.00	2026-02-28 20:24:42.905
cmm6rs6g300jhxpkc02sz4psl	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	BRIAN FEE: PAYSHAP PAYMENT ##	\N	-7.00	2026-02-28 20:24:42.905
cmm6rs6g300jixpkc0cu0csl4	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	BRIAN FEE: PAYSHAP PAYMENT ## VALUE LOADED TO VIRTUAL CARD -	\N	-7.00	2026-02-28 20:24:42.905
cmm6rs6g300jjxpkcf84wahub	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: PAYSHAP PAYMENT ##	\N	-7.00	2026-02-28 20:24:42.905
cmm6rs6g300jkxpkc7638sqs6	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE: PAYSHAP PAYMENT ## VALUE LOADED TO VIRTUAL CARD -	\N	-7.00	2026-02-28 20:24:42.905
cmm6rs6g300jlxpkcgx7lp6v2	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300jmxpkcbzafszs6	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD EAL TIME TRANSFER FROM	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300jnxpkc0kmrk7ls	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300joxpkcyv1nyedz	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO -- of --	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300jpxpkcfldjofvt	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO -- of -- BLUE ROUTE	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300jqxpkcqts8672i	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300jrxpkcu88mxyus	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO -- of --	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300jsxpkctpkzjq5f	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO -- of -- BLUE ROUTE	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300jtxpkc5hsjaq8x	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-5000.00	2026-02-28 20:24:42.905
cmm6rs6g300juxpkc7avfhbxh	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H FEE - INSTANT MONEY ## -	\N	-1590.31	2026-02-28 20:24:42.905
cmm6rs6g300jvxpkc74y2q6tt	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	H FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300jwxpkcy61xdr0w	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	H FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300jxxpkc0my2o5pd	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	H FEE - INSTANT MONEY ## H VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300jyxpkcahme2x0q	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE - INSTANT MONEY ##	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300jzxpkcxn1xggzl	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE - INSTANT MONEY ## H	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300k0xpkcuiqls7zq	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE - INSTANT MONEY ## H VOUCHER PURCHASE -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300k1xpkcxvew19ua	cmm6rs6eu0001xpkcnatybimm	2026-02-11 00:00:00	FEE - INSTANT MONEY ## H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g300k2xpkczu5prnox	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	H VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300k3xpkcqlleyghv	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	H VOUCHER PURCHASE VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300k4xpkcxeo1x1d2	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	H VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300k5xpkck19jkwob	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300k6xpkcm31m6ue6	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g300k7xpkc17y0wosp	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400k8xpkc6p41dyts	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400k9xpkcdmmb8ycu	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400kaxpkcwklp2p0u	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400kbxpkcvol3jn0a	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400kcxpkcsg6z69tm	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400kdxpkcubpc82gz	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400kexpkcnbrwg092	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g400kfxpkcjdh0a47o	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g400kgxpkcpe18mp2l	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g400khxpkcrkz3twyj	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g400kixpkc1xwfusxt	cmm6rs6eu0001xpkcnatybimm	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g400kjxpkc90jizcnk	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400kkxpkcjezqhlfh	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400klxpkchgjp38pe	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400kmxpkchzspxicv	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD CELLPHONE INSTANTMON CASH TO -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400knxpkcgv01mgte	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g400koxpkcijx1fh4p	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g400kpxpkcduryk70h	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g400kqxpkcuz60ipeo	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	H FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400krxpkcpc7ozk5j	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	H FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400ksxpkcnsaglwnt	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	H FEE - INSTANT MONEY ## H VOUCHER PURCHASE -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400ktxpkc7pz8hx8z	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400kuxpkczicckv62	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400kvxpkcj55grj0u	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	FEE - INSTANT MONEY ## H VOUCHER PURCHASE -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400kwxpkcx9i7jo5g	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	FEE - INSTANT MONEY ## H VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g400kxxpkcj0qrcbfa	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	ASTRON ENERGY * CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:24:42.905
cmm6rs6g400kyxpkcku4ox8ow	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	ASTRON ENERGY * CHEQUE CARD PURCHASE HPY*FISH AND * FEB	\N	-120.00	2026-02-28 20:24:42.905
cmm6rs6g400kzxpkc69im02zd	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	HPY*FISH AND * CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:24:42.905
cmm6rs6g400l0xpkcdw8htqzn	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	HPY*FISH AND * CHEQUE CARD PURCHASE SPAR FISH HOE * FEB	\N	-106.17	2026-02-28 20:24:42.905
cmm6rs6g400l1xpkcw055u5au	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	SPAR FISH HOE * VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6g400l2xpkcnge22zfs	cmm6rs6eu0001xpkcnatybimm	2026-02-13 00:00:00	SPAR FISH HOE * VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6g400l3xpkcvf9ek2io	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	H VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l4xpkc6eoyz72a	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	H VOUCHER PURCHASE VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l5xpkc8zotythb	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	H VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l6xpkc7fm9nqlx	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l7xpkczqfwd8xs	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l8xpkcomfraa15	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g400l9xpkcab3m7ctp	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400laxpkcajqxvomj	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lbxpkclbazksmt	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lcxpkcpq4my9oc	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400ldxpkcs88l5n1x	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lexpkcy9g1nmlk	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lfxpkcpkxw2iog	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lgxpkcqkrxz73n	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## PREPAID MOBILE PURCHASE - VAS VODA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lhxpkc58v9vk5q	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6g400lixpkcfjiwbseu	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE VAS VODA	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6g400ljxpkcfs9kme56	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-55.00	2026-02-28 20:24:42.905
cmm6rs6g400lkxpkctx6x5to9	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400llxpkcwy9odx1m	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400lmxpkci2ovoto9	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400lnxpkcrogbcmta	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ## VOUCHER PURCHASE -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400loxpkcjlpahrfe	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lpxpkca2gvyxud	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lqxpkc96e10whv	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lrxpkcs5tjxdc6	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lsxpkc88elqeel	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400ltxpkcpodhs83k	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-1116.94	2026-02-28 20:24:42.905
cmm6rs6g400luxpkcqkyjgvva	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lvxpkcibtvn5eo	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lwxpkcnfisxksz	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM BET I ZRANTIEBMSA	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g400lxxpkc2zvqazwr	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:24:42.905
cmm6rs6g400lyxpkcd6z62z4u	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE VAS VODA	\N	-29.00	2026-02-28 20:24:42.905
cmm6rs6g400lzxpkc7q5tw0gp	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:24:42.905
cmm6rs6g400m0xpkcgu1at4v9	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE VAS VODA	\N	-29.00	2026-02-28 20:24:42.905
cmm6rs6g400m1xpkcv949vtlr	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE VAS VODA FEE: PREPAID MOBILE PURCHASE ## -	\N	-29.00	2026-02-28 20:24:42.905
cmm6rs6g400m2xpkcvzbbromq	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400m3xpkcrzpzvorb	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE ## VALUE LOADED TO VIRTUAL CARD -	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g400m4xpkckhvcwua3	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:24:42.905
cmm6rs6g400m5xpkcngadbdqa	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD AUTOBANK CASH DEPOSIT	\N	-350.00	2026-02-28 20:24:42.905
cmm6rs6g400m6xpkcblyes8l3	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT FEE - AUTOBANK ##	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g400m7xpkc5x8ij2j8	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g400m8xpkcrm5zy0cp	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g400m9xpkcs3hnavbw	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g400maxpkcb4qnnwhr	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## EDIT TRANSFER PAYACCSYS DCB	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g400mbxpkc4xlbenpo	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mcxpkcee60eu98	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT WI ZA NETCASH	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mdxpkcrdteqkvj	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT WI ZA NETCASH FEE - DEBIT ORDER ## -	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mexpkc75ktra06	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mfxpkco2dbwpwi	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	SERVICE AGREEMENT WI ZA NETCASH	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mgxpkcccyfrxxs	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	SERVICE AGREEMENT WI ZA NETCASH FEE - DEBIT ORDER ## -	\N	-913.00	2026-02-28 20:24:42.905
cmm6rs6g400mhxpkc2yxxha47	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	WI ZA NETCASH FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g400mixpkckh0zi0zt	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	WI ZA NETCASH FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g400mjxpkcu6lu9x33	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE - DEBIT ORDER ##	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g400mkxpkc6nrlw9w9	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE -	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g400mlxpkcf5nibumr	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	FEE - DEBIT ORDER ## CHEQUE CARD PURCHASE - ASTRON ENERGY * FEB	\N	-3.50	2026-02-28 20:24:42.905
cmm6rs6g400mmxpkciawgmzbp	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 20:24:42.905
cmm6rs6g400mnxpkc4asqm42o	cmm6rs6eu0001xpkcnatybimm	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD VOUCHER PURCHASE -	\N	-115.86	2026-02-28 20:24:42.905
cmm6rs6g400moxpkcmfwhjz3u	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400mpxpkceaxj0xgt	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE ASTRON ENERGY * FEB	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400mqxpkcq6jh4wg7	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE ASTRON ENERGY * FEB CHEQUE CARD PURCHASE -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g400mrxpkcvvqm01ch	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:24:42.905
cmm6rs6g400msxpkcj3anexhp	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE HPY*FISH AND * FEB	\N	-120.00	2026-02-28 20:24:42.905
cmm6rs6g400mtxpkcu6lwbnj4	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE HPY*FISH AND * FEB CHEQUE CARD PURCHASE -	\N	-120.00	2026-02-28 20:24:42.905
cmm6rs6g400muxpkcmncepew7	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:24:42.905
cmm6rs6g400mvxpkccicw33g8	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE SPAR FISH HOE * FEB	\N	-106.17	2026-02-28 20:24:42.905
cmm6rs6g400mwxpkc3yupib4n	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	CHEQUE CARD PURCHASE SPAR FISH HOE * FEB VALUE LOADED TO VIRTUAL CARD -	\N	-106.17	2026-02-28 20:24:42.905
cmm6rs6g400mxxpkc48c7ar8x	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6g400myxpkcm665p6gy	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD VALUE LOADED TO VIRTUAL CARD -	\N	-160.00	2026-02-28 20:24:42.905
cmm6rs6g500mzxpkc1l1be69c	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-240.00	2026-02-28 20:24:42.905
cmm6rs6g500n0xpkctkq9wriv	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD EDIT TRANSFER	\N	-240.00	2026-02-28 20:24:42.905
cmm6rs6g500n1xpkce1pspgn3	cmm6rs6eu0001xpkcnatybimm	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD EDIT TRANSFER STP -	\N	-240.00	2026-02-28 20:24:42.905
cmm6rs6g500n2xpkc6tbfh60d	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	STP - VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n3xpkcwi3rizz9	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	STP - VOUCHER PURCHASE VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n4xpkcn0g0n15w	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	STP - VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n5xpkck77gojqi	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n6xpkc1kwoll9j	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n7xpkckp82yhzx	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-90.00	2026-02-28 20:24:42.905
cmm6rs6g500n8xpkck4usrvzp	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500n9xpkcldcwiud3	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500naxpkctnwbdpao	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500nbxpkc5l1atri2	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ncxpkcpobondio	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ndxpkcvgmdjq8j	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500nexpkcxuoaxk02	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ngxpkc6e5ssy7v	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	ROUTER IB PAYMENT TO JAYDI COMPUTERS INSURANCE	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6g500nhxpkcidse2ogv	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	ROUTER IB PAYMENT TO JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6g500nixpkc3y3vaqct	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	IB PAYMENT TO	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6g500njxpkc8gbqwqyz	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	IB PAYMENT TO JAYDI COMPUTERS INSURANCE	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6g500nkxpkcmhyknksz	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	IB PAYMENT TO JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-2494.99	2026-02-28 20:24:42.905
cmm6rs6g500nlxpkcxf3g5y04	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500nmxpkcgrwcxiw0	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500nnxpkcp7aq0tod	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## PAYSHAP PAYMENT FROM	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500noxpkc0exvh5pq	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-52.93	2026-02-28 20:24:42.905
cmm6rs6g500npxpkcwpm2rn9a	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-52.93	2026-02-28 20:24:42.905
cmm6rs6g500nqxpkch0xfdudt	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-52.93	2026-02-28 20:24:42.905
cmm6rs6g500nrxpkch2khwvos	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500nsxpkcjnis5rh9	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500ntxpkclc4kc3ho	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500nuxpkcoql6bld0	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500nvxpkcqiqa8tkh	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500nwxpkc9qv0wvt1	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500nxxpkcwjx5bma7	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-110.00	2026-02-28 20:24:42.905
cmm6rs6g500nyxpkcxpgw21t8	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-110.00	2026-02-28 20:24:42.905
cmm6rs6g500nzxpkcrdh8vv32	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-110.00	2026-02-28 20:24:42.905
cmm6rs6g500o0xpkc2tz44dlv	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o1xpkcmf572r76	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o2xpkccm8xlv9m	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE - SHELL KOMMETJ * FEB	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o3xpkcnlwc3y8w	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g500o4xpkc8yiddijs	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	CHEQUE CARD PURCHASE SHELL KOMMETJ * FEB	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g500o5xpkcru4d9peo	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	CHEQUE CARD PURCHASE SHELL KOMMETJ * FEB VALUE UNLOAD FROM VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g500o6xpkc9ax99s3v	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o7xpkc5x1edpex	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## LOTTERY WINNINGS VAS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o8xpkcd5x3pm4p	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## LOTTERY WINNINGS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500o9xpkcvtpr3y40	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## LOTTERY WINNINGS VAS	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500oaxpkclx0fmow8	cmm6rs6eu0001xpkcnatybimm	2026-02-17 00:00:00	FEE: VOUCHER ## LOTTERY WINNINGS VAS PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500obxpkcggh778ea	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500ocxpkcifx817jv	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTERY PURCHASE VAS LOTTO	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500odxpkcw6a0qb87	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTERY PURCHASE VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500oexpkcojjtrox4	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500ofxpkcsgkrszh6	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE VAS LOTTO	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500ogxpkc4982q0vc	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE VAS LOTTO FEE LOTTERY PURCHASE ## -	\N	-40.00	2026-02-28 20:24:42.905
cmm6rs6g500ohxpkc3vxysjdc	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500oixpkc4g7xh9xn	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ojxpkc9eflqwxk	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500okxpkc3c5o5mtt	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500olxpkc3n57y476	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500omxpkcd9cxf8a0	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500onxpkcc6v9ki73	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ooxpkcigbtythk	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD LOTTERY PURCHASE -	\N	-398.51	2026-02-28 20:24:42.905
cmm6rs6g500opxpkcw54ikz93	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g500oqxpkc2hi11lk2	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE VAS POWERBALL	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g500orxpkcyixwt9od	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	LOTTERY PURCHASE VAS POWERBALL FEE LOTTERY PURCHASE ## -	\N	-30.00	2026-02-28 20:24:42.905
cmm6rs6g500osxpkcmxoj4rw8	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500otxpkcfsgs88mj	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ouxpkc3jxg9h6y	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## PREPAID MOBILE PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ovxpkcxqwiykvg	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE LOTTERY PURCHASE ## PREPAID MOBILE PURCHASE - VAS CELLC	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500oxxpkctqf2gj6j	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE VAS CELLC	\N	-25.00	2026-02-28 20:24:42.905
cmm6rs6g500oyxpkc4vemgni3	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE VAS CELLC FEE: PREPAID MOBILE PURCHASE ## -	\N	-25.00	2026-02-28 20:24:42.905
cmm6rs6g500ozxpkchb9od5da	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS CELLC FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g500p0xpkc0uc1l9y5	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	VAS CELLC FEE: PREPAID MOBILE PURCHASE ## AUTOBANK CASH DEPOSIT	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g500p1xpkcqmxxdr9i	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE: PREPAID MOBILE PURCHASE ##	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g500p2xpkck5pwrdry	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	FEE: PREPAID MOBILE PURCHASE ## AUTOBANK CASH DEPOSIT	\N	-1.00	2026-02-28 20:24:42.905
cmm6rs6g500p3xpkc709iox1e	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT FEE - AUTOBANK ##	\N	-14.40	2026-02-28 20:24:42.905
cmm6rs6g500p4xpkc52xzkm4b	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT FEE - AUTOBANK ## AUTOBANK CASH DEPOSIT	\N	-14.40	2026-02-28 20:24:42.905
cmm6rs6g500p5xpkcsh11mk3z	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-14.40	2026-02-28 20:24:42.905
cmm6rs6g500p6xpkchz027oxu	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## AUTOBANK CASH DEPOSIT	\N	-14.40	2026-02-28 20:24:42.905
cmm6rs6g500p7xpkcmtl7ig0w	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g500p8xpkcq4acmbwq	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT FEE - AUTOBANK ## VALUE LOADED TO VIRTUAL CARD -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g500p9xpkczwgckio3	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g500paxpkc993g0khr	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## VALUE LOADED TO VIRTUAL CARD -	\N	-7.20	2026-02-28 20:24:42.905
cmm6rs6g500pbxpkchcyc14ce	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 20:24:42.905
cmm6rs6g500pcxpkckqf18dnr	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA	\N	-800.00	2026-02-28 20:24:42.905
cmm6rs6g500pdxpkck8ro4ev4	cmm6rs6eu0001xpkcnatybimm	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-800.00	2026-02-28 20:24:42.905
cmm6rs6g500pexpkcc1edfq6d	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500pfxpkcli8qfiow	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD IB PAYMENT TO -	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500pgxpkc5u5tam6f	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD IB PAYMENT TO - BLUEDOG TECHNOLOGY BENGO	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500phxpkcwnbs093u	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	IB PAYMENT TO	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500pixpkceuimal66	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	IB PAYMENT TO BLUEDOG TECHNOLOGY BENGO	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500pjxpkcsg0cxr2v	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	IB PAYMENT TO BLUEDOG TECHNOLOGY BENGO FEE-ELECTRONIC ACCOUNT PAYMENT ## -	\N	-450.00	2026-02-28 20:24:42.905
cmm6rs6g500pkxpkcrjrd5kez	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	BLUEDOG TECHNOLOGY BENGO FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500plxpkclldxc93m	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ##	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500pmxpkcbxa5vnwl	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT ## VALUE UNLOAD FROM VIRTUAL CARD	\N	-2.00	2026-02-28 20:24:42.905
cmm6rs6g500pnxpkca5w6q3va	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500poxpkcloiaq7yp	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500ppxpkc65lr6dax	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g500pqxpkcqjqpcmnb	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500prxpkcd1tnm9ue	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500psxpkcifkevqtu	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500ptxpkcsg77c6ql	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500puxpkcwkyosvuc	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500pvxpkch4i7bwao	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g500pwxpkc3agpvmoq	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	REF VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600pxxpkc75vdrbr9	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	REF VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600pyxpkclarkkvm9	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	REF VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600pzxpkct835ca6y	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q0xpkcwia49tv1	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q1xpkci3037mmr	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q2xpkc3l9086kw	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q3xpkca8xee7pe	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q4xpkc1fe4tv00	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q5xpkczc5n2b6a	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600q6xpkcon3ocxeg	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600q7xpkckdktibr0	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600q8xpkco5kt93n4	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600q9xpkcvtgvejpy	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qaxpkcqvld36yn	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qbxpkcayxfzs2e	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qcxpkc5b55pe3n	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## -- of -- BLUE ROUTE PO BOX MARSHALLTOWN	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qdxpkcuhidnvmt	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-996.14	2026-02-28 20:24:42.905
cmm6rs6g600qexpkcqzmgbxrc	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qfxpkcyhtfrf0q	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qgxpkc8q9z0y9a	cmm6rs6eu0001xpkcnatybimm	2026-02-19 00:00:00	FEE: VOUCHER ## CHEQUE CARD PURCHASE - HPY*FISH AND * FEB	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600qhxpkcmfhnao2j	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CHEQUE CARD PURCHASE	\N	-67.00	2026-02-28 20:24:42.905
cmm6rs6g600qixpkcs4k1jq3k	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CHEQUE CARD PURCHASE HPY*FISH AND * FEB	\N	-67.00	2026-02-28 20:24:42.905
cmm6rs6g600qjxpkcvl15r3tm	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CHEQUE CARD PURCHASE HPY*FISH AND * FEB PAYSHAP PAYMENT FROM	\N	-67.00	2026-02-28 20:24:42.905
cmm6rs6g600qkxpkc48f49eyj	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qlxpkc2t9yn8n4	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO H	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qmxpkcko3swbpo	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qnxpkc18noelw2	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qoxpkc76sxwchp	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qpxpkc7sxmlvm9	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-400.00	2026-02-28 20:24:42.905
cmm6rs6g600qqxpkc65r18sdn	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	H FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600qrxpkcm7uu4vrz	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	H FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600qsxpkchzbwdptg	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	H FEE - INSTANT MONEY ## H VALUE LOADED TO VIRTUAL CARD -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600qtxpkcui032jjz	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600quxpkcawuifd0o	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600qvxpkcn0qs5ku3	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	FEE - INSTANT MONEY ## H VALUE LOADED TO VIRTUAL CARD -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600qwxpkcetv96j05	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:24:42.905
cmm6rs6g600qxxpkciprjkpck	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-340.00	2026-02-28 20:24:42.905
cmm6rs6g600qyxpkcub1n5ztj	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:24:42.905
cmm6rs6g600qzxpkcm3wtqkur	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE -	\N	-340.00	2026-02-28 20:24:42.905
cmm6rs6g600r0xpkcy5yofikp	cmm6rs6eu0001xpkcnatybimm	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-340.00	2026-02-28 20:24:42.905
cmm6rs6g600r1xpkcngwxn2dk	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600r2xpkc5pl61z4g	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600r3xpkczecylufj	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600r4xpkcr4atrtwi	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600r5xpkcbpxbp4bh	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600r6xpkck15bvu6a	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600r7xpkccs7sschv	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600r8xpkcuugar6f1	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600r9xpkca6h1dj9h	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600raxpkcl9x9rup3	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600rbxpkcdeslmzns	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM -- of --	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600rcxpkcv8c4eyet	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE -	\N	-555.54	2026-02-28 20:24:42.905
cmm6rs6g600rdxpkciu05ahbm	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600rexpkc3y096fku	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE: VOUCHER ## PAYSHAP PAYMENT FROM EF AUTOBANK CASH DEPOSIT	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600rfxpkc1mpzpa97	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT FEE - AUTOBANK ##	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g600rgxpkc1emcmn19	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT FEE - AUTOBANK ## CELLPHONE INSTANTMON CASH TO -	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g600rhxpkcp2px6op5	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CASH DEPOSIT FEE - AUTOBANK ##	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g600rixpkcc184u7uz	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CASH DEPOSIT FEE - AUTOBANK ## CELLPHONE INSTANTMON CASH TO -	\N	-3.60	2026-02-28 20:24:42.905
cmm6rs6g600rjxpkctuim377p	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600rkxpkc5uu0n1o0	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO H	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600rlxpkcd8dwthkt	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600rmxpkc4njcp8tl	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	H FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rnxpkcj4vlqm8u	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600roxpkc09fn6kvb	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## H EAL TIME TRANSFER FROM	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rpxpkcnzjtkjpo	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ##	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rqxpkc35j58qlf	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ## H	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rrxpkcks0mel4l	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ## H EAL TIME TRANSFER FROM	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rsxpkc1zt2m1gu	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ## H EAL TIME TRANSFER FROM WI FI	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rtxpkcgqy9ykrp	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:24:42.905
cmm6rvio8003c134cgdg2m83u	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Jan Jan Closing Balance	\N	431.65	2026-02-28 20:27:18.726
cmm6rs6g600ruxpkcgg4cuo11	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO H	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600rvxpkc4wxrm902	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO H FEE - INSTANT MONEY ## -	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600rwxpkcrifinnzp	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	H FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rxxpkcg1l17bx0	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE -	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600ryxpkcysoir5ym	cmm6rs6eu0001xpkcnatybimm	2026-02-22 00:00:00	FEE - INSTANT MONEY ## H ELECTRICITY PURCHASE - VAS	\N	-10.00	2026-02-28 20:24:42.905
cmm6rs6g600rzxpkcda302qgv	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	H ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s0xpkcn7n5w7gx	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	H ELECTRICITY PURCHASE VAS	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s1xpkc1x3wkks9	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	H ELECTRICITY PURCHASE VAS FEE: ELECTRICITY PURCHASE ## -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s2xpkclsya1ki0	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s3xpkcnh0gahfs	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	ELECTRICITY PURCHASE VAS	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s4xpkc687tfl8x	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	ELECTRICITY PURCHASE VAS FEE: ELECTRICITY PURCHASE ## -	\N	-150.00	2026-02-28 20:24:42.905
cmm6rs6g600s5xpkcvoet693p	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VAS FEE: ELECTRICITY PURCHASE ##	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g600s6xpkcsg3wmgra	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VAS FEE: ELECTRICITY PURCHASE ## VOUCHER PURCHASE -	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g600s7xpkco84ywjx5	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ##	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g600s8xpkcq833r3ip	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ## VOUCHER PURCHASE -	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g600s9xpkc88i3h5ex	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-1.60	2026-02-28 20:24:42.905
cmm6rs6g600saxpkcxgs83kn5	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600sbxpkcn1kvse2t	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600scxpkc7x81j8zj	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VOUCHER PURCHASE VAS OTT VOUCHER FEE: VOUCHER ## -	\N	-100.00	2026-02-28 20:24:42.905
cmm6rs6g600sdxpkcquxi4bb7	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600sexpkc2ureegc5	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600sfxpkcakeqinxu	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: VOUCHER ##	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600sgxpkc7r7wd5yz	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600shxpkcfqetvhzd	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: VOUCHER ## VOUCHER PURCHASE - VAS OTT VOUCHER	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600sixpkcnixvb6cf	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600sjxpkcq74qgjao	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD -	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600skxpkcsdwl98lw	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	FEE: VOUCHER ## VALUE LOADED TO VIRTUAL CARD - PAYSHAP PAYMENT FROM	\N	-2.95	2026-02-28 20:24:42.905
cmm6rs6g600slxpkcvp0ybh4s	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600smxpkcqx09pdrb	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD PAYSHAP PAYMENT FROM	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600snxpkcw3b44xch	cmm6rs6eu0001xpkcnatybimm	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD PAYSHAP PAYMENT FROM EF	\N	-200.00	2026-02-28 20:24:42.905
cmm6rs6g600soxpkcy7yeqzex	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	VAS LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g600spxpkc3e6wcddw	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g700sqxpkc0vcudp0x	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g700srxpkcdixsdkqd	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g700ssxpkccrundxt4	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g700stxpkcvieg9s2y	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:24:42.905
cmm6rs6g700suxpkc5wq3q4c0	cmm6rs6eu0001xpkcnatybimm	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM EF	\N	-9.10	2026-02-28 20:24:42.905
cmm6rvio60002134curkobrv1	cmm6rvinv0001134cw8d0ajl3	0191-01-30 00:00:00	.	\N	-191.76	2026-02-28 20:27:18.726
cmm6rvio60003134clst43d0a	cmm6rvinv0001134cw8d0ajl3	0191-01-30 00:00:00	. Closing Balance	\N	-191.76	2026-02-28 20:27:18.726
cmm6rvio60004134cfqts350t	cmm6rvinv0001134cw8d0ajl3	0191-01-30 00:00:00	. Closing Balance Turnover for Statement Period	\N	-191.76	2026-02-28 20:27:18.726
cmm6rvio60005134cbddv4n50	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Accrued Bank Charges Fuel Purchase Valley Motors BP * Dec	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio60006134cyxagh0ul	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Bank Charges Fuel Purchase Valley Motors BP * Dec	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio60007134cofya6du4	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Bank Charges Fuel Purchase Valley Motors BP * Dec Jan ADT Cash Deposit Lngbeach Previous Ndlovu	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio60008134czd5ohe9o	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Charges Fuel Purchase Valley Motors BP * Dec	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio60009134cjeauim31	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Charges Fuel Purchase Valley Motors BP * Dec Jan ADT Cash Deposit Lngbeach Previous Ndlovu	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio6000a134cnrecg6e0	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Fuel Purchase Valley Motors BP * Dec	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio6000b134cyueqift0	cmm6rvinv0001134cw8d0ajl3	2026-01-01 00:00:00	Fuel Purchase Valley Motors BP * Dec Jan ADT Cash Deposit Lngbeach Previous Ndlovu	\N	-100.02	2026-02-28 20:27:18.726
cmm6rvio6000c134ceh059uw8	cmm6rvinv0001134cw8d0ajl3	2026-01-02 00:00:00	ADT Cash Deposit Lngbeach Previous Ndlovu Cr	\N	350.00	2026-02-28 20:27:18.726
cmm6rvio6000d134cm1qpg5kx	cmm6rvinv0001134cw8d0ajl3	2026-01-02 00:00:00	ADT Cash Deposit Lngbeach Previous Ndlovu Cr Jan ADT Cash Deposit Izaya	\N	350.00	2026-02-28 20:27:18.726
cmm6rvio7000e134caawdt51l	cmm6rvinv0001134cw8d0ajl3	2026-01-04 00:00:00	ADT Cash Deposit Izaya Cr	\N	400.00	2026-02-28 20:27:18.726
cmm6rvio7000f134c1mfy96pz	cmm6rvinv0001134cw8d0ajl3	2026-01-04 00:00:00	ADT Cash Deposit Izaya Cr Jan Internet Pmt To Balance Top	\N	400.00	2026-02-28 20:27:18.726
cmm6rvio7000g134clmtkw6er	cmm6rvinv0001134cw8d0ajl3	2026-01-04 00:00:00	Internet Pmt To Balance Top	\N	-165.00	2026-02-28 20:27:18.726
cmm6rvio7000h134c9vi84uj4	cmm6rvinv0001134cw8d0ajl3	2026-01-04 00:00:00	Internet Pmt To Balance Top Jan POS Purchase Suburban Motor Spar * Jan	\N	-165.00	2026-02-28 20:27:18.726
cmm6rvio7000i134ctnp6ihe8	cmm6rvinv0001134cw8d0ajl3	2026-01-05 00:00:00	POS Purchase Suburban Motor Spar * Jan	\N	-310.00	2026-02-28 20:27:18.726
cmm6rvio7000j134ceuni95nt	cmm6rvinv0001134cw8d0ajl3	2026-01-05 00:00:00	POS Purchase Suburban Motor Spar * Jan Jan Fuel Purchase Total Portlands C * Jan	\N	-310.00	2026-02-28 20:27:18.726
cmm6rvio7000k134czfszv8sf	cmm6rvinv0001134cw8d0ajl3	2026-01-06 00:00:00	Fuel Purchase Total Portlands C * Jan	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7000l134co85ewpvo	cmm6rvinv0001134cw8d0ajl3	2026-01-06 00:00:00	Fuel Purchase Total Portlands C * Jan Jan Digital Content Voucher Voucher	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7000m134ci9w5347d	cmm6rvinv0001134cw8d0ajl3	2026-01-06 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000n134chnvii156	cmm6rvinv0001134cw8d0ajl3	2026-01-06 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000o134caokiob17	cmm6rvinv0001134cw8d0ajl3	2026-01-07 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000p134c44ch7j8r	cmm6rvinv0001134cw8d0ajl3	2026-01-07 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Ott Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000q134ce39617t8	cmm6rvinv0001134cw8d0ajl3	2026-01-08 00:00:00	Digital Content Voucher Ott Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000r134cevknsvwj	cmm6rvinv0001134cw8d0ajl3	2026-01-08 00:00:00	Digital Content Voucher Ott Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000s134cism3xrxg	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000t134cko7zbi3i	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000u134c8vc2zdnm	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Digital Content Voucher Voucher Jan Payshap Credit T Harsant	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000v134ct2nrrmy5	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Payshap Credit T Harsant Cr	\N	500.00	2026-02-28 20:27:18.726
cmm6rvio7000w134c8atrcf2f	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Payshap Credit T Harsant Cr Jan	\N	500.00	2026-02-28 20:27:18.726
cmm6rvio7000x134c7r4zrqkf	cmm6rvinv0001134cw8d0ajl3	2026-01-09 00:00:00	Payshap Credit T Harsant Cr Jan Jan Digital Content Voucher Voucher	\N	500.00	2026-02-28 20:27:18.726
cmm6rvio7000y134ccp7byjmi	cmm6rvinv0001134cw8d0ajl3	2026-01-11 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7000z134cvrln2gfi	cmm6rvinv0001134cw8d0ajl3	2026-01-11 00:00:00	Digital Content Voucher Voucher Jan Magtape Credit Investecpb Patrick	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70010134cffhr7tp5	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Magtape Credit Investecpb Patrick Cr	\N	250.00	2026-02-28 20:27:18.726
cmm6rvio70011134c7ag89qu3	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Magtape Credit Investecpb Patrick Cr Jan	\N	250.00	2026-02-28 20:27:18.726
cmm6rvio70012134cvow6xo71	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Magtape Credit Investecpb Patrick Cr Jan Jan Fuel Purchase Biz Afrika Pty * Jan	\N	250.00	2026-02-28 20:27:18.726
cmm6rvio70013134c1r5368yc	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Transaction	\N	-6.00	2026-02-28 20:27:18.726
cmm6rvio70014134cf7xcnn1z	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Jan Fuel Purchase Biz Afrika Pty * Jan	\N	-6.00	2026-02-28 20:27:18.726
cmm6rvio70015134curxghift	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Jan Fuel Purchase Biz Afrika Pty * Jan Jan Digital Content Voucher Voucher	\N	-6.00	2026-02-28 20:27:18.726
cmm6rvio70016134cgpr2cwxx	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Fuel Purchase Biz Afrika Pty * Jan	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio70017134cfvds7163	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Fuel Purchase Biz Afrika Pty * Jan Jan Digital Content Voucher Voucher	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio70018134cv9k16khr	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Digital Content Voucher Voucher	\N	-20.00	2026-02-28 20:27:18.726
cmm6rvio70019134ceaxpmusb	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-20.00	2026-02-28 20:27:18.726
cmm6rvio7001a134ckadg53hk	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7001b134cra7cydz2	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7001c134cpcepdg2d	cmm6rvinv0001134cw8d0ajl3	2026-01-12 00:00:00	Digital Content Voucher Voucher Jan Payshap Credit T Harsant	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7001d134cos8cihku	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Payshap Credit T Harsant Cr	\N	1325.00	2026-02-28 20:27:18.726
cmm6rvio7001e134cxcrx6fd4	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Payshap Credit T Harsant Cr Jan Payshap Account Off-Us Wages	\N	1325.00	2026-02-28 20:27:18.726
cmm6rvio7001f134c819m6oxp	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Payshap Account Off-Us Wages	\N	-800.00	2026-02-28 20:27:18.726
cmm6rvio7001g134cikj8d0sp	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Payshap Account Off-Us Wages Jan Fuel Purchase Sasol Kommetjie * Jan	\N	-800.00	2026-02-28 20:27:18.726
cmm6rvio7001h134c1mwq6vmo	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Fuel Purchase Sasol Kommetjie * Jan	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio7001i134csl4tz8q9	cmm6rvinv0001134cw8d0ajl3	2026-01-15 00:00:00	Fuel Purchase Sasol Kommetjie * Jan Jan FNB OB Pmt Mvs-Nhw	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio7001j134c5qdxrzye	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	FNB OB Pmt Mvs-Nhw Cr	\N	8581.50	2026-02-28 20:27:18.726
cmm6rvio7001k134cofiazzck	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	FNB OB Pmt Mvs-Nhw Cr -- of --	\N	8581.50	2026-02-28 20:27:18.726
cmm6rvio7001l134cdyngv1hx	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	FNB OB Pmt Mvs-Nhw Cr -- of -- Branch Number Account Number Date DDA AA/ /BV/KY/KY/BF/B /C /CK/N FN	\N	8581.50	2026-02-28 20:27:18.726
cmm6rvio7001m134cyw9916yj	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Accrued Bank Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001n134cp5sju9mt	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Bank Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001o134cyv3cxq5q	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Charges Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001p134czifurccq	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Charges Send Money App Dr Send Madzimai Madzimai Jan Payshap Account Off-Us Wages	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001q134c878vay0u	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Send Money App Dr Send Madzimai Madzimai	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001r134cgn39quzb	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Send Money App Dr Send Madzimai Madzimai Jan Payshap Account Off-Us Wages	\N	-250.00	2026-02-28 20:27:18.726
cmm6rvio7001s134cg9di8j33	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 20:27:18.726
cmm6rvio7001t134cv55voyt0	cmm6rvinv0001134cw8d0ajl3	2026-01-16 00:00:00	Payshap Account Off-Us Wages Jan POS Purchase Checkers Sunvalley * Jan	\N	-500.00	2026-02-28 20:27:18.726
cmm6rvio7001u134co1nt8f8h	cmm6rvinv0001134cw8d0ajl3	2026-01-18 00:00:00	POS Purchase Checkers Sunvalley * Jan	\N	-454.00	2026-02-28 20:27:18.726
cmm6rvio7001v134c5hbano6c	cmm6rvinv0001134cw8d0ajl3	2026-01-18 00:00:00	POS Purchase Checkers Sunvalley * Jan Jan Digital Content Voucher Voucher	\N	-454.00	2026-02-28 20:27:18.726
cmm6rvio7001w134cr7ju9r3i	cmm6rvinv0001134cw8d0ajl3	2026-01-18 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7001x134c8n1tluj7	cmm6rvinv0001134cw8d0ajl3	2026-01-18 00:00:00	Digital Content Voucher Voucher Jan Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7001y134cfjyskciy	cmm6rvinv0001134cw8d0ajl3	2026-01-19 00:00:00	Payshap Account Off-Us Wages	\N	-500.00	2026-02-28 20:27:18.726
cmm6rvio7001z134c3hkrfto1	cmm6rvinv0001134cw8d0ajl3	2026-01-19 00:00:00	Payshap Account Off-Us Wages Jan Digital Content Voucher Voucher	\N	-500.00	2026-02-28 20:27:18.726
cmm6rvio70020134cqcuhwwa4	cmm6rvinv0001134cw8d0ajl3	2026-01-19 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70021134cdbavr1nj	cmm6rvinv0001134cw8d0ajl3	2026-01-19 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70022134ctfsq5i0g	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70023134cgj5hqitw	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Blu Flexi Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70024134ctglp6vpg	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70025134c5xdtr5nz	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Blu Flexi Voucher Jan Digital Content Voucher Ott Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70026134cygh7pu8j	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70027134cd5jlpobd	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70028134cpfs481da	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Digital Content Voucher Ott Voucher Jan Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio70029134co9i7vori	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio7002a134clvmeg750	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Payshap Account Off-Us Wages Jan Payshap Account Off-Us Wages	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio7002b134c3evjink5	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002c134cveuzutes	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Payshap Account Off-Us Wages Jan Payshap Account Off-Us Wages	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002d134c5kpzq2r9	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Payshap Account Off-Us Wages Jan Magtape Credit Fortune	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002e134c241h09xl	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Magtape Credit Fortune Cr	\N	700.00	2026-02-28 20:27:18.726
cmm6rvio7002f134cl1ft0hmi	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Magtape Credit Fortune Cr Jan Magtape Credit Muirleniumtech	\N	700.00	2026-02-28 20:27:18.726
cmm6rvio7002g134c2ne04rlk	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Magtape Credit Muirleniumtech Cr	\N	1000.00	2026-02-28 20:27:18.726
cmm6rvio7002h134c91t3mdva	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Magtape Credit Muirleniumtech Cr Jan POS Purchase Scoop Distribution- * Jan	\N	1000.00	2026-02-28 20:27:18.726
cmm6rvio7002i134ch4qyl2hz	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	POS Purchase Scoop Distribution- * Jan	\N	-4335.50	2026-02-28 20:27:18.726
cmm6rvio7002j134c2kogw4qz	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	POS Purchase Scoop Distribution- * Jan Jan Fuel Purchase Cottage Diep River * Jan	\N	-4335.50	2026-02-28 20:27:18.726
cmm6rvio7002k134cyk304wau	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Fuel Purchase Cottage Diep River * Jan	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7002l134civ31dwyu	cmm6rvinv0001134cw8d0ajl3	2026-01-20 00:00:00	Fuel Purchase Cottage Diep River * Jan Jan Send Money App Dr Send Tendai Fuma Cell	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7002m134c2i913tu6	cmm6rvinv0001134cw8d0ajl3	2026-01-21 00:00:00	Send Money App Dr Send Tendai Fuma Cell	\N	-1000.00	2026-02-28 20:27:18.726
cmm6rvio7002n134cd51hzp9h	cmm6rvinv0001134cw8d0ajl3	2026-01-21 00:00:00	Send Money App Dr Send Tendai Fuma Cell Jan Payshap Account Off-Us Wages	\N	-1000.00	2026-02-28 20:27:18.726
cmm6rvio7002o134ctxjrpftw	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Payshap Account Off-Us Wages	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7002p134c2z41s35h	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Payshap Account Off-Us Wages Jan Digital Content Voucher Voucher	\N	-300.00	2026-02-28 20:27:18.726
cmm6rvio7002q134c72dcpzfu	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002r134cmbgrwc9a	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002s134c1k5mkf53	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Voucher	\N	-60.00	2026-02-28 20:27:18.726
cmm6rvio7002t134cogt7x7sw	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Voucher Jan Digital Content Voucher Ott Voucher	\N	-60.00	2026-02-28 20:27:18.726
cmm6rvio7002u134c51uf9dca	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Ott Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002v134ce3aghkt5	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Ott Voucher Jan Digital Content Voucher Voucher	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002w134cd0rw5u4q	cmm6rvinv0001134cw8d0ajl3	2026-01-23 00:00:00	Digital Content Voucher Voucher Jan POS Purchase Communica Cape Town * Jan	\N	-100.00	2026-02-28 20:27:18.726
cmm6rvio7002x134cg185f9a2	cmm6rvinv0001134cw8d0ajl3	2026-01-26 00:00:00	POS Purchase Communica Cape Town * Jan	\N	-217.50	2026-02-28 20:27:18.726
cmm6rvio7002y134cx28xry3k	cmm6rvinv0001134cw8d0ajl3	2026-01-26 00:00:00	POS Purchase Communica Cape Town * Jan Jan Fuel Purchase Total Observatory C * Jan	\N	-217.50	2026-02-28 20:27:18.726
cmm6rvio7002z134cc1tinqns	cmm6rvinv0001134cw8d0ajl3	2026-01-26 00:00:00	Fuel Purchase Total Observatory C * Jan	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio80030134clv3whe7n	cmm6rvinv0001134cw8d0ajl3	2026-01-26 00:00:00	Fuel Purchase Total Observatory C * Jan Jan Magtape Credit Sharon Harsant	\N	-200.00	2026-02-28 20:27:18.726
cmm6rvio80031134czkavuzxm	cmm6rvinv0001134cw8d0ajl3	2026-01-28 00:00:00	Magtape Credit Sharon Harsant Cr	\N	1500.00	2026-02-28 20:27:18.726
cmm6rvio80032134cpsr4ob80	cmm6rvinv0001134cw8d0ajl3	2026-01-28 00:00:00	Magtape Credit Sharon Harsant Cr Jan Magtape Credit Andisiwe	\N	1500.00	2026-02-28 20:27:18.726
cmm6rvio80033134cajbx9ais	cmm6rvinv0001134cw8d0ajl3	2026-01-29 00:00:00	Magtape Credit Andisiwe Cr	\N	365.00	2026-02-28 20:27:18.726
cmm6rvio80034134c6l8wjlj9	cmm6rvinv0001134cw8d0ajl3	2026-01-29 00:00:00	Magtape Credit Andisiwe Cr Jan Payshap Account Off-Us Wages	\N	365.00	2026-02-28 20:27:18.726
cmm6rvio80035134c049gx0vv	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Payshap Account Off-Us Wages	\N	-1600.00	2026-02-28 20:27:18.726
cmm6rvio80036134cvci7v1cu	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Payshap Account Off-Us Wages Jan	\N	-1600.00	2026-02-28 20:27:18.726
cmm6rvio80037134czq72cx1g	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Payshap Account Off-Us Wages Jan Jan	\N	-1600.00	2026-02-28 20:27:18.726
cmm6rvio80038134cb4pv1kdq	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Payshap Account Off-Us Wages Jan Jan Jan	\N	-1600.00	2026-02-28 20:27:18.726
cmm6rvio80039134c4x15b768	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Transaction	\N	431.65	2026-02-28 20:27:18.726
cmm6rvio8003a134cs9bspe60	cmm6rvinv0001134cw8d0ajl3	2026-01-30 00:00:00	Jan	\N	431.65	2026-02-28 20:27:18.726
cmm6rvio8003d134c0yasn745	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	Jan Cr Closing Balance Cr Turnover for Statement Period No. Credit Transactions	\N	190.89	2026-02-28 20:27:18.726
cmm6rvio8003e134cu3wnaydx	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	Closing Balance Cr Turnover for Statement Period No. Credit Transactions	\N	190.89	2026-02-28 20:27:18.726
cmm6rvio8003f134ctqgb47ii	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	Turnover for Statement Period No. Credit Transactions ,	\N	14971.50	2026-02-28 20:27:18.726
cmm6rvio8003g134cuon4lxax	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	No. Credit Transactions ,	\N	14971.50	2026-02-28 20:27:18.726
cmm6rvio8003h134c9norxrys	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	No. Credit Transactions , No. Debit Transactions	\N	14971.50	2026-02-28 20:27:18.726
cmm6rvio8003i134cfckvl9ct	cmm6rvinv0001134cw8d0ajl3	2026-10-13 00:00:00	No. Credit Transactions , No. Debit Transactions Please contact us within days from your statement date, should you wish to query an entry on this statement (incl. card transactions done	\N	14971.50	2026-02-28 20:27:18.726
cmm6rvio8003j134c0vy3l5yj	cmm6rvinv0001134cw8d0ajl3	2032-01-09 00:00:00	.	\N	-32.68	2026-02-28 20:27:18.726
cmm6rvio8003k134c3z54an8x	cmm6rvinv0001134cw8d0ajl3	2032-01-09 00:00:00	. Jan Digital Content Voucher Voucher	\N	-32.68	2026-02-28 20:27:18.726
cmm6rvio8003l134cww5r6n4h	cmm6rvinv0001134cw8d0ajl3	2032-01-09 00:00:00	. Jan Digital Content Voucher Voucher Jan Magtape Credit Investecpb Patrick	\N	-32.68	2026-02-28 20:27:18.726
cmm6rvio8003m134ct2k0rrcr	cmm6rvinv0001134cw8d0ajl3	2049-01-30 00:00:00	.	\N	-49.00	2026-02-28 20:27:18.726
cmm6rvio8003n134cmxwt601f	cmm6rvinv0001134cw8d0ajl3	2049-01-30 00:00:00	. Jan	\N	-49.00	2026-02-28 20:27:18.726
cmm6rvio8003o134cfr6x4piq	cmm6rvinv0001134cw8d0ajl3	2049-01-30 00:00:00	. Jan Closing Balance	\N	-49.00	2026-02-28 20:27:18.726
cmm6rvio8003p134cod3aiuau	cmm6rvinv0001134cw8d0ajl3	2049-01-30 00:00:00	. Jan Closing Balance Turnover for Statement Period	\N	-49.00	2026-02-28 20:27:18.726
cmm6rwat7003s134cpw3sflbm	cmm6rwasu003r134ce3r3t84t	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER	\N	3000.00	2026-02-28 20:27:55.194
cmm6rwat7003t134cwsqszoh7	cmm6rwasu003r134ce3r3t84t	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 20:27:55.194
cmm6rwat7003u134c9k6yzxci	cmm6rwasu003r134ce3r3t84t	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	3000.00	2026-02-28 20:27:55.194
cmm6rwat7003v134cuuqumrs3	cmm6rwasu003r134ce3r3t84t	2026-01-23 00:00:00	Month-end Balance R Details Service Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	6335.06	2026-02-28 20:27:55.194
cmm6rwat7003w134cda7i208a	cmm6rwasu003r134ce3r3t84t	2026-01-23 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD	\N	-24410.89	2026-02-28 20:27:55.194
cmm6rwat7003x134c1br2ux40	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:27:55.194
cmm6rwat7003y134c7239oudo	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat7003z134cb12acrgn	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat70040134cr8h0kdqh	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat70041134cugnz6ejv	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VAS BETWAY FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70042134ca4fxtcx5	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70043134ckpt4zf0c	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:27:55.194
cmm6rwat70044134cz1v4svuz	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:27:55.194
cmm6rwat70045134cftzebfxu	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70046134c6xvgocvm	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70047134c8zc36899	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-50.00	2026-02-28 20:27:55.194
cmm6rwat70048134c6ronr8ut	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70049134cjxa40507	cmm6rwasu003r134ce3r3t84t	2026-01-25 00:00:00	CHEQUE CARD PURCHASE	\N	-260.00	2026-02-28 20:27:55.194
cmm6rwat7004a134cralyqpnl	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:27:55.194
cmm6rwat7004b134cm8ab7scb	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:27:55.194
cmm6rwat7004c134ctl11m1f1	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat7004d134cklggqi9e	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VAS HOLLYWOODBETS FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7004e134c2fna1v37	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7004f134cj6jus9go	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7004g134cjd2fzjt5	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7004h134cubyjs2ia	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat7004i134cp9yn9wz5	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7004j134cmisew31t	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1500.00	2026-02-28 20:27:55.194
cmm6rwat7004k134cczi8mw4h	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat7004l134cfunjte2z	cmm6rwasu003r134ce3r3t84t	2026-01-26 00:00:00	FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat7004m134c844r7pk9	cmm6rwasu003r134ce3r3t84t	2026-01-27 00:00:00	H ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat7004n134crzf7qw49	cmm6rwasu003r134ce3r3t84t	2026-01-27 00:00:00	ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat7004o134cfuvi50xb	cmm6rwasu003r134ce3r3t84t	2026-01-27 00:00:00	VAS FEE: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:27:55.194
cmm6rwat7004p134c0o27jdpn	cmm6rwasu003r134ce3r3t84t	2026-01-27 00:00:00	FEE: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:27:55.194
cmm6rwat7004q134c9rd5yv2b	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:27:55.194
cmm6rwat7004r134c5njtuzxk	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:27:55.194
cmm6rwat7004s134czwe721gr	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat7004t134ccua2qksb	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat7004u134chntull1m	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwat7004v134ctwypxggk	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	H FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat7004w134c1gdesmdx	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat7004x134cmzrgxmgc	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H IB PAYMENT TO	\N	-5050.00	2026-02-28 20:27:55.194
cmm6rwat7004y134cf5x4cvs3	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	H IB PAYMENT TO	\N	-5050.00	2026-02-28 20:27:55.194
cmm6rwat7004z134cv85lct26	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	IB PAYMENT TO	\N	-5050.00	2026-02-28 20:27:55.194
cmm6rwat70050134c7jodu3f9	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	PATRICK RENT FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat70051134c57kfa77u	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat70052134ccxhqbktg	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT FEE - AUTOBANK	\N	-9.00	2026-02-28 20:27:55.194
cmm6rwat70053134c7vcu4t6v	cmm6rwasu003r134ce3r3t84t	2026-01-28 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-9.00	2026-02-28 20:27:55.194
cmm6rwat70054134cq2wcifo7	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:27:55.194
cmm6rwat70055134cb3yu6778	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:27:55.194
cmm6rwat70056134cp8pmxn6w	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	SBIB-MOBI FUN FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat70057134cfe7ve16u	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat70058134cc9u24os6	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-142.00	2026-02-28 20:27:55.194
cmm6rwat70059134colxiz9v5	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	S S*ABDILAYEK * JAN CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:27:55.194
cmm6rwat7005a134c2h5vjful	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:27:55.194
cmm6rwat7005b134coteigpm7	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	BUCO LONGBEAC * JAN IB PAYMENT TO	\N	-5100.00	2026-02-28 20:27:55.194
cmm6rwat7005c134cukcgmbvz	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	IB PAYMENT TO	\N	-5100.00	2026-02-28 20:27:55.194
cmm6rwat7005d134c13gfm530	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	JOSEPH JOZE FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat7005e134cre95yl7p	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat7005f134c3ek19sle	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat7005g134cjfaesy1p	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7005h134c6hewcg9d	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7005i134c2yw7haoi	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	JULIET CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7005j134c3b0568g6	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7005k134crsf91kwz	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 20:27:55.194
cmm6rwat7005l134cjh72jriv	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 20:27:55.194
cmm6rwat7005m134cw4ufx5k4	cmm6rwasu003r134ce3r3t84t	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	270.00	2026-02-28 20:27:55.194
cmm6rwat7005n134crmly3zgn	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat7005o134c39o741uz	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7005p134cc174qsol	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7005q134c5ka302oe	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat7005r134clg9uxyn7	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	SASOL KOMMETJ * JAN CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:27:55.194
cmm6rwat7005s134c6hoe8qh9	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:27:55.194
cmm6rwat7005t134cay6jsr08	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	SCOOP DISTRIB * JAN VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat7005u134cb2nxu8qh	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat7005v134c9a99v5u7	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT FEE - AUTOBANK	\N	-59.40	2026-02-28 20:27:55.194
cmm6rwat7005w134ctfgaznmv	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-59.40	2026-02-28 20:27:55.194
cmm6rwat7005x134c0sc14zhk	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7005y134cpax7akgr	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7005z134cwn7c8i0t	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat70060134cmi7xbwhy	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	MONTHLY MANAGEMENT FEE	\N	-7.50	2026-02-28 20:27:55.194
cmm6rwat70061134ch0nu30a6	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 20:27:55.194
cmm6rwat70062134cf2gej8wq	cmm6rwasu003r134ce3r3t84t	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 20:27:55.194
cmm6rwat70063134c9fdejy1q	cmm6rwasu003r134ce3r3t84t	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 20:27:55.194
cmm6rwat70064134cw02x3m87	cmm6rwasu003r134ce3r3t84t	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO -	\N	-188.00	2026-02-28 20:27:55.194
cmm6rwat70065134c7a60revb	cmm6rwasu003r134ce3r3t84t	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:27:55.194
cmm6rwat70066134cqyib6pcd	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat70067134cm0bajf8r	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70068134cwihephy7	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat70069134ce70i0u6x	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat7006a134coh55feej	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	SHELLA CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7006b134c6vax205g	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat7006c134cif23ezow	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	IB PAYMENT TO	\N	-2000.00	2026-02-28 20:27:55.194
cmm6rwat7006d134chi02php7	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	NURAAN SASMAAN FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat7006e134cmmkeonpw	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat7006f134ctorvgwmt	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	IB PAYMENT TO	\N	-915.00	2026-02-28 20:27:55.194
cmm6rwat7006g134cg30lnsqb	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	WIZA SOLUTIONS WIFI FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat7006h134c5ezjmmni	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-2700.00	2026-02-28 20:27:55.194
cmm6rwat7006i134czc5dhf7h	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat7006j134cxuqos3dn	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:27:55.194
cmm6rwat8006k134claxlk29l	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8006l134c3cydd50n	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:27:55.194
cmm6rwat8006m134ct0s5fxcg	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:27:55.194
cmm6rwat8006n134cmt45x57j	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	CASH WITHDRAWAL FEE	\N	-188.00	2026-02-28 20:27:55.194
cmm6rwat8006o134cy8t79dju	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	IB PAYMENT TO	\N	-1900.00	2026-02-28 20:27:55.194
cmm6rwat8006p134c5kkstrbm	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	PJOHN SHEDZA RENT FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat8006q134c4rcb39nf	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8006r134cl4t9fgq5	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8006s134ccimyyjgx	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8006t134cwa049azx	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	CHEQUE CARD PURCHASE	\N	-99.99	2026-02-28 20:27:55.194
cmm6rwat8006u134cd29d00qo	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT FEE - AUTOBANK	\N	-5.40	2026-02-28 20:27:55.194
cmm6rwat8006v134c02j64u3v	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-5.40	2026-02-28 20:27:55.194
cmm6rwat8006w134c46fapy98	cmm6rwasu003r134ce3r3t84t	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat8006x134cs49xm4lr	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:27:55.194
cmm6rwat8006y134c4gsyzmoo	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:27:55.194
cmm6rwat8006z134cklu4sqy7	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat80070134cpavq4iym	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat80071134crr5o9fd9	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat80072134cm664gddm	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	WAGES IB PAYMENT TO	\N	-1400.00	2026-02-28 20:27:55.194
cmm6rwat80073134caz2uylf9	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	IB PAYMENT TO	\N	-1400.00	2026-02-28 20:27:55.194
cmm6rwat80074134cp0y8vsaq	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	BLUEDOG TECHNOLOGY FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat80075134csysfe8s6	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat80076134c9c8l1tqh	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2000.00	2026-02-28 20:27:55.194
cmm6rwat80077134c4xu1rrwe	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat80078134c1g76romu	cmm6rwasu003r134ce3r3t84t	2026-02-02 00:00:00	FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat80079134c7gwr50mt	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:27:55.194
cmm6rwat8007a134ctch1brl3	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:27:55.194
cmm6rwat8007b134cbiuczfkg	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-115.00	2026-02-28 20:27:55.194
cmm6rwat8007c134c6r6a7bmz	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8007d134chbekevei	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8007e134co0py83tk	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8007f134cfjbgu4c9	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:27:55.194
cmm6rwat8007g134cgvsyulur	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8007h134c76pqau7s	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8007i134crqi8v45h	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8007j134clu91je11	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8007k134c0kr18syi	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8007l134ce6lvc2is	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwat8007m134cztzxr8vb	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:27:55.194
cmm6rwat8007n134crjp0inu4	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-400.00	2026-02-28 20:27:55.194
cmm6rwat8007o134cbrqux2if	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-149.98	2026-02-28 20:27:55.194
cmm6rwat8007p134c9xdpl1dy	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	CHECKERS SUNV * JAN CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:27:55.194
cmm6rwat8007q134cfdki7b2b	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:27:55.194
cmm6rwat8007r134ccae8u77t	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT FEE - AUTOBANK	\N	-10.80	2026-02-28 20:27:55.194
cmm6rwat8007s134co47veapu	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-10.80	2026-02-28 20:27:55.194
cmm6rwat8007t134ci6cr0v15	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT FEE - AUTOBANK	\N	-9.00	2026-02-28 20:27:55.194
cmm6rwat8007u134cdu4u1n0n	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-9.00	2026-02-28 20:27:55.194
cmm6rwat8007v134ct27biuis	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8007w134cwu16372s	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	VAS TELKM FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat8007x134c7vlmd9vn	cmm6rwasu003r134ce3r3t84t	2026-02-03 00:00:00	FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat8007y134cd0f1h5nb	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-950.00	2026-02-28 20:27:55.194
cmm6rwat8007z134c9rojfq99	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	SAM CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat80080134cik05hssf	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat80081134cwc1c6krd	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat80082134ciowtj7s4	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat80083134ckcjut9m6	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat80084134cmr54a3uc	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat80085134c4ybal8mn	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat80086134crkbbyh6x	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat80087134ck9ppoong	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	H FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat80088134cnz7t65iv	cmm6rwasu003r134ce3r3t84t	2026-02-04 00:00:00	FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat80089134c5t5ahvzq	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat8008a134c9z40a7ut	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat8008b134csdjqm01n	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008c134ctg7xzj4s	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008d134cwbshgs4x	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1000.00	2026-02-28 20:27:55.194
cmm6rwat8008e134chmyt7pqj	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8008f134cgnzrna83	cmm6rwasu003r134ce3r3t84t	2026-02-05 00:00:00	FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8008g134cmo613t5h	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	H LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8008h134cd3lw3fyl	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat8008i134cyxednun8	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008j134cfck22j95	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008k134cbhbqrwvo	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:27:55.194
cmm6rwat8008l134cipycrpmy	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008m134ci42tmcep	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat8008n134c9nj17j6j	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat8008o134ctoc2gwz2	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008p134cespgc2n7	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008q134cg5n5tvsj	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8008r134cq9km4q5z	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VAS BLU VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008s134cs7qmxmt2	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008t134cnsp7ioa4	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	INSURANCE PREMIUM	\N	-1076.81	2026-02-28 20:27:55.194
cmm6rwat8008u134c9c2bja10	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	JAC P RF T CIN FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat8008v134cqzvlmb9h	cmm6rwasu003r134ce3r3t84t	2026-02-06 00:00:00	FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat8008w134c9b2uz56t	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8008x134c6b6hoi2h	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008y134cuow8kvmg	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8008z134cotlfau86	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2800.00	2026-02-28 20:27:55.194
cmm6rwat80090134cq9cm5o9o	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat80091134ci1ddnfyz	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat80092134cibngcqrw	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat80093134caz4oz69z	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat80094134cngn00unb	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat80095134cdl36i4l6	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD DAVID NAKI CASH DEPOSIT FEE - AUTOBANK	\N	-5.40	2026-02-28 20:27:55.194
cmm6rwat80096134cjregg5kn	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT FEE - AUTOBANK	\N	-5.40	2026-02-28 20:27:55.194
cmm6rwat80097134cgi2q0gzm	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-5.40	2026-02-28 20:27:55.194
cmm6rwat80098134cp1coglzy	cmm6rwasu003r134ce3r3t84t	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:27:55.194
cmm6rwat80099134c3dm3bsn9	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat8009a134cl8578wo9	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8009b134cj9527jlh	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8009c134c1ogcf4a7	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat8009d134c87upbwe1	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:27:55.194
cmm6rwat8009e134csgg435sw	cmm6rwasu003r134ce3r3t84t	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:27:55.194
cmm6rwat8009f134ckgisnopb	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-45.00	2026-02-28 20:27:55.194
cmm6rwat8009g134cyomjs4zx	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8009h134c7g2rti27	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat8009i134cq2dpiyu8	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-60.00	2026-02-28 20:27:55.194
cmm6rwat9009j134c91iif6ju	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009k134c84mjupur	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1600.00	2026-02-28 20:27:55.194
cmm6rwat9009l134cibxcyc9z	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-250.00	2026-02-28 20:27:55.194
cmm6rwat9009m134cmnqbigwk	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat9009n134cy9gb4vgc	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009o134cptkjoyb1	cmm6rwasu003r134ce3r3t84t	2026-02-10 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009p134cfrrvm807	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat9009q134cwilrqa42	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat9009r134cr6aar70g	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VAS VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009s134c1xszccfg	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009t134c54wtojt4	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:27:55.194
cmm6rwat9009u134c2otvtizy	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat9009v134c0smbzbtg	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat9009w134c0k7vb1ss	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat9009x134c4pv00drx	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat9009y134cr0zv9w4l	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:27:55.194
cmm6rwat9009z134cwpgcyt6w	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	BRIAN FEE: PAYSHAP PAYMENT	\N	-7.00	2026-02-28 20:27:55.194
cmm6rwat900a0134ckyxsbsix	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	FEE: PAYSHAP PAYMENT	\N	-7.00	2026-02-28 20:27:55.194
cmm6rwat900a1134cayp5r8os	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900a2134cojxhry58	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:27:55.194
cmm6rwat900a3134cxyjma03r	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:27:55.194
cmm6rwat900a4134cyumudgip	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat900a5134cv7tyejp6	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	H FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat900a6134cjo29s0o2	cmm6rwasu003r134ce3r3t84t	2026-02-11 00:00:00	FEE - INSTANT MONEY	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat900a7134cf49snc8k	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	H VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900a8134c9opgjp4e	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900a9134cqromajo2	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900aa134cxwsilrxc	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900ab134ce5vvwxym	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwat900ac134cl71gfz1k	cmm6rwasu003r134ce3r3t84t	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwat900ad134c6z7r0y0h	cmm6rwasu003r134ce3r3t84t	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900ae134cj5z7vm78	cmm6rwasu003r134ce3r3t84t	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900af134cznwmjxns	cmm6rwasu003r134ce3r3t84t	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900ag134c6cl6mk44	cmm6rwasu003r134ce3r3t84t	2026-02-13 00:00:00	H FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat900ah134c3350p2gp	cmm6rwasu003r134ce3r3t84t	2026-02-13 00:00:00	FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwat900ai134ccniwm6q8	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	H VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat900aj134ca179w2e9	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat900ak134c0efod77y	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900al134c7gsnfwgs	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900am134cnhm8h1q2	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:27:55.194
cmm6rwat900an134cmvpprcvi	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	VAS VODA FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat900ao134cfq9k3swe	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat900ap134cp9kt9p64	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat900aq134cnrbezw1n	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:27:55.194
cmm6rwat900ar134cfqgbc5u2	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:27:55.194
cmm6rwat900as134cyuy4837y	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:27:55.194
cmm6rwat900at134cinmu1f8a	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT FEE - AUTOBANK	\N	-3.60	2026-02-28 20:27:55.194
cmm6rwat900au134ci2zxseh7	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-3.60	2026-02-28 20:27:55.194
cmm6rwat900av134cmepmhsae	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:27:55.194
cmm6rwat900aw134c0242bihu	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:27:55.194
cmm6rwat900ax134c4sh0pyok	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	WI ZA NETCASH FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat900ay134cvb9sy568	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	FEE - DEBIT ORDER	\N	-3.50	2026-02-28 20:27:55.194
cmm6rwat900az134cd98ugaus	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 20:27:55.194
cmm6rwat900b0134cc1d5yfu9	cmm6rwasu003r134ce3r3t84t	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD VOUCHER PURCHASE -	\N	-115.86	2026-02-28 20:27:55.194
cmm6rwat900b1134cgeuyhb8p	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900b2134c2mksb0qn	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	ASTRON ENERGY * FEB CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:27:55.194
cmm6rwat900b3134cq525wh8i	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:27:55.194
cmm6rwat900b4134c59hgiifc	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	HPY*FISH AND * FEB CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:27:55.194
cmm6rwat900b5134c9w8giydu	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:27:55.194
cmm6rwat900b6134c60wnn7jf	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	SPAR FISH HOE * FEB VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:27:55.194
cmm6rwat900b7134cz80k68ke	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:27:55.194
cmm6rwat900b8134c0igdyuia	cmm6rwasu003r134ce3r3t84t	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-240.00	2026-02-28 20:27:55.194
cmm6rwat900b9134c3h0s4apf	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	STP VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat900ba134cp3p9p1ir	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:27:55.194
cmm6rwat900bb134cgjojodw4	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900bc134cr0ll0th0	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900bd134cf37z2bm1	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	ROUTER IB PAYMENT TO	\N	-2494.99	2026-02-28 20:27:55.194
cmm6rwat900be134cew45awzj	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	IB PAYMENT TO	\N	-2494.99	2026-02-28 20:27:55.194
cmm6rwat900bf134cp4n64dfh	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	JAYDI COMPUTERS INSURANCE FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat900bg134ctd5k1ab7	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat900bh134c7fh9sqav	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-52.93	2026-02-28 20:27:55.194
cmm6rwat900bi134cn4oc03p8	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900bj134cnrnb6q0t	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-110.00	2026-02-28 20:27:55.194
cmm6rwat900bk134ckw6o7khe	cmm6rwasu003r134ce3r3t84t	2026-02-17 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwat900bl134c84de6og5	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	VAS LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:27:55.194
cmm6rwat900bm134cuwaiobmk	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:27:55.194
cmm6rwat900bn134cmsn0j6eu	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	VAS LOTTO FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900bo134cv387m23c	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900bp134clj438p88	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat900bq134cwg45py41	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:27:55.194
cmm6rwat900br134covjm87n7	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	VAS POWERBALL FEE LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900bs134chdtxrj4b	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE	\N	-25.00	2026-02-28 20:27:55.194
cmm6rwat900bt134co8gbju4m	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	VAS CELLC FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat900bu134c2myfkxyg	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	FEE: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:27:55.194
cmm6rwat900bv134cwm5d4p74	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT FEE - AUTOBANK	\N	-14.40	2026-02-28 20:27:55.194
cmm6rwat900bw134cswk8ehdd	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-14.40	2026-02-28 20:27:55.194
cmm6rwat900bx134c4mbnnlsg	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat900by134c1tbyyflf	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-7.20	2026-02-28 20:27:55.194
cmm6rwat900bz134cydt90hwd	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 20:27:55.194
cmm6rwat900c0134cuv77eqnn	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA	\N	-800.00	2026-02-28 20:27:55.194
cmm6rwat900c1134cp9c66mjw	cmm6rwasu003r134ce3r3t84t	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-800.00	2026-02-28 20:27:55.194
cmm6rwat900c2134cv7dt389g	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:27:55.194
cmm6rwat900c3134csgdwocxj	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	IB PAYMENT TO	\N	-450.00	2026-02-28 20:27:55.194
cmm6rwat900c4134cqxn7hspb	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	BLUEDOG TECHNOLOGY BENGO FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat900c5134cd4t52mue	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	FEE-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:27:55.194
cmm6rwat900c6134c7pvfjzla	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900c7134cgj6bwwrj	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900c8134clow3sher	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwat900c9134ciabdchrj	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	REF VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900ca134cjone2csv	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900cb134cyfua8rsk	cmm6rwasu003r134ce3r3t84t	2026-02-19 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwat900cc134cvcq0ibvr	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	CHEQUE CARD PURCHASE	\N	-67.00	2026-02-28 20:27:55.194
cmm6rwata00cd134ckj1w6lc7	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:27:55.194
cmm6rwata00ce134c0ycfd937	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:27:55.194
cmm6rwata00cf134cv7mvquo6	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	H FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwata00cg134cozhhl8uy	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwata00ch134cl06bk8ls	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:27:55.194
cmm6rwata00ci134cgt35niwb	cmm6rwasu003r134ce3r3t84t	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:27:55.194
cmm6rwata00cj134cuphd0qsm	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwata00ck134coqq6x351	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwata00cl134cn5o695xf	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwata00cm134cw85rr9de	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	Fee Debits Credits Date Balance BALANCE BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwata00cn134cpcr31f3f	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT FEE - AUTOBANK	\N	-3.60	2026-02-28 20:27:55.194
cmm6rwata00co134cxzqjphaa	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	CASH DEPOSIT FEE - AUTOBANK	\N	-3.60	2026-02-28 20:27:55.194
cmm6rwata00cp134cf9rdb6at	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwata00cq134cstd6xmir	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	H FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwata00cr134c2necrdgv	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	FEE - INSTANT MONEY	\N	-10.00	2026-02-28 20:27:55.194
cmm6rwata00cs134csfumofqo	cmm6rwasu003r134ce3r3t84t	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwata00ct134c2hj3vxy2	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	H ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwata00cu134cmrfozwpb	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:27:55.194
cmm6rwata00cv134cm6lmqm23	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	VAS FEE: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:27:55.194
cmm6rwata00cw134ciy03gdax	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	FEE: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:27:55.194
cmm6rwata00cx134cv1m0x45n	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:27:55.194
cmm6rwata00cy134cnb4wz9pd	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	VAS OTT VOUCHER FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwata00cz134c5hgtoszh	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	FEE: VOUCHER	\N	-2.95	2026-02-28 20:27:55.194
cmm6rwata00d0134cc786ma51	cmm6rwasu003r134ce3r3t84t	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:27:55.194
cmm6rwata00d1134cgyv7iu8j	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	VAS LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d2134cywpzgeus	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d3134cli0ijk0n	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	VAS LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d4134cc828kgk0	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	LOTTERY WINNINGS .	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d5134cs0co46lc	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d6134ce9myzrml	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM	\N	-9.10	2026-02-28 20:27:55.194
cmm6rwata00d7134cbg32hwu8	cmm6rwasu003r134ce3r3t84t	2026-10-01 00:00:00	LOTTERY WINNINGS . VAS PAYSHAP PAYMENT FROM EF	\N	-9.10	2026-02-28 20:27:55.194
cmm6s3rm70002prby6e2ja6pf	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	YOCO *PAHAR * JAN CREDIT TRANSFER	\N	3000.00	2026-02-28 20:33:43.567
cmm6s3rm70003prby7tr5rzrd	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 20:33:43.567
cmm6s3rm70004prbyy1jq50i1	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER CAPITEC S WILLIAMS	\N	370.00	2026-02-28 20:33:43.567
cmm6s3rm70005prby58fo8xfw	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CAPITEC S WILLIAMS MAGTAPE CREDIT	\N	6426.40	2026-02-28 20:33:43.567
cmm6s3rm70006prbyceh8inaj	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	MAGTAPE CREDIT BLUEDOG TECHNOLOGY	\N	6426.40	2026-02-28 20:33:43.567
cmm6s3rm70007prbyc5otxunh	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT COLLIN BANDA	\N	450.00	2026-02-28 20:33:43.567
cmm6s3rm70008prbyga6uhjbo	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER ISAAC MUGWAGWA	\N	365.00	2026-02-28 20:33:43.567
cmm6s3rm70009prbygfrfdmh5	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	BETWAY AUTOBANK CASH DEPOSIT	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000aprby0cmrszx2	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT JULIET	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000bprbyme35kw9n	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	BET ZQTZSDKDQJI WF AUTOBANK CASH DEPOSIT	\N	3210.00	2026-02-28 20:33:43.567
cmm6s3rm7000cprby6tve6d9p	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT JOSEPH	\N	3210.00	2026-02-28 20:33:43.567
cmm6s3rm7000dprbyzen8xqzf	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	WAGES AUTOBANK CASH DEPOSIT	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000eprbyabn3ip70	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT WESLEY GWAMURI	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000fprby6ibv5lye	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT AUXILIA	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000gprbyffkqc1e4	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT SHELLA	\N	360.00	2026-02-28 20:33:43.567
cmm6s3rm7000hprby4sximy44	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	BUCO SIMONSTO * JAN AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 20:33:43.567
cmm6s3rm7000iprbyzeet699j	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 20:33:43.567
cmm6s3rm7000jprbydrkpk4at	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT PREVIOUS NDLOVU	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000kprby17kp91td	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER SOSO	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000lprbyek1epyyc	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	H CREDIT TRANSFER	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000mprbydlsdvb1c	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER STELLA MAKARUTSE	\N	350.00	2026-02-28 20:33:43.567
cmm6s3rm7000nprbyp3v83s04	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	LIQUORSHOP SU * JAN AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 20:33:43.567
cmm6s3rm7000oprbyerm3617z	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 20:33:43.567
cmm6s3rm7000pprby5nioi88k	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	VAS AUTOBANK CASH DEPOSIT	\N	450.00	2026-02-28 20:33:43.567
cmm6s3rm7000qprby88f7anvi	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT GRACR LAISI	\N	450.00	2026-02-28 20:33:43.567
cmm6s3rm7000rprbyoq3m87kr	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	370.00	2026-02-28 20:33:43.567
cmm6s3rm7000sprbyp6axanig	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT SAM	\N	370.00	2026-02-28 20:33:43.567
cmm6s3rm7000tprbyme3arheh	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	H CREDIT TRANSFER	\N	365.00	2026-02-28 20:33:43.567
cmm6s3rm7000uprbyijbia86w	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER CAPITEC N NJOLI	\N	365.00	2026-02-28 20:33:43.567
cmm6s3rm7000vprbyeul0ftkk	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	230.00	2026-02-28 20:33:43.567
cmm6s3rm7000wprby80qgqb78	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT -- of --	\N	230.00	2026-02-28 20:33:43.567
cmm6s3rm7000xprby20scs5ow	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER PAYACCSYS C ADE A	\N	794.00	2026-02-28 20:33:43.567
cmm6s3rm7000yprby4br77ivr	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	200.00	2026-02-28 20:33:43.567
cmm6s3rm7000zprbyg02rv3p8	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT ADOLICE FUNERAL J	\N	200.00	2026-02-28 20:33:43.567
cmm6s3rm70010prbygs2z3wfs	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER PAYACCSYS DCB	\N	1000.00	2026-02-28 20:33:43.567
cmm6s3rm80011prbyhxl6bju4	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER	\N	1949.99	2026-02-28 20:33:43.567
cmm6s3rm80012prbyfww21pl4	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	CREDIT TRANSFER STP -	\N	1949.99	2026-02-28 20:33:43.567
cmm6s3rm80013prby21pfxcf6	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT NOMATTER BENGO	\N	750.00	2026-02-28 20:33:43.567
cmm6s3rm80014prbypq79d97x	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT AARON MAUWO	\N	370.00	2026-02-28 20:33:43.567
cmm6s3rm80015prbypaa84i48	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	REF AUTOBANK CASH DEPOSIT	\N	200.00	2026-02-28 20:33:43.567
cmm6s3rm80016prbypvg7y7pq	cmm6s3rl30001prby9boa3yy7	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT EFFORT E	\N	200.00	2026-02-28 20:33:43.567
cmm6s3rm80017prbyd0hffno9	cmm6s3rl30001prby9boa3yy7	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER	\N	3000.00	2026-02-28 20:33:43.567
cmm6s3rm80018prby79cmiobx	cmm6s3rl30001prby9boa3yy7	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 20:33:43.567
cmm6s3rm80019prbyosriyl0t	cmm6s3rl30001prby9boa3yy7	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	3000.00	2026-02-28 20:33:43.567
cmm6s3rm8001aprby9mkiau2z	cmm6s3rl30001prby9boa3yy7	2026-01-23 00:00:00	Month-end R Details Service BROUGHT FORWARD	\N	6335.06	2026-02-28 20:33:43.567
cmm6s3rm8001bprbyw8akrblx	cmm6s3rl30001prby9boa3yy7	2026-01-23 00:00:00	Details Service BROUGHT FORWARD	\N	410.89	2026-02-28 20:33:43.567
cmm6s3rm8001cprby0hhy1a7q	cmm6s3rl30001prby9boa3yy7	2026-01-23 00:00:00	BROUGHT FORWARD	\N	410.89	2026-02-28 20:33:43.567
cmm6s3rm8001dprby8h5ext2z	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:33:43.567
cmm6s3rm8001eprbydh70f5ja	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm8001fprbydj3hvxks	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm8001gprbyrti0dtzv	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm8001hprbywudxxbuf	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VAS BETWAY : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001iprbyc1m1g1lr	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001jprbycv5pau4m	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:33:43.567
cmm6s3rm8001kprbykp9srt31	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:33:43.567
cmm6s3rm8001lprbyq8ji7is9	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001mprbyhesaju4o	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001nprby51p7gm2r	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001oprby4og8soyj	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-50.00	2026-02-28 20:33:43.567
cmm6s3rm8001pprbymdn01krg	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	VAS HOLLYWOODBETS : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001qprbyv8okdj2m	cmm6s3rl30001prby9boa3yy7	2026-01-25 00:00:00	CHEQUE CARD PURCHASE	\N	-260.00	2026-02-28 20:33:43.567
cmm6s3rm8001rprbyyirpp1ns	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:33:43.567
cmm6s3rm8001sprbyvj1hzntp	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:33:43.567
cmm6s3rm8001tprby11hm5zee	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm8001uprbym6w1dgks	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VAS HOLLYWOODBETS : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001vprbywfzytjzr	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001wprbyh5gvjo01	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001xprbyw0mrxcfr	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001yprbyrwi9jg3v	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8001zprbyd5yzk3xu	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm80020prby8vk4o7ee	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm80021prby0fkyx3b0	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1500.00	2026-02-28 20:33:43.567
cmm6s3rm80022prbyv25ijqab	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm80023prby8qrbo277	cmm6s3rl30001prby9boa3yy7	2026-01-26 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm80024prbyl7rhaswe	cmm6s3rl30001prby9boa3yy7	2026-01-27 00:00:00	H ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm80025prbyjmvxrge3	cmm6s3rl30001prby9boa3yy7	2026-01-27 00:00:00	ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm80026prbyi51xt8sg	cmm6s3rl30001prby9boa3yy7	2026-01-27 00:00:00	VAS : ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:33:43.567
cmm6s3rm80027prbyto76gssf	cmm6s3rl30001prby9boa3yy7	2026-01-27 00:00:00	: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:33:43.567
cmm6s3rm80028prbyup43lfj7	cmm6s3rl30001prby9boa3yy7	2026-01-27 00:00:00	: ELECTRICITY PURCHASE ## - CREDIT TRANSFER	\N	28186.39	2026-02-28 20:33:43.567
cmm6s3rm80029prbye7bb792w	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:33:43.567
cmm6s3rm8002aprby92r85m4j	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:33:43.567
cmm6s3rm8002bprby28ngh2z0	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm8002cprbyd04cw2pe	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm8002dprbyiulekkc5	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rm8002eprby3wjgfw6j	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rm8002fprbygmd32rh0	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rm8002gprbyb36vzaxb	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	BROUGHT FORWARD H IB PAYMENT TO	\N	-5050.00	2026-02-28 20:33:43.567
cmm6s3rm8002hprby7iggbk8t	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	H IB PAYMENT TO	\N	-5050.00	2026-02-28 20:33:43.567
cmm6s3rm8002iprbyjh1hn3na	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	IB PAYMENT TO	\N	-5050.00	2026-02-28 20:33:43.567
cmm6s3rm8002jprby4vqmwe3c	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	PATRICK RENT -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm8002kprby17xw85l2	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm8002lprbyqsvbkpjx	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 20:33:43.567
cmm6s3rm8002mprbyognsasyb	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 20:33:43.567
cmm6s3rm8002nprby5j8r109t	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT - AUTOBANK ## -	\N	2099.79	2026-02-28 20:33:43.567
cmm6s3rm8002oprbyyzrecrpt	cmm6s3rl30001prby9boa3yy7	2026-01-28 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	2099.79	2026-02-28 20:33:43.567
cmm6s3rm8002pprbywuuaj2ey	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:33:43.567
cmm6s3rm8002qprbyp22iap0l	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 20:33:43.567
cmm6s3rm8002rprbywx3w1d6m	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	SBIB-MOBI FUN - DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rm8002sprby312yg3mu	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rm8002tprby0gs6mmkh	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-142.00	2026-02-28 20:33:43.567
cmm6s3rm8002uprbyer6xsaxr	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	S S*ABDILAYEK * JAN CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:33:43.567
cmm6s3rm8002vprby32emq3jr	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 20:33:43.567
cmm6s3rm8002wprby35h8spqt	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	BUCO LONGBEAC * JAN IB PAYMENT TO	\N	-5100.00	2026-02-28 20:33:43.567
cmm6s3rm8002xprbynuxsfjm8	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	IB PAYMENT TO	\N	-5100.00	2026-02-28 20:33:43.567
cmm6s3rm8002yprbyvathc8f7	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	JOSEPH JOZE -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm8002zprby9cud2w4x	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm80030prbyr8hc3f4s	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm80031prby7nbgujni	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm80032prbyobf2x704	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm80033prbycssurg2e	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	JULIET CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm80034prby4m5ystj3	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm80035prby85lewqfc	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 20:33:43.567
cmm6s3rm80036prbyv6p9zbfp	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 20:33:43.567
cmm6s3rm80037prbyvbbtxfu4	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	270.00	2026-02-28 20:33:43.567
cmm6s3rm80038prbydlwn0ois	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	JULIET CASH DEPOSIT - AUTOBANK ## -	\N	2387.43	2026-02-28 20:33:43.567
cmm6s3rm80039prbyvik1p4rc	cmm6s3rl30001prby9boa3yy7	2026-01-29 00:00:00	CASH DEPOSIT - AUTOBANK ## - VOUCHER PURCHASE -	\N	2387.43	2026-02-28 20:33:43.567
cmm6s3rm8003aprbyvq5efyoo	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm8003bprby5efeqmpg	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8003cprbyzwrdnaj8	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm8003dprbyl51tlg9v	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm8003eprbyb1cpmfos	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	SASOL KOMMETJ * JAN CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:33:43.567
cmm6s3rm8003fprby96cqj21b	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 20:33:43.567
cmm6s3rm8003gprby45qu4zoz	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	SCOOP DISTRIB * JAN VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm8003hprbyxb0b0wlu	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm8003iprby4qf5if50	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT - AUTOBANK	\N	-59.40	2026-02-28 20:33:43.567
cmm6s3rm8003jprbyb3oryv1p	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-59.40	2026-02-28 20:33:43.567
cmm6s3rm8003kprbynn73bqyb	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm8003lprbypab22crj	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm8003mprby6jzkxbtc	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm8003nprbyib6f1n9y	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	MONTHLY MANAGEMENT	\N	-7.50	2026-02-28 20:33:43.567
cmm6s3rm8003oprbyoyx4uori	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 20:33:43.567
cmm6s3rm8003pprbyc0o01agy	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 20:33:43.567
cmm6s3rm8003qprbyonjzchne	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT - AUTOBANK ## -	\N	4462.86	2026-02-28 20:33:43.567
cmm6s3rm8003rprbyp4y7r4hr	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - PAYSHAP PAYMENT FROM	\N	4462.86	2026-02-28 20:33:43.567
cmm6s3rm8003sprbyre5otc1l	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT - AUTOBANK ## -	\N	6405.66	2026-02-28 20:33:43.567
cmm6s3rm8003tprbyo3hjim3s	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - VOUCHER PURCHASE -	\N	6405.66	2026-02-28 20:33:43.567
cmm6s3rm8003uprbyh60m9ufc	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	5999.76	2026-02-28 20:33:43.567
cmm6s3rm8003vprbyl8zsz6tw	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT - AUTOBANK ## -	\N	6342.56	2026-02-28 20:33:43.567
cmm6s3rm8003wprbyxw6s9xbn	cmm6s3rl30001prby9boa3yy7	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - MONTHLY MANAGEMENT ## -	\N	6342.56	2026-02-28 20:33:43.567
cmm6s3rm8003xprby63m2v611	cmm6s3rl30001prby9boa3yy7	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 20:33:43.567
cmm6s3rm8003yprbyiajj1iqe	cmm6s3rl30001prby9boa3yy7	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO -	\N	-188.00	2026-02-28 20:33:43.567
cmm6s3rm8003zprbyggylgkcq	cmm6s3rl30001prby9boa3yy7	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 20:33:43.567
cmm6s3rm80040prbyc36yghlq	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm80041prby4spva5an	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm80042prby0qd30v5s	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm80043prbyr3k3952y	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90044prbyd4499gwa	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90045prbyrdu363bu	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	SHELLA CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm90046prbyr530vq3d	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm90047prbya6rb8ei7	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	IB PAYMENT TO	\N	-2000.00	2026-02-28 20:33:43.567
cmm6s3rm90048prbygaz04n5j	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	NURAAN SASMAAN -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm90049prbyojpjxmfe	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm9004aprbyabscgxim	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	IB PAYMENT TO	\N	-915.00	2026-02-28 20:33:43.567
cmm6s3rm9004bprbysfzqb064	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	WIZA SOLUTIONS WIFI -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm9004cprbyuwnd5d9j	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-2700.00	2026-02-28 20:33:43.567
cmm6s3rm9004dprby7nzy1l2j	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm9004eprby6lvbtct5	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 20:33:43.567
cmm6s3rm9004fprbyii843gsr	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9004gprbynsiyir2r	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:33:43.567
cmm6s3rm9004hprbymo0qqekt	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 20:33:43.567
cmm6s3rm9004iprbyx7znoh0l	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH WITHDRAWAL	\N	-188.00	2026-02-28 20:33:43.567
cmm6s3rm9004jprbyoorb7flw	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	IB PAYMENT TO	\N	-1900.00	2026-02-28 20:33:43.567
cmm6s3rm9004kprbygcnxemlt	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	PJOHN SHEDZA RENT -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm9004lprbywzp31tfc	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9004mprbystrq29bz	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9004nprbyagzcjt7r	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9004oprby90db4hb3	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CHEQUE CARD PURCHASE	\N	-99.99	2026-02-28 20:33:43.567
cmm6s3rm9004pprbyj6x74slk	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 20:33:43.567
cmm6s3rm9004qprbym7s7oj75	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 20:33:43.567
cmm6s3rm9004rprby4s8mfeh2	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm9004sprby2xuibr2g	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	6129.16	2026-02-28 20:33:43.567
cmm6s3rm9004tprbynxx2l54e	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	SHELLA CASH DEPOSIT - AUTOBANK ## -	\N	6481.96	2026-02-28 20:33:43.567
cmm6s3rm9004uprbye9hnbd34	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - IB PAYMENT TO -	\N	6481.96	2026-02-28 20:33:43.567
cmm6s3rm9004vprbyb1hlwbwi	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT - AUTOBANK ## -	\N	2604.91	2026-02-28 20:33:43.567
cmm6s3rm9004wprbyar75bmwx	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	2604.91	2026-02-28 20:33:43.567
cmm6s3rm9004xprbyips57442	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT - AUTOBANK ## -	\N	2947.71	2026-02-28 20:33:43.567
cmm6s3rm9004yprby6pczbjib	cmm6s3rl30001prby9boa3yy7	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	2947.71	2026-02-28 20:33:43.567
cmm6s3rm9004zprbyqz87e1j1	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:33:43.567
cmm6s3rm90050prby6zfifeas	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:33:43.567
cmm6s3rm90051prby5sf3f6bj	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm90052prbymokpc5gk	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90053prby49fuww77	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90054prbyi56g7lor	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	WAGES IB PAYMENT TO	\N	-1400.00	2026-02-28 20:33:43.567
cmm6s3rm90055prbyhx4rodic	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	IB PAYMENT TO	\N	-1400.00	2026-02-28 20:33:43.567
cmm6s3rm90056prbylozbk8oh	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	BLUEDOG TECHNOLOGY -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm90057prbyoy3e1k0v	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rm90058prbyb1s8y6e7	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2000.00	2026-02-28 20:33:43.567
cmm6s3rm90059prbyytbjfx2j	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9005aprbyrbj00prm	cmm6s3rl30001prby9boa3yy7	2026-02-02 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9005bprbyc9a9nto3	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:33:43.567
cmm6s3rm9005cprbyd7tuwqvq	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 20:33:43.567
cmm6s3rm9005dprby4gk1frnn	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-115.00	2026-02-28 20:33:43.567
cmm6s3rm9005eprby1wo96jkc	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9005fprbynlstkuqq	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9005gprbyth2tz8ag	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9005hprbyo862bcp7	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:33:43.567
cmm6s3rm9005iprby7qm3ull3	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9005jprbyewr1z0zq	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9005kprby57uod7ad	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9005lprbyqqhis6vx	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9005mprbyvd21awqe	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9005nprbyt8dgg9wd	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9005oprbytdhki001	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rm9005pprbynrdh2wqa	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:33:43.567
cmm6s3rm9005qprbyti5pukdk	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-400.00	2026-02-28 20:33:43.567
cmm6s3rm9005rprbyt2fqfo5b	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-149.98	2026-02-28 20:33:43.567
cmm6s3rm9005sprbybii2chz1	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CHECKERS SUNV * JAN CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:33:43.567
cmm6s3rm9005tprbyjsfg7yro	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 20:33:43.567
cmm6s3rm9005uprby6pxz76at	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT - AUTOBANK	\N	-10.80	2026-02-28 20:33:43.567
cmm6s3rm9005vprby1afh8qt3	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-10.80	2026-02-28 20:33:43.567
cmm6s3rm9005wprbyqhs2vk2g	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 20:33:43.567
cmm6s3rm9005xprby4x0z5afq	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 20:33:43.567
cmm6s3rm9005yprby0pifqbpv	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9005zprby3tyl917h	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	VAS TELKM : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm90060prby6co4fs06	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rm90061prbymb7t3nmz	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT - AUTOBANK ## -	\N	7296.24	2026-02-28 20:33:43.567
cmm6s3rm90062prby7zr96tyn	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK ## - LOTTERY WINNINGS	\N	7296.24	2026-02-28 20:33:43.567
cmm6s3rm90063prbyu65zxq72	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT - AUTOBANK ## -	\N	7742.24	2026-02-28 20:33:43.567
cmm6s3rm90064prby0nf06oou	cmm6s3rl30001prby9boa3yy7	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK ## - PREPAID MOBILE PURCHASE -	\N	7742.24	2026-02-28 20:33:43.567
cmm6s3rm90065prbyiaw3bzj5	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-950.00	2026-02-28 20:33:43.567
cmm6s3rm90066prby1y6i3fah	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	SAM CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm90067prbyvxtiug8a	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rm90068prbydfqep8vh	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm90069prbyjsmifpua	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006aprbyc2q6dqo6	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006bprbyh5ikpk80	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9006cprbyxjaxv6ka	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm9006dprby7rlhv5hd	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006eprbylgadddop	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rm9006fprbynpfp74c6	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rm9006gprbyz42upo9u	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rm9006hprbyarxeuay3	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	SAM CASH DEPOSIT - AUTOBANK ## -	\N	7054.04	2026-02-28 20:33:43.567
cmm6s3rm9006iprbyzpv4bhwy	cmm6s3rl30001prby9boa3yy7	2026-02-04 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE UNLOAD FROM VIRTUAL CARD	\N	7054.04	2026-02-28 20:33:43.567
cmm6s3rm9006jprbywod43r2v	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm9006kprbyifhod35x	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm9006lprbyfmsk1hya	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006mprby5au33cke	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006nprbytpe0up9f	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1000.00	2026-02-28 20:33:43.567
cmm6s3rm9006oprbysdxyegvq	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9006pprby9e6zyxhn	cmm6s3rl30001prby9boa3yy7	2026-02-05 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9006qprbyt3zvdgs1	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	H LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9006rprbysuvqqw0h	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rm9006sprby2v6jml2o	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006tprbytosih65w	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006uprbyeymxm4ux	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:33:43.567
cmm6s3rm9006vprbye5mt1af7	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006wprbyrv8eb3vw	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rm9006xprbyaxtabrn1	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rm9006yprbyy9ykx3ma	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm9006zprbyl2ls68hb	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90070prbyr5pqc94n	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rm90071prby8tv4xnz2	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90072prby9wzqv7g9	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rm90073prbyjb6338zt	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	INSURANCE PREMIUM	\N	-1076.81	2026-02-28 20:33:43.567
cmm6s3rm90074prbyumf55jsl	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	JAC P RF T CIN - DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rma0075prbykq5mmec8	cmm6s3rl30001prby9boa3yy7	2026-02-06 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rma0076prby3piwsujd	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma0077prbyk2vwgkg6	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0078prbyld0ms1ab	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0079prby3nhm1u1p	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2800.00	2026-02-28 20:33:43.567
cmm6s3rma007aprbyu5h4tbpu	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rma007bprbyemqwtggr	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rma007cprby8t5ji4va	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma007dprbyks1o5ffh	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma007eprbyoelp7zom	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma007fprbywkawnwo9	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	BROUGHT FORWARD DAVID NAKI CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 20:33:43.567
cmm6s3rma007gprby2ush6pza	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 20:33:43.567
cmm6s3rma007hprbym678b9rt	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 20:33:43.567
cmm6s3rma007iprby7hxcp4k6	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:33:43.567
cmm6s3rma007jprbyl8z7v50e	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT - AUTOBANK ## -	\N	9747.94	2026-02-28 20:33:43.567
cmm6s3rma007kprby62qn5awo	cmm6s3rl30001prby9boa3yy7	2026-02-08 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	9747.94	2026-02-28 20:33:43.567
cmm6s3rma007lprby3e94rwux	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma007mprby2y4nfp9n	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma007nprbyhyp6mrvp	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma007oprbyiz9hcb7q	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma007pprbytie692p6	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:33:43.567
cmm6s3rma007qprbyondm1vf5	cmm6s3rl30001prby9boa3yy7	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 20:33:43.567
cmm6s3rma007rprbyquv7bq7y	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-45.00	2026-02-28 20:33:43.567
cmm6s3rma007sprbykzsavnqf	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma007tprby9rbo9lq8	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma007uprbyebwkogrw	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-60.00	2026-02-28 20:33:43.567
cmm6s3rma007vprbyp17u8tvk	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma007wprbyw9iatdow	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1600.00	2026-02-28 20:33:43.567
cmm6s3rma007xprby6vgf4epp	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-250.00	2026-02-28 20:33:43.567
cmm6s3rma007yprbyc98f5ibw	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma007zprbypg4hy6i2	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0080prbykz1kfyqx	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0081prbycyf8bxvt	cmm6s3rl30001prby9boa3yy7	2026-02-10 00:00:00	: VOUCHER ## - CREDIT TRANSFER	\N	11531.81	2026-02-28 20:33:43.567
cmm6s3rma0082prbypoc5xe1f	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma0083prby8bvqodni	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma0084prby7gqxo8to	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma0085prbyv8iisj8j	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0086prbyy75ajj3c	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0087prbyh665fsuk	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 20:33:43.567
cmm6s3rma0088prbyajt73b48	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma0089prbypfxz4c1r	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma008aprbylys1jyrv	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma008bprbyfwrs14a9	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma008cprbyyiae3pys	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 20:33:43.567
cmm6s3rma008dprbymno8x9pp	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	BRIAN : PAYSHAP PAYMENT	\N	-7.00	2026-02-28 20:33:43.567
cmm6s3rma008eprby4fgcu7lt	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	: PAYSHAP PAYMENT	\N	-7.00	2026-02-28 20:33:43.567
cmm6s3rma008fprbyj5qtblut	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma008gprby5cxt5ypt	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:33:43.567
cmm6s3rma008hprby62dgh7hi	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 20:33:43.567
cmm6s3rma008iprbymr0tyj1p	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	BROUGHT FORWARD H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rma008jprbyunfwjini	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rma008kprbyac7hwtad	cmm6s3rl30001prby9boa3yy7	2026-02-11 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rma008lprby67oiv2zp	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	H VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma008mprby2mkufujr	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma008nprby3l80mjlv	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma008oprbyh8ga6fpo	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma008pprby1p2lzro1	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rma008qprby1bpr52vb	cmm6s3rl30001prby9boa3yy7	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rma008rprby2is0qexf	cmm6s3rl30001prby9boa3yy7	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma008sprby6gxrgann	cmm6s3rl30001prby9boa3yy7	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma008tprbypabwcr02	cmm6s3rl30001prby9boa3yy7	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma008uprbymvp63npc	cmm6s3rl30001prby9boa3yy7	2026-02-13 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rma008vprby6884v85u	cmm6s3rl30001prby9boa3yy7	2026-02-13 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rma008wprby1937ao9k	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	H VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma008xprby4f440edr	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma008yprby3vafecyr	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma008zprby66itp4bi	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma0090prbyhkc5jatk	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 20:33:43.567
cmm6s3rma0091prbyzx2fhz22	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rma0092prby82bnmm8n	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rma0093prby6q5mvon8	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma0094prbyrtgir3km	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma0095prbyku8eyh0b	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:33:43.567
cmm6s3rma0096prbyznbexqhb	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 20:33:43.567
cmm6s3rma0097prbyt3dtmqd0	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 20:33:43.567
cmm6s3rma0098prbyf14pql06	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 20:33:43.567
cmm6s3rma0099prbyyfvueeg3	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 20:33:43.567
cmm6s3rma009aprbyhevw7hdu	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:33:43.567
cmm6s3rma009bprbycidn25n8	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	SERVICE AGREEMENT	\N	-913.00	2026-02-28 20:33:43.567
cmm6s3rma009cprbyc502cpc8	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	WI ZA NETCASH - DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rma009dprbyqs7mzsn3	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 20:33:43.567
cmm6s3rma009eprbyu1rf3u1g	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 20:33:43.567
cmm6s3rma009fprbyjwwz08jx	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD VOUCHER PURCHASE -	\N	-115.86	2026-02-28 20:33:43.567
cmm6s3rma009gprbytg3lbmxo	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT - AUTOBANK ## -	\N	16948.30	2026-02-28 20:33:43.567
cmm6s3rma009hprby5577ghgg	cmm6s3rl30001prby9boa3yy7	2026-02-15 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	16948.30	2026-02-28 20:33:43.567
cmm6s3rma009iprbygivtgurt	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rma009jprbyzmdm9p3r	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	ASTRON ENERGY * FEB CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:33:43.567
cmm6s3rma009kprbywx8tj53s	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 20:33:43.567
cmm6s3rma009lprbycrnbcx37	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	HPY*FISH AND * FEB CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:33:43.567
cmm6s3rma009mprby54w7jxuu	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 20:33:43.567
cmm6s3rma009nprbyisf6eqdy	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	SPAR FISH HOE * FEB VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:33:43.567
cmm6s3rma009oprby0ihdlgae	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 20:33:43.567
cmm6s3rma009pprby4ogu26ci	cmm6s3rl30001prby9boa3yy7	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-240.00	2026-02-28 20:33:43.567
cmm6s3rma009qprbya9xh5qh8	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	STP VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma009rprby0rlyncpc	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 20:33:43.567
cmm6s3rma009sprbynixxopjr	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma009tprbyntciey8p	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rma009uprbyy2hw8xjp	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	ROUTER IB PAYMENT TO	\N	-2494.99	2026-02-28 20:33:43.567
cmm6s3rma009vprbyhc4ezetr	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	IB PAYMENT TO	\N	-2494.99	2026-02-28 20:33:43.567
cmm6s3rma009wprbymv2n0ppk	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	JAYDI COMPUTERS INSURANCE -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rma009xprby25famqt7	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rma009yprbybgkt2p6x	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-52.93	2026-02-28 20:33:43.567
cmm6s3rma009zprbydvv5dwp5	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rma00a0prbyqhlpqrdz	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-110.00	2026-02-28 20:33:43.567
cmm6s3rmb00a1prby7gm5yk1f	cmm6s3rl30001prby9boa3yy7	2026-02-17 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rmb00a2prbys02ndrkh	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	VAS LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:33:43.567
cmm6s3rmb00a3prby3lz56pqu	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 20:33:43.567
cmm6s3rmb00a4prbykt67qkrd	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00a5prbyosk13fcn	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00a6prbymlnx35q3	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	Details Service BROUGHT FORWARD LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rmb00a7prbyt3dj4dfe	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	BROUGHT FORWARD LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rmb00a8prby4sd8yw5m	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 20:33:43.567
cmm6s3rmb00a9prbyzm5lskws	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00aaprby3cqnl8mu	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE	\N	-25.00	2026-02-28 20:33:43.567
cmm6s3rmb00abprbyoyuvtie2	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	VAS CELLC : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rmb00acprbygh7s8err	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 20:33:43.567
cmm6s3rmb00adprbyx55mwneg	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT - AUTOBANK	\N	-14.40	2026-02-28 20:33:43.567
cmm6s3rmb00aeprbynu7f802v	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-14.40	2026-02-28 20:33:43.567
cmm6s3rmb00afprbyayftvf0w	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rmb00agprbyo8ef2h2u	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 20:33:43.567
cmm6s3rmb00ahprbyk9uwwbb2	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 20:33:43.567
cmm6s3rmb00aiprbyips6kkxf	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA	\N	-800.00	2026-02-28 20:33:43.567
cmm6s3rmb00ajprbye6fr0g0e	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-800.00	2026-02-28 20:33:43.567
cmm6s3rmb00akprbybful4srz	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	: PREPAID MOBILE PURCHASE ## - AUTOBANK CASH DEPOSIT	\N	19339.56	2026-02-28 20:33:43.567
cmm6s3rmb00alprby8030s7qk	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT - AUTOBANK ## -	\N	1075.16	2026-02-28 20:33:43.567
cmm6s3rmb00amprby58fjj0mp	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	1075.16	2026-02-28 20:33:43.567
cmm6s3rmb00anprbyzes5rtey	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT - AUTOBANK ## -	\N	1437.96	2026-02-28 20:33:43.567
cmm6s3rmb00aoprby3i92kswr	cmm6s3rl30001prby9boa3yy7	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	1437.96	2026-02-28 20:33:43.567
cmm6s3rmb00apprbyurr53ob8	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 20:33:43.567
cmm6s3rmb00aqprbyi611oxkf	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	IB PAYMENT TO	\N	-450.00	2026-02-28 20:33:43.567
cmm6s3rmb00arprby6pgl28in	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	BLUEDOG TECHNOLOGY BENGO -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rmb00asprby0g8qfkqg	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 20:33:43.567
cmm6s3rmb00atprbye9tucmnv	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00auprbyi7cogafp	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00avprbye3s8e1n2	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00awprbyfb79mn5f	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	REF VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00axprbyvtdwig9d	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00ayprby70as25l5	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00azprbyn1a6z8ps	cmm6s3rl30001prby9boa3yy7	2026-02-19 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00b0prby5plmpmnj	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	CHEQUE CARD PURCHASE	\N	-67.00	2026-02-28 20:33:43.567
cmm6s3rmb00b1prbyholq4sih	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:33:43.567
cmm6s3rmb00b2prbyjpw0en0i	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 20:33:43.567
cmm6s3rmb00b3prbygvmlpb6g	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rmb00b4prbysllk721l	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rmb00b5prby4bajreha	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:33:43.567
cmm6s3rmb00b6prby85otob4w	cmm6s3rl30001prby9boa3yy7	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 20:33:43.567
cmm6s3rmb00b7prbyjvj0m970	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00b8prby0m0klukm	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00b9prby0qdahkhm	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00baprbyr6zx4ejm	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00bbprbymfin9hrm	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00bcprbyzpw28qjp	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 20:33:43.567
cmm6s3rmb00bdprbyhbqb8y9l	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 20:33:43.567
cmm6s3rmb00beprbycsxhd7j9	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rmb00bfprbyd5x1a9xz	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rmb00bgprbyj2owocn2	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 20:33:43.567
cmm6s3rmb00bhprbyvcqrzeg4	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rmb00biprbydamynuxe	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT - AUTOBANK ## -	\N	1448.99	2026-02-28 20:33:43.567
cmm6s3rmb00bjprby43dqmpud	cmm6s3rl30001prby9boa3yy7	2026-02-22 00:00:00	CASH DEPOSIT - AUTOBANK ## - CELLPHONE INSTANTMON CASH TO -	\N	1448.99	2026-02-28 20:33:43.567
cmm6s3rmb00bkprbytikxf3bc	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	H ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rmb00blprby1lbdyrx3	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 20:33:43.567
cmm6s3rmb00bmprbyn5bom0ml	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	VAS : ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:33:43.567
cmm6s3rmb00bnprbyy9sg7xmv	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 20:33:43.567
cmm6s3rmb00boprbyc77bh52c	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 20:33:43.567
cmm6s3rmb00bpprbytesnxnm4	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00bqprby051hpu6b	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 20:33:43.567
cmm6s3rmb00brprbygfjg8flu	cmm6s3rl30001prby9boa3yy7	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 20:33:43.567
cmm6s3rmb00bsprby0ddcvonx	cmm6s3rl30001prby9boa3yy7	2026-10-01 00:00:00	VAS LOTTERY WINNINGS .	\N	12947.31	2026-02-28 20:33:43.567
cmm6s3rmb00btprbyy2usx1a9	cmm6s3rl30001prby9boa3yy7	2026-10-01 00:00:00	LOTTERY WINNINGS .	\N	12947.31	2026-02-28 20:33:43.567
cmm6uywh60003twnas85ccpw1	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	YOCO *PAHAR * JAN CREDIT TRANSFER	\N	3000.00	2026-02-28 21:53:55.432
cmm6uywh60004twna30a5x91d	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 21:53:55.432
cmm6uywh60005twnafnmteiri	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER CAPITEC S WILLIAMS	\N	370.00	2026-02-28 21:53:55.432
cmm6uywh60006twnay3a7noj7	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CAPITEC S WILLIAMS MAGTAPE CREDIT	\N	6426.40	2026-02-28 21:53:55.432
cmm6uywh60007twnagxkkxeg9	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	MAGTAPE CREDIT BLUEDOG TECHNOLOGY	\N	6426.40	2026-02-28 21:53:55.432
cmm6uywh60008twnaf87i7oc8	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT COLLIN BANDA	\N	450.00	2026-02-28 21:53:55.432
cmm6uywh60009twnawzzsi5hm	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER ISAAC MUGWAGWA	\N	365.00	2026-02-28 21:53:55.432
cmm6uywh6000atwnaulnltflp	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	BETWAY AUTOBANK CASH DEPOSIT	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000btwnaprl5tff8	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT JULIET	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000ctwnaqbv1xq4s	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	BET ZQTZSDKDQJI WF AUTOBANK CASH DEPOSIT	\N	3210.00	2026-02-28 21:53:55.432
cmm6uywh6000dtwnan0hh6u9b	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT JOSEPH	\N	3210.00	2026-02-28 21:53:55.432
cmm6uywh6000etwnaubkb3jjm	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	WAGES AUTOBANK CASH DEPOSIT	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000ftwnak3pj2e0c	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT WESLEY GWAMURI	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000gtwna2tfq3n1g	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT AUXILIA	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000htwnak6kl5y3l	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT SHELLA	\N	360.00	2026-02-28 21:53:55.432
cmm6uywh6000itwnax7d194fx	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	BUCO SIMONSTO * JAN AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 21:53:55.432
cmm6uywh6000jtwnam9mkw88q	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 21:53:55.432
cmm6uywh6000ktwnazdte66hp	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT PREVIOUS NDLOVU	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000ltwna1xwpkm77	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER SOSO	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000mtwnaa8msq0kh	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	H CREDIT TRANSFER	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000ntwna9twmzo25	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER STELLA MAKARUTSE	\N	350.00	2026-02-28 21:53:55.432
cmm6uywh6000otwnamcxhrt92	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	LIQUORSHOP SU * JAN AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 21:53:55.432
cmm6uywh6000ptwnab5yhz9dg	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 21:53:55.432
cmm6uywh6000qtwnalv2y0ddo	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	VAS AUTOBANK CASH DEPOSIT	\N	450.00	2026-02-28 21:53:55.432
cmm6uywh6000rtwnatrce7txn	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT GRACR LAISI	\N	450.00	2026-02-28 21:53:55.432
cmm6uywh6000stwna52kvggbx	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	370.00	2026-02-28 21:53:55.432
cmm6uywh6000ttwnaz4yoo7zg	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT SAM	\N	370.00	2026-02-28 21:53:55.432
cmm6uywh6000utwnacvpd4aqv	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	H CREDIT TRANSFER	\N	365.00	2026-02-28 21:53:55.432
cmm6uywh6000vtwnalrwx5y7c	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER CAPITEC N NJOLI	\N	365.00	2026-02-28 21:53:55.432
cmm6uywh6000wtwna9hlvql76	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	230.00	2026-02-28 21:53:55.432
cmm6uywh6000xtwnaq61wx5i7	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT -- of --	\N	230.00	2026-02-28 21:53:55.432
cmm6uywh6000ytwnaunr6ok53	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER PAYACCSYS C ADE A	\N	794.00	2026-02-28 21:53:55.432
cmm6uywh6000ztwnasfglsst8	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT	\N	200.00	2026-02-28 21:53:55.432
cmm6uywh60010twna60gdusdi	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT ADOLICE FUNERAL J	\N	200.00	2026-02-28 21:53:55.432
cmm6uywh60011twna6a3mn43g	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER PAYACCSYS DCB	\N	1000.00	2026-02-28 21:53:55.432
cmm6uywh60012twnapjkcms72	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER	\N	1949.99	2026-02-28 21:53:55.432
cmm6uywh60013twna871zm7ap	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	CREDIT TRANSFER STP -	\N	1949.99	2026-02-28 21:53:55.432
cmm6uywh60014twnabkzxobb1	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT NOMATTER BENGO	\N	750.00	2026-02-28 21:53:55.432
cmm6uywh60015twna2tlrhvx9	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT AARON MAUWO	\N	370.00	2026-02-28 21:53:55.432
cmm6uywh60016twna6m8aybf3	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	REF AUTOBANK CASH DEPOSIT	\N	200.00	2026-02-28 21:53:55.432
cmm6uywh60017twnaa0cpmjsv	cmm6uywgm0002twnatsns630r	2026-01-01 00:00:00	AUTOBANK CASH DEPOSIT EFFORT E	\N	200.00	2026-02-28 21:53:55.432
cmm6uywh60018twnap3gbpcbq	cmm6uywgm0002twnatsns630r	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER	\N	3000.00	2026-02-28 21:53:55.432
cmm6uywh60019twnawr8jan03	cmm6uywgm0002twnatsns630r	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE	\N	3000.00	2026-02-28 21:53:55.432
cmm6uywh6001atwnagor380el	cmm6uywgm0002twnatsns630r	2026-01-22 00:00:00	YOCO *PAHAR * EDIT TRANSFER FORTUNE VALUE LOADED TO VIRTUAL CARD -	\N	3000.00	2026-02-28 21:53:55.432
cmm6uywh6001btwna5ydmbzan	cmm6uywgm0002twnatsns630r	2026-01-23 00:00:00	Month-end R Details Service BROUGHT FORWARD	\N	6335.06	2026-02-28 21:53:55.432
cmm6uywh6001ctwnatucfdj1b	cmm6uywgm0002twnatsns630r	2026-01-23 00:00:00	Details Service BROUGHT FORWARD	\N	410.89	2026-02-28 21:53:55.432
cmm6uywh6001dtwna03wffu2s	cmm6uywgm0002twnatsns630r	2026-01-23 00:00:00	BROUGHT FORWARD	\N	410.89	2026-02-28 21:53:55.432
cmm6uywh6001etwnavq6ewd63	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 21:53:55.432
cmm6uywh6001ftwnabjo09ad4	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh6001gtwnafuwn14ln	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh6001htwnao8imb2to	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh6001itwnao270jg10	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VAS BETWAY : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001jtwna88xazzxm	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001ktwnak7b4ky0a	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	BETWAY VOUCHER PURCHASE	\N	-60.00	2026-02-28 21:53:55.432
cmm6uywh6001ltwnavmsonbep	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 21:53:55.432
cmm6uywh6001mtwnakeentjed	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001ntwnam707yyca	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001otwnam14as02v	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001ptwnaea9o50e7	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VOUCHER PURCHASE	\N	-50.00	2026-02-28 21:53:55.432
cmm6uywh6001qtwnalsklytw1	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	VAS HOLLYWOODBETS : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001rtwnabu284bjs	cmm6uywgm0002twnatsns630r	2026-01-25 00:00:00	CHEQUE CARD PURCHASE	\N	-260.00	2026-02-28 21:53:55.432
cmm6uywh6001stwna9bdsp9w1	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	FORTUNE VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 21:53:55.432
cmm6uywh6001ttwnacx62phtk	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 21:53:55.432
cmm6uywh6001utwna640n187k	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh6001vtwna8k4iivof	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VAS HOLLYWOODBETS : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001wtwna2ujdb4rt	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001xtwnaejmeymtx	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001ytwnawp2mpjmc	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh6001ztwnann85kk7c	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh60020twna7tyapoej	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh60021twnazlvesnrn	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh60022twnavwptlvpn	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1500.00	2026-02-28 21:53:55.432
cmm6uywh60023twnayqwegog1	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh60024twnaallw7hnq	cmm6uywgm0002twnatsns630r	2026-01-26 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh60025twna1090zypl	cmm6uywgm0002twnatsns630r	2026-01-27 00:00:00	H ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh60026twnaee4qwtk5	cmm6uywgm0002twnatsns630r	2026-01-27 00:00:00	ELECTRICITY PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh60027twnaas5hevp2	cmm6uywgm0002twnatsns630r	2026-01-27 00:00:00	VAS : ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 21:53:55.432
cmm6uywh60028twna976t7txa	cmm6uywgm0002twnatsns630r	2026-01-27 00:00:00	: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 21:53:55.432
cmm6uywh60029twnaln3ueuo3	cmm6uywgm0002twnatsns630r	2026-01-27 00:00:00	: ELECTRICITY PURCHASE ## - CREDIT TRANSFER	\N	28186.39	2026-02-28 21:53:55.432
cmm6uywh6002atwnaza56ywwf	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	BLUEDOG TECHNOLOGY PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 21:53:55.432
cmm6uywh6002btwna7qsp34ta	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 21:53:55.432
cmm6uywh6002ctwnau4b4o247	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh6002dtwnahp71t4fj	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh6002etwnab0fh1trt	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywh6002ftwna36l6p8oj	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh6002gtwnak44yzzof	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh6002htwna3pcc9frj	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	BROUGHT FORWARD H IB PAYMENT TO	\N	-5050.00	2026-02-28 21:53:55.432
cmm6uywh6002itwna1yqfwiti	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	H IB PAYMENT TO	\N	-5050.00	2026-02-28 21:53:55.432
cmm6uywh6002jtwnarsg5fu2k	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	IB PAYMENT TO	\N	-5050.00	2026-02-28 21:53:55.432
cmm6uywh6002ktwnaen5e7eea	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	PATRICK RENT -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh6002ltwna4dava0ym	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh6002mtwnat8r3lgph	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 21:53:55.432
cmm6uywh6002ntwna2ts2oyvk	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 21:53:55.432
cmm6uywh6002otwnaogmxhsy8	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	COLLIN BANDA CASH DEPOSIT - AUTOBANK ## -	\N	2099.79	2026-02-28 21:53:55.432
cmm6uywh6002ptwnabwncamfu	cmm6uywgm0002twnatsns630r	2026-01-28 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	2099.79	2026-02-28 21:53:55.432
cmm6uywh6002qtwna4hvvdskq	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	REF DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 21:53:55.432
cmm6uywh6002rtwnauiadnwc0	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	DEBICHECK DEBIT ORDER	\N	-202.47	2026-02-28 21:53:55.432
cmm6uywh6002stwna4a77pyx3	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	SBIB-MOBI FUN - DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh7002ttwnaul79329u	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh7002utwnamp15e8bh	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-142.00	2026-02-28 21:53:55.432
cmm6uywh7002vtwna9clssp0z	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	S S*ABDILAYEK * JAN CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 21:53:55.432
cmm6uywh7002wtwna3coemg2r	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	CHEQUE CARD PURCHASE	\N	-158.39	2026-02-28 21:53:55.432
cmm6uywh7002xtwna62bpkhyp	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	BUCO LONGBEAC * JAN IB PAYMENT TO	\N	-5100.00	2026-02-28 21:53:55.432
cmm6uywh7002ytwna6t6hba4h	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	IB PAYMENT TO	\N	-5100.00	2026-02-28 21:53:55.432
cmm6uywh7002ztwnadl0ifa11	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	JOSEPH JOZE -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh70030twna0fynfaok	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh70031twnansjvna43	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh70032twnays5a9eeb	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70033twnah0keiawl	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70034twnaihdfk76p	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	JULIET CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh70035twnae0b2bmjv	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh70036twnajsrhscxm	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT	\N	270.00	2026-02-28 21:53:55.432
cmm6uywh70037twnaf1w9t9e1	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE	\N	270.00	2026-02-28 21:53:55.432
cmm6uywh70038twnakldzvshd	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	BUCO SIMONSTO * AUTOBANK CASH DEPOSIT FLORENCE CASH DEPOSIT FEE - AUTOBANK ## -	\N	270.00	2026-02-28 21:53:55.432
cmm6uywh70039twnauz0g1bgq	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	JULIET CASH DEPOSIT - AUTOBANK ## -	\N	2387.43	2026-02-28 21:53:55.432
cmm6uywh7003atwnaxmaoi0qg	cmm6uywgm0002twnatsns630r	2026-01-29 00:00:00	CASH DEPOSIT - AUTOBANK ## - VOUCHER PURCHASE -	\N	2387.43	2026-02-28 21:53:55.432
cmm6uywh7003btwnakai56x2u	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh7003ctwnah1oc4pti	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7003dtwna0mro4hq8	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7003etwnadoqu1bwp	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh7003ftwna6d6j47hl	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	SASOL KOMMETJ * JAN CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 21:53:55.432
cmm6uywh7003gtwnahga3aspu	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CHEQUE CARD PURCHASE	\N	-969.45	2026-02-28 21:53:55.432
cmm6uywh7003htwnajdsh12ql	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	SCOOP DISTRIB * JAN VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh7003itwnaf7v77kjr	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh7003jtwnary9jox5d	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT - AUTOBANK	\N	-59.40	2026-02-28 21:53:55.432
cmm6uywh7003ktwnal2nm857r	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-59.40	2026-02-28 21:53:55.432
cmm6uywh7003ltwnal9mpxa73	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh7003mtwnafaepmxnd	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh7003ntwna0q3ket05	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh7003otwna6qosg8sy	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	MONTHLY MANAGEMENT	\N	-7.50	2026-02-28 21:53:55.432
cmm6uywh7003ptwnaikg7muul	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT	\N	550.00	2026-02-28 21:53:55.432
cmm6uywh7003qtwna0x6xo3b6	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	LIQUORSHOP SU * AUTOBANK CASH DEPOSIT PASTOR ADRIAN	\N	550.00	2026-02-28 21:53:55.432
cmm6uywh7003rtwna87jqfgz1	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	JOSEPH CASH DEPOSIT - AUTOBANK ## -	\N	4462.86	2026-02-28 21:53:55.432
cmm6uywh7003stwna0gwo413p	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - PAYSHAP PAYMENT FROM	\N	4462.86	2026-02-28 21:53:55.432
cmm6uywh7003ttwnagtza9odk	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	WESLEY GWAMURI CASH DEPOSIT - AUTOBANK ## -	\N	6405.66	2026-02-28 21:53:55.432
cmm6uywh7003utwnalbat9rhs	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - VOUCHER PURCHASE -	\N	6405.66	2026-02-28 21:53:55.432
cmm6uywh7003vtwnaca4h3d8f	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	5999.76	2026-02-28 21:53:55.432
cmm6uywh7003wtwnazrdl45e3	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	AUXILIA CASH DEPOSIT - AUTOBANK ## -	\N	6342.56	2026-02-28 21:53:55.432
cmm6uywh7003xtwnaapg449jt	cmm6uywgm0002twnatsns630r	2026-01-30 00:00:00	CASH DEPOSIT - AUTOBANK ## - MONTHLY MANAGEMENT ## -	\N	6342.56	2026-02-28 21:53:55.432
cmm6uywh7003ytwna8xsrh5vj	cmm6uywgm0002twnatsns630r	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ##	\N	-188.00	2026-02-28 21:53:55.432
cmm6uywh7003ztwna9z7bciep	cmm6uywgm0002twnatsns630r	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO -	\N	-188.00	2026-02-28 21:53:55.432
cmm6uywh70040twna46l259hb	cmm6uywgm0002twnatsns630r	2026-01-31 00:00:00	H T : : CASH WITHDRAWAL FEE ## IB PAYMENT TO - PJOHN SHEDZA RENT	\N	-188.00	2026-02-28 21:53:55.432
cmm6uywh70041twnandkdie7w	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh70042twnaj5n14tw1	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	Details Service BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70043twnas63j82gt	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	BROUGHT FORWARD : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70044twnagg0hn39b	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70045twnavo24qwkz	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70046twna1etwxb4m	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	SHELLA CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh70047twna30059slb	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh70048twnau4p4e335	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	IB PAYMENT TO	\N	-2000.00	2026-02-28 21:53:55.432
cmm6uywh70049twnaym0dk2uk	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	NURAAN SASMAAN -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh7004atwnamheoso69	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh7004btwna2lzqjmde	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	IB PAYMENT TO	\N	-915.00	2026-02-28 21:53:55.432
cmm6uywh7004ctwnaunpg04en	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	WIZA SOLUTIONS WIFI -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh7004dtwnant6w2xo0	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-2700.00	2026-02-28 21:53:55.432
cmm6uywh7004etwnaylqmphrw	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh7004ftwnat25c9dcy	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-60.00	2026-02-28 21:53:55.432
cmm6uywh7004gtwnayy5xsj8z	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7004htwnauvx5x8nh	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	SD AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 21:53:55.432
cmm6uywh7004itwnacc86pjtx	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	AUTOBANK CASH WITHDRAWAL AT	\N	-8000.00	2026-02-28 21:53:55.432
cmm6uywh7004jtwnasrt9pxae	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH WITHDRAWAL	\N	-188.00	2026-02-28 21:53:55.432
cmm6uywh7004ktwna6xv7jllk	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	IB PAYMENT TO	\N	-1900.00	2026-02-28 21:53:55.432
cmm6uywh7004ltwna98yc2n0i	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	PJOHN SHEDZA RENT -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh7004mtwnagcm9bvwf	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh7004ntwnae9funokd	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7004otwnaitxmd8wj	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	VOUCHER PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh7004ptwna9t761ont	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CHEQUE CARD PURCHASE	\N	-99.99	2026-02-28 21:53:55.432
cmm6uywh7004qtwnal8hgmqto	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 21:53:55.432
cmm6uywh7004rtwnasfg61ll0	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 21:53:55.432
cmm6uywh7004stwnat3h6rooc	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh7004ttwnasvk10ur9	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	: VOUCHER ## - AUTOBANK CASH DEPOSIT	\N	6129.16	2026-02-28 21:53:55.432
cmm6uywh7004utwnaa6dq2gzz	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	SHELLA CASH DEPOSIT - AUTOBANK ## -	\N	6481.96	2026-02-28 21:53:55.432
cmm6uywh7004vtwnazhv7r8z7	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - IB PAYMENT TO -	\N	6481.96	2026-02-28 21:53:55.432
cmm6uywh7004wtwnaks6kgg70	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	FLORENCE CASH DEPOSIT - AUTOBANK ## -	\N	2604.91	2026-02-28 21:53:55.432
cmm6uywh7004xtwnaf3v5ri8n	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	2604.91	2026-02-28 21:53:55.432
cmm6uywh7004ytwna4684vig8	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	PREVIOUS NDLOVU CASH DEPOSIT - AUTOBANK ## -	\N	2947.71	2026-02-28 21:53:55.432
cmm6uywh7004ztwnaofnytpbe	cmm6uywgm0002twnatsns630r	2026-02-01 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	2947.71	2026-02-28 21:53:55.432
cmm6uywh70050twnayqip0hew	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	SOSO VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 21:53:55.432
cmm6uywh70051twna9l94soqs	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 21:53:55.432
cmm6uywh70052twnatuiwemvb	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh70053twnadma95org	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70054twnanm527cxp	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh70055twnaikmb4bhf	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	WAGES IB PAYMENT TO	\N	-1400.00	2026-02-28 21:53:55.432
cmm6uywh70056twna1epqinhg	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	IB PAYMENT TO	\N	-1400.00	2026-02-28 21:53:55.432
cmm6uywh70057twnapjoj6uc5	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	BLUEDOG TECHNOLOGY -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh70058twnaupsdwzr4	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh70059twnaik8duvh9	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2000.00	2026-02-28 21:53:55.432
cmm6uywh7005atwnashpnvrc2	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh7005btwnaisryxmp3	cmm6uywgm0002twnatsns630r	2026-02-02 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh7005ctwnav2k0j1tc	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	STELLA MAKARUTSE VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 21:53:55.432
cmm6uywh7005dtwnay7yjk5py	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1500.00	2026-02-28 21:53:55.432
cmm6uywh7005etwnaaxbghn2u	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-115.00	2026-02-28 21:53:55.432
cmm6uywh7005ftwnarfqmgguy	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh7005gtwna0hswwk9o	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7005htwna0h5wr3bv	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7005itwnaqdxp95y1	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 21:53:55.432
cmm6uywh7005jtwnappenq984	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7005ktwnaul1ntmey	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh7005ltwna8zbhdfwa	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7005mtwnajuorg5zb	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh7005ntwna3140fzmn	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh7005otwnaxz42p9md	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh7005ptwnajdzxtj6q	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywh7005qtwnaz26j0btk	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 21:53:55.432
cmm6uywh7005rtwnaedesohyi	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-400.00	2026-02-28 21:53:55.432
cmm6uywh7005stwnah2ieskrp	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-149.98	2026-02-28 21:53:55.432
cmm6uywh7005ttwna4g8ihfdy	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CHECKERS SUNV * JAN CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 21:53:55.432
cmm6uywh7005utwnaox6focs3	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CHEQUE CARD PURCHASE	\N	-191.29	2026-02-28 21:53:55.432
cmm6uywh8005vtwnare2r5sey	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT - AUTOBANK	\N	-10.80	2026-02-28 21:53:55.432
cmm6uywh8005wtwnas3c79mvz	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-10.80	2026-02-28 21:53:55.432
cmm6uywh8005xtwnanh01dgnp	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 21:53:55.432
cmm6uywh8005ytwnaba54yf4l	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-9.00	2026-02-28 21:53:55.432
cmm6uywh8005ztwnaolx2o86a	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	PREPAID MOBILE PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80060twnak6y0xhda	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	VAS TELKM : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh80061twnaogpljsa5	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh80062twnabunlh5vc	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	PASTOR ADRIAN CASH DEPOSIT - AUTOBANK ## -	\N	7296.24	2026-02-28 21:53:55.432
cmm6uywh80063twnaalno443s	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK ## - LOTTERY WINNINGS	\N	7296.24	2026-02-28 21:53:55.432
cmm6uywh80064twna20zp2v74	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	GRACR LAISI CASH DEPOSIT - AUTOBANK ## -	\N	7742.24	2026-02-28 21:53:55.432
cmm6uywh80065twnaatvioipl	cmm6uywgm0002twnatsns630r	2026-02-03 00:00:00	CASH DEPOSIT - AUTOBANK ## - PREPAID MOBILE PURCHASE -	\N	7742.24	2026-02-28 21:53:55.432
cmm6uywh80066twna2rfzdour	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-950.00	2026-02-28 21:53:55.432
cmm6uywh80067twnachfvgfte	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	SAM CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh80068twnasbpg0o12	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywh80069twnasnxvgmki	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh8006atwna0uaf6cjx	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006btwnajt305c6q	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006ctwna9t6860cp	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh8006dtwnani8ua4ad	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh8006etwnamxbe1sjf	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006ftwnaqwihitmb	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh8006gtwna964k8qzn	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh8006htwnap1rpsy6g	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh8006itwnafd548uml	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	SAM CASH DEPOSIT - AUTOBANK ## -	\N	7054.04	2026-02-28 21:53:55.432
cmm6uywh8006jtwnapla766we	cmm6uywgm0002twnatsns630r	2026-02-04 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE UNLOAD FROM VIRTUAL CARD	\N	7054.04	2026-02-28 21:53:55.432
cmm6uywh8006ktwna0m8jfw3m	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	CAPITEC N NJOLI VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh8006ltwnaqk1r9jca	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh8006mtwna1kjz1yof	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006ntwnah5n6h5x1	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006otwna0h7feviv	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-1000.00	2026-02-28 21:53:55.432
cmm6uywh8006ptwnayo04hzhk	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8006qtwnaw1z8ti4n	cmm6uywgm0002twnatsns630r	2026-02-05 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8006rtwnaezi26dyh	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	H LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8006stwna2ytgt2kt	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8006ttwna02yynwpi	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006utwnayff9zndd	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006vtwnaui9muykw	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 21:53:55.432
cmm6uywh8006wtwnaimbtrncj	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8006xtwnafkzj3rll	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh8006ytwna1jsfsow2	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh8006ztwnacemz5z55	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80070twnaisyxleyc	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80071twnae0f4j4ud	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80072twnaoqipr4un	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VAS BLU VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80073twnamkt649fw	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80074twnaiqyndhoc	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	INSURANCE PREMIUM	\N	-1076.81	2026-02-28 21:53:55.432
cmm6uywh80075twnazglmolet	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	JAC P RF T CIN - DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh80076twnazqeurs2g	cmm6uywgm0002twnatsns630r	2026-02-06 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh80077twnaqvvy1lgf	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80078twnamxu9zoce	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80079twnahvfv6zsg	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007atwnakzrku9ep	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-2800.00	2026-02-28 21:53:55.432
cmm6uywh8007btwnaklw1htyy	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8007ctwnarv0gu5q6	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh8007dtwnarf3ch8u6	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh8007etwnabqe11kmb	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh8007ftwnax7ug3phv	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh8007gtwnapaoqo59s	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	BROUGHT FORWARD DAVID NAKI CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 21:53:55.432
cmm6uywh8007htwnag9q9k1aj	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 21:53:55.432
cmm6uywh8007itwnatfu9l7i5	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-5.40	2026-02-28 21:53:55.432
cmm6uywh8007jtwnaqwsf8tch	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 21:53:55.432
cmm6uywh8007ktwnad9uzv1xn	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	DAVID NAKI CASH DEPOSIT - AUTOBANK ## -	\N	9747.94	2026-02-28 21:53:55.432
cmm6uywh8007ltwna9lqcaxdc	cmm6uywgm0002twnatsns630r	2026-02-08 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	9747.94	2026-02-28 21:53:55.432
cmm6uywh8007mtwnad7wdq8zy	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh8007ntwnahhl8ls1q	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007otwnaeajkjks6	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007ptwna0afsb285	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh8007qtwna9a0nby66	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	WAGES VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 21:53:55.432
cmm6uywh8007rtwnaygofcpqc	cmm6uywgm0002twnatsns630r	2026-02-09 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-365.00	2026-02-28 21:53:55.432
cmm6uywh8007stwnav73493ie	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-45.00	2026-02-28 21:53:55.432
cmm6uywh8007ttwna926yn0qw	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007utwna5iovjxld	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007vtwna4t1popxw	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	LOTTERY PURCHASE	\N	-60.00	2026-02-28 21:53:55.432
cmm6uywh8007wtwnags3ruvio	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh8007xtwna9d1bauty	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-1600.00	2026-02-28 21:53:55.432
cmm6uywh8007ytwna2zntwtro	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-250.00	2026-02-28 21:53:55.432
cmm6uywh8007ztwnae5y808n4	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80080twna2n0clp8c	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80081twnaxz1p7sff	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80082twnakjss310d	cmm6uywgm0002twnatsns630r	2026-02-10 00:00:00	: VOUCHER ## - CREDIT TRANSFER	\N	11531.81	2026-02-28 21:53:55.432
cmm6uywh80083twnalyp0mqt8	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80084twna0gwufhtm	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80085twnag9dh4eah	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh80086twnagldny5xr	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VAS VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80087twnacrxl97xf	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh80088twna7ghe4qk3	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-50.00	2026-02-28 21:53:55.432
cmm6uywh90089twnakd5x3xip	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh9008atwna1jv7zcrk	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh9008btwnaxk8cesof	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh9008ctwnahws0ci53	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	REF PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh9008dtwnamqs1rg5g	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	PAYSHAP PAYMENT TO	\N	-300.00	2026-02-28 21:53:55.432
cmm6uywh9008etwnadojn32rq	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	BRIAN : PAYSHAP PAYMENT	\N	-7.00	2026-02-28 21:53:55.432
cmm6uywh9008ftwna13to4ylc	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	: PAYSHAP PAYMENT	\N	-7.00	2026-02-28 21:53:55.432
cmm6uywh9008gtwnakzjardj7	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9008htwnalz1g7a4f	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	WAGES CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 21:53:55.432
cmm6uywh9008itwnabyrlolc0	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-5000.00	2026-02-28 21:53:55.432
cmm6uywh9008jtwna84p8fne1	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	BROUGHT FORWARD H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh9008ktwnabd4nskn1	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	H - INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh9008ltwnac82mpme7	cmm6uywgm0002twnatsns630r	2026-02-11 00:00:00	- INSTANT MONEY	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywh9008mtwnawpbdhhq0	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	H VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9008ntwnaj9829rnx	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	VOUCHER PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9008otwnahjko92us	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh9008ptwnadla6tn1x	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh9008qtwnajw0yrkvf	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywh9008rtwnatrhs7q6f	cmm6uywgm0002twnatsns630r	2026-02-12 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywh9008stwnatbnzsdq6	cmm6uywgm0002twnatsns630r	2026-02-13 00:00:00	REF VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9008ttwnapa0hiqog	cmm6uywgm0002twnatsns630r	2026-02-13 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9008utwnaksu9z3ma	cmm6uywgm0002twnatsns630r	2026-02-13 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywh9008vtwnaylnvg7gc	cmm6uywgm0002twnatsns630r	2026-02-13 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh9008wtwna2452iqi3	cmm6uywgm0002twnatsns630r	2026-02-13 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywh9008xtwnajtwgfulv	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	H VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh9008ytwnadce25x8v	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh9008ztwnarihb78d7	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh90090twnav6rribea	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh90091twna2ants4ji	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-55.00	2026-02-28 21:53:55.432
cmm6uywh90092twnanv35dbt7	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	VAS VODA : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh90093twnal2atfbov	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywh90094twnad18pnr1f	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh90095twnaw62rfq0i	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh90096twna1zvhm7za	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	BET I ZRANTIEBMSA PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 21:53:55.432
cmm6uywh90097twnaslpvupyy	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	PREPAID MOBILE PURCHASE	\N	-29.00	2026-02-28 21:53:55.432
cmm6uywh90098twna05shubxc	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-350.00	2026-02-28 21:53:55.432
cmm6uywh90099twnakqng0xxy	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 21:53:55.432
cmm6uywh9009atwnady8h0u98	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 21:53:55.432
cmm6uywh9009btwnagc27o8ff	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	PAYACCSYS DCB SERVICE AGREEMENT	\N	-913.00	2026-02-28 21:53:55.432
cmm6uywh9009ctwna2zg8odzh	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	SERVICE AGREEMENT	\N	-913.00	2026-02-28 21:53:55.432
cmm6uywh9009dtwnavnbdme4k	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	WI ZA NETCASH - DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh9009etwna2yufgidf	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	- DEBIT ORDER	\N	-3.50	2026-02-28 21:53:55.432
cmm6uywh9009ftwnaj20udjwb	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD	\N	-115.86	2026-02-28 21:53:55.432
cmm6uywh9009gtwnabrbi2coa	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	SHELL KOMMETJ * VALUE UNLOAD FROM VIRTUAL CARD VOUCHER PURCHASE -	\N	-115.86	2026-02-28 21:53:55.432
cmm6uywh9009htwnala1qe3uo	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	ADOLICE FUNERAL J CASH DEPOSIT - AUTOBANK ## -	\N	16948.30	2026-02-28 21:53:55.432
cmm6uywh9009itwnati2yabnu	cmm6uywgm0002twnatsns630r	2026-02-15 00:00:00	CASH DEPOSIT - AUTOBANK ## - CREDIT TRANSFER	\N	16948.30	2026-02-28 21:53:55.432
cmm6uywh9009jtwnaewgwtw74	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywh9009ktwnajgq46l9n	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	ASTRON ENERGY * FEB CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 21:53:55.432
cmm6uywh9009ltwnacrqqk6n0	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-120.00	2026-02-28 21:53:55.432
cmm6uywh9009mtwna3fiparp0	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	HPY*FISH AND * FEB CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 21:53:55.432
cmm6uywh9009ntwnah2vq1qt8	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	CHEQUE CARD PURCHASE	\N	-106.17	2026-02-28 21:53:55.432
cmm6uywh9009otwnaxmvb157s	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	SPAR FISH HOE * FEB VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 21:53:55.432
cmm6uywh9009ptwnaiqo6zav7	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-160.00	2026-02-28 21:53:55.432
cmm6uywh9009qtwnamyuopsrw	cmm6uywgm0002twnatsns630r	2026-02-16 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-240.00	2026-02-28 21:53:55.432
cmm6uywh9009rtwnazg31x4il	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	STP VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh9009stwnam172htqb	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-90.00	2026-02-28 21:53:55.432
cmm6uywh9009ttwnaymo3bqcb	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh9009utwna6qu0xewz	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywh9009vtwnauqszhlca	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	ROUTER IB PAYMENT TO	\N	-2494.99	2026-02-28 21:53:55.432
cmm6uywh9009wtwnaefbquh45	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	IB PAYMENT TO	\N	-2494.99	2026-02-28 21:53:55.432
cmm6uywh9009xtwnaloyjk9su	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	JAYDI COMPUTERS INSURANCE -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh9009ytwnacq9h0vfa	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywh9009ztwnayimrm0fs	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-52.93	2026-02-28 21:53:55.432
cmm6uywh900a0twnawsnamnlx	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00a1twnak2i6xewr	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-110.00	2026-02-28 21:53:55.432
cmm6uywha00a2twnavwixee58	cmm6uywgm0002twnatsns630r	2026-02-17 00:00:00	CHEQUE CARD PURCHASE	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywha00a3twna4drru3jk	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	VAS LOTTERY PURCHASE	\N	-40.00	2026-02-28 21:53:55.432
cmm6uywha00a4twnanhe5ypu5	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-40.00	2026-02-28 21:53:55.432
cmm6uywha00a5twnaivsm9e7o	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	VAS LOTTO LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00a6twnanh3uzmru	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00a7twnanw6pcagn	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	Details Service BROUGHT FORWARD LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywha00a8twnacbuurycj	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	BROUGHT FORWARD LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywha00a9twna54k4n93d	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	LOTTERY PURCHASE	\N	-30.00	2026-02-28 21:53:55.432
cmm6uywha00aatwnahewemg3t	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	VAS POWERBALL LOTTERY PURCHASE	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00abtwnaoxasman1	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	PREPAID MOBILE PURCHASE	\N	-25.00	2026-02-28 21:53:55.432
cmm6uywha00actwna091jc4x8	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	VAS CELLC : PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywha00adtwnan1wwqge5	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	: PREPAID MOBILE PURCHASE	\N	-1.00	2026-02-28 21:53:55.432
cmm6uywha00aetwna30bdtibn	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT - AUTOBANK	\N	-14.40	2026-02-28 21:53:55.432
cmm6uywha00aftwnadu9h1s0b	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-14.40	2026-02-28 21:53:55.432
cmm6uywha00agtwnab3kghsay	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywha00ahtwnaqppuqjjj	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-7.20	2026-02-28 21:53:55.432
cmm6uywha00aitwna9lh91cnu	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM	\N	-800.00	2026-02-28 21:53:55.432
cmm6uywha00ajtwnaea1zehbu	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA	\N	-800.00	2026-02-28 21:53:55.432
cmm6uywha00aktwnadb5onkjt	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	HPY*FISH AND * PAYSHAP PAYMENT FROM T NYADIMA CELLPHONE INSTANTMON CASH TO -	\N	-800.00	2026-02-28 21:53:55.432
cmm6uywha00altwnauhe0zqeg	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	: PREPAID MOBILE PURCHASE ## - AUTOBANK CASH DEPOSIT	\N	19339.56	2026-02-28 21:53:55.432
cmm6uywha00amtwna1j17w02b	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	NOMATTER BENGO CASH DEPOSIT - AUTOBANK ## -	\N	1075.16	2026-02-28 21:53:55.432
cmm6uywha00antwna3f6zs6ys	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK ## - AUTOBANK CASH DEPOSIT	\N	1075.16	2026-02-28 21:53:55.432
cmm6uywha00aotwnaw03496m8	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	AARON MAUWO CASH DEPOSIT - AUTOBANK ## -	\N	1437.96	2026-02-28 21:53:55.432
cmm6uywha00aptwnaaar1lkeg	cmm6uywgm0002twnatsns630r	2026-02-18 00:00:00	CASH DEPOSIT - AUTOBANK ## - VALUE LOADED TO VIRTUAL CARD -	\N	1437.96	2026-02-28 21:53:55.432
cmm6uywha00aqtwnamy9uoaww	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-450.00	2026-02-28 21:53:55.432
cmm6uywha00artwnabojiw8oj	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	IB PAYMENT TO	\N	-450.00	2026-02-28 21:53:55.432
cmm6uywha00astwna552f9x6s	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	BLUEDOG TECHNOLOGY BENGO -ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywha00attwna5814ir2a	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	-ELECTRONIC ACCOUNT PAYMENT	\N	-2.00	2026-02-28 21:53:55.432
cmm6uywha00autwnaiqww7oai	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00avtwna81ekffgc	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00awtwna0sz90t8y	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00axtwnasuv7po74	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	REF VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00aytwnafbr9reco	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00aztwnaia1zhf5z	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00b0twna736bg7il	cmm6uywgm0002twnatsns630r	2026-02-19 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00b1twna1t8sr21h	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	CHEQUE CARD PURCHASE	\N	-67.00	2026-02-28 21:53:55.432
cmm6uywha00b2twnasgpmln5v	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	T NYADIMA CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 21:53:55.432
cmm6uywha00b3twnaqka2ttdn	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-400.00	2026-02-28 21:53:55.432
cmm6uywha00b4twnaaj1pf94h	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywha00b5twna8wf3ua79	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywha00b6twnal133eifi	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	H VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 21:53:55.432
cmm6uywha00b7twnahbp8stwk	cmm6uywgm0002twnatsns630r	2026-02-20 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-340.00	2026-02-28 21:53:55.432
cmm6uywha00b8twnawrmupfyp	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00b9twna20j47q2c	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00batwnawhg2jwvk	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00bbtwnall9ylq74	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	Details Service BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00bctwna8rv1x28e	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	BROUGHT FORWARD VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00bdtwnax4hzjt8g	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 21:53:55.432
cmm6uywha00betwnaos543j2y	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	CASH DEPOSIT - AUTOBANK	\N	-3.60	2026-02-28 21:53:55.432
cmm6uywha00bftwna2yuaxrah	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywha00bgtwnarh9ff8bt	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	H - INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywha00bhtwnacarqez3q	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	- INSTANT MONEY	\N	-10.00	2026-02-28 21:53:55.432
cmm6uywha00bitwnapy07k3kq	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	CELLPHONE H CELLPHONE INSTANTMON CASH TO	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywha00bjtwnazx0h2hi4	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	EFFORT E CASH DEPOSIT - AUTOBANK ## -	\N	1448.99	2026-02-28 21:53:55.432
cmm6uywha00bktwna0eymf9po	cmm6uywgm0002twnatsns630r	2026-02-22 00:00:00	CASH DEPOSIT - AUTOBANK ## - CELLPHONE INSTANTMON CASH TO -	\N	1448.99	2026-02-28 21:53:55.432
cmm6uywha00bltwnaevpqyv2f	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	H ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywha00bmtwna9j1fno8w	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	ELECTRICITY PURCHASE	\N	-150.00	2026-02-28 21:53:55.432
cmm6uywha00bntwnavc5lautd	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	VAS : ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 21:53:55.432
cmm6uywha00botwnads4tjx3t	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	: ELECTRICITY PURCHASE	\N	-1.60	2026-02-28 21:53:55.432
cmm6uywha00bptwnaa80xiinq	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	VOUCHER PURCHASE	\N	-100.00	2026-02-28 21:53:55.432
cmm6uywha00bqtwnaqp1pacpx	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	VAS OTT VOUCHER : VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00brtwnay0loa2rk	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	: VOUCHER	\N	-2.95	2026-02-28 21:53:55.432
cmm6uywha00bstwnafrk25v36	cmm6uywgm0002twnatsns630r	2026-02-23 00:00:00	VALUE LOADED TO VIRTUAL CARD	\N	-200.00	2026-02-28 21:53:55.432
cmm6uywha00bttwnan1h9mdmy	cmm6uywgm0002twnatsns630r	2026-10-01 00:00:00	VAS LOTTERY WINNINGS .	\N	12947.31	2026-02-28 21:53:55.432
cmm6uywha00butwnahyf56xi4	cmm6uywgm0002twnatsns630r	2026-10-01 00:00:00	LOTTERY WINNINGS .	\N	12947.31	2026-02-28 21:53:55.432
\.


--
-- TOC entry 5934 (class 0 OID 221837)
-- Dependencies: 281
-- Data for Name: bank_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_transactions (id, "bankAccountId", "transactionDate", description, reference, debit, credit, amount, balance, hash, "isReconciled", "matchedType", "matchedId", "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5897 (class 0 OID 204184)
-- Dependencies: 244
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bills (id, "billNumber", reference, "vendorName", description, "billDate", "dueDate", status, "totalAmount", "clientId", "userId", "createdAt", "updatedAt", "amountPaid", "balanceDue", "journalEntryId", "paidDate", "supplierId") FROM stdin;
cmm6nj44n00ed1klqdm4z3naf	1	INV0069080	Get Wiza	{"memo":"","items":[{"description":"FTTH-FF-120/60-24M (01-03-2026 - 31-03-2026)","category":"","quantity":1,"unitCost":795,"taxRate":15}]}	2026-02-28 00:00:00	\N	PAID	914.25	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:25:41.499	2026-02-28 18:41:46.721	914.25	0.00	cmm6nj47n00en1klqmo0p4dwi	2026-02-28 18:41:46.72	cmm6nbyic00e81klqvju1ivxv
\.


--
-- TOC entry 5933 (class 0 OID 221812)
-- Dependencies: 280
-- Data for Name: business_bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.business_bank_accounts (id, "bankName", "accountName", "accountNumber", "accountHolder", "branchCode", currency, "ledgerAccountCode", "isActive", "ownerCompanyName", "createdByUserId", "createdAt", "updatedAt", "openingBalance") FROM stdin;
cmm6owzex0001wlelvj9uxzh0	First National Bank	BRETUNE TECHNOLOGIES (PTY) LTD	63164874175	BRETUNE TECHNOLOGIES (PTY) LTD	250655	ZAR	1000	t	Bretune Technologies	cmm47pax500048s6ob25tkito	2026-02-28 19:04:28.169	2026-02-28 19:04:28.169	0.00
cmm6r6sr9003khg423c9qkayp	Standard Bank	FORTUNE MATENDA	1016 918 218 3	FORTUNE MATENDA	5609	ZAR	1000	t	Bretune Technologies	cmm47pax500048s6ob25tkito	2026-02-28 20:08:05.396	2026-02-28 20:08:05.396	0.00
\.


--
-- TOC entry 5940 (class 0 OID 276539)
-- Dependencies: 287
-- Data for Name: client_network_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_network_links (id, "clientId", "deviceId", "servicePlanId", "serviceStatus", "ipAddress", "macAddress", "pppoeUsername", "installationDate", "suspendedAt", "suspendReason", "terminatedAt", "billingDay", "autoBilling", "lastBilledAt", "nextBillDate", notes, "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5916 (class 0 OID 204645)
-- Dependencies: 263
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, "trialEndsAt", "subscriptionStatus", "createdAt", "updatedAt", "baseCurrencyCode", "stripeCustomerId") FROM stdin;
cmm4zhe3b01361vs3dxk98b9o	Dziva T	\N	ACTIVE	2026-02-27 14:24:44.182	2026-02-27 19:26:20.12	ZAR	\N
cmmael1we0001kgp4revaocoi	Bluedog Technologies	\N	ACTIVE	2026-03-03 09:26:20.127	2026-03-03 09:32:40.217	ZAR	\N
cmm47pawm00008s6o8eq8i8y7	Bretune Technologies	\N	ACTIVE	2026-02-27 01:27:04.054	2026-03-19 11:52:49.253	ZAR	cus_U7RhGVw2L0WOzA
\.


--
-- TOC entry 5890 (class 0 OID 204045)
-- Dependencies: 237
-- Data for Name: company_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_settings (id, "businessEmail", "businessPhone", "addressLine", city, country, "bankName", "accountName", "accountNumber", "branchCode", "createdAt", "updatedAt", "accountType", "displayCurrencyCode", tagline) FROM stdin;
default	fortunematenda@gmail.com	+27612685933	134 kommitjie road Fishhoek	Fish Hoek Capetown	South Africa	First National Bank	Bretune Technologies (pty) Ltd	63164874175	250655	2026-02-27 01:35:00.863	2026-02-28 14:25:35.943	Cheque	\N	\N
\.


--
-- TOC entry 5918 (class 0 OID 204664)
-- Dependencies: 265
-- Data for Name: company_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_subscriptions (id, "companyId", "planId", status, "trialEndsAt", "subscriptionEndsAt", "createdAt", "updatedAt") FROM stdin;
cmm4zhe4l01381vs35dhr3f04	cmm4zhe3b01361vs3dxk98b9o	cmm47ndah001jfkjog4mkq1cp	ACTIVE	\N	2026-03-27 19:26:20.073	2026-02-27 14:24:44.212	2026-02-27 19:26:20.12
cmmael1wy0003kgp4ysbh1g0w	cmmael1we0001kgp4revaocoi	cmm47ndah001jfkjog4mkq1cp	ACTIVE	\N	2026-04-03 09:32:40.213	2026-03-03 09:26:20.145	2026-03-03 09:32:40.217
cmm47paww00028s6ouqlfmn6k	cmm47pawm00008s6o8eq8i8y7	cmm47ndah001jfkjog4mkq1cp	ACTIVE	\N	2026-04-19 11:52:49.171	2026-02-27 01:27:04.063	2026-03-19 11:52:49.253
\.


--
-- TOC entry 5925 (class 0 OID 204832)
-- Dependencies: 272
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (code, name, symbol, decimals, "isActive", "createdAt", "updatedAt") FROM stdin;
AUD	Australian Dollar	A$	2	t	2026-02-27 01:25:33.662	2026-02-27 01:25:33.662
BRL	Brazilian Real	R$	2	t	2026-02-27 01:25:33.667	2026-02-27 01:25:33.667
CAD	Canadian Dollar	C$	2	t	2026-02-27 01:25:33.669	2026-02-27 01:25:33.669
CHF	Swiss Franc	CHF	2	t	2026-02-27 01:25:33.67	2026-02-27 01:25:33.67
CNY	Chinese Renminbi Yuan	¥	2	t	2026-02-27 01:25:33.671	2026-02-27 01:25:33.671
CZK	Czech Koruna	Kč	2	t	2026-02-27 01:25:33.674	2026-02-27 01:25:33.674
DKK	Danish Krone	kr	2	t	2026-02-27 01:25:33.676	2026-02-27 01:25:33.676
EUR	Euro	€	2	t	2026-02-27 03:25:30.119	2026-02-27 01:25:33.677
GBP	British Pound	£	2	t	2026-02-27 03:25:30.119	2026-02-27 01:25:33.679
HKD	Hong Kong Dollar	HK$	2	t	2026-02-27 01:25:33.681	2026-02-27 01:25:33.681
HUF	Hungarian Forint	Ft	2	t	2026-02-27 01:25:33.682	2026-02-27 01:25:33.682
IDR	Indonesian Rupiah	Rp	2	t	2026-02-27 01:25:33.684	2026-02-27 01:25:33.684
ILS	Israeli New Shekel	₪	2	t	2026-02-27 01:25:33.685	2026-02-27 01:25:33.685
INR	Indian Rupee	₹	2	t	2026-02-27 01:25:33.686	2026-02-27 01:25:33.686
ISK	Icelandic Króna	kr	2	t	2026-02-27 01:25:33.688	2026-02-27 01:25:33.688
JPY	Japanese Yen	¥	0	t	2026-02-27 01:25:33.689	2026-02-27 01:25:33.689
KRW	South Korean Won	₩	0	t	2026-02-27 01:25:33.691	2026-02-27 01:25:33.691
MXN	Mexican Peso	MX$	2	t	2026-02-27 01:25:33.693	2026-02-27 01:25:33.693
MYR	Malaysian Ringgit	RM	2	t	2026-02-27 01:25:33.694	2026-02-27 01:25:33.694
NOK	Norwegian Krone	kr	2	t	2026-02-27 01:25:33.695	2026-02-27 01:25:33.695
NZD	New Zealand Dollar	NZ$	2	t	2026-02-27 01:25:33.697	2026-02-27 01:25:33.697
PHP	Philippine Peso	₱	2	t	2026-02-27 01:25:33.698	2026-02-27 01:25:33.698
PLN	Polish Złoty	zł	2	t	2026-02-27 01:25:33.699	2026-02-27 01:25:33.699
RON	Romanian Leu	lei	2	t	2026-02-27 01:25:33.701	2026-02-27 01:25:33.701
SEK	Swedish Krona	kr	2	t	2026-02-27 01:25:33.702	2026-02-27 01:25:33.702
SGD	Singapore Dollar	S$	2	t	2026-02-27 01:25:33.703	2026-02-27 01:25:33.703
THB	Thai Baht	฿	2	t	2026-02-27 01:25:33.704	2026-02-27 01:25:33.704
TRY	Turkish Lira	₺	2	t	2026-02-27 01:25:33.706	2026-02-27 01:25:33.706
USD	US Dollar	$	2	t	2026-02-27 03:25:30.119	2026-02-27 01:25:33.708
ZAR	South African Rand	R	2	t	2026-02-27 03:25:30.119	2026-02-27 01:25:33.71
\.


--
-- TOC entry 5935 (class 0 OID 240478)
-- Dependencies: 282
-- Data for Name: customer_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_documents (id, "clientId", "originalName", "mimeType", size, "storageKey", "uploadedByUserId", "createdAt", "updatedAt", description) FROM stdin;
cmmj26khv0002cliy46fi6nhf	cmm551ver006ls8x65km4hqtw	bretune-accounting-invoice-INV-045.pdf	application/pdf	34596	cmm551ver006ls8x65km4hqtw/3bfacea1-f0b9-4d2b-9545-88a266e978f4.pdf	cmm47pax500048s6ob25tkito	2026-03-09 12:49:04.549	2026-03-09 12:49:04.549	\N
cmmj2mya30001wj7gkaopoi9i	cmm551ver006ls8x65km4hqtw	bretune-accounting-quote-Q-001.pdf	application/pdf	34683	cmm551ver006ls8x65km4hqtw/bacbe7e2-1fca-4b23-a2e3-b7a5c58a85a3.pdf	cmm47pax500048s6ob25tkito	2026-03-09 13:01:48.939	2026-03-09 13:01:48.939	Bank statement
cmmj2nbnp0003wj7gdqfbbs9s	cmm551ver006ls8x65km4hqtw	bretune-accounting-invoice-INV-045.pdf	application/pdf	34596	cmm551ver006ls8x65km4hqtw/4447684a-61b0-483f-9f53-fd73700cc250.pdf	cmm47pax500048s6ob25tkito	2026-03-09 13:02:06.277	2026-03-09 13:02:06.277	\N
cmmj2o8gn0005wj7g23kmjnvg	cmm551ver006ls8x65km4hqtw	632864681_25982782708079147_976482211840312184_n.jpg	image/jpeg	779147	cmm551ver006ls8x65km4hqtw/82fddccc-8e68-493c-b474-8a74541663f7.jpg	cmm47pax500048s6ob25tkito	2026-03-09 13:02:48.792	2026-03-09 13:02:48.792	\N
\.


--
-- TOC entry 5872 (class 0 OID 203685)
-- Dependencies: 219
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, type, "companyName", "contactName", email, phone, address, city, state, country, "postalCode", status, "paymentTermsDays", notes, "createdAt", "updatedAt", "openingBalance", balance, "creditLimit", "totalInvoiced", "totalPaid", "creditBalance", "taxNumber", "taxType", "clientSeq", "ownerCompanyName") FROM stdin;
cmm4zirod013c1vs3xdf1z699	INDIVIDUAL	Bretune Technologies	Somuzi	fortunematenda@gmail.com	0612685931	134 kommitjie road Fishhoek	Fish Hoek Capetown	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 14:25:48.444	2026-02-27 14:25:48.444	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	2	Dziva T
cmm55wz4x00bos8x6nnrkl8re	INDIVIDUAL	\N	Margaret Zingwe	\N	+27 74 488 2300	150 Ntantala Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:24:48.993	2026-03-18 21:11:32.947	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	17	Bretune Technologies
cmm540m4p001os8x6km8cvelc	INDIVIDUAL	\N	Florence Saidi	florecesaidi12@gmail.com	+27 73 942 4347	Flat H24 Makhayangokhu flats Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 16:31:39.529	2026-04-02 18:20:07.366	0.00	0.00	0.00	0.00	540.00	0.00		NONE	3	Bretune Technologies
cmm54kjqp003ds8x67pxwkczp	INDIVIDUAL	\N	Blessing Kaitano	\N	+27 68 270 4763	5578 Vanya Street, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 16:47:09.553	2026-03-18 21:11:48.056	0.00	0.00	0.00	0.00	300.00	0.00	\N	NONE	5	Bretune Technologies
cmm6m2n1z00721klq0sctxew0	INDIVIDUAL	\N	Elikanos Matenda	\N	+27 74 437 0740	83 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:44:53.304	2026-03-18 21:12:47.277	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	30	Bretune Technologies
cmm55nh8g00a2s8x6rvry714w	COMPANY	Tshisa Nyama	Mighty Mwatsika	\N	+27 84 410 4690	51 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:17:25.888	2026-02-27 17:19:21.946	0.00	0.00	0.00	0.00	0.00	0.00		NONE	14	Bretune Technologies
cmm55f2iq008ws8x6c9k8kvpl	COMPANY	Sinovuyo Spaza	Abdi Kadere	\N	+27 64 138 7159	64 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:10:53.57	2026-04-02 18:21:46.59	0.00	0.00	0.00	0.00	665.00	0.00	\N	NONE	12	Bretune Technologies
cmm6lo0qh00491klq27bc8r58	INDIVIDUAL	\N	Nolulamo Njoli	\N	+27 69 331 0388	126 Ntantala Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:33:31.194	2026-02-28 17:33:31.194	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	24	Bretune Technologies
cmm6lqnd2004b1klqtzti29rl	INDIVIDUAL	\N	Aaron Mauwo	\N	+27 67 719 7340	3 Sisulu Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:35:33.83	2026-02-28 17:35:33.83	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	25	Bretune Technologies
cmm554muh0074s8x6hn9a7048	COMPANY	Happy Place	Andrew Manuel	\N	+27 81 303 6400	161 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:02:46.697	2026-04-02 18:20:37.031	0.00	0.00	0.00	0.00	1200.00	0.00	\N	NONE	8	Bretune Technologies
cmm55a6s8008bs8x6h6fnp5yd	INDIVIDUAL	\N	Nangamaso Beza	\N	+27 73 402 9058	37 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:07:05.816	2026-04-02 18:20:56.253	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	10	Bretune Technologies
cmm557419007os8x6nailjge0	INDIVIDUAL	\N	Andisiwe Mvubu	\N	+27 79 021 6003	9 Masakane Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:04:42.285	2026-03-06 21:18:26.141	0.00	0.00	0.00	0.00	350.00	0.00		NONE	9	Bretune Technologies
cmm54ohzw003xs8x6p4nhgv8l	INDIVIDUAL	\N	Masibulele Msweli	\N	+27 84 055 6286	5618 Vanya Street, Masiphumelele	Capetown	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 16:50:13.917	2026-03-09 20:24:24.7	0.00	0.00	0.00	0.00	460.00	0.00	\N	NONE	6	Bretune Technologies
cmm55r8pq00ams8x6i0lchg3w	COMPANY	\N	Phillip Manunure	\N	+27 74 266 8491	51 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:20:21.47	2026-03-06 21:19:37.097	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	15	Bretune Technologies
cmm6llpqi003q1klqf1ejb34c	INDIVIDUAL	\N	Sethu Williams	\N	+27 68 178 9932	6555 Binga St, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:31:43.626	2026-04-02 18:54:11.562	0.00	365.00	0.00	0.00	365.00	0.00	\N	NONE	23	Bretune Technologies
cmm6fuy5g000q1klqcvvtfvcr	INDIVIDUAL	\N	Juliet Dzumbira	\N	+27 84 826 2329	55 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 14:50:56.74	2026-03-06 21:20:16.96	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	19	Bretune Technologies
cmm6ly0d0005x1klqmrye4jav	INDIVIDUAL	\N	Previous Ndlovu	\N	+27 65 246 7731	56 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:41:17.269	2026-04-02 18:22:43.301	0.00	0.00	0.00	0.00	700.00	0.00	\N	NONE	28	Bretune Technologies
cmm6lvyqs005d1klqltorxkd7	INDIVIDUAL	\N	Grace Laisi	\N	+27 78 787 4042	78 Pokela Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:39:41.86	2026-03-06 21:21:43.403	0.00	0.00	0.00	0.00	465.00	0.00	\N	NONE	27	Bretune Technologies
cmmxgm46l01k5ccostk54flk0	COMPANY	The Schuyler Group (Pty) Ltd	Faith	\N	+27683223802	2 Main Rd,Kalk Bay	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-03-19 12:41:51.017	2026-04-02 18:34:22.117	0.00	0.00	0.00	0.00	3150.00	0.00	\N	NONE	49	Bretune Technologies
cmm6lzufz006g1klqacvd1c71	INDIVIDUAL	\N	Adrian Samuel Kamenya	\N	+27 62 864 8270	73 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:42:42.911	2026-03-09 07:34:40.946	0.00	0.00	0.00	0.00	550.00	0.00	\N	NONE	29	Bretune Technologies
cmm551ver006ls8x65km4hqtw	INDIVIDUAL	\N	Auxilia Ndaradzi	\N	+27 61 645 7610	56 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:00:37.827	2026-04-02 18:20:21.913	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	7	Bretune Technologies
cmm54h217002ts8x6qs5irdmh	INDIVIDUAL	Shela	Shella Ndhlovu	\N	+27 74 053 4348	67 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 16:44:26.635	2026-04-02 18:19:40.959	0.00	-5.00	0.00	0.00	735.00	5.00	\N	NONE	4	Bretune Technologies
cmm6ljd7h00361klqff2544qa	INDIVIDUAL	\N	Mike Mwiwa	\N	+27 67 726 7410	97 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:29:54.077	2026-04-02 18:22:16.421	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	22	Bretune Technologies
cmm6ltyls004u1klq3s6arqce	INDIVIDUAL	\N	Maikolo Jera	\N	+27 69 484 5973	110 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:38:08.368	2026-04-02 18:22:30.951	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	26	Bretune Technologies
cmm6lh7k3002n1klq8jh12onn	INDIVIDUAL	\N	Winnet Gwese	\N	+27 61 200 5396	30 Masebulele Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:28:13.443	2026-04-02 18:16:53.035	0.00	365.00	0.00	0.00	365.00	0.00	\N	NONE	21	Bretune Technologies
cmm55cbe3008us8x6p33kz5mb	INDIVIDUAL	\N	Scolastic Zingwe	\N	+27 62 154 4046	27 Luntu Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:08:45.099	2026-04-02 18:18:12.686	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	11	Bretune Technologies
cmm47x6lz0039pdmhlznggcdn	COMPANY	Bluedog Technology	Chris Hendricks	cbhendrikz@gmail.com	+27 21 300 3408	Unit 102, Solaris Business Park, 2 Lekkerwater Rd, Sunnydale	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 01:33:11.736	2026-04-02 18:19:00.074	0.00	0.00	0.00	0.00	7145.57	0.00	\N	NONE	1	Bretune Technologies
cmnhthwx70127il5gouii1ay9	COMPANY	Scarborough Nature Lodge	Janis Corr	janiscorr@gmail.com	+27 71 828 2704	80 Mountain Rise, Scarborough	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-04-02 18:37:53.516	2026-04-02 18:37:53.516	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	50	Bretune Technologies
cmm55j1sz009fs8x62nkk3wym	INDIVIDUAL	\N	Elikanos Matenda	\N	+27 74 437 0740	2987 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:13:59.267	2026-04-02 18:55:15.413	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	13	Bretune Technologies
cmm6mrbxw00bx1klq6snmtbyb	INDIVIDUAL	\N	Stuart Urayai	\N	+27 61 672 6611	4 Mbekweni Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:04:05.3	2026-03-09 07:37:24.292	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	39	Bretune Technologies
cmm6f2oi90000zvp15rcvh9dq	INDIVIDUAL	\N	Wesley Gwamuri	Wesleygwamuri1@gmail.com	+27 67 636 2683	22 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 14:28:57.874	2026-02-28 17:56:51.264	0.00	0.00	0.00	0.00	350.00	0.00		NONE	18	Bretune Technologies
cmm6mxq5300dj1klqc9puunxp	INDIVIDUAL	\N	Stella Makarutse	\N	+27 62 156 0083	G19 Makhayangoku Flats,79 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:09:03.639	2026-02-28 18:09:03.639	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	42	Bretune Technologies
cmm6mzr7n00dl1klq82kb03x5	INDIVIDUAL	\N	Tamsanqa Jebetwane	\N	+27 69 871 5121	73 Myeza Rd Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:10:38.339	2026-02-28 18:10:38.339	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	43	Bretune Technologies
cmm6n19ne00dm1klqau4zc8bp	INDIVIDUAL	\N	Patience Zulu	\N	+27 73 154 5344	60 Ntantala Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:11:48.891	2026-02-28 18:11:48.891	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	44	Bretune Technologies
cmmaen5i90006kgp431o5gmfv	INDIVIDUAL	\N	Fortune Matenda	fortunematenda@gmail.com	0612685933	134 kommitjie road Fishhoek	Fish Hoek Capetown	Western Cape	South Africa	7975	ACTIVE	30		2026-03-03 09:27:58.114	2026-03-03 09:27:58.114	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	45	Bluedog Technologies
cmm6mvjxx00d01klqrij7sk43	INDIVIDUAL	\N	Sam Nzvimbo	\N	+27 61 258 8319	F26 Makhayangoku Flats,79 Myeza Rd, Masiphumelele, Cape Town, 7975	Fish Hoek Capetown	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:07:22.294	2026-04-02 18:25:47.959	0.00	0.00	0.00	0.00	730.00	0.00	\N	NONE	41	Bretune Technologies
cmmfdly1z00shhwgvwpnfvclv	COMPANY	Makapa Lodge	Anna	\N	+27828208735	18 Java Close, Capri	Cape Town	\N	South Africa	7975	ACTIVE	30		2026-03-06 20:57:53.063	2026-04-02 18:33:52.96	0.00	0.00	0.00	0.00	2500.00	0.00	\N	NONE	46	Bretune Technologies
cmm6me5qh009r1klq9lfn2jhx	INDIVIDUAL	\N	Philip Manunure	\N	+27 74 266 8491	51 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:53:50.729	2026-03-09 07:35:39.888	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	35	Bretune Technologies
cmmfdvvyl00uphwgvtz36zuym	COMPANY	Murdock Valley NHW	Peter Turvey	peter.turvey@gmail.com	+27825515600	Murdock Valley	Cape Town	\N	South Africa	7975	ACTIVE	30		2026-03-06 21:05:36.909	2026-04-02 18:34:38.07	0.00	0.00	0.00	0.00	1000.00	0.00	\N	NONE	47	Bretune Technologies
cmm6mjll100au1klqlwbnnjp9	INDIVIDUAL	\N	David Naki	\N	+27 71 000 8874	21 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:58:04.549	2026-03-09 07:36:32.291	0.00	0.00	0.00	0.00	230.00	0.00	\N	NONE	37	Bretune Technologies
cmm55uhcv00b5s8x6xh6qqij3	INDIVIDUAL	\N	Sebele Tsoloane	\N	+27 72 885 9697	5534 Vanya Street Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-27 17:22:52.639	2026-04-02 18:53:06.805	0.00	465.00	0.00	0.00	465.00	0.00	\N	NONE	16	Bretune Technologies
cmmj6vu5s001nk0xm42z0d6r8	COMPANY	\N	Tenda Fuma	\N	+27742754404	\N	\N	\N	\N	\N	ACTIVE	30	\N	2026-03-09 13:00:41.968	2026-03-09 13:00:41.968	0.00	0.00	0.00	0.00	0.00	0.00	\N	NONE	48	Bretune Technologies
cmm6mtbuc00ch1klq0odakxsn	INDIVIDUAL	\N	Menias Masike	\N	+27 67 585 2595	96 Ntantala Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 18:05:38.484	2026-03-18 21:12:20.952	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	40	Bretune Technologies
cmm6mcin600981klqhytyq4gf	INDIVIDUAL	\N	Mighty Mwatsika	\N	+27 84 410 4690	68 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:52:34.146	2026-03-19 12:45:32.509	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	34	Bretune Technologies
cmm6m7zmc00851klqhgp4clh1	INDIVIDUAL	\N	Brendon Mafukidze	\N	+27 84 615 5236	5600 Vanya Street, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:49:02.869	2026-04-02 18:16:33.905	0.00	365.00	0.00	0.00	365.00	0.00	\N	NONE	32	Bretune Technologies
cmm6fwzea00191klqx8mfarvz	INDIVIDUAL	\N	Isaac Mugwagwa	\N	+27 74 051 7349	24 Masonwabe Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 14:52:31.666	2026-04-02 18:22:03.988	0.00	-5.00	0.00	0.00	735.00	5.00	\N	NONE	20	Bretune Technologies
cmm6m4kb2007m1klquhr4s41u	INDIVIDUAL	\N	Ziviso Mapfumo	\N	+27 68 052 6966	31 Nonkqubela Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:46:23.055	2026-04-02 18:22:56.963	0.00	30.00	0.00	0.00	430.00	0.00	\N	NONE	31	Bretune Technologies
cmm6maqjf008p1klq0iyvmq8j	COMPANY	New York Spaza	Ousmane Baharu	fortunematenda@gmail.com	+27 67 647 7020	152 Ntantala Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:51:11.067	2026-04-02 18:23:13.695	0.00	0.00	0.00	0.00	730.00	0.00		NONE	33	Bretune Technologies
cmm6mglj9009t1klqm9q1uznw	INDIVIDUAL	\N	Auxilia Ndaradza	\N	+27 61 645 7610	56 Myeza Rd, Masiphumelele	Cape Town	Western Cape	South Africa	7975	ACTIVE	30		2026-02-28 17:55:44.517	2026-04-02 18:25:20.195	0.00	0.00	0.00	0.00	365.00	0.00	\N	NONE	36	Bretune Technologies
cmm6movbm00be1klqnc8pn4f6	INDIVIDUAL	\N	Patricia Kumpemba	\N	+27 61 382 9352	61 Ntantala Rd, Masiphumelele	Cape Town	\N	\N	\N	ACTIVE	30		2026-02-28 18:02:10.45	2026-04-02 18:25:33.842	0.00	0.00	0.00	0.00	600.00	0.00	\N	NONE	38	Bretune Technologies
\.


--
-- TOC entry 5930 (class 0 OID 204925)
-- Dependencies: 277
-- Data for Name: depreciation_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.depreciation_runs (id, "assetId", "runDate", amount, "journalEntryId", "createdAt") FROM stdin;
\.


--
-- TOC entry 5884 (class 0 OID 203970)
-- Dependencies: 231
-- Data for Name: document_counters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_counters (key, value, "updatedAt") FROM stdin;
invoice	90	2026-04-02 18:41:15.822
payment	58	2026-04-02 18:54:11.486
creditNote	5	2026-04-02 18:55:15.362
journal_entry	155	2026-04-02 18:56:28.655
supplier_payment	1	2026-02-28 18:41:46.642
quote	1	2026-03-03 09:28:42.395
\.


--
-- TOC entry 5882 (class 0 OID 203912)
-- Dependencies: 229
-- Data for Name: email_outbox; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_outbox (id, "invoiceId", "to", subject, body, status, attempts, "lastError", "nextAttemptAt", "sentAt", "createdAt", "updatedAt", "clientId", "documentType", "statementFrom", "statementTo") FROM stdin;
cmnhq019w000kil5gutqlrqj2	cmnhq019c000eil5gfozc4a8r	cbhendrikz@gmail.com	Invoice INV-052 from Bretune Accounting	<p>Hello Chris Hendricks,</p><p>Your invoice <strong>INV-052</strong> has been generated.</p><p>Total: 450</p><p>Thank you,<br/>Bretune Accounting</p>	FAILED	3	getClientAccountCode is not defined	2026-04-02 19:38:00.046	\N	2026-04-02 17:00:00.5	2026-04-02 17:38:00.059	cmm47x6lz0039pdmhlznggcdn	INVOICE	\N	\N
cmnhq01b4000yil5gv34f383a	cmnhq01at000sil5g0n21nkd2	florecesaidi12@gmail.com	Invoice INV-054 from Bretune Accounting	<p>Hello Florence Saidi,</p><p>Your invoice <strong>INV-054</strong> has been generated.</p><p>Total: 270</p><p>Thank you,<br/>Bretune Accounting</p>	FAILED	3	getClientAccountCode is not defined	2026-04-02 19:38:00.061	\N	2026-04-02 17:00:00.544	2026-04-02 17:38:00.074	cmm540m4p001os8x6km8cvelc	INVOICE	\N	\N
cmnhq01hq0037il5gn22ox9r1	cmnhq01hl0031il5gggsgcp9n	Wesleygwamuri1@gmail.com	Invoice INV-067 from Bretune Accounting	<p>Hello Wesley Gwamuri,</p><p>Your invoice <strong>INV-067</strong> has been generated.</p><p>Total: 350</p><p>Thank you,<br/>Bretune Accounting</p>	FAILED	3	getClientAccountCode is not defined	2026-04-02 19:38:00.075	\N	2026-04-02 17:00:00.782	2026-04-02 17:38:00.088	cmm6f2oi90000zvp15rcvh9dq	INVOICE	\N	\N
cmnhq01p4005til5gahjl51fr	cmnhq01nm005jil5gshu2o4rf	fortunematenda@gmail.com	Invoice INV-081 from Bretune Accounting	<p>Hello Ousmane Baharu,</p><p>Your invoice <strong>INV-081</strong> has been generated.</p><p>Total: 365</p><p>Thank you,<br/>Bretune Accounting</p>	FAILED	3	getClientAccountCode is not defined	2026-04-02 19:38:00.095	\N	2026-04-02 17:00:01.048	2026-04-02 17:38:00.108	cmm6maqjf008p1klq0iyvmq8j	INVOICE	\N	\N
\.


--
-- TOC entry 5893 (class 0 OID 204162)
-- Dependencies: 240
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, "employeeNumber", email, "firstName", "lastName", phone, title, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5926 (class 0 OID 204843)
-- Dependencies: 273
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (id, "fromCurrencyCode", "toCurrencyCode", rate, "asOfDate", source, "createdAt") FROM stdin;
cmm47rs7e001fpdmhj4xh7fvk	ZAR	SGD	0.07956000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.787
cmm47rs7g001hpdmhtap5hzik	ZAR	THB	1.95640000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.789
cmm47rs7j001jpdmhj7eklxxn	ZAR	TRY	2.76400000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.791
cmm47rs7k001lpdmhf2lor70o	ZAR	USD	0.06299000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.793
cmmaeps3b000vkgp4lot4e7wb	ZAR	HKD	0.48403000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.696
cmmaeps3e000xkgp4tb96klxu	ZAR	HUF	20.19000000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.698
cmmaeps3g000zkgp48tda8s8l	ZAR	IDR	1044.25000000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.701
cmmaeps3j0011kgp4j25wzt3y	ZAR	ILS	0.19077000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.703
cmm47rs490001pdmhhui2z7om	ZAR	AUD	0.08846000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.673
cmm47rs5m0003pdmhk58ceanm	ZAR	BRL	0.32286000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.722
cmm47rs5o0005pdmhh2m6x2yp	ZAR	CAD	0.08613000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.725
cmm47rs5r0007pdmhnh8qiaz4	ZAR	CHF	0.04873000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.728
cmm47rs5v0009pdmh1snel4h4	ZAR	CNY	0.43091000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.731
cmm47rs5z000bpdmh757o6dv0	ZAR	CZK	1.29270000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.735
cmm47rs62000dpdmh3kumt3p7	ZAR	DKK	0.39837000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.738
cmm47rs64000fpdmhzxhvkzl0	ZAR	EUR	0.05332000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.74
cmm47rs66000hpdmhhwdcn9i0	ZAR	GBP	0.04649000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.742
cmm47rs6b000jpdmh56uoia44	ZAR	HKD	0.49273000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.747
cmm47rs6f000lpdmhpkgkif8h	ZAR	HUF	20.00400000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.751
cmm47rs6h000npdmhxdq8b0e7	ZAR	IDR	1056.13000000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.754
cmm47rs6j000ppdmhc7j4cutg	ZAR	ILS	0.19588000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.756
cmm47rs6m000rpdmh8or3d7rq	ZAR	INR	5.72710000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.758
cmm47rs6o000tpdmhdamc7fze	ZAR	ISK	7.64010000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.76
cmm47rs6r000vpdmh7obooe0f	ZAR	JPY	9.82980000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.764
cmm47rs6v000xpdmhi6cpd4gk	ZAR	KRW	89.80000000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.767
cmm47rs6x000zpdmhwaqomaql	ZAR	MXN	1.08190000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.769
cmm47rs6y0011pdmhj1fwz4xt	ZAR	MYR	0.24477000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.771
cmm47rs700013pdmh51060eml	ZAR	NOK	0.60209000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.773
cmm47rs720015pdmh5irji67b	ZAR	NZD	0.10514000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.775
cmm47rs740017pdmh8gvg0jbe	ZAR	PHP	3.62930000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.777
cmm47rs780019pdmhcbwryp38	ZAR	PLN	0.22512000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.78
cmm47rs7b001bpdmhduga9jmv	ZAR	RON	0.27164000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.783
cmm47rs7d001dpdmhm8jpwffd	ZAR	SEK	0.56904000	2026-02-26 00:00:00	API	2026-02-27 01:28:59.785
cmm51tc7b018m1vs3pntwnofz	ZAR	PHP	3.61860000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.839
cmm51tc7e018o1vs3bmw69lxq	ZAR	PLN	0.22448000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.842
cmm51tc7g018q1vs3k0lh12pd	ZAR	RON	0.27079000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.845
cmm51tc7k018s1vs3bugxqlma	ZAR	SEK	0.56671000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.848
cmm51tc7m018u1vs3u5kis3kl	ZAR	SGD	0.07940000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.85
cmm51tc7n018w1vs32y012v1i	ZAR	THB	1.95010000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.852
cmm51tc7s018y1vs307bb6ox8	ZAR	TRY	2.75780000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.856
cmm51tc7u01901vs3vhg5j103	ZAR	USD	0.06273000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.859
cmmaeps0a000dkgp4wc3dvx7p	ZAR	AUD	0.08769000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.587
cmmaeps2q000fkgp4rjrdjl51	ZAR	BRL	0.32217000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.674
cmm51tc5c017g1vs323qwm5wn	ZAR	AUD	0.08828000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.768
cmm51tc5j017i1vs3uyxeo84e	ZAR	BRL	0.32343000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.775
cmm51tc5m017k1vs34qqiakne	ZAR	CAD	0.08576000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.778
cmm51tc5p017m1vs3my4zem26	ZAR	CHF	0.04838000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.782
cmm51tc5t017o1vs3v5kcsnps	ZAR	CNY	0.43024000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.786
cmm51tc5x017q1vs3j5ut27p3	ZAR	CZK	1.28840000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.789
cmm51tc63017u1vs39nfan1m4	ZAR	EUR	0.05314000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.795
cmm51tc65017w1vs3ygae31ce	ZAR	GBP	0.04657000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.798
cmm51tc6c017y1vs35lwfidjb	ZAR	HKD	0.49081000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.804
cmm51tc6e01801vs3i6ajlw8e	ZAR	HUF	20.01500000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.806
cmm51tc6l01821vs3371ykooi	ZAR	IDR	1054.00000000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.813
cmm51tc6o01841vs343xp7oxs	ZAR	ILS	0.19719000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.817
cmm51tc6r01861vs3h0xt9cvq	ZAR	INR	5.71370000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.819
cmm51tc6t01881vs3ovvm6dbj	ZAR	ISK	7.62580000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.821
cmm51tc6v018a1vs3eky9x5ns	ZAR	JPY	9.78490000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.824
cmm51tc6y018c1vs3s6118f84	ZAR	KRW	90.46000000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.826
cmm51tc71018e1vs32s399cn9	ZAR	MXN	1.07980000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.829
cmm51tc73018g1vs3rl0q2dv1	ZAR	MYR	0.24409000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.832
cmm51tc77018i1vs3lwjp8w4y	ZAR	NOK	0.59563000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.835
cmm51tc60017s1vs32uafxc6a	ZAR	DKK	0.39706000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.793
cmm51tc79018k1vs3qd5sf8pl	ZAR	NZD	0.10485000	2026-02-27 00:00:00	API	2026-02-27 15:30:00.837
cmmaeps2s000hkgp4d95zj6hn	ZAR	CAD	0.08458000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.677
cmmaeps2w000jkgp4hb9gmzeh	ZAR	CHF	0.04822000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.68
cmmaeps2z000lkgp4jo8a6ev6	ZAR	CNY	0.42587000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.683
cmmaeps31000nkgp4t9ijeu60	ZAR	CZK	1.28400000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.686
cmmaeps34000pkgp42riz97r6	ZAR	DKK	0.39519000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.688
cmmaeps37000rkgp4mahfhffb	ZAR	EUR	0.05289000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.691
cmmaeps39000tkgp4ej21wmq2	ZAR	GBP	0.04622000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.693
cmmc836cr02s1mbb8gkxubn74	ZAR	CZK	1.28140000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.747
cmmc836ct02s3mbb8f4jtx4t2	ZAR	DKK	0.39303000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.749
cmmc836cw02s5mbb8ub0y0eh1	ZAR	EUR	0.05260000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.752
cmmc836ce02rtmbb8736idece	ZAR	BRL	0.31986000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.735
cmmc836ch02rvmbb8m2vy620k	ZAR	CAD	0.08369000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.737
cmmc836cn02rzmbb89qxmbyu2	ZAR	CNY	0.42266000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.744
cmmaqi62y00bdmbb83gf0jzle	ZAR	HKD	0.47593000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.97
cmmaqi63000bfmbb8butb6o5c	ZAR	HUF	20.38700000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.972
cmmaqi63200bhmbb8z54il1wo	ZAR	IDR	1030.58000000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.974
cmmaqi63400bjmbb8se807g5t	ZAR	ILS	0.18892000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.976
cmmaqi63600blmbb83j38pton	ZAR	INR	5.62120000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.978
cmmaqi63800bnmbb8nmrrw0b9	ZAR	ISK	7.57380000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.981
cmmaqi63a00bpmbb8kovn2a17	ZAR	JPY	9.61730000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.983
cmmaqi63d00brmbb8wcl04cng	ZAR	KRW	90.19000000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.986
cmmaqi63g00btmbb8drqzr7km	ZAR	MXN	1.06840000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.989
cmmaqi63i00bvmbb8yemevhif	ZAR	MYR	0.24070000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.99
cmmaqi63k00bxmbb8zxgexf1i	ZAR	NOK	0.59121000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.992
cmmaqi63l00bzmbb8ipv479qc	ZAR	NZD	0.10348000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.994
cmmc836dl02stmbb8wzbcg1q8	ZAR	NOK	0.59120000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.777
cmmc836dn02svmbb818k6acjh	ZAR	NZD	0.10349000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.779
cmmc836dp02sxmbb8f2ibg4yn	ZAR	PHP	3.58290000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.781
cmmc836dr02szmbb8al1b67r2	ZAR	PLN	0.22403000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.783
cmmc836dt02t1mbb8mek1v29h	ZAR	RON	0.26789000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.786
cmmc836dv02t3mbb87cbym74g	ZAR	SEK	0.56174000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.788
cmmc836dy02t5mbb84w9vec6a	ZAR	SGD	0.07809000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.79
cmmdmgg7s053fmbb81im3fc3q	ZAR	CAD	0.08255000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.857
cmmdmgg7w053jmbb8jtt3aru3	ZAR	CNY	0.41818000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.861
cmmdmgg84053rmbb8lw98427n	ZAR	GBP	0.04535000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.868
cmmc836cy02s7mbb87ywocif2	ZAR	GBP	0.04579000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.754
cmmc836cz02s9mbb808l479vb	ZAR	HKD	0.47904000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.756
cmmaeps3l0013kgp4pp6b8w2w	ZAR	INR	5.67670000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.706
cmmaeps3p0015kgp4h4cpyymp	ZAR	ISK	7.61150000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.709
cmmaeps3r0017kgp4wxf75wtk	ZAR	JPY	9.74270000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.712
cmmaeps3t0019kgp4lxj3efdy	ZAR	KRW	90.47000000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.713
cmmaeps3w001bkgp413eaxtac	ZAR	MXN	1.07350000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.716
cmmaeps3y001dkgp4416jsui8	ZAR	MYR	0.24299000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.719
cmmaeps41001fkgp4cx97rewm	ZAR	NOK	0.59194000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.721
cmmaeps44001hkgp4wa571q88	ZAR	NZD	0.10425000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.724
cmmaeps47001jkgp4hb0p7nim	ZAR	PHP	3.60400000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.727
cmmaeps49001lkgp4n7ma0h49	ZAR	PLN	0.22448000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.73
cmmaeps4d001nkgp4jpz0281l	ZAR	RON	0.26964000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.733
cmmaeps4h001pkgp47uyzdygd	ZAR	SEK	0.56640000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.737
cmmaeps4k001rkgp4vvy5eqro	ZAR	SGD	0.07881000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.74
cmmaeps4m001tkgp4jt2wylb8	ZAR	THB	1.94970000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.742
cmmaeps4p001vkgp4w2mqh81i	ZAR	TRY	2.72000000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.745
cmmaeps4t001xkgp45p670919	ZAR	USD	0.06188000	2026-03-02 00:00:00	API	2026-03-03 09:30:00.749
cmmaqi61w00avmbb8xv2zu5tu	ZAR	AUD	0.08690000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.932
cmmaqi62f00axmbb85ejv7a9o	ZAR	BRL	0.31985000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.952
cmmaqi62i00azmbb8qq7v41lo	ZAR	CAD	0.08348000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.954
cmmaqi62j00b1mbb8oj586obp	ZAR	CHF	0.04787000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.956
cmmaqi62l00b3mbb80lgs5sus	ZAR	CNY	0.42137000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.958
cmmaqi62n00b5mbb8epjdcqkb	ZAR	CZK	1.28130000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.96
cmmaqi62p00b7mbb8sb7l9xgo	ZAR	DKK	0.39264000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.961
cmmaqi62r00b9mbb8g3dvrrev	ZAR	EUR	0.05256000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.964
cmmaqi62u00bbmbb8mdydwwwc	ZAR	GBP	0.04582000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.966
cmmc836d102sbmbb8u0v1ogf1	ZAR	HUF	20.21700000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.758
cmmc836d402sdmbb8na4hwfr1	ZAR	IDR	1032.84000000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.76
cmmc836e002t7mbb893o691vd	ZAR	THB	1.92910000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.792
cmmc836e202t9mbb8xqfkz5bn	ZAR	TRY	2.69470000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.794
cmmc836e402tbmbb823imvrgc	ZAR	USD	0.06128000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.796
cmmdmgg75053bmbb88sjn3gyh	ZAR	AUD	0.08601000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.833
cmmdmgg7q053dmbb8l1bii3lp	ZAR	BRL	0.31803000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.855
cmmdmgg81053nmbb8r453h8f0	ZAR	DKK	0.38969000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.865
cmmdmgg7u053hmbb89lp4g383	ZAR	CHF	0.04727000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.859
cmmdmgg7y053lmbb8t1fryqns	ZAR	CZK	1.27240000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.863
cmmdmgg82053pmbb8tmqlzn70	ZAR	EUR	0.05216000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.867
cmmdmgg86053tmbb8cy1rdry8	ZAR	HKD	0.47391000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.87
cmmc836d702sfmbb89jrw37ur	ZAR	ILS	0.18852000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.763
cmmc836d802shmbb8dtv80a9q	ZAR	INR	5.64290000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.765
cmmc836db02sjmbb8y3yq9kps	ZAR	ISK	7.61190000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.767
cmmc836dd02slmbb884n3zios	ZAR	JPY	9.62770000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.769
cmmc836de02snmbb81ylr1jpo	ZAR	KRW	89.76000000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.771
cmmc836dg02spmbb8koz2puf1	ZAR	MXN	1.07530000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.772
cmmc836di02srmbb8n24p9y2i	ZAR	MYR	0.24153000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.775
cmmdmgg88053vmbb847zv7o4h	ZAR	HUF	20.21300000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.872
cmmf1wav7009fhwgvq5jd5d7y	ZAR	GBP	0.04485000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.835
cmmf1waut0095hwgvwstf7npf	ZAR	CHF	0.04680000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.822
cmmf1wav9009hhwgv87vycuyr	ZAR	HKD	0.46772000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.837
cmmf1wauy0099hwgvg2ec1op3	ZAR	CZK	1.26340000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.826
cmmf1wav0009bhwgvy4iy04qh	ZAR	DKK	0.38653000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.829
cmmxmmdd701vlccosrjzur60o	ZAR	CAD	0.08042000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.619
cmmxmmddd01vpccos6e4ot2fg	ZAR	CNY	0.40427000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.626
cmmjc7v5k001id8nt218f5yqv	ZAR	SGD	0.07676000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.208
cmmjc7v5m001kd8ntkm2z7ki3	ZAR	THB	1.92300000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.21
cmmf1wauo0091hwgvxcqx8b9s	ZAR	BRL	0.31562000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.816
cmmf1wauw0097hwgve2n0p09l	ZAR	CNY	0.41301000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.824
cmmf1wavb009jhwgvcukitz9e	ZAR	HUF	20.35400000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.839
cmmf1wavd009lhwgvjtuqa15s	ZAR	IDR	1015.28000000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.841
cmmf1wavh009nhwgv8fyd47iw	ZAR	ILS	0.18500000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.846
cmmf1wavk009phwgv82xjzsm8	ZAR	INR	5.49320000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.849
cmmf1wavo009rhwgvcb7tl990	ZAR	ISK	7.49700000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.852
cmmf1wavq009thwgvvjzqbrc4	ZAR	JPY	9.44600000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.854
cmmf1wavs009vhwgvxu385a3d	ZAR	KRW	88.84000000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.856
cmmjc7v5p001md8ntnp3v8g6m	ZAR	TRY	2.64340000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.213
cmmdmgg8a053xmbb8cgyjcpoc	ZAR	IDR	1024.62000000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.874
cmmdmgg8c053zmbb8ez6pzu82	ZAR	ILS	0.18624000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.876
cmmdmgg8e0541mbb8pag2n4is	ZAR	INR	5.55360000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.878
cmmdmgg8g0543mbb8ms4hbzs0	ZAR	ISK	7.54710000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.88
cmmdmgg8i0545mbb8ahq05wnz	ZAR	JPY	9.54620000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.882
cmmdmgg8j0547mbb8997jpobc	ZAR	KRW	89.43000000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.884
cmmdmgg8l0549mbb87jx9ofmv	ZAR	MXN	1.06850000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.886
cmmdmgg8n054bmbb82gib9gox	ZAR	MYR	0.23893000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.887
cmmdmgg8p054dmbb83qnadj51	ZAR	NOK	0.58488000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.889
cmmdmgg8r054fmbb8riq8c1rz	ZAR	NZD	0.10235000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.891
cmmdmgg8s054hmbb8ytvw72h7	ZAR	PHP	3.55240000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.893
cmmaqi63n00c1mbb8296z0s90	ZAR	PHP	3.56630000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.996
cmmaqi63q00c3mbb80q1ghubp	ZAR	PLN	0.22529000	2026-03-03 00:00:00	API	2026-03-03 15:00:00.999
cmmaqi63s00c5mbb8crswh11g	ZAR	RON	0.26795000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.001
cmmaqi63u00c7mbb8g8ha5ev6	ZAR	SEK	0.56378000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.003
cmmaqi63w00c9mbb8xtskiclr	ZAR	SGD	0.07796000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.004
cmmaqi63y00cbmbb84crg66di	ZAR	THB	1.93740000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.006
cmmaqi64000cdmbb81p183s9y	ZAR	TRY	2.68270000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.008
cmmaqi64100cfmbb84p51welu	ZAR	USD	0.06100000	2026-03-03 00:00:00	API	2026-03-03 15:00:01.01
cmmdmgg8u054jmbb8gfy6v6jg	ZAR	PLN	0.22284000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.894
cmmdmgg8w054lmbb8h23ogjux	ZAR	RON	0.26565000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.897
cmmf1wavu009xhwgvkqikgpzh	ZAR	MXN	1.06390000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.858
cmmjc7v5s001od8ntmxomkvje	ZAR	USD	0.05996000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.216
cmmw63xsy0004f6ufjw2kw1p8	ZAR	AUD	0.08448000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.6
cmmf1wavw009zhwgvpa3tfi01	ZAR	MYR	0.23603000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.86
cmmw63xv00006f6uftl6ci0ow	ZAR	BRL	0.31268000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.684
cmmw63xv20008f6ufoooouhp3	ZAR	CAD	0.08227000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.687
cmmw63xv5000af6ufzk7bjc6z	ZAR	CHF	0.04721000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.689
cmmf1wavy00a1hwgv4fkh0589	ZAR	NOK	0.57806000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.862
cmmw63xv7000cf6uf0x7ujvd7	ZAR	CNY	0.41341000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.692
cmmw63xv9000ef6ufatxs2cau	ZAR	CZK	1.27220000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.694
cmmw63xvc000gf6uf8hjvtkwr	ZAR	DKK	0.38897000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.696
cmmf1waw200a3hwgvjm7k8m4a	ZAR	NZD	0.10186000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.866
cmmc836c502rrmbb8fbj7e905	ZAR	AUD	0.08681000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.725
cmmc836cl02rxmbb8enlqz0fs	ZAR	CHF	0.04778000	2026-03-04 00:00:00	API	2026-03-04 16:00:00.742
cmmw63xve000if6ufyelghmaw	ZAR	EUR	0.05206000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.698
cmmf1waw500a5hwgv4qq73ab2	ZAR	PHP	3.54540000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.869
cmmf1waw600a7hwgv96ivtvj2	ZAR	PLN	0.22183000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.871
cmmf1waw800a9hwgvaft34qhl	ZAR	RON	0.26362000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.873
cmmf1wawa00abhwgvf431d8xw	ZAR	SEK	0.55325000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.875
cmmf1wawc00adhwgv9noin3um	ZAR	SGD	0.07663000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.877
cmmw63xvg000kf6ufz4uzik1y	ZAR	GBP	0.04499000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.7
cmmf1wawe00afhwgv9ikjuxtu	ZAR	THB	1.91260000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.879
cmmf1wawh00ahhwgv4zd285an	ZAR	TRY	2.63630000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.881
cmmf1wawl00ajhwgvudonuaag	ZAR	USD	0.05982000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.885
cmmw63xvi000mf6ufsprddq3v	ZAR	HKD	0.47037000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.702
cmmw63xvk000of6ufjj3ek8rk	ZAR	HUF	20.21600000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.704
cmmw63xvn000qf6uf8e42n35a	ZAR	IDR	1017.95000000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.707
cmmw63xvp000sf6uff8chq8oa	ZAR	ILS	0.18602000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.709
cmmw63xvq000uf6ufsseq5fd3	ZAR	INR	5.54470000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.711
cmmw63xvt000wf6ufo2ek4wah	ZAR	ISK	7.47560000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.713
cmmw63xvv000yf6uf6rm50c1l	ZAR	JPY	9.54180000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.715
cmmw63xvx0010f6ufojiz7pu5	ZAR	KRW	89.27000000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.717
cmmw63xvz0012f6ufa3nddnen	ZAR	MXN	1.06020000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.719
cmmw63xw10014f6uf79zipww6	ZAR	MYR	0.23519000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.721
cmmjc7v5h001gd8nth8dgub77	ZAR	SEK	0.55498000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.205
cmmw63xw30016f6ufsi1k0ryr	ZAR	NOK	0.57644000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.724
cmmw63xw50018f6uf5pmiob1s	ZAR	NZD	0.10252000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.726
cmmw63xw7001af6uffa5w5t5e	ZAR	PHP	3.57520000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.727
cmmw63xw9001cf6ufyqhuyi42	ZAR	PLN	0.22173000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.73
cmmw63xwb001ef6ufn4lzd83b	ZAR	RON	0.26506000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.731
cmmw63xwd001gf6ufx851tyog	ZAR	SEK	0.55731000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.733
cmmw63xwe001if6ufhnn6hed1	ZAR	SGD	0.07665000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.735
cmmxmmddi01vtccosymqwal8x	ZAR	DKK	0.38100000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.63
cmmxmmddn01vxccosbs78r1re	ZAR	GBP	0.04405000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.636
cmmxmmddr01vzccossmoh1ook	ZAR	HKD	0.45876000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.639
cmmjc7v5e001ed8ntz7ppbqxe	ZAR	RON	0.26455000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.202
cmmdmgg8y054nmbb8sfrnu8ns	ZAR	SEK	0.55748000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.898
cmmdmgg90054pmbb8hi258o5b	ZAR	SGD	0.07740000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.9
cmmdmgg92054rmbb80s3tj5uu	ZAR	THB	1.91870000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.902
cmmdmgg93054tmbb8oejj0bbh	ZAR	TRY	2.66580000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.904
cmmdmgg95054vmbb84gxddosx	ZAR	USD	0.06060000	2026-03-05 00:00:00	API	2026-03-05 15:30:00.906
cmmxmmde601wbccoszdcwua2d	ZAR	JPY	9.30420000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.655
cmnhq01np005nil5g07in9p27	ZAR	CAD	0.08176000	2026-04-02 00:00:00	API	2026-04-02 17:00:00.997
cmmxmmde801wdccosgiwmk5mj	ZAR	KRW	87.97000000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.657
cmnhq01pl005xil5gq622wa8i	ZAR	CZK	1.25170000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.065
cmnhq01pv0065il5gdjy5qlzk	ZAR	DKK	0.38112000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.076
cmnhq01pz0067il5gvsrjwxvi	ZAR	EUR	0.05100000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.079
cmnhq01q3006dil5g6w6n8u5i	ZAR	GBP	0.04450000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.084
cmnhq01qa006hil5go7i61c9t	ZAR	HKD	0.46070000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.09
cmnhq01qd006jil5gvae4v0s3	ZAR	HUF	19.58220000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.093
cmnhq01qg006lil5g32ejp6le	ZAR	IDR	999.94000000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.096
cmnhq01qi006ril5g6pta8vs6	ZAR	ILS	0.18536000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.099
cmnhq01qn006til5g6pqvliq5	ZAR	INR	5.47280000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.103
cmnhq01qs006xil5ga9fgqhyu	ZAR	ISK	7.36510000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.109
cmnhq01qv006zil5gch7ebcur	ZAR	JPY	9.38180000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.112
cmnhq01rq007til5gdp4xdpuq	ZAR	SEK	0.55840000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.142
cmnhq01rs007vil5ghrkf2m0h	ZAR	SGD	0.07566000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.144
cmmxmmdda01vnccosoovghudp	ZAR	CHF	0.04651000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.623
cmmxmmddt01w1ccosrm2yd54i	ZAR	HUF	20.10700000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.642
cmmxmmddw01w3ccos548zr9wi	ZAR	IDR	993.65000000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.644
cmmxmmddz01w5ccosn3mtksow	ZAR	ILS	0.18356000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.647
cmmxmmde101w7ccosikb81dvn	ZAR	INR	5.46290000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.649
cmmf1wau9008zhwgvfwb2oepg	ZAR	AUD	0.08537000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.801
cmmf1waur0093hwgvbqjbpce2	ZAR	CAD	0.08165000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.819
cmmf1wav3009dhwgv2njnnnu9	ZAR	EUR	0.05174000	2026-03-06 00:00:00	API	2026-03-06 15:30:00.831
cmmjc7v200004d8nti74ci8o6	ZAR	AUD	0.08544000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.073
cmmjc7v3p0006d8ntc2cr82nk	ZAR	BRL	0.31362000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.141
cmmjc7v3r0008d8ntvj79d52u	ZAR	CAD	0.08137000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.144
cmmjc7v3v000ad8ntxf4dp1v7	ZAR	CHF	0.04675000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.147
cmmjc7v3z000cd8ntimybezl9	ZAR	CNY	0.41478000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.151
cmmjc7v42000ed8nt0jldtttj	ZAR	CZK	1.26620000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.154
cmmjc7v45000gd8ntt4wpw0ho	ZAR	DKK	0.38769000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.157
cmmjc7v47000id8ntnieq5bhn	ZAR	EUR	0.05189000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.159
cmmjc7v4a000kd8ntsac3y79n	ZAR	GBP	0.04490000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.162
cmmjc7v4d000md8ntku55qux7	ZAR	HKD	0.46866000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.165
cmmjc7v4f000od8ntupwnrr0s	ZAR	HUF	20.57000000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.168
cmmjc7v4i000qd8ntd12rdbtx	ZAR	IDR	1015.88000000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.17
cmmjc7v4k000sd8ntv45k29r6	ZAR	ILS	0.18655000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.172
cmmjc7v4n000ud8ntma4hfr8j	ZAR	INR	5.53450000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.175
cmmjc7v4q000wd8nt4en2huqu	ZAR	ISK	7.52980000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.178
cmmjc7v4t000yd8nt0nvq5gka	ZAR	JPY	9.50440000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.181
cmmjc7v4w0010d8ntbjtayp5q	ZAR	KRW	89.05000000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.184
cmmjc7v4y0012d8ntvmk85i2g	ZAR	MXN	1.07020000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.186
cmmjc7v510014d8nte5f6tgzv	ZAR	MYR	0.23763000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.189
cmmjc7v540016d8nt2jwzrz8e	ZAR	NOK	0.57885000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.192
cmmjc7v560018d8ntac8id00u	ZAR	NZD	0.10152000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.194
cmmjc7v58001ad8ntxgltnngs	ZAR	PHP	3.56920000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.196
cmmjc7v5b001cd8ntsmh8vfmp	ZAR	PLN	0.22203000	2026-03-09 00:00:00	API	2026-03-09 15:30:01.2
cmmxmmdeb01wfccos4rk1bkqc	ZAR	MXN	1.04970000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.659
cmmxmmdec01whccosnvuitd9c	ZAR	MYR	0.23079000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.661
cmmxmmdee01wjccosxjie4tk1	ZAR	NOK	0.56072000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.663
cmmxmmdeg01wlccoswmavimlu	ZAR	NZD	0.10097000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.664
cmmxmmdei01wnccos2inia4oq	ZAR	PHP	3.52420000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.666
cmmxmmdek01wpccosq8k0b6mp	ZAR	PLN	0.21852000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.668
cmmxmmdem01wrccosbkq6kjbx	ZAR	RON	0.25992000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.67
cmmxmmdeo01wtccos2to258dw	ZAR	SEK	0.55106000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.672
cmmxmmder01wvccos7h9gusuh	ZAR	SGD	0.07518000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.676
cmmxmmdeu01wxccosk4zavo1d	ZAR	THB	1.92780000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.678
cmmxmmdez01wzccosj2gqj7jl	ZAR	TRY	2.59660000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.684
cmmxmmdf201x1ccosvunmu78k	ZAR	USD	0.05859000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.686
cmmxmmde401w9ccos0h848gk3	ZAR	ISK	7.31240000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.652
cmmw63xwh001kf6uf0ej4y6lq	ZAR	THB	1.94010000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.737
cmmw63xwk001mf6ufthp11j7v	ZAR	TRY	2.65360000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.74
cmmw63xwm001of6uf2ddw075v	ZAR	USD	0.06003000	2026-03-17 00:00:00	API	2026-03-18 15:00:00.742
cmmw76ipj0034f6ufzvdnvfin	ZAR	PLN	0.21997000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.631
cmmw76ipl0036f6uf271eql9a	ZAR	RON	0.26233000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.633
cmmw76ipm0038f6ufz6v1x0w2	ZAR	SEK	0.55506000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.635
cmmw76ipp003af6ufpbtdvspy	ZAR	SGD	0.07588000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.637
cmmw76ipr003cf6uft5eyp3na	ZAR	THB	1.93460000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.639
cmmw76ips003ef6ufgwq4eth5	ZAR	TRY	2.61900000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.641
cmmw76ipv003gf6ufcts81wnt	ZAR	USD	0.05923000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.643
cmmxmmdd001vjccosyr3tmc48	ZAR	BRL	0.31043000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.612
cmmxmmddf01vrccosoy7kvzss	ZAR	CZK	1.25020000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.627
cmmxmmddl01vvccosgexdtyzi	ZAR	EUR	0.05099000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.633
cmmw76io1001wf6uf4exmce92	ZAR	AUD	0.08397000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.577
cmmw76io8001yf6ufqg6d3idz	ZAR	BRL	0.30941000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.585
cmmw76iob0020f6ufcr7fr5mt	ZAR	CAD	0.08124000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.587
cmmw76iod0022f6ufmbonf0jh	ZAR	CHF	0.04673000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.589
cmmw76iog0024f6ufqdmq6bez	ZAR	CNY	0.40795000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.592
cmmw76ioi0026f6uf1143rc2y	ZAR	CZK	1.26010000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.594
cmmw76iok0028f6ufwc1q0wxr	ZAR	DKK	0.38481000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.597
cmmw76ion002af6uf1rxt7xgk	ZAR	EUR	0.05150000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.599
cmmw76iop002cf6ufsj4751tw	ZAR	GBP	0.04449000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.601
cmmw76ioq002ef6ufge2xjql5	ZAR	HKD	0.46420000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.603
cmmw76iot002gf6ufn58a2n05	ZAR	HUF	20.23100000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.605
cmmw76iov002if6ufd1ntyme2	ZAR	IDR	1006.47000000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.608
cmmw76ioy002kf6uf9iigqe95	ZAR	ILS	0.18375000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.61
cmmw76ip0002mf6uf1blpztfb	ZAR	INR	5.50180000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.613
cmmw76ip2002of6ufntuu5n46	ZAR	ISK	7.39540000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.615
cmmw76ip4002qf6ufcgs4qqc0	ZAR	JPY	9.44980000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.617
cmmw76ip6002sf6ufumln7k5p	ZAR	KRW	89.05000000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.618
cmmw76ip8002uf6ufcu8n75et	ZAR	MXN	1.05030000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.62
cmmw76ipa002wf6uff8zi0ny7	ZAR	MYR	0.23196000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.623
cmmw76ipc002yf6ufy8fw41ol	ZAR	NOK	0.56756000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.625
cmmw76ipf0030f6ufuddy70bi	ZAR	NZD	0.10178000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.627
cmmw76iph0032f6uf7h9apx9h	ZAR	PHP	3.55360000	2026-03-18 00:00:00	API	2026-03-18 15:30:00.629
cmn4dw4i7000edxamktcgajo1	ZAR	DKK	0.38291000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.383
cmn4dw4i9000gdxam2rch1cde	ZAR	EUR	0.05125000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.385
cmn4dw4ib000idxami5bzjjyw	ZAR	GBP	0.04430000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.388
cmn4dw4id000kdxamzsba5j85	ZAR	HKD	0.46405000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.39
cmn4dw4ig000mdxamks608lsp	ZAR	HUF	20.11500000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.392
cmn4dw4ik000odxamais2ouig	ZAR	IDR	1002.32000000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.397
cmn4dw4ip000sdxamf8262lkg	ZAR	INR	5.54440000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.402
cmn4dw4is000udxamqp0ln8hl	ZAR	ISK	7.36990000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.404
cmmxmmdc401vhccosn7z9wq9n	ZAR	AUD	0.08364000	2026-03-19 00:00:00	API	2026-03-19 15:30:00.58
cmn4dw4iu000wdxamh3jax965	ZAR	JPY	9.40260000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.407
cmn4dw4ix000ydxambcts6yh3	ZAR	KRW	88.88000000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.409
cmn4dw4j10010dxamujzxwaxq	ZAR	MXN	1.05520000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.413
cmn4dw4j30012dxam0klljgw0	ZAR	MYR	0.23330000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.415
cmn4dw4j60014dxam47erq2ub	ZAR	NOK	0.56525000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.418
cmn4dw4j80016dxamdgcccjy7	ZAR	NZD	0.10108000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.42
cmn4dw4ja0018dxamkcdib0md	ZAR	PHP	3.54560000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.422
cmn4dw4jd001adxam9l71cafn	ZAR	PLN	0.21927000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.425
cmn4dw4jg001cdxamlqtne4mg	ZAR	RON	0.26118000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.428
cmn4dw4ji001edxamktlgtht0	ZAR	SEK	0.55262000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.431
cmn4dw4jl001gdxam133kzaja	ZAR	SGD	0.07582000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.433
cmn4dw4jn001idxamd6wo85jt	ZAR	THB	1.94010000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.436
cmn4dw4jp001kdxamc8s8n04j	ZAR	TRY	2.62390000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.438
cmn4dw4js001mdxam31gx7t6e	ZAR	USD	0.05922000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.441
cmnhq01mb0053il5gc903uapo	ZAR	AUD	0.08554000	2026-04-02 00:00:00	API	2026-04-02 17:00:00.948
cmnhq01nl005hil5gggy746e9	ZAR	BRL	0.30460000	2026-04-02 00:00:00	API	2026-04-02 17:00:00.993
cmn4dw3qr0002dxamnl7yhfwl	ZAR	AUD	0.08380000	2026-03-20 00:00:00	API	2026-03-24 09:00:00.93
cmn4dw4hr0004dxame14xx3h6	ZAR	BRL	0.31122000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.367
cmn4dw4ht0006dxamwhd6v6jl	ZAR	CAD	0.08123000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.37
cmn4dw4hw0008dxaml3w6wbw6	ZAR	CHF	0.04662000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.372
cmn4dw4hz000adxam8jt20q0h	ZAR	CNY	0.40829000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.375
cmn4dw4i4000cdxam3yp4mget	ZAR	CZK	1.25590000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.381
cmn4dw4in000qdxam8i6tmu5b	ZAR	ILS	0.18393000	2026-03-20 00:00:00	API	2026-03-24 09:00:02.399
cmnhq01p2005ril5gsqnzfz0v	ZAR	CHF	0.04699000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.046
cmnhq01pg005vil5g4oum03cq	ZAR	CNY	0.40546000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.06
cmnhq01qy0071il5glcaa2z2o	ZAR	KRW	89.15000000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.114
cmnhq01r10077il5g7lr6495u	ZAR	MXN	1.05450000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.117
cmnhq01r60079il5g0fx5zl4v	ZAR	MYR	0.23742000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.122
cmnhq01ra007dil5gmj8gsqyg	ZAR	NOK	0.57270000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.126
cmnhq01rc007fil5gmnvlyzkh	ZAR	NZD	0.10298000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.129
cmnhq01rf007hil5getv9ixkv	ZAR	PHP	3.56320000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.131
cmnhq01rj007nil5geqs44shm	ZAR	PLN	0.21858000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.135
cmnhq01rn007ril5g4sd70i8r	ZAR	RON	0.26004000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.139
cmnhq01rv0081il5g9qofzio8	ZAR	THB	1.92600000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.147
cmnhq01rz0085il5gkltbudqm	ZAR	TRY	2.61550000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.151
cmnhq01s30087il5ge00pvdjv	ZAR	USD	0.05878000	2026-04-02 00:00:00	API	2026-04-02 17:00:01.155
\.


--
-- TOC entry 5910 (class 0 OID 204549)
-- Dependencies: 257
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, name, "defaultTaxRate", "ledgerAccount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5912 (class 0 OID 204559)
-- Dependencies: 259
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, "expenseSeq", "expenseDate", description, amount, "taxRate", "taxAmount", "totalAmount", status, "paymentMethod", notes, "supplierId", "categoryId", "userId", "createdAt", "updatedAt", "journalEntryId") FROM stdin;
\.


--
-- TOC entry 5929 (class 0 OID 204911)
-- Dependencies: 276
-- Data for Name: fixed_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fixed_assets (id, name, description, "assetCode", "purchaseDate", cost, "residualValue", "usefulLifeYears", "depreciationMethod", "accumulatedDepreciation", status, "disposedAt", "disposedAmount", "journalEntryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5928 (class 0 OID 204891)
-- Dependencies: 275
-- Data for Name: inventory_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_movements (id, "productId", type, quantity, "unitCost", reference, "referenceType", notes, "createdAt", "userId") FROM stdin;
\.


--
-- TOC entry 5877 (class 0 OID 203744)
-- Dependencies: 224
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, "invoiceId", "productId", description, quantity, "unitPrice", discount, "taxRate", total) FROM stdin;
cmm484z9p0006945q3la9gbxf	cmm484z9o0004945q204d0y5y	cmm481oue0000945q6qksiu1f	Monthly Commission Bluedog Technology	1.00	6245.57	0.00	0.0000	6245.57
cmm484z9p0007945qkesakur6	cmm484z9o0004945q204d0y5y	\N	Please find Spreadsheet attached	1.00	0.00	0.00	0.0000	0.00
cmm49246v0006trwpcthb3fk0	cmm49246v0004trwpp9wrybt5	cmm490rip0000trwp9q09xvmz	Newe Wireless Installation(New installation for client 7855)	1.00	450.00	0.00	0.0000	450.00
cmm4zkavw013g1vs3dakf57ij	cmm4zkavv013f1vs3ahwucert	\N	test	1.00	600.00	0.00	0.0000	600.00
cmmxezaf501fqccos2dpeu0wf	cmmxezaf501foccosseep05jt	cmmfdptf800u5hwgvt7p1cjul	Technical Callout Fee(80 Afrikander firmware update on NVR and Camera	1.00	500.00	0.00	0.0000	500.00
cmm54hd9b002ys8x6alpcvxd9	cmm54hd9b002ws8x6k997r60l	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm54ku0a003is8x6pt2xgbqh	cmm54ku0a003gs8x6m3nypblo	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmm54qdc40042s8x6nro4hz56	cmm54qdc40040s8x6dokn666t	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmm5521qd006qs8x67j5sxznm	cmm5521qd006os8x6jss4oqbd	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm5555sn0079s8x6t39rgreh	cmm5555sn0077s8x665dh6i2c	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmm5555sn007as8x6ys175gmb	cmm5555sn0077s8x665dh6i2c	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmm557l3x008as8x6mzswmj3p	cmm557ctw007rs8x6k4c62o5h	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmm55abru008gs8x68j1sehys	cmm55abru008es8x6xzq5jayq	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm55f9mw0091s8x6lopjgi0e	cmm55f9mw008zs8x6gg4khx43	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmxgp1al01kbccosx0w434il	cmmxgp1al01k9ccos546ajwxb	cmmfdptf800u5hwgvt7p1cjul	Maintenance of the internal network, including setting up, configuring, and updating access points.	1.00	2500.00	0.00	0.0000	2500.00
cmm55jsa100a0s8x6493v0jho	cmm55jlrg009is8x6pcjr9ir9	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmm55ocu400a7s8x6yroszscz	cmm55ocu400a5s8x6a664jzkn	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm55rguz00ars8x6z50ouvyz	cmm55rguz00aps8x6ugt2sshx	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm55uyy700bas8x67wxq0jr6	cmm55uyy700b8s8x6qanzofol	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmm55x5y900bts8x65c0kqbht	cmm55x5y900brs8x6p43fnlw6	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmxgp1al01kcccos0784z1h2	cmmxgp1al01k9ccos546ajwxb	cmmxgnxsj01k6ccos5vsjo60j	Cat5e Network Cable (30mx Cat5e outdoor cable(Cable run from switch to the Room 5 Access Point ) 	1.00	650.00	0.00	0.0000	650.00
cmm6f4hav002pzvp1qeywolwd	cmm6f30wa0003zvp1hl7kvrhv	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmm6fvdpv000v1klqour30g7c	cmm6fvdpv000t1klq3zsyw54w	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6fxar1001e1klqihe3bt23	cmm6fxar1001c1klqu51c1exl	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6lhr9t002s1klqpdkundfx	cmm6lhr9t002q1klqio5407zy	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6ljq8v003c1klqqscfzsjr	cmm6ljq8v003a1klq6tth9275	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6lm10m003v1klqpnxa3s4n	cmm6lm10m003t1klqh30komsw	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6lqx1h004g1klqmm9ye18n	cmm6lqx1h004e1klq1yk3qy3r	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6lu7z2004z1klqpy12kox9	cmm6lu7z2004x1klq9seu83sm	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6lw8bq005i1klqqwt8wx2d	cmm6lw8bq005g1klqheq6wawo	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmm6lyaxz00621klqq50pfcrl	cmm6lyaxz00601klqi4pwr9ph	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmm6m0ebx00711klq7we0d53d	cmm6m031l006j1klqoadqlc6z	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	550.00	0.00	0.0000	550.00
cmm6m2wd500781klqwt8jamgo	cmm6m2wd500761klqjgzyw96v	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmm6m4thj007r1klqvylqjs1v	cmm6m4thj007p1klqng8ppg7p	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmm6m86yb008a1klqvdqx4wh9	cmm6m86yb00881klqd917funl	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6maz3e008u1klqzd0d2rv6	cmm6maz3e008s1klqij3xvbtd	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mcqa1009d1klq4c8kvzqg	cmm6mcqa1009b1klqtr8yxhic	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mgxu6009y1klqic7t3zh4	cmm6mgxu6009w1klqd03montw	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mh8ez00ag1klqk9i76p9w	cmm6mh8ez00ae1klqkzkqpyuo	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mjsoh00az1klqdmbe591y	cmm6mjsoh00ax1klqu3xvzif4	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmm6mp6l100bj1klq2iqqzz97	cmm6mp6l100bh1klqc1xu49bj	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmm6mrryx00c21klqg489o869	cmm6mrryx00c01klq9xnd2vf1	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mtjg800cm1klqbaa5hsrx	cmm6mtjg800ck1klq2tjwvvq4	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6mvsqa00d51klq3cssv1bz	cmm6mvsqa00d31klqpyyztysa	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmm6n1ox100dr1klqjyfukrdi	cmm6n1ox100dp1klqwofjz9nl	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmmaerbl20022kgp4vxd60pdt	cmmaerbl20020kgp46yapihs9	\N	test	1.00	580.00	0.00	0.0000	580.00
cmmaeu6iz002mkgp4flvculmp	cmmaeu6iz002kkgp40387fpce	cmmaetrg2002hkgp4oa536vjo	hyswfhx	1.00	500.00	0.00	0.0000	500.00
cmmfdqtbg00uahwgv0vyu3947	cmmfdqtbg00u8hwgv3u8kb8su	cmmfdptf800u5hwgvt7p1cjul	Technical Callout Fee(Fix broken fibre cable)	1.00	1500.00	0.00	0.0000	1500.00
cmmfdycnu00uuhwgvqfxiztup	cmmfdycnu00ushwgvl4d5twun	cmmfdptf800u5hwgvt7p1cjul	Technical Callout Fee(Dish alignment-61 Freezia)	1.00	500.00	0.00	0.0000	500.00
cmmizkjxb00dnkem8fbg12013	cmm548jid001vs8x6ip7s3bpi	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	270.00	0.00	0.0000	270.00
cmmxgpq7h01kwccoslu9jtse3	cmmxf1pel01g7ccosq3diypp8	cmmfdptf800u5hwgvt7p1cjul	Technical Callout Fee for Splicing and Repair of Fibre Cable Damaged by Contractors During Wall Construction	1.00	1000.00	0.00	0.0000	1000.00
cmmxgt6a601m2ccosjq25a5my	cmmxgt6a601m0ccosdah4sodh	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq014a0004il5gkdft0pos	cmnhq014a0002il5g8x6qzmpb	\N	Monthly susbcription	1.00	465.00	0.00	0.0000	465.00
cmnhq0187000ail5ghvek3nxl	cmnhq01870008il5g9f0gk02x	\N	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq019d000gil5ge3y7ersa	cmnhq019c000eil5gfozc4a8r	cmm490rip0000trwp9q09xvmz	Newe Wireless Installation(New installation for client 7855)	1.00	450.00	0.00	0.0000	450.00
cmnhq01ab000oil5grq3fndg7	cmnhq01ab000mil5ggf2upb40	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01at000uil5g8zxvm55y	cmnhq01at000sil5g0n21nkd2	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	270.00	0.00	0.0000	270.00
cmnhq01bm0012il5g6o4pmlqi	cmnhq01bm0010il5g699bq3wh	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmnhq01c10018il5gfwlv4bsi	cmnhq01c10016il5gdspjhxm4	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmnhq01cd001eil5ghifv6cx5	cmnhq01cd001cil5g1m8u2g2v	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01co001kil5g7zk5eagx	cmnhq01co001iil5gn7ozjtd4	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmnhq01co001lil5g01nfpy4u	cmnhq01co001iil5gn7ozjtd4	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmnhq01en001ril5goxjtov0f	cmnhq01en001pil5gi1vc6sfj	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmnhq01ey001xil5gwwnagnuo	cmnhq01ey001vil5gwx5dp4ad	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01fe0023il5g8g6fqzoz	cmnhq01fe0021il5gu4slheky	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmnhq01fs0029il5gqf5t7f5o	cmnhq01fs0027il5gnd8o0rz7	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01g6002fil5gsaoxyk5q	cmnhq01g5002dil5gb3d6zax8	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01gi002lil5gj43qi3iq	cmnhq01gi002jil5gllim8wr2	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01gt002ril5gaqr1lwtq	cmnhq01gt002pil5gddd7qcmo	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmnhq01h7002xil5ge484ypln	cmnhq01h7002vil5g6hon7p0k	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01hl0033il5girf26wo4	cmnhq01hl0031il5gggsgcp9n	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmnhq01i1003bil5gwufpciim	cmnhq01i10039il5ga38l4cst	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01if003hil5g88y5sbvv	cmnhq01if003fil5g0jdvy4l2	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01io003nil5g389n8e2s	cmnhq01io003lil5gxnh50ht7	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01j3003til5gby2tgopq	cmnhq01j3003ril5giatnc40g	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01jf003zil5g9ccanv4s	cmnhq01jf003xil5g4gjodk7r	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01jq0045il5gitcwapl2	cmnhq01jq0043il5guu3cnbg8	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01k1004bil5g33os3vzt	cmnhq01k10049il5gamnrycij	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01ke004hil5gqmsd6sn2	cmnhq01ke004fil5gsqlatwhb	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmnhq01kq004nil5galofk1bj	cmnhq01kp004lil5gkguig1dn	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmnhq01ld004zil5g2m2n4fk4	cmnhq01ld004xil5g6g4m0ds0	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmnhq01md0057il5gi8vjkzdg	cmnhq01md0055il5g8evc6smq	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmnhq01n3005dil5gez0njvc2	cmnhq01n3005bil5gor68ssc5	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01nm005lil5g47pghzhb	cmnhq01nm005jil5gshu2o4rf	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01pm0061il5gt21n6gdp	cmnhq01pl005zil5gk3fovhc8	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01q2006bil5gyzi6871w	cmnhq01q20069il5gsrm6b0pc	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01qi006pil5gxx8ye3j7	cmnhq01qi006nil5g2f0e69j1	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01r00075il5ga8tkp4ba	cmnhq01r00073il5g3dqgocst	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmnhq01rg007lil5gxpa4errg	cmnhq01rg007jil5gwlqndpz8	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmnhq01ru007zil5g3l1kp49c	cmnhq01ru007xil5gxpxlxc4a	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01s9008bil5ghke9v6f2	cmnhq01s80089il5guiuv4e6d	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq01sk008hil5gz95dlof7	cmnhq01sk008fil5g02c48kal	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhq5p1e00imil5gd9obb5gu	cmnhq01l0004ril5ggwi170gk	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmnhtszbl012yil5gcddmitj1	cmnhtm90y012bil5gl3exhy1n	cmmfdptf800u5hwgvt7p1cjul	Technical Callout Fee(Setup and configuration for the  Smart TV)	1.00	400.00	0.00	0.0000	400.00
\.


--
-- TOC entry 5876 (class 0 OID 203732)
-- Dependencies: 223
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "invoiceNumber", "clientId", "userId", "quoteId", "recurringInvoiceId", status, "issueDate", "dueDate", "paidDate", notes, subtotal, "taxAmount", "totalAmount", "amountPaid", "balanceDue", "createdAt", "updatedAt", "invoiceSeq", "journalEntryId") FROM stdin;
cmm54ku0a003gs8x6m3nypblo	INV-006	cmm54kjqp003ds8x67pxwkczp	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-18 21:11:48.042		300.00	0.00	300.00	300.00	0.00	2026-02-27 16:47:22.859	2026-03-18 21:11:48.043	6	cmm54ku1d003ss8x6etbmrlfa
cmmxezaf501foccosseep05jt	INV-046	cmmfdvvyl00uphwgvtz36zuym	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-03-17 00:00:00	2026-03-23 00:00:00	2026-04-02 18:34:38.052		500.00	0.00	500.00	500.00	0.00	2026-03-19 11:56:06.401	2026-04-02 18:34:38.06	48	cmmxezajf01g1ccosi40z1k92
cmnhq01fe0021il5gu4slheky	INV-061	cmm55j1sz009fs8x62nkk3wym	cmm47pax500048s6ob25tkito	\N	cmmj89u6500ejzyd2gfpga3fs	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:55:15.402	\N	350.00	0.00	350.00	350.00	0.00	2026-04-02 17:00:00.698	2026-04-02 18:55:15.404	63	cmnhq3orm00d1il5gy8u87wsi
cmm4zkavv013f1vs3ahwucert	INV-003	cmm4zirod013c1vs3xdf1z699	cmm4zhe5z013a1vs3vdkx1i3f	\N	\N	SENT	2026-02-27 00:00:00	2026-03-05 00:00:00	\N		600.00	0.00	600.00	0.00	600.00	2026-02-27 14:26:59.996	2026-02-27 14:27:00.085	3	cmm4zkaxs013q1vs3bis8us2q
cmm55abru008es8x6xzq5jayq	INV-011	cmm55a6s8008bs8x6h6fnp5yd	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:18:51.199		365.00	0.00	365.00	365.00	0.00	2026-02-27 17:07:12.282	2026-03-06 21:18:51.201	11	cmm55absq008qs8x6u093kfez
cmnhq01bm0010il5g699bq3wh	INV-055	cmm54ohzw003xs8x6p4nhgv8l	cmm47pax500048s6ob25tkito	\N	cmmj89tz900dezyd2k56h2kq3	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	465.00	0.00	465.00	0.00	465.00	2026-04-02 17:00:00.562	2026-04-02 17:02:29.7	57	cmnhq38e600ajil5gdnn9s43b
cmnhq01c10016il5gdspjhxm4	INV-056	cmm54kjqp003ds8x67pxwkczp	cmm47pax500048s6ob25tkito	\N	cmmj89tzs00dszyd2hogf7b6f	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	300.00	0.00	300.00	0.00	300.00	2026-04-02 17:00:00.577	2026-04-02 17:02:33.043	58	cmnhq3az100ayil5gb2kmnuhf
cmnhq01en001pil5gi1vc6sfj	INV-059	cmm557419007os8x6nailjge0	cmm47pax500048s6ob25tkito	\N	cmmj89u5z00e9zyd24jrdes3g	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	350.00	0.00	350.00	0.00	350.00	2026-04-02 17:00:00.671	2026-04-02 17:02:43.503	61	cmnhq3j1m00c7il5gw5yu9f75
cmmxgt6a601m0ccosdah4sodh	INV-049	cmm55cbe3008us8x6p33kz5mb	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-25 00:00:00	2026-03-03 00:00:00	2026-04-02 18:18:12.669		365.00	0.00	365.00	730.00	0.00	2026-03-19 12:47:20.334	2026-04-02 18:18:12.677	51	cmmxgt6b501mdccosgm0upgff
cmnhq01870008il5g9f0gk02x	INV-051	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	\N	cmm6xrdbu001s13hmewcees78	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:19:15.914	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.44	2026-04-02 18:19:15.923	53	cmnhq27ae009ail5gwajihmdz
cmnhq01ab000mil5ggf2upb40	INV-053	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	\N	cmmj89tz900ddzyd2ullx18vg	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:19:40.943	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.515	2026-04-02 18:19:40.952	55	cmnhq2z4b009pil5gp9e1i0qu
cmnhq01cd001cil5g1m8u2g2v	INV-057	cmm551ver006ls8x65km4hqtw	cmm47pax500048s6ob25tkito	\N	cmmj89u5j00dyzyd2t7ahgotx	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:20:21.9	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.59	2026-04-02 18:20:21.904	59	cmnhq3d7g00bdil5gtmydevmg
cmnhq01co001iil5gn7ozjtd4	INV-058	cmm554muh0074s8x6hn9a7048	cmm47pax500048s6ob25tkito	\N	cmmj89u5r00e2zyd29vk7ahn4	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:20:37.018	\N	600.00	0.00	600.00	600.00	0.00	2026-04-02 17:00:00.6	2026-04-02 18:20:37.022	60	cmnhq3gj500bsil5g8m93lymh
cmnhq01ey001vil5gwx5dp4ad	INV-060	cmm55a6s8008bs8x6h6fnp5yd	cmm47pax500048s6ob25tkito	\N	cmmj89u6000eezyd2fpcvgxdr	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:20:56.241	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.683	2026-04-02 18:20:56.244	62	cmnhq3lcm00cmil5gy1jqpxd8
cmm6f30wa0003zvp1hl7kvrhv	INV-018	cmm6f2oi90000zvp15rcvh9dq	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-02-28 14:30:44.858		350.00	0.00	350.00	350.00	0.00	2026-02-28 14:29:13.931	2026-02-28 14:30:44.859	18	cmm6f30ya000fzvp1f7iwteof
cmm54hd9b002ws8x6k997r60l	INV-005	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-02-28 14:39:11.295		365.00	0.00	365.00	365.00	0.00	2026-02-27 16:44:41.183	2026-02-28 14:39:11.299	5	cmm54hdae0038s8x6u12tkmfs
cmm484z9o0004945q204d0y5y	INV-001	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-02-28 14:47:15.429		6245.57	0.00	6245.57	6245.57	0.00	2026-02-27 01:39:15.457	2026-02-28 14:47:15.431	1	cmm484zck000h945qaml29rrg
cmm49246v0004trwpp9wrybt5	INV-002	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-02-28 14:47:15.439		450.00	0.00	450.00	450.00	0.00	2026-02-27 02:05:01.495	2026-02-28 14:47:15.441	2	cmm49248n000gtrwpz1rip4j5
cmm6fxar1001c1klqu51c1exl	INV-020	cmm6fwzea00191klqx8mfarvz	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-02-28 22:03:50.427		365.00	0.00	365.00	365.00	0.00	2026-02-28 14:52:46.381	2026-02-28 22:03:50.433	20	cmm6fxasx001o1klqvlev7ozx
cmm5521qd006os8x6jss4oqbd	INV-008	cmm551ver006ls8x65km4hqtw	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:11:46.458		365.00	0.00	365.00	365.00	0.00	2026-02-27 17:00:46.022	2026-03-06 21:11:46.46	8	cmm5521sk0070s8x6aw8ouv9a
cmm557ctw007rs8x6k4c62o5h	INV-010	cmm557419007os8x6nailjge0	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:18:26.127		350.00	0.00	350.00	350.00	0.00	2026-02-27 17:04:53.684	2026-03-06 21:18:26.129	10	cmm557cvj0083s8x6bc1iv3yh
cmm55rguz00aps8x6ugt2sshx	INV-015	cmm55r8pq00ams8x6i0lchg3w	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:19:37.083		365.00	0.00	365.00	365.00	0.00	2026-02-27 17:20:32.027	2026-03-06 21:19:37.084	15	cmm55rgw400b1s8x6t2r22mxy
cmm55uyy700b8s8x6qanzofol	INV-016	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:19:57.749		465.00	0.00	465.00	465.00	0.00	2026-02-27 17:23:15.439	2026-03-06 21:19:57.75	16	cmm55uyza00bks8x6bd2v5sun
cmm6fvdpv000t1klq3zsyw54w	INV-019	cmm6fuy5g000q1klqcvvtfvcr	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:20:16.948		365.00	0.00	365.00	365.00	0.00	2026-02-28 14:51:16.915	2026-03-06 21:20:16.95	19	cmm6fvdr300151klq7whg0p74
cmm6lu7z2004x1klq9seu83sm	INV-025	cmm6ltyls004u1klq3s6arqce	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:21:21.819		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:38:20.51	2026-03-06 21:21:21.821	25	cmm6lu80700591klqh05nfd7l
cmm6lw8bq005g1klqheq6wawo	INV-026	cmm6lvyqs005d1klqltorxkd7	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:21:43.389		465.00	0.00	465.00	465.00	0.00	2026-02-28 17:39:54.278	2026-03-06 21:21:43.392	26	cmm6lw8cv005s1klqlxllw4nh
cmm6lyaxz00601klqi4pwr9ph	INV-027	cmm6ly0d0005x1klqmrye4jav	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:22:06.553		350.00	0.00	350.00	350.00	0.00	2026-02-28 17:41:30.983	2026-03-06 21:22:06.555	27	cmm6lyaz0006c1klqxzgzmgx8
cmm6m031l006j1klqoadqlc6z	INV-028	cmm6lzufz006g1klqacvd1c71	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:34:40.937		550.00	0.00	550.00	550.00	0.00	2026-02-28 17:42:54.058	2026-03-09 07:34:40.939	28	cmm6m032o006v1klq0nvbceqr
cmm6maz3e008s1klqij3xvbtd	INV-032	cmm6maqjf008p1klq0iyvmq8j	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:35:22.733		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:51:22.155	2026-03-09 07:35:22.734	32	cmm6maz4b00941klqf775dkvj
cmm6mgxu6009w1klqd03montw	INV-034	cmm6me5qh009r1klq9lfn2jhx	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:35:39.877		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:56:00.462	2026-03-09 07:35:39.878	34	cmm6mgxv800a81klq4gcb31dm
cmm6mh8ez00ae1klqkzkqpyuo	INV-035	cmm6mglj9009t1klqm9q1uznw	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:36:06.811		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:56:14.172	2026-03-09 07:36:06.812	35	cmm6mh8g400aq1klq7y7k0gxb
cmm548jid001vs8x6ip7s3bpi	INV-004	cmm540m4p001os8x6km8cvelc	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 09:37:59.945		270.00	0.00	270.00	270.00	0.00	2026-02-27 16:37:49.381	2026-03-09 09:37:59.949	4	cmm548jk60027s8x6726531zw
cmmxf1pel01g7ccosq3diypp8	INV-047	cmmfdly1z00shhwgvwpnfvclv	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-03-16 00:00:00	2026-03-22 00:00:00	2026-04-02 18:33:52.951		1000.00	0.00	1000.00	1000.00	0.00	2026-03-19 11:57:59.133	2026-04-02 18:33:52.952	49	cmmxf1pgw01gkccos9a48w8lc
cmmfdycnu00ushwgvl4d5twun	INV-045	cmmfdvvyl00uphwgvtz36zuym	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-03-04 00:00:00	2026-03-10 00:00:00	2026-03-18 21:11:03.675		500.00	0.00	500.00	500.00	0.00	2026-03-06 21:07:31.866	2026-03-18 21:11:03.676	45	cmmfdycp200v4hwgvmt4e6w55
cmm55x5y900brs8x6p43fnlw6	INV-017	cmm55wz4x00bos8x6nnrkl8re	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-18 21:11:32.935		365.00	0.00	365.00	365.00	0.00	2026-02-27 17:24:57.826	2026-03-18 21:11:32.936	17	cmm55x5zb00c3s8x6yhbidzgw
cmm6mtjg800ck1klq2tjwvvq4	INV-039	cmm6mtbuc00ch1klq0odakxsn	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-18 21:12:20.939		365.00	0.00	365.00	365.00	0.00	2026-02-28 18:05:48.345	2026-03-18 21:12:20.94	39	cmm6mtjhc00cw1klqkvlrc1qu
cmm6m2wd500761klqjgzyw96v	INV-029	cmm6m2n1z00721klq0sctxew0	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-18 21:12:47.263		350.00	0.00	350.00	350.00	0.00	2026-02-28 17:45:05.369	2026-03-18 21:12:47.266	29	cmm6m2we3007i1klqouvksxgl
cmm6lm10m003t1klqh30komsw	INV-023	cmm6llpqi003q1klqf1ejb34c	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-04-02 18:54:11.551		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:31:58.246	2026-04-02 18:54:11.552	23	cmm6lm11q00451klq2qavgnk2
cmm6ljq8v003a1klq6tth9275	INV-022	cmm6ljd7h00361klqff2544qa	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-19 12:45:56.612		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:30:10.975	2026-03-19 12:45:56.613	22	cmm6ljq9x003m1klqs8uel32h
cmnhtm90y012bil5gl3exhy1n	INV-090	cmnhthwx70127il5gouii1ay9	cmm47pax500048s6ob25tkito	\N	\N	OVERDUE	2026-03-20 00:00:00	2026-03-26 00:00:00	\N		400.00	0.00	400.00	0.00	400.00	2026-04-02 18:41:15.826	2026-04-02 18:46:29.841	92	cmnhtm9bu012oil5g29i8lr4u
cmm6mcqa1009b1klqtr8yxhic	INV-033	cmm6mcin600981klqhytyq4gf	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-19 12:45:32.5		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:52:44.041	2026-03-19 12:45:32.501	33	cmm6mcqb5009n1klqqlhgdsfm
cmmaerbl20020kgp46yapihs9	INV-042	cmmaen5i90006kgp431o5gmfv	cmmael1y10005kgp4vea5fi0c	cmmaeo3qw0009kgp4bq57q611	\N	SENT	2026-03-03 09:31:12.608	2026-04-02 09:31:12.608	\N	gfgfxabhjxdhkxd	580.00	0.00	580.00	0.00	580.00	2026-03-03 09:31:12.614	2026-03-03 09:31:18.806	42	cmmaergad002dkgp447ykk2ba
cmnhq01g5002dil5gb3d6zax8	INV-063	cmm55nh8g00a2s8x6rvry714w	cmm47pax500048s6ob25tkito	\N	cmmj89u7h00eszyd24v63u1fh	DRAFT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.726	2026-04-02 17:00:00.726	65	\N
cmmaeu6iz002kkgp40387fpce	INV-043	cmmaen5i90006kgp431o5gmfv	cmmael1y10005kgp4vea5fi0c	\N	\N	SENT	2026-03-03 00:00:00	2026-03-09 00:00:00	\N		500.00	0.00	500.00	0.00	500.00	2026-03-03 09:33:26.028	2026-03-03 09:33:26.08	43	cmmaeu6k1002wkgp4jsh1ov2s
cmm5555sn0077s8x665dh6i2c	INV-009	cmm554muh0074s8x6hn9a7048	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-06 21:14:32.747		600.00	0.00	600.00	600.00	0.00	2026-02-27 17:03:11.255	2026-03-06 21:14:32.749	9	cmm5555ub007ks8x6r98ibxni
cmmfdqtbg00u8hwgv3u8kb8su	INV-044	cmmfdly1z00shhwgvwpnfvclv	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-03-06 00:00:00	2026-03-12 00:00:00	2026-03-09 07:33:26.2		1500.00	0.00	1500.00	1500.00	0.00	2026-03-06 21:01:40.205	2026-03-09 07:33:26.201	44	cmmfdqtf500ukhwgv6ytruiiq
cmm6mjsoh00ax1klqu3xvzif4	INV-036	cmm6mjll100au1klqlwbnnjp9	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:36:32.282		230.00	0.00	230.00	230.00	0.00	2026-02-28 17:58:13.746	2026-03-09 07:36:32.284	36	cmm6mjspq00b91klq7p5g1tgn
cmm6mp6l100bh1klqc1xu49bj	INV-037	cmm6movbm00be1klqnc8pn4f6	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:37:02.166		300.00	0.00	300.00	300.00	0.00	2026-02-28 18:02:25.045	2026-03-09 07:37:02.168	37	cmm6mp6mb00bt1klqoz2vc1vb
cmm6mrryx00c01klq9xnd2vf1	INV-038	cmm6mrbxw00bx1klq6snmtbyb	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:37:24.281		365.00	0.00	365.00	365.00	0.00	2026-02-28 18:04:26.073	2026-03-09 07:37:24.283	38	cmm6mrrzt00cc1klqakrif1b5
cmm6mvsqa00d31klqpyyztysa	INV-040	cmm6mvjxx00d01klqrij7sk43	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 07:37:50.499		365.00	0.00	365.00	365.00	0.00	2026-02-28 18:07:33.683	2026-03-09 07:37:50.501	40	cmm6mvsre00df1klqcy2yxa24
cmm55ocu400a5s8x6a664jzkn	INV-014	cmm55nh8g00a2s8x6rvry714w	cmm47pax500048s6ob25tkito	\N	\N	OVERDUE	2026-02-27 00:00:00	2026-03-05 00:00:00	\N		365.00	0.00	365.00	0.00	365.00	2026-02-27 17:18:06.844	2026-03-09 09:57:48.854	14	cmm55ocv800ahs8x6unb7aqac
cmm6lqx1h004e1klq1yk3qy3r	INV-024	cmm6lqnd2004b1klqtzti29rl	cmm47pax500048s6ob25tkito	\N	\N	OVERDUE	2026-02-27 00:00:00	2026-03-05 00:00:00	\N		365.00	0.00	365.00	0.00	365.00	2026-02-28 17:35:46.373	2026-03-09 09:57:48.854	24	cmm6lqx30004q1klqussgct95
cmm6m4thj007p1klqng8ppg7p	INV-030	cmm6m4kb2007m1klquhr4s41u	cmm47pax500048s6ob25tkito	\N	\N	OVERDUE	2026-02-27 00:00:00	2026-03-05 00:00:00	\N		230.00	0.00	230.00	200.00	30.00	2026-02-28 17:46:34.951	2026-03-09 09:57:48.854	30	cmm6m4tih00811klqthr3uzcr
cmm6n1ox100dp1klqwofjz9nl	INV-041	cmm6n19ne00dm1klqau4zc8bp	cmm47pax500048s6ob25tkito	\N	\N	OVERDUE	2026-02-27 00:00:00	2026-03-05 00:00:00	\N		300.00	0.00	300.00	0.00	300.00	2026-02-28 18:12:08.677	2026-03-09 09:57:48.854	41	cmm6n1oy900e11klq104bn873
cmm55jlrg009is8x6pcjr9ir9	INV-013	cmm55j1sz009fs8x62nkk3wym	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 20:19:28.501		350.00	0.00	350.00	350.00	0.00	2026-02-27 17:14:25.132	2026-03-09 20:19:28.503	13	cmm55jlso009us8x6cbwa9gek
cmm54qdc40040s8x6dokn666t	INV-007	cmm54ohzw003xs8x6p4nhgv8l	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 20:24:24.687		465.00	0.00	465.00	465.00	0.00	2026-02-27 16:51:41.188	2026-03-09 20:24:24.689	7	cmm54qdd7004cs8x6oa60pgc4
cmnhq01jq0043il5guu3cnbg8	INV-073	cmm6lqnd2004b1klqtzti29rl	cmm47pax500048s6ob25tkito	\N	cmmj8beac00g8zyd2n02ez2fw	DRAFT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.854	2026-04-02 17:00:00.854	75	\N
cmnhq01gi002jil5gllim8wr2	INV-064	cmm55r8pq00ams8x6i0lchg3w	cmm47pax500048s6ob25tkito	\N	cmmj89u8000exzyd28gqlpptp	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.738	2026-04-02 17:03:15.05	66	cmnhq47dn00dvil5gfdx819t2
cmnhq01hl0031il5gggsgcp9n	INV-067	cmm6f2oi90000zvp15rcvh9dq	cmm47pax500048s6ob25tkito	\N	cmmj89u9000fdzyd248rf2vdw	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	350.00	0.00	350.00	0.00	350.00	2026-04-02 17:00:00.777	2026-04-02 17:03:27.101	69	cmnhq4gom00f4il5g3i19fyri
cmnhq01i10039il5ga38l4cst	INV-068	cmm6fuy5g000q1klqcvvtfvcr	cmm47pax500048s6ob25tkito	\N	cmmj89u9500fhzyd2h7wek72w	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.794	2026-04-02 17:03:29.449	70	cmnhq4ihv00fjil5g0n5wpcw3
cmnhq01io003lil5gxnh50ht7	INV-070	cmm6lh7k3002n1klq8jh12onn	cmm47pax500048s6ob25tkito	\N	cmmj89u9z00frzyd2sezhyu3v	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.817	2026-04-02 17:03:35.587	72	cmnhq4n8e00gdil5gxf2wbw3z
cmnhq01jf003xil5g4gjodk7r	INV-072	cmm6llpqi003q1klqf1ejb34c	cmm47pax500048s6ob25tkito	\N	cmmj8bea100g4zyd2n5ld0rcu	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.843	2026-04-02 17:04:00.065	74	cmnhq564b00h7il5gwaa7sqqv
cmm6m86yb00881klqd917funl	INV-031	cmm6m7zmc00851klqhgp4clh1	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-04-02 18:16:33.896		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:49:12.371	2026-04-02 18:16:33.897	31	cmm6m86zc008k1klqf9ij776t
cmm6lhr9t002q1klqio5407zy	INV-021	cmm6lh7k3002n1klq8jh12onn	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-04-02 18:16:53.026		365.00	0.00	365.00	365.00	0.00	2026-02-28 17:28:38.993	2026-04-02 18:16:53.027	21	cmm6lhray00321klqf0ffivyb
cmnhq01j3003ril5giatnc40g	INV-071	cmm6ljd7h00361klqff2544qa	cmm47pax500048s6ob25tkito	\N	cmmj8be9k00fyzyd2icx3ls9k	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:22:16.409	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.831	2026-04-02 18:22:16.411	73	cmnhq54as00gsil5gpz1ig1mt
cmnhq01kp004lil5gkguig1dn	INV-076	cmm6ly0d0005x1klqmrye4jav	cmm47pax500048s6ob25tkito	\N	cmmj8beal00gnzyd2zd79wttj	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:22:43.289	\N	350.00	0.00	350.00	350.00	0.00	2026-04-02 17:00:00.89	2026-04-02 18:22:43.291	78	cmnhq5f2000igil5g2n2rh62p
cmm55f9mw008zs8x6gg4khx43	INV-012	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-02-27 00:00:00	2026-03-05 00:00:00	2026-03-09 20:22:14.474		365.00	0.00	365.00	365.00	0.00	2026-02-27 17:11:02.792	2026-03-09 20:22:14.476	12	cmm55f9ny009bs8x6b7b0y6fm
cmnhq01md0055il5g8evc6smq	INV-079	cmm6m4kb2007m1klquhr4s41u	cmm47pax500048s6ob25tkito	\N	cmmj8beck00h3zyd2eihljyqw	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:22:56.954	\N	230.00	0.00	230.00	230.00	0.00	2026-04-02 17:00:00.949	2026-04-02 18:22:56.956	81	cmnhq5z1r00jsil5gd9f6rwuy
cmnhq01nm005jil5gshu2o4rf	INV-081	cmm6maqjf008p1klq0iyvmq8j	cmm47pax500048s6ob25tkito	\N	cmmj8becx00hdzyd27nueb0wz	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:23:13.686	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.994	2026-04-02 18:23:13.687	83	cmnhq639w00kmil5gg77jmx44
cmnhq01q20069il5gsrm6b0pc	INV-083	cmm6me5qh009r1klq9lfn2jhx	cmm47pax500048s6ob25tkito	\N	cmmj8bee500hmzyd2qzbu29ma	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:01.082	2026-04-02 18:23:56.884	85	cmnhszzd300xeil5gyd4dcjbm
cmnhq01qi006nil5g2f0e69j1	INV-084	cmm6mglj9009t1klqm9q1uznw	cmm47pax500048s6ob25tkito	\N	cmmj8beeq00htzyd2bwso0i75	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:25:20.184	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:01.099	2026-04-02 18:25:20.186	86	cmnhsnuy800luil5guu911463
cmnhq01rg007jil5gwlqndpz8	INV-086	cmm6movbm00be1klqnc8pn4f6	cmm47pax500048s6ob25tkito	\N	cmmj8beew00i1zyd26iazc9z5	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:25:33.833	\N	300.00	0.00	300.00	300.00	0.00	2026-04-02 17:00:01.132	2026-04-02 18:25:33.834	88	cmnhsnz3x00moil5gljo6nakr
cmnhq01sk008fil5g02c48kal	INV-089	cmm6mvjxx00d01klqrij7sk43	cmm47pax500048s6ob25tkito	\N	cmmj8beg400ihzyd2w9tmk3cp	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:25:47.949	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:01.173	2026-04-02 18:25:47.95	91	cmnhso5kh00nxil5gkcg6k1sn
cmmxgp1al01k9ccos546ajwxb	INV-048	cmmxgm46l01k5ccostk54flk0	cmm47pax500048s6ob25tkito	\N	\N	PAID	2026-03-14 00:00:00	2026-03-20 00:00:00	2026-04-02 18:34:22.099		3150.00	0.00	3150.00	3150.00	0.00	2026-03-19 12:44:07.245	2026-04-02 18:34:22.107	50	cmmxgp1f801knccosncgjl14j
cmnhq01gt002pil5gddd7qcmo	INV-065	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	\N	cmmj89u8n00f3zyd2rrx5bm41	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:53:06.795	\N	465.00	0.00	465.00	465.00	0.00	2026-04-02 17:00:00.749	2026-04-02 18:53:06.796	67	cmnhq4cjy00eail5g8fhorfxd
cmnhq014a0002il5g8x6qzmpb	INV-050	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	\N	cmm6fingm00021klq7j0gp2lx	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	465.00	0.00	465.00	0.00	465.00	2026-04-02 17:00:00.298	2026-04-02 17:01:35.486	52	cmnhq22j0008vil5g4j3bawt1
cmnhq01h7002vil5g6hon7p0k	INV-066	cmm55wz4x00bos8x6nnrkl8re	cmm47pax500048s6ob25tkito	\N	cmmj89u8r00f8zyd2yff3gz36	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.764	2026-04-02 17:03:24.059	68	cmnhq4ec500epil5gptgjfi3q
cmnhq01ke004fil5gsqlatwhb	INV-075	cmm6lvyqs005d1klqltorxkd7	cmm47pax500048s6ob25tkito	\N	cmmj8beah00gjzyd291o41dqy	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	465.00	0.00	465.00	0.00	465.00	2026-04-02 17:00:00.879	2026-04-02 17:04:08.689	77	cmnhq5crw00i1il5gvyzq38yx
cmnhq01l0004ril5ggwi170gk	INV-077	cmm6lzufz006g1klqacvd1c71	cmm47pax500048s6ob25tkito	\N	cmmj8bec300gszyd2jjpi5hpb	SENT	2026-04-02 00:00:00	2026-05-02 00:00:00	\N		365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.9	2026-04-02 17:04:32.113	79	cmnhq5uua00iyil5gjpompm8l
cmnhq01ld004xil5g6g4m0ds0	INV-078	cmm6m2n1z00721klq0sctxew0	cmm47pax500048s6ob25tkito	\N	cmmj8becf00gyzyd2mi1f0u91	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	350.00	0.00	350.00	0.00	350.00	2026-04-02 17:00:00.913	2026-04-02 17:04:34.571	80	cmnhq5wqk00jdil5g2v0z4kq6
cmnhq01n3005bil5gor68ssc5	INV-080	cmm6m7zmc00851klqhgp4clh1	cmm47pax500048s6ob25tkito	\N	cmmj8becu00h8zyd230u3a52m	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:00.976	2026-04-02 17:04:39.916	82	cmnhq60va00k7il5gl50o2g6h
cmnhq01pl005zil5gk3fovhc8	INV-082	cmm6mcin600981klqhytyq4gf	cmm47pax500048s6ob25tkito	\N	cmmj8bed500hhzyd2dodpoaq5	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:01.066	2026-04-02 17:04:46.521	84	cmnhq65ys00l1il5gt3jnql3f
cmnhq01r00073il5g3dqgocst	INV-085	cmm6mjll100au1klqlwbnnjp9	cmm47pax500048s6ob25tkito	\N	cmmj8beeq00hxzyd2hqri1d4t	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	230.00	0.00	230.00	0.00	230.00	2026-04-02 17:00:01.116	2026-04-02 18:14:34.408	87	cmnhsnxcr00m9il5gwz4xzzv3
cmnhq01ru007xil5gxpxlxc4a	INV-087	cmm6mtbuc00ch1klq0odakxsn	cmm47pax500048s6ob25tkito	\N	cmmj8bef500i7zyd2sa79lqbl	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:01.146	2026-04-02 18:14:39.665	89	cmnhso1f100n3il5gpnzlg6ot
cmnhq01s80089il5guiuv4e6d	INV-088	cmm6mrbxw00bx1klq6snmtbyb	cmm47pax500048s6ob25tkito	\N	cmmj8bef700ibzyd2jappjex2	SENT	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	\N	\N	365.00	0.00	365.00	0.00	365.00	2026-04-02 17:00:01.161	2026-04-02 18:14:41.895	90	cmnhso34w00niil5gufo0kpiq
cmnhq019c000eil5gfozc4a8r	INV-052	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	\N	cmmj89tzm00dpzyd2jguoni3b	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:19:00.059	\N	450.00	0.00	450.00	450.00	0.00	2026-04-02 17:00:00.48	2026-04-02 18:19:00.067	54	cmnhstdvn00pxil5g10wt9awj
cmnhq01at000sil5g0n21nkd2	INV-054	cmm540m4p001os8x6km8cvelc	cmm47pax500048s6ob25tkito	\N	cmmj89tz900dczyd2c1txdl3n	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:20:07.352	\N	270.00	0.00	270.00	270.00	0.00	2026-04-02 17:00:00.533	2026-04-02 18:20:07.356	56	cmnhq35v400a4il5gdpv2evxh
cmnhq01fs0027il5gnd8o0rz7	INV-062	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	\N	cmmj89u6700enzyd2u5ze7bfm	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:21:46.578	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.712	2026-04-02 18:21:46.581	64	cmnhq3rat00dgil5gaerdw7mo
cmnhq01if003fil5g0jdvy4l2	INV-069	cmm6fwzea00191klqx8mfarvz	cmm47pax500048s6ob25tkito	\N	cmmj89u9w00fnzyd2j3l5j6ov	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:22:03.979	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.807	2026-04-02 18:22:03.98	71	cmnhq4kxh00fyil5g4h9nt2ba
cmnhq01k10049il5gamnrycij	INV-074	cmm6ltyls004u1klq3s6arqce	cmm47pax500048s6ob25tkito	\N	cmmj8beag00gfzyd2tanq0a6n	PAID	2026-04-02 17:00:00.047	2026-05-02 17:00:00.047	2026-04-02 18:22:30.941	\N	365.00	0.00	365.00	365.00	0.00	2026-04-02 17:00:00.866	2026-04-02 18:22:30.943	76	cmnhq5aiw00hmil5g0v8s4gaw
\.


--
-- TOC entry 5883 (class 0 OID 203923)
-- Dependencies: 230
-- Data for Name: job_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_locks (name, "lockedAt", "lockedBy", "ttlMs") FROM stdin;
\.


--
-- TOC entry 5908 (class 0 OID 204442)
-- Dependencies: 255
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entries (id, "entryNumber", date, memo, "sourceType", "sourceId", status, "reversedAt", "reversedEntryId", "createdByUserId", "createdAt", "updatedAt", "approvedByUserId", "approvedAt") FROM stdin;
cmm484zck000h945qaml29rrg	JE-000001	2026-02-27 00:00:00	Invoice INV-001	INVOICE	cmm484z9o0004945q204d0y5y	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 01:39:15.572	2026-02-27 01:39:15.572	\N	\N
cmm49248n000gtrwpz1rip4j5	JE-000002	2026-02-27 00:00:00	Invoice INV-002	INVOICE	cmm49246v0004trwpp9wrybt5	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 02:05:01.56	2026-02-27 02:05:01.56	\N	\N
cmm4zkaxs013q1vs3bis8us2q	JE-000003	2026-02-27 00:00:00	Invoice INV-003	INVOICE	cmm4zkavv013f1vs3ahwucert	POSTED	\N	\N	cmm4zhe5z013a1vs3vdkx1i3f	2026-02-27 14:27:00.063	2026-02-27 14:27:00.063	\N	\N
cmm548jk60027s8x6726531zw	JE-000004	2026-02-27 00:00:00	Invoice INV-004	INVOICE	cmm548jid001vs8x6ip7s3bpi	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:37:49.446	2026-02-27 16:37:49.446	\N	\N
cmm54dqwi002ps8x6wq1gzmud	JE-000005	2026-02-27 16:41:52.188	Payment PAY-001	PAYMENT	cmm54dqug002es8x6onic5950	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:41:52.242	2026-02-27 16:41:52.242	\N	\N
cmm54hdae0038s8x6u12tkmfs	JE-000006	2026-02-27 00:00:00	Invoice INV-005	INVOICE	cmm54hd9b002ws8x6k997r60l	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:44:41.222	2026-02-27 16:44:41.222	\N	\N
cmm54ku1d003ss8x6etbmrlfa	JE-000007	2026-02-27 00:00:00	Invoice INV-006	INVOICE	cmm54ku0a003gs8x6m3nypblo	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:47:22.898	2026-02-27 16:47:22.898	\N	\N
cmm54qdd7004cs8x6oa60pgc4	JE-000008	2026-02-27 00:00:00	Invoice INV-007	INVOICE	cmm54qdc40040s8x6dokn666t	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:51:41.227	2026-02-27 16:51:41.227	\N	\N
cmm54smhn004ts8x65hmhtiou	JE-000009	2026-02-27 16:53:26.296	Payment PAY-002	PAYMENT	cmm54smfh004is8x6chyi22zf	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 16:53:26.363	2026-02-27 16:53:26.363	\N	\N
cmm5521sk0070s8x6aw8ouv9a	JE-000010	2026-02-27 00:00:00	Invoice INV-008	INVOICE	cmm5521qd006os8x6jss4oqbd	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:00:46.1	2026-02-27 17:00:46.1	\N	\N
cmm5555ub007ks8x6r98ibxni	JE-000011	2026-02-27 00:00:00	Invoice INV-009	INVOICE	cmm5555sn0077s8x665dh6i2c	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:03:11.315	2026-02-27 17:03:11.315	\N	\N
cmm557cvj0083s8x6bc1iv3yh	JE-000012	2026-02-27 00:00:00	Invoice INV-010	INVOICE	cmm557ctw007rs8x6k4c62o5h	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:04:53.743	2026-02-27 17:04:53.743	\N	\N
cmm55absq008qs8x6u093kfez	JE-000013	2026-02-27 00:00:00	Invoice INV-011	INVOICE	cmm55abru008es8x6xzq5jayq	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:07:12.314	2026-02-27 17:07:12.314	\N	\N
cmm55f9ny009bs8x6b7b0y6fm	JE-000014	2026-02-27 00:00:00	Invoice INV-012	INVOICE	cmm55f9mw008zs8x6gg4khx43	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:11:02.83	2026-02-27 17:11:02.83	\N	\N
cmm55jlso009us8x6cbwa9gek	JE-000015	2026-02-27 00:00:00	Invoice INV-013	INVOICE	cmm55jlrg009is8x6pcjr9ir9	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:14:25.177	2026-02-27 17:14:25.177	\N	\N
cmm55ocv800ahs8x6unb7aqac	JE-000016	2026-02-27 00:00:00	Invoice INV-014	INVOICE	cmm55ocu400a5s8x6a664jzkn	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:18:06.884	2026-02-27 17:18:06.884	\N	\N
cmm55rgw400b1s8x6t2r22mxy	JE-000017	2026-02-27 00:00:00	Invoice INV-015	INVOICE	cmm55rguz00aps8x6ugt2sshx	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:20:32.069	2026-02-27 17:20:32.069	\N	\N
cmm55uyza00bks8x6bd2v5sun	JE-000018	2026-02-27 00:00:00	Invoice INV-016	INVOICE	cmm55uyy700b8s8x6qanzofol	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:23:15.479	2026-02-27 17:23:15.479	\N	\N
cmm55x5zb00c3s8x6yhbidzgw	JE-000019	2026-02-27 00:00:00	Invoice INV-017	INVOICE	cmm55x5y900brs8x6p43fnlw6	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-27 17:24:57.863	2026-02-27 17:24:57.863	\N	\N
cmm6f30ya000fzvp1f7iwteof	JE-000020	2026-02-27 00:00:00	Invoice INV-018	INVOICE	cmm6f30wa0003zvp1hl7kvrhv	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:29:14.002	2026-02-28 14:29:14.002	\N	\N
cmm6f3t4k000wzvp15vrbxl2c	JE-000021	2026-02-28 14:29:50.484	Payment PAY-003	PAYMENT	cmm6f3t3f000lzvp1h8shmp29	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:29:50.516	2026-02-28 14:29:50.516	\N	\N
cmm6fftsf000d2fmqfjpjz7dj	JE-000022	2026-02-28 14:39:11.21	Payment PAY-004	PAYMENT	cmm6fftqf00022fmqdupz6ew1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:39:11.247	2026-02-28 14:39:11.247	\N	\N
cmm6fq7da000l1klq85ojx81z	JE-000023	2026-02-28 14:47:15.33	Payment PAY-005	PAYMENT	cmm6fq7ar00091klq0huyhk2a	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:47:15.406	2026-02-28 14:47:15.406	\N	\N
cmm6fvdr300151klq7whg0p74	JE-000024	2026-02-27 00:00:00	Invoice INV-019	INVOICE	cmm6fvdpv000t1klq3zsyw54w	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:51:16.96	2026-02-28 14:51:16.96	\N	\N
cmm6fxasx001o1klqvlev7ozx	JE-000025	2026-02-27 00:00:00	Invoice INV-020	INVOICE	cmm6fxar1001c1klqu51c1exl	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 14:52:46.449	2026-02-28 14:52:46.449	\N	\N
cmm6lhray00321klqf0ffivyb	JE-000026	2026-02-27 00:00:00	Invoice INV-021	INVOICE	cmm6lhr9t002q1klqio5407zy	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:28:39.035	2026-02-28 17:28:39.035	\N	\N
cmm6ljq9x003m1klqs8uel32h	JE-000027	2026-02-27 00:00:00	Invoice INV-022	INVOICE	cmm6ljq8v003a1klq6tth9275	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:30:11.013	2026-02-28 17:30:11.013	\N	\N
cmm6lm11q00451klq2qavgnk2	JE-000028	2026-02-27 00:00:00	Invoice INV-023	INVOICE	cmm6lm10m003t1klqh30komsw	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:31:58.286	2026-02-28 17:31:58.286	\N	\N
cmm6lqx30004q1klqussgct95	JE-000029	2026-02-27 00:00:00	Invoice INV-024	INVOICE	cmm6lqx1h004e1klq1yk3qy3r	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:35:46.429	2026-02-28 17:35:46.429	\N	\N
cmm6lu80700591klqh05nfd7l	JE-000030	2026-02-27 00:00:00	Invoice INV-025	INVOICE	cmm6lu7z2004x1klq9seu83sm	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:38:20.552	2026-02-28 17:38:20.552	\N	\N
cmm6lw8cv005s1klqlxllw4nh	JE-000031	2026-02-27 00:00:00	Invoice INV-026	INVOICE	cmm6lw8bq005g1klqheq6wawo	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:39:54.319	2026-02-28 17:39:54.319	\N	\N
cmm6lyaz0006c1klqxzgzmgx8	JE-000032	2026-02-27 00:00:00	Invoice INV-027	INVOICE	cmm6lyaxz00601klqi4pwr9ph	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:41:31.021	2026-02-28 17:41:31.021	\N	\N
cmm6m032o006v1klq0nvbceqr	JE-000033	2026-02-27 00:00:00	Invoice INV-028	INVOICE	cmm6m031l006j1klqoadqlc6z	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:42:54.097	2026-02-28 17:42:54.097	\N	\N
cmm6m2we3007i1klqouvksxgl	JE-000034	2026-02-27 00:00:00	Invoice INV-029	INVOICE	cmm6m2wd500761klqjgzyw96v	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:45:05.404	2026-02-28 17:45:05.404	\N	\N
cmm6m4tih00811klqthr3uzcr	JE-000035	2026-02-27 00:00:00	Invoice INV-030	INVOICE	cmm6m4thj007p1klqng8ppg7p	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:46:34.986	2026-02-28 17:46:34.986	\N	\N
cmm6m86zc008k1klqf9ij776t	JE-000036	2026-02-27 00:00:00	Invoice INV-031	INVOICE	cmm6m86yb00881klqd917funl	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:49:12.408	2026-02-28 17:49:12.408	\N	\N
cmm6maz4b00941klqf775dkvj	JE-000037	2026-02-27 00:00:00	Invoice INV-032	INVOICE	cmm6maz3e008s1klqij3xvbtd	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:51:22.188	2026-02-28 17:51:22.188	\N	\N
cmm6mcqb5009n1klqqlhgdsfm	JE-000038	2026-02-27 00:00:00	Invoice INV-033	INVOICE	cmm6mcqa1009b1klqtr8yxhic	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:52:44.082	2026-02-28 17:52:44.082	\N	\N
cmm6mgxv800a81klq4gcb31dm	JE-000039	2026-02-27 00:00:00	Invoice INV-034	INVOICE	cmm6mgxu6009w1klqd03montw	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:56:00.5	2026-02-28 17:56:00.5	\N	\N
cmm6mh8g400aq1klq7y7k0gxb	JE-000040	2026-02-27 00:00:00	Invoice INV-035	INVOICE	cmm6mh8ez00ae1klqkzkqpyuo	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:56:14.212	2026-02-28 17:56:14.212	\N	\N
cmm6mjspq00b91klq7p5g1tgn	JE-000041	2026-02-27 00:00:00	Invoice INV-036	INVOICE	cmm6mjsoh00ax1klqu3xvzif4	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 17:58:13.79	2026-02-28 17:58:13.79	\N	\N
cmm6mp6mb00bt1klqoz2vc1vb	JE-000042	2026-02-27 00:00:00	Invoice INV-037	INVOICE	cmm6mp6l100bh1klqc1xu49bj	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:02:25.092	2026-02-28 18:02:25.092	\N	\N
cmm6mrrzt00cc1klqakrif1b5	JE-000043	2026-02-27 00:00:00	Invoice INV-038	INVOICE	cmm6mrryx00c01klq9xnd2vf1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:04:26.105	2026-02-28 18:04:26.105	\N	\N
cmm6mtjhc00cw1klqkvlrc1qu	JE-000044	2026-02-27 00:00:00	Invoice INV-039	INVOICE	cmm6mtjg800ck1klq2tjwvvq4	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:05:48.384	2026-02-28 18:05:48.384	\N	\N
cmm6mvsre00df1klqcy2yxa24	JE-000045	2026-02-27 00:00:00	Invoice INV-040	INVOICE	cmm6mvsqa00d31klqpyyztysa	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:07:33.722	2026-02-28 18:07:33.722	\N	\N
cmm6n1oy900e11klq104bn873	JE-000046	2026-02-27 00:00:00	Invoice INV-041	INVOICE	cmm6n1ox100dp1klqwofjz9nl	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:12:08.722	2026-02-28 18:12:08.722	\N	\N
cmm6nj47n00en1klqmo0p4dwi	JE-000047	2026-02-28 00:00:00	Bill 1	BILL	cmm6nj44n00ed1klqdm4z3naf	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:25:41.651	2026-02-28 18:25:41.651	\N	\N
cmmwjd42a000g23rfbmbpcze4	JE-000078	2026-03-18 21:11:03.586	Payment PAY-031	PAYMENT	cmmwjd40e000423rf3j1x8gi2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-18 21:11:03.634	2026-03-18 21:11:03.634	\N	\N
cmmwjdqnd000y23rf369a9xmq	JE-000079	2026-03-18 21:11:32.86	Payment PAY-032	PAYMENT	cmmwjdqly000m23rfhqlo9nw8	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-18 21:11:32.905	2026-03-18 21:11:32.905	\N	\N
cmmwje2b8001g23rfmw3i4gle	JE-000080	2026-03-18 21:11:47.976	Payment PAY-033	PAYMENT	cmmwje29v001423rf0jxrbew5	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-18 21:11:48.021	2026-03-18 21:11:48.021	\N	\N
cmm6o3sui000d8nod9c1zg6ff	JE-000048	2026-02-28 18:41:46.652	Supplier payment SPAY-001	SUPPLIER_PAYMENT	cmm6o3st700028nodwk3gwk7c	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 18:41:46.699	2026-02-28 18:41:46.699	\N	\N
cmm6vbnjh00dwtwnagurzi7u7	JE-000049	2026-02-28 22:03:50.318	Payment PAY-006	PAYMENT	cmm6vbnfn00dltwnajm5k7tlk	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-02-28 22:03:50.381	2026-02-28 22:03:50.381	\N	\N
cmmaergad002dkgp447ykk2ba	JE-000050	2026-03-03 09:31:12.608	Invoice INV-042	INVOICE	cmmaerbl20020kgp46yapihs9	POSTED	\N	\N	cmmael1y10005kgp4vea5fi0c	2026-03-03 09:31:18.709	2026-03-03 09:31:18.709	\N	\N
cmmaeu6k1002wkgp4jsh1ov2s	JE-000051	2026-03-03 00:00:00	Invoice INV-043	INVOICE	cmmaeu6iz002kkgp40387fpce	POSTED	\N	\N	cmmael1y10005kgp4vea5fi0c	2026-03-03 09:33:26.066	2026-03-03 09:33:26.066	\N	\N
cmmfdqtf500ukhwgv6ytruiiq	JE-000052	2026-03-06 00:00:00	Invoice INV-044	INVOICE	cmmfdqtbg00u8hwgv3u8kb8su	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:01:40.337	2026-03-06 21:01:40.337	\N	\N
cmmfdycp200v4hwgvmt4e6w55	JE-000053	2026-03-04 00:00:00	Invoice INV-045	INVOICE	cmmfdycnu00ushwgvl4d5twun	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:07:31.911	2026-03-06 21:07:31.911	\N	\N
cmmfe3t3400vmhwgvccblnrn7	JE-000054	2026-03-06 21:11:46.397	Payment PAY-007	PAYMENT	cmmfe3t1q00vbhwgvh2zylz7d	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:11:46.433	2026-03-06 21:11:46.433	\N	\N
cmmfe7de900w3hwgvvr6srro8	JE-000055	2026-03-06 21:14:32.687	Payment PAY-008	PAYMENT	cmmfe7dd200vshwgvdp5x0iey	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:14:32.721	2026-03-06 21:14:32.721	\N	\N
cmmfecdh200wlhwgvf3n3f85j	JE-000056	2026-03-06 21:18:26.07	Payment PAY-009	PAYMENT	cmmfecdfy00wahwgvjjkqwmy3	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:18:26.102	2026-03-06 21:18:26.102	\N	\N
cmmfecwtm00x2hwgv8u0x6g7j	JE-000057	2026-03-06 21:18:51.144	Payment PAY-010	PAYMENT	cmmfecwsd00wrhwgvp2vj8gai	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:18:51.178	2026-03-06 21:18:51.178	\N	\N
cmmfedgei00xjhwgv16six1jh	JE-000058	2026-03-06 21:19:16.521	Payment PAY-011	PAYMENT	cmmfedgdd00x8hwgvaosw7phe	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:19:16.555	2026-03-06 21:19:16.555	\N	\N
cmmfedw8100y0hwgvdnwd11w2	JE-000059	2026-03-06 21:19:37.024	Payment PAY-012	PAYMENT	cmmfedw6r00xphwgvszfgz9xp	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:19:37.057	2026-03-06 21:19:37.057	\N	\N
cmmfeec6600yhhwgvfaxcx4tz	JE-000060	2026-03-06 21:19:57.69	Payment PAY-013	PAYMENT	cmmfeec4y00y6hwgv1wa9m2v2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:19:57.726	2026-03-06 21:19:57.726	\N	\N
cmmfeeqzt00yzhwgvvp0n1wh7	JE-000061	2026-03-06 21:20:16.914	Payment PAY-014	PAYMENT	cmmfeeqz300yohwgvou7tqdz1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:20:16.937	2026-03-06 21:20:16.937	\N	\N
cmmfeg51i00zghwgvr2l6k5us	JE-000062	2026-03-06 21:21:21.765	Payment PAY-015	PAYMENT	cmmfeg50g00z5hwgvfmcvv66b	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:21:21.798	2026-03-06 21:21:21.798	\N	\N
cmmfeglok00zxhwgv8x5jw3il	JE-000063	2026-03-06 21:21:43.334	Payment PAY-016	PAYMENT	cmmfeglnf00zmhwgvn3wudmi2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:21:43.364	2026-03-06 21:21:43.364	\N	\N
cmmfeh3kc010ehwgvdaxp4hbh	JE-000064	2026-03-06 21:22:06.514	Payment PAY-017	PAYMENT	cmmfeh3jj0103hwgv4rk08h07	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-06 21:22:06.54	2026-03-06 21:22:06.54	\N	\N
cmmiv6z210020kem8pacoynxd	JE-000065	2026-03-09 07:33:26.094	Payment PAY-018	PAYMENT	cmmiv6yzi001pkem8g94r9sqj	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:33:26.138	2026-03-09 07:33:26.138	\N	\N
cmmiv8krb002hkem8fkyhnw1o	JE-000066	2026-03-09 07:34:40.891	Payment PAY-019	PAYMENT	cmmiv8kqe0026kem8e2pd2d4n	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:34:40.919	2026-03-09 07:34:40.919	\N	\N
cmmiv939d002zkem81mgc4v41	JE-000067	2026-03-09 07:35:04.867	Payment PAY-020	PAYMENT	cmmiv938d002okem88f9iq81c	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:35:04.898	2026-03-09 07:35:04.898	\N	\N
cmmiv9h05003gkem8iuog6x6l	JE-000068	2026-03-09 07:35:22.679	Payment PAY-021	PAYMENT	cmmiv9gz60035kem89g7vv76m	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:35:22.709	2026-03-09 07:35:22.709	\N	\N
cmmiv9u8g003xkem8ktp4k2pd	JE-000069	2026-03-09 07:35:39.829	Payment PAY-022	PAYMENT	cmmiv9u7j003mkem88l4ah9ll	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:35:39.857	2026-03-09 07:35:39.857	\N	\N
cmmivaf0p004ekem897cm0jfw	JE-000070	2026-03-09 07:36:06.767	Payment PAY-023	PAYMENT	cmmivaezt0043kem8bors666t	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:36:06.793	2026-03-09 07:36:06.793	\N	\N
cmmivayoh004vkem8kmawil9i	JE-000071	2026-03-09 07:36:32.251	Payment PAY-024	PAYMENT	cmmivaynr004kkem8xpxc2ay4	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:36:32.274	2026-03-09 07:36:32.274	\N	\N
cmmivblqf005ckem8copys2ra	JE-000072	2026-03-09 07:37:02.128	Payment PAY-025	PAYMENT	cmmivblpo0051kem8pq03ovtd	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:37:02.152	2026-03-09 07:37:02.152	\N	\N
cmmivc2sp005tkem8f5jj1ddx	JE-000073	2026-03-09 07:37:24.242	Payment PAY-026	PAYMENT	cmmivc2ry005ikem8tsf9i57d	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:37:24.265	2026-03-09 07:37:24.265	\N	\N
cmmivcn0u006akem85di11qfe	JE-000074	2026-03-09 07:37:50.448	Payment PAY-027	PAYMENT	cmmivcmzw005zkem8o3bkvb28	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:37:50.478	2026-03-09 07:37:50.478	\N	\N
cmmjmk3rq00608moikx3xt9tj	JE-000075	2026-03-09 20:19:28.33	Payment PAY-028	PAYMENT	cmmjmk3nd005o8moimp8fzq1h	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 20:19:28.406	2026-03-09 20:19:28.406	\N	\N
cmmjmnnw3006j8moictf8cxtc	JE-000076	2026-03-09 20:22:14.42	Payment PAY-029	PAYMENT	cmmjmnnv100678moivckbrch1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 20:22:14.451	2026-03-09 20:22:14.451	\N	\N
cmmjmqgcf000exm2pvzy17iuo	JE-000077	2026-03-09 20:24:24.589	Payment PAY-030	PAYMENT	cmmjmqgad0002xm2pqbfe3z4c	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 20:24:24.64	2026-03-09 20:24:24.64	\N	\N
cmmwjerou001y23rf8bz63xvh	JE-000081	2026-03-18 21:12:20.873	Payment PAY-034	PAYMENT	cmmwjernm001m23rfxrgnzty1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-18 21:12:20.91	2026-03-18 21:12:20.91	\N	\N
cmmwjfc0i002g23rfvos7y0h2	JE-000082	2026-03-18 00:00:00	Payment CR-001	PAYMENT	cmmwjfbzf002423rff1h46ptz	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-18 21:12:47.25	2026-03-18 21:12:47.25	\N	\N
cmmxezajf01g1ccosi40z1k92	JE-000083	2026-03-17 00:00:00	Invoice INV-046	INVOICE	cmmxezaf501foccosseep05jt	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 11:56:06.555	2026-03-19 11:56:06.555	\N	\N
cmmxf1pgw01gkccos9a48w8lc	JE-000084	2026-03-16 00:00:00	Invoice INV-047	INVOICE	cmmxf1pel01g7ccosq3diypp8	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 11:57:59.216	2026-03-19 11:57:59.216	\N	\N
cmmxgp1f801knccosncgjl14j	JE-000085	2026-03-14 00:00:00	Invoice INV-048	INVOICE	cmmxgp1al01k9ccos546ajwxb	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 12:44:07.412	2026-03-19 12:44:07.412	\N	\N
cmmxgqv2201lcccos1effdqsw	JE-000086	2026-03-19 12:45:32.449	Payment PAY-035	PAYMENT	cmmxgqv0a01l0ccos7xcz4ahn	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 12:45:32.474	2026-03-19 12:45:32.474	\N	\N
cmmxgrdnz01luccos2zckudc3	JE-000087	2026-03-19 12:45:56.566	Payment PAY-036	PAYMENT	cmmxgrdn301liccosuazllx95	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 12:45:56.592	2026-03-19 12:45:56.592	\N	\N
cmmxgt6b501mdccosgm0upgff	JE-000088	2026-02-25 00:00:00	Invoice INV-049	INVOICE	cmmxgt6a601m0ccosdah4sodh	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-03-19 12:47:20.369	2026-03-19 12:47:20.369	\N	\N
cmnhq22j0008vil5g4j3bawt1	JE-000089	2026-04-02 17:00:00.047	Invoice INV-050	INVOICE	cmnhq014a0002il5g8x6qzmpb	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:01:35.436	2026-04-02 17:01:35.436	\N	\N
cmnhq27ae009ail5gwajihmdz	JE-000090	2026-04-02 17:00:00.047	Invoice INV-051	INVOICE	cmnhq01870008il5g9f0gk02x	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:01:41.607	2026-04-02 17:01:41.607	\N	\N
cmnhq2z4b009pil5gp9e1i0qu	JE-000091	2026-04-02 17:00:00.047	Invoice INV-053	INVOICE	cmnhq01ab000mil5ggf2upb40	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:17.676	2026-04-02 17:02:17.676	\N	\N
cmnhq35v400a4il5gdpv2evxh	JE-000092	2026-04-02 17:00:00.047	Invoice INV-054	INVOICE	cmnhq01at000sil5g0n21nkd2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:26.416	2026-04-02 17:02:26.416	\N	\N
cmnhq38e600ajil5gdnn9s43b	JE-000093	2026-04-02 17:00:00.047	Invoice INV-055	INVOICE	cmnhq01bm0010il5g699bq3wh	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:29.694	2026-04-02 17:02:29.694	\N	\N
cmnhq3az100ayil5gb2kmnuhf	JE-000094	2026-04-02 17:00:00.047	Invoice INV-056	INVOICE	cmnhq01c10016il5gdspjhxm4	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:33.037	2026-04-02 17:02:33.037	\N	\N
cmnhq3d7g00bdil5gtmydevmg	JE-000095	2026-04-02 17:00:00.047	Invoice INV-057	INVOICE	cmnhq01cd001cil5g1m8u2g2v	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:35.932	2026-04-02 17:02:35.932	\N	\N
cmnhq3gj500bsil5g8m93lymh	JE-000096	2026-04-02 17:00:00.047	Invoice INV-058	INVOICE	cmnhq01co001iil5gn7ozjtd4	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:40.241	2026-04-02 17:02:40.241	\N	\N
cmnhq3j1m00c7il5gw5yu9f75	JE-000097	2026-04-02 17:00:00.047	Invoice INV-059	INVOICE	cmnhq01en001pil5gi1vc6sfj	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:43.498	2026-04-02 17:02:43.498	\N	\N
cmnhq3lcm00cmil5gy1jqpxd8	JE-000098	2026-04-02 17:00:00.047	Invoice INV-060	INVOICE	cmnhq01ey001vil5gwx5dp4ad	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:46.487	2026-04-02 17:02:46.487	\N	\N
cmnhq3orm00d1il5gy8u87wsi	JE-000099	2026-04-02 17:00:00.047	Invoice INV-061	INVOICE	cmnhq01fe0021il5gu4slheky	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:50.914	2026-04-02 17:02:50.914	\N	\N
cmnhq3rat00dgil5gaerdw7mo	JE-000100	2026-04-02 17:00:00.047	Invoice INV-062	INVOICE	cmnhq01fs0027il5gnd8o0rz7	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:02:54.197	2026-04-02 17:02:54.197	\N	\N
cmnhq47dn00dvil5gfdx819t2	JE-000101	2026-04-02 17:00:00.047	Invoice INV-064	INVOICE	cmnhq01gi002jil5gllim8wr2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:15.035	2026-04-02 17:03:15.035	\N	\N
cmnhq4cjy00eail5g8fhorfxd	JE-000102	2026-04-02 17:00:00.047	Invoice INV-065	INVOICE	cmnhq01gt002pil5gddd7qcmo	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:21.742	2026-04-02 17:03:21.742	\N	\N
cmnhq4gom00f4il5g3i19fyri	JE-000104	2026-04-02 17:00:00.047	Invoice INV-067	INVOICE	cmnhq01hl0031il5gggsgcp9n	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:27.094	2026-04-02 17:03:27.094	\N	\N
cmnhq4kxh00fyil5g4h9nt2ba	JE-000106	2026-04-02 17:00:00.047	Invoice INV-069	INVOICE	cmnhq01if003fil5g0jdvy4l2	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:32.598	2026-04-02 17:03:32.598	\N	\N
cmnhq54as00gsil5gpz1ig1mt	JE-000108	2026-04-02 17:00:00.047	Invoice INV-071	INVOICE	cmnhq01j3003ril5giatnc40g	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:57.7	2026-04-02 17:03:57.7	\N	\N
cmnhq4ec500epil5gptgjfi3q	JE-000103	2026-04-02 17:00:00.047	Invoice INV-066	INVOICE	cmnhq01h7002vil5g6hon7p0k	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:24.053	2026-04-02 17:03:24.053	\N	\N
cmnhq4ihv00fjil5g0n5wpcw3	JE-000105	2026-04-02 17:00:00.047	Invoice INV-068	INVOICE	cmnhq01i10039il5ga38l4cst	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:29.444	2026-04-02 17:03:29.444	\N	\N
cmnhq4n8e00gdil5gxf2wbw3z	JE-000107	2026-04-02 17:00:00.047	Invoice INV-070	INVOICE	cmnhq01io003lil5gxnh50ht7	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:03:35.583	2026-04-02 17:03:35.583	\N	\N
cmnhq564b00h7il5gwaa7sqqv	JE-000109	2026-04-02 17:00:00.047	Invoice INV-072	INVOICE	cmnhq01jf003xil5g4gjodk7r	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:00.059	2026-04-02 17:04:00.059	\N	\N
cmnhq5aiw00hmil5g0v8s4gaw	JE-000110	2026-04-02 17:00:00.047	Invoice INV-074	INVOICE	cmnhq01k10049il5gamnrycij	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:05.768	2026-04-02 17:04:05.768	\N	\N
cmnhq5crw00i1il5gvyzq38yx	JE-000111	2026-04-02 17:00:00.047	Invoice INV-075	INVOICE	cmnhq01ke004fil5gsqlatwhb	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:08.684	2026-04-02 17:04:08.684	\N	\N
cmnhq5f2000igil5g2n2rh62p	JE-000112	2026-04-02 17:00:00.047	Invoice INV-076	INVOICE	cmnhq01kp004lil5gkguig1dn	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:11.64	2026-04-02 17:04:11.64	\N	\N
cmnhq5uua00iyil5gjpompm8l	JE-000113	2026-04-02 00:00:00	Invoice INV-077	INVOICE	cmnhq01l0004ril5ggwi170gk	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:32.098	2026-04-02 17:04:32.098	\N	\N
cmnhq5wqk00jdil5g2v0z4kq6	JE-000114	2026-04-02 17:00:00.047	Invoice INV-078	INVOICE	cmnhq01ld004xil5g6g4m0ds0	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:34.556	2026-04-02 17:04:34.556	\N	\N
cmnhq5z1r00jsil5gd9f6rwuy	JE-000115	2026-04-02 17:00:00.047	Invoice INV-079	INVOICE	cmnhq01md0055il5g8evc6smq	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:37.551	2026-04-02 17:04:37.551	\N	\N
cmnhq60va00k7il5gl50o2g6h	JE-000116	2026-04-02 17:00:00.047	Invoice INV-080	INVOICE	cmnhq01n3005bil5gor68ssc5	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:39.91	2026-04-02 17:04:39.91	\N	\N
cmnhq639w00kmil5gg77jmx44	JE-000117	2026-04-02 17:00:00.047	Invoice INV-081	INVOICE	cmnhq01nm005jil5gshu2o4rf	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:43.029	2026-04-02 17:04:43.029	\N	\N
cmnhq65ys00l1il5gt3jnql3f	JE-000118	2026-04-02 17:00:00.047	Invoice INV-082	INVOICE	cmnhq01pl005zil5gk3fovhc8	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 17:04:46.517	2026-04-02 17:04:46.517	\N	\N
cmnhsnuy800luil5guu911463	JE-000119	2026-04-02 17:00:00.047	Invoice INV-084	INVOICE	cmnhq01qi006nil5g2f0e69j1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:31.28	2026-04-02 18:14:31.28	\N	\N
cmnhsnxcr00m9il5gwz4xzzv3	JE-000120	2026-04-02 17:00:00.047	Invoice INV-085	INVOICE	cmnhq01r00073il5g3dqgocst	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:34.396	2026-04-02 18:14:34.396	\N	\N
cmnhsnz3x00moil5gljo6nakr	JE-000121	2026-04-02 17:00:00.047	Invoice INV-086	INVOICE	cmnhq01rg007jil5gwlqndpz8	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:36.669	2026-04-02 18:14:36.669	\N	\N
cmnhso1f100n3il5gpnzlg6ot	JE-000122	2026-04-02 17:00:00.047	Invoice INV-087	INVOICE	cmnhq01ru007xil5gxpxlxc4a	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:39.661	2026-04-02 18:14:39.661	\N	\N
cmnhso34w00niil5gufo0kpiq	JE-000123	2026-04-02 17:00:00.047	Invoice INV-088	INVOICE	cmnhq01s80089il5guiuv4e6d	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:41.888	2026-04-02 18:14:41.888	\N	\N
cmnhso5kh00nxil5gkcg6k1sn	JE-000124	2026-04-02 17:00:00.047	Invoice INV-089	INVOICE	cmnhq01sk008fil5g02c48kal	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:14:45.042	2026-04-02 18:14:45.042	\N	\N
cmnhsqhjk00ogil5g68l9s7dl	JE-000125	2026-04-02 18:16:33.843	Payment PAY-037	PAYMENT	cmnhsqhi200o4il5g8zlws1eq	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:16:33.872	2026-04-02 18:16:33.872	\N	\N
cmnhsqwb200oyil5giwymytn5	JE-000126	2026-04-02 18:16:52.978	Payment PAY-038	PAYMENT	cmnhsqwa400omil5gp706cm82	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:16:53.006	2026-04-02 18:16:53.006	\N	\N
cmnhsslrj00phil5grmrzg0f8	JE-000127	2026-04-02 18:18:12.622	Payment PAY-039	PAYMENT	cmnhsslqj00p4il5gs4951e8l	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:18:12.656	2026-04-02 18:18:12.656	\N	\N
cmnhstdvn00pxil5g10wt9awj	JE-000128	2026-04-02 17:00:00.047	Invoice INV-052	INVOICE	cmnhq019c000eil5gfozc4a8r	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:18:49.091	2026-04-02 18:18:49.091	\N	\N
cmnhstmc800qfil5gj66rwc60	JE-000129	2026-04-02 18:19:00.025	Payment PAY-040	PAYMENT	cmnhstmbf00q3il5g65d5ao86	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:19:00.056	2026-04-02 18:19:00.056	\N	\N
cmnhstyko00qxil5g6q608gel	JE-000130	2026-04-02 18:19:15.877	Payment PAY-041	PAYMENT	cmnhstyju00qlil5g9f6f3r7g	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:19:15.912	2026-04-02 18:19:15.912	\N	\N
cmnhsuhvv00rfil5g5yrfduxu	JE-000131	2026-04-02 00:00:00	Payment CR-002	PAYMENT	cmnhsuhv300r3il5gq795293a	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:19:40.94	2026-04-02 18:19:40.94	\N	\N
cmnhsv29200ryil5gu0gn1r8y	JE-000132	2026-04-02 18:20:07.302	Payment PAY-042	PAYMENT	cmnhsv28300rmil5gu9l8ys8e	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:20:07.334	2026-04-02 18:20:07.334	\N	\N
cmnhsvdh900sgil5gfpjo3kpg	JE-000133	2026-04-02 18:20:21.856	Payment PAY-043	PAYMENT	cmnhsvdge00s4il5ghtapvnw1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:20:21.885	2026-04-02 18:20:21.885	\N	\N
cmnhsvp5600syil5gq0nfsf5o	JE-000134	2026-04-02 18:20:36.97	Payment PAY-044	PAYMENT	cmnhsvp4800smil5g6fzmaau5	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:20:37.002	2026-04-02 18:20:37.002	\N	\N
cmnhsw3zf00tgil5g4rwhne3g	JE-000135	2026-04-02 18:20:56.209	Payment PAY-045	PAYMENT	cmnhsw3yo00t4il5gseiq6v1r	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:20:56.236	2026-04-02 18:20:56.236	\N	\N
cmnhsx6tb00tzil5gtwr0nkm8	JE-000136	2026-04-02 18:21:46.534	Payment PAY-046	PAYMENT	cmnhsx6sh00tnil5gzhjujasd	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:21:46.559	2026-04-02 18:21:46.559	\N	\N
cmnhsxk8y00uhil5gziiu62r9	JE-000137	2026-04-02 18:22:03.943	Payment PAY-047	PAYMENT	cmnhsxk8400u5il5gxwenmy0x	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:22:03.97	2026-04-02 18:22:03.97	\N	\N
cmnhsxttx00uzil5g4v8rvrdu	JE-000138	2026-04-02 18:22:16.362	Payment PAY-048	PAYMENT	cmnhsxtt200unil5gyg9zq2xb	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:22:16.39	2026-04-02 18:22:16.39	\N	\N
cmnhsy51v00vhil5g1g58kzvl	JE-000139	2026-04-02 18:22:30.905	Payment PAY-049	PAYMENT	cmnhsy51200v5il5gjotq80n0	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:22:30.932	2026-04-02 18:22:30.932	\N	\N
cmnhsyekk00vzil5g65f8pldp	JE-000140	2026-04-02 18:22:43.24	Payment PAY-050	PAYMENT	cmnhsyejo00vnil5gc09dpebc	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:22:43.268	2026-04-02 18:22:43.268	\N	\N
cmnhsyp4g00whil5g1ppbjdbv	JE-000141	2026-04-02 18:22:56.919	Payment PAY-051	PAYMENT	cmnhsyp3o00w5il5gc2umr9j1	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:22:56.944	2026-04-02 18:22:56.944	\N	\N
cmnhsz20u00wzil5gmk9a54ao	JE-000142	2026-04-02 18:23:13.635	Payment PAY-052	PAYMENT	cmnhsz1zu00wnil5g33kjk87b	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:23:13.663	2026-04-02 18:23:13.663	\N	\N
cmnhszzd300xeil5gyd4dcjbm	JE-000143	2026-04-02 17:00:00.047	Invoice INV-083	INVOICE	cmnhq01q20069il5gsrm6b0pc	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:23:56.871	2026-04-02 18:23:56.871	\N	\N
cmnht1rmr00xxil5gsp2evccg	JE-000144	2026-04-02 00:00:00	Payment CR-003	PAYMENT	cmnht1rlm00xlil5gnzlikxif	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:25:20.163	2026-04-02 18:25:20.163	\N	\N
cmnht226800yfil5gsi9mqix5	JE-000145	2026-04-02 18:25:33.798	Payment PAY-053	PAYMENT	cmnht225f00y3il5gwuofdx6j	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:25:33.824	2026-04-02 18:25:33.824	\N	\N
cmnht2d2b00yxil5gua2jyyuc	JE-000146	2026-04-02 18:25:47.913	Payment PAY-054	PAYMENT	cmnht2d1i00ylil5gb0chp3hp	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:25:47.94	2026-04-02 18:25:47.94	\N	\N
cmnhtcra70112il5gnt2jf9dy	JE-000147	2026-04-02 18:33:52.899	Payment PAY-055	PAYMENT	cmnhtcr98010qil5gdrcwpsfj	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:33:52.927	2026-04-02 18:33:52.927	\N	\N
cmnhtdds2011kil5gom99eq2t	JE-000148	2026-04-02 18:34:22.047	Payment PAY-056	PAYMENT	cmnhtddr20118il5g4do3k4pd	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:34:22.082	2026-04-02 18:34:22.082	\N	\N
cmnhtdq3b0122il5gi73k9asp	JE-000149	2026-04-02 18:34:38.002	Payment PAY-057	PAYMENT	cmnhtdq2c011qil5g7na8jvvy	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:34:38.039	2026-04-02 18:34:38.039	\N	\N
cmnhtm9bu012oil5g29i8lr4u	JE-000150	2026-03-20 00:00:00	Invoice INV-090	INVOICE	cmnhtm90y012bil5gl3exhy1n	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:41:16.219	2026-04-02 18:41:16.219	\N	\N
cmnhu1hld013eil5glnk2kf4k	JE-000151	2026-04-02 00:00:00	Payment CR-004	PAYMENT	cmnhu1hk90132il5gx4bjhlw6	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:53:06.769	2026-04-02 18:53:06.769	\N	\N
cmnhu2vka013wil5gxjn1z21w	JE-000152	2026-04-02 18:54:11.499	Payment PAY-058	PAYMENT	cmnhu2vj4013kil5gz2680p2f	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:54:11.53	2026-04-02 18:54:11.53	\N	\N
cmnhu48u7014fil5g79zdwbok	JE-000153	2026-04-02 00:00:00	Payment CR-005	PAYMENT	cmnhu48tg0143il5gdhy04501	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:55:15.391	2026-04-02 18:55:15.391	\N	\N
cmnhu5bu3014wil5glx8dxjs9	JE-000154	2026-04-02 00:00:00	Loan repayment from Tenda Fuma	LOAN_REPAYMENT	cmnhu5bsy014lil5gklmxm48e	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:56:05.931	2026-04-02 18:56:05.931	\N	\N
cmnhu5tdg015dil5gnj7ydwgd	JE-000155	2026-04-02 00:00:00	Loan repayment from Tenda Fuma	LOAN_REPAYMENT	cmnhu5tco0152il5g0mk63cbj	POSTED	\N	\N	cmm47pax500048s6ob25tkito	2026-04-02 18:56:28.66	2026-04-02 18:56:28.66	\N	\N
\.


--
-- TOC entry 5909 (class 0 OID 204452)
-- Dependencies: 256
-- Data for Name: journal_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_lines (id, "entryId", "accountId", debit, credit, memo, "createdAt", "foreignAmount", "foreignCurrencyCode") FROM stdin;
cmm484zck000j945qidgy5tnz	cmm484zck000h945qaml29rrg	cmm484zc3000a945qis85ta2o	6245.57	0.00	\N	2026-02-27 01:39:15.572	\N	\N
cmm484zck000k945q90gv2hqm	cmm484zck000h945qaml29rrg	cmm484zc8000d945ql844ex30	0.00	6245.57	\N	2026-02-27 01:39:15.572	\N	\N
cmm49248o000itrwpaz2qd34n	cmm49248n000gtrwpz1rip4j5	cmm484zc3000a945qis85ta2o	450.00	0.00	\N	2026-02-27 02:05:01.56	\N	\N
cmm49248o000jtrwp0z6iytxt	cmm49248n000gtrwpz1rip4j5	cmm484zc8000d945ql844ex30	0.00	450.00	\N	2026-02-27 02:05:01.56	\N	\N
cmm4zkaxs013s1vs3igs6c88p	cmm4zkaxs013q1vs3bis8us2q	cmm484zc3000a945qis85ta2o	600.00	0.00	\N	2026-02-27 14:27:00.063	\N	\N
cmm4zkaxs013t1vs38acy6rd2	cmm4zkaxs013q1vs3bis8us2q	cmm484zc8000d945ql844ex30	0.00	600.00	\N	2026-02-27 14:27:00.063	\N	\N
cmm548jk60029s8x6u3eg0r8k	cmm548jk60027s8x6726531zw	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 16:37:49.446	\N	\N
cmm548jk6002as8x6lm9jsdae	cmm548jk60027s8x6726531zw	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 16:37:49.446	\N	\N
cmm54dqwi002rs8x6t0gmrjgx	cmm54dqwi002ps8x6wq1gzmud	cmm484zbn0008945qm5gzgk16	270.00	0.00	\N	2026-02-27 16:41:52.242	\N	\N
cmm54dqwi002ss8x68wxu5916	cmm54dqwi002ps8x6wq1gzmud	cmm484zc3000a945qis85ta2o	0.00	270.00	\N	2026-02-27 16:41:52.242	\N	\N
cmm54hdae003as8x6kyjud8up	cmm54hdae0038s8x6u12tkmfs	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 16:44:41.222	\N	\N
cmm54hdae003bs8x6g7iiqg5w	cmm54hdae0038s8x6u12tkmfs	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 16:44:41.222	\N	\N
cmm54ku1e003us8x6hy0itjs2	cmm54ku1d003ss8x6etbmrlfa	cmm484zc3000a945qis85ta2o	300.00	0.00	\N	2026-02-27 16:47:22.898	\N	\N
cmm54ku1e003vs8x6fyo7vhvm	cmm54ku1d003ss8x6etbmrlfa	cmm484zc8000d945ql844ex30	0.00	300.00	\N	2026-02-27 16:47:22.898	\N	\N
cmm54qdd7004es8x6o58m2zhl	cmm54qdd7004cs8x6oa60pgc4	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-02-27 16:51:41.227	\N	\N
cmm54qdd7004fs8x60py0ecqa	cmm54qdd7004cs8x6oa60pgc4	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-02-27 16:51:41.227	\N	\N
cmm54smhn004vs8x60dy17dok	cmm54smhn004ts8x65hmhtiou	cmm484zbn0008945qm5gzgk16	460.00	0.00	\N	2026-02-27 16:53:26.363	\N	\N
cmm54smhn004ws8x60394hflk	cmm54smhn004ts8x65hmhtiou	cmm484zc3000a945qis85ta2o	0.00	460.00	\N	2026-02-27 16:53:26.363	\N	\N
cmm5521sk0072s8x6yz08mf3r	cmm5521sk0070s8x6aw8ouv9a	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:00:46.1	\N	\N
cmm5521sk0073s8x6lpx8vseq	cmm5521sk0070s8x6aw8ouv9a	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:00:46.1	\N	\N
cmm5555ub007ms8x6lpy8uwkg	cmm5555ub007ks8x6r98ibxni	cmm484zc3000a945qis85ta2o	600.00	0.00	\N	2026-02-27 17:03:11.315	\N	\N
cmm5555ub007ns8x6lgl6h52y	cmm5555ub007ks8x6r98ibxni	cmm484zc8000d945ql844ex30	0.00	600.00	\N	2026-02-27 17:03:11.315	\N	\N
cmm557cvj0085s8x6vg4fzd2r	cmm557cvj0083s8x6bc1iv3yh	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:04:53.743	\N	\N
cmm557cvj0086s8x6madeqe1x	cmm557cvj0083s8x6bc1iv3yh	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:04:53.743	\N	\N
cmm55absq008ss8x6gcsjswbv	cmm55absq008qs8x6u093kfez	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:07:12.314	\N	\N
cmm55absq008ts8x61iezx3x0	cmm55absq008qs8x6u093kfez	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:07:12.314	\N	\N
cmm55f9ny009ds8x6pu1q8km5	cmm55f9ny009bs8x6b7b0y6fm	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:11:02.83	\N	\N
cmm55f9ny009es8x6ggfc7wqr	cmm55f9ny009bs8x6b7b0y6fm	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:11:02.83	\N	\N
cmm55jlso009ws8x65pjx6e9k	cmm55jlso009us8x6cbwa9gek	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:14:25.177	\N	\N
cmm55jlsp009xs8x6kgkyu9y9	cmm55jlso009us8x6cbwa9gek	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:14:25.177	\N	\N
cmm55ocv800ajs8x6e5hnor4e	cmm55ocv800ahs8x6unb7aqac	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:18:06.884	\N	\N
cmm55ocv800aks8x6wzhqgkcz	cmm55ocv800ahs8x6unb7aqac	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:18:06.884	\N	\N
cmm55rgw400b3s8x6n6hqhkfs	cmm55rgw400b1s8x6t2r22mxy	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:20:32.069	\N	\N
cmm55rgw500b4s8x6hu2ynyrn	cmm55rgw400b1s8x6t2r22mxy	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:20:32.069	\N	\N
cmm55uyza00bms8x6txtrthzm	cmm55uyza00bks8x6bd2v5sun	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-02-27 17:23:15.479	\N	\N
cmm55uyza00bns8x6p40a69dc	cmm55uyza00bks8x6bd2v5sun	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-02-27 17:23:15.479	\N	\N
cmm55x5zb00c5s8x6r0op5qzf	cmm55x5zb00c3s8x6yhbidzgw	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-27 17:24:57.863	\N	\N
cmm55x5zb00c6s8x6xrs5p4vz	cmm55x5zb00c3s8x6yhbidzgw	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-27 17:24:57.863	\N	\N
cmm6f30ya000hzvp1st0zmih7	cmm6f30ya000fzvp1f7iwteof	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 14:29:14.002	\N	\N
cmm6f30ya000izvp16dh54e34	cmm6f30ya000fzvp1f7iwteof	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 14:29:14.002	\N	\N
cmm6f3t4k000yzvp1rahu1u7p	cmm6f3t4k000wzvp15vrbxl2c	cmm484zbn0008945qm5gzgk16	350.00	0.00	\N	2026-02-28 14:29:50.516	\N	\N
cmm6f3t4k000zzvp1a550e2q0	cmm6f3t4k000wzvp15vrbxl2c	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-02-28 14:29:50.516	\N	\N
cmm6fftsf000f2fmqa73gndx8	cmm6fftsf000d2fmqfjpjz7dj	cmm484zbn0008945qm5gzgk16	370.00	0.00	\N	2026-02-28 14:39:11.247	\N	\N
cmm6fftsf000g2fmq4po9szm6	cmm6fftsf000d2fmqfjpjz7dj	cmm484zc3000a945qis85ta2o	0.00	370.00	\N	2026-02-28 14:39:11.247	\N	\N
cmm6fq7da000n1klqmh7x94no	cmm6fq7da000l1klq85ojx81z	cmm484zbn0008945qm5gzgk16	6695.57	0.00	\N	2026-02-28 14:47:15.406	\N	\N
cmm6fq7da000o1klqfxs9yd2g	cmm6fq7da000l1klq85ojx81z	cmm484zc3000a945qis85ta2o	0.00	6695.57	\N	2026-02-28 14:47:15.406	\N	\N
cmm6fvdr300171klq62dn9m7l	cmm6fvdr300151klq7whg0p74	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 14:51:16.96	\N	\N
cmm6fvdr300181klq13cb651f	cmm6fvdr300151klq7whg0p74	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 14:51:16.96	\N	\N
cmm6fxasx001q1klqoqllcgip	cmm6fxasx001o1klqvlev7ozx	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 14:52:46.449	\N	\N
cmm6fxasx001r1klqxqhriw9a	cmm6fxasx001o1klqvlev7ozx	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 14:52:46.449	\N	\N
cmm6lhraz00341klqlrrzz05e	cmm6lhray00321klqf0ffivyb	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:28:39.035	\N	\N
cmm6lhraz00351klqkkz4om1e	cmm6lhray00321klqf0ffivyb	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:28:39.035	\N	\N
cmm6ljq9x003o1klqymb2q65o	cmm6ljq9x003m1klqs8uel32h	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:30:11.013	\N	\N
cmm6ljq9x003p1klqbchjmk5f	cmm6ljq9x003m1klqs8uel32h	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:30:11.013	\N	\N
cmm6lm11q00471klqn5wp54jr	cmm6lm11q00451klq2qavgnk2	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:31:58.286	\N	\N
cmm6lm11q00481klqb4kx1n8b	cmm6lm11q00451klq2qavgnk2	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:31:58.286	\N	\N
cmm6lqx31004s1klqxlbenvcf	cmm6lqx30004q1klqussgct95	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:35:46.429	\N	\N
cmm6lqx31004t1klqnx4ujs6h	cmm6lqx30004q1klqussgct95	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:35:46.429	\N	\N
cmm6lu807005b1klq9w0x51g4	cmm6lu80700591klqh05nfd7l	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:38:20.552	\N	\N
cmm6lu807005c1klqiepzi00n	cmm6lu80700591klqh05nfd7l	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:38:20.552	\N	\N
cmm6lw8cv005u1klq1wlrf3qp	cmm6lw8cv005s1klqlxllw4nh	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-02-28 17:39:54.319	\N	\N
cmm6lw8cv005v1klqa1z5jjo7	cmm6lw8cv005s1klqlxllw4nh	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-02-28 17:39:54.319	\N	\N
cmm6lyaz0006e1klqql3cbx3y	cmm6lyaz0006c1klqxzgzmgx8	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-02-28 17:41:31.021	\N	\N
cmm6lyaz0006f1klqs6ujohup	cmm6lyaz0006c1klqxzgzmgx8	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-02-28 17:41:31.021	\N	\N
cmm6m032o006x1klqjnr1ceeb	cmm6m032o006v1klq0nvbceqr	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-02-28 17:42:54.097	\N	\N
cmm6m032o006y1klqgi6aaqf8	cmm6m032o006v1klq0nvbceqr	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-02-28 17:42:54.097	\N	\N
cmm6m2we3007k1klqu02m6eha	cmm6m2we3007i1klqouvksxgl	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-02-28 17:45:05.404	\N	\N
cmm6m2we3007l1klqi2le9ahw	cmm6m2we3007i1klqouvksxgl	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-02-28 17:45:05.404	\N	\N
cmm6m4tih00831klqa08fmzti	cmm6m4tih00811klqthr3uzcr	cmm484zc3000a945qis85ta2o	230.00	0.00	\N	2026-02-28 17:46:34.986	\N	\N
cmm6m4tih00841klq4v053xav	cmm6m4tih00811klqthr3uzcr	cmm484zc8000d945ql844ex30	0.00	230.00	\N	2026-02-28 17:46:34.986	\N	\N
cmm6m86zc008m1klqo9zrzasb	cmm6m86zc008k1klqf9ij776t	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:49:12.408	\N	\N
cmm6m86zc008n1klq8rmglj4p	cmm6m86zc008k1klqf9ij776t	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:49:12.408	\N	\N
cmm6maz4b00961klqgdpqes34	cmm6maz4b00941klqf775dkvj	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:51:22.188	\N	\N
cmm6maz4c00971klq3me0r959	cmm6maz4b00941klqf775dkvj	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:51:22.188	\N	\N
cmm6mcqb5009p1klqjyq91gtv	cmm6mcqb5009n1klqqlhgdsfm	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:52:44.082	\N	\N
cmm6mcqb5009q1klqkgfgxnky	cmm6mcqb5009n1klqqlhgdsfm	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:52:44.082	\N	\N
cmm6mgxv800aa1klqh5r4s7n1	cmm6mgxv800a81klq4gcb31dm	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:56:00.5	\N	\N
cmm6mgxv800ab1klqe39xd30t	cmm6mgxv800a81klq4gcb31dm	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:56:00.5	\N	\N
cmm6mh8g400as1klqfpl6i49y	cmm6mh8g400aq1klq7y7k0gxb	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 17:56:14.212	\N	\N
cmm6mh8g400at1klqbi5yqde3	cmm6mh8g400aq1klq7y7k0gxb	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 17:56:14.212	\N	\N
cmm6mjspq00bb1klqoff82qdy	cmm6mjspq00b91klq7p5g1tgn	cmm484zc3000a945qis85ta2o	230.00	0.00	\N	2026-02-28 17:58:13.79	\N	\N
cmm6mjspq00bc1klqgjk8r50t	cmm6mjspq00b91klq7p5g1tgn	cmm484zc8000d945ql844ex30	0.00	230.00	\N	2026-02-28 17:58:13.79	\N	\N
cmm6mp6mc00bv1klqqs8zi3jq	cmm6mp6mb00bt1klqoz2vc1vb	cmm484zc3000a945qis85ta2o	300.00	0.00	\N	2026-02-28 18:02:25.092	\N	\N
cmm6mp6mc00bw1klqlys8m7ez	cmm6mp6mb00bt1klqoz2vc1vb	cmm484zc8000d945ql844ex30	0.00	300.00	\N	2026-02-28 18:02:25.092	\N	\N
cmm6mrrzt00ce1klqsxdjwy4i	cmm6mrrzt00cc1klqakrif1b5	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 18:04:26.105	\N	\N
cmm6mrrzt00cf1klqpr0xm9kn	cmm6mrrzt00cc1klqakrif1b5	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 18:04:26.105	\N	\N
cmm6mtjhc00cy1klqzy401kos	cmm6mtjhc00cw1klqkvlrc1qu	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 18:05:48.384	\N	\N
cmm6mtjhc00cz1klqw02q4xur	cmm6mtjhc00cw1klqkvlrc1qu	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 18:05:48.384	\N	\N
cmm6mvsre00dh1klq3q7497hq	cmm6mvsre00df1klqcy2yxa24	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-02-28 18:07:33.722	\N	\N
cmm6mvsre00di1klqk5jv8csb	cmm6mvsre00df1klqcy2yxa24	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-02-28 18:07:33.722	\N	\N
cmm6n1oy900e31klqaa5dd9ks	cmm6n1oy900e11klq104bn873	cmm484zc3000a945qis85ta2o	300.00	0.00	\N	2026-02-28 18:12:08.722	\N	\N
cmm6n1oy900e41klq17jm1czd	cmm6n1oy900e11klq104bn873	cmm484zc8000d945ql844ex30	0.00	300.00	\N	2026-02-28 18:12:08.722	\N	\N
cmm6nj47n00ep1klql603i5t5	cmm6nj47n00en1klqmo0p4dwi	cmm484zcd000f945q0ycl6wap	914.25	0.00	\N	2026-02-28 18:25:41.651	\N	\N
cmm6nj47n00eq1klqdwqw8spc	cmm6nj47n00en1klqmo0p4dwi	cmm484zc6000c945qmb23e1md	0.00	914.25	\N	2026-02-28 18:25:41.651	\N	\N
cmmwjd42a000i23rfu897fryf	cmmwjd42a000g23rfbmbpcze4	cmm484zbn0008945qm5gzgk16	500.00	0.00	\N	2026-03-18 21:11:03.634	\N	\N
cmmwjd42a000j23rf76d5z0za	cmmwjd42a000g23rfbmbpcze4	cmm484zc3000a945qis85ta2o	0.00	500.00	\N	2026-03-18 21:11:03.634	\N	\N
cmmwjerou002023rfhqc3jltq	cmmwjerou001y23rf8bz63xvh	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-18 21:12:20.91	\N	\N
cmmwjerou002123rfadtiolg9	cmmwjerou001y23rf8bz63xvh	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-18 21:12:20.91	\N	\N
cmmwjfc0i002i23rftqpodpbu	cmmwjfc0i002g23rfvos7y0h2	cmm484zc4000b945qgjk1jffh	350.00	0.00	\N	2026-03-18 21:12:47.25	\N	\N
cmmwjfc0i002j23rf7kybwjbi	cmmwjfc0i002g23rfvos7y0h2	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-03-18 21:12:47.25	\N	\N
cmm6o3sui000f8nodp3d3i82p	cmm6o3sui000d8nod9c1zg6ff	cmm484zc6000c945qmb23e1md	914.25	0.00	\N	2026-02-28 18:41:46.699	\N	\N
cmm6o3sui000g8nod12q4kq17	cmm6o3sui000d8nod9c1zg6ff	cmm484zbn0008945qm5gzgk16	0.00	914.25	\N	2026-02-28 18:41:46.699	\N	\N
cmm6vbnjh00dytwnajewz4ztt	cmm6vbnjh00dwtwnagurzi7u7	cmm484zbn0008945qm5gzgk16	370.00	0.00	\N	2026-02-28 22:03:50.381	\N	\N
cmm6vbnjh00dztwnac4yhj4rv	cmm6vbnjh00dwtwnagurzi7u7	cmm484zc3000a945qis85ta2o	0.00	370.00	\N	2026-02-28 22:03:50.381	\N	\N
cmmaergad002fkgp4xf020gxx	cmmaergad002dkgp447ykk2ba	cmm484zc3000a945qis85ta2o	580.00	0.00	\N	2026-03-03 09:31:18.709	\N	\N
cmmaergad002gkgp4z0iwis1l	cmmaergad002dkgp447ykk2ba	cmm484zc8000d945ql844ex30	0.00	580.00	\N	2026-03-03 09:31:18.709	\N	\N
cmmaeu6k1002ykgp4qkxr6ldg	cmmaeu6k1002wkgp4jsh1ov2s	cmm484zc3000a945qis85ta2o	500.00	0.00	\N	2026-03-03 09:33:26.066	\N	\N
cmmaeu6k1002zkgp4382ywyt0	cmmaeu6k1002wkgp4jsh1ov2s	cmm484zc8000d945ql844ex30	0.00	500.00	\N	2026-03-03 09:33:26.066	\N	\N
cmmfdqtf500umhwgvrcf5b40x	cmmfdqtf500ukhwgv6ytruiiq	cmm484zc3000a945qis85ta2o	1500.00	0.00	\N	2026-03-06 21:01:40.337	\N	\N
cmmfdqtf500unhwgvap5i7qca	cmmfdqtf500ukhwgv6ytruiiq	cmm484zc8000d945ql844ex30	0.00	1500.00	\N	2026-03-06 21:01:40.337	\N	\N
cmmfdycp300v6hwgv7tl609wh	cmmfdycp200v4hwgvmt4e6w55	cmm484zc3000a945qis85ta2o	500.00	0.00	\N	2026-03-06 21:07:31.911	\N	\N
cmmfdycp300v7hwgv29e7ocp9	cmmfdycp200v4hwgvmt4e6w55	cmm484zc8000d945ql844ex30	0.00	500.00	\N	2026-03-06 21:07:31.911	\N	\N
cmmfe3t3400vohwgvrfbuplcf	cmmfe3t3400vmhwgvccblnrn7	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-06 21:11:46.433	\N	\N
cmmfe3t3400vphwgvy1qdaipt	cmmfe3t3400vmhwgvccblnrn7	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-06 21:11:46.433	\N	\N
cmmfe7de900w5hwgve5z3f4tj	cmmfe7de900w3hwgvvr6srro8	cmm484zc10009945q5iez6h75	600.00	0.00	\N	2026-03-06 21:14:32.721	\N	\N
cmmfe7de900w6hwgvapc7lb4d	cmmfe7de900w3hwgvvr6srro8	cmm484zc3000a945qis85ta2o	0.00	600.00	\N	2026-03-06 21:14:32.721	\N	\N
cmmfecdh200wnhwgvuo8ntbi2	cmmfecdh200wlhwgvf3n3f85j	cmm484zbn0008945qm5gzgk16	350.00	0.00	\N	2026-03-06 21:18:26.102	\N	\N
cmmfecdh200wohwgvd43w2rb0	cmmfecdh200wlhwgvf3n3f85j	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-03-06 21:18:26.102	\N	\N
cmmfecwtm00x4hwgv23vyi5dw	cmmfecwtm00x2hwgv8u0x6g7j	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-06 21:18:51.178	\N	\N
cmmfecwtm00x5hwgvs5wcgcl3	cmmfecwtm00x2hwgv8u0x6g7j	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-06 21:18:51.178	\N	\N
cmmfedgei00xlhwgvvfkv7ify	cmmfedgei00xjhwgv16six1jh	cmm484zc10009945q5iez6h75	300.00	0.00	\N	2026-03-06 21:19:16.555	\N	\N
cmmfedgei00xmhwgvx39m2zhg	cmmfedgei00xjhwgv16six1jh	cmm484zc3000a945qis85ta2o	0.00	300.00	\N	2026-03-06 21:19:16.555	\N	\N
cmmfedw8100y2hwgv8i0i1312	cmmfedw8100y0hwgvdnwd11w2	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-06 21:19:37.057	\N	\N
cmmfedw8100y3hwgv03xrx4dc	cmmfedw8100y0hwgvdnwd11w2	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-06 21:19:37.057	\N	\N
cmmfeec6600yjhwgv3hyeo13l	cmmfeec6600yhhwgvfaxcx4tz	cmm484zc10009945q5iez6h75	465.00	0.00	\N	2026-03-06 21:19:57.726	\N	\N
cmmfeec6600ykhwgv173za6sj	cmmfeec6600yhhwgvfaxcx4tz	cmm484zc3000a945qis85ta2o	0.00	465.00	\N	2026-03-06 21:19:57.726	\N	\N
cmmfeeqzt00z1hwgvow7pq6q6	cmmfeeqzt00yzhwgvvp0n1wh7	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-06 21:20:16.937	\N	\N
cmmfeeqzt00z2hwgv6j3po4zy	cmmfeeqzt00yzhwgvvp0n1wh7	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-06 21:20:16.937	\N	\N
cmmfeg51i00zihwgv0va16uyb	cmmfeg51i00zghwgvr2l6k5us	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-06 21:21:21.798	\N	\N
cmmfeg51i00zjhwgva6d9bloa	cmmfeg51i00zghwgvr2l6k5us	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-06 21:21:21.798	\N	\N
cmmfeglok00zzhwgvwkyzhca4	cmmfeglok00zxhwgv8x5jw3il	cmm484zbn0008945qm5gzgk16	465.00	0.00	\N	2026-03-06 21:21:43.364	\N	\N
cmmfeglok0100hwgvs3cwi99e	cmmfeglok00zxhwgv8x5jw3il	cmm484zc3000a945qis85ta2o	0.00	465.00	\N	2026-03-06 21:21:43.364	\N	\N
cmmwjdqnd001023rf3dezvhf1	cmmwjdqnd000y23rf369a9xmq	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-18 21:11:32.905	\N	\N
cmmwjdqnd001123rfiggq8fw6	cmmwjdqnd000y23rf369a9xmq	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-18 21:11:32.905	\N	\N
cmmxezajf01g3ccos3j56p62d	cmmxezajf01g1ccosi40z1k92	cmm484zc3000a945qis85ta2o	500.00	0.00	\N	2026-03-19 11:56:06.555	\N	\N
cmmxezajf01g4ccosdibtjiyv	cmmxezajf01g1ccosi40z1k92	cmm484zc8000d945ql844ex30	0.00	500.00	\N	2026-03-19 11:56:06.555	\N	\N
cmmxgp1f801kpccosv2xb9cgf	cmmxgp1f801knccosncgjl14j	cmm484zc3000a945qis85ta2o	3150.00	0.00	\N	2026-03-19 12:44:07.412	\N	\N
cmmxgp1f801kqccosl71hycqw	cmmxgp1f801knccosncgjl14j	cmm484zc8000d945ql844ex30	0.00	3150.00	\N	2026-03-19 12:44:07.412	\N	\N
cmmxgrdnz01lwccosegswgp6n	cmmxgrdnz01luccos2zckudc3	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-19 12:45:56.592	\N	\N
cmmxgrdo001lxccosuv392dru	cmmxgrdnz01luccos2zckudc3	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-19 12:45:56.592	\N	\N
cmnhq27ae009cil5gynnwdz0g	cmnhq27ae009ail5gwajihmdz	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:01:41.607	\N	\N
cmnhq27ae009dil5gnd76frii	cmnhq27ae009ail5gwajihmdz	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:01:41.607	\N	\N
cmnhq35v400a6il5glnoihapu	cmnhq35v400a4il5gdpv2evxh	cmm484zc3000a945qis85ta2o	270.00	0.00	\N	2026-04-02 17:02:26.416	\N	\N
cmnhq35v400a7il5g78xxb8ft	cmnhq35v400a4il5gdpv2evxh	cmm484zc8000d945ql844ex30	0.00	270.00	\N	2026-04-02 17:02:26.416	\N	\N
cmnhq3az100b0il5g2l0zhurs	cmnhq3az100ayil5gb2kmnuhf	cmm484zc3000a945qis85ta2o	300.00	0.00	\N	2026-04-02 17:02:33.037	\N	\N
cmnhq3az100b1il5gjwx6ra89	cmnhq3az100ayil5gb2kmnuhf	cmm484zc8000d945ql844ex30	0.00	300.00	\N	2026-04-02 17:02:33.037	\N	\N
cmnhq3gj500buil5g1aiotj6p	cmnhq3gj500bsil5g8m93lymh	cmm484zc3000a945qis85ta2o	600.00	0.00	\N	2026-04-02 17:02:40.241	\N	\N
cmnhq3gj500bvil5gmsrl5uyz	cmnhq3gj500bsil5g8m93lymh	cmm484zc8000d945ql844ex30	0.00	600.00	\N	2026-04-02 17:02:40.241	\N	\N
cmnhq3j1m00c9il5gacyeeh1b	cmnhq3j1m00c7il5gw5yu9f75	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-04-02 17:02:43.498	\N	\N
cmnhq3j1m00cail5gamkeaqjh	cmnhq3j1m00c7il5gw5yu9f75	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-04-02 17:02:43.498	\N	\N
cmnhq3orm00d3il5gq32uf0n3	cmnhq3orm00d1il5gy8u87wsi	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-04-02 17:02:50.914	\N	\N
cmnhq3orm00d4il5g2ici4ick	cmnhq3orm00d1il5gy8u87wsi	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-04-02 17:02:50.914	\N	\N
cmnhq4ec500eril5g6jsyle2c	cmnhq4ec500epil5gptgjfi3q	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:24.053	\N	\N
cmnhq4ec500esil5grco2u56s	cmnhq4ec500epil5gptgjfi3q	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:24.053	\N	\N
cmnhq4ihw00flil5gqypffkwk	cmnhq4ihv00fjil5g0n5wpcw3	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:29.444	\N	\N
cmnhq4ihw00fmil5gfbq3huey	cmnhq4ihv00fjil5g0n5wpcw3	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:29.444	\N	\N
cmnhq4n8e00gfil5g36ngsznn	cmnhq4n8e00gdil5gxf2wbw3z	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:35.583	\N	\N
cmnhq4n8e00ggil5guuk0jw8a	cmnhq4n8e00gdil5gxf2wbw3z	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:35.583	\N	\N
cmnhq564b00h9il5gkidkprf7	cmnhq564b00h7il5gwaa7sqqv	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:00.059	\N	\N
cmnhq564b00hail5gnd1tj5sk	cmnhq564b00h7il5gwaa7sqqv	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:00.059	\N	\N
cmnhq5aiw00hoil5gypw9lg69	cmnhq5aiw00hmil5g0v8s4gaw	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:05.768	\N	\N
cmnhq5aiw00hpil5gowwi7cf9	cmnhq5aiw00hmil5g0v8s4gaw	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:05.768	\N	\N
cmnhq5crw00i3il5gcngfdbww	cmnhq5crw00i1il5gvyzq38yx	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-04-02 17:04:08.684	\N	\N
cmnhq5crw00i4il5gppifm289	cmnhq5crw00i1il5gvyzq38yx	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-04-02 17:04:08.684	\N	\N
cmnhq5uua00j0il5gs8hvqnev	cmnhq5uua00iyil5gjpompm8l	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:32.098	\N	\N
cmnhq5uua00j1il5gn657hwdb	cmnhq5uua00iyil5gjpompm8l	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:32.098	\N	\N
cmnhq5wqk00jgil5grauv272f	cmnhq5wqk00jdil5g2v0z4kq6	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-04-02 17:04:34.556	\N	\N
cmnhq5z1r00juil5ghmvnajqr	cmnhq5z1r00jsil5gd9f6rwuy	cmm484zc3000a945qis85ta2o	230.00	0.00	\N	2026-04-02 17:04:37.551	\N	\N
cmnhq5z1r00jvil5gjb7ubr07	cmnhq5z1r00jsil5gd9f6rwuy	cmm484zc8000d945ql844ex30	0.00	230.00	\N	2026-04-02 17:04:37.551	\N	\N
cmnhq60va00k9il5gn4qrcu7g	cmnhq60va00k7il5gl50o2g6h	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:39.91	\N	\N
cmnhq60va00kail5gqgsqf1w7	cmnhq60va00k7il5gl50o2g6h	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:39.91	\N	\N
cmnhq639w00koil5gg8h0w8oc	cmnhq639w00kmil5gg77jmx44	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:43.029	\N	\N
cmnhq639w00kpil5g6t9zjto1	cmnhq639w00kmil5gg77jmx44	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:43.029	\N	\N
cmnhq65ys00l3il5gbvky0i6g	cmnhq65ys00l1il5gt3jnql3f	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:04:46.517	\N	\N
cmnhq65yt00l4il5gx7c62nt4	cmnhq65ys00l1il5gt3jnql3f	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:04:46.517	\N	\N
cmnhsnuy800lwil5gsqviap31	cmnhsnuy800luil5guu911463	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 18:14:31.28	\N	\N
cmnhsnuy800lxil5gyenhfh22	cmnhsnuy800luil5guu911463	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 18:14:31.28	\N	\N
cmnhsnxcr00mbil5gm7joo3km	cmnhsnxcr00m9il5gwz4xzzv3	cmm484zc3000a945qis85ta2o	230.00	0.00	\N	2026-04-02 18:14:34.396	\N	\N
cmnhsnxcr00mcil5gvw3bql9o	cmnhsnxcr00m9il5gwz4xzzv3	cmm484zc8000d945ql844ex30	0.00	230.00	\N	2026-04-02 18:14:34.396	\N	\N
cmnhsnz3x00mqil5gj3hc3wdr	cmnhsnz3x00moil5gljo6nakr	cmm484zc3000a945qis85ta2o	300.00	0.00	\N	2026-04-02 18:14:36.669	\N	\N
cmnhsnz3x00mril5gsgszrgpb	cmnhsnz3x00moil5gljo6nakr	cmm484zc8000d945ql844ex30	0.00	300.00	\N	2026-04-02 18:14:36.669	\N	\N
cmnhso1f100n5il5g62q5nhyn	cmnhso1f100n3il5gpnzlg6ot	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 18:14:39.661	\N	\N
cmnhso1f100n6il5g3zg6befh	cmnhso1f100n3il5gpnzlg6ot	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 18:14:39.661	\N	\N
cmmfeh3kc010ghwgvbvrxfexw	cmmfeh3kc010ehwgvdaxp4hbh	cmm484zbn0008945qm5gzgk16	350.00	0.00	\N	2026-03-06 21:22:06.54	\N	\N
cmmfeh3kc010hhwgvmlf9n0ey	cmmfeh3kc010ehwgvdaxp4hbh	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-03-06 21:22:06.54	\N	\N
cmmiv6z220022kem8g3jnw5gb	cmmiv6z210020kem8pacoynxd	cmm484zbn0008945qm5gzgk16	1500.00	0.00	\N	2026-03-09 07:33:26.138	\N	\N
cmmiv6z220023kem8b0nnlo5j	cmmiv6z210020kem8pacoynxd	cmm484zc3000a945qis85ta2o	0.00	1500.00	\N	2026-03-09 07:33:26.138	\N	\N
cmmiv8krb002jkem8pb15ax82	cmmiv8krb002hkem8fkyhnw1o	cmm484zbn0008945qm5gzgk16	550.00	0.00	\N	2026-03-09 07:34:40.919	\N	\N
cmmiv8krb002kkem89o7k7pry	cmmiv8krb002hkem8fkyhnw1o	cmm484zc3000a945qis85ta2o	0.00	550.00	\N	2026-03-09 07:34:40.919	\N	\N
cmmiv939d0031kem8r64nuei6	cmmiv939d002zkem81mgc4v41	cmm484zbn0008945qm5gzgk16	200.00	0.00	\N	2026-03-09 07:35:04.898	\N	\N
cmmiv939d0032kem82vkqjio5	cmmiv939d002zkem81mgc4v41	cmm484zc3000a945qis85ta2o	0.00	200.00	\N	2026-03-09 07:35:04.898	\N	\N
cmmiv9h05003ikem8gy3p2r9q	cmmiv9h05003gkem8iuog6x6l	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-09 07:35:22.709	\N	\N
cmmiv9h05003jkem8u3dh6faq	cmmiv9h05003gkem8iuog6x6l	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-09 07:35:22.709	\N	\N
cmmiv9u8g003zkem8j39h81qg	cmmiv9u8g003xkem8ktp4k2pd	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-09 07:35:39.857	\N	\N
cmmiv9u8g0040kem8h8mlys34	cmmiv9u8g003xkem8ktp4k2pd	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-09 07:35:39.857	\N	\N
cmmivaf0p004gkem896yelnqt	cmmivaf0p004ekem897cm0jfw	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-09 07:36:06.793	\N	\N
cmmivaf0p004hkem8cx8dgg6f	cmmivaf0p004ekem897cm0jfw	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-09 07:36:06.793	\N	\N
cmmivayoi004xkem8jud7zwtz	cmmivayoh004vkem8kmawil9i	cmm484zbn0008945qm5gzgk16	230.00	0.00	\N	2026-03-09 07:36:32.274	\N	\N
cmmivayoi004ykem8q6mgndje	cmmivayoh004vkem8kmawil9i	cmm484zc3000a945qis85ta2o	0.00	230.00	\N	2026-03-09 07:36:32.274	\N	\N
cmmivblqf005ekem84bcickh6	cmmivblqf005ckem8copys2ra	cmm484zbn0008945qm5gzgk16	300.00	0.00	\N	2026-03-09 07:37:02.152	\N	\N
cmmivblqf005fkem8bfnyhk59	cmmivblqf005ckem8copys2ra	cmm484zc3000a945qis85ta2o	0.00	300.00	\N	2026-03-09 07:37:02.152	\N	\N
cmmivc2sp005vkem8d0gk9z10	cmmivc2sp005tkem8f5jj1ddx	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-09 07:37:24.265	\N	\N
cmmivc2sp005wkem8em0wlivh	cmmivc2sp005tkem8f5jj1ddx	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-09 07:37:24.265	\N	\N
cmmivcn0u006ckem8niz2ej7z	cmmivcn0u006akem85di11qfe	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-09 07:37:50.478	\N	\N
cmmivcn0u006dkem8u8sacvdh	cmmivcn0u006akem85di11qfe	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-09 07:37:50.478	\N	\N
cmmjmk3rq00628moi0j6tz4c6	cmmjmk3rq00608moikx3xt9tj	cmm484zc4000b945qgjk1jffh	350.00	0.00	\N	2026-03-09 20:19:28.406	\N	\N
cmmjmk3rq00638moi9uenq27v	cmmjmk3rq00608moikx3xt9tj	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-03-09 20:19:28.406	\N	\N
cmmjmnnw3006l8moi664xapav	cmmjmnnw3006j8moictf8cxtc	cmm484zc4000b945qgjk1jffh	65.00	0.00	\N	2026-03-09 20:22:14.451	\N	\N
cmmjmnnw3006m8moi0o1fhqfj	cmmjmnnw3006j8moictf8cxtc	cmm484zc3000a945qis85ta2o	0.00	65.00	\N	2026-03-09 20:22:14.451	\N	\N
cmmjmqgcg000gxm2pb79qus4b	cmmjmqgcf000exm2pvzy17iuo	cmm484zc4000b945qgjk1jffh	5.00	0.00	\N	2026-03-09 20:24:24.64	\N	\N
cmmjmqgcg000hxm2pmaffpeac	cmmjmqgcf000exm2pvzy17iuo	cmm484zc3000a945qis85ta2o	0.00	5.00	\N	2026-03-09 20:24:24.64	\N	\N
cmmwje2b8001i23rf7opt0jes	cmmwje2b8001g23rfmw3i4gle	cmm484zbn0008945qm5gzgk16	300.00	0.00	\N	2026-03-18 21:11:48.021	\N	\N
cmmwje2b8001j23rfvrwoy4rv	cmmwje2b8001g23rfmw3i4gle	cmm484zc3000a945qis85ta2o	0.00	300.00	\N	2026-03-18 21:11:48.021	\N	\N
cmmxf1pgw01gmccos94dago91	cmmxf1pgw01gkccos9a48w8lc	cmm484zc3000a945qis85ta2o	500.00	0.00	\N	2026-03-19 11:57:59.216	\N	\N
cmmxf1pgw01gnccoshwgekj2j	cmmxf1pgw01gkccos9a48w8lc	cmm484zc8000d945ql844ex30	0.00	500.00	\N	2026-03-19 11:57:59.216	\N	\N
cmmxgqv2201leccos49voxp1h	cmmxgqv2201lcccos1effdqsw	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-03-19 12:45:32.474	\N	\N
cmmxgqv2201lfccos2xw8anzm	cmmxgqv2201lcccos1effdqsw	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-03-19 12:45:32.474	\N	\N
cmmxgt6b501mfccos4i8suhe3	cmmxgt6b501mdccosgm0upgff	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-03-19 12:47:20.369	\N	\N
cmmxgt6b501mgccosw52ixleo	cmmxgt6b501mdccosgm0upgff	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-03-19 12:47:20.369	\N	\N
cmnhq22j0008xil5gktffioo5	cmnhq22j0008vil5g4j3bawt1	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-04-02 17:01:35.436	\N	\N
cmnhq22j0008yil5gkaa08v26	cmnhq22j0008vil5g4j3bawt1	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-04-02 17:01:35.436	\N	\N
cmnhq2z4b009ril5gstwhhru0	cmnhq2z4b009pil5gp9e1i0qu	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:02:17.676	\N	\N
cmnhq2z4b009sil5gmwgfnr0t	cmnhq2z4b009pil5gp9e1i0qu	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:02:17.676	\N	\N
cmnhq38e600alil5g90z39958	cmnhq38e600ajil5gdnn9s43b	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-04-02 17:02:29.694	\N	\N
cmnhq38e600amil5gsqjokomg	cmnhq38e600ajil5gdnn9s43b	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-04-02 17:02:29.694	\N	\N
cmnhq3d7g00bfil5g3u50kjwb	cmnhq3d7g00bdil5gtmydevmg	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:02:35.932	\N	\N
cmnhq3d7g00bgil5gw8i29ysg	cmnhq3d7g00bdil5gtmydevmg	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:02:35.932	\N	\N
cmnhq3lcm00coil5gyxelc8s9	cmnhq3lcm00cmil5gy1jqpxd8	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:02:46.487	\N	\N
cmnhq3lcm00cpil5g5clzt5ss	cmnhq3lcm00cmil5gy1jqpxd8	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:02:46.487	\N	\N
cmnhq3rat00diil5gu93yhu91	cmnhq3rat00dgil5gaerdw7mo	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:02:54.197	\N	\N
cmnhq3rat00djil5gcjabd40t	cmnhq3rat00dgil5gaerdw7mo	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:02:54.197	\N	\N
cmnhq47dn00dxil5gpwtfbesg	cmnhq47dn00dvil5gfdx819t2	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:15.035	\N	\N
cmnhq47dn00dyil5gmc2ym5k5	cmnhq47dn00dvil5gfdx819t2	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:15.035	\N	\N
cmnhq4cjy00ecil5gx6ek1cic	cmnhq4cjy00eail5g8fhorfxd	cmm484zc3000a945qis85ta2o	465.00	0.00	\N	2026-04-02 17:03:21.742	\N	\N
cmnhq4cjy00edil5gnom6d1gd	cmnhq4cjy00eail5g8fhorfxd	cmm484zc8000d945ql844ex30	0.00	465.00	\N	2026-04-02 17:03:21.742	\N	\N
cmnhq4gom00f6il5gu5ksqony	cmnhq4gom00f4il5g3i19fyri	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-04-02 17:03:27.094	\N	\N
cmnhq4gom00f7il5gv9nnf54s	cmnhq4gom00f4il5g3i19fyri	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-04-02 17:03:27.094	\N	\N
cmnhq4kxi00g0il5gbtr0qq7h	cmnhq4kxh00fyil5g4h9nt2ba	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:32.598	\N	\N
cmnhq4kxi00g1il5gdc3c04pn	cmnhq4kxh00fyil5g4h9nt2ba	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:32.598	\N	\N
cmnhq54as00guil5g4gwow5vs	cmnhq54as00gsil5gpz1ig1mt	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 17:03:57.7	\N	\N
cmnhq54as00gvil5g07iffjwn	cmnhq54as00gsil5gpz1ig1mt	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 17:03:57.7	\N	\N
cmnhq5f2000iiil5g1pb9zywz	cmnhq5f2000igil5g2n2rh62p	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-04-02 17:04:11.64	\N	\N
cmnhq5f2000ijil5gwvluet9b	cmnhq5f2000igil5g2n2rh62p	cmm484zc8000d945ql844ex30	0.00	350.00	\N	2026-04-02 17:04:11.64	\N	\N
cmnhq5wqk00jfil5gidgh30pm	cmnhq5wqk00jdil5g2v0z4kq6	cmm484zc3000a945qis85ta2o	350.00	0.00	\N	2026-04-02 17:04:34.556	\N	\N
cmnhso34w00nkil5gqja4vdyy	cmnhso34w00niil5gufo0kpiq	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 18:14:41.888	\N	\N
cmnhso34w00nlil5gdo0g5jzx	cmnhso34w00niil5gufo0kpiq	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 18:14:41.888	\N	\N
cmnhso5ki00nzil5gbz0rvj0e	cmnhso5kh00nxil5gkcg6k1sn	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 18:14:45.042	\N	\N
cmnhso5ki00o0il5gysyeyyqg	cmnhso5kh00nxil5gkcg6k1sn	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 18:14:45.042	\N	\N
cmnhsqhjk00oiil5gbulzivzx	cmnhsqhjk00ogil5g68l9s7dl	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:16:33.872	\N	\N
cmnhsqhjk00ojil5gnpa8vu3d	cmnhsqhjk00ogil5g68l9s7dl	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:16:33.872	\N	\N
cmnhsqwb200p0il5gj2cv83x4	cmnhsqwb200oyil5giwymytn5	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:16:53.006	\N	\N
cmnhsqwb200p1il5gh8cfbmfj	cmnhsqwb200oyil5giwymytn5	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:16:53.006	\N	\N
cmnhsslrj00pjil5g0xvzq8kn	cmnhsslrj00phil5grmrzg0f8	cmm484zbn0008945qm5gzgk16	730.00	0.00	\N	2026-04-02 18:18:12.656	\N	\N
cmnhsslrj00pkil5gnxw8wcrk	cmnhsslrj00phil5grmrzg0f8	cmm484zc3000a945qis85ta2o	0.00	730.00	\N	2026-04-02 18:18:12.656	\N	\N
cmnhstdvn00pzil5gf5vrc7hx	cmnhstdvn00pxil5g10wt9awj	cmm484zc3000a945qis85ta2o	450.00	0.00	\N	2026-04-02 18:18:49.091	\N	\N
cmnhstdvn00q0il5gaf70k5cu	cmnhstdvn00pxil5g10wt9awj	cmm484zc8000d945ql844ex30	0.00	450.00	\N	2026-04-02 18:18:49.091	\N	\N
cmnhstmc800qhil5g6ott5709	cmnhstmc800qfil5gj66rwc60	cmm484zbn0008945qm5gzgk16	450.00	0.00	\N	2026-04-02 18:19:00.056	\N	\N
cmnhstmc800qiil5gze9q0w1t	cmnhstmc800qfil5gj66rwc60	cmm484zc3000a945qis85ta2o	0.00	450.00	\N	2026-04-02 18:19:00.056	\N	\N
cmnhstyko00qzil5g5gim09yg	cmnhstyko00qxil5g6q608gel	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:19:15.912	\N	\N
cmnhstyko00r0il5gb6suoz9a	cmnhstyko00qxil5g6q608gel	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:19:15.912	\N	\N
cmnhsuhvv00rhil5gykkquve3	cmnhsuhvv00rfil5g5yrfduxu	cmm484zc4000b945qgjk1jffh	365.00	0.00	\N	2026-04-02 18:19:40.94	\N	\N
cmnhsuhvv00riil5gkxt7s6zj	cmnhsuhvv00rfil5g5yrfduxu	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:19:40.94	\N	\N
cmnhsv29200s0il5gnhp4r2sg	cmnhsv29200ryil5gu0gn1r8y	cmm484zbn0008945qm5gzgk16	270.00	0.00	\N	2026-04-02 18:20:07.334	\N	\N
cmnhsv29200s1il5guxy3cm3p	cmnhsv29200ryil5gu0gn1r8y	cmm484zc3000a945qis85ta2o	0.00	270.00	\N	2026-04-02 18:20:07.334	\N	\N
cmnhsvdh900siil5g6jpu1067	cmnhsvdh900sgil5gfpjo3kpg	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:20:21.885	\N	\N
cmnhsvdh900sjil5g1rdhkw2o	cmnhsvdh900sgil5gfpjo3kpg	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:20:21.885	\N	\N
cmnhsvp5600t0il5g1zrkdff0	cmnhsvp5600syil5gq0nfsf5o	cmm484zbn0008945qm5gzgk16	600.00	0.00	\N	2026-04-02 18:20:37.002	\N	\N
cmnhsvp5600t1il5g27s10r20	cmnhsvp5600syil5gq0nfsf5o	cmm484zc3000a945qis85ta2o	0.00	600.00	\N	2026-04-02 18:20:37.002	\N	\N
cmnhsw3zf00tiil5gnrsbu7wj	cmnhsw3zf00tgil5g4rwhne3g	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:20:56.236	\N	\N
cmnhsw3zf00tjil5g1q5r8qsn	cmnhsw3zf00tgil5g4rwhne3g	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:20:56.236	\N	\N
cmnhsx6tb00u1il5gt6042rao	cmnhsx6tb00tzil5gtwr0nkm8	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:21:46.559	\N	\N
cmnhsx6tb00u2il5gkti9z5cq	cmnhsx6tb00tzil5gtwr0nkm8	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:21:46.559	\N	\N
cmnhsxk8y00ujil5gyhcthagp	cmnhsxk8y00uhil5gziiu62r9	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:22:03.97	\N	\N
cmnhsxk8y00ukil5g4oej3ekr	cmnhsxk8y00uhil5gziiu62r9	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:22:03.97	\N	\N
cmnhsxtty00v1il5gihjw96w2	cmnhsxttx00uzil5g4v8rvrdu	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:22:16.39	\N	\N
cmnhsxtty00v2il5gby4rsh8i	cmnhsxttx00uzil5g4v8rvrdu	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:22:16.39	\N	\N
cmnhsy51w00vjil5glbb0ukf1	cmnhsy51v00vhil5g1g58kzvl	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:22:30.932	\N	\N
cmnhsy51w00vkil5grp3hmxwc	cmnhsy51v00vhil5g1g58kzvl	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:22:30.932	\N	\N
cmnhsyekk00w1il5gdri3q3o3	cmnhsyekk00vzil5g65f8pldp	cmm484zbn0008945qm5gzgk16	350.00	0.00	\N	2026-04-02 18:22:43.268	\N	\N
cmnhsyekk00w2il5g6y6di9t0	cmnhsyekk00vzil5g65f8pldp	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-04-02 18:22:43.268	\N	\N
cmnhsyp4g00wjil5gb8rjzu51	cmnhsyp4g00whil5g1ppbjdbv	cmm484zbn0008945qm5gzgk16	230.00	0.00	\N	2026-04-02 18:22:56.944	\N	\N
cmnhsyp4g00wkil5gdmt0p6w5	cmnhsyp4g00whil5g1ppbjdbv	cmm484zc3000a945qis85ta2o	0.00	230.00	\N	2026-04-02 18:22:56.944	\N	\N
cmnhsz20u00x1il5ga4norg56	cmnhsz20u00wzil5gmk9a54ao	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:23:13.663	\N	\N
cmnhsz20u00x2il5g103c9crj	cmnhsz20u00wzil5gmk9a54ao	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:23:13.663	\N	\N
cmnhszzd300xgil5gibio3jtq	cmnhszzd300xeil5gyd4dcjbm	cmm484zc3000a945qis85ta2o	365.00	0.00	\N	2026-04-02 18:23:56.871	\N	\N
cmnhszzd300xhil5g4hwwocz6	cmnhszzd300xeil5gyd4dcjbm	cmm484zc8000d945ql844ex30	0.00	365.00	\N	2026-04-02 18:23:56.871	\N	\N
cmnht1rmr00xzil5g0rvvmz9o	cmnht1rmr00xxil5gsp2evccg	cmm484zc4000b945qgjk1jffh	365.00	0.00	\N	2026-04-02 18:25:20.163	\N	\N
cmnht1rmr00y0il5grx1pxgwz	cmnht1rmr00xxil5gsp2evccg	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:25:20.163	\N	\N
cmnht226800yhil5gmy0sp3j0	cmnht226800yfil5gsi9mqix5	cmm484zbn0008945qm5gzgk16	300.00	0.00	\N	2026-04-02 18:25:33.824	\N	\N
cmnht226800yiil5gvy86anfp	cmnht226800yfil5gsi9mqix5	cmm484zc3000a945qis85ta2o	0.00	300.00	\N	2026-04-02 18:25:33.824	\N	\N
cmnht2d2c00yzil5gk9meerei	cmnht2d2b00yxil5gua2jyyuc	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:25:47.94	\N	\N
cmnht2d2c00z0il5gjvrzx5ro	cmnht2d2b00yxil5gua2jyyuc	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:25:47.94	\N	\N
cmnhtcra70114il5gel3qs159	cmnhtcra70112il5gnt2jf9dy	cmm484zbn0008945qm5gzgk16	1000.00	0.00	\N	2026-04-02 18:33:52.927	\N	\N
cmnhtcra70115il5g8byf8nve	cmnhtcra70112il5gnt2jf9dy	cmm484zc3000a945qis85ta2o	0.00	1000.00	\N	2026-04-02 18:33:52.927	\N	\N
cmnhtdds2011mil5gohpy6lsj	cmnhtdds2011kil5gom99eq2t	cmm484zbn0008945qm5gzgk16	3150.00	0.00	\N	2026-04-02 18:34:22.082	\N	\N
cmnhtdds2011nil5g6qrwd9fv	cmnhtdds2011kil5gom99eq2t	cmm484zc3000a945qis85ta2o	0.00	3150.00	\N	2026-04-02 18:34:22.082	\N	\N
cmnhtdq3b0124il5gln5kd7d9	cmnhtdq3b0122il5gi73k9asp	cmm484zbn0008945qm5gzgk16	500.00	0.00	\N	2026-04-02 18:34:38.039	\N	\N
cmnhtdq3b0125il5gnt94murk	cmnhtdq3b0122il5gi73k9asp	cmm484zc3000a945qis85ta2o	0.00	500.00	\N	2026-04-02 18:34:38.039	\N	\N
cmnhtm9bu012qil5glvvbctbi	cmnhtm9bu012oil5g29i8lr4u	cmm484zc3000a945qis85ta2o	500.00	0.00	\N	2026-04-02 18:41:16.219	\N	\N
cmnhtm9bu012ril5gs0by64jf	cmnhtm9bu012oil5g29i8lr4u	cmm484zc8000d945ql844ex30	0.00	500.00	\N	2026-04-02 18:41:16.219	\N	\N
cmnhu1hld013gil5g7gb3lxp3	cmnhu1hld013eil5glnk2kf4k	cmm484zc4000b945qgjk1jffh	465.00	0.00	\N	2026-04-02 18:53:06.769	\N	\N
cmnhu1hld013hil5ghnsoe6ov	cmnhu1hld013eil5glnk2kf4k	cmm484zc3000a945qis85ta2o	0.00	465.00	\N	2026-04-02 18:53:06.769	\N	\N
cmnhu2vka013yil5gz2jx7ovk	cmnhu2vka013wil5gxjn1z21w	cmm484zbn0008945qm5gzgk16	365.00	0.00	\N	2026-04-02 18:54:11.53	\N	\N
cmnhu2vka013zil5gk369s4o2	cmnhu2vka013wil5gxjn1z21w	cmm484zc3000a945qis85ta2o	0.00	365.00	\N	2026-04-02 18:54:11.53	\N	\N
cmnhu48u7014hil5glpjq0koc	cmnhu48u7014fil5g79zdwbok	cmm484zc4000b945qgjk1jffh	350.00	0.00	\N	2026-04-02 18:55:15.391	\N	\N
cmnhu48u7014iil5g187t7a2d	cmnhu48u7014fil5g79zdwbok	cmm484zc3000a945qis85ta2o	0.00	350.00	\N	2026-04-02 18:55:15.391	\N	\N
cmnhu5bu3014yil5gculzv8m9	cmnhu5bu3014wil5glx8dxjs9	cmm484zbn0008945qm5gzgk16	10000.00	0.00	\N	2026-04-02 18:56:05.931	\N	\N
cmnhu5bu3014zil5gcs5u387h	cmnhu5bu3014wil5glx8dxjs9	cmmjmk3qf005t8moin62hihu5	0.00	10000.00	\N	2026-04-02 18:56:05.931	\N	\N
cmnhu5tdg015fil5gt31pgkhd	cmnhu5tdg015dil5gnj7ydwgd	cmm484zbn0008945qm5gzgk16	500.00	0.00	\N	2026-04-02 18:56:28.66	\N	\N
cmnhu5tdg015gil5gjenbnp1y	cmnhu5tdg015dil5gnj7ydwgd	cmmjmk3qf005t8moin62hihu5	0.00	500.00	\N	2026-04-02 18:56:28.66	\N	\N
\.


--
-- TOC entry 5907 (class 0 OID 204432)
-- Dependencies: 254
-- Data for Name: ledger_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ledger_accounts (id, code, name, type, "isSystem", "isActive", "createdAt", "updatedAt") FROM stdin;
cmm484zbn0008945qm5gzgk16	1000	Bank	ASSET	t	t	2026-02-27 01:39:15.539	2026-04-02 18:56:28.639
cmm484zc10009945q5iez6h75	1010	Cash	ASSET	t	t	2026-02-27 01:39:15.553	2026-04-02 18:56:28.64
cmm484zc3000a945qis85ta2o	1200	Accounts Receivable	ASSET	t	t	2026-02-27 01:39:15.555	2026-04-02 18:56:28.642
cmmjmk3qf005t8moin62hihu5	1300	Loans Receivable	ASSET	t	t	2026-03-09 20:19:28.359	2026-04-02 18:56:28.643
cmm484zc4000b945qgjk1jffh	1100	Supplier Credits	ASSET	t	t	2026-02-27 01:39:15.557	2026-04-02 18:56:28.646
cmm484zc6000c945qmb23e1md	2000	Accounts Payable	LIABILITY	t	t	2026-02-27 01:39:15.558	2026-04-02 18:56:28.648
cmm484zc8000d945ql844ex30	4000	Sales Revenue	INCOME	t	t	2026-02-27 01:39:15.56	2026-04-02 18:56:28.651
cmm484zcb000e945q2q91843q	2100	Tax Payable	LIABILITY	t	t	2026-02-27 01:39:15.563	2026-04-02 18:56:28.652
cmm484zcd000f945q0ycl6wap	5000	Purchases	EXPENSE	t	t	2026-02-27 01:39:15.565	2026-04-02 18:56:28.654
\.


--
-- TOC entry 5937 (class 0 OID 244943)
-- Dependencies: 284
-- Data for Name: loan_repayments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_repayments (id, "loanId", amount, "paymentDate", notes, "createdAt", "journalEntryId") FROM stdin;
cmnhu5bsy014lil5gklmxm48e	cmmj669bq0002ayndk0sok08v	10000.00	2026-04-02 00:00:00	Bank	2026-04-02 18:56:05.89	cmnhu5bu3014wil5glx8dxjs9
cmnhu5tco0152il5g0mk63cbj	cmmj6vu6p001pk0xm3puwl97p	500.00	2026-04-02 00:00:00	CASH	2026-04-02 18:56:28.632	cmnhu5tdg015dil5gnj7ydwgd
\.


--
-- TOC entry 5936 (class 0 OID 244933)
-- Dependencies: 283
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (id, "borrowerName", "borrowerContact", amount, "outstandingBalance", "loanDate", "dueDate", "interestRate", purpose, status, notes, "ownerCompanyName", "createdById", "createdAt", "updatedAt", "customerId", "journalEntryId") FROM stdin;
cmmj669bq0002ayndk0sok08v	Tenda Fuma	+27742754404	10000.00	0.00	2026-03-09 00:00:00	2026-03-25 00:00:00	0.00	Business	REPAID	\N	Bretune Technologies	cmm47pax500048s6ob25tkito	2026-03-09 12:40:48.561	2026-04-02 18:56:05.896	\N	\N
cmmj6vu6p001pk0xm3puwl97p	Tenda Fuma	+27742754404	700.00	200.00	2026-03-09 00:00:00	2026-03-25 00:00:00	0.00	Car repair	PARTIALLY_REPAID	\N	Bretune Technologies	cmm47pax500048s6ob25tkito	2026-03-09 13:00:42.001	2026-04-02 18:56:28.634	cmmj6vu5s001nk0xm42z0d6r8	\N
\.


--
-- TOC entry 5941 (class 0 OID 276548)
-- Dependencies: 288
-- Data for Name: network_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network_alerts (id, "deviceId", severity, message, "isResolved", "resolvedAt", "resolvedByUserId", "ownerCompanyName", "createdAt") FROM stdin;
\.


--
-- TOC entry 5942 (class 0 OID 276555)
-- Dependencies: 289
-- Data for Name: network_devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network_devices (id, name, type, status, "ipAddress", "macAddress", location, model, "serialNumber", "firmwareVersion", "parentDeviceId", "snmpCommunity", "managementUrl", "uptimeSeconds", "cpuPercent", "memoryPercent", "lastSeenAt", notes, "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5943 (class 0 OID 276562)
-- Dependencies: 290
-- Data for Name: network_interfaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network_interfaces (id, "deviceId", name, "ifIndex", speed, "macAddress", "ipAddress", "isUp", "rxBytes", "txBytes", "rxErrors", "txErrors", "lastPolledAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5889 (class 0 OID 204029)
-- Dependencies: 236
-- Data for Name: password_resets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_resets (id, "userId", token, "expiresAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 5932 (class 0 OID 204962)
-- Dependencies: 279
-- Data for Name: pay_run_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pay_run_lines (id, "payRunId", "employeeId", "grossPay", deductions, "netPay", notes) FROM stdin;
\.


--
-- TOC entry 5931 (class 0 OID 204949)
-- Dependencies: 278
-- Data for Name: pay_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pay_runs (id, "payPeriodStart", "payPeriodEnd", status, "totalGross", "totalNet", "journalEntryId", "processedAt", "paidAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5891 (class 0 OID 204063)
-- Dependencies: 238
-- Data for Name: payment_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_allocations (id, "paymentId", "invoiceId", amount, "createdAt") FROM stdin;
cmmwjd40m000523rfjsr2zb0z	cmmwjd40e000423rf3j1x8gi2	cmmfdycnu00ushwgvl4d5twun	500.00	2026-03-18 21:11:03.574
cmm54smfm004js8x6el0lns98	cmm54smfh004is8x6chyi22zf	cmm54qdc40040s8x6dokn666t	460.00	2026-02-27 16:53:26.29
cmmwjdqm2000n23rfavop41p1	cmmwjdqly000m23rfhqlo9nw8	cmm55x5y900brs8x6p43fnlw6	365.00	2026-03-18 21:11:32.859
cmm6f4z1p002rzvp1yvpqvnb7	cmm6f3t3f000lzvp1h8shmp29	cmm6f30wa0003zvp1hl7kvrhv	350.00	2026-02-28 14:30:44.846
cmm6fftqo00032fmqsv300174	cmm6fftqf00022fmqdupz6ew1	cmm54hd9b002ws8x6k997r60l	365.00	2026-02-28 14:39:11.184
cmm6fq7b1000a1klqtel0if3l	cmm6fq7ar00091klq0huyhk2a	cmm484z9o0004945q204d0y5y	6245.57	2026-02-28 14:47:15.325
cmm6fq7b1000b1klqkytjeybv	cmm6fq7ar00091klq0huyhk2a	cmm49246v0004trwpp9wrybt5	450.00	2026-02-28 14:47:15.325
cmm6vbng500dmtwnanf3om7nm	cmm6vbnfn00dltwnajm5k7tlk	cmm6fxar1001c1klqu51c1exl	365.00	2026-02-28 22:03:50.261
cmmfe3t1w00vchwgvk7509px6	cmmfe3t1q00vbhwgvh2zylz7d	cmm5521qd006os8x6jss4oqbd	365.00	2026-03-06 21:11:46.388
cmmfe7dd800vthwgvpsapanun	cmmfe7dd200vshwgvdp5x0iey	cmm5555sn0077s8x665dh6i2c	600.00	2026-03-06 21:14:32.684
cmmfecdg100wbhwgvto3vf5yt	cmmfecdfy00wahwgvjjkqwmy3	cmm557ctw007rs8x6k4c62o5h	350.00	2026-03-06 21:18:26.066
cmmfecwsk00wshwgvexrbs7u4	cmmfecwsd00wrhwgvp2vj8gai	cmm55abru008es8x6xzq5jayq	365.00	2026-03-06 21:18:51.14
cmmfedgdg00x9hwgvorx21a7e	cmmfedgdd00x8hwgvaosw7phe	cmm55f9mw008zs8x6gg4khx43	300.00	2026-03-06 21:19:16.517
cmmfedw6v00xqhwgv1jcnk148	cmmfedw6r00xphwgvszfgz9xp	cmm55rguz00aps8x6ugt2sshx	365.00	2026-03-06 21:19:37.016
cmmfeec5100y7hwgvqyta4j6k	cmmfeec4y00y6hwgv1wa9m2v2	cmm55uyy700b8s8x6qanzofol	465.00	2026-03-06 21:19:57.685
cmmfeeqz500yphwgvxxw1r4i3	cmmfeeqz300yohwgvou7tqdz1	cmm6fvdpv000t1klq3zsyw54w	365.00	2026-03-06 21:20:16.913
cmmfeg50j00z6hwgvwgce7mql	cmmfeg50g00z5hwgvfmcvv66b	cmm6lu7z2004x1klq9seu83sm	365.00	2026-03-06 21:21:21.764
cmmfeglnm00znhwgvxc6f7zyi	cmmfeglnf00zmhwgvn3wudmi2	cmm6lw8bq005g1klqheq6wawo	465.00	2026-03-06 21:21:43.33
cmmfeh3jl0104hwgvynmaoyoe	cmmfeh3jj0103hwgv4rk08h07	cmm6lyaxz00601klqi4pwr9ph	350.00	2026-03-06 21:22:06.514
cmmiv6yzq001qkem8rh1m3ylu	cmmiv6yzi001pkem8g94r9sqj	cmmfdqtbg00u8hwgv3u8kb8su	1500.00	2026-03-09 07:33:26.054
cmmiv8kqh0027kem8t5lkdxr0	cmmiv8kqe0026kem8e2pd2d4n	cmm6m031l006j1klqoadqlc6z	550.00	2026-03-09 07:34:40.89
cmmiv938h002pkem8u3050kh1	cmmiv938d002okem88f9iq81c	cmm6m4thj007p1klqng8ppg7p	200.00	2026-03-09 07:35:04.865
cmmiv9gz90036kem8yqwd6935	cmmiv9gz60035kem89g7vv76m	cmm6maz3e008s1klqij3xvbtd	365.00	2026-03-09 07:35:22.677
cmmiv9u7m003nkem8dq7mj5i7	cmmiv9u7j003mkem88l4ah9ll	cmm6mgxu6009w1klqd03montw	365.00	2026-03-09 07:35:39.827
cmmivaezw0044kem8n5ir5u3p	cmmivaezt0043kem8bors666t	cmm6mh8ez00ae1klqkzkqpyuo	365.00	2026-03-09 07:36:06.765
cmmivaynv004lkem8616fwmwn	cmmivaynr004kkem8xpxc2ay4	cmm6mjsoh00ax1klqu3xvzif4	230.00	2026-03-09 07:36:32.251
cmmivblpr0052kem8kcok2je1	cmmivblpo0051kem8pq03ovtd	cmm6mp6l100bh1klqc1xu49bj	300.00	2026-03-09 07:37:02.127
cmmivc2s1005jkem8s137xkbv	cmmivc2ry005ikem8tsf9i57d	cmm6mrryx00c01klq9xnd2vf1	365.00	2026-03-09 07:37:24.242
cmmivcmzz0060kem83uwlmerr	cmmivcmzw005zkem8o3bkvb28	cmm6mvsqa00d31klqpyyztysa	365.00	2026-03-09 07:37:50.447
cmmizn5u800dpkem8olihavi3	cmm54dqug002es8x6onic5950	cmm548jid001vs8x6ip7s3bpi	270.00	2026-03-09 09:37:59.889
cmmjmk3nx005p8moiklrsw4ka	cmmjmk3nd005o8moimp8fzq1h	cmm55jlrg009is8x6pcjr9ir9	350.00	2026-03-09 20:19:28.269
cmmjmnnv600688moib8qgspqd	cmmjmnnv100678moivckbrch1	cmm55f9mw008zs8x6gg4khx43	65.00	2026-03-09 20:22:14.419
cmmjmqgak0003xm2p4teiah3j	cmmjmqgad0002xm2pqbfe3z4c	cmm54qdc40040s8x6dokn666t	5.00	2026-03-09 20:24:24.572
cmmwje29z001523rf147fyaf8	cmmwje29v001423rf0jxrbew5	cmm54ku0a003gs8x6m3nypblo	300.00	2026-03-18 21:11:47.975
cmmwjerns001n23rfmrhi0ye6	cmmwjernm001m23rfxrgnzty1	cmm6mtjg800ck1klq2tjwvvq4	365.00	2026-03-18 21:12:20.872
cmmwjfbzj002523rf8ogrj6va	cmmwjfbzf002423rff1h46ptz	cmm6m2wd500761klqjgzyw96v	350.00	2026-03-18 21:12:47.215
cmmxgqv0z01l1ccos6r9jrqy6	cmmxgqv0a01l0ccos7xcz4ahn	cmm6mcqa1009b1klqtr8yxhic	365.00	2026-03-19 12:45:32.436
cmmxgrdn701ljccosaqcd5dr1	cmmxgrdn301liccosuazllx95	cmm6ljq8v003a1klq6tth9275	365.00	2026-03-19 12:45:56.563
cmnhsqhif00o5il5grcv7neqq	cmnhsqhi200o4il5g8zlws1eq	cmm6m86yb00881klqd917funl	365.00	2026-04-02 18:16:33.832
cmnhsqwa800onil5gwdt8q8jb	cmnhsqwa400omil5gp706cm82	cmm6lhr9t002q1klqio5407zy	365.00	2026-04-02 18:16:52.977
cmnhsslqn00p5il5gyhiiaer8	cmnhsslqj00p4il5gs4951e8l	cmmxgt6a601m0ccosdah4sodh	365.00	2026-04-02 18:18:12.624
cmnhsslqn00p6il5gvh8vplx0	cmnhsslqj00p4il5gs4951e8l	cmmxgt6a601m0ccosdah4sodh	365.00	2026-04-02 18:18:12.624
cmnhstmbi00q4il5gidgxbbxm	cmnhstmbf00q3il5g65d5ao86	cmnhq019c000eil5gfozc4a8r	450.00	2026-04-02 18:19:00.03
cmnhstyjw00qmil5ggiyio5ue	cmnhstyju00qlil5g9f6f3r7g	cmnhq01870008il5g9f0gk02x	365.00	2026-04-02 18:19:15.884
cmnhsuhv500r4il5g43rselt4	cmnhsuhv300r3il5gq795293a	cmnhq01ab000mil5ggf2upb40	365.00	2026-04-02 18:19:40.914
cmnhsv28700rnil5gluuiodpq	cmnhsv28300rmil5gu9l8ys8e	cmnhq01at000sil5g0n21nkd2	270.00	2026-04-02 18:20:07.303
cmnhsvdgh00s5il5gjk6ywnla	cmnhsvdge00s4il5ghtapvnw1	cmnhq01cd001cil5g1m8u2g2v	365.00	2026-04-02 18:20:21.857
cmnhsvp4b00snil5g8ck0xw0c	cmnhsvp4800smil5g6fzmaau5	cmnhq01co001iil5gn7ozjtd4	600.00	2026-04-02 18:20:36.971
cmnhsw3yq00t5il5gmsj96n7v	cmnhsw3yo00t4il5gseiq6v1r	cmnhq01ey001vil5gwx5dp4ad	365.00	2026-04-02 18:20:56.211
cmnhsx6sl00toil5gtd73xxce	cmnhsx6sh00tnil5gzhjujasd	cmnhq01fs0027il5gnd8o0rz7	365.00	2026-04-02 18:21:46.534
cmnhsxk8600u6il5gw6ihrbe5	cmnhsxk8400u5il5gxwenmy0x	cmnhq01if003fil5g0jdvy4l2	365.00	2026-04-02 18:22:03.943
cmnhsxtt500uoil5g10rhcrx4	cmnhsxtt200unil5gyg9zq2xb	cmnhq01j3003ril5giatnc40g	365.00	2026-04-02 18:22:16.361
cmnhsy51500v6il5grjq62jxq	cmnhsy51200v5il5gjotq80n0	cmnhq01k10049il5gamnrycij	365.00	2026-04-02 18:22:30.905
cmnhsyejr00voil5gvn24ijf1	cmnhsyejo00vnil5gc09dpebc	cmnhq01kp004lil5gkguig1dn	350.00	2026-04-02 18:22:43.239
cmnhsyp3r00w6il5g24bzp2ue	cmnhsyp3o00w5il5gc2umr9j1	cmnhq01md0055il5g8evc6smq	230.00	2026-04-02 18:22:56.919
cmnhsz1zx00woil5g5b3jcxtn	cmnhsz1zu00wnil5g33kjk87b	cmnhq01nm005jil5gshu2o4rf	365.00	2026-04-02 18:23:13.63
cmnht1rlp00xmil5gi7e1dmng	cmnht1rlm00xlil5gnzlikxif	cmnhq01qi006nil5g2f0e69j1	365.00	2026-04-02 18:25:20.126
cmnht225h00y4il5g9winnk32	cmnht225f00y3il5gwuofdx6j	cmnhq01rg007jil5gwlqndpz8	300.00	2026-04-02 18:25:33.798
cmnht2d1k00ymil5ghok5iiqr	cmnht2d1i00ylil5gb0chp3hp	cmnhq01sk008fil5g02c48kal	365.00	2026-04-02 18:25:47.912
cmnhtcr9b010ril5g9380tsi7	cmnhtcr98010qil5gdrcwpsfj	cmmxf1pel01g7ccosq3diypp8	1000.00	2026-04-02 18:33:52.895
cmnhtddr60119il5gdyxrutvq	cmnhtddr20118il5g4do3k4pd	cmmxgp1al01k9ccos546ajwxb	3150.00	2026-04-02 18:34:22.051
cmnhtdq2f011ril5ggr9wvawb	cmnhtdq2c011qil5g7na8jvvy	cmmxezaf501foccosseep05jt	500.00	2026-04-02 18:34:38.007
cmnhu1hkc0133il5gurd7qe6l	cmnhu1hk90132il5gx4bjhlw6	cmnhq01gt002pil5gddd7qcmo	465.00	2026-04-02 18:53:06.732
cmnhu2vja013lil5g9qrkqizk	cmnhu2vj4013kil5gz2680p2f	cmm6lm10m003t1klqh30komsw	365.00	2026-04-02 18:54:11.495
cmnhu48ti0144il5gblh69gym	cmnhu48tg0143il5gdhy04501	cmnhq01fe0021il5gu4slheky	350.00	2026-04-02 18:55:15.366
\.


--
-- TOC entry 5879 (class 0 OID 203764)
-- Dependencies: 226
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "paymentNumber", "invoiceId", "clientId", "userId", amount, status, method, "transactionId", notes, "paymentDate", "processedAt", "createdAt", "updatedAt", "unallocatedAmount", "voidedAt", "voidReason", "journalEntryId") FROM stdin;
cmmwjd40e000423rf3j1x8gi2	PAY-031	cmmfdycnu00ushwgvl4d5twun	cmmfdvvyl00uphwgvtz36zuym	cmm47pax500048s6ob25tkito	500.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-18 21:11:03.566	\N	2026-03-18 21:11:03.566	2026-03-18 21:11:03.666	0.00	\N	\N	cmmwjd42a000g23rfbmbpcze4
cmm54smfh004is8x6chyi22zf	PAY-002	cmm54qdc40040s8x6dokn666t	cmm54ohzw003xs8x6p4nhgv8l	cmm47pax500048s6ob25tkito	460.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-02-27 16:53:26.286	\N	2026-02-27 16:53:26.286	2026-02-27 16:53:26.376	0.00	\N	\N	cmm54smhn004ts8x65hmhtiou
cmm6f3t3f000lzvp1h8shmp29	PAY-003	cmm6f30wa0003zvp1hl7kvrhv	cmm6f2oi90000zvp15rcvh9dq	cmm47pax500048s6ob25tkito	350.00	COMPLETED	BANK_TRANSFER	Monthly Subscription	\N	2026-02-28 14:29:50.475	\N	2026-02-28 14:29:50.475	2026-02-28 14:30:44.849	0.00	\N	\N	cmm6f3t4k000wzvp15vrbxl2c
cmmwjdqly000m23rfhqlo9nw8	PAY-032	cmm55x5y900brs8x6p43fnlw6	cmm55wz4x00bos8x6nnrkl8re	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-18 21:11:32.855	\N	2026-03-18 21:11:32.855	2026-03-18 21:11:32.924	0.00	\N	\N	cmmwjdqnd000y23rf369a9xmq
cmm6fftqf00022fmqdupz6ew1	PAY-004	cmm54hd9b002ws8x6k997r60l	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	370.00	COMPLETED	BANK_TRANSFER	Monthly subscription	\N	2026-02-28 14:39:11.175	\N	2026-02-28 14:39:11.175	2026-02-28 14:39:11.286	5.00	\N	\N	cmm6fftsf000d2fmqfjpjz7dj
cmm6fq7ar00091klq0huyhk2a	PAY-005	cmm484z9o0004945q204d0y5y	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	6695.57	COMPLETED	BANK_TRANSFER	Monthly commission	\N	2026-02-28 14:47:15.315	\N	2026-02-28 14:47:15.315	2026-02-28 14:47:15.418	0.00	\N	\N	cmm6fq7da000l1klq85ojx81z
cmmwje29v001423rf0jxrbew5	PAY-033	cmm54ku0a003gs8x6m3nypblo	cmm54kjqp003ds8x67pxwkczp	cmm47pax500048s6ob25tkito	300.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-18 21:11:47.971	\N	2026-03-18 21:11:47.971	2026-03-18 21:11:48.035	0.00	\N	\N	cmmwje2b8001g23rfmw3i4gle
cmm6vbnfn00dltwnajm5k7tlk	PAY-006	cmm6fxar1001c1klqu51c1exl	cmm6fwzea00191klqx8mfarvz	cmm47pax500048s6ob25tkito	370.00	COMPLETED	BANK_TRANSFER	Monthly subscription	\N	2026-02-28 22:03:50.244	\N	2026-02-28 22:03:50.244	2026-02-28 22:03:50.415	5.00	\N	\N	cmm6vbnjh00dwtwnagurzi7u7
cmmfe3t1q00vbhwgvh2zylz7d	PAY-007	cmm5521qd006os8x6jss4oqbd	cmm551ver006ls8x65km4hqtw	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly Subscription	\N	2026-03-06 21:11:46.382	\N	2026-03-06 21:11:46.382	2026-03-06 21:11:46.448	0.00	\N	\N	cmmfe3t3400vmhwgvccblnrn7
cmmfe7dd200vshwgvdp5x0iey	PAY-008	cmm5555sn0077s8x665dh6i2c	cmm554muh0074s8x6hn9a7048	cmm47pax500048s6ob25tkito	600.00	COMPLETED	CASH	sub	\N	2026-03-06 21:14:32.678	\N	2026-03-06 21:14:32.678	2026-03-06 21:14:32.737	0.00	\N	\N	cmmfe7de900w3hwgvvr6srro8
cmmfecdfy00wahwgvjjkqwmy3	PAY-009	cmm557ctw007rs8x6k4c62o5h	cmm557419007os8x6nailjge0	cmm47pax500048s6ob25tkito	350.00	COMPLETED	BANK_TRANSFER	Sub	\N	2026-03-06 21:18:26.063	\N	2026-03-06 21:18:26.063	2026-03-06 21:18:26.117	0.00	\N	\N	cmmfecdh200wlhwgvf3n3f85j
cmmfecwsd00wrhwgvp2vj8gai	PAY-010	cmm55abru008es8x6xzq5jayq	cmm55a6s8008bs8x6h6fnp5yd	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:18:51.134	\N	2026-03-06 21:18:51.134	2026-03-06 21:18:51.192	0.00	\N	\N	cmmfecwtm00x2hwgv8u0x6g7j
cmmfedgdd00x8hwgvaosw7phe	PAY-011	cmm55f9mw008zs8x6gg4khx43	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	300.00	COMPLETED	CASH	sub	\N	2026-03-06 21:19:16.514	\N	2026-03-06 21:19:16.514	2026-03-06 21:19:16.567	0.00	\N	\N	cmmfedgei00xjhwgv16six1jh
cmmfedw6r00xphwgvszfgz9xp	PAY-012	cmm55rguz00aps8x6ugt2sshx	cmm55r8pq00ams8x6i0lchg3w	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:19:37.011	\N	2026-03-06 21:19:37.011	2026-03-06 21:19:37.071	0.00	\N	\N	cmmfedw8100y0hwgvdnwd11w2
cmmfeec4y00y6hwgv1wa9m2v2	PAY-013	cmm55uyy700b8s8x6qanzofol	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	465.00	COMPLETED	CASH	sub	\N	2026-03-06 21:19:57.682	\N	2026-03-06 21:19:57.682	2026-03-06 21:19:57.738	0.00	\N	\N	cmmfeec6600yhhwgvfaxcx4tz
cmmfeeqz300yohwgvou7tqdz1	PAY-014	cmm6fvdpv000t1klq3zsyw54w	cmm6fuy5g000q1klqcvvtfvcr	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:20:16.911	\N	2026-03-06 21:20:16.911	2026-03-06 21:20:16.944	0.00	\N	\N	cmmfeeqzt00yzhwgvvp0n1wh7
cmmfeg50g00z5hwgvfmcvv66b	PAY-015	cmm6lu7z2004x1klq9seu83sm	cmm6ltyls004u1klq3s6arqce	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:21:21.76	\N	2026-03-06 21:21:21.76	2026-03-06 21:21:21.813	0.00	\N	\N	cmmfeg51i00zghwgvr2l6k5us
cmmfeglnf00zmhwgvn3wudmi2	PAY-016	cmm6lw8bq005g1klqheq6wawo	cmm6lvyqs005d1klqltorxkd7	cmm47pax500048s6ob25tkito	465.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:21:43.323	\N	2026-03-06 21:21:43.323	2026-03-06 21:21:43.379	0.00	\N	\N	cmmfeglok00zxhwgv8x5jw3il
cmmfeh3jj0103hwgv4rk08h07	PAY-017	cmm6lyaxz00601klqi4pwr9ph	cmm6ly0d0005x1klqmrye4jav	cmm47pax500048s6ob25tkito	350.00	COMPLETED	BANK_TRANSFER	sub	\N	2026-03-06 21:22:06.511	\N	2026-03-06 21:22:06.511	2026-03-06 21:22:06.548	0.00	\N	\N	cmmfeh3kc010ehwgvdaxp4hbh
cmmiv6yzi001pkem8g94r9sqj	PAY-018	cmmfdqtbg00u8hwgv3u8kb8su	cmmfdly1z00shhwgvwpnfvclv	cmm47pax500048s6ob25tkito	1500.00	COMPLETED	BANK_TRANSFER	INV-044	\N	2026-03-09 07:33:26.046	\N	2026-03-09 07:33:26.046	2026-03-09 07:33:26.188	0.00	\N	\N	cmmiv6z210020kem8pacoynxd
cmmiv8kqe0026kem8e2pd2d4n	PAY-019	cmm6m031l006j1klqoadqlc6z	cmm6lzufz006g1klqacvd1c71	cmm47pax500048s6ob25tkito	550.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:34:40.887	\N	2026-03-09 07:34:40.887	2026-03-09 07:34:40.931	0.00	\N	\N	cmmiv8krb002hkem8fkyhnw1o
cmmiv938d002okem88f9iq81c	PAY-020	cmm6m4thj007p1klqng8ppg7p	cmm6m4kb2007m1klquhr4s41u	cmm47pax500048s6ob25tkito	200.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:35:04.861	\N	2026-03-09 07:35:04.861	2026-03-09 07:35:04.91	0.00	\N	\N	cmmiv939d002zkem81mgc4v41
cmmiv9gz60035kem89g7vv76m	PAY-021	cmm6maz3e008s1klqij3xvbtd	cmm6maqjf008p1klq0iyvmq8j	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:35:22.674	\N	2026-03-09 07:35:22.674	2026-03-09 07:35:22.724	0.00	\N	\N	cmmiv9h05003gkem8iuog6x6l
cmmiv9u7j003mkem88l4ah9ll	PAY-022	cmm6mgxu6009w1klqd03montw	cmm6me5qh009r1klq9lfn2jhx	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:35:39.824	\N	2026-03-09 07:35:39.824	2026-03-09 07:35:39.869	0.00	\N	\N	cmmiv9u8g003xkem8ktp4k2pd
cmmivaezt0043kem8bors666t	PAY-023	cmm6mh8ez00ae1klqkzkqpyuo	cmm6mglj9009t1klqm9q1uznw	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:36:06.762	\N	2026-03-09 07:36:06.762	2026-03-09 07:36:06.805	0.00	\N	\N	cmmivaf0p004ekem897cm0jfw
cmmivaynr004kkem8xpxc2ay4	PAY-024	cmm6mjsoh00ax1klqu3xvzif4	cmm6mjll100au1klqlwbnnjp9	cmm47pax500048s6ob25tkito	230.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:36:32.247	\N	2026-03-09 07:36:32.247	2026-03-09 07:36:32.277	0.00	\N	\N	cmmivayoh004vkem8kmawil9i
cmmivblpo0051kem8pq03ovtd	PAY-025	cmm6mp6l100bh1klqc1xu49bj	cmm6movbm00be1klqnc8pn4f6	cmm47pax500048s6ob25tkito	300.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:37:02.125	\N	2026-03-09 07:37:02.125	2026-03-09 07:37:02.161	0.00	\N	\N	cmmivblqf005ckem8copys2ra
cmmivc2ry005ikem8tsf9i57d	PAY-026	cmm6mrryx00c01klq9xnd2vf1	cmm6mrbxw00bx1klq6snmtbyb	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:37:24.238	\N	2026-03-09 07:37:24.238	2026-03-09 07:37:24.277	0.00	\N	\N	cmmivc2sp005tkem8f5jj1ddx
cmmivcmzw005zkem8o3bkvb28	PAY-027	cmm6mvsqa00d31klqpyyztysa	cmm6mvjxx00d01klqrij7sk43	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	Monthly sub	\N	2026-03-09 07:37:50.444	\N	2026-03-09 07:37:50.444	2026-03-09 07:37:50.492	0.00	\N	\N	cmmivcn0u006akem85di11qfe
cmm54dqug002es8x6onic5950	PAY-001	cmm548jid001vs8x6ip7s3bpi	cmm540m4p001os8x6km8cvelc	cmm47pax500048s6ob25tkito	270.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-02-27 16:41:52.168	\N	2026-02-27 16:41:52.168	2026-03-09 09:37:59.919	0.00	\N	\N	cmm54dqwi002ps8x6wq1gzmud
cmmjmk3nd005o8moimp8fzq1h	PAY-028	cmm55jlrg009is8x6pcjr9ir9	cmm55j1sz009fs8x62nkk3wym	cmm47pax500048s6ob25tkito	350.00	COMPLETED	CREDIT_NOTE	\N	Bonus 	2026-03-09 20:19:28.249	\N	2026-03-09 20:19:28.249	2026-03-09 20:19:28.477	0.00	\N	\N	cmmjmk3rq00608moikx3xt9tj
cmmjmnnv100678moivckbrch1	PAY-029	cmm55f9mw008zs8x6gg4khx43	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	65.00	COMPLETED	CREDIT_NOTE	\N	Reduced package 	2026-03-09 20:22:14.414	\N	2026-03-09 20:22:14.414	2026-03-09 20:22:14.466	0.00	\N	\N	cmmjmnnw3006j8moictf8cxtc
cmmjmqgad0002xm2pqbfe3z4c	PAY-030	cmm54qdc40040s8x6dokn666t	cmm54ohzw003xs8x6p4nhgv8l	cmm47pax500048s6ob25tkito	5.00	COMPLETED	CREDIT_NOTE	\N	Incorrect billing	2026-03-09 20:24:24.565	\N	2026-03-09 20:24:24.565	2026-03-09 20:24:24.664	0.00	\N	\N	cmmjmqgcf000exm2pvzy17iuo
cmmwjernm001m23rfxrgnzty1	PAY-034	cmm6mtjg800ck1klq2tjwvvq4	cmm6mtbuc00ch1klq0odakxsn	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-18 21:12:20.866	\N	2026-03-18 21:12:20.866	2026-03-18 21:12:20.927	0.00	\N	\N	cmmwjerou001y23rf8bz63xvh
cmmwjfbzf002423rff1h46ptz	CR-001	cmm6m2wd500761klqjgzyw96v	cmm6m2n1z00721klq0sctxew0	cmm47pax500048s6ob25tkito	350.00	COMPLETED	CREDIT_NOTE	\N	discount	2026-03-18 00:00:00	\N	2026-03-18 21:12:47.211	2026-03-18 21:12:47.257	0.00	\N	\N	cmmwjfc0i002g23rfvos7y0h2
cmmxgqv0a01l0ccos7xcz4ahn	PAY-035	cmm6mcqa1009b1klqtr8yxhic	cmm6mcin600981klqhytyq4gf	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-19 12:45:32.408	\N	2026-03-19 12:45:32.408	2026-03-19 12:45:32.487	0.00	\N	\N	cmmxgqv2201lcccos1effdqsw
cmmxgrdn301liccosuazllx95	PAY-036	cmm6ljq8v003a1klq6tth9275	cmm6ljd7h00361klqff2544qa	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-03-19 12:45:56.56	\N	2026-03-19 12:45:56.56	2026-03-19 12:45:56.604	0.00	\N	\N	cmmxgrdnz01luccos2zckudc3
cmnhsqhi200o4il5g8zlws1eq	PAY-037	cmm6m86yb00881klqd917funl	cmm6m7zmc00851klqhgp4clh1	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:16:33.818	\N	2026-04-02 18:16:33.818	2026-04-02 18:16:33.887	0.00	\N	\N	cmnhsqhjk00ogil5g68l9s7dl
cmnhsqwa400omil5gp706cm82	PAY-038	cmm6lhr9t002q1klqio5407zy	cmm6lh7k3002n1klq8jh12onn	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:16:52.972	\N	2026-04-02 18:16:52.972	2026-04-02 18:16:53.018	0.00	\N	\N	cmnhsqwb200oyil5giwymytn5
cmnhsslqj00p4il5gs4951e8l	PAY-039	cmmxgt6a601m0ccosdah4sodh	cmm55cbe3008us8x6p33kz5mb	cmm47pax500048s6ob25tkito	730.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:18:12.62	\N	2026-04-02 18:18:12.62	2026-04-02 18:18:12.667	0.00	\N	\N	cmnhsslrj00phil5grmrzg0f8
cmnhstmbf00q3il5g65d5ao86	PAY-040	cmnhq019c000eil5gfozc4a8r	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	450.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:19:00.027	\N	2026-04-02 18:19:00.027	2026-04-02 18:19:00.06	0.00	\N	\N	cmnhstmc800qfil5gj66rwc60
cmnhstyju00qlil5g9f6f3r7g	PAY-041	cmnhq01870008il5g9f0gk02x	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:19:15.882	\N	2026-04-02 18:19:15.882	2026-04-02 18:19:15.916	0.00	\N	\N	cmnhstyko00qxil5g6q608gel
cmnhsuhv300r3il5gq795293a	CR-002	cmnhq01ab000mil5ggf2upb40	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	365.00	COMPLETED	CREDIT_NOTE	\N	Duplicate	2026-04-02 00:00:00	\N	2026-04-02 18:19:40.911	2026-04-02 18:19:40.944	0.00	\N	\N	cmnhsuhvv00rfil5g5yrfduxu
cmnhsv28300rmil5gu9l8ys8e	PAY-042	cmnhq01at000sil5g0n21nkd2	cmm540m4p001os8x6km8cvelc	cmm47pax500048s6ob25tkito	270.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:20:07.3	\N	2026-04-02 18:20:07.3	2026-04-02 18:20:07.346	0.00	\N	\N	cmnhsv29200ryil5gu0gn1r8y
cmnhsvdge00s4il5ghtapvnw1	PAY-043	cmnhq01cd001cil5g1m8u2g2v	cmm551ver006ls8x65km4hqtw	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:20:21.854	\N	2026-04-02 18:20:21.854	2026-04-02 18:20:21.896	0.00	\N	\N	cmnhsvdh900sgil5gfpjo3kpg
cmnhsvp4800smil5g6fzmaau5	PAY-044	cmnhq01co001iil5gn7ozjtd4	cmm554muh0074s8x6hn9a7048	cmm47pax500048s6ob25tkito	600.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:20:36.968	\N	2026-04-02 18:20:36.968	2026-04-02 18:20:37.014	0.00	\N	\N	cmnhsvp5600syil5gq0nfsf5o
cmnhsw3yo00t4il5gseiq6v1r	PAY-045	cmnhq01ey001vil5gwx5dp4ad	cmm55a6s8008bs8x6h6fnp5yd	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:20:56.209	\N	2026-04-02 18:20:56.209	2026-04-02 18:20:56.239	0.00	\N	\N	cmnhsw3zf00tgil5g4rwhne3g
cmnhsx6sh00tnil5gzhjujasd	PAY-046	cmnhq01fs0027il5gnd8o0rz7	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:21:46.53	\N	2026-04-02 18:21:46.53	2026-04-02 18:21:46.572	0.00	\N	\N	cmnhsx6tb00tzil5gtwr0nkm8
cmnhsxk8400u5il5gxwenmy0x	PAY-047	cmnhq01if003fil5g0jdvy4l2	cmm6fwzea00191klqx8mfarvz	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:22:03.941	\N	2026-04-02 18:22:03.941	2026-04-02 18:22:03.974	0.00	\N	\N	cmnhsxk8y00uhil5gziiu62r9
cmnhsxtt200unil5gyg9zq2xb	PAY-048	cmnhq01j3003ril5giatnc40g	cmm6ljd7h00361klqff2544qa	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:22:16.358	\N	2026-04-02 18:22:16.358	2026-04-02 18:22:16.403	0.00	\N	\N	cmnhsxttx00uzil5g4v8rvrdu
cmnhsy51200v5il5gjotq80n0	PAY-049	cmnhq01k10049il5gamnrycij	cmm6ltyls004u1klq3s6arqce	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:22:30.903	\N	2026-04-02 18:22:30.903	2026-04-02 18:22:30.937	0.00	\N	\N	cmnhsy51v00vhil5g1g58kzvl
cmnhsyejo00vnil5gc09dpebc	PAY-050	cmnhq01kp004lil5gkguig1dn	cmm6ly0d0005x1klqmrye4jav	cmm47pax500048s6ob25tkito	350.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:22:43.236	\N	2026-04-02 18:22:43.236	2026-04-02 18:22:43.28	0.00	\N	\N	cmnhsyekk00vzil5g65f8pldp
cmnhsyp3o00w5il5gc2umr9j1	PAY-051	cmnhq01md0055il5g8evc6smq	cmm6m4kb2007m1klquhr4s41u	cmm47pax500048s6ob25tkito	230.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:22:56.916	\N	2026-04-02 18:22:56.916	2026-04-02 18:22:56.949	0.00	\N	\N	cmnhsyp4g00whil5g1ppbjdbv
cmnhsz1zu00wnil5g33kjk87b	PAY-052	cmnhq01nm005jil5gshu2o4rf	cmm6maqjf008p1klq0iyvmq8j	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:23:13.626	\N	2026-04-02 18:23:13.626	2026-04-02 18:23:13.676	0.00	\N	\N	cmnhsz20u00wzil5gmk9a54ao
cmnht1rlm00xlil5gnzlikxif	CR-003	cmnhq01qi006nil5g2f0e69j1	cmm6mglj9009t1klqm9q1uznw	cmm47pax500048s6ob25tkito	365.00	COMPLETED	CREDIT_NOTE	\N	Duplicate	2026-04-02 00:00:00	\N	2026-04-02 18:25:20.122	2026-04-02 18:25:20.176	0.00	\N	\N	cmnht1rmr00xxil5gsp2evccg
cmnht225f00y3il5gwuofdx6j	PAY-053	cmnhq01rg007jil5gwlqndpz8	cmm6movbm00be1klqnc8pn4f6	cmm47pax500048s6ob25tkito	300.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:25:33.796	\N	2026-04-02 18:25:33.796	2026-04-02 18:25:33.828	0.00	\N	\N	cmnht226800yfil5gsi9mqix5
cmnht2d1i00ylil5gb0chp3hp	PAY-054	cmnhq01sk008fil5g02c48kal	cmm6mvjxx00d01klqrij7sk43	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:25:47.91	\N	2026-04-02 18:25:47.91	2026-04-02 18:25:47.944	0.00	\N	\N	cmnht2d2b00yxil5gua2jyyuc
cmnhtcr98010qil5gdrcwpsfj	PAY-055	cmmxf1pel01g7ccosq3diypp8	cmmfdly1z00shhwgvwpnfvclv	cmm47pax500048s6ob25tkito	1000.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:33:52.892	\N	2026-04-02 18:33:52.892	2026-04-02 18:33:52.941	0.00	\N	\N	cmnhtcra70112il5gnt2jf9dy
cmnhtddr20118il5g4do3k4pd	PAY-056	cmmxgp1al01k9ccos546ajwxb	cmmxgm46l01k5ccostk54flk0	cmm47pax500048s6ob25tkito	3150.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:34:22.046	\N	2026-04-02 18:34:22.046	2026-04-02 18:34:22.094	0.00	\N	\N	cmnhtdds2011kil5gom99eq2t
cmnhtdq2c011qil5g7na8jvvy	PAY-057	cmmxezaf501foccosseep05jt	cmmfdvvyl00uphwgvtz36zuym	cmm47pax500048s6ob25tkito	500.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:34:38.005	\N	2026-04-02 18:34:38.005	2026-04-02 18:34:38.052	0.00	\N	\N	cmnhtdq3b0122il5gi73k9asp
cmnhu1hk90132il5gx4bjhlw6	CR-004	cmnhq01gt002pil5gddd7qcmo	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	465.00	COMPLETED	CREDIT_NOTE	\N	duplicate	2026-04-02 00:00:00	\N	2026-04-02 18:53:06.729	2026-04-02 18:53:06.784	0.00	\N	\N	cmnhu1hld013eil5glnk2kf4k
cmnhu2vj4013kil5gz2680p2f	PAY-058	cmm6lm10m003t1klqh30komsw	cmm6llpqi003q1klqf1ejb34c	cmm47pax500048s6ob25tkito	365.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-04-02 18:54:11.488	\N	2026-04-02 18:54:11.488	2026-04-02 18:54:11.54	0.00	\N	\N	cmnhu2vka013wil5gxjn1z21w
cmnhu48tg0143il5gdhy04501	CR-005	cmnhq01fe0021il5gu4slheky	cmm55j1sz009fs8x62nkk3wym	cmm47pax500048s6ob25tkito	350.00	COMPLETED	CREDIT_NOTE	\N	Duplicate	2026-04-02 00:00:00	\N	2026-04-02 18:55:15.364	2026-04-02 18:55:15.398	0.00	\N	\N	cmnhu48u7014fil5g79zdwbok
\.


--
-- TOC entry 5914 (class 0 OID 204603)
-- Dependencies: 261
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, key, description, module, "createdAt") FROM stdin;
cmm47nd740000fkjo991ousum	invoices.view	View invoices	invoices	2026-02-27 01:25:33.712
cmm47nd780001fkjokvkv35i0	invoices.create	Create invoices	invoices	2026-02-27 01:25:33.717
cmm47nd7a0002fkjo1wt6mrei	invoices.edit	Edit invoices	invoices	2026-02-27 01:25:33.718
cmm47nd7c0003fkjoanguq9xl	invoices.delete	Delete invoices	invoices	2026-02-27 01:25:33.72
cmm47nd7d0004fkjoq3qk7fnt	invoices.approve	Approve invoices	invoices	2026-02-27 01:25:33.722
cmm47nd7f0005fkjouv5nscv2	invoices.send	Send invoices	invoices	2026-02-27 01:25:33.723
cmm47nd7h0006fkjo9y4s4okp	quotes.view	View quotes	quotes	2026-02-27 01:25:33.725
cmm47nd7i0007fkjo45htuz8w	quotes.create	Create quotes	quotes	2026-02-27 01:25:33.727
cmm47nd7j0008fkjotrklzl16	quotes.edit	Edit quotes	quotes	2026-02-27 01:25:33.728
cmm47nd7l0009fkjof7ivoa12	quotes.delete	Delete quotes	quotes	2026-02-27 01:25:33.729
cmm47nd7m000afkjooqn0n4c6	banking.view	View banking	banking	2026-02-27 01:25:33.731
cmm47nd7o000bfkjoc1fac673	banking.reconcile	Reconcile bank	banking	2026-02-27 01:25:33.732
cmm47nd7p000cfkjo898jxb3o	banking.import	Import bank transactions	banking	2026-02-27 01:25:33.733
cmm47nd7q000dfkjorwoo01cz	payments.view	View payments	payments	2026-02-27 01:25:33.734
cmm47nd7r000efkjo3scsjagw	payments.create	Record payments	payments	2026-02-27 01:25:33.735
cmm47nd7s000ffkjoehnlu4gb	payments.void	Void payments	payments	2026-02-27 01:25:33.736
cmm47nd7t000gfkjotd47qle6	ledger.view	View ledger	ledger	2026-02-27 01:25:33.737
cmm47nd7u000hfkjo6b6scqhq	ledger.post	Post to ledger	ledger	2026-02-27 01:25:33.738
cmm47nd7v000ifkjosxl2nelw	journal.create	Create journal entries	ledger	2026-02-27 01:25:33.739
cmm47nd7x000jfkjo744wpkef	journal.reverse	Reverse journal entries	ledger	2026-02-27 01:25:33.742
cmm47nd7z000kfkjom0oh8km9	clients.view	View clients	clients	2026-02-27 01:25:33.743
cmm47nd80000lfkjohs0d50tj	clients.create	Create clients	clients	2026-02-27 01:25:33.744
cmm47nd81000mfkjovo3fk60k	clients.edit	Edit clients	clients	2026-02-27 01:25:33.746
cmm47nd83000nfkjot24jffvf	clients.delete	Delete clients	clients	2026-02-27 01:25:33.747
cmm47nd84000ofkjoja5tztnh	products.view	View products	products	2026-02-27 01:25:33.748
cmm47nd85000pfkjofm5a1lvu	products.create	Create products	products	2026-02-27 01:25:33.749
cmm47nd86000qfkjo03ldozzg	products.edit	Edit products	products	2026-02-27 01:25:33.751
cmm47nd88000rfkjos7hxox41	products.delete	Delete products	products	2026-02-27 01:25:33.752
cmm47nd89000sfkjo6kw05a8l	bills.view	View bills	bills	2026-02-27 01:25:33.753
cmm47nd8a000tfkjo6dbbadr0	bills.create	Create bills	bills	2026-02-27 01:25:33.754
cmm47nd8b000ufkjo40kgqbr1	bills.edit	Edit bills	bills	2026-02-27 01:25:33.756
cmm47nd8d000vfkjoywflhl66	bills.delete	Delete bills	bills	2026-02-27 01:25:33.758
cmm47nd8f000wfkjol90v665w	suppliers.view	View suppliers	suppliers	2026-02-27 01:25:33.759
cmm47nd8g000xfkjo8qby7wjm	suppliers.create	Create suppliers	suppliers	2026-02-27 01:25:33.76
cmm47nd8h000yfkjo317fiqs7	suppliers.edit	Edit suppliers	suppliers	2026-02-27 01:25:33.761
cmm47nd8i000zfkjobm419abe	suppliers.delete	Delete suppliers	suppliers	2026-02-27 01:25:33.762
cmm47nd8j0010fkjotq5b8lwj	reports.view	View reports	reports	2026-02-27 01:25:33.763
cmm47nd8k0011fkjo44hc7qkz	reports.export	Export reports	reports	2026-02-27 01:25:33.764
cmm47nd8l0012fkjolyft2fav	settings.manage	Manage settings	settings	2026-02-27 01:25:33.765
cmm47nd8m0013fkjo4mv5d7qs	users.manage	Manage users	users	2026-02-27 01:25:33.766
cmm47nd8n0014fkjo7pqq59li	roles.manage	Manage roles	roles	2026-02-27 01:25:33.767
cmm47nd8o0015fkjo9ssdd9iz	tasks.view	View tasks	tasks	2026-02-27 01:25:33.768
cmm47nd8p0016fkjoklpei5bx	tasks.create	Create tasks	tasks	2026-02-27 01:25:33.769
cmm47nd8p0017fkjo2h4gt7hd	tasks.edit	Edit tasks	tasks	2026-02-27 01:25:33.77
cmm47nd8q0018fkjoj47nnl3v	tasks.delete	Delete tasks	tasks	2026-02-27 01:25:33.771
cmm47nd8s0019fkjo5owxtnrp	expenses.view	View expenses	expenses	2026-02-27 01:25:33.772
cmm47nd8u001afkjotmh2lke0	expenses.create	Create expenses	expenses	2026-02-27 01:25:33.774
cmm47nd8w001bfkjonz0h2uyg	expenses.approve	Approve expenses	expenses	2026-02-27 01:25:33.776
cmm47nd8x001cfkjovozejjvy	statements.view	View statements	statements	2026-02-27 01:25:33.777
cmm47nd8y001dfkjok2y23r2l	statements.send	Send statements	statements	2026-02-27 01:25:33.779
\.


--
-- TOC entry 5873 (class 0 OID 203701)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, sku, price, cost, "taxRate", "isRecurring", "recurringFrequency", "isActive", "createdAt", "updatedAt", "trackInventory", "quantityOnHand", "reorderLevel", "ownerCompanyName", type) FROM stdin;
cmm481oue0000945q6qksiu1f	Comms	Monthly Commission Bluedog Technology	comms	6245.57	\N	0.0000	f	\N	t	2026-02-27 01:36:41.979	2026-02-27 01:36:41.979	f	0.0000	\N	Bretune Technologies	PRODUCT
cmm484bm00001945q87cncih2	NB	Please find Spreadsheet attached	\N	0.00	\N	0.1500	f	\N	t	2026-02-27 01:38:44.808	2026-02-27 01:38:44.808	f	0.0000	\N	Bretune Technologies	PRODUCT
cmm490rip0000trwp9q09xvmz	Installation	Newe Wireless Installation	install	450.00	\N	0.0000	f	\N	t	2026-02-27 02:03:58.395	2026-02-27 02:03:58.395	f	0.0000	\N	Bretune Technologies	PRODUCT
cmm5423ac001ps8x6egch0lss	5/5Mbps	5/5Mbps Lite	15/5Mbps	230.00	\N	0.0000	f	\N	t	2026-02-27 16:32:48.421	2026-02-27 16:34:00.074	f	0.0000	\N	Bretune Technologies	PRODUCT
cmm5449x9001qs8x6mft6pcmt	10/5Mbps	10/5Mbps Home	10/5Mbps	365.00	\N	0.0000	f	\N	t	2026-02-27 16:34:30.333	2026-02-27 16:34:33.562	f	0.0000	\N	Bretune Technologies	PRODUCT
cmm5457tx001ss8x60i50m2fr	20/10Mbps	20/10Mbps-Premium	20/10Mbps	465.00	\N	0.0000	f	\N	t	2026-02-27 16:35:14.277	2026-02-27 16:35:14.277	f	0.0000	\N	Bretune Technologies	PRODUCT
cmmaetrg2002hkgp4oa536vjo	tswfst	hyswfhx	yuss	500.00	\N	0.0000	f	\N	t	2026-03-03 09:33:06.483	2026-03-03 09:33:11.462	f	0.0000	\N	Bluedog Technologies	PRODUCT
cmmfdptf800u5hwgvt7p1cjul	Callout	Technical Callout Fee	Callout	500.00	\N	0.0000	f	\N	t	2026-03-06 21:00:53.684	2026-03-06 21:00:53.684	f	0.0000	\N	Bretune Technologies	PRODUCT
cmmxgnxsj01k6ccos5vsjo60j	Cat5e	Cat5e Network Cable	\N	9.50	\N	0.0000	f	\N	t	2026-03-19 12:43:16.047	2026-03-19 12:43:16.047	f	0.0000	\N	Bretune Technologies	PRODUCT
\.


--
-- TOC entry 5895 (class 0 OID 204173)
-- Dependencies: 242
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, "projectNumber", name, description, status, "startDate", "endDate", "clientId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5875 (class 0 OID 203723)
-- Dependencies: 222
-- Data for Name: quote_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quote_items (id, "quoteId", "productId", description, quantity, "unitPrice", discount, "taxRate", total) FROM stdin;
cmmaeo3qw000akgp40i3owioz	cmmaeo3qw0009kgp4bq57q611	\N	test	1.00	580.00	0.00	0.0000	580.00
\.


--
-- TOC entry 5874 (class 0 OID 203712)
-- Dependencies: 221
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, "quoteNumber", "clientId", "userId", status, "issueDate", "expiryDate", notes, subtotal, "taxAmount", "totalAmount", "createdAt", "updatedAt", "quoteSeq") FROM stdin;
cmmaeo3qw0009kgp4bq57q611	Q-001	cmmaen5i90006kgp431o5gmfv	cmmael1y10005kgp4vea5fi0c	ACCEPTED	2026-03-03 09:28:42.488	2026-03-17 00:00:00	gfgfxabhjxdhkxd	580.00	0.00	580.00	2026-03-03 09:28:42.488	2026-03-03 09:31:05.239	1
\.


--
-- TOC entry 5880 (class 0 OID 203864)
-- Dependencies: 227
-- Data for Name: recurring_invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_invoice_items (id, "recurringInvoiceId", "productId", description, quantity, "unitPrice", discount, "taxRate", total) FROM stdin;
cmm6fiz8m00051klqexuhem0h	cmm6fingm00021klq7j0gp2lx	\N	Monthly susbcription	1.00	465.00	0.00	0.0000	465.00
cmm6xrdbu001t13hmh8umh7eo	cmm6xrdbu001s13hmewcees78	\N	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89tzm00drzyd23m6o0rn7	cmmj89tzm00dpzyd2jguoni3b	cmm490rip0000trwp9q09xvmz	Newe Wireless Installation(New installation for client 7855)	1.00	450.00	0.00	0.0000	450.00
cmmj89tzj00dmzyd2vim841rv	cmmj89tz900dezyd2k56h2kq3	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmmj89tzj00dkzyd2zqbmbvjt	cmmj89tz900dczyd2c1txdl3n	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	270.00	0.00	0.0000	270.00
cmmj89tzj00dlzyd2vir608in	cmmj89tz900ddzyd2ullx18vg	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89tzt00duzyd2acvhvs0l	cmmj89tzs00dszyd2hogf7b6f	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmmj89u5j00e0zyd2e8ufpbzx	cmmj89u5j00dyzyd2t7ahgotx	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u5r00e5zyd2hjyp5ijb	cmmj89u5r00e2zyd29vk7ahn4	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmmj89u5r00e6zyd2j6du3djl	cmmj89u5r00e2zyd29vk7ahn4	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	300.00	0.00	0.0000	300.00
cmmj89u6000ebzyd2sy48wl86	cmmj89u5z00e9zyd24jrdes3g	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmmj89u6000ehzyd25gfauq3m	cmmj89u6000eezyd2fpcvgxdr	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u6500elzyd2fr820c1h	cmmj89u6500ejzyd2gfpga3fs	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmmj89u6700epzyd26nv5xll3	cmmj89u6700enzyd2u5ze7bfm	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u7i00euzyd2yxju7udk	cmmj89u7h00eszyd24v63u1fh	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u8000ezzyd2skr0udrj	cmmj89u8000exzyd28gqlpptp	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u8n00f5zyd2x59buymk	cmmj89u8n00f3zyd2rrx5bm41	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmmj89u8r00fazyd2u4k0uivu	cmmj89u8r00f8zyd2yff3gz36	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u9000ffzyd240b6cvz6	cmmj89u9000fdzyd248rf2vdw	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmmj89u9500fjzyd2cagc41ae	cmmj89u9500fhzyd2h7wek72w	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89u9x00fpzyd288uul0ye	cmmj89u9w00fnzyd2j3l5j6ov	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj89ua000ftzyd27buz93fq	cmmj89u9z00frzyd2sezhyu3v	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8be9k00g1zyd2aglyhjk8	cmmj8be9k00fyzyd2icx3ls9k	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8bea100g6zyd2cxj9ha40	cmmj8bea100g4zyd2n5ld0rcu	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beac00gczyd2bmdwmh4r	cmmj8beac00g8zyd2n02ez2fw	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beal00gpzyd2ljqht4wn	cmmj8beal00gnzyd2zd79wttj	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmmj8beag00ghzyd2lhyk54gb	cmmj8beag00gfzyd2tanq0a6n	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beai00glzyd2w5be33nh	cmmj8beah00gjzyd291o41dqy	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	465.00	0.00	0.0000	465.00
cmmj8bec300guzyd22b0prfha	cmmj8bec300gszyd2jjpi5hpb	cmm5457tx001ss8x60i50m2fr	20/10Mbps-Premium	1.00	550.00	0.00	0.0000	550.00
cmmj8becf00h0zyd20glnk9mz	cmmj8becf00gyzyd2mi1f0u91	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	350.00	0.00	0.0000	350.00
cmmj8beck00h5zyd29jkdkf4a	cmmj8beck00h3zyd2eihljyqw	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmmj8becu00hazyd2g4afktd0	cmmj8becu00h8zyd230u3a52m	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8becy00hfzyd2b9qa3gl9	cmmj8becx00hdzyd27nueb0wz	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8bed500hjzyd2g4h09kal	cmmj8bed500hhzyd2dodpoaq5	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8bee500hozyd2b9l69bpb	cmmj8bee500hmzyd2qzbu29ma	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beeq00hvzyd2j9fg5rs7	cmmj8beeq00htzyd2bwso0i75	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beer00hzzyd2ex954is8	cmmj8beeq00hxzyd2hqri1d4t	cmm5423ac001ps8x6egch0lss	5/5Mbps Lite	1.00	230.00	0.00	0.0000	230.00
cmmj8beew00i3zyd2m2si3a17	cmmj8beew00i1zyd26iazc9z5	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	300.00	0.00	0.0000	300.00
cmmj8bef600i9zyd2htg7u27p	cmmj8bef500i7zyd2sa79lqbl	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8bef800idzyd2mipcfru3	cmmj8bef700ibzyd2jappjex2	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
cmmj8beg400ijzyd2ixctsfnl	cmmj8beg400ihzyd2w9tmk3cp	cmm5449x9001qs8x6mft6pcmt	10/5Mbps Home	1.00	365.00	0.00	0.0000	365.00
\.


--
-- TOC entry 5881 (class 0 OID 203903)
-- Dependencies: 228
-- Data for Name: recurring_invoice_runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_invoice_runs (id, "recurringInvoiceId", "runAt", status, attempt, "invoiceId", error) FROM stdin;
cmnhq016q0006il5g9iecfq8p	cmm6fingm00021klq7j0gp2lx	2026-04-02 17:00:00.384	SUCCESS	1	cmnhq014a0002il5g8x6qzmpb	\N
cmnhq018c000cil5gh329xp18	cmm6xrdbu001s13hmewcees78	2026-04-02 17:00:00.444	SUCCESS	1	cmnhq01870008il5g9f0gk02x	\N
cmnhq019u000iil5g2nbma1j5	cmmj89tzm00dpzyd2jguoni3b	2026-04-02 17:00:00.498	SUCCESS	1	cmnhq019c000eil5gfozc4a8r	\N
cmnhq01ai000qil5ggljv86ix	cmmj89tz900ddzyd2ullx18vg	2026-04-02 17:00:00.522	SUCCESS	1	cmnhq01ab000mil5ggf2upb40	\N
cmnhq01b1000wil5g5t9f9qo1	cmmj89tz900dczyd2c1txdl3n	2026-04-02 17:00:00.541	SUCCESS	1	cmnhq01at000sil5g0n21nkd2	\N
cmnhq01bq0014il5gs9ner4sp	cmmj89tz900dezyd2k56h2kq3	2026-04-02 17:00:00.566	SUCCESS	1	cmnhq01bm0010il5g699bq3wh	\N
cmnhq01c4001ail5gfsxgejxu	cmmj89tzs00dszyd2hogf7b6f	2026-04-02 17:00:00.58	SUCCESS	1	cmnhq01c10016il5gdspjhxm4	\N
cmnhq01cg001gil5gmq9w0qox	cmmj89u5j00dyzyd2t7ahgotx	2026-04-02 17:00:00.593	SUCCESS	1	cmnhq01cd001cil5g1m8u2g2v	\N
cmnhq01ee001nil5g8lcsj2mf	cmmj89u5r00e2zyd29vk7ahn4	2026-04-02 17:00:00.662	SUCCESS	1	cmnhq01co001iil5gn7ozjtd4	\N
cmnhq01er001til5g9f9s83mi	cmmj89u5z00e9zyd24jrdes3g	2026-04-02 17:00:00.675	SUCCESS	1	cmnhq01en001pil5gi1vc6sfj	\N
cmnhq01f4001zil5go7db95lo	cmmj89u6000eezyd2fpcvgxdr	2026-04-02 17:00:00.688	SUCCESS	1	cmnhq01ey001vil5gwx5dp4ad	\N
cmnhq01fh0025il5gi79zelq2	cmmj89u6500ejzyd2gfpga3fs	2026-04-02 17:00:00.702	SUCCESS	1	cmnhq01fe0021il5gu4slheky	\N
cmnhq01fv002bil5gltffkxna	cmmj89u6700enzyd2u5ze7bfm	2026-04-02 17:00:00.716	SUCCESS	1	cmnhq01fs0027il5gnd8o0rz7	\N
cmnhq01g8002hil5ga5l45bub	cmmj89u7h00eszyd24v63u1fh	2026-04-02 17:00:00.729	SUCCESS	1	cmnhq01g5002dil5gb3d6zax8	\N
cmnhq01gm002nil5gf5ha3sm2	cmmj89u8000exzyd28gqlpptp	2026-04-02 17:00:00.742	SUCCESS	1	cmnhq01gi002jil5gllim8wr2	\N
cmnhq01gz002til5ghl1xxntj	cmmj89u8n00f3zyd2rrx5bm41	2026-04-02 17:00:00.755	SUCCESS	1	cmnhq01gt002pil5gddd7qcmo	\N
cmnhq01ha002zil5gfxfht4gp	cmmj89u8r00f8zyd2yff3gz36	2026-04-02 17:00:00.767	SUCCESS	1	cmnhq01h7002vil5g6hon7p0k	\N
cmnhq01ho0035il5g8h03own8	cmmj89u9000fdzyd248rf2vdw	2026-04-02 17:00:00.78	SUCCESS	1	cmnhq01hl0031il5gggsgcp9n	\N
cmnhq01i5003dil5gf5la5rej	cmmj89u9500fhzyd2h7wek72w	2026-04-02 17:00:00.797	SUCCESS	1	cmnhq01i10039il5ga38l4cst	\N
cmnhq01ii003jil5g3o4oznq7	cmmj89u9w00fnzyd2j3l5j6ov	2026-04-02 17:00:00.81	SUCCESS	1	cmnhq01if003fil5g0jdvy4l2	\N
cmnhq01it003pil5glbozq5ab	cmmj89u9z00frzyd2sezhyu3v	2026-04-02 17:00:00.822	SUCCESS	1	cmnhq01io003lil5gxnh50ht7	\N
cmnhq01j5003vil5gkxij85sd	cmmj8be9k00fyzyd2icx3ls9k	2026-04-02 17:00:00.833	SUCCESS	1	cmnhq01j3003ril5giatnc40g	\N
cmnhq01ji0041il5gs380ji24	cmmj8bea100g4zyd2n5ld0rcu	2026-04-02 17:00:00.846	SUCCESS	1	cmnhq01jf003xil5g4gjodk7r	\N
cmnhq01ju0047il5glw31mwyb	cmmj8beac00g8zyd2n02ez2fw	2026-04-02 17:00:00.859	SUCCESS	1	cmnhq01jq0043il5guu3cnbg8	\N
cmnhq01k6004dil5gn67dfwb4	cmmj8beag00gfzyd2tanq0a6n	2026-04-02 17:00:00.87	SUCCESS	1	cmnhq01k10049il5gamnrycij	\N
cmnhq01kh004jil5gx12fm5xs	cmmj8beah00gjzyd291o41dqy	2026-04-02 17:00:00.881	SUCCESS	1	cmnhq01ke004fil5gsqlatwhb	\N
cmnhq01kt004pil5gwypqaljg	cmmj8beal00gnzyd2zd79wttj	2026-04-02 17:00:00.893	SUCCESS	1	cmnhq01kp004lil5gkguig1dn	\N
cmnhq01l5004vil5gc40ge8zo	cmmj8bec300gszyd2jjpi5hpb	2026-04-02 17:00:00.905	SUCCESS	1	cmnhq01l0004ril5ggwi170gk	\N
cmnhq01lf0051il5gvfku3pbm	cmmj8becf00gyzyd2mi1f0u91	2026-04-02 17:00:00.916	SUCCESS	1	cmnhq01ld004xil5g6g4m0ds0	\N
cmnhq01mn0059il5g0q97w59y	cmmj8beck00h3zyd2eihljyqw	2026-04-02 17:00:00.959	SUCCESS	1	cmnhq01md0055il5g8evc6smq	\N
cmnhq01n9005fil5gc4l76ylj	cmmj8becu00h8zyd230u3a52m	2026-04-02 17:00:00.981	SUCCESS	1	cmnhq01n3005bil5gor68ssc5	\N
cmnhq01o3005pil5g7qqha2o4	cmmj8becx00hdzyd27nueb0wz	2026-04-02 17:00:01.011	SUCCESS	1	cmnhq01nm005jil5gshu2o4rf	\N
cmnhq01ps0063il5g00s0bgeu	cmmj8bed500hhzyd2dodpoaq5	2026-04-02 17:00:01.072	SUCCESS	1	cmnhq01pl005zil5gk3fovhc8	\N
cmnhq01q9006fil5gv8km7kvm	cmmj8bee500hmzyd2qzbu29ma	2026-04-02 17:00:01.089	SUCCESS	1	cmnhq01q20069il5gsrm6b0pc	\N
cmnhq01qo006vil5g6eqy2kvg	cmmj8beeq00htzyd2bwso0i75	2026-04-02 17:00:01.105	SUCCESS	1	cmnhq01qi006nil5g2f0e69j1	\N
cmnhq01r6007bil5g8if91z4j	cmmj8beeq00hxzyd2hqri1d4t	2026-04-02 17:00:01.123	SUCCESS	1	cmnhq01r00073il5g3dqgocst	\N
cmnhq01rm007pil5g78svyr5l	cmmj8beew00i1zyd26iazc9z5	2026-04-02 17:00:01.138	SUCCESS	1	cmnhq01rg007jil5gwlqndpz8	\N
cmnhq01ry0083il5guu3b7lh6	cmmj8bef500i7zyd2sa79lqbl	2026-04-02 17:00:01.151	SUCCESS	1	cmnhq01ru007xil5gxpxlxc4a	\N
cmnhq01sc008dil5gllcbezil	cmmj8bef700ibzyd2jappjex2	2026-04-02 17:00:01.164	SUCCESS	1	cmnhq01s80089il5guiuv4e6d	\N
cmnhq01sn008jil5gcbf557tu	cmmj8beg400ihzyd2w9tmk3cp	2026-04-02 17:00:01.176	SUCCESS	1	cmnhq01sk008fil5g02c48kal	\N
\.


--
-- TOC entry 5878 (class 0 OID 203753)
-- Dependencies: 225
-- Data for Name: recurring_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_invoices (id, "clientId", "userId", "templateName", frequency, "intervalValue", "startDate", "endDate", "lastGenerated", "nextRunDate", "isActive", subtotal, "taxAmount", "totalAmount", "createdAt", "updatedAt") FROM stdin;
cmm6fingm00021klq7j0gp2lx	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	Monthly susbcription	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-28 00:00:00	t	465.00	0.00	465.00	2026-02-28 14:41:23.015	2026-04-02 17:00:00.408
cmm6xrdbu001s13hmewcees78	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	Recurring: INV-005	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-27 00:00:00	t	365.00	0.00	365.00	2026-02-28 23:12:02.766	2026-04-02 17:00:00.447
cmmj89tzm00dpzyd2jguoni3b	cmm47x6lz0039pdmhlznggcdn	cmm47pax500048s6ob25tkito	Recurring from INV-002	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	450.00	0.00	450.00	2026-03-09 13:39:34.496	2026-04-02 17:00:00.509
cmmj89tz900ddzyd2ullx18vg	cmm54h217002ts8x6qs5irdmh	cmm47pax500048s6ob25tkito	Recurring from INV-005	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.494	2026-04-02 17:00:00.524
cmmj89tz900dczyd2c1txdl3n	cmm540m4p001os8x6km8cvelc	cmm47pax500048s6ob25tkito	Recurring from INV-004	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	270.00	0.00	270.00	2026-03-09 13:39:34.494	2026-04-02 17:00:00.547
cmmj89tz900dezyd2k56h2kq3	cmm54ohzw003xs8x6p4nhgv8l	cmm47pax500048s6ob25tkito	Recurring from INV-007	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	465.00	0.00	465.00	2026-03-09 13:39:34.496	2026-04-02 17:00:00.57
cmmj89tzs00dszyd2hogf7b6f	cmm54kjqp003ds8x67pxwkczp	cmm47pax500048s6ob25tkito	Recurring from INV-006	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	300.00	0.00	300.00	2026-03-09 13:39:34.493	2026-04-02 17:00:00.582
cmmj89u5j00dyzyd2t7ahgotx	cmm551ver006ls8x65km4hqtw	cmm47pax500048s6ob25tkito	Recurring from INV-008	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.759	2026-04-02 17:00:00.595
cmmj89u5r00e2zyd29vk7ahn4	cmm554muh0074s8x6hn9a7048	cmm47pax500048s6ob25tkito	Recurring from INV-009	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	600.00	0.00	600.00	2026-03-09 13:39:34.767	2026-04-02 17:00:00.664
cmmj89u5z00e9zyd24jrdes3g	cmm557419007os8x6nailjge0	cmm47pax500048s6ob25tkito	Recurring from INV-010	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	350.00	0.00	350.00	2026-03-09 13:39:34.776	2026-04-02 17:00:00.677
cmmj89u6000eezyd2fpcvgxdr	cmm55a6s8008bs8x6h6fnp5yd	cmm47pax500048s6ob25tkito	Recurring from INV-011	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.776	2026-04-02 17:00:00.691
cmmj89u6500ejzyd2gfpga3fs	cmm55j1sz009fs8x62nkk3wym	cmm47pax500048s6ob25tkito	Recurring from INV-013	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	350.00	0.00	350.00	2026-03-09 13:39:34.781	2026-04-02 17:00:00.705
cmmj89u6700enzyd2u5ze7bfm	cmm55f2iq008ws8x6c9k8kvpl	cmm47pax500048s6ob25tkito	Recurring from INV-012	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.783	2026-04-02 17:00:00.717
cmmj89u7h00eszyd24v63u1fh	cmm55nh8g00a2s8x6rvry714w	cmm47pax500048s6ob25tkito	Recurring from INV-014	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.83	2026-04-02 17:00:00.731
cmmj89u8000exzyd28gqlpptp	cmm55r8pq00ams8x6i0lchg3w	cmm47pax500048s6ob25tkito	Recurring from INV-015	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.849	2026-04-02 17:00:00.745
cmmj89u8n00f3zyd2rrx5bm41	cmm55uhcv00b5s8x6xh6qqij3	cmm47pax500048s6ob25tkito	Recurring from INV-016	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	465.00	0.00	465.00	2026-03-09 13:39:34.871	2026-04-02 17:00:00.758
cmmj89u8r00f8zyd2yff3gz36	cmm55wz4x00bos8x6nnrkl8re	cmm47pax500048s6ob25tkito	Recurring from INV-017	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.875	2026-04-02 17:00:00.77
cmmj89u9000fdzyd248rf2vdw	cmm6f2oi90000zvp15rcvh9dq	cmm47pax500048s6ob25tkito	Recurring from INV-018	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	350.00	0.00	350.00	2026-03-09 13:39:34.884	2026-04-02 17:00:00.784
cmmj89u9500fhzyd2h7wek72w	cmm6fuy5g000q1klqcvvtfvcr	cmm47pax500048s6ob25tkito	Recurring from INV-019	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.89	2026-04-02 17:00:00.799
cmmj89u9w00fnzyd2j3l5j6ov	cmm6fwzea00191klqx8mfarvz	cmm47pax500048s6ob25tkito	Recurring from INV-020	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.917	2026-04-02 17:00:00.812
cmmj89u9z00frzyd2sezhyu3v	cmm6lh7k3002n1klq8jh12onn	cmm47pax500048s6ob25tkito	Recurring from INV-021	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:39:34.92	2026-04-02 17:00:00.824
cmmj8be9k00fyzyd2icx3ls9k	cmm6ljd7h00361klqff2544qa	cmm47pax500048s6ob25tkito	Recurring from INV-022	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.48	2026-04-02 17:00:00.836
cmmj8bea100g4zyd2n5ld0rcu	cmm6llpqi003q1klqf1ejb34c	cmm47pax500048s6ob25tkito	Recurring from INV-023	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.497	2026-04-02 17:00:00.848
cmmj8beac00g8zyd2n02ez2fw	cmm6lqnd2004b1klqtzti29rl	cmm47pax500048s6ob25tkito	Recurring from INV-024	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.508	2026-04-02 17:00:00.86
cmmj8beag00gfzyd2tanq0a6n	cmm6ltyls004u1klq3s6arqce	cmm47pax500048s6ob25tkito	Recurring from INV-025	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.512	2026-04-02 17:00:00.873
cmmj8beah00gjzyd291o41dqy	cmm6lvyqs005d1klqltorxkd7	cmm47pax500048s6ob25tkito	Recurring from INV-026	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	465.00	0.00	465.00	2026-03-09 13:40:47.514	2026-04-02 17:00:00.883
cmmj8beal00gnzyd2zd79wttj	cmm6ly0d0005x1klqmrye4jav	cmm47pax500048s6ob25tkito	Recurring from INV-027	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	350.00	0.00	350.00	2026-03-09 13:40:47.517	2026-04-02 17:00:00.896
cmmj8bec300gszyd2jjpi5hpb	cmm6lzufz006g1klqacvd1c71	cmm47pax500048s6ob25tkito	Recurring from INV-028	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	550.00	0.00	550.00	2026-03-09 13:40:47.571	2026-04-02 17:00:00.907
cmmj8becf00gyzyd2mi1f0u91	cmm6m2n1z00721klq0sctxew0	cmm47pax500048s6ob25tkito	Recurring from INV-029	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	350.00	0.00	350.00	2026-03-09 13:40:47.584	2026-04-02 17:00:00.917
cmmj8beck00h3zyd2eihljyqw	cmm6m4kb2007m1klquhr4s41u	cmm47pax500048s6ob25tkito	Recurring from INV-030	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	230.00	0.00	230.00	2026-03-09 13:40:47.588	2026-04-02 17:00:00.962
cmmj8becu00h8zyd230u3a52m	cmm6m7zmc00851klqhgp4clh1	cmm47pax500048s6ob25tkito	Recurring from INV-031	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.598	2026-04-02 17:00:00.984
cmmj8becx00hdzyd27nueb0wz	cmm6maqjf008p1klq0iyvmq8j	cmm47pax500048s6ob25tkito	Recurring from INV-032	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.602	2026-04-02 17:00:01.054
cmmj8bed500hhzyd2dodpoaq5	cmm6mcin600981klqhytyq4gf	cmm47pax500048s6ob25tkito	Recurring from INV-033	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.609	2026-04-02 17:00:01.074
cmmj8bee500hmzyd2qzbu29ma	cmm6me5qh009r1klq9lfn2jhx	cmm47pax500048s6ob25tkito	Recurring from INV-034	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.645	2026-04-02 17:00:01.092
cmmj8beeq00htzyd2bwso0i75	cmm6mglj9009t1klqm9q1uznw	cmm47pax500048s6ob25tkito	Recurring from INV-035	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.666	2026-04-02 17:00:01.109
cmmj8beeq00hxzyd2hqri1d4t	cmm6mjll100au1klqlwbnnjp9	cmm47pax500048s6ob25tkito	Recurring from INV-036	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	230.00	0.00	230.00	2026-03-09 13:40:47.667	2026-04-02 17:00:01.126
cmmj8beew00i1zyd26iazc9z5	cmm6movbm00be1klqnc8pn4f6	cmm47pax500048s6ob25tkito	Recurring from INV-037	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	300.00	0.00	300.00	2026-03-09 13:40:47.672	2026-04-02 17:00:01.14
cmmj8bef500i7zyd2sa79lqbl	cmm6mtbuc00ch1klq0odakxsn	cmm47pax500048s6ob25tkito	Recurring from INV-039	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.682	2026-04-02 17:00:01.154
cmmj8bef700ibzyd2jappjex2	cmm6mrbxw00bx1klq6snmtbyb	cmm47pax500048s6ob25tkito	Recurring from INV-038	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.683	2026-04-02 17:00:01.166
cmmj8beg400ihzyd2w9tmk3cp	cmm6mvjxx00d01klqrij7sk43	cmm47pax500048s6ob25tkito	Recurring from INV-040	MONTHLY	1	2026-03-25 00:00:00	\N	2026-04-02 17:00:00.047	2026-04-25 00:00:00	t	365.00	0.00	365.00	2026-03-09 13:40:47.716	2026-04-02 17:00:01.178
\.


--
-- TOC entry 5923 (class 0 OID 204773)
-- Dependencies: 270
-- Data for Name: recurring_journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_journal_entries (id, name, memo, frequency, "nextRunDate", "linesJson", "isActive", "lastRunAt", "createdByUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5915 (class 0 OID 204611)
-- Dependencies: 262
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions ("roleId", "permissionId") FROM stdin;
cmm47nd92001efkjomsza7g97	cmm47nd740000fkjo991ousum
cmm47nd92001efkjomsza7g97	cmm47nd780001fkjokvkv35i0
cmm47nd92001efkjomsza7g97	cmm47nd7a0002fkjo1wt6mrei
cmm47nd92001efkjomsza7g97	cmm47nd7c0003fkjoanguq9xl
cmm47nd92001efkjomsza7g97	cmm47nd7d0004fkjoq3qk7fnt
cmm47nd92001efkjomsza7g97	cmm47nd7f0005fkjouv5nscv2
cmm47nd92001efkjomsza7g97	cmm47nd7h0006fkjo9y4s4okp
cmm47nd92001efkjomsza7g97	cmm47nd7i0007fkjo45htuz8w
cmm47nd92001efkjomsza7g97	cmm47nd7j0008fkjotrklzl16
cmm47nd92001efkjomsza7g97	cmm47nd7l0009fkjof7ivoa12
cmm47nd92001efkjomsza7g97	cmm47nd7m000afkjooqn0n4c6
cmm47nd92001efkjomsza7g97	cmm47nd7o000bfkjoc1fac673
cmm47nd92001efkjomsza7g97	cmm47nd7p000cfkjo898jxb3o
cmm47nd92001efkjomsza7g97	cmm47nd7q000dfkjorwoo01cz
cmm47nd92001efkjomsza7g97	cmm47nd7r000efkjo3scsjagw
cmm47nd92001efkjomsza7g97	cmm47nd7s000ffkjoehnlu4gb
cmm47nd92001efkjomsza7g97	cmm47nd7t000gfkjotd47qle6
cmm47nd92001efkjomsza7g97	cmm47nd7u000hfkjo6b6scqhq
cmm47nd92001efkjomsza7g97	cmm47nd7v000ifkjosxl2nelw
cmm47nd92001efkjomsza7g97	cmm47nd7x000jfkjo744wpkef
cmm47nd92001efkjomsza7g97	cmm47nd7z000kfkjom0oh8km9
cmm47nd92001efkjomsza7g97	cmm47nd80000lfkjohs0d50tj
cmm47nd92001efkjomsza7g97	cmm47nd81000mfkjovo3fk60k
cmm47nd92001efkjomsza7g97	cmm47nd83000nfkjot24jffvf
cmm47nd92001efkjomsza7g97	cmm47nd84000ofkjoja5tztnh
cmm47nd92001efkjomsza7g97	cmm47nd85000pfkjofm5a1lvu
cmm47nd92001efkjomsza7g97	cmm47nd86000qfkjo03ldozzg
cmm47nd92001efkjomsza7g97	cmm47nd88000rfkjos7hxox41
cmm47nd92001efkjomsza7g97	cmm47nd89000sfkjo6kw05a8l
cmm47nd92001efkjomsza7g97	cmm47nd8a000tfkjo6dbbadr0
cmm47nd92001efkjomsza7g97	cmm47nd8b000ufkjo40kgqbr1
cmm47nd92001efkjomsza7g97	cmm47nd8d000vfkjoywflhl66
cmm47nd92001efkjomsza7g97	cmm47nd8f000wfkjol90v665w
cmm47nd92001efkjomsza7g97	cmm47nd8g000xfkjo8qby7wjm
cmm47nd92001efkjomsza7g97	cmm47nd8h000yfkjo317fiqs7
cmm47nd92001efkjomsza7g97	cmm47nd8i000zfkjobm419abe
cmm47nd92001efkjomsza7g97	cmm47nd8j0010fkjotq5b8lwj
cmm47nd92001efkjomsza7g97	cmm47nd8k0011fkjo44hc7qkz
cmm47nd92001efkjomsza7g97	cmm47nd8l0012fkjolyft2fav
cmm47nd92001efkjomsza7g97	cmm47nd8m0013fkjo4mv5d7qs
cmm47nd92001efkjomsza7g97	cmm47nd8n0014fkjo7pqq59li
cmm47nd92001efkjomsza7g97	cmm47nd8o0015fkjo9ssdd9iz
cmm47nd92001efkjomsza7g97	cmm47nd8p0016fkjoklpei5bx
cmm47nd92001efkjomsza7g97	cmm47nd8p0017fkjo2h4gt7hd
cmm47nd92001efkjomsza7g97	cmm47nd8q0018fkjoj47nnl3v
cmm47nd92001efkjomsza7g97	cmm47nd8s0019fkjo5owxtnrp
cmm47nd92001efkjomsza7g97	cmm47nd8u001afkjotmh2lke0
cmm47nd92001efkjomsza7g97	cmm47nd8w001bfkjonz0h2uyg
cmm47nd92001efkjomsza7g97	cmm47nd8x001cfkjovozejjvy
cmm47nd92001efkjomsza7g97	cmm47nd8y001dfkjok2y23r2l
cmm47nd97001ffkjo24dxfchb	cmm47nd740000fkjo991ousum
cmm47nd97001ffkjo24dxfchb	cmm47nd780001fkjokvkv35i0
cmm47nd97001ffkjo24dxfchb	cmm47nd7a0002fkjo1wt6mrei
cmm47nd97001ffkjo24dxfchb	cmm47nd7c0003fkjoanguq9xl
cmm47nd97001ffkjo24dxfchb	cmm47nd7d0004fkjoq3qk7fnt
cmm47nd97001ffkjo24dxfchb	cmm47nd7f0005fkjouv5nscv2
cmm47nd97001ffkjo24dxfchb	cmm47nd7h0006fkjo9y4s4okp
cmm47nd97001ffkjo24dxfchb	cmm47nd7i0007fkjo45htuz8w
cmm47nd97001ffkjo24dxfchb	cmm47nd7j0008fkjotrklzl16
cmm47nd97001ffkjo24dxfchb	cmm47nd7l0009fkjof7ivoa12
cmm47nd97001ffkjo24dxfchb	cmm47nd7m000afkjooqn0n4c6
cmm47nd97001ffkjo24dxfchb	cmm47nd7o000bfkjoc1fac673
cmm47nd97001ffkjo24dxfchb	cmm47nd7p000cfkjo898jxb3o
cmm47nd97001ffkjo24dxfchb	cmm47nd7q000dfkjorwoo01cz
cmm47nd97001ffkjo24dxfchb	cmm47nd7r000efkjo3scsjagw
cmm47nd97001ffkjo24dxfchb	cmm47nd7s000ffkjoehnlu4gb
cmm47nd97001ffkjo24dxfchb	cmm47nd7t000gfkjotd47qle6
cmm47nd97001ffkjo24dxfchb	cmm47nd7u000hfkjo6b6scqhq
cmm47nd97001ffkjo24dxfchb	cmm47nd7v000ifkjosxl2nelw
cmm47nd97001ffkjo24dxfchb	cmm47nd7x000jfkjo744wpkef
cmm47nd97001ffkjo24dxfchb	cmm47nd7z000kfkjom0oh8km9
cmm47nd97001ffkjo24dxfchb	cmm47nd80000lfkjohs0d50tj
cmm47nd97001ffkjo24dxfchb	cmm47nd81000mfkjovo3fk60k
cmm47nd97001ffkjo24dxfchb	cmm47nd83000nfkjot24jffvf
cmm47nd97001ffkjo24dxfchb	cmm47nd84000ofkjoja5tztnh
cmm47nd97001ffkjo24dxfchb	cmm47nd85000pfkjofm5a1lvu
cmm47nd97001ffkjo24dxfchb	cmm47nd86000qfkjo03ldozzg
cmm47nd97001ffkjo24dxfchb	cmm47nd88000rfkjos7hxox41
cmm47nd97001ffkjo24dxfchb	cmm47nd89000sfkjo6kw05a8l
cmm47nd97001ffkjo24dxfchb	cmm47nd8a000tfkjo6dbbadr0
cmm47nd97001ffkjo24dxfchb	cmm47nd8b000ufkjo40kgqbr1
cmm47nd97001ffkjo24dxfchb	cmm47nd8d000vfkjoywflhl66
cmm47nd97001ffkjo24dxfchb	cmm47nd8f000wfkjol90v665w
cmm47nd97001ffkjo24dxfchb	cmm47nd8g000xfkjo8qby7wjm
cmm47nd97001ffkjo24dxfchb	cmm47nd8h000yfkjo317fiqs7
cmm47nd97001ffkjo24dxfchb	cmm47nd8i000zfkjobm419abe
cmm47nd97001ffkjo24dxfchb	cmm47nd8j0010fkjotq5b8lwj
cmm47nd97001ffkjo24dxfchb	cmm47nd8k0011fkjo44hc7qkz
cmm47nd97001ffkjo24dxfchb	cmm47nd8l0012fkjolyft2fav
cmm47nd97001ffkjo24dxfchb	cmm47nd8m0013fkjo4mv5d7qs
cmm47nd97001ffkjo24dxfchb	cmm47nd8o0015fkjo9ssdd9iz
cmm47nd97001ffkjo24dxfchb	cmm47nd8p0016fkjoklpei5bx
cmm47nd97001ffkjo24dxfchb	cmm47nd8p0017fkjo2h4gt7hd
cmm47nd97001ffkjo24dxfchb	cmm47nd8q0018fkjoj47nnl3v
cmm47nd97001ffkjo24dxfchb	cmm47nd8s0019fkjo5owxtnrp
cmm47nd97001ffkjo24dxfchb	cmm47nd8u001afkjotmh2lke0
cmm47nd97001ffkjo24dxfchb	cmm47nd8w001bfkjonz0h2uyg
cmm47nd97001ffkjo24dxfchb	cmm47nd8x001cfkjovozejjvy
cmm47nd97001ffkjo24dxfchb	cmm47nd8y001dfkjok2y23r2l
cmm47nd9a001gfkjo9wlkqld9	cmm47nd740000fkjo991ousum
cmm47nd9a001gfkjo9wlkqld9	cmm47nd780001fkjokvkv35i0
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7a0002fkjo1wt6mrei
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7f0005fkjouv5nscv2
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7h0006fkjo9y4s4okp
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7i0007fkjo45htuz8w
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7j0008fkjotrklzl16
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7q000dfkjorwoo01cz
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7r000efkjo3scsjagw
cmm47nd9a001gfkjo9wlkqld9	cmm47nd7z000kfkjom0oh8km9
cmm47nd9a001gfkjo9wlkqld9	cmm47nd80000lfkjohs0d50tj
cmm47nd9a001gfkjo9wlkqld9	cmm47nd81000mfkjovo3fk60k
cmm47nd9a001gfkjo9wlkqld9	cmm47nd84000ofkjoja5tztnh
cmm47nd9a001gfkjo9wlkqld9	cmm47nd85000pfkjofm5a1lvu
cmm47nd9a001gfkjo9wlkqld9	cmm47nd86000qfkjo03ldozzg
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8j0010fkjotq5b8lwj
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8k0011fkjo44hc7qkz
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8o0015fkjo9ssdd9iz
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8p0016fkjoklpei5bx
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8p0017fkjo2h4gt7hd
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8x001cfkjovozejjvy
cmm47nd9a001gfkjo9wlkqld9	cmm47nd8y001dfkjok2y23r2l
\.


--
-- TOC entry 5913 (class 0 OID 204594)
-- Dependencies: 260
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "isSystem", color, "createdAt", "updatedAt") FROM stdin;
cmm47nd92001efkjomsza7g97	Admin	Full access to all features	t	#7c3aed	2026-02-27 01:25:33.782	2026-02-27 01:25:33.782
cmm47nd97001ffkjo24dxfchb	Manager	Manage day-to-day operations, limited settings access	t	#0891b2	2026-02-27 01:25:33.788	2026-02-27 01:25:33.788
cmm47nd9a001gfkjo9wlkqld9	Accountant	Create and edit invoices, payments, and basic reports	t	#059669	2026-02-27 01:25:33.791	2026-02-27 01:25:33.791
\.


--
-- TOC entry 5944 (class 0 OID 276573)
-- Dependencies: 291
-- Data for Name: service_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_plans (id, name, description, "downloadSpeed", "uploadSpeed", "monthlyPrice", "dataCapGb", "isActive", "ownerCompanyName", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5917 (class 0 OID 204654)
-- Dependencies: 264
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, name, price, "billingCycle", "featuresJson", "isActive", "createdAt", "updatedAt", "stripePriceId") FROM stdin;
cmm47ndaa001hfkjop6um0l8u	STARTER	250.00	monthly	{"features": ["Up to 5 users", "Basic invoicing", "Expense tracking"]}	t	2026-02-27 01:25:33.826	2026-02-27 01:25:33.826	price_1T9CWUIkvK4hmwzxUSV4ycQA
cmm47ndaf001ifkjo39jrao2b	GROWTH	350.00	monthly	{"features": ["Up to 15 users", "Advanced invoicing", "Reports", "Recurring invoices"]}	t	2026-02-27 01:25:33.832	2026-02-27 01:25:33.832	price_1T9CWxIkvK4hmwzxN1wkqfkB
cmm47ndah001jfkjog4mkq1cp	PROFESSIONAL	450.00	monthly	{"features": ["Unlimited users", "Full accounting", "Priority support", "API access"]}	t	2026-02-27 01:25:33.833	2026-02-27 01:25:33.833	price_1T9CXGIkvK4hmwzxnSYATtKF
\.


--
-- TOC entry 5906 (class 0 OID 204424)
-- Dependencies: 253
-- Data for Name: supplier_payment_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_payment_allocations (id, "paymentId", "billId", amount, "createdAt") FROM stdin;
cmm6o3sth00038nodv8gqyf1i	cmm6o3st700028nodwk3gwk7c	cmm6nj44n00ed1klqdm4z3naf	914.25	2026-02-28 18:41:46.661
\.


--
-- TOC entry 5905 (class 0 OID 204413)
-- Dependencies: 252
-- Data for Name: supplier_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_payments (id, "paymentNumber", "supplierId", "userId", amount, "unallocatedAmount", status, method, reference, notes, "paymentDate", "processedAt", "voidedAt", "voidReason", "journalEntryId", "createdAt", "updatedAt") FROM stdin;
cmm6o3st700028nodwk3gwk7c	SPAY-001	cmm6nbyic00e81klqvju1ivxv	cmm47pax500048s6ob25tkito	914.25	0.00	COMPLETED	BANK_TRANSFER	\N	\N	2026-02-28 18:41:46.652	2026-02-28 18:41:46.712	\N	\N	cmm6o3sui000d8nod9c1zg6ff	2026-02-28 18:41:46.652	2026-02-28 18:41:46.713
\.


--
-- TOC entry 5904 (class 0 OID 204360)
-- Dependencies: 251
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, "supplierSeq", "supplierName", "companyName", "contactPerson", email, phone, address, "taxNumber", "paymentTermsDays", status, notes, "createdAt", "updatedAt", "creditBalance", "outstandingBalance", "totalBilled", "totalPaid", "ownerCompanyName") FROM stdin;
cmm6n9fq800e61klq4vv80l9d	1	Scoop Distribution (Pty) Ltd	Scoop Distribution (Pty) Ltd	Lorenzo	shannon@scoop.co.za	+27 21 555 4740	1A Harvest Cl, Richwood, Cape Town, 7441, South Africa	4830195584	30	ACTIVE	\N	2026-02-28 18:18:10.015	2026-02-28 18:18:10.015	0.00	0.00	0.00	0.00	Bretune Technologies
cmm6nec3900e91klqziuhrqzc	3	Nuraan Sassman	Nuraan Sassman	Nuraan	\N	+27 83 594 9395	\N	\N	30	ACTIVE	Highsite	2026-02-28 18:21:58.582	2026-02-28 18:22:16.568	0.00	0.00	0.00	0.00	Bretune Technologies
cmm6nbyic00e81klqvju1ivxv	2	Get Wiza	Get Wiza	Chad	connect@getwiza.com	+27 21 204 4878	Durbanville, Cape Town	\N	30	ACTIVE	\N	2026-02-28 18:20:07.668	2026-02-28 18:41:46.735	0.00	0.00	914.25	914.25	Bretune Technologies
\.


--
-- TOC entry 5901 (class 0 OID 204220)
-- Dependencies: 248
-- Data for Name: task_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_activities (id, "taskId", "actorUserId", action, "fromStatus", "toStatus", meta, "createdAt") FROM stdin;
cmm6ygi1v00048ohkydx8hr92	cmm6ygi1500028ohk718t6v76	cmm47pax500048s6ob25tkito	CREATED	\N	\N	{"title": "ghjhg"}	2026-02-28 23:31:35.395
cmmivgkrd006hkem8kdg9ko43	cmm6ygi1500028ohk718t6v76	cmm47pax500048s6ob25tkito	COMPLETED	PENDING	COMPLETED	\N	2026-03-09 07:40:54.169
\.


--
-- TOC entry 5902 (class 0 OID 204228)
-- Dependencies: 249
-- Data for Name: task_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_notifications (id, "taskId", "userId", type, "scheduledAt", "sentAt", "readAt", "createdAt") FROM stdin;
cmm6ygi2600068ohk2yt1k5nj	cmm6ygi1500028ohk718t6v76	cmm47pax500048s6ob25tkito	REMINDER	2026-03-01 04:36:00	\N	\N	2026-02-28 23:31:35.406
\.


--
-- TOC entry 5898 (class 0 OID 204195)
-- Dependencies: 245
-- Data for Name: task_recurrences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_recurrences (id, frequency, "intervalValue", "startDate", "endDate", "lastGenerated", "nextRunDate", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5900 (class 0 OID 204206)
-- Dependencies: 247
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, "taskSeq", title, description, type, priority, status, "dueDate", "reminderEnabled", "reminderAt", "isTemplate", "generatedFromTaskId", "assignedUserId", "assignedEmployeeId", "clientId", "invoiceId", "billId", "projectId", "recurrenceId", "createdByUserId", "completedAt", "cancelledAt", "createdAt", "updatedAt", address) FROM stdin;
cmm6ygi1500028ohk718t6v76	1	ghjhg	fggfhg	SUPPORT	MEDIUM	COMPLETED	2026-03-01 14:30:00	t	2026-03-01 04:36:00	f	\N	cmm47pax500048s6ob25tkito	\N	cmm55cbe3008us8x6p33kz5mb	\N	\N	\N	\N	cmm47pax500048s6ob25tkito	2026-03-09 07:40:54.111	\N	2026-02-28 23:31:35.369	2026-03-09 07:40:54.114	27 Luntu Rd, Masiphumelele, Cape Town, Western Cape, South Africa, 7975
\.


--
-- TOC entry 5871 (class 0 OID 203675)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", role, "isActive", "refreshToken", "lastLogin", "createdAt", "updatedAt", "companyName", "userNumber", "roleId", "companyId") FROM stdin;
cmm4zhe5z013a1vs3vdkx1i3f	fummah3@gmail.com	$2a$12$XVlLNMCXGBCmaJBEKXru8OanraRKVmLOJO.N3s1GPYHkuhKDI3JSO	Fortune	Matenda	ADMIN	t	$2a$12$BFAk8lIcv398iTdSr06.EuKnuICuRRF4m.FPHiUAEZ5Rx6YDBCw3e	2026-02-27 20:42:20.984	2026-02-27 14:24:44.278	2026-02-27 20:42:20.997	Dziva T	2	\N	cmm4zhe3b01361vs3dxk98b9o
cmm47pax500048s6ob25tkito	fortunematenda@gmail.com	$2a$12$NPQebYpSXOKMbJN1N4FPiuMCeBPIWMbueEXprfLGbB5iQQ.clfKTW	Fortune	Matenda	ADMIN	t	$2a$12$r7xweKucKBWnYOVYiNYhMehd/k3FLjTXGqPTbGvtyo.1ojPhAcBsS	2026-04-02 18:49:34.011	2026-02-27 01:27:04.074	2026-04-02 18:49:34.017	Bretune Technologies	1	\N	cmm47pawm00008s6o8eq8i8y7
cmmael1y10005kgp4vea5fi0c	chris@gmail.com	$2a$12$wTKQvPRcHhI8ALwxnnZtBeKz51ezPo6vrH4A/AsVkIRtOk4IWZhSy	Chris	Hendricks	ADMIN	t	$2a$12$BGzG4dD3mDmrYZ8FVEfAAOnVFLMGHC9CxTof3YuUSi3CYfMjnCKA6	2026-03-03 11:27:16.152	2026-03-03 09:26:20.186	2026-03-03 11:27:16.155	Bluedog Technologies	3	\N	cmmael1we0001kgp4revaocoi
\.


--
-- TOC entry 5962 (class 0 OID 0)
-- Dependencies: 243
-- Name: bills_billNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."bills_billNumber_seq"', 1, true);


--
-- TOC entry 5963 (class 0 OID 0)
-- Dependencies: 235
-- Name: clients_clientSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."clients_clientSeq_seq"', 50, true);


--
-- TOC entry 5964 (class 0 OID 0)
-- Dependencies: 239
-- Name: employees_employeeNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."employees_employeeNumber_seq"', 1, false);


--
-- TOC entry 5965 (class 0 OID 0)
-- Dependencies: 258
-- Name: expenses_expenseSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."expenses_expenseSeq_seq"', 1, false);


--
-- TOC entry 5966 (class 0 OID 0)
-- Dependencies: 232
-- Name: invoices_invoiceSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."invoices_invoiceSeq_seq"', 92, true);


--
-- TOC entry 5967 (class 0 OID 0)
-- Dependencies: 241
-- Name: projects_projectNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."projects_projectNumber_seq"', 1, false);


--
-- TOC entry 5968 (class 0 OID 0)
-- Dependencies: 233
-- Name: quotes_quoteSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."quotes_quoteSeq_seq"', 1, true);


--
-- TOC entry 5969 (class 0 OID 0)
-- Dependencies: 250
-- Name: suppliers_supplierSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."suppliers_supplierSeq_seq"', 3, true);


--
-- TOC entry 5970 (class 0 OID 0)
-- Dependencies: 246
-- Name: tasks_taskSeq_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."tasks_taskSeq_seq"', 1, true);


--
-- TOC entry 5971 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_userNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users_userNumber_seq"', 3, true);


--
-- TOC entry 5317 (class 2606 OID 203583)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5539 (class 2606 OID 204825)
-- Name: accounting_entities accounting_entities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounting_entities
    ADD CONSTRAINT accounting_entities_pkey PRIMARY KEY (id);


--
-- TOC entry 5531 (class 2606 OID 204772)
-- Name: accounting_periods accounting_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounting_periods
    ADD CONSTRAINT accounting_periods_pkey PRIMARY KEY (id);


--
-- TOC entry 5600 (class 2606 OID 276591)
-- Name: ai_suggestions ai_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_suggestions
    ADD CONSTRAINT ai_suggestions_pkey PRIMARY KEY (id);


--
-- TOC entry 5549 (class 2606 OID 204869)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5607 (class 2606 OID 276593)
-- Name: automation_rules automation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT automation_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 5527 (class 2606 OID 204763)
-- Name: bank_reconciliation_matches bank_reconciliation_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliation_matches
    ADD CONSTRAINT bank_reconciliation_matches_pkey PRIMARY KEY (id);


--
-- TOC entry 5519 (class 2606 OID 204747)
-- Name: bank_reconciliations bank_reconciliations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT bank_reconciliations_pkey PRIMARY KEY (id);


--
-- TOC entry 5523 (class 2606 OID 204755)
-- Name: bank_statement_lines bank_statement_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_statement_lines
    ADD CONSTRAINT bank_statement_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 5579 (class 2606 OID 221845)
-- Name: bank_transactions bank_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transactions
    ADD CONSTRAINT bank_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5410 (class 2606 OID 204194)
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- TOC entry 5573 (class 2606 OID 221822)
-- Name: business_bank_accounts business_bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_bank_accounts
    ADD CONSTRAINT business_bank_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5612 (class 2606 OID 276595)
-- Name: client_network_links client_network_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_network_links
    ADD CONSTRAINT client_network_links_pkey PRIMARY KEY (id);


--
-- TOC entry 5507 (class 2606 OID 204653)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 5388 (class 2606 OID 204052)
-- Name: company_settings company_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5514 (class 2606 OID 204672)
-- Name: company_subscriptions company_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_subscriptions
    ADD CONSTRAINT company_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 5541 (class 2606 OID 204842)
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (code);


--
-- TOC entry 5584 (class 2606 OID 240486)
-- Name: customer_documents customer_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_documents
    ADD CONSTRAINT customer_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5329 (class 2606 OID 203700)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 5560 (class 2606 OID 204932)
-- Name: depreciation_runs depreciation_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.depreciation_runs
    ADD CONSTRAINT depreciation_runs_pkey PRIMARY KEY (id);


--
-- TOC entry 5381 (class 2606 OID 203977)
-- Name: document_counters document_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_counters
    ADD CONSTRAINT document_counters_pkey PRIMARY KEY (key);


--
-- TOC entry 5376 (class 2606 OID 203922)
-- Name: email_outbox email_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_outbox
    ADD CONSTRAINT email_outbox_pkey PRIMARY KEY (id);


--
-- TOC entry 5398 (class 2606 OID 204171)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 5545 (class 2606 OID 204850)
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (id);


--
-- TOC entry 5486 (class 2606 OID 204557)
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5493 (class 2606 OID 204571)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 5556 (class 2606 OID 204922)
-- Name: fixed_assets fixed_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_pkey PRIMARY KEY (id);


--
-- TOC entry 5552 (class 2606 OID 204898)
-- Name: inventory_movements inventory_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT inventory_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 5355 (class 2606 OID 203752)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5351 (class 2606 OID 203743)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5379 (class 2606 OID 203930)
-- Name: job_locks job_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_locks
    ADD CONSTRAINT job_locks_pkey PRIMARY KEY (name);


--
-- TOC entry 5476 (class 2606 OID 204451)
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5483 (class 2606 OID 204461)
-- Name: journal_lines journal_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT journal_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 5470 (class 2606 OID 204441)
-- Name: ledger_accounts ledger_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ledger_accounts
    ADD CONSTRAINT ledger_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5596 (class 2606 OID 244950)
-- Name: loan_repayments loan_repayments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_repayments
    ADD CONSTRAINT loan_repayments_pkey PRIMARY KEY (id);


--
-- TOC entry 5591 (class 2606 OID 244942)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 5619 (class 2606 OID 276597)
-- Name: network_alerts network_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_alerts
    ADD CONSTRAINT network_alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 5625 (class 2606 OID 276599)
-- Name: network_devices network_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_devices
    ADD CONSTRAINT network_devices_pkey PRIMARY KEY (id);


--
-- TOC entry 5630 (class 2606 OID 276601)
-- Name: network_interfaces network_interfaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_interfaces
    ADD CONSTRAINT network_interfaces_pkey PRIMARY KEY (id);


--
-- TOC entry 5383 (class 2606 OID 204036)
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- TOC entry 5569 (class 2606 OID 204969)
-- Name: pay_run_lines pay_run_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pay_run_lines
    ADD CONSTRAINT pay_run_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 5564 (class 2606 OID 204959)
-- Name: pay_runs pay_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pay_runs
    ADD CONSTRAINT pay_runs_pkey PRIMARY KEY (id);


--
-- TOC entry 5392 (class 2606 OID 204070)
-- Name: payment_allocations payment_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_allocations
    ADD CONSTRAINT payment_allocations_pkey PRIMARY KEY (id);


--
-- TOC entry 5366 (class 2606 OID 203773)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5502 (class 2606 OID 204610)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5335 (class 2606 OID 203711)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 5401 (class 2606 OID 204182)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 5344 (class 2606 OID 203731)
-- Name: quote_items quote_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT quote_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5339 (class 2606 OID 203722)
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- TOC entry 5368 (class 2606 OID 203872)
-- Name: recurring_invoice_items recurring_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_items
    ADD CONSTRAINT recurring_invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5371 (class 2606 OID 203911)
-- Name: recurring_invoice_runs recurring_invoice_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_runs
    ADD CONSTRAINT recurring_invoice_runs_pkey PRIMARY KEY (id);


--
-- TOC entry 5359 (class 2606 OID 203763)
-- Name: recurring_invoices recurring_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT recurring_invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5536 (class 2606 OID 204781)
-- Name: recurring_journal_entries recurring_journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_journal_entries
    ADD CONSTRAINT recurring_journal_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5504 (class 2606 OID 204617)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY ("roleId", "permissionId");


--
-- TOC entry 5499 (class 2606 OID 204602)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5634 (class 2606 OID 276603)
-- Name: service_plans service_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_plans
    ADD CONSTRAINT service_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 5510 (class 2606 OID 204663)
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 5466 (class 2606 OID 204431)
-- Name: supplier_payment_allocations supplier_payment_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payment_allocations
    ADD CONSTRAINT supplier_payment_allocations_pkey PRIMARY KEY (id);


--
-- TOC entry 5460 (class 2606 OID 204423)
-- Name: supplier_payments supplier_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT supplier_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5451 (class 2606 OID 204370)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 5438 (class 2606 OID 204227)
-- Name: task_activities task_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 5441 (class 2606 OID 204236)
-- Name: task_notifications task_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_notifications
    ADD CONSTRAINT task_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5417 (class 2606 OID 204204)
-- Name: task_recurrences task_recurrences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_recurrences
    ADD CONSTRAINT task_recurrences_pkey PRIMARY KEY (id);


--
-- TOC entry 5428 (class 2606 OID 204219)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 5321 (class 2606 OID 203684)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5537 (class 1259 OID 204826)
-- Name: accounting_entities_companyId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "accounting_entities_companyId_code_key" ON public.accounting_entities USING btree ("companyId", code);


--
-- TOC entry 5532 (class 1259 OID 204789)
-- Name: accounting_periods_startDate_endDate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "accounting_periods_startDate_endDate_key" ON public.accounting_periods USING btree ("startDate", "endDate");


--
-- TOC entry 5533 (class 1259 OID 204790)
-- Name: accounting_periods_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX accounting_periods_status_idx ON public.accounting_periods USING btree (status);


--
-- TOC entry 5597 (class 1259 OID 276604)
-- Name: ai_suggestions_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_suggestions_createdAt_idx" ON public.ai_suggestions USING btree ("createdAt");


--
-- TOC entry 5598 (class 1259 OID 276605)
-- Name: ai_suggestions_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_suggestions_ownerCompanyName_idx" ON public.ai_suggestions USING btree ("ownerCompanyName");


--
-- TOC entry 5601 (class 1259 OID 276606)
-- Name: ai_suggestions_sourceEntityType_sourceEntityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_suggestions_sourceEntityType_sourceEntityId_idx" ON public.ai_suggestions USING btree ("sourceEntityType", "sourceEntityId");


--
-- TOC entry 5602 (class 1259 OID 276607)
-- Name: ai_suggestions_type_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ai_suggestions_type_status_idx ON public.ai_suggestions USING btree (type, status);


--
-- TOC entry 5546 (class 1259 OID 204871)
-- Name: audit_logs_changedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_changedAt_idx" ON public.audit_logs USING btree ("changedAt");


--
-- TOC entry 5547 (class 1259 OID 204870)
-- Name: audit_logs_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_entityType_entityId_idx" ON public.audit_logs USING btree ("entityType", "entityId");


--
-- TOC entry 5603 (class 1259 OID 276608)
-- Name: automation_rules_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX automation_rules_action_idx ON public.automation_rules USING btree (action);


--
-- TOC entry 5604 (class 1259 OID 276609)
-- Name: automation_rules_isActive_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "automation_rules_isActive_priority_idx" ON public.automation_rules USING btree ("isActive", priority);


--
-- TOC entry 5605 (class 1259 OID 276610)
-- Name: automation_rules_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "automation_rules_ownerCompanyName_idx" ON public.automation_rules USING btree ("ownerCompanyName");


--
-- TOC entry 5525 (class 1259 OID 204787)
-- Name: bank_reconciliation_matches_journalLineId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_reconciliation_matches_journalLineId_idx" ON public.bank_reconciliation_matches USING btree ("journalLineId");


--
-- TOC entry 5528 (class 1259 OID 204786)
-- Name: bank_reconciliation_matches_reconciliationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_reconciliation_matches_reconciliationId_idx" ON public.bank_reconciliation_matches USING btree ("reconciliationId");


--
-- TOC entry 5529 (class 1259 OID 204788)
-- Name: bank_reconciliation_matches_reconciliationId_statementLineId_jo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "bank_reconciliation_matches_reconciliationId_statementLineId_jo" ON public.bank_reconciliation_matches USING btree ("reconciliationId", "statementLineId", "journalLineId");


--
-- TOC entry 5516 (class 1259 OID 204782)
-- Name: bank_reconciliations_accountCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_reconciliations_accountCode_idx" ON public.bank_reconciliations USING btree ("accountCode");


--
-- TOC entry 5517 (class 1259 OID 221825)
-- Name: bank_reconciliations_bankAccountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_reconciliations_bankAccountId_idx" ON public.bank_reconciliations USING btree ("bankAccountId");


--
-- TOC entry 5520 (class 1259 OID 204783)
-- Name: bank_reconciliations_statementDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_reconciliations_statementDate_idx" ON public.bank_reconciliations USING btree ("statementDate");


--
-- TOC entry 5521 (class 1259 OID 204784)
-- Name: bank_reconciliations_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_reconciliations_status_idx ON public.bank_reconciliations USING btree (status);


--
-- TOC entry 5524 (class 1259 OID 204785)
-- Name: bank_statement_lines_reconciliationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_statement_lines_reconciliationId_idx" ON public.bank_statement_lines USING btree ("reconciliationId");


--
-- TOC entry 5574 (class 1259 OID 221846)
-- Name: bank_transactions_bankAccountId_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "bank_transactions_bankAccountId_hash_key" ON public.bank_transactions USING btree ("bankAccountId", hash);


--
-- TOC entry 5575 (class 1259 OID 221847)
-- Name: bank_transactions_bankAccountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transactions_bankAccountId_idx" ON public.bank_transactions USING btree ("bankAccountId");


--
-- TOC entry 5576 (class 1259 OID 221849)
-- Name: bank_transactions_isReconciled_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transactions_isReconciled_idx" ON public.bank_transactions USING btree ("isReconciled");


--
-- TOC entry 5577 (class 1259 OID 221850)
-- Name: bank_transactions_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transactions_ownerCompanyName_idx" ON public.bank_transactions USING btree ("ownerCompanyName");


--
-- TOC entry 5580 (class 1259 OID 221848)
-- Name: bank_transactions_transactionDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transactions_transactionDate_idx" ON public.bank_transactions USING btree ("transactionDate");


--
-- TOC entry 5404 (class 1259 OID 204248)
-- Name: bills_billDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bills_billDate_idx" ON public.bills USING btree ("billDate");


--
-- TOC entry 5405 (class 1259 OID 204244)
-- Name: bills_billNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "bills_billNumber_key" ON public.bills USING btree ("billNumber");


--
-- TOC entry 5406 (class 1259 OID 204245)
-- Name: bills_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bills_clientId_idx" ON public.bills USING btree ("clientId");


--
-- TOC entry 5407 (class 1259 OID 204482)
-- Name: bills_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bills_journalEntryId_idx" ON public.bills USING btree ("journalEntryId");


--
-- TOC entry 5408 (class 1259 OID 204480)
-- Name: bills_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "bills_journalEntryId_key" ON public.bills USING btree ("journalEntryId");


--
-- TOC entry 5411 (class 1259 OID 204247)
-- Name: bills_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bills_status_idx ON public.bills USING btree (status);


--
-- TOC entry 5412 (class 1259 OID 204481)
-- Name: bills_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bills_supplierId_idx" ON public.bills USING btree ("supplierId");


--
-- TOC entry 5413 (class 1259 OID 204246)
-- Name: bills_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bills_userId_idx" ON public.bills USING btree ("userId");


--
-- TOC entry 5570 (class 1259 OID 221824)
-- Name: business_bank_accounts_ledgerAccountCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "business_bank_accounts_ledgerAccountCode_idx" ON public.business_bank_accounts USING btree ("ledgerAccountCode");


--
-- TOC entry 5571 (class 1259 OID 221823)
-- Name: business_bank_accounts_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "business_bank_accounts_ownerCompanyName_idx" ON public.business_bank_accounts USING btree ("ownerCompanyName");


--
-- TOC entry 5608 (class 1259 OID 276611)
-- Name: client_network_links_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "client_network_links_clientId_idx" ON public.client_network_links USING btree ("clientId");


--
-- TOC entry 5609 (class 1259 OID 276612)
-- Name: client_network_links_deviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "client_network_links_deviceId_idx" ON public.client_network_links USING btree ("deviceId");


--
-- TOC entry 5610 (class 1259 OID 276613)
-- Name: client_network_links_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "client_network_links_ownerCompanyName_idx" ON public.client_network_links USING btree ("ownerCompanyName");


--
-- TOC entry 5613 (class 1259 OID 276614)
-- Name: client_network_links_servicePlanId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "client_network_links_servicePlanId_idx" ON public.client_network_links USING btree ("servicePlanId");


--
-- TOC entry 5614 (class 1259 OID 276615)
-- Name: client_network_links_serviceStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "client_network_links_serviceStatus_idx" ON public.client_network_links USING btree ("serviceStatus");


--
-- TOC entry 5324 (class 1259 OID 203775)
-- Name: clients_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clients_email_idx ON public.customers USING btree (email);


--
-- TOC entry 5505 (class 1259 OID 204673)
-- Name: companies_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX companies_name_key ON public.companies USING btree (name);


--
-- TOC entry 5511 (class 1259 OID 204676)
-- Name: company_subscriptions_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_subscriptions_companyId_idx" ON public.company_subscriptions USING btree ("companyId");


--
-- TOC entry 5512 (class 1259 OID 204675)
-- Name: company_subscriptions_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "company_subscriptions_companyId_key" ON public.company_subscriptions USING btree ("companyId");


--
-- TOC entry 5515 (class 1259 OID 204677)
-- Name: company_subscriptions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_subscriptions_status_idx ON public.company_subscriptions USING btree (status);


--
-- TOC entry 5581 (class 1259 OID 240487)
-- Name: customer_documents_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "customer_documents_clientId_idx" ON public.customer_documents USING btree ("clientId");


--
-- TOC entry 5582 (class 1259 OID 276691)
-- Name: customer_documents_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "customer_documents_createdAt_idx" ON public.customer_documents USING btree ("createdAt");


--
-- TOC entry 5325 (class 1259 OID 204028)
-- Name: customers_clientSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "customers_clientSeq_key" ON public.customers USING btree ("clientSeq");


--
-- TOC entry 5326 (class 1259 OID 204083)
-- Name: customers_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customers_email_idx ON public.customers USING btree (email);


--
-- TOC entry 5327 (class 1259 OID 204983)
-- Name: customers_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "customers_ownerCompanyName_idx" ON public.customers USING btree ("ownerCompanyName");


--
-- TOC entry 5330 (class 1259 OID 203776)
-- Name: customers_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customers_status_idx ON public.customers USING btree (status);


--
-- TOC entry 5558 (class 1259 OID 204933)
-- Name: depreciation_runs_assetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "depreciation_runs_assetId_idx" ON public.depreciation_runs USING btree ("assetId");


--
-- TOC entry 5561 (class 1259 OID 204934)
-- Name: depreciation_runs_runDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "depreciation_runs_runDate_idx" ON public.depreciation_runs USING btree ("runDate");


--
-- TOC entry 5373 (class 1259 OID 203956)
-- Name: email_outbox_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "email_outbox_clientId_idx" ON public.email_outbox USING btree ("clientId");


--
-- TOC entry 5374 (class 1259 OID 203933)
-- Name: email_outbox_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "email_outbox_invoiceId_idx" ON public.email_outbox USING btree ("invoiceId");


--
-- TOC entry 5377 (class 1259 OID 203932)
-- Name: email_outbox_status_nextAttemptAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "email_outbox_status_nextAttemptAt_idx" ON public.email_outbox USING btree (status, "nextAttemptAt");


--
-- TOC entry 5393 (class 1259 OID 204240)
-- Name: employees_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employees_email_idx ON public.employees USING btree (email);


--
-- TOC entry 5394 (class 1259 OID 204238)
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- TOC entry 5395 (class 1259 OID 204237)
-- Name: employees_employeeNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "employees_employeeNumber_key" ON public.employees USING btree ("employeeNumber");


--
-- TOC entry 5396 (class 1259 OID 204239)
-- Name: employees_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "employees_isActive_idx" ON public.employees USING btree ("isActive");


--
-- TOC entry 5542 (class 1259 OID 204851)
-- Name: exchange_rates_fromCurrencyCode_toCurrencyCode_asOfDate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "exchange_rates_fromCurrencyCode_toCurrencyCode_asOfDate_key" ON public.exchange_rates USING btree ("fromCurrencyCode", "toCurrencyCode", "asOfDate");


--
-- TOC entry 5543 (class 1259 OID 226200)
-- Name: exchange_rates_fromCurrencyCode_toCurrencyCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "exchange_rates_fromCurrencyCode_toCurrencyCode_idx" ON public.exchange_rates USING btree ("fromCurrencyCode", "toCurrencyCode");


--
-- TOC entry 5484 (class 1259 OID 204572)
-- Name: expense_categories_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX expense_categories_name_idx ON public.expense_categories USING btree (name);


--
-- TOC entry 5487 (class 1259 OID 204577)
-- Name: expenses_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_categoryId_idx" ON public.expenses USING btree ("categoryId");


--
-- TOC entry 5488 (class 1259 OID 204574)
-- Name: expenses_expenseDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_expenseDate_idx" ON public.expenses USING btree ("expenseDate");


--
-- TOC entry 5489 (class 1259 OID 204573)
-- Name: expenses_expenseSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "expenses_expenseSeq_key" ON public.expenses USING btree ("expenseSeq");


--
-- TOC entry 5490 (class 1259 OID 204714)
-- Name: expenses_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_journalEntryId_idx" ON public.expenses USING btree ("journalEntryId");


--
-- TOC entry 5491 (class 1259 OID 204713)
-- Name: expenses_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "expenses_journalEntryId_key" ON public.expenses USING btree ("journalEntryId");


--
-- TOC entry 5494 (class 1259 OID 204575)
-- Name: expenses_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX expenses_status_idx ON public.expenses USING btree (status);


--
-- TOC entry 5495 (class 1259 OID 204576)
-- Name: expenses_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_supplierId_idx" ON public.expenses USING btree ("supplierId");


--
-- TOC entry 5496 (class 1259 OID 204578)
-- Name: expenses_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_userId_idx" ON public.expenses USING btree ("userId");


--
-- TOC entry 5554 (class 1259 OID 204923)
-- Name: fixed_assets_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "fixed_assets_journalEntryId_key" ON public.fixed_assets USING btree ("journalEntryId");


--
-- TOC entry 5557 (class 1259 OID 204924)
-- Name: fixed_assets_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fixed_assets_status_idx ON public.fixed_assets USING btree (status);


--
-- TOC entry 5550 (class 1259 OID 204900)
-- Name: inventory_movements_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_movements_createdAt_idx" ON public.inventory_movements USING btree ("createdAt");


--
-- TOC entry 5553 (class 1259 OID 204899)
-- Name: inventory_movements_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_movements_productId_idx" ON public.inventory_movements USING btree ("productId");


--
-- TOC entry 5345 (class 1259 OID 203874)
-- Name: invoices_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_clientId_idx" ON public.invoices USING btree ("clientId");


--
-- TOC entry 5346 (class 1259 OID 203876)
-- Name: invoices_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_dueDate_idx" ON public.invoices USING btree ("dueDate");


--
-- TOC entry 5347 (class 1259 OID 203781)
-- Name: invoices_invoiceNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON public.invoices USING btree ("invoiceNumber");


--
-- TOC entry 5348 (class 1259 OID 204013)
-- Name: invoices_invoiceSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_invoiceSeq_key" ON public.invoices USING btree ("invoiceSeq");


--
-- TOC entry 5349 (class 1259 OID 204697)
-- Name: invoices_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_journalEntryId_key" ON public.invoices USING btree ("journalEntryId") WHERE ("journalEntryId" IS NOT NULL);


--
-- TOC entry 5352 (class 1259 OID 203782)
-- Name: invoices_quoteId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_quoteId_key" ON public.invoices USING btree ("quoteId");


--
-- TOC entry 5353 (class 1259 OID 203875)
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- TOC entry 5472 (class 1259 OID 204477)
-- Name: journal_entries_createdByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_createdByUserId_idx" ON public.journal_entries USING btree ("createdByUserId");


--
-- TOC entry 5473 (class 1259 OID 204475)
-- Name: journal_entries_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX journal_entries_date_idx ON public.journal_entries USING btree (date);


--
-- TOC entry 5474 (class 1259 OID 204473)
-- Name: journal_entries_entryNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "journal_entries_entryNumber_key" ON public.journal_entries USING btree ("entryNumber");


--
-- TOC entry 5477 (class 1259 OID 204474)
-- Name: journal_entries_reversedEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "journal_entries_reversedEntryId_key" ON public.journal_entries USING btree ("reversedEntryId");


--
-- TOC entry 5478 (class 1259 OID 204476)
-- Name: journal_entries_sourceType_sourceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_sourceType_sourceId_idx" ON public.journal_entries USING btree ("sourceType", "sourceId");


--
-- TOC entry 5479 (class 1259 OID 204872)
-- Name: journal_entries_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX journal_entries_status_idx ON public.journal_entries USING btree (status);


--
-- TOC entry 5480 (class 1259 OID 204479)
-- Name: journal_lines_accountId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_lines_accountId_idx" ON public.journal_lines USING btree ("accountId");


--
-- TOC entry 5481 (class 1259 OID 204478)
-- Name: journal_lines_entryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_lines_entryId_idx" ON public.journal_lines USING btree ("entryId");


--
-- TOC entry 5467 (class 1259 OID 204470)
-- Name: ledger_accounts_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ledger_accounts_code_key ON public.ledger_accounts USING btree (code);


--
-- TOC entry 5468 (class 1259 OID 204472)
-- Name: ledger_accounts_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ledger_accounts_isActive_idx" ON public.ledger_accounts USING btree ("isActive");


--
-- TOC entry 5471 (class 1259 OID 204471)
-- Name: ledger_accounts_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ledger_accounts_type_idx ON public.ledger_accounts USING btree (type);


--
-- TOC entry 5592 (class 1259 OID 276616)
-- Name: loan_repayments_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loan_repayments_journalEntryId_idx" ON public.loan_repayments USING btree ("journalEntryId");


--
-- TOC entry 5593 (class 1259 OID 244974)
-- Name: loan_repayments_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "loan_repayments_journalEntryId_key" ON public.loan_repayments USING btree ("journalEntryId");


--
-- TOC entry 5594 (class 1259 OID 244953)
-- Name: loan_repayments_loanId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loan_repayments_loanId_idx" ON public.loan_repayments USING btree ("loanId");


--
-- TOC entry 5585 (class 1259 OID 244952)
-- Name: loans_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loans_createdById_idx" ON public.loans USING btree ("createdById");


--
-- TOC entry 5586 (class 1259 OID 244964)
-- Name: loans_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loans_customerId_idx" ON public.loans USING btree ("customerId");


--
-- TOC entry 5587 (class 1259 OID 276617)
-- Name: loans_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loans_journalEntryId_idx" ON public.loans USING btree ("journalEntryId");


--
-- TOC entry 5588 (class 1259 OID 244973)
-- Name: loans_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "loans_journalEntryId_key" ON public.loans USING btree ("journalEntryId");


--
-- TOC entry 5589 (class 1259 OID 244951)
-- Name: loans_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loans_ownerCompanyName_idx" ON public.loans USING btree ("ownerCompanyName");


--
-- TOC entry 5615 (class 1259 OID 276618)
-- Name: network_alerts_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_alerts_createdAt_idx" ON public.network_alerts USING btree ("createdAt");


--
-- TOC entry 5616 (class 1259 OID 276619)
-- Name: network_alerts_deviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_alerts_deviceId_idx" ON public.network_alerts USING btree ("deviceId");


--
-- TOC entry 5617 (class 1259 OID 276620)
-- Name: network_alerts_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_alerts_ownerCompanyName_idx" ON public.network_alerts USING btree ("ownerCompanyName");


--
-- TOC entry 5620 (class 1259 OID 276621)
-- Name: network_alerts_severity_isResolved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_alerts_severity_isResolved_idx" ON public.network_alerts USING btree (severity, "isResolved");


--
-- TOC entry 5621 (class 1259 OID 276622)
-- Name: network_devices_ipAddress_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_devices_ipAddress_idx" ON public.network_devices USING btree ("ipAddress");


--
-- TOC entry 5622 (class 1259 OID 276623)
-- Name: network_devices_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_devices_ownerCompanyName_idx" ON public.network_devices USING btree ("ownerCompanyName");


--
-- TOC entry 5623 (class 1259 OID 276624)
-- Name: network_devices_parentDeviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_devices_parentDeviceId_idx" ON public.network_devices USING btree ("parentDeviceId");


--
-- TOC entry 5626 (class 1259 OID 276625)
-- Name: network_devices_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX network_devices_status_idx ON public.network_devices USING btree (status);


--
-- TOC entry 5627 (class 1259 OID 276626)
-- Name: network_devices_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX network_devices_type_idx ON public.network_devices USING btree (type);


--
-- TOC entry 5628 (class 1259 OID 276627)
-- Name: network_interfaces_deviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "network_interfaces_deviceId_idx" ON public.network_interfaces USING btree ("deviceId");


--
-- TOC entry 5384 (class 1259 OID 204038)
-- Name: password_resets_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_resets_token_idx ON public.password_resets USING btree (token);


--
-- TOC entry 5385 (class 1259 OID 204037)
-- Name: password_resets_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_resets_token_key ON public.password_resets USING btree (token);


--
-- TOC entry 5386 (class 1259 OID 204039)
-- Name: password_resets_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "password_resets_userId_idx" ON public.password_resets USING btree ("userId");


--
-- TOC entry 5566 (class 1259 OID 204971)
-- Name: pay_run_lines_employeeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "pay_run_lines_employeeId_idx" ON public.pay_run_lines USING btree ("employeeId");


--
-- TOC entry 5567 (class 1259 OID 204970)
-- Name: pay_run_lines_payRunId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "pay_run_lines_payRunId_idx" ON public.pay_run_lines USING btree ("payRunId");


--
-- TOC entry 5562 (class 1259 OID 204961)
-- Name: pay_runs_payPeriodStart_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "pay_runs_payPeriodStart_idx" ON public.pay_runs USING btree ("payPeriodStart");


--
-- TOC entry 5565 (class 1259 OID 204960)
-- Name: pay_runs_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pay_runs_status_idx ON public.pay_runs USING btree (status);


--
-- TOC entry 5389 (class 1259 OID 204082)
-- Name: payment_allocations_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payment_allocations_invoiceId_idx" ON public.payment_allocations USING btree ("invoiceId");


--
-- TOC entry 5390 (class 1259 OID 204081)
-- Name: payment_allocations_paymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payment_allocations_paymentId_idx" ON public.payment_allocations USING btree ("paymentId");


--
-- TOC entry 5360 (class 1259 OID 203786)
-- Name: payments_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_clientId_idx" ON public.payments USING btree ("clientId");


--
-- TOC entry 5361 (class 1259 OID 203787)
-- Name: payments_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_invoiceId_idx" ON public.payments USING btree ("invoiceId");


--
-- TOC entry 5362 (class 1259 OID 204698)
-- Name: payments_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_journalEntryId_key" ON public.payments USING btree ("journalEntryId") WHERE ("journalEntryId" IS NOT NULL);


--
-- TOC entry 5363 (class 1259 OID 203788)
-- Name: payments_paymentDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_paymentDate_idx" ON public.payments USING btree ("paymentDate");


--
-- TOC entry 5364 (class 1259 OID 203785)
-- Name: payments_paymentNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_paymentNumber_key" ON public.payments USING btree ("paymentNumber");


--
-- TOC entry 5500 (class 1259 OID 204619)
-- Name: permissions_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_key_key ON public.permissions USING btree (key);


--
-- TOC entry 5331 (class 1259 OID 203778)
-- Name: products_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_isActive_idx" ON public.products USING btree ("isActive");


--
-- TOC entry 5332 (class 1259 OID 203779)
-- Name: products_isRecurring_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_isRecurring_idx" ON public.products USING btree ("isRecurring");


--
-- TOC entry 5333 (class 1259 OID 204985)
-- Name: products_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_ownerCompanyName_idx" ON public.products USING btree ("ownerCompanyName");


--
-- TOC entry 5336 (class 1259 OID 203777)
-- Name: products_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);


--
-- TOC entry 5399 (class 1259 OID 204242)
-- Name: projects_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "projects_clientId_idx" ON public.projects USING btree ("clientId");


--
-- TOC entry 5402 (class 1259 OID 204241)
-- Name: projects_projectNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "projects_projectNumber_key" ON public.projects USING btree ("projectNumber");


--
-- TOC entry 5403 (class 1259 OID 204243)
-- Name: projects_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_status_idx ON public.projects USING btree (status);


--
-- TOC entry 5337 (class 1259 OID 203877)
-- Name: quotes_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "quotes_clientId_idx" ON public.quotes USING btree ("clientId");


--
-- TOC entry 5340 (class 1259 OID 203780)
-- Name: quotes_quoteNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "quotes_quoteNumber_key" ON public.quotes USING btree ("quoteNumber");


--
-- TOC entry 5341 (class 1259 OID 204014)
-- Name: quotes_quoteSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "quotes_quoteSeq_key" ON public.quotes USING btree ("quoteSeq");


--
-- TOC entry 5342 (class 1259 OID 203878)
-- Name: quotes_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX quotes_status_idx ON public.quotes USING btree (status);


--
-- TOC entry 5369 (class 1259 OID 203873)
-- Name: recurring_invoice_items_recurringInvoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "recurring_invoice_items_recurringInvoiceId_idx" ON public.recurring_invoice_items USING btree ("recurringInvoiceId");


--
-- TOC entry 5372 (class 1259 OID 203931)
-- Name: recurring_invoice_runs_recurringInvoiceId_runAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "recurring_invoice_runs_recurringInvoiceId_runAt_idx" ON public.recurring_invoice_runs USING btree ("recurringInvoiceId", "runAt");


--
-- TOC entry 5356 (class 1259 OID 203783)
-- Name: recurring_invoices_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "recurring_invoices_clientId_idx" ON public.recurring_invoices USING btree ("clientId");


--
-- TOC entry 5357 (class 1259 OID 203784)
-- Name: recurring_invoices_isActive_nextRunDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "recurring_invoices_isActive_nextRunDate_idx" ON public.recurring_invoices USING btree ("isActive", "nextRunDate");


--
-- TOC entry 5534 (class 1259 OID 204791)
-- Name: recurring_journal_entries_isActive_nextRunDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "recurring_journal_entries_isActive_nextRunDate_idx" ON public.recurring_journal_entries USING btree ("isActive", "nextRunDate");


--
-- TOC entry 5497 (class 1259 OID 204618)
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- TOC entry 5631 (class 1259 OID 276628)
-- Name: service_plans_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_plans_isActive_idx" ON public.service_plans USING btree ("isActive");


--
-- TOC entry 5632 (class 1259 OID 276629)
-- Name: service_plans_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_plans_ownerCompanyName_idx" ON public.service_plans USING btree ("ownerCompanyName");


--
-- TOC entry 5508 (class 1259 OID 204674)
-- Name: subscription_plans_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX subscription_plans_name_key ON public.subscription_plans USING btree (name);


--
-- TOC entry 5462 (class 1259 OID 204468)
-- Name: supplier_payment_allocations_billId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_payment_allocations_billId_idx" ON public.supplier_payment_allocations USING btree ("billId");


--
-- TOC entry 5463 (class 1259 OID 204469)
-- Name: supplier_payment_allocations_paymentId_billId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "supplier_payment_allocations_paymentId_billId_key" ON public.supplier_payment_allocations USING btree ("paymentId", "billId");


--
-- TOC entry 5464 (class 1259 OID 204467)
-- Name: supplier_payment_allocations_paymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_payment_allocations_paymentId_idx" ON public.supplier_payment_allocations USING btree ("paymentId");


--
-- TOC entry 5455 (class 1259 OID 204466)
-- Name: supplier_payments_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_payments_journalEntryId_idx" ON public.supplier_payments USING btree ("journalEntryId");


--
-- TOC entry 5456 (class 1259 OID 204463)
-- Name: supplier_payments_journalEntryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "supplier_payments_journalEntryId_key" ON public.supplier_payments USING btree ("journalEntryId");


--
-- TOC entry 5457 (class 1259 OID 204465)
-- Name: supplier_payments_paymentDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_payments_paymentDate_idx" ON public.supplier_payments USING btree ("paymentDate");


--
-- TOC entry 5458 (class 1259 OID 204462)
-- Name: supplier_payments_paymentNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "supplier_payments_paymentNumber_key" ON public.supplier_payments USING btree ("paymentNumber");


--
-- TOC entry 5461 (class 1259 OID 204464)
-- Name: supplier_payments_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_payments_supplierId_idx" ON public.supplier_payments USING btree ("supplierId");


--
-- TOC entry 5446 (class 1259 OID 204376)
-- Name: suppliers_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX suppliers_email_idx ON public.suppliers USING btree (email);


--
-- TOC entry 5447 (class 1259 OID 204372)
-- Name: suppliers_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suppliers_email_key ON public.suppliers USING btree (email);


--
-- TOC entry 5448 (class 1259 OID 204984)
-- Name: suppliers_ownerCompanyName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "suppliers_ownerCompanyName_idx" ON public.suppliers USING btree ("ownerCompanyName");


--
-- TOC entry 5449 (class 1259 OID 204373)
-- Name: suppliers_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suppliers_phone_key ON public.suppliers USING btree (phone);


--
-- TOC entry 5452 (class 1259 OID 204375)
-- Name: suppliers_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX suppliers_status_idx ON public.suppliers USING btree (status);


--
-- TOC entry 5453 (class 1259 OID 204374)
-- Name: suppliers_supplierName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "suppliers_supplierName_idx" ON public.suppliers USING btree ("supplierName");


--
-- TOC entry 5454 (class 1259 OID 204371)
-- Name: suppliers_supplierSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "suppliers_supplierSeq_key" ON public.suppliers USING btree ("supplierSeq");


--
-- TOC entry 5435 (class 1259 OID 204268)
-- Name: task_activities_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX task_activities_action_idx ON public.task_activities USING btree (action);


--
-- TOC entry 5436 (class 1259 OID 204267)
-- Name: task_activities_actorUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_activities_actorUserId_idx" ON public.task_activities USING btree ("actorUserId");


--
-- TOC entry 5439 (class 1259 OID 204266)
-- Name: task_activities_taskId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_activities_taskId_createdAt_idx" ON public.task_activities USING btree ("taskId", "createdAt");


--
-- TOC entry 5442 (class 1259 OID 204272)
-- Name: task_notifications_sentAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_notifications_sentAt_idx" ON public.task_notifications USING btree ("sentAt");


--
-- TOC entry 5443 (class 1259 OID 204270)
-- Name: task_notifications_taskId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_notifications_taskId_idx" ON public.task_notifications USING btree ("taskId");


--
-- TOC entry 5444 (class 1259 OID 204271)
-- Name: task_notifications_type_scheduledAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_notifications_type_scheduledAt_idx" ON public.task_notifications USING btree (type, "scheduledAt");


--
-- TOC entry 5445 (class 1259 OID 204269)
-- Name: task_notifications_userId_readAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_notifications_userId_readAt_idx" ON public.task_notifications USING btree ("userId", "readAt");


--
-- TOC entry 5414 (class 1259 OID 204249)
-- Name: task_recurrences_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_recurrences_isActive_idx" ON public.task_recurrences USING btree ("isActive");


--
-- TOC entry 5415 (class 1259 OID 204250)
-- Name: task_recurrences_isActive_nextRunDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "task_recurrences_isActive_nextRunDate_idx" ON public.task_recurrences USING btree ("isActive", "nextRunDate");


--
-- TOC entry 5418 (class 1259 OID 204259)
-- Name: tasks_assignedEmployeeId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_assignedEmployeeId_idx" ON public.tasks USING btree ("assignedEmployeeId");


--
-- TOC entry 5419 (class 1259 OID 204258)
-- Name: tasks_assignedUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_assignedUserId_idx" ON public.tasks USING btree ("assignedUserId");


--
-- TOC entry 5420 (class 1259 OID 204262)
-- Name: tasks_billId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_billId_idx" ON public.tasks USING btree ("billId");


--
-- TOC entry 5421 (class 1259 OID 204260)
-- Name: tasks_clientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_clientId_idx" ON public.tasks USING btree ("clientId");


--
-- TOC entry 5422 (class 1259 OID 204265)
-- Name: tasks_createdByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_createdByUserId_idx" ON public.tasks USING btree ("createdByUserId");


--
-- TOC entry 5423 (class 1259 OID 204255)
-- Name: tasks_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_dueDate_idx" ON public.tasks USING btree ("dueDate");


--
-- TOC entry 5424 (class 1259 OID 204257)
-- Name: tasks_generatedFromTaskId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_generatedFromTaskId_idx" ON public.tasks USING btree ("generatedFromTaskId");


--
-- TOC entry 5425 (class 1259 OID 204261)
-- Name: tasks_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_invoiceId_idx" ON public.tasks USING btree ("invoiceId");


--
-- TOC entry 5426 (class 1259 OID 204256)
-- Name: tasks_isTemplate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_isTemplate_idx" ON public.tasks USING btree ("isTemplate");


--
-- TOC entry 5429 (class 1259 OID 204253)
-- Name: tasks_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tasks_priority_idx ON public.tasks USING btree (priority);


--
-- TOC entry 5430 (class 1259 OID 204263)
-- Name: tasks_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_projectId_idx" ON public.tasks USING btree ("projectId");


--
-- TOC entry 5431 (class 1259 OID 204264)
-- Name: tasks_recurrenceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tasks_recurrenceId_idx" ON public.tasks USING btree ("recurrenceId");


--
-- TOC entry 5432 (class 1259 OID 204252)
-- Name: tasks_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tasks_status_idx ON public.tasks USING btree (status);


--
-- TOC entry 5433 (class 1259 OID 204251)
-- Name: tasks_taskSeq_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "tasks_taskSeq_key" ON public.tasks USING btree ("taskSeq");


--
-- TOC entry 5434 (class 1259 OID 204254)
-- Name: tasks_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tasks_type_idx ON public.tasks USING btree (type);


--
-- TOC entry 5318 (class 1259 OID 204678)
-- Name: users_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_companyId_idx" ON public.users USING btree ("companyId");


--
-- TOC entry 5319 (class 1259 OID 203774)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 5322 (class 1259 OID 204630)
-- Name: users_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_roleId_idx" ON public.users USING btree ("roleId");


--
-- TOC entry 5323 (class 1259 OID 204015)
-- Name: users_userNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_userNumber_key" ON public.users USING btree ("userNumber");


--
-- TOC entry 5704 (class 2606 OID 204827)
-- Name: accounting_entities accounting_entities_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounting_entities
    ADD CONSTRAINT "accounting_entities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5701 (class 2606 OID 204807)
-- Name: bank_reconciliation_matches bank_reconciliation_matches_journalLineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliation_matches
    ADD CONSTRAINT "bank_reconciliation_matches_journalLineId_fkey" FOREIGN KEY ("journalLineId") REFERENCES public.journal_lines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5702 (class 2606 OID 204797)
-- Name: bank_reconciliation_matches bank_reconciliation_matches_reconciliationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliation_matches
    ADD CONSTRAINT "bank_reconciliation_matches_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES public.bank_reconciliations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5703 (class 2606 OID 204802)
-- Name: bank_reconciliation_matches bank_reconciliation_matches_statementLineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliation_matches
    ADD CONSTRAINT "bank_reconciliation_matches_statementLineId_fkey" FOREIGN KEY ("statementLineId") REFERENCES public.bank_statement_lines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5699 (class 2606 OID 221831)
-- Name: bank_reconciliations bank_reconciliations_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_reconciliations
    ADD CONSTRAINT "bank_reconciliations_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.business_bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5700 (class 2606 OID 204792)
-- Name: bank_statement_lines bank_statement_lines_reconciliationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_statement_lines
    ADD CONSTRAINT "bank_statement_lines_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES public.bank_reconciliations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5712 (class 2606 OID 221851)
-- Name: bank_transactions bank_transactions_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transactions
    ADD CONSTRAINT "bank_transactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public.business_bank_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5664 (class 2606 OID 204278)
-- Name: bills bills_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5665 (class 2606 OID 204488)
-- Name: bills bills_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5666 (class 2606 OID 204483)
-- Name: bills bills_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5667 (class 2606 OID 204283)
-- Name: bills bills_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5711 (class 2606 OID 221826)
-- Name: business_bank_accounts business_bank_accounts_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_bank_accounts
    ADD CONSTRAINT "business_bank_accounts_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5719 (class 2606 OID 276630)
-- Name: client_network_links client_network_links_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_network_links
    ADD CONSTRAINT "client_network_links_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5720 (class 2606 OID 276635)
-- Name: client_network_links client_network_links_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_network_links
    ADD CONSTRAINT "client_network_links_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.network_devices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5721 (class 2606 OID 276640)
-- Name: client_network_links client_network_links_servicePlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_network_links
    ADD CONSTRAINT "client_network_links_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES public.service_plans(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5697 (class 2606 OID 204679)
-- Name: company_subscriptions company_subscriptions_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_subscriptions
    ADD CONSTRAINT "company_subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5698 (class 2606 OID 204684)
-- Name: company_subscriptions company_subscriptions_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_subscriptions
    ADD CONSTRAINT "company_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.subscription_plans(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5713 (class 2606 OID 240489)
-- Name: customer_documents customer_documents_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_documents
    ADD CONSTRAINT "customer_documents_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5708 (class 2606 OID 204935)
-- Name: depreciation_runs depreciation_runs_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.depreciation_runs
    ADD CONSTRAINT "depreciation_runs_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public.fixed_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5658 (class 2606 OID 203957)
-- Name: email_outbox email_outbox_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_outbox
    ADD CONSTRAINT "email_outbox_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5659 (class 2606 OID 203944)
-- Name: email_outbox email_outbox_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_outbox
    ADD CONSTRAINT "email_outbox_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5705 (class 2606 OID 204852)
-- Name: exchange_rates exchange_rates_fromCurrencyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT "exchange_rates_fromCurrencyCode_fkey" FOREIGN KEY ("fromCurrencyCode") REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5706 (class 2606 OID 204857)
-- Name: exchange_rates exchange_rates_toCurrencyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT "exchange_rates_toCurrencyCode_fkey" FOREIGN KEY ("toCurrencyCode") REFERENCES public.currencies(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5691 (class 2606 OID 204584)
-- Name: expenses expenses_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.expense_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5692 (class 2606 OID 204715)
-- Name: expenses expenses_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "expenses_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5693 (class 2606 OID 204579)
-- Name: expenses expenses_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "expenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5694 (class 2606 OID 204589)
-- Name: expenses expenses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5707 (class 2606 OID 204901)
-- Name: inventory_movements inventory_movements_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5646 (class 2606 OID 203829)
-- Name: invoice_items invoice_items_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5647 (class 2606 OID 203834)
-- Name: invoice_items invoice_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5641 (class 2606 OID 203809)
-- Name: invoices invoices_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5642 (class 2606 OID 204699)
-- Name: invoices invoices_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5643 (class 2606 OID 203819)
-- Name: invoices invoices_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5644 (class 2606 OID 203824)
-- Name: invoices invoices_recurringInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_recurringInvoiceId_fkey" FOREIGN KEY ("recurringInvoiceId") REFERENCES public.recurring_invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5645 (class 2606 OID 203814)
-- Name: invoices invoices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5686 (class 2606 OID 204873)
-- Name: journal_entries journal_entries_approvedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5687 (class 2606 OID 204523)
-- Name: journal_entries journal_entries_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5688 (class 2606 OID 204518)
-- Name: journal_entries journal_entries_reversedEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_reversedEntryId_fkey" FOREIGN KEY ("reversedEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5689 (class 2606 OID 204533)
-- Name: journal_lines journal_lines_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT "journal_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.ledger_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5690 (class 2606 OID 204528)
-- Name: journal_lines journal_lines_entryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_lines
    ADD CONSTRAINT "journal_lines_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5717 (class 2606 OID 244980)
-- Name: loan_repayments loan_repayments_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_repayments
    ADD CONSTRAINT "loan_repayments_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5718 (class 2606 OID 244959)
-- Name: loan_repayments loan_repayments_loanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_repayments
    ADD CONSTRAINT "loan_repayments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5714 (class 2606 OID 244954)
-- Name: loans loans_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "loans_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5715 (class 2606 OID 244965)
-- Name: loans loans_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "loans_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5716 (class 2606 OID 244975)
-- Name: loans loans_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "loans_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5722 (class 2606 OID 276645)
-- Name: network_alerts network_alerts_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_alerts
    ADD CONSTRAINT "network_alerts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.network_devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5723 (class 2606 OID 276650)
-- Name: network_devices network_devices_parentDeviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_devices
    ADD CONSTRAINT "network_devices_parentDeviceId_fkey" FOREIGN KEY ("parentDeviceId") REFERENCES public.network_devices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5724 (class 2606 OID 276655)
-- Name: network_interfaces network_interfaces_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network_interfaces
    ADD CONSTRAINT "network_interfaces_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.network_devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5660 (class 2606 OID 204040)
-- Name: password_resets password_resets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5709 (class 2606 OID 204977)
-- Name: pay_run_lines pay_run_lines_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pay_run_lines
    ADD CONSTRAINT "pay_run_lines_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5710 (class 2606 OID 204972)
-- Name: pay_run_lines pay_run_lines_payRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pay_run_lines
    ADD CONSTRAINT "pay_run_lines_payRunId_fkey" FOREIGN KEY ("payRunId") REFERENCES public.pay_runs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5661 (class 2606 OID 204076)
-- Name: payment_allocations payment_allocations_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_allocations
    ADD CONSTRAINT "payment_allocations_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5662 (class 2606 OID 204071)
-- Name: payment_allocations payment_allocations_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_allocations
    ADD CONSTRAINT "payment_allocations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5650 (class 2606 OID 203854)
-- Name: payments payments_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5651 (class 2606 OID 204058)
-- Name: payments payments_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5652 (class 2606 OID 204704)
-- Name: payments payments_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5653 (class 2606 OID 203859)
-- Name: payments payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5663 (class 2606 OID 204273)
-- Name: projects projects_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5639 (class 2606 OID 203804)
-- Name: quote_items quote_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT "quote_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5640 (class 2606 OID 203799)
-- Name: quote_items quote_items_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5637 (class 2606 OID 203789)
-- Name: quotes quotes_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5638 (class 2606 OID 203794)
-- Name: quotes quotes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "quotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5654 (class 2606 OID 203884)
-- Name: recurring_invoice_items recurring_invoice_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_items
    ADD CONSTRAINT "recurring_invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5655 (class 2606 OID 203879)
-- Name: recurring_invoice_items recurring_invoice_items_recurringInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_items
    ADD CONSTRAINT "recurring_invoice_items_recurringInvoiceId_fkey" FOREIGN KEY ("recurringInvoiceId") REFERENCES public.recurring_invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5656 (class 2606 OID 203939)
-- Name: recurring_invoice_runs recurring_invoice_runs_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_runs
    ADD CONSTRAINT "recurring_invoice_runs_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5657 (class 2606 OID 203934)
-- Name: recurring_invoice_runs recurring_invoice_runs_recurringInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoice_runs
    ADD CONSTRAINT "recurring_invoice_runs_recurringInvoiceId_fkey" FOREIGN KEY ("recurringInvoiceId") REFERENCES public.recurring_invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5648 (class 2606 OID 203839)
-- Name: recurring_invoices recurring_invoices_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT "recurring_invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5649 (class 2606 OID 203844)
-- Name: recurring_invoices recurring_invoices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_invoices
    ADD CONSTRAINT "recurring_invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5695 (class 2606 OID 204625)
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5696 (class 2606 OID 204620)
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5684 (class 2606 OID 204513)
-- Name: supplier_payment_allocations supplier_payment_allocations_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payment_allocations
    ADD CONSTRAINT "supplier_payment_allocations_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5685 (class 2606 OID 204508)
-- Name: supplier_payment_allocations supplier_payment_allocations_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payment_allocations
    ADD CONSTRAINT "supplier_payment_allocations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public.supplier_payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5681 (class 2606 OID 204503)
-- Name: supplier_payments supplier_payments_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT "supplier_payments_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5682 (class 2606 OID 204493)
-- Name: supplier_payments supplier_payments_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT "supplier_payments_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5683 (class 2606 OID 204498)
-- Name: supplier_payments supplier_payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT "supplier_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5677 (class 2606 OID 204338)
-- Name: task_activities task_activities_actorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT "task_activities_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5678 (class 2606 OID 204333)
-- Name: task_activities task_activities_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT "task_activities_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5679 (class 2606 OID 204343)
-- Name: task_notifications task_notifications_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_notifications
    ADD CONSTRAINT "task_notifications_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5680 (class 2606 OID 204348)
-- Name: task_notifications task_notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_notifications
    ADD CONSTRAINT "task_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5668 (class 2606 OID 204298)
-- Name: tasks tasks_assignedEmployeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5669 (class 2606 OID 204293)
-- Name: tasks tasks_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5670 (class 2606 OID 204318)
-- Name: tasks tasks_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5671 (class 2606 OID 204308)
-- Name: tasks tasks_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5672 (class 2606 OID 204288)
-- Name: tasks tasks_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5673 (class 2606 OID 204303)
-- Name: tasks tasks_generatedFromTaskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_generatedFromTaskId_fkey" FOREIGN KEY ("generatedFromTaskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5674 (class 2606 OID 204313)
-- Name: tasks tasks_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5675 (class 2606 OID 204323)
-- Name: tasks tasks_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5676 (class 2606 OID 204328)
-- Name: tasks tasks_recurrenceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_recurrenceId_fkey" FOREIGN KEY ("recurrenceId") REFERENCES public.task_recurrences(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5635 (class 2606 OID 204689)
-- Name: users users_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5636 (class 2606 OID 204631)
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5951 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-04-04 12:32:05

--
-- PostgreSQL database dump complete
--

