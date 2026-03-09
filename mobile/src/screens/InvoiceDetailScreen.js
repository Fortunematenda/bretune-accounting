import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import PendingActionsCard from '../components/PendingActionsCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { usePendingActions } from '../hooks/usePendingActions';
import { API_BASE } from '../config';
import { api } from '../lib/api';
import { getAccessToken } from '../lib/tokenStore';
import { formatDate, formatMoney } from '../utils/format';

export default function InvoiceDetailScreen() {
  const route = useRoute();
  const invoiceId = route.params?.invoiceId;
  const queryClient = useQueryClient();
  const { actions, add } = usePendingActions();
  const query = useApiQuery(['invoice', invoiceId], () => api.getInvoice(invoiceId), { enabled: Boolean(invoiceId) });
  const cached = useCachedResource(`invoice:${invoiceId}`, query.data);
  const invoice = query.data || cached?.value;
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'BANK_TRANSFER', notes: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const outstanding = useMemo(() => Number(invoice?.balanceDue || 0), [invoice]);
  const status = String(invoice?.status || 'DRAFT').toUpperCase();
  const canSend = status === 'DRAFT';
  const canCancel = status === 'DRAFT';
  const canAddPayment = outstanding > 0 && status !== 'PAID' && status !== 'CANCELLED';

  async function submitPayment() {
    if (!invoice) return;
    setSaving(true);
    setFormError('');
    try {
      await api.createPayment({
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        amount: String(paymentForm.amount),
        method: paymentForm.method,
        status: 'COMPLETED',
        notes: paymentForm.notes || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['invoice', invoice.id] });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setPaymentForm({ amount: '', method: 'BANK_TRANSFER', notes: '' });
    } catch (err) {
      await add({ type: 'Add payment', summary: `Invoice ${invoice.invoiceNumber || invoice.id} payment for ${paymentForm.amount}` });
      setFormError(err.message || 'Failed to add payment');
    } finally {
      setSaving(false);
    }
  }

  async function refreshInvoice() {
    if (!invoice?.id) return;
    await queryClient.invalidateQueries({ queryKey: ['invoice', invoice.id] });
    await queryClient.invalidateQueries({ queryKey: ['invoices'] });
  }

  async function handleSend() {
    if (!invoice?.id) return;
    setActionLoading('send');
    setFormError('');
    try {
      await api.sendInvoice(invoice.id);
      await refreshInvoice();
    } catch (err) {
      await add({ type: 'Send invoice', summary: `Invoice ${invoice.invoiceNumber || invoice.id}` });
      setFormError(err.message || 'Failed to send invoice');
    } finally {
      setActionLoading('');
    }
  }

  async function handleCancel() {
    if (!invoice?.id) return;
    setActionLoading('cancel');
    setFormError('');
    try {
      await api.cancelInvoice(invoice.id);
      await refreshInvoice();
    } catch (err) {
      await add({ type: 'Cancel invoice', summary: `Invoice ${invoice.invoiceNumber || invoice.id}` });
      setFormError(err.message || 'Failed to cancel invoice');
    } finally {
      setActionLoading('');
    }
  }

  async function handlePdf() {
    if (!invoice?.id) return;
    setActionLoading('pdf');
    setFormError('');
    try {
      const token = await getAccessToken();
      const safeName = String(invoice.invoiceNumber || invoice.id).replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileUri = `${FileSystem.cacheDirectory}invoice-${safeName}.pdf`;
      const url = `${API_BASE}/invoices/${invoice.id}/pdf`;
      await FileSystem.downloadAsync(url, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', dialogTitle: 'Share invoice PDF' });
      }
    } catch (err) {
      await add({ type: 'Download invoice PDF', summary: `Invoice ${invoice.invoiceNumber || invoice.id}` });
      setFormError(err.message || 'Failed to download invoice PDF');
    } finally {
      setActionLoading('');
    }
  }

  if (!invoiceId) return <Screen><EmptyState title="Invoice not selected" /></Screen>;
  if (query.error && !invoice) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!invoice) return <Screen><EmptyState title="Loading invoice..." /></Screen>;

  return (
    <Screen scroll>
      <Card title={invoice.invoiceNumber || 'Invoice'} subtitle={`${invoice.client?.companyName || invoice.client?.contactName || 'Customer'} • ${invoice.status || 'DRAFT'}`}>
        <Text>Issue Date: {formatDate(invoice.issueDate)}</Text>
        <Text>Due Date: {formatDate(invoice.dueDate)}</Text>
        <Text>Total: {formatMoney(invoice.totalAmount || 0)}</Text>
        <Text>Balance Due: {formatMoney(invoice.balanceDue || 0)}</Text>
        <Text>Notes: {invoice.notes || '—'}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <AppButton title={actionLoading === 'pdf' ? 'Preparing PDF...' : 'Invoice PDF'} onPress={handlePdf} loading={actionLoading === 'pdf'} variant="secondary" />
          {canSend ? <AppButton title={actionLoading === 'send' ? 'Sending...' : 'Send'} onPress={handleSend} loading={actionLoading === 'send'} /> : null}
          {canCancel ? <AppButton title={actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel'} onPress={handleCancel} loading={actionLoading === 'cancel'} variant="secondary" /> : null}
        </View>
      </Card>
      <Card title="Items">
        {!invoice.items?.length ? <EmptyState title="No items" /> : (
          <FlatList
            data={invoice.items}
            scrollEnabled={false}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{item.description || item.product?.name || 'Item'}</Text>
                <Text>Qty: {item.quantity}</Text>
                <Text>Unit Price: {formatMoney(item.unitPrice || 0)}</Text>
                <Text>Total: {formatMoney(item.total || 0)}</Text>
              </View>
            )}
          />
        )}
      </Card>
      {canAddPayment ? (
        <Card title="Add payment" subtitle={`Outstanding: ${formatMoney(outstanding)}`}>
          <Field label="Amount" keyboardType="decimal-pad" value={paymentForm.amount} onChangeText={(value) => setPaymentForm((prev) => ({ ...prev, amount: value }))} placeholder="0.00" />
          <Field label="Method" value={paymentForm.method} onChangeText={(value) => setPaymentForm((prev) => ({ ...prev, method: value }))} placeholder="BANK_TRANSFER" />
          <Field label="Notes" value={paymentForm.notes} onChangeText={(value) => setPaymentForm((prev) => ({ ...prev, notes: value }))} placeholder="Optional notes" />
          {formError ? <Text style={{ color: '#dc2626' }}>{formError}</Text> : null}
          <AppButton title={saving ? 'Saving...' : 'Add payment'} onPress={submitPayment} loading={saving} disabled={!paymentForm.amount} />
        </Card>
      ) : null}
      <Card title="Payments">
        {!invoice.payments?.length ? <EmptyState title="No payments recorded" /> : (
          <FlatList
            data={invoice.payments}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{item.paymentNumber || 'Payment'}</Text>
                <Text>Date: {formatDate(item.paymentDate)}</Text>
                <Text>Amount: {formatMoney(item.amount || 0)}</Text>
                <Text>Status: {item.status}</Text>
              </View>
            )}
          />
        )}
      </Card>
      <PendingActionsCard actions={actions} />
    </Screen>
  );
}
