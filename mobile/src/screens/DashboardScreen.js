import React, { useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PendingActionsCard from '../components/PendingActionsCard';
import { useAuth } from '../context/AuthContext';
import { useApiQuery } from '../hooks/useApiQuery';
import { useCachedResource } from '../hooks/useCachedResource';
import { usePendingActions } from '../hooks/usePendingActions';
import { api } from '../lib/api';
import { AppButton, Card, ErrorState, Screen } from '../components/ui';
import { colors } from '../theme';
import { formatDate, formatMoney } from '../utils/format';

function MetricCard({ title, total, totalLabel, overdue, overdueLabel, segments = [], primaryAction, secondaryAction }) {
  return (
    <Card title={title} right={<Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />}>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{total}</Text>
          <Text style={{ color: colors.muted, marginTop: 3 }}>{totalLabel}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#ea7a00' }}>{overdue}</Text>
          <Text style={{ color: colors.muted, marginTop: 3 }}>{overdueLabel}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
        {segments.map((segment) => (
          <View key={segment.label} style={{ flex: 1 }}>
            <View style={{ height: 4, borderRadius: 999, backgroundColor: colors.primary }} />
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>{segment.label}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <AppButton title={primaryAction.title} onPress={primaryAction.onPress} />
        <Pressable onPress={secondaryAction.onPress}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{secondaryAction.title}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function SummaryTile({ label, value, tone = 'default' }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#eef2f7' }}>
      <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
      <Text style={{ fontSize: 19, fontWeight: '800', color: tone === 'warning' ? '#ea7a00' : colors.text, marginTop: 4 }}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { actions } = usePendingActions();
  const quickQuery = useApiQuery(['dashboardSummaryQuick'], () => api.dashboardSummaryQuick());
  const fullQuery = useApiQuery(['dashboardSummary'], () => api.dashboardSummary ? api.dashboardSummary() : api.dashboardSummaryQuick());
  const loansQuery = useApiQuery(['loansSummary'], () => api.getLoansSummary());
  const cachedQuick = useCachedResource('dashboard:summaryQuick', quickQuery.data);
  const cachedFull = useCachedResource('dashboard:summaryFull', fullQuery.data);
  const cachedLoans = useCachedResource('dashboard:loansSummary', loansQuery.data);

  const summary = fullQuery.data || quickQuery.data || cachedFull?.value || cachedQuick?.value || {};
  const loansSummary = loansQuery.data || cachedLoans?.value || {};
  const recentInvoicePayments = Array.isArray(summary?.recentInvoicePayments) ? summary.recentInvoicePayments : [];
  const upcomingBills = Array.isArray(summary?.enterprise?.upcomingBills) ? summary.enterprise.upcomingBills : [];
  const overdueBills = summary?.enterprise?.overdueBills || { amount: 0, count: 0 };
  const kpis = summary?.kpis || {};
  const agingSummary = summary?.agingSummary || {};
  const invoiceSegments = useMemo(() => ([
    { label: '0-30 days', value: agingSummary?.bucket_0_30 || 0 },
    { label: '31-60', value: agingSummary?.bucket_31_60 || 0 },
    { label: '61-90', value: agingSummary?.bucket_61_90 || 0 },
    { label: '90+', value: agingSummary?.bucket_90_plus || 0 },
  ]), [agingSummary]);
  const billsSegments = useMemo(() => ([
    { label: 'Older', value: overdueBills?.amount || 0 },
    { label: 'This week', value: upcomingBills.length },
    { label: 'Next 7 days', value: upcomingBills.length },
    { label: 'Later', value: Math.max(0, upcomingBills.length - 3) },
  ]), [overdueBills, upcomingBills]);
  const dateRangeLabel = useMemo(() => {
    const asOf = summary?.asOf ? new Date(summary.asOf) : new Date();
    const start = new Date(asOf.getFullYear(), asOf.getMonth(), 1);
    return `${start.toISOString().slice(0, 10)} - ${asOf.toISOString().slice(0, 10)}`;
  }, [summary]);
  if (quickQuery.error && fullQuery.error && !cachedFull?.value && !cachedQuick?.value) {
    return <Screen><ErrorState message={quickQuery.error?.message || fullQuery.error?.message || 'Failed to load dashboard'} /></Screen>;
  }

  return (
    <Screen scroll>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Business Overview</Text>
        <Text style={{ color: colors.muted, fontSize: 14 }}>{dateRangeLabel}</Text>
      </View>
      <Card>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SummaryTile label="Receivables" value={formatMoney(kpis?.outstandingReceivables?.value || 0)} />
          <SummaryTile label="Overdue" value={formatMoney(kpis?.overdueReceivables?.value || 0)} tone="warning" />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SummaryTile label="Cash collected" value={formatMoney(kpis?.cashCollectedMtd?.value || 0)} />
          <SummaryTile label="Loans outstanding" value={formatMoney(loansSummary?.totalOutstanding || 0)} />
        </View>
        <Pressable onPress={() => navigation.navigate('Reports')} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>View reports</Text>
        </Pressable>
      </Card>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <AppButton title="Record Payment" onPress={() => navigation.navigate('Invoices')} />
        </View>
        <View style={{ flex: 1 }}>
          <AppButton title="Send Statement" variant="secondary" onPress={() => navigation.navigate('Statements')} />
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <MetricCard
          title="Invoices owed to you"
          total={formatMoney(kpis?.outstandingReceivables?.value || 0)}
          totalLabel={`${kpis?.outstandingReceivables?.count || 0} awaiting payment`}
          overdue={formatMoney(kpis?.overdueReceivables?.value || 0)}
          overdueLabel={`${kpis?.overdueReceivables?.count || 0} overdue`}
          segments={invoiceSegments}
          primaryAction={{ title: 'Open invoices', onPress: () => navigation.navigate('Invoices') }}
          secondaryAction={{ title: 'View all invoices', onPress: () => navigation.navigate('Invoices') }}
        />
        <MetricCard
          title="Bills to pay"
          total={formatMoney(summary?.enterprise?.upcomingBills?.reduce((sum, item) => sum + Number(item.balanceDue || 0), 0) || 0)}
          totalLabel={`${upcomingBills.length || 0} awaiting payment`}
          overdue={formatMoney(overdueBills?.amount || 0)}
          overdueLabel={`${overdueBills?.count || 0} overdue`}
          segments={billsSegments}
          primaryAction={{ title: 'View bills', onPress: () => navigation.navigate('Reports') }}
          secondaryAction={{ title: 'View all bills', onPress: () => navigation.navigate('Reports') }}
        />
        <Card title="Performance snapshot">
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <SummaryTile label="Revenue accrual" value={formatMoney(kpis?.revenueAccrualMtd?.value || 0)} />
            <SummaryTile label="Invoices issued" value={String(kpis?.invoicesIssuedMtd?.value || 0)} />
          </View>
          <Text style={{ color: colors.muted }}>Keep an eye on overdue receivables and upcoming supplier obligations.</Text>
        </Card>
        <Card title="Recent payments" subtitle="Latest completed collections">
          {!recentInvoicePayments.length ? (
            <Text>No recent payments found.</Text>
          ) : (
            <FlatList
              data={recentInvoicePayments}
              scrollEnabled={false}
              keyExtractor={(item, index) => `${item.invoiceNumber || 'invoice'}-${index}`}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontWeight: '700' }}>{item.invoiceNumber || '-'}</Text>
                  <Text>Customer: {item.contact || 'Client'}</Text>
                  <Text>Date: {formatDate(item.dateReceived)}</Text>
                  <Text>Amount: {formatMoney(item.amount || 0)}</Text>
                </View>
              )}
            />
          )}
        </Card>
        <Card title="Upcoming bills" subtitle="Next supplier obligations due soon">
          {!upcomingBills.length ? (
            <Text>No upcoming bills.</Text>
          ) : (
            <FlatList
              data={upcomingBills}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontWeight: '700' }}>{item.billNumber || item.vendorName || 'Bill'}</Text>
                  <Text>Vendor: {item.vendorName || '—'}</Text>
                  <Text>Due Date: {formatDate(item.dueDate)}</Text>
                  <Text>Balance Due: {formatMoney(item.balanceDue || 0)}</Text>
                </View>
              )}
            />
          )}
        </Card>
      </View>
      <PendingActionsCard actions={actions} />
    </Screen>
  );
}
