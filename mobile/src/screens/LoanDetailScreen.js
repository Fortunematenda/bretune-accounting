import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import PendingActionsCard from '../components/PendingActionsCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { usePendingActions } from '../hooks/usePendingActions';
import { api } from '../lib/api';
import { formatDate, formatMoney } from '../utils/format';

export default function LoanDetailScreen() {
  const route = useRoute();
  const loanId = route.params?.loanId;
  const queryClient = useQueryClient();
  const { actions, add } = usePendingActions();
  const query = useApiQuery(['loan', loanId], () => api.getLoan(loanId), { enabled: Boolean(loanId) });
  const cached = useCachedResource(`loan:${loanId}`, query.data);
  const loan = query.data || cached?.value;
  const [form, setForm] = useState({ amount: '', paymentDate: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submitRepayment() {
    if (!loan) return;
    setSaving(true);
    setError('');
    try {
      await api.addLoanRepayment(loan.id, {
        amount: String(form.amount),
        paymentDate: form.paymentDate || undefined,
        notes: form.notes || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['loan', loan.id] });
      await queryClient.invalidateQueries({ queryKey: ['loans'] });
      await queryClient.invalidateQueries({ queryKey: ['loansSummary'] });
      setForm({ amount: '', paymentDate: '', notes: '' });
    } catch (err) {
      await add({ type: 'Loan repayment', summary: `Repayment for ${loan.borrowerName || loan.id} amount ${form.amount}` });
      setError(err.message || 'Failed to add repayment');
    } finally {
      setSaving(false);
    }
  }

  if (!loanId) return <Screen><EmptyState title="Loan not selected" /></Screen>;
  if (query.error && !loan) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!loan) return <Screen><EmptyState title="Loading loan..." /></Screen>;

  return (
    <Screen scroll>
      <Card title={loan.borrowerName || 'Borrower'} subtitle={loan.customer?.companyName || loan.customer?.contactName || loan.status || 'Loan'}>
        <Text>Loan Date: {formatDate(loan.loanDate)}</Text>
        <Text>Due Date: {formatDate(loan.dueDate)}</Text>
        <Text>Amount: {formatMoney(loan.amount || 0)}</Text>
        <Text>Outstanding: {formatMoney(loan.outstandingBalance || 0)}</Text>
        <Text>Status: {String(loan.status || 'ACTIVE').replaceAll('_', ' ')}</Text>
      </Card>
      <Card title="Add repayment">
        <Field label="Amount" keyboardType="decimal-pad" value={form.amount} onChangeText={(value) => setForm((prev) => ({ ...prev, amount: value }))} placeholder="0.00" />
        <Field label="Payment Date" value={form.paymentDate} onChangeText={(value) => setForm((prev) => ({ ...prev, paymentDate: value }))} placeholder="YYYY-MM-DD" />
        <Field label="Notes" value={form.notes} onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Optional notes" />
        {error ? <Text style={{ color: '#dc2626' }}>{error}</Text> : null}
        <AppButton title={saving ? 'Saving...' : 'Add repayment'} onPress={submitRepayment} loading={saving} disabled={!form.amount} />
      </Card>
      <Card title="Repayments">
        {!loan.repayments?.length ? <EmptyState title="No repayments yet" /> : (
          <FlatList
            data={loan.repayments}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{formatMoney(item.amount || 0)}</Text>
                <Text>Date: {formatDate(item.paymentDate)}</Text>
                <Text>Notes: {item.notes || '—'}</Text>
              </View>
            )}
          />
        )}
      </Card>
      <PendingActionsCard actions={actions} />
    </Screen>
  );
}
