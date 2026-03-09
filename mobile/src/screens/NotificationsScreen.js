import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card, EmptyState, ErrorState, Screen } from '../components/ui';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { api } from '../lib/api';
import { formatDate, formatMoney } from '../utils/format';

export default function NotificationsScreen() {
  const query = useApiQuery(['notifications'], () => api.notifications ? api.notifications() : Promise.resolve(null));
  const cached = useCachedResource('notifications:list', query.data);
  const notifications = query.data || cached?.value;
  const overdueInvoices = notifications?.overdueInvoices || [];

  if (query.error && !notifications) return <Screen><ErrorState message={query.error.message} /></Screen>;

  return (
    <Screen scroll>
      <Card title="Notifications" subtitle="Operational alerts from the same reports controller used on web.">
        <Text>Overdue invoices: {notifications?.overdue?.count ?? 0}</Text>
        <Text>Email pending: {notifications?.emailOutbox?.pending ?? 0}</Text>
        <Text>Email failed: {notifications?.emailOutbox?.failed ?? 0}</Text>
      </Card>
      <Card title="Overdue invoices">
        {!overdueInvoices.length ? (
          <EmptyState title="No overdue invoice alerts" />
        ) : (
          <FlatList
            data={overdueInvoices}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700' }}>{item.invoiceNumber || 'Invoice'}</Text>
                <Text>Customer: {item.customerName || 'Client'}</Text>
                <Text>Due Date: {formatDate(item.dueDate)}</Text>
                <Text>Amount Due: {formatMoney(item.amountDue || 0)}</Text>
              </View>
            )}
          />
        )}
      </Card>
    </Screen>
  );
}
