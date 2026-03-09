import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export function Screen({ children, scroll = false }) {
  const content = <View style={styles.screen}>{children}</View>;
  if (scroll) return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={styles.screen}>{children}</ScrollView>;
  return content;
}

export function Card({ title, subtitle, right, children }) {
  return (
    <View style={styles.card}>
      {(title || subtitle || right) ? (
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function Stat({ label, value, tone = 'default' }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, tone === 'danger' ? { color: colors.danger } : null]}>{value}</Text>
    </View>
  );
}

export function AppButton({ title, onPress, variant = 'primary', disabled = false, loading = false }) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[styles.button, variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary, (disabled || loading) ? styles.buttonDisabled : null]}>
      {loading ? <ActivityIndicator color={variant === 'secondary' ? colors.text : '#fff'} /> : <Text style={[styles.buttonText, variant === 'secondary' ? { color: colors.text } : null]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />
    </View>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function ErrorState({ message }) {
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: colors.danger }]}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, backgroundColor: colors.bg, padding: 16, gap: 16 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  stat: { gap: 4 },
  statLabel: { fontSize: 13, color: colors.muted },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  button: { minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { backgroundColor: '#ede9fe', borderWidth: 1, borderColor: '#ddd6fe' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  fieldWrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: colors.text },
  empty: { paddingVertical: 32, alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptySubtitle: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});
