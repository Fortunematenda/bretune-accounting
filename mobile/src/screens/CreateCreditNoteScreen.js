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

export default function CreateCreditNoteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { actions, add } = usePendingActions();
  const customerId = route.params?.customerId;
  const query = useApiQuery(['customer', customerId], () => api.getCustomer(customerId), { enabled: Boolean(customerId) });
  const cached = useCachedResource(`customer:${customerId}`, query.data);
  const customer = query.data || cached?.value;
  const [invoicePickerOpen, setInvoicePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ invoiceId: '', amount: '', notes: '' });

  const eligibleInvoices = useMemo(() => {
    const invoices = Array.isArray(customer?.invoices) ? customer.invoices : [];
    return invoices.filter((item) => {
      const status = String(item?.status || '').toUpperCase();
      return !['DRAFT', 'CANCELLED', 'PAID'].includes(status) && Number(item?.balanceDue || 0) > 0;
    });
  }, [customer?.invoices]);

  const selectedInvoice = useMemo(() => eligibleInvoices.find((item) => item.id === form.invoiceId), [eligibleInvoices, form.invoiceId]);

  function pickInvoice(invoice) {
    setInvoicePickerOpen(false);
    setForm((prev) => ({
      ...prev,
      invoiceId: invoice.id,
      amount: String(invoice.balanceDue || ''),
    }));
  }

  async function submit() {
    if (!customer?.id || !form.invoiceId) return;
    setSaving(true);
    setError('');
    try {
      await api.createPayment({
        clientId: customer.id,
        invoiceId: form.invoiceId,
        amount: String(form.amount || '0'),
        method: 'CREDIT_NOTE',
        status: 'COMPLETED',
        notes: form.notes || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['customer', customer.id] });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (form.invoiceId) {
        await queryClient.invalidateQueries({ queryKey: ['invoice', form.invoiceId] });
      }
      navigation.goBack();
    } catch (err) {
      await add({ type: 'Create credit note', summary: `Credit note for ${customer.companyName || customer.contactName || customer.id}` });
      setError(err.message || 'Failed to create credit note');
    } finally {
      setSaving(false);
    }
  }

  if (!customerId) return <Screen><EmptyState title="Customer not selected" /></Screen>;
  if (query.error && !customer) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!customer) return <Screen><EmptyState title="Loading customer..." /></Screen>;

  return (
    <Screen scroll>
      <Card title="Add credit note" subtitle={customer.companyName || customer.contactName || 'Customer'}>
        {!eligibleInvoices.length ? (
          <EmptyState title="No eligible invoices" subtitle="Only unpaid customer invoices can receive a credit note." />
        ) : (
          <>
            <Text style={{ color: colors.muted }}>Invoice</Text>
            <Pressable onPress={() => setInvoicePickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
              <Text style={{ color: selectedInvoice ? colors.text : colors.muted }}>
                {selectedInvoice ? `${selectedInvoice.invoiceNumber || 'Invoice'} • ${formatMoney(selectedInvoice.balanceDue || 0)} due` : 'Select invoice'}
              </Text>
            </Pressable>
            <Field label="Credit amount" keyboardType="decimal-pad" value={form.amount} onChangeText={(value) => setForm((prev) => ({ ...prev, amount: value }))} placeholder="0.00" />
            <Field label="Notes" value={form.notes} onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Optional credit note reason" />
            {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
            <AppButton title={saving ? 'Saving...' : 'Create credit note'} onPress={submit} loading={saving} disabled={!form.invoiceId || !form.amount} />
          </>
        )}
      </Card>
      <PendingActionsCard actions={actions} />

      <Modal visible={invoicePickerOpen} transparent animationType="fade" onRequestClose={() => setInvoicePickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setInvoicePickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select invoice</Text>
            {eligibleInvoices.map((invoice) => (
              <Pressable key={invoice.id} onPress={() => pickInvoice(invoice)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{invoice.invoiceNumber || 'Invoice'}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>Outstanding: {formatMoney(invoice.balanceDue || 0)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
