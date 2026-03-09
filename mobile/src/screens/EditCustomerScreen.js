import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AppButton, Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { colors } from '../theme';

export default function EditCustomerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const customerId = route.params?.customerId;
  const query = useApiQuery(['customer', customerId], () => api.getCustomer(customerId), { enabled: Boolean(customerId) });
  const cached = useCachedResource(`customer:${customerId}`, query.data);
  const customer = query.data || cached?.value;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    paymentTermsDays: '30',
    creditLimit: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (!customer) return;
    setForm({
      companyName: customer.companyName || '',
      contactName: customer.contactName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || customer.addressLine1 || customer.billingAddress || '',
      paymentTermsDays: String(customer.paymentTermsDays || 30),
      creditLimit: String(customer.creditLimit || ''),
      status: customer.status || 'ACTIVE',
    });
  }, [customer]);

  const headerName = useMemo(() => customer?.companyName || customer?.contactName || 'Customer', [customer]);

  async function submit() {
    if (!customer?.id) return;
    setSaving(true);
    setError('');
    try {
      await api.updateCustomer(customer.id, {
        companyName: form.companyName || undefined,
        contactName: form.contactName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        paymentTermsDays: form.paymentTermsDays ? Number(form.paymentTermsDays) : undefined,
        creditLimit: form.creditLimit || undefined,
        status: form.status || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['customer', customer.id] });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  }

  if (!customerId) return <Screen><EmptyState title="Customer not selected" /></Screen>;
  if (query.error && !customer) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!customer) return <Screen><EmptyState title="Loading customer..." /></Screen>;

  return (
    <Screen scroll>
      <Card title="Edit customer" subtitle={headerName}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Company name" value={form.companyName} onChangeText={(value) => setForm((prev) => ({ ...prev, companyName: value }))} placeholder="Company name" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Contact name" value={form.contactName} onChangeText={(value) => setForm((prev) => ({ ...prev, contactName: value }))} placeholder="Contact name" />
          </View>
        </View>
        <Field label="Email" value={form.email} onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))} placeholder="Email" />
        <Field label="Phone" value={form.phone} onChangeText={(value) => setForm((prev) => ({ ...prev, phone: value }))} placeholder="Phone" />
        <Field label="Address" value={form.address} onChangeText={(value) => setForm((prev) => ({ ...prev, address: value }))} placeholder="Address" multiline numberOfLines={3} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Payment terms (days)" value={form.paymentTermsDays} onChangeText={(value) => setForm((prev) => ({ ...prev, paymentTermsDays: value }))} placeholder="30" keyboardType="number-pad" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Credit limit" value={form.creditLimit} onChangeText={(value) => setForm((prev) => ({ ...prev, creditLimit: value }))} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
        </View>
        <Field label="Status" value={form.status} onChangeText={(value) => setForm((prev) => ({ ...prev, status: value.toUpperCase() }))} placeholder="ACTIVE" />
        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppButton title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title={saving ? 'Saving...' : 'Save changes'} onPress={submit} loading={saving} />
          </View>
        </View>
      </Card>
    </Screen>
  );
}
