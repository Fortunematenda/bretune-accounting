const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { ScheduleModule } = require('@nestjs/schedule');
const { ThrottlerGuard, ThrottlerModule } = require('@nestjs/throttler');
const { APP_GUARD } = require('@nestjs/core');
const { PrismaModule } = require('./config/prisma.module');
const { validateEnv } = require('./config/env.validation');
const { AuthModule } = require('./modules/auth/auth.module');
const { ClientsModule } = require('./modules/clients/clients.module');
const { ProductsModule } = require('./modules/products/products.module');
const { AutomationModule } = require('./modules/automation/automation.module');
const { RecurringInvoicesModule } = require('./modules/recurring-invoices/recurring-invoices.module');
const { InvoicesModule } = require('./modules/invoices/invoices.module');
const { QuotesModule } = require('./modules/quotes/quotes.module');
const { PaymentsModule } = require('./modules/payments/payments.module');
const { StatementsModule } = require('./modules/statements/statements.module');
const { ReportsModule } = require('./modules/reports/reports.module');
const { UsersModule } = require('./modules/users/users.module');
const { RolesModule } = require('./modules/roles/roles.module');
const { PermissionsModule } = require('./modules/permissions/permissions.module');
const { SettingsModule } = require('./modules/settings/settings.module');
const { EmployeesModule } = require('./modules/employees/employees.module');
const { ProjectsModule } = require('./modules/projects/projects.module');
const { BillsModule } = require('./modules/bills/bills.module');
const { TasksModule } = require('./modules/tasks/tasks.module');
const { SuppliersModule } = require('./modules/suppliers/suppliers.module');
const { SupplierPaymentsModule } = require('./modules/supplier-payments/supplier-payments.module');
const { ExpenseCategoriesModule } = require('./modules/expense-categories/expense-categories.module');
const { ExpensesModule } = require('./modules/expenses/expenses.module');
const { SubscriptionsModule } = require('./modules/subscriptions/subscriptions.module');
const { LedgerModule } = require('./modules/ledger/ledger.module');
const { BankReconciliationModule } = require('./modules/bank-reconciliation/bank-reconciliation.module');
const { BankAccountsModule } = require('./modules/bank-accounts/bank-accounts.module');
const { AccountingPeriodsModule } = require('./modules/accounting-periods/accounting-periods.module');
const { RecurringJournalModule } = require('./modules/recurring-journal/recurring-journal.module');
const { CurrenciesModule } = require('./modules/currencies/currencies.module');
const { AuditModule } = require('./modules/audit/audit.module');
const { FixedAssetsModule } = require('./modules/fixed-assets/fixed-assets.module');
const { PayrollModule } = require('./modules/payroll/payroll.module');
const { HealthModule } = require('./modules/health/health.module');
const { LoansModule } = require('./modules/loans/loans.module');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([{
      ttl: Number(process.env.THROTTLE_TTL_SECONDS || 60),
      limit: Number(process.env.THROTTLE_LIMIT || 100),
    }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProductsModule,
    AutomationModule,
    RecurringInvoicesModule,
    InvoicesModule,
    QuotesModule,
    PaymentsModule,
    StatementsModule,
    ReportsModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    SettingsModule,
    EmployeesModule,
    ProjectsModule,
    BillsModule,
    TasksModule,
    SuppliersModule,
    SupplierPaymentsModule,
    ExpenseCategoriesModule,
    ExpensesModule,
    SubscriptionsModule,
    LedgerModule,
    BankReconciliationModule,
    BankAccountsModule,
    AccountingPeriodsModule,
    RecurringJournalModule,
    CurrenciesModule,
    AuditModule,
    FixedAssetsModule,
    PayrollModule,
    HealthModule,
    LoansModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
class AppModule {}

module.exports = { AppModule };
