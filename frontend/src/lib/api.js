import { getAccessToken, setTokens, clearTokens } from "../features/auth/token-store";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

let refreshInFlight = null;

async function request(path, { method = "GET", body, headers } = {}) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // try refresh once
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { method, body, headers });
    }
    clearTokens();
  }

  const contentType = res.headers.get("content-type") || "";
  let payload;
  try {
    payload = contentType.includes("application/json") ? await res.json() : await res.text();
  } catch (e) {
    payload = await res.text();
  }

  if (!res.ok) {
    const backendMessage =
      typeof payload === "object" && payload?.message
        ? payload.message
        : null;

    const requestId = typeof payload === "object" ? payload?.requestId : null;

    const fallback = "We couldn’t complete your request. Please try again.";
    const message = backendMessage || fallback;

    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    err.requestId = requestId || null;
    throw err;
  }

  return payload;
}

async function tryRefresh() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem("ba_refresh_token");
    if (!refreshToken) return false;

    try {
      const data = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }).then((r) => (r.ok ? r.json() : null));

      if (!data?.accessToken) return false;
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token, newPassword) =>
    request("/auth/reset-password", { method: "POST", body: { token, newPassword } }),
  createAdmin: ({ email, password, firstName, lastName, companyName }) =>
    request("/auth/create-admin", {
      method: "POST",
      body: { email, password, firstName, lastName, companyName },
    }),
  profile: () => request("/auth/profile"),
  updateProfile: (patch) => request("/auth/profile", { method: "PATCH", body: patch }),
  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    }),

  listUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users${qs ? `?${qs}` : ""}`);
  },
  createUser: (user) => request("/users", { method: "POST", body: user }),
  updateUser: (id, patch) => request(`/users/${id}`, { method: "PATCH", body: patch }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  updateUserRole: (id, payload) => request(`/users/${id}/role`, { method: "PUT", body: payload }),

  listRoles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/roles${qs ? `?${qs}` : ""}`);
  },
  getRole: (id) => request(`/roles/${id}`),
  createRole: (role) => request("/roles", { method: "POST", body: role }),
  updateRole: (id, role) => request(`/roles/${id}`, { method: "PUT", body: role }),
  deleteRole: (id) => request(`/roles/${id}`, { method: "DELETE" }),
  updateRolePermissions: (id, permissionIds) =>
    request(`/roles/${id}/permissions`, { method: "PUT", body: { permissionIds } }),
  duplicateRole: (id) => request(`/roles/${id}/duplicate`, { method: "POST" }),

  listPermissions: () => request("/permissions"),

  notifications: () => request("/reports/notifications"),
  dashboardSummary: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/reports/dashboard-summary${qs ? `?${qs}` : ""}`);
  },
  dashboardSummaryQuick: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/reports/dashboard-summary-quick${qs ? `?${qs}` : ""}`);
  },

  listCustomers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/customers${qs ? `?${qs}` : ""}`);
  },
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (customer) => request("/customers", { method: "POST", body: customer }),
  updateCustomer: (id, patch) => request(`/customers/${id}`, { method: "PATCH", body: patch }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: "DELETE" }),

  listCustomerDocuments: (customerId) => request(`/customers/${customerId}/documents`),
  deleteCustomerDocument: (customerId, documentId) =>
    request(`/customers/${customerId}/documents/${documentId}`, { method: "DELETE" }),
  uploadCustomerDocument: async (customerId, formData) => {
    let token = getAccessToken();
    let res = await fetch(`${API_BASE}/customers/${customerId}/documents`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        token = getAccessToken();
        res = await fetch(`${API_BASE}/customers/${customerId}/documents`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      }
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload?.message || "Failed to upload document");
      err.status = res.status;
      throw err;
    }
    return res.json();
  },
  downloadCustomerDocument: async (customerId, documentId) => {
    let token = getAccessToken();
    let res = await fetch(`${API_BASE}/customers/${customerId}/documents/${documentId}/download`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        token = getAccessToken();
        res = await fetch(`${API_BASE}/customers/${customerId}/documents/${documentId}/download`, {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload?.message || "Failed to download document");
      err.status = res.status;
      throw err;
    }

    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const filename = decodeURIComponent(match?.[1] || match?.[2] || "customer-document");
    const blob = await res.blob();
    return { blob, filename };
  },

  listClients: (params = {}) => api.listCustomers(params),
  getClient: (id) => api.getCustomer(id),
  createClient: (client) => api.createCustomer(client),
  updateClient: (id, patch) => api.updateCustomer(id, patch),
  deleteClient: (id) => api.deleteCustomer(id),

  listInvoices: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/invoices${qs ? `?${qs}` : ""}`);
  },

  getInvoice: (id) => request(`/invoices/${id}`),
  getNextInvoiceNumber: () => request("/invoices/next-number"),

  createInvoice: (invoice) => request("/invoices", { method: "POST", body: invoice }),
  updateInvoice: (id, invoice) => request(`/invoices/${id}`, { method: "PATCH", body: invoice }),

  listQuotes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/quotes${qs ? `?${qs}` : ""}`);
  },

  getQuote: (id) => request(`/quotes/${id}`),

  sendQuote: (id) => request(`/quotes/${id}/send`, { method: "POST" }),
  acceptQuote: (id) => request(`/quotes/${id}/accept`, { method: "POST" }),
  rejectQuote: (id) => request(`/quotes/${id}/reject`, { method: "POST" }),
  convertQuoteToInvoice: (id) => request(`/quotes/${id}/convert-to-invoice`, { method: "POST" }),

  createQuote: (quote) => request("/quotes", { method: "POST", body: quote }),
  updateQuote: (id, quote) => request(`/quotes/${id}`, { method: "PATCH", body: quote }),

  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/items${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => request(`/items/${id}`),
  createProduct: (product) => request("/items", { method: "POST", body: product }),
  updateProduct: (id, product) => request(`/items/${id}`, { method: "PATCH", body: product }),
  deleteProduct: (id) => request(`/items/${id}`, { method: "DELETE" }),

  listRecurringInvoices: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/recurring-invoices${qs ? `?${qs}` : ""}`);
  },
  getRecurringInvoice: (id) => request(`/recurring-invoices/${id}`),
  createRecurringInvoice: (payload) => request("/recurring-invoices", { method: "POST", body: payload }),
  updateRecurringInvoice: (id, payload) => request(`/recurring-invoices/${id}`, { method: "PATCH", body: payload }),
  deleteRecurringInvoice: (id) => request(`/recurring-invoices/${id}`, { method: "DELETE" }),
  pauseRecurringInvoice: (id) => request(`/recurring-invoices/${id}/pause`, { method: "POST" }),
  resumeRecurringInvoice: (id) => request(`/recurring-invoices/${id}/resume`, { method: "POST" }),

  listPayments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/payments${qs ? `?${qs}` : ""}`);
  },

  createPayment: (payload) => {
    return request("/payments", { method: "POST", body: payload });
  },

  voidPayment: (id, payload = {}) => {
    return request(`/payments/${id}/void`, { method: "POST", body: payload });
  },

  updatePaymentAllocations: (id, payload) => {
    return request(`/payments/${id}/allocations`, { method: "PATCH", body: payload });
  },

  getClientStatement: ({ clientId, from, to, format } = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries({ from, to, format }).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/statements/client/${clientId}${qs ? `?${qs}` : ""}`);
  },

  listEmailOutbox: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/automation/email-outbox${qs ? `?${qs}` : ""}`);
  },

  listRecurringRuns: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/automation/recurring-runs${qs ? `?${qs}` : ""}`);
  },

  outstandingInvoices: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/outstanding-invoices${qs ? `?${qs}` : ""}`);
  },

  aging: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/aging${qs ? `?${qs}` : ""}`);
  },

  monthlyRevenue: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/monthly-revenue${qs ? `?${qs}` : ""}`);
  },

  trialBalance: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/trial-balance${qs ? `?${qs}` : ""}`);
  },

  balanceSheet: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/balance-sheet${qs ? `?${qs}` : ""}`);
  },

  profitLoss: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/profit-loss${qs ? `?${qs}` : ""}`);
  },

  listLedgerAccounts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/ledger/accounts${qs ? `?${qs}` : ""}`);
  },

  getLedgerAccount: (id) => request(`/ledger/accounts/${id}`),

  createLedgerAccount: (payload) =>
    request("/ledger/accounts", { method: "POST", body: payload }),

  updateLedgerAccount: (id, payload) =>
    request(`/ledger/accounts/${id}`, { method: "PATCH", body: payload }),

  deleteLedgerAccount: (id) =>
    request(`/ledger/accounts/${id}`, { method: "DELETE" }),

  listJournalEntries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/ledger/journal-entries${qs ? `?${qs}` : ""}`);
  },

  getJournalEntry: (id) => request(`/ledger/journal-entries/${id}`),

  createJournalEntry: (payload) =>
    request("/ledger/journal-entries", { method: "POST", body: payload }),

  reverseJournalEntry: (id, payload = {}) =>
    request(`/ledger/journal-entries/${id}/reverse`, {
      method: "POST",
      body: payload,
    }),

  listBankAccounts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bank-accounts${qs ? `?${qs}` : ""}`);
  },
  getBankAccount: (id) => request(`/bank-accounts/${id}`),
  createBankAccount: (payload) => request("/bank-accounts", { method: "POST", body: payload }),
  updateBankAccount: (id, payload) => request(`/bank-accounts/${id}`, { method: "PATCH", body: payload }),
  deleteBankAccount: (id) => request(`/bank-accounts/${id}`, { method: "DELETE" }),

  listBankReconciliations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bank-reconciliation${qs ? `?${qs}` : ""}`);
  },
  getBankReconciliation: (id) => request(`/bank-reconciliation/${id}`),
  getUnreconciledActivity: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bank-reconciliation/unreconciled${qs ? `?${qs}` : ""}`);
  },
  createBankReconciliation: (payload) =>
    request("/bank-reconciliation", { method: "POST", body: payload }),
  importBankStatement: (payload) =>
    request("/bank-reconciliation/import", { method: "POST", body: payload }),
  importBankStatementPdfPreview: async (formData) => {
    let token = getAccessToken();
    let res = await fetch(`${API_BASE}/bank-reconciliation/import-pdf-preview`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        token = getAccessToken();
        res = await fetch(`${API_BASE}/bank-reconciliation/import-pdf-preview`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      }
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload?.message || "Failed to parse PDF");
      err.status = res.status;
      throw err;
    }
    return res.json();
  },
  importBankStatementPdf: async (formData) => {
    let token = getAccessToken();
    let res = await fetch(`${API_BASE}/bank-reconciliation/import-pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        token = getAccessToken();
        res = await fetch(`${API_BASE}/bank-reconciliation/import-pdf`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      }
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload?.message || "Failed to import PDF");
      err.status = res.status;
      throw err;
    }
    return res.json();
  },
  addBankStatementLines: (id, lines) =>
    request(`/bank-reconciliation/${id}/lines`, { method: "POST", body: { lines } }),
  matchBankReconciliation: (id, payload) =>
    request(`/bank-reconciliation/${id}/match`, { method: "POST", body: payload }),
  unmatchBankReconciliation: (id, payload) =>
    request(`/bank-reconciliation/${id}/unmatch`, { method: "POST", body: payload }),
  recordPaymentFromStatement: (id, payload) =>
    request(`/bank-reconciliation/${id}/record-payment`, { method: "POST", body: payload }),
  completeBankReconciliation: (id) =>
    request(`/bank-reconciliation/${id}/complete`, { method: "POST" }),

  listAccountingPeriods: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/accounting-periods${qs ? `?${qs}` : ""}`);
  },
  getLockedThrough: () => request("/accounting-periods/locked-through"),
  createAccountingPeriod: (payload) =>
    request("/accounting-periods", { method: "POST", body: payload }),
  closeAccountingPeriod: (id) =>
    request(`/accounting-periods/${id}/close`, { method: "POST" }),
  reopenAccountingPeriod: (id) =>
    request(`/accounting-periods/${id}/reopen`, { method: "POST" }),

  listRecurringJournals: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/recurring-journal${qs ? `?${qs}` : ""}`);
  },
  getRecurringJournal: (id) => request(`/recurring-journal/${id}`),
  createRecurringJournal: (payload) =>
    request("/recurring-journal", { method: "POST", body: payload }),
  updateRecurringJournal: (id, payload) =>
    request(`/recurring-journal/${id}`, { method: "PATCH", body: payload }),
  processRecurringJournals: () =>
    request("/recurring-journal/process-due", { method: "POST" }),

  listCurrencies: () => request("/currencies"),
  listExchangeRates: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/currencies/rates${qs ? `?${qs}` : ""}`);
  },
  getCurrencyHistory: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/currencies/rates/history${qs ? `?${qs}` : ""}`);
  },
  getExchangeRate: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/currencies/rates/lookup${qs ? `?${qs}` : ""}`);
  },
  setExchangeRate: (payload) =>
    request("/currencies/rates", { method: "POST", body: payload }),
  syncExchangeRates: () =>
    request("/currencies/rates/sync", { method: "POST" }),

  listFixedAssets: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/fixed-assets${qs ? `?${qs}` : ""}`);
  },
  getFixedAsset: (id) => request(`/fixed-assets/${id}`),
  createFixedAsset: (payload) =>
    request("/fixed-assets", { method: "POST", body: payload }),

  listPayRuns: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/payroll/pay-runs${qs ? `?${qs}` : ""}`);
  },
  getPayRun: (id) => request(`/payroll/pay-runs/${id}`),
  createPayRun: (payload) =>
    request("/payroll/pay-runs", { method: "POST", body: payload }),
  addPayRunLine: (id, payload) =>
    request(`/payroll/pay-runs/${id}/lines`, { method: "POST", body: payload }),

  approveJournalEntry: (id) =>
    request(`/ledger/journal-entries/${id}/approve`, { method: "POST" }),

  getCompanySettings: () => request("/settings/company"),
  updateCompanySettings: (patch) => request("/settings/company", { method: "PATCH", body: patch }),

  listSubscriptionPlans: () => request("/subscriptions/plans"),
  getSubscriptionStatus: () => request("/subscriptions/status"),
  upgradeSubscription: (planId) =>
    request("/subscriptions/upgrade", { method: "POST", body: { planId } }),

  listEmployees: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/employees${qs ? `?${qs}` : ""}`);
  },
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (payload) => request(`/employees`, { method: "POST", body: payload }),
  updateEmployee: (id, payload) => request(`/employees/${id}`, { method: "PATCH", body: payload }),
  activateEmployee: (id) => request(`/employees/${id}/activate`, { method: "PATCH" }),
  deactivateEmployee: (id) => request(`/employees/${id}/deactivate`, { method: "PATCH" }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),

  listProjects: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/projects${qs ? `?${qs}` : ""}`);
  },
  getProject: (id) => request(`/projects/${id}`),
  createProject: (payload) => request(`/projects`, { method: "POST", body: payload }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: "PATCH", body: payload }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  listBills: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bills${qs ? `?${qs}` : ""}`);
  },
  getBill: (id) => request(`/bills/${id}`),
  createBill: (payload) => request(`/bills`, { method: "POST", body: payload }),
  updateBill: (id, payload) => request(`/bills/${id}`, { method: "PATCH", body: payload }),
  deleteBill: (id) => request(`/bills/${id}`, { method: "DELETE" }),

  listExpenses: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/expenses${qs ? `?${qs}` : ""}`);
  },
  getExpense: (id) => request(`/expenses/${id}`),
  createExpense: (payload) => request(`/expenses`, { method: "POST", body: payload }),
  updateExpense: (id, payload) => request(`/expenses/${id}`, { method: "PATCH", body: payload }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
  approveExpense: (id) => request(`/expenses/${id}/approve`, { method: "POST" }),
  reimburseExpense: (id) => request(`/expenses/${id}/reimburse`, { method: "POST" }),

  listExpenseCategories: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/expense-categories${qs ? `?${qs}` : ""}`);
  },
  createExpenseCategory: (payload) => request(`/expense-categories`, { method: "POST", body: payload }),
  updateExpenseCategory: (id, payload) => request(`/expense-categories/${id}`, { method: "PATCH", body: payload }),
  deleteExpenseCategory: (id) => request(`/expense-categories/${id}`, { method: "DELETE" }),

  listTasks: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/tasks${qs ? `?${qs}` : ""}`);
  },
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (payload) => request(`/tasks`, { method: "POST", body: payload }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: "PATCH", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  completeTask: (id, payload = {}) => request(`/tasks/${id}/complete`, { method: "POST", body: payload }),
  cancelTask: (id) => request(`/tasks/${id}/cancel`, { method: "POST" }),
  rescheduleTask: (id, payload) => request(`/tasks/${id}/reschedule`, { method: "POST", body: payload }),
  tasksDashboardSummary: () => request(`/tasks/dashboard-summary`),
  tasksCalendar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/tasks/calendar${qs ? `?${qs}` : ""}`);
  },

  createSupplierPayment: (payload) =>
    request("/supplier-payments", { method: "POST", body: payload }),

  listSuppliers: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/suppliers${qs ? `?${qs}` : ""}`);
  },
  getSupplier: (id) => request(`/suppliers/${id}`),
  createSupplier: (payload) => request(`/suppliers`, { method: "POST", body: payload }),
  updateSupplier: (id, payload) => request(`/suppliers/${id}`, { method: "PUT", body: payload }),
  deleteSupplier: (id) => request(`/suppliers/${id}`, { method: "DELETE" }),

  getLoansSummary: () => request(`/loans/summary`),
  listLoans: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/loans${qs ? `?${qs}` : ""}`);
  },
  getLoan: (id) => request(`/loans/${id}`),
  createLoan: (payload) => request(`/loans`, { method: "POST", body: payload }),
  updateLoan: (id, payload) => request(`/loans/${id}`, { method: "PATCH", body: payload }),
  deleteLoan: (id) => request(`/loans/${id}`, { method: "DELETE" }),
  addLoanRepayment: (id, payload) => request(`/loans/${id}/repayments`, { method: "POST", body: payload }),
  deleteLoanRepayment: (loanId, repaymentId) => request(`/loans/${loanId}/repayments/${repaymentId}`, { method: "DELETE" }),
};
