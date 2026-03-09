import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, ErrorState, Field, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { colors } from '../theme';
import { formatMoney } from '../utils/format';

export default function CustomersScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useApiQuery(['customers'], () => api.listCustomers({ limit: 50 }));
  const cached = useCachedResource('customers:list', data);
  const rows = data?.data || data?.items || data || cached?.value?.data || cached?.value?.items || cached?.value || [];
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) => [item.companyName, item.contactName, item.email, item.phone].some((value) => String(value || '').toLowerCase().includes(q)));
  }, [rows, search]);

  if (error && rows.length === 0) return <Screen><ErrorState message={error.message} /></Screen>;

  return (
    <Screen>
      <Field label="Search customers" value={search} onChangeText={setSearch} placeholder="Name, email, or phone" />
      {isLoading ? <EmptyState title="Loading customers..." /> : filteredRows.length === 0 ? <EmptyState title="No customers found" subtitle="Try a different search or add customers." /> : (
        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}>
              <Card>
                <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{item.companyName || item.contactName || 'Customer'}</Text>
                    <Text style={{ color: colors.muted, marginTop: 4 }}>{item.email || item.phone || 'No contact details'}</Text>
                    <Text style={{ color: colors.muted, marginTop: 8 }}>{item.address || item.addressLine1 || item.billingAddress || 'No address on file'}</Text>
                  </View>
                  <View style={{ minWidth: 118, alignItems: 'flex-end', gap: 4 }}>
                    <Text style={{ fontSize: 12, color: colors.muted }}>Balance</Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: Number(item.balance || 0) > 0 ? '#ea7a00' : colors.text }}>{formatMoney(item.balance || 0)}</Text>
                    <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700' }}>Open details</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
