import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import PendingActionsCard from '../components/PendingActionsCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { usePendingActions } from '../hooks/usePendingActions';
import { api } from '../lib/api';
import { colors } from '../theme';
import { formatMoney } from '../utils/format';

export default function AllocatePaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { actions, add } = usePendingActions();
  const customerId = route.params?.customerId;
  const query = useApiQuery(['customer', customerId], () => api.getCustomer(customerId), { enabled: Boolean(customerId) });
  const cached = useCachedResource(`customer:${customerId}`, query.data);
  const customer = query.data || cached?.value;
  const [mode, setMode] = useState('allocate');
  const [paymentPickerOpen, setPaymentPickerOpen] = useState(false);
  const [invoicePickerOpen, setInvoicePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ paymentId: '', invoiceId: '', amount: '', method: 'BANK_TRANSFER', notes: '' });

  const eligiblePayments = useMemo(() => {
    const payments = Array.isArray(customer?.payments) ? customer.payments : [];
    return payments.filter((p) => {
      const isCreditNote = String(p?.method || '').toUpperCase() === 'CREDIT_NOTE';
      if (isCreditNote) return false;
      const unallocated = Number(p?.unallocatedAmount ?? p?.amount ?? 0);
      return unallocated > 0;
    });
  }, [customer?.payments]);

  const eligibleInvoices = useMemo(() => {
    const invoices = Array.isArray(customer?.invoices) ? customer.invoices : [];
    return invoices.filter((item) => {
      const status = String(item?.status || '').toUpperCase();
      return !['DRAFT', 'CANCELLED', 'PAID'].includes(status) && Number(item?.balanceDue || 0) > 0;
    });
  }, [customer?.invoices]);

  const selectedPayment = useMemo(() => eligiblePayments.find((p) => p.id === form.paymentId), [eligiblePayments, form.paymentId]);
  const selectedInvoice = useMemo(() => eligibleInvoices.find((i) => i.id === form.invoiceId), [eligibleInvoices, form.invoiceId]);

  const maxAllocatable = useMemo(() => {
    const unallocated = Number(selectedPayment?.unallocatedAmount ?? selectedPayment?.amount ?? 0);
    const balanceDue = Number(selectedInvoice?.balanceDue ?? 0);
    return Math.min(unallocated, balanceDue);
  }, [selectedPayment, selectedInvoice]);

  function pickPayment(payment) {
    setPaymentPickerOpen(false);
    setForm((prev) => ({
      ...prev,
      paymentId: payment.id,
      amount: String(payment.unallocatedAmount ?? payment.amount ?? ''),
    }));
  }

  function pickInvoice(invoice) {
    setInvoicePickerOpen(false);
    setForm((prev) => ({
      ...prev,
      invoiceId: invoice.id,
      amount: String(Math.min(
        Number(selectedPayment?.unallocatedAmount ?? selectedPayment?.amount ?? 0),
        Number(invoice.balanceDue ?? 0)
      )),
    }));
  }

  async function submit() {
    setSaving(true);
    setError('');
    try {
      if (mode === 'allocate' && form.paymentId) {
        await api.updatePaymentAllocations(form.paymentId, {
          allocations: [{ invoiceId: form.invoiceId, amount: String(form.amount) }],
        });
      } else {
        await api.createPayment({
          clientId: customer.id,
          invoiceId: form.invoiceId || undefined,
          amount: String(form.amount),
          method: form.method,
          status: 'COMPLETED',
          notes: form.notes || undefined,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      navigation.goBack();
    } catch (err) {
      await add({ type: mode === 'allocate' ? 'Allocate payment' : 'Create payment', summary: `${mode === 'allocate' ? 'Allocate' : 'Create'} ${form.amount} for ${customer.companyName || customer.contactName || customer.id}` });
      setError(err.message || `Failed to ${mode === 'allocate' ? 'allocate' : 'create'} payment`);
    } finally {
      setSaving(false);
    }
  }

  if (!customerId) return <Screen><EmptyState title="Customer not selected" /></Screen>;
  if (query.error && !customer) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!customer) return <Screen><EmptyState title="Loading customer..." /></Screen>;

  return (
    <Screen scroll>
      <Card title={mode === 'allocate' ? 'Allocate payment' : 'Create payment'} subtitle={customer.companyName || customer.contactName || 'Customer'}>
        {eligiblePayments.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <Pressable
              onPress={() => setMode('allocate')}
              style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: mode === 'allocate' ? colors.primary : '#f1f5f9' }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '700', color: mode === 'allocate' ? '#fff' : colors.text }}>Allocate existing</Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('create')}
              style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: mode === 'create' ? colors.primary : '#f1f5f9' }}
            >
              <Text style={{ textAlign: 'center', fontWeight: '700', color: mode === 'create' ? '#fff' : colors.text }}>Create new</Text>
            </Pressable>
          </View>
        )}

        {mode === 'allocate' && eligiblePayments.length > 0 && (
          <>
            <Text style={{ color: colors.muted }}>Payment</Text>
            <Pressable onPress={() => setPaymentPickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
              <Text style={{ color: selectedPayment ? colors.text : colors.muted }}>
                {selectedPayment
                  ? `${selectedPayment.paymentNumber || 'Payment'} • ${formatMoney(selectedPayment.amount || 0)} (Unallocated: ${formatMoney(selectedPayment.unallocatedAmount ?? selectedPayment.amount ?? 0)})`
                  : 'Select payment with unallocated amount'}
              </Text>
            </Pressable>
          </>
        )}

        {mode === 'create' && (
          <>
            <Field label="Amount" keyboardType="decimal-pad" value={form.amount} onChangeText={(value) => setForm((prev) => ({ ...prev, amount: value }))} placeholder="0.00" />
            <Field label="Method" value={form.method} onChangeText={(value) => setForm((prev) => ({ ...prev, method: value }))} placeholder="BANK_TRANSFER" />
            <Field label="Notes" value={form.notes} onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Optional notes" />
          </>
        )}

        <Text style={{ color: colors.muted, marginTop: 12 }}>Invoice (optional)</Text>
        <Pressable onPress={() => setInvoicePickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
          <Text style={{ color: selectedInvoice ? colors.text : colors.muted }}>
            {selectedInvoice
              ? `${selectedInvoice.invoiceNumber || 'Invoice'} • Outstanding: ${formatMoney(selectedInvoice.balanceDue || 0)}`
              : mode === 'allocate' ? 'Select invoice to allocate to' : 'Select invoice to apply payment to (optional)'}
          </Text>
        </Pressable>

        {mode === 'allocate' && selectedPayment && selectedInvoice && (
          <Field
            label="Amount to allocate"
            keyboardType="decimal-pad"
            value={form.amount}
            onChangeText={(value) => setForm((prev) => ({ ...prev, amount: value }))}
            placeholder={`Max ${formatMoney(maxAllocatable)}`}
          />
        )}

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
        <AppButton
          title={saving ? (mode === 'allocate' ? 'Allocating...' : 'Creating...') : (mode === 'allocate' ? 'Allocate payment' : 'Create payment')}
          onPress={submit}
          loading={saving}
          disabled={!form.amount || (mode === 'allocate' && !form.paymentId)}
        />
      </Card>
      <PendingActionsCard actions={actions} />

      <Modal visible={paymentPickerOpen} transparent animationType="fade" onRequestClose={() => setPaymentPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setPaymentPickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select payment</Text>
            {eligiblePayments.map((payment) => (
              <Pressable key={payment.id} onPress={() => pickPayment(payment)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{payment.paymentNumber || 'Payment'}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>Total: {formatMoney(payment.amount || 0)}</Text>
                <Text style={{ color: colors.primary, marginTop: 2 }}>Unallocated: {formatMoney(payment.unallocatedAmount ?? payment.amount ?? 0)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={invoicePickerOpen} transparent animationType="fade" onRequestClose={() => setInvoicePickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setInvoicePickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select invoice</Text>
            {!eligibleInvoices.length ? (
              <Text style={{ color: colors.muted }}>No eligible invoices found.</Text>
            ) : (
              eligibleInvoices.map((invoice) => (
                <Pressable key={invoice.id} onPress={() => pickInvoice(invoice)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{invoice.invoiceNumber || 'Invoice'}</Text>
                  <Text style={{ color: colors.muted, marginTop: 4 }}>Outstanding: {formatMoney(invoice.balanceDue || 0)}</Text>
                </Pressable>
              ))
            )}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
