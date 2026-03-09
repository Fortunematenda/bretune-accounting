import React from 'react';
import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card, EmptyState, ErrorState, Screen } from '../components/ui';
import { useCachedResource } from '../hooks/useCachedResource';
import { colors } from '../theme';
import { formatDate, formatMoney } from '../utils/format';

export default function CreditNoteDetailScreen() {
  const route = useRoute();
  const creditNoteId = route.params?.creditNoteId;
  const creditNote = route.params?.creditNote;

  if (!creditNoteId && !creditNote) {
    return (
      <Screen>
        <EmptyState title="Credit note not found" />
      </Screen>
    );
  }

  const item = creditNote || {};
  const isCreditNote = String(item?.method || '').toUpperCase() === 'CREDIT_NOTE';

  if (!isCreditNote) {
    return (
      <Screen>
        <ErrorState message="This is not a credit note." />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Card title="Credit note" subtitle={item.paymentNumber || 'Credit note'}>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.muted }}>Amount</Text>
            <Text style={{ fontWeight: '800', fontSize: 18, color: colors.primary }}>{formatMoney(item.amount || 0)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.muted }}>Applied date</Text>
            <Text style={{ fontWeight: '600', color: colors.text }}>{formatDate(item.paymentDate)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.muted }}>Status</Text>
            <Text style={{ fontWeight: '600', color: colors.text }}>{item.status || '—'}</Text>
          </View>
          {item.notes ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: colors.muted }}>Notes</Text>
              <Text style={{ color: colors.text, marginTop: 4 }}>{item.notes}</Text>
            </View>
          ) : null}
        </View>
      </Card>

      {item.invoiceId ? (
        <Card title="Applied to invoice" subtitle="Credit note was applied to this invoice">
          <Text style={{ color: colors.text }}>{item.invoice?.invoiceNumber || item.invoiceId}</Text>
        </Card>
      ) : null}

      {item.allocations?.length ? (
        <Card title="Allocations" subtitle={`${item.allocations.length} allocation(s)`}>
          {item.allocations.map((allocation, index) => (
            <View key={allocation.id || index} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 8 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{allocation.invoice?.invoiceNumber || 'Invoice'}</Text>
              <Text style={{ color: colors.muted, marginTop: 4 }}>Amount: {formatMoney(allocation.amount || 0)}</Text>
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
