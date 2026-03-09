const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PERMISSIONS = [
  // Invoices
  { key: 'invoices.view', description: 'View invoices', module: 'invoices' },
  { key: 'invoices.create', description: 'Create invoices', module: 'invoices' },
  { key: 'invoices.edit', description: 'Edit invoices', module: 'invoices' },
  { key: 'invoices.delete', description: 'Delete invoices', module: 'invoices' },
  { key: 'invoices.approve', description: 'Approve invoices', module: 'invoices' },
  { key: 'invoices.send', description: 'Send invoices', module: 'invoices' },
  // Quotes
  { key: 'quotes.view', description: 'View quotes', module: 'quotes' },
  { key: 'quotes.create', description: 'Create quotes', module: 'quotes' },
  { key: 'quotes.edit', description: 'Edit quotes', module: 'quotes' },
  { key: 'quotes.delete', description: 'Delete quotes', module: 'quotes' },
  // Banking / Payments
  { key: 'banking.view', description: 'View banking', module: 'banking' },
  { key: 'banking.reconcile', description: 'Reconcile bank', module: 'banking' },
  { key: 'banking.import', description: 'Import bank transactions', module: 'banking' },
  { key: 'payments.view', description: 'View payments', module: 'payments' },
  { key: 'payments.create', description: 'Record payments', module: 'payments' },
  { key: 'payments.void', description: 'Void payments', module: 'payments' },
  // Accounting / Ledger
  { key: 'ledger.view', description: 'View ledger', module: 'ledger' },
  { key: 'ledger.post', description: 'Post to ledger', module: 'ledger' },
  { key: 'journal.create', description: 'Create journal entries', module: 'ledger' },
  { key: 'journal.reverse', description: 'Reverse journal entries', module: 'ledger' },
  // Clients
  { key: 'clients.view', description: 'View clients', module: 'clients' },
  { key: 'clients.create', description: 'Create clients', module: 'clients' },
  { key: 'clients.edit', description: 'Edit clients', module: 'clients' },
  { key: 'clients.delete', description: 'Delete clients', module: 'clients' },
  // Products
  { key: 'products.view', description: 'View products', module: 'products' },
  { key: 'products.create', description: 'Create products', module: 'products' },
  { key: 'products.edit', description: 'Edit products', module: 'products' },
  { key: 'products.delete', description: 'Delete products', module: 'products' },
  // Bills
  { key: 'bills.view', description: 'View bills', module: 'bills' },
  { key: 'bills.create', description: 'Create bills', module: 'bills' },
  { key: 'bills.edit', description: 'Edit bills', module: 'bills' },
  { key: 'bills.delete', description: 'Delete bills', module: 'bills' },
  // Suppliers
  { key: 'suppliers.view', description: 'View suppliers', module: 'suppliers' },
  { key: 'suppliers.create', description: 'Create suppliers', module: 'suppliers' },
  { key: 'suppliers.edit', description: 'Edit suppliers', module: 'suppliers' },
  { key: 'suppliers.delete', description: 'Delete suppliers', module: 'suppliers' },
  // Reports
  { key: 'reports.view', description: 'View reports', module: 'reports' },
  { key: 'reports.export', description: 'Export reports', module: 'reports' },
  // Settings
  { key: 'settings.manage', description: 'Manage settings', module: 'settings' },
  { key: 'users.manage', description: 'Manage users', module: 'users' },
  { key: 'roles.manage', description: 'Manage roles', module: 'roles' },
  // Tasks
  { key: 'tasks.view', description: 'View tasks', module: 'tasks' },
  { key: 'tasks.create', description: 'Create tasks', module: 'tasks' },
  { key: 'tasks.edit', description: 'Edit tasks', module: 'tasks' },
  { key: 'tasks.delete', description: 'Delete tasks', module: 'tasks' },
  // Expenses
  { key: 'expenses.view', description: 'View expenses', module: 'expenses' },
  { key: 'expenses.create', description: 'Create expenses', module: 'expenses' },
  { key: 'expenses.approve', description: 'Approve expenses', module: 'expenses' },
  // Statements
  { key: 'statements.view', description: 'View statements', module: 'statements' },
  { key: 'statements.send', description: 'Send statements', module: 'statements' },
];

const CURRENCIES = [
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
  { code: 'CNY', name: 'Chinese Renminbi Yuan', symbol: '¥', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 2 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2 },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', decimals: 2 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimals: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2 },
];

async function main() {
  // Seed all Frankfurter-supported currencies
  for (const c of CURRENCIES) {
    await prisma.currency.upsert({
      where: { code: c.code },
      create: c,
      update: { name: c.name, symbol: c.symbol, decimals: c.decimals },
    });
  }
  console.log('Currencies seeded:', CURRENCIES.length);

  // Create permissions (idempotent)
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      create: p,
      update: { description: p.description, module: p.module },
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    create: {
      name: 'Admin',
      description: 'Full access to all features',
      isSystem: true,
      color: '#7c3aed',
    },
    update: {},
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    create: {
      name: 'Manager',
      description: 'Manage day-to-day operations, limited settings access',
      isSystem: true,
      color: '#0891b2',
    },
    update: {},
  });

  const accountantRole = await prisma.role.upsert({
    where: { name: 'Accountant' },
    create: {
      name: 'Accountant',
      description: 'Create and edit invoices, payments, and basic reports',
      isSystem: true,
      color: '#059669',
    },
    update: {},
  });

  // Admin gets all permissions
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
  });

  // Manager: most permissions except roles.manage, users.manage (limited)
  const managerExclude = ['roles.manage'];
  const managerPerms = allPermissions.filter((p) => !managerExclude.includes(p.key));
  await prisma.rolePermission.deleteMany({ where: { roleId: managerRole.id } });
  await prisma.rolePermission.createMany({
    data: managerPerms.map((p) => ({ roleId: managerRole.id, permissionId: p.id })),
  });

  // Accountant: view/create/edit for core modules
  const accountantInclude = [
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.send',
    'quotes.view', 'quotes.create', 'quotes.edit',
    'payments.view', 'payments.create',
    'clients.view', 'clients.create', 'clients.edit',
    'products.view', 'products.create', 'products.edit',
    'reports.view', 'reports.export',
    'tasks.view', 'tasks.create', 'tasks.edit',
    'statements.view', 'statements.send',
  ];
  const accountantPerms = allPermissions.filter((p) => accountantInclude.includes(p.key));
  await prisma.rolePermission.deleteMany({ where: { roleId: accountantRole.id } });
  await prisma.rolePermission.createMany({
    data: accountantPerms.map((p) => ({ roleId: accountantRole.id, permissionId: p.id })),
  });

  // Assign existing users to roles by their legacy enum
  const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  const managerUsers = await prisma.user.findMany({ where: { role: 'MANAGER' } });
  const accountantUsers = await prisma.user.findMany({ where: { role: 'ACCOUNTANT' } });

  if (adminUsers.length) {
    await prisma.user.updateMany({
      where: { role: 'ADMIN' },
      data: { roleId: adminRole.id },
    });
  }
  if (managerUsers.length) {
    await prisma.user.updateMany({
      where: { role: 'MANAGER' },
      data: { roleId: managerRole.id },
    });
  }
  if (accountantUsers.length) {
    await prisma.user.updateMany({
      where: { role: 'ACCOUNTANT' },
      data: { roleId: accountantRole.id },
    });
  }

  // Subscription plans (South Africa pricing)
  const STARTER = await prisma.subscriptionPlan.upsert({
    where: { name: 'STARTER' },
    create: {
      name: 'STARTER',
      price: 250,
      billingCycle: 'monthly',
      featuresJson: { features: ['Up to 5 users', 'Basic invoicing', 'Expense tracking'] },
      isActive: true,
    },
    update: { price: 250, featuresJson: { features: ['Up to 5 users', 'Basic invoicing', 'Expense tracking'] } },
  });

  const GROWTH = await prisma.subscriptionPlan.upsert({
    where: { name: 'GROWTH' },
    create: {
      name: 'GROWTH',
      price: 350,
      billingCycle: 'monthly',
      featuresJson: { features: ['Up to 15 users', 'Advanced invoicing', 'Reports', 'Recurring invoices'] },
      isActive: true,
    },
    update: { price: 350, featuresJson: { features: ['Up to 15 users', 'Advanced invoicing', 'Reports', 'Recurring invoices'] } },
  });

  const PROFESSIONAL = await prisma.subscriptionPlan.upsert({
    where: { name: 'PROFESSIONAL' },
    create: {
      name: 'PROFESSIONAL',
      price: 450,
      billingCycle: 'monthly',
      featuresJson: { features: ['Unlimited users', 'Full accounting', 'Priority support', 'API access'] },
      isActive: true,
    },
    update: { price: 450, featuresJson: { features: ['Unlimited users', 'Full accounting', 'Priority support', 'API access'] } },
  });

  console.log('RBAC seed complete:', {
    permissions: allPermissions.length,
    roles: [adminRole.name, managerRole.name, accountantRole.name],
    plans: [STARTER.name, GROWTH.name, PROFESSIONAL.name],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
