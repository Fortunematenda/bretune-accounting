import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useAuth } from "./features/auth/auth-context";
import AppShell from "./components/layout/app-shell";
import LandingPage from "./pages/landing";
import AboutPage from "./pages/about";
import GuidesPage from "./pages/guides";
import BlogPage from "./pages/blog";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import DashboardPage from "./pages/dashboard";
import CustomersPage from "./pages/customers";
import CustomerDetailPage from "./pages/customer-detail";
import InvoicesPage from "./pages/invoices";
import InvoiceNewPage from "./pages/invoices/NewInvoice";
import InvoiceDetailPage from "./pages/invoice-detail";
import InvoiceCreditNotePage from "./pages/invoices/InvoiceCreditNote";
import QuotesPage from "./pages/quotes";
import QuotePage from "./pages/quotes/QuotePage";
import ProductsPage from "./pages/products";
import ProductPage from "./pages/products/ProductPage";
import RecurringPage from "./pages/recurring";
import PaymentsPage from "./pages/payments";
import StatementsPage from "./pages/statements";
import ClientStatementPage from "./pages/statements/ClientStatement";
import AutomationPage from "./pages/automation";
import ReportsPage from "./pages/reports";
import SettingsPage from "./pages/settings";
import UsersPage from "./pages/users";
import RolesPage from "./pages/roles";
import RoleEditorPage from "./pages/roles/RoleEditor";
import AccountPage from "./pages/account";
import TasksPage from "./pages/tasks";
import SchedulerPage from "./pages/scheduler";
import BillsIndexPage from "./pages/bills";
import BillDetailsPage from "./pages/bill-detail";
import BillFormPage from "./pages/bill-form";
import ExpensesIndexPage from "./pages/expenses";
import ExpenseDetailPage from "./pages/expense-detail";
import ExpenseFormPage from "./pages/expense-form";
import ExpenseCategoriesPage from "./pages/expense-categories";
import SuppliersListPage from "./modules/suppliers/pages";
import SupplierDetailPage from "./modules/suppliers/pages/detail";
import SupplierNewPage from "./modules/suppliers/pages/new";
import SupplierEditPage from "./modules/suppliers/pages/edit";
import ChartOfAccountsPage from "./pages/chart-of-accounts";
import JournalEntriesPage from "./pages/journal-entries";
import JournalEntryDetailPage from "./pages/journal-entry-detail";
import JournalEntryFormPage from "./pages/journal-entry-form";
import BankAccountsPage from "./pages/bank-accounts";
import BankReconciliationPage from "./pages/bank-reconciliation";
import BankReconciliationDetailPage from "./pages/bank-reconciliation-detail";
import AccountingPeriodsPage from "./pages/accounting-periods";
import RecurringJournalPage from "./pages/recurring-journal";
import CurrenciesPage from "./pages/currencies";
import FixedAssetsPage from "./pages/fixed-assets";
import PayrollPage from "./pages/payroll";
import LoansPage from "./pages/loans";
import LoanDetailPage from "./pages/loan-detail";

function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/items/${id}` : "/items"} replace />;
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/suppliers" element={<SuppliersListPage />} />
        <Route path="/suppliers/new" element={<SupplierNewPage />} />
        <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
        <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />
        <Route path="/bills" element={<BillsIndexPage />} />
        <Route path="/bills/new" element={<BillFormPage />} />
        <Route path="/bills/:id" element={<BillDetailsPage />} />
        <Route path="/bills/:id/edit" element={<BillFormPage />} />
        <Route path="/expenses" element={<ExpensesIndexPage />} />
        <Route path="/expenses/new" element={<ExpenseFormPage />} />
        <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
        <Route path="/expenses/:id/edit" element={<ExpenseFormPage />} />
        <Route path="/expense-categories" element={<ExpenseCategoriesPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<InvoiceNewPage />} />
        <Route path="/invoices/:id/edit" element={<InvoiceNewPage />} />
        <Route path="/invoices/:id/credit-note" element={<InvoiceCreditNotePage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/quotes/new" element={<QuotePage />} />
        <Route path="/quotes/:id" element={<QuotePage />} />
        <Route path="/items" element={<ProductsPage />} />
        <Route path="/items/new" element={<ProductPage />} />
        <Route path="/items/:id" element={<ProductPage />} />
        <Route path="/products" element={<Navigate to="/items" replace />} />
        <Route path="/products/new" element={<Navigate to="/items/new" replace />} />
        <Route path="/products/:id" element={<LegacyProductRedirect />} />
        <Route path="/recurring" element={<RecurringPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/statements" element={<StatementsPage />} />
        <Route path="/statements/client" element={<ClientStatementPage />} />
        <Route path="/automation" element={<AutomationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/chart-of-accounts" element={<ChartOfAccountsPage />} />
        <Route path="/journal" element={<JournalEntriesPage />} />
        <Route path="/journal/new" element={<JournalEntryFormPage />} />
        <Route path="/journal/:id" element={<JournalEntryDetailPage />} />
        <Route path="/bank-accounts" element={<BankAccountsPage />} />
        <Route path="/bank-reconciliation" element={<BankReconciliationPage />} />
        <Route path="/bank-reconciliation/:id" element={<BankReconciliationDetailPage />} />
        <Route path="/accounting-periods" element={<AccountingPeriodsPage />} />
        <Route path="/recurring-journal" element={<RecurringJournalPage />} />
        <Route path="/currencies" element={<CurrenciesPage />} />
        <Route path="/fixed-assets" element={<FixedAssetsPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/:id" element={<LoanDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/scheduler" element={<SchedulerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/users" element={<UsersPage />} />
        <Route path="/settings/roles" element={<RolesPage />} />
        <Route path="/settings/roles/new" element={<RoleEditorPage />} />
        <Route path="/settings/roles/:id/edit" element={<RoleEditorPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

function HomeRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/guides" element={<GuidesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
