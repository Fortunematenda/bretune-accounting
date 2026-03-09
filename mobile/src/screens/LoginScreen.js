import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AppButton, Field } from '../components/ui';
import { colors } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit() {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Bretune Accounting</Text>
        <Text style={styles.subtitle}>Manage customers, invoices, loans, statements, and financial reports from mobile.</Text>
      </View>
      <View style={styles.card}>
        <Field label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@company.com" />
        <Field label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="••••••••" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title={loading ? 'Signing in...' : 'Sign in'} onPress={onSubmit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 20, gap: 20 },
  hero: { gap: 10 },
  title: { fontSize: 30, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.border, gap: 14 },
  error: { color: colors.danger, fontSize: 14 },
});
