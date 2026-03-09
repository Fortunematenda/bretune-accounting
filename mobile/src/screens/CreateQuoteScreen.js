import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AppButton, Card, Field, Screen } from '../components/ui';
import PendingActionsCard from '../components/PendingActionsCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { usePendingActions } from '../hooks/usePendingActions';
import { api } from '../lib/api';
import { colors } from '../theme';
import { formatMoney } from '../utils/format';

const TAX_OPTIONS = [
  { label: 'No tax (0%)', value: '0' },
  { label: 'VAT 15%', value: '0.15' },
  { label: 'VAT 16%', value: '0.16' },
  { label: 'VAT 5%', value: '0.05' },
  { label: 'VAT 20%', value: '0.20' },
];

function defaultExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export default function CreateQuoteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { actions, add } = usePendingActions();
  const customersQuery = useApiQuery(['quoteCustomers'], () => api.listCustomers({ limit: 100 }));
  const productsQuery = useApiQuery(['quoteProducts'], () => api.listProducts({ limit: 100, isActive: true }));
  const nextNumberQuery = useApiQuery(['nextQuoteNumber'], () => api.getNextQuoteNumber());
  const [form, setForm] = useState({
    clientId: route.params?.customerId || '',
    expiryDate: defaultExpiryDate(),
    notes: '',
    productId: '',
    description: '',
    quantity: '1',
    unitPrice: '',
    taxRate: '0.15',
  });
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [taxPickerOpen, setTaxPickerOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newItemTaxPickerOpen, setNewItemTaxPickerOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ name: '', description: '', price: '', taxRate: '0.15' });
  const [saving, setSaving] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [error, setError] = useState('');

  const customers = customersQuery.data?.data || customersQuery.data || [];
  const products = productsQuery.data?.data || productsQuery.data || [];
  const selectedCustomer = useMemo(() => customers.find((item) => item.id === form.clientId), [customers, form.clientId]);
  const selectedProduct = useMemo(() => products.find((item) => item.id === form.productId), [products, form.productId]);
  const selectedTax = useMemo(() => TAX_OPTIONS.find((option) => option.value === form.taxRate) || TAX_OPTIONS[0], [form.taxRate]);
  const selectedNewItemTax = useMemo(() => TAX_OPTIONS.find((option) => option.value === newItemForm.taxRate) || TAX_OPTIONS[0], [newItemForm.taxRate]);
  const quoteNumber = nextNumberQuery.data?.quoteNumber || nextNumberQuery.data || 'Loading...';

  function pickProduct(product) {
    setProductPickerOpen(false);
    setForm((prev) => ({
      ...prev,
      productId: product.id,
      description: product.description || product.name || '',
      unitPrice: String(product.price || ''),
      taxRate: String(product.taxRate != null ? product.taxRate : prev.taxRate || '0'),
    }));
  }

  async function createNewItem() {
    setCreatingItem(true);
    setError('');
    try {
      const created = await api.createProduct({
        name: newItemForm.name,
        description: newItemForm.description || undefined,
        price: String(newItemForm.price || '0'),
        taxRate: String(newItemForm.taxRate || '0'),
        type: 'PRODUCT',
        isActive: true,
      });
      await queryClient.invalidateQueries({ queryKey: ['quoteProducts'] });
      setAddItemOpen(false);
      setNewItemTaxPickerOpen(false);
      setNewItemForm({ name: '', description: '', price: '', taxRate: '0.15' });
      setForm((prev) => ({
        ...prev,
        productId: created.id,
        description: created.description || created.name || '',
        unitPrice: String(created.price || ''),
        taxRate: String(created.taxRate != null ? created.taxRate : prev.taxRate || '0'),
      }));
    } catch (err) {
      setError(err.message || 'Failed to create item');
    } finally {
      setCreatingItem(false);
    }
  }

  async function submit() {
    setSaving(true);
    setError('');
    const payload = {
      clientId: form.clientId,
      expiryDate: form.expiryDate,
      notes: form.notes || undefined,
      items: [
        {
          productId: form.productId || undefined,
          description: form.description,
          quantity: String(form.quantity || '1'),
          unitPrice: String(form.unitPrice || '0'),
          discount: '0',
          taxRate: String(form.taxRate || '0'),
        },
      ],
    };

    try {
      await api.createQuote(payload);
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      navigation.goBack();
    } catch (err) {
      await add({ type: 'Create quote', summary: `Quote for ${selectedCustomer?.companyName || selectedCustomer?.contactName || form.clientId}` });
      setError(err.message || 'Failed to create quote');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <Card title="Create quote" subtitle={`Quote number: ${quoteNumber}`}>
        <Text style={{ color: colors.muted }}>Customer</Text>
        <Text style={{ color: colors.text, fontWeight: '700' }}>{selectedCustomer ? (selectedCustomer.companyName || selectedCustomer.contactName) : 'Select customer from customer details'}</Text>
        {!selectedCustomer ? <Text style={{ color: '#dc2626', marginTop: 6 }}>Open this form from a customer to create the quote automatically for that customer.</Text> : null}
        <Field label="Expiry Date" value={form.expiryDate} onChangeText={(value) => setForm((prev) => ({ ...prev, expiryDate: value }))} placeholder="YYYY-MM-DD" />
        <Text style={{ color: colors.muted }}>Service or product</Text>
        <Pressable onPress={() => setProductPickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
          <Text style={{ color: selectedProduct ? colors.text : colors.muted }}>{selectedProduct ? `${selectedProduct.name}${selectedProduct.price != null ? ` • ${formatMoney(selectedProduct.price)}` : ''}` : 'Select item from system'}</Text>
        </Pressable>
        {!products.length ? <AppButton title="Add new item" variant="secondary" onPress={() => setAddItemOpen(true)} /> : <Pressable onPress={() => setAddItemOpen(true)}><Text style={{ color: colors.primary, fontWeight: '700' }}>+ Add new item</Text></Pressable>}
        <Field label="Description" value={form.description} onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))} placeholder="Service or product" />
        <Field label="Quantity" keyboardType="decimal-pad" value={form.quantity} onChangeText={(value) => setForm((prev) => ({ ...prev, quantity: value }))} placeholder="1" />
        <Field label="Unit Price" keyboardType="decimal-pad" value={form.unitPrice} onChangeText={(value) => setForm((prev) => ({ ...prev, unitPrice: value }))} placeholder="0.00" />
        <Text style={{ color: colors.muted }}>Tax</Text>
        <Pressable onPress={() => setTaxPickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
          <Text style={{ color: colors.text }}>{selectedTax.label}</Text>
        </Pressable>
        <Field label="Notes" value={form.notes} onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Optional notes" />
        {error ? <Text style={{ color: '#dc2626' }}>{error}</Text> : null}
        <AppButton title={saving ? 'Creating...' : 'Create quote'} onPress={submit} loading={saving} disabled={!form.clientId || !form.expiryDate || !form.description || !form.unitPrice} />
      </Card>
      <PendingActionsCard actions={actions} />

      <Modal visible={productPickerOpen} transparent animationType="fade" onRequestClose={() => setProductPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setProductPickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select item</Text>
            {products.length ? products.map((product) => (
              <Pressable key={product.id} onPress={() => pickProduct(product)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{product.name}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>{formatMoney(product.price || 0)}</Text>
              </Pressable>
            )) : <Text style={{ color: colors.muted }}>No items found. Add your first item below.</Text>}
            <AppButton title="Add new item" variant="secondary" onPress={() => { setProductPickerOpen(false); setAddItemOpen(true); }} />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={taxPickerOpen} transparent animationType="fade" onRequestClose={() => setTaxPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setTaxPickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select tax</Text>
            {TAX_OPTIONS.map((option) => (
              <Pressable key={option.value} onPress={() => { setForm((prev) => ({ ...prev, taxRate: option.value })); setTaxPickerOpen(false); }} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={addItemOpen} transparent animationType="fade" onRequestClose={() => setAddItemOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setAddItemOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Add new item</Text>
            <Field label="Item name" value={newItemForm.name} onChangeText={(value) => setNewItemForm((prev) => ({ ...prev, name: value }))} placeholder="Consulting" />
            <Field label="Description" value={newItemForm.description} onChangeText={(value) => setNewItemForm((prev) => ({ ...prev, description: value }))} placeholder="Optional description" />
            <Field label="Price" keyboardType="decimal-pad" value={newItemForm.price} onChangeText={(value) => setNewItemForm((prev) => ({ ...prev, price: value }))} placeholder="0.00" />
            <Text style={{ color: colors.muted }}>Tax</Text>
            <Pressable onPress={() => setNewItemTaxPickerOpen(true)} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}>
              <Text style={{ color: colors.text }}>{selectedNewItemTax.label}</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <AppButton title="Cancel" variant="secondary" onPress={() => setAddItemOpen(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton title={creatingItem ? 'Saving...' : 'Save item'} onPress={createNewItem} loading={creatingItem} disabled={!newItemForm.name || !newItemForm.price} />
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={newItemTaxPickerOpen} transparent animationType="fade" onRequestClose={() => setNewItemTaxPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setNewItemTaxPickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select item tax</Text>
            {TAX_OPTIONS.map((option) => (
              <Pressable key={option.value} onPress={() => { setNewItemForm((prev) => ({ ...prev, taxRate: option.value })); setNewItemTaxPickerOpen(false); }} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
