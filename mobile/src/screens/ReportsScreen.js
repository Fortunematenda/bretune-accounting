import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card, EmptyState, ErrorState, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { formatDate, formatMoney } from '../utils/format';

export default function ReportsScreen() {
  const balanceSheetQuery = useApiQuery(['balanceSheet'], () => api.balanceSheet());
  const profitLossQuery = useApiQuery(['profitLoss'], () => api.profitLoss());
  const billsQuery = useApiQuery(['bills'], () => api.listBills({ limit: 10 }));
  const paymentsQuery = useApiQuery(['payments'], () => api.listPayments({ limit: 10 }));

  const cachedBalanceSheet = useCachedResource('reports:balanceSheet', balanceSheetQuery.data);
  const cachedProfitLoss = useCachedResource('reports:profitLoss', profitLossQuery.data);
  const cachedBills = useCachedResource('reports:bills', billsQuery.data);
  const cachedPayments = useCachedResource('reports:payments', paymentsQuery.data);

  const bs = balanceSheetQuery.data || cachedBalanceSheet?.value;
  const pl = profitLossQuery.data || cachedProfitLoss?.value;
  const bills = billsQuery.data?.data || billsQuery.data || cachedBills?.value?.data || cachedBills?.value || [];
  const payments = paymentsQuery.data?.data || paymentsQuery.data || cachedPayments?.value?.data || cachedPayments?.value || [];

  if (balanceSheetQuery.error && !bs) return <Screen><ErrorState message={balanceSheetQuery.error.message} /></Screen>;
  if (profitLossQuery.error && !pl) return <Screen><ErrorState message={profitLossQuery.error.message} /></Screen>;

  return (
    <Screen scroll>
      <Card title="Balance Sheet">
        <Text>Total Assets: {formatMoney(bs?.assets?.total || 0)}</Text>
        <Text>Total Liabilities: {formatMoney(bs?.liabilities?.total || 0)}</Text>
        <Text>Total Equity: {formatMoney(bs?.equity?.total || 0)}</Text>
        <Text>Net Income: {formatMoney(bs?.reconciliation?.netIncome || 0)}</Text>
        <Text>Imbalance: {formatMoney(bs?.reconciliation?.imbalanceAmount || 0)}</Text>
      </Card>
      <Card title="Profit & Loss">
        <Text>Total Income: {formatMoney(pl?.income?.total || 0)}</Text>
        <Text>Total Expenses: {formatMoney(pl?.expenses?.total || 0)}</Text>
        <Text>Net Income: {formatMoney(pl?.netIncome || 0)}</Text>
      </Card>
      <Card title="Recent Bills">
        {!bills.length ? (
          <EmptyState title="No bills found" />
        ) : (
          <FlatList
            data={bills}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{item.billNumber || item.vendorName || 'Bill'}</Text>
                <Text>Vendor: {item.vendorName || '—'}</Text>
                <Text>Due Date: {formatDate(item.dueDate)}</Text>
                <Text>Status: {String(item.status || 'UNPAID').replaceAll('_', ' ')}</Text>
                <Text>Balance Due: {formatMoney(item.balanceDue || 0)}</Text>
              </View>
            )}
          />
        )}
      </Card>
      <Card title="Recent Payments">
        {!payments.length ? (
          <EmptyState title="No payments found" />
        ) : (
          <FlatList
            data={payments}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{item.paymentNumber || 'Payment'}</Text>
                <Text>Date: {formatDate(item.paymentDate)}</Text>
                <Text>Method: {String(item.method || '—').replaceAll('_', ' ')}</Text>
                <Text>Status: {String(item.status || 'COMPLETED').replaceAll('_', ' ')}</Text>
                <Text>Amount: {formatMoney(item.amount || 0)}</Text>
              </View>
            )}
          />
        )}
      </Card>
    </Screen>
  );
}
