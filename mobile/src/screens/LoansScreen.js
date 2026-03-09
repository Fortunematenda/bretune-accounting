import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, ErrorState, Field, Screen, Stat } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { formatDate, formatMoney } from '../utils/format';

export default function LoansScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const loansQuery = useApiQuery(['loans'], () => api.listLoans({ limit: 50 }));
  const summaryQuery = useApiQuery(['loansSummary'], () => api.getLoansSummary());
  const cached = useCachedResource('loans:list', loansQuery.data);
  const rows = loansQuery.data?.data || loansQuery.data?.items || loansQuery.data || cached?.value?.data || cached?.value?.items || cached?.value || [];
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesSearch = !q || [item.borrowerName, item.customer?.companyName, item.customer?.contactName, item.status].some((value) => String(value || '').toLowerCase().includes(q));
      const matchesStatus = !statusFilter || String(item.status || '').toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  if (loansQuery.error && rows.length === 0) return <Screen><ErrorState message={loansQuery.error.message} /></Screen>;

  return (
    <Screen>
      <Card title="Loan summary">
        <Stat label="Total loaned" value={formatMoney(summaryQuery.data?.totalLoaned || 0)} />
        <Stat label="Outstanding" value={formatMoney(summaryQuery.data?.totalOutstanding || 0)} tone="danger" />
      </Card>
      <Field label="Search loans" value={search} onChangeText={setSearch} placeholder="Borrower or customer" />
      <Field label="Status filter" value={statusFilter} onChangeText={(value) => setStatusFilter(String(value || '').toUpperCase())} placeholder="ACTIVE, REPAID..." />
      {loansQuery.isLoading ? <EmptyState title="Loading loans..." /> : filteredRows.length === 0 ? <EmptyState title="No loans found" subtitle="Try a different search or filter." /> : (
        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('LoanDetail', { loanId: item.id })}>
              <Card title={item.borrowerName || 'Borrower'} subtitle={String(item.status || 'ACTIVE').replaceAll('_', ' ')}>
                <Text>Loan Date: {formatDate(item.loanDate)}</Text>
                <Text>Due Date: {formatDate(item.dueDate)}</Text>
                <Text>Amount: {formatMoney(item.amount || 0)}</Text>
                <Text>Outstanding: {formatMoney(item.outstandingBalance || 0)}</Text>
                <Text style={{ color: '#7c3aed', fontWeight: '600', marginTop: 6 }}>Open details</Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
