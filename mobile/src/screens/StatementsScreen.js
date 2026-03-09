import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import PendingActionsCard from '../components/PendingActionsCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { usePendingActions } from '../hooks/usePendingActions';
import { API_BASE } from '../config';
import { api } from '../lib/api';
import { getAccessToken } from '../lib/tokenStore';
import { formatDate, formatMoney } from '../utils/format';

export default function StatementsScreen() {
  const { actions, add } = usePendingActions();
  const customersQuery = useApiQuery(['statementCustomers'], () => api.listCustomers({ limit: 100 }));
  const customers = customersQuery.data?.data || customersQuery.data?.items || customersQuery.data || [];
  const [clientId, setClientId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const statementQuery = useApiQuery(['statement', clientId, from, to], () => api.getClientStatement({ clientId, from, to }), { enabled: Boolean(clientId) });
  const cached = useCachedResource(`statement:${clientId}:${from}:${to}`, statementQuery.data);

  const selectedCustomer = useMemo(() => customers.find((item) => item.id === clientId), [customers, clientId]);
  const statement = statementQuery.data || cached?.value;

  async function downloadStatement() {
    if (!clientId) return;
    setDownloadLoading(true);
    setDownloadError('');
    try {
      const token = await getAccessToken();
      const safeName = String(selectedCustomer?.companyName || selectedCustomer?.contactName || clientId || 'statement').replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileUri = `${FileSystem.cacheDirectory}statement-${safeName}.pdf`;
      const query = new URLSearchParams(Object.fromEntries(Object.entries({ from, to, format: 'pdf' }).filter(([, v]) => v))).toString();
      const url = `${API_BASE}/statements/client/${clientId}${query ? `?${query}` : ''}`;
      await FileSystem.downloadAsync(url, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', dialogTitle: 'Share statement PDF' });
      }
    } catch (err) {
      await add({ type: 'Statement download', summary: `Statement PDF for ${selectedCustomer?.companyName || selectedCustomer?.contactName || clientId}` });
      setDownloadError(err.message || 'Failed to download statement PDF');
    } finally {
      setDownloadLoading(false);
    }
  }

  return (
    <Screen>
      <Card title="Client statement" subtitle="Choose a customer and load or download their statement.">
        <Field label="Customer ID" value={clientId} onChangeText={setClientId} placeholder="Paste customer ID" />
        <Field label="From date" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" />
        <Field label="To date" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" />
        {selectedCustomer ? <Text>Selected: {selectedCustomer.companyName || selectedCustomer.contactName}</Text> : null}
        {!selectedCustomer && customers.length > 0 ? <Text>Available customers: {customers.slice(0, 5).map((c) => c.companyName || c.contactName).join(', ')}</Text> : null}
        {downloadError ? <Text style={{ color: '#dc2626' }}>{downloadError}</Text> : null}
        <AppButton title={downloadLoading ? 'Preparing PDF...' : 'Download PDF'} onPress={downloadStatement} loading={downloadLoading} disabled={!clientId} />
      </Card>
      {statementQuery.error && !statement ? <ErrorState message={statementQuery.error.message} /> : null}
      {!clientId ? <EmptyState title="Enter a customer ID" subtitle="This mobile version loads statements by customer ID." /> : statementQuery.isLoading && !statement ? <EmptyState title="Loading statement..." /> : statement ? (
        <>
          <Card title="Summary">
            <Text>Opening Balance: {formatMoney(statement.summary?.openingBalance || 0)}</Text>
            <Text>Closing Balance: {formatMoney(statement.summary?.closingBalance || 0)}</Text>
            <Text>Total Loaned: {formatMoney(statement.loansSummary?.totalLoaned || 0)}</Text>
            <Text>Loan Balance: {formatMoney(statement.loansSummary?.outstandingBalance || statement.loansSummary?.totalOutstanding || 0)}</Text>
          </Card>
          <FlatList
            data={statement.ledger || []}
            keyExtractor={(item, index) => item.id || `${item.type}-${index}`}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            renderItem={({ item }) => (
              <Card title={item.description || item.type || 'Entry'} subtitle={formatDate(item.date)}>
                <Text>Debit: {formatMoney(item.debit || 0)}</Text>
                <Text>Credit: {formatMoney(item.credit || 0)}</Text>
                <Text>Balance: {formatMoney(item.balance || 0)}</Text>
              </Card>
            )}
          />
          <PendingActionsCard actions={actions} />
        </>
      ) : null}
    </Screen>
  );
}
