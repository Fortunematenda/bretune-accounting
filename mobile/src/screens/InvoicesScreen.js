import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { formatDate, formatMoney } from '../utils/format';

export default function InvoicesScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useApiQuery(['invoices'], () => api.listInvoices({ limit: 50 }));
  const cached = useCachedResource('invoices:list', data);
  const rows = data?.data || data?.items || data || cached?.value?.data || cached?.value?.items || cached?.value || [];
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesSearch = !q || [item.invoiceNumber, item.client?.companyName, item.clientName, item.status].some((value) => String(value || '').toLowerCase().includes(q));
      const matchesStatus = !statusFilter || String(item.status || '').toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  if (error && rows.length === 0) return <Screen><ErrorState message={error.message} /></Screen>;

  return (
    <Screen>
      <AppButton title="Create invoice" onPress={() => navigation.navigate('CreateInvoice')} />
      <Field label="Search invoices" value={search} onChangeText={setSearch} placeholder="Invoice number or customer" />
      <Field label="Status filter" value={statusFilter} onChangeText={(value) => setStatusFilter(String(value || '').toUpperCase())} placeholder="DRAFT, SENT, PAID..." />
      {isLoading ? <EmptyState title="Loading invoices..." /> : filteredRows.length === 0 ? <EmptyState title="No invoices found" subtitle="Try a different search or filter." /> : (
        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: item.id })}>
              <Card title={item.invoiceNumber || 'Invoice'} subtitle={`${item.client?.companyName || item.clientName || 'Customer'} • ${String(item.status || 'DRAFT').replaceAll('_', ' ')}`}>
                <Text>Issue Date: {formatDate(item.issueDate)}</Text>
                <Text>Due Date: {formatDate(item.dueDate)}</Text>
                <Text>Total: {formatMoney(item.totalAmount || 0)}</Text>
                <Text>Balance Due: {formatMoney(item.balanceDue || 0)}</Text>
                <Text style={{ color: '#7c3aed', fontWeight: '600', marginTop: 6 }}>Open details</Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
