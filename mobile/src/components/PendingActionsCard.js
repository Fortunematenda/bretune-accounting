import React from 'react';
import { Text, View } from 'react-native';
import { Card } from './ui';
import { colors } from '../theme';

export default function PendingActionsCard({ actions = [] }) {
  if (!actions.length) return null;

  return (
    <Card title="Pending mobile actions" subtitle="Saved locally for retry or follow-up when connectivity is limited.">
      <View style={{ gap: 8 }}>
        {actions.slice(0, 5).map((action) => (
          <View key={action.id} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, backgroundColor: '#fff7ed' }}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{action.type}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{action.summary || 'Pending action saved on this device.'}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
