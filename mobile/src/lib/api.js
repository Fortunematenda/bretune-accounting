import { API_BASE } from '../config';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStore';

let refreshInFlight = null;

function buildQuery(params = {}) {
  const filtered = Object.fromEntries(Object.entries(params).filter(([, value]) => value != null && value !== ''));
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : '';
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, { method, body, headers });
    await clearTokens();
  }

  const contentType = res.headers.get('content-type') || '';
  let payload;
  try {
    payload = contentType.includes('application/json') ? await res.json() : await res.text();
  } catch {
    payload = await res.text();
  }

  if (!res.ok) {
    const message = typeof payload === 'object' && payload?.message ? payload.message : 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

async function requestRaw(path, { method = 'GET', body, headers } = {}) {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) return requestRaw(path, { method, body, headers });
    await clearTokens();
  }

  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed');
    throw new Error(text || 'Request failed');
  }

  return res;
}

async function tryRefresh() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data?.accessToken) return false;
      await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
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
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  profile: () => request('/auth/profile'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PATCH', body: payload }),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
  notifications: () => request('/reports/notifications'),
  getCompanySettings: () => request('/settings/company'),
  updateCompanySettings: (payload) => request('/settings/company', { method: 'PATCH', body: payload }),
  listSubscriptionPlans: () => request('/subscriptions/plans'),
  getSubscriptionStatus: () => request('/subscriptions/status'),
  upgradeSubscription: (planId) => request('/subscriptions/upgrade', { method: 'POST', body: { planId } }),
  createCheckoutSession: (planId) => request('/subscriptions/checkout', { method: 'POST', body: { planId } }),
  verifyCheckoutSession: (sessionId) => request('/subscriptions/verify-session', { method: 'POST', body: { sessionId } }),
  createBillingPortal: () => request('/subscriptions/portal', { method: 'POST' }),
  dashboardSummary: (params = {}) => request(`/reports/dashboard-summary${buildQuery(params)}`),
  dashboardSummaryQuick: (params = {}) => request(`/reports/dashboard-summary-quick${buildQuery(params)}`),
  listCustomers: (params = {}) => request(`/customers${buildQuery(params)}`),
  getCustomer: (id) => request(`/customers/${id}`),
  updateCustomer: (id, payload) => request(`/customers/${id}`, { method: 'PATCH', body: payload }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),
  listInvoices: (params = {}) => request(`/invoices${buildQuery(params)}`),
  getInvoice: (id) => request(`/invoices/${id}`),
  getNextInvoiceNumber: () => request('/invoices/next-number'),
  createInvoice: (payload) => request('/invoices', { method: 'POST', body: payload }),
  sendInvoice: (id) => request(`/invoices/${id}/send`, { method: 'POST' }),
  cancelInvoice: (id) => request(`/invoices/${id}/cancel`, { method: 'POST' }),
  downloadInvoicePdf: (id) => requestRaw(`/invoices/${id}/pdf`, { headers: { Accept: 'application/pdf' } }),
  listQuotes: (params = {}) => request(`/quotes${buildQuery(params)}`),
  createQuote: (payload) => request('/quotes', { method: 'POST', body: payload }),
  getNextQuoteNumber: () => request('/quotes/next-number'),
  listProducts: (params = {}) => request(`/items${buildQuery(params)}`),
  createProduct: (payload) => request('/items', { method: 'POST', body: payload }),
  listPayments: (params = {}) => request(`/payments${buildQuery(params)}`),
  createPayment: (payload) => request('/payments', { method: 'POST', body: payload }),
  updatePaymentAllocations: (id, payload) => request(`/payments/${id}/allocations`, { method: 'PATCH', body: payload }),
  listBills: (params = {}) => request(`/bills${buildQuery(params)}`),
  getBill: (id) => request(`/bills/${id}`),
  listLoans: (params = {}) => request(`/loans${buildQuery(params)}`),
  getLoan: (id) => request(`/loans/${id}`),
  getLoansSummary: () => request('/loans/summary'),
  addLoanRepayment: (id, payload) => request(`/loans/${id}/repayments`, { method: 'POST', body: payload }),
  balanceSheet: (params = {}) => request(`/reports/balance-sheet${buildQuery(params)}`),
  profitLoss: (params = {}) => request(`/reports/profit-loss${buildQuery(params)}`),
  getClientStatement: ({ clientId, from, to } = {}) => request(`/statements/client/${clientId}${buildQuery({ from, to })}`),
  downloadStatementPdf: ({ clientId, from, to } = {}) =>
    requestRaw(`/statements/client/${clientId}${buildQuery({ from, to, format: 'pdf' })}`, {
      headers: { Accept: 'application/pdf' },
    }),
};
