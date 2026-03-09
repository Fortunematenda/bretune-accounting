/**
 * Multi-tenant company scoping helpers.
 * When currentUser.companyName is set, scope queries to that company.
 * When null (legacy users), scope to ownerCompanyName = null.
 * Legacy: when user has companyName, also include ownerCompanyName = null (pre-migration clients).
 */
function ownerCompanyFilter(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return { ownerCompanyName: null };
  }
  return {
    OR: [
      { ownerCompanyName: { equals: company, mode: 'insensitive' } },
      { ownerCompanyName: null },
    ],
  };
}

function userCompanyFilter(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return { user: { companyName: null } };
  }
  return { user: { companyName: { equals: company, mode: 'insensitive' } } };
}

/**
 * Returns { userId: { in: [...] } } for models that have userId (Payment, Invoice, etc).
 * More explicit than relation filter - fetches user IDs from same company.
 */
async function userIdsForCompanyFilter(prisma, currentUser) {
  const company = (currentUser?.companyName || '').trim();
  const where = company
    ? { companyName: { equals: company, mode: 'insensitive' } }
    : { companyName: null };
  const users = await prisma.user.findMany({
    where,
    select: { id: true },
  });
  const ids = users.map((u) => u.id);
  if (ids.length === 0) {
    return { userId: { in: ['__no_match__'] } };
  }
  return { userId: { in: ids } };
}

/** For models with createdBy relation (e.g. Task) */
function createdByCompanyFilter(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return { createdBy: { companyName: null } };
  }
  return { createdBy: { companyName: { equals: company, mode: 'insensitive' } } };
}

/** For Task model - uses createdByUser relation name */
function taskCreatedByCompanyFilter(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return { createdByUser: { companyName: null } };
  }
  return { createdByUser: { companyName: { equals: company, mode: 'insensitive' } } };
}

/** For models with client relation - scope via client.ownerCompanyName */
function clientOwnerCompanyFilter(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return { client: { ownerCompanyName: null } };
  }
  return { client: { ownerCompanyName: { equals: company, mode: 'insensitive' } } };
}

function getOwnerCompany(currentUser) {
  const company = (currentUser?.companyName || '').trim();
  return company || null;
}

/** For raw SQL: filters invoices by user's company. Use in FROM invoices i ... WHERE ... */
function rawInvoiceCompanyCondition(Prisma, currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = i."userId" AND u."companyName" IS NULL)`;
  }
  return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = i."userId" AND LOWER(TRIM(COALESCE(u."companyName", ''))) = LOWER(TRIM(${company})))`;
}

/** For raw SQL: filters payments by user's company */
function rawPaymentCompanyCondition(Prisma, currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = p."userId" AND u."companyName" IS NULL)`;
  }
  return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = p."userId" AND LOWER(TRIM(COALESCE(u."companyName", ''))) = LOWER(TRIM(${company})))`;
}

/** For raw SQL: filters journal entries by creator's company (for P&L, trial balance, balance sheet) */
function rawJournalEntryCompanyCondition(Prisma, currentUser) {
  const company = (currentUser?.companyName || '').trim();
  if (!company) {
    return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = je."createdByUserId" AND u."companyName" IS NULL)`;
  }
  return Prisma.sql`EXISTS (SELECT 1 FROM users u WHERE u.id = je."createdByUserId" AND LOWER(TRIM(COALESCE(u."companyName", ''))) = LOWER(TRIM(${company})))`;
}

module.exports = { ownerCompanyFilter, userCompanyFilter, getOwnerCompany, userIdsForCompanyFilter, createdByCompanyFilter, taskCreatedByCompanyFilter, clientOwnerCompanyFilter, rawInvoiceCompanyCondition, rawPaymentCompanyCondition, rawJournalEntryCompanyCondition };
