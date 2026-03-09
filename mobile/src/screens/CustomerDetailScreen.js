import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Card, EmptyState, ErrorState, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { colors } from '../theme';
import { formatDate, formatMoney } from '../utils/format';

function DetailRow({ icon, label, value }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <View style={{ height: 34, width: 34, borderRadius: 10, backgroundColor: '#f5f3ff', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 2 }}>{value || '—'}</Text>
      </View>
    </View>
  );
}

function SectionListItem({ title, subtitle, meta, amount, amountTone = colors.text, onPress, badgeLabel, badgeTone = colors.text }) {
  return (
    <Pressable onPress={onPress} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, backgroundColor: colors.card }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: colors.text }}>{title}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{subtitle}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {meta ? <Text style={{ color: colors.muted, fontSize: 12 }}>{meta}</Text> : null}
            {badgeLabel ? (
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: badgeTone === colors.success ? '#dcfce7' : '#fee2e2' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: badgeTone }}>{badgeLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <Text style={{ fontWeight: '800', color: amountTone }}>{amount}</Text>
      </View>
    </Pressable>
  );
}

export default function CustomerDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const customerId = route.params?.customerId;
  const query = useApiQuery(['customer', customerId], () => api.getCustomer(customerId), { enabled: Boolean(customerId) });
  const cached = useCachedResource(`customer:${customerId}`, query.data);
  const customer = query.data || cached?.value;
  const [manageMenuOpen, setManageMenuOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const displayName = customer?.companyName || customer?.contactName || 'Customer';
  const customerReference = useMemo(() => {
    const seq = Number(customer?.clientSeq || 0);
    if (Number.isFinite(seq) && seq > 0) return String(seq).padStart(3, '0');
    return '—';
  }, [customer?.clientSeq]);
  const initials = useMemo(() => {
    return displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'CU';
  }, [displayName]);

  if (!customerId) return <Screen><EmptyState title="Customer not selected" /></Screen>;
  if (query.error && !customer) return <Screen><ErrorState message={query.error.message} /></Screen>;
  if (!customer) return <Screen><EmptyState title="Loading customer..." /></Screen>;

  function openEdit() {
    setManageMenuOpen(false);
    navigation.navigate('EditCustomer', { customerId: customer.id });
  }

  function confirmDelete() {
    setManageMenuOpen(false);
    Alert.alert('Delete customer', 'This will remove the customer if it is not referenced by other records.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteCustomer(customer.id);
            await queryClient.invalidateQueries({ queryKey: ['customers'] });
            navigation.goBack();
          } catch (err) {
            Alert.alert('Unable to delete', err.message || 'Failed to delete customer');
          }
        },
      },
    ]);
  }

  function handleCustomerAction(action) {
    setActionsMenuOpen(false);
    if (action === 'invoice') {
      navigation.navigate('CreateInvoice', { customerId: customer.id });
      return;
    }
    if (action === 'quote') {
      navigation.navigate('CreateQuote', { customerId: customer.id });
      return;
    }
    if (action === 'credit') {
      navigation.navigate('CreateCreditNote', { customerId: customer.id });
      return;
    }
    if (action === 'allocate') {
      navigation.navigate('AllocatePayment', { customerId: customer.id });
      return;
    }
    Alert.alert('Coming soon', {
      email: 'Email invoice is available from invoice details after opening an invoice.',
    }[action] || 'This action is not yet available.');
  }

  return (
    <Screen scroll>
      <Card>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View style={{ height: 58, width: 58, borderRadius: 29, backgroundColor: '#efe7ff', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 20 }}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{displayName}</Text>
            {customer.email ? <Text style={{ color: colors.muted, marginTop: 4 }}>{customer.email}</Text> : null}
          </View>
          <Pressable onPress={() => setManageMenuOpen(true)} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => setActionsMenuOpen(true)} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#f5f3ff', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#eef2f7', padding: 16 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Customer balance</Text>
          <Text style={{ color: Number(customer.balance || 0) > 0 ? '#ea7a00' : colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>{formatMoney(customer.balance || 0)}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>Outstanding customer position including opening balance, unpaid invoices, and credit balance adjustments.</Text>
        </View>
      </Card>
      <Card title="Contact information" subtitle="Primary customer details">
        <DetailRow icon="mail-outline" label="Email" value={customer.email} />
        <DetailRow icon="call-outline" label="Phone" value={customer.phone} />
        <DetailRow icon="location-outline" label="Address" value={customer.address || customer.addressLine1 || customer.billingAddress || 'No address on file'} />
      </Card>
      <Card title="Account overview" subtitle="Commercial terms and status">
        <DetailRow icon="card-outline" label="Customer reference" value={customerReference} />
        <DetailRow icon="calendar-outline" label="Payment terms" value={`${customer.paymentTermsDays || 30} days`} />
        <DetailRow icon="wallet-outline" label="Credit balance" value={formatMoney(customer.creditBalance || 0)} />
      </Card>
      <Card title="Invoices" subtitle={`${customer.invoices?.length || 0} invoice records`}>
        {!customer.invoices?.length ? <EmptyState title="No invoices" /> : (
          <FlatList
            data={customer.invoices}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              (() => {
                const isPaid = Number(item.balanceDue || 0) <= 0 || String(item.status || '').toUpperCase() === 'PAID';
                return (
              <SectionListItem
                title={item.invoiceNumber || 'Invoice'}
                subtitle={`Due ${formatDate(item.dueDate)}`}
                meta={`Total: ${formatMoney(item.totalAmount || 0)}`}
                amount={formatMoney(item.totalAmount || 0)}
                amountTone={colors.text}
                badgeLabel={isPaid ? 'Paid' : 'Unpaid'}
                badgeTone={isPaid ? colors.success : colors.danger}
                onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: item.id })}
              />
                );
              })()
            )}
          />
        )}
      </Card>
      <Card title="Payments" subtitle={`${customer.payments?.length || 0} payment records`}>
        {!customer.payments?.length ? <EmptyState title="No payments" /> : (
          <FlatList
            data={customer.payments}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              const isCreditNote = String(item?.method || '').toUpperCase() === 'CREDIT_NOTE';
              return (
                <SectionListItem
                  title={isCreditNote ? 'Credit note' : (item.paymentNumber || 'Payment')}
                  subtitle={`${isCreditNote ? 'Applied' : 'Received'} ${formatDate(item.paymentDate)}`}
                  meta={`Status: ${item.status || '—'}`}
                  amount={formatMoney(item.amount || 0)}
                  amountTone={isCreditNote ? colors.primary : (colors.success || '#16a34a')}
                  badgeLabel={isCreditNote ? 'Credit note' : undefined}
                  badgeTone={isCreditNote ? colors.primary : undefined}
                  onPress={isCreditNote ? () => navigation.navigate('CreditNoteDetail', { creditNoteId: item.id, creditNote: item }) : undefined}
                />
              );
            }}
          />
        )}
      </Card>

      <Modal visible={manageMenuOpen} transparent animationType="fade" onRequestClose={() => setManageMenuOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', alignItems: 'flex-end', paddingTop: 120, paddingRight: 18 }} onPress={() => setManageMenuOpen(false)}>
          <View style={{ width: 190, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={openEdit}>
              <Ionicons name="create-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Edit customer</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.danger }}>Delete customer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={actionsMenuOpen} transparent animationType="fade" onRequestClose={() => setActionsMenuOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', alignItems: 'flex-end', paddingTop: 120, paddingRight: 18 }} onPress={() => setActionsMenuOpen(false)}>
          <View style={{ width: 220, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={() => handleCustomerAction('invoice')}>
              <Ionicons name="document-text-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Add invoice</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={() => handleCustomerAction('quote')}>
              <Ionicons name="reader-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Add quote</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={() => handleCustomerAction('credit')}>
              <Ionicons name="receipt-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Add credit note</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={() => handleCustomerAction('allocate')}>
              <Ionicons name="swap-horizontal-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Allocate payment</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14 }} onPress={() => handleCustomerAction('email')}>
              <Ionicons name="mail-outline" size={18} color={colors.text} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Email invoice</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
