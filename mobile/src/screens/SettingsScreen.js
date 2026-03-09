import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AppButton, Card, ErrorState, Field, Screen } from '../components/ui';
import { colors } from '../theme';
import { formatDate } from '../utils/format';

const ACCOUNT_TYPES = ['Current', 'Savings', 'Cheque', 'Business', 'Transmission', 'Money Market', 'Other'];
const DATE_FORMATS = [
  { label: 'DD/MM/YYYY (day, month, year)', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
];

function Toggle({ value, onChange, label, description }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={{ fontWeight: '600', color: colors.text }}>{label}</Text>
        {description ? <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{description}</Text> : null}
      </View>
      <Pressable
        onPress={() => onChange?.(!value)}
        style={{
          width: 50,
          height: 28,
          borderRadius: 14,
          backgroundColor: value ? colors.primary : '#e5e7eb',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            transform: [{ translateX: value ? 22 : 0 }],
          }}
        />
      </Pressable>
    </View>
  );
}

function TabButton({ active, onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: active ? colors.primary : 'transparent',
      }}
    >
      <Text style={{ textAlign: 'center', fontWeight: '700', color: active ? '#fff' : colors.text, fontSize: 12 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
  });

  // Company settings form
  const [companyForm, setCompanyForm] = useState({
    businessEmail: '',
    businessPhone: '',
    addressLine: '',
    city: '',
    country: '',
    tagline: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchCode: '',
    accountType: '',
  });

  // Accounting defaults
  const [acctForm, setAcctForm] = useState({
    defaultPaymentTermsDays: '30',
    dateFormat: 'DD/MM/YYYY',
    showVat: true,
  });

  // Notifications
  const [notifForm, setNotifForm] = useState({
    emailNotifications: true,
    paymentAlerts: true,
    productUpdates: false,
  });

  // Security
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Subscription/Billing
  const [plans, setPlans] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [upgradingPlanId, setUpgradingPlanId] = useState(null);
  const [accountTypePickerOpen, setAccountTypePickerOpen] = useState(false);
  const [dateFormatPickerOpen, setDateFormatPickerOpen] = useState(false);

  // Initialize forms from user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        companyName: user.companyName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  // Load company settings
  useEffect(() => {
    if (activeTab === 'general') {
      setLoading(true);
      api.getCompanySettings()
        .then((data) => {
          if (data) {
            setCompanyForm({
              businessEmail: data.businessEmail || '',
              businessPhone: data.businessPhone || '',
              addressLine: data.addressLine || '',
              city: data.city || '',
              country: data.country || '',
              tagline: data.tagline || '',
              bankName: data.bankName || '',
              accountName: data.accountName || '',
              accountNumber: data.accountNumber || '',
              branchCode: data.branchCode || '',
              accountType: data.accountType || '',
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // Load subscription data when billing tab active
  useEffect(() => {
    if (activeTab === 'billing') {
      loadSubscriptionData();
    }
  }, [activeTab]);

  async function loadSubscriptionData() {
    setBillingLoading(true);
    setError('');
    try {
      const [plansRes, statusRes] = await Promise.all([
        api.listSubscriptionPlans(),
        api.getSubscriptionStatus(),
      ]);
      setPlans(plansRes?.data || []);
      setSubscriptionStatus(statusRes);
    } catch (err) {
      setError(err?.message || 'Failed to load billing');
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleUpgrade(planId) {
    setUpgradingPlanId(planId);
    setError('');
    setSuccess('');
    try {
      // Create Stripe checkout session
      const { checkoutUrl } = await api.createCheckoutSession(planId);
      if (checkoutUrl) {
        // Open checkout URL in browser
        const canOpen = await Linking.canOpenURL(checkoutUrl);
        if (canOpen) {
          await Linking.openURL(checkoutUrl);
        } else {
          throw new Error('Cannot open payment page');
        }
      }
    } catch (err) {
      setError(err?.message || 'Failed to start payment process');
    } finally {
      setUpgradingPlanId(null);
    }
  }

  async function saveProfile() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        companyName: profileForm.companyName,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      };
      const res = await api.updateProfile(payload);
      const nextUser = res?.user || res;
      updateUser(nextUser);
      setSuccess('Profile saved');
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError(e?.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  async function saveCompanySettings() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.updateCompanySettings(companyForm);
      await queryClient.invalidateQueries({ queryKey: ['companySettings'] });
      setSuccess('Company settings saved');
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError(e?.message || 'Could not save company settings');
    } finally {
      setLoading(false);
    }
  }

  async function savePassword() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!passwordForm.currentPassword) throw new Error('Current password required');
      if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
      }
      if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        throw new Error('Passwords do not match');
      }
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError(e?.message || 'Could not change password');
    } finally {
      setLoading(false);
    }
  }

  function saveNotifications() {
    setSuccess('Notification preferences saved');
    setTimeout(() => setSuccess(''), 2000);
  }

  const profileDirty = useMemo(() => {
    return (
      (profileForm.companyName || '') !== String(user?.companyName || '') ||
      (profileForm.firstName || '') !== String(user?.firstName || '') ||
      (profileForm.lastName || '') !== String(user?.lastName || '')
    );
  }, [profileForm, user]);

  const currentPlanName = (subscriptionStatus?.subscription?.plan?.name || (subscriptionStatus?.status === 'TRIAL' ? 'TRIAL' : 'STARTER')).toUpperCase();

  if (error) {
    return (
      <Screen>
        <ErrorState message={error} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      {/* Tab Navigation */}
      <Card>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TabButton active={activeTab === 'general'} onPress={() => setActiveTab('general')} label="General" />
          <TabButton active={activeTab === 'billing'} onPress={() => setActiveTab('billing')} label="Billing" />
          <TabButton active={activeTab === 'notifications'} onPress={() => setActiveTab('notifications')} label="Alerts" />
          <TabButton active={activeTab === 'security'} onPress={() => setActiveTab('security')} label="Security" />
        </View>
      </Card>

      {success ? (
        <View style={{ backgroundColor: '#dcfce7', padding: 12, borderRadius: 8, marginHorizontal: 16 }}>
          <Text style={{ color: '#166534', fontWeight: '600' }}>{success}</Text>
        </View>
      ) : null}

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <>
          <Card title="Profile" subtitle="Basic information">
            <Field
              label="Company name"
              value={profileForm.companyName}
              onChangeText={(value) => setProfileForm((p) => ({ ...p, companyName: value }))}
            />
            <Field
              label="First name"
              value={profileForm.firstName}
              onChangeText={(value) => setProfileForm((p) => ({ ...p, firstName: value }))}
            />
            <Field
              label="Last name"
              value={profileForm.lastName}
              onChangeText={(value) => setProfileForm((p) => ({ ...p, lastName: value }))}
            />
            <AppButton
              title={loading ? 'Saving…' : 'Save profile'}
              onPress={saveProfile}
              disabled={!profileDirty || loading}
            />
          </Card>

          <Card title="Business details" subtitle="Company information">
            <Field
              label="Business email"
              value={companyForm.businessEmail}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, businessEmail: value }))}
              placeholder="accounts@yourcompany.com"
              keyboardType="email-address"
            />
            <Field
              label="Business phone"
              value={companyForm.businessPhone}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, businessPhone: value }))}
              placeholder="+27 …"
            />
            <Field
              label="Address"
              value={companyForm.addressLine}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, addressLine: value }))}
              placeholder="Street, Building, Suite"
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Field
                  label="City"
                  value={companyForm.city}
                  onChangeText={(value) => setCompanyForm((p) => ({ ...p, city: value }))}
                  placeholder="City"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Country"
                  value={companyForm.country}
                  onChangeText={(value) => setCompanyForm((p) => ({ ...p, country: value }))}
                  placeholder="Country"
                />
              </View>
            </View>
            <Field
              label="Tagline / slogan"
              value={companyForm.tagline}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, tagline: value }))}
              placeholder="e.g. BEST INTERNET. BEST SERVICE."
            />
            <Text style={{ fontSize: 11, color: colors.muted }}>Shown on invoices below company name</Text>
          </Card>

          <Card title="Bank details" subtitle="Payment instructions on invoices">
            <Field
              label="Bank name"
              value={companyForm.bankName}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, bankName: value }))}
              placeholder="e.g. Standard Bank"
            />
            <Field
              label="Account name"
              value={companyForm.accountName}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, accountName: value }))}
              placeholder="Account holder name"
            />
            <Field
              label="Account number"
              value={companyForm.accountNumber}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, accountNumber: value }))}
              placeholder="Account number"
            />
            <Field
              label="Branch code"
              value={companyForm.branchCode}
              onChangeText={(value) => setCompanyForm((p) => ({ ...p, branchCode: value }))}
              placeholder="e.g. 123456"
            />
            <Text style={{ color: colors.muted, marginBottom: 4 }}>Account type</Text>
            <Pressable
              onPress={() => setAccountTypePickerOpen(true)}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff' }}
            >
              <Text style={{ color: companyForm.accountType ? colors.text : colors.muted }}>
                {companyForm.accountType || 'Select account type'}
              </Text>
            </Pressable>
            <AppButton
              title={loading ? 'Saving…' : 'Save company settings'}
              onPress={saveCompanySettings}
              disabled={loading}
            />
          </Card>

          <Card title="Accounting defaults" subtitle="Default settings for documents">
            <Field
              label="Default payment terms (days)"
              keyboardType="number-pad"
              value={acctForm.defaultPaymentTermsDays}
              onChangeText={(value) => setAcctForm((p) => ({ ...p, defaultPaymentTermsDays: value }))}
            />
            <Text style={{ color: colors.muted, marginBottom: 4 }}>Date format</Text>
            <Pressable
              onPress={() => setDateFormatPickerOpen(true)}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#fff', marginBottom: 12 }}
            >
              <Text style={{ color: colors.text }}>
                {DATE_FORMATS.find((d) => d.value === acctForm.dateFormat)?.label || acctForm.dateFormat}
              </Text>
            </Pressable>
            <Toggle
              label="Show VAT fields"
              description="Display VAT fields on invoices and quotes"
              value={acctForm.showVat}
              onChange={(v) => setAcctForm((p) => ({ ...p, showVat: v }))}
            />
          </Card>
        </>
      )}

      {/* BILLING TAB */}
      {activeTab === 'billing' && (
        <Card title="Subscription" subtitle="Current plan and billing">
          {billingLoading ? (
            <Text style={{ color: colors.muted, textAlign: 'center', paddingVertical: 20 }}>Loading plans…</Text>
          ) : (
            <>
              {/* Current Plan Card */}
              <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ fontSize: 12, color: colors.muted, textTransform: 'uppercase', fontWeight: '600' }}>
                      Current plan
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                        {subscriptionStatus?.subscription?.plan?.name?.replace('_', ' ') ||
                          (subscriptionStatus?.status === 'TRIAL' ? 'Trial' : 'Starter')}
                      </Text>
                      {subscriptionStatus?.status === 'TRIAL' && subscriptionStatus?.trialEndsAt && (
                        <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                          <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600' }}>
                            Trial ends {formatDate(subscriptionStatus.trialEndsAt)}
                          </Text>
                        </View>
                      )}
                      {subscriptionStatus?.status === 'ACTIVE' && (
                        <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                          <Text style={{ fontSize: 11, color: '#166534', fontWeight: '600' }}>Active</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Pressable onPress={loadSubscriptionData} style={{ padding: 8 }}>
                    <Text style={{ color: colors.primary, fontSize: 12 }}>Refresh</Text>
                  </Pressable>
                </View>
              </View>

              {/* Plans */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Available plans
              </Text>
              <View style={{ gap: 12 }}>
                {(plans.length
                  ? plans
                  : [
                      { id: 'starter', name: 'STARTER', price: 250, featuresJson: { features: ['1 user', '50 clients', '50 invoices/month'] } },
                      { id: 'growth', name: 'GROWTH', price: 350, featuresJson: { features: ['5 users', '500 clients', '500 invoices/month', 'Inventory'] } },
                      { id: 'professional', name: 'PROFESSIONAL', price: 450, featuresJson: { features: ['Unlimited users', 'Unlimited clients', 'Inventory', 'Advanced reports'] } },
                    ]
                ).map((plan) => {
                  const isPremium = (plan.name || '').toUpperCase() === 'PROFESSIONAL';
                  const isCurrent = (plan.name || '').toUpperCase() === currentPlanName || (currentPlanName === 'TRIAL' && (plan.name || '').toUpperCase() === 'STARTER');
                  const features = plan.featuresJson?.features || [];
                  return (
                    <View
                      key={plan.id}
                      style={{
                        borderWidth: 2,
                        borderColor: isPremium ? colors.primary : colors.border,
                        borderRadius: 12,
                        padding: 16,
                        backgroundColor: isPremium ? '#f5f3ff' : '#fff',
                      }}
                    >
                      {isPremium && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -10,
                            left: 16,
                            backgroundColor: colors.primary,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 12,
                          }}
                        >
                          <Text style={{ fontSize: 10, color: '#fff', fontWeight: '700' }}>Premium</Text>
                        </View>
                      )}
                      <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>
                        {plan.name.replace('_', ' ')}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>R{plan.price || 0}</Text>
                        <Text style={{ fontSize: 12, color: colors.muted, marginLeft: 4 }}>/month</Text>
                      </View>
                      <View style={{ marginTop: 12, gap: 4 }}>
                        {features.map((f, i) => (
                          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#22c55e' }} />
                            <Text style={{ fontSize: 12, color: colors.muted }}>{f}</Text>
                          </View>
                        ))}
                      </View>
                      {isCurrent ? (
                        <View
                          style={{
                            marginTop: 12,
                            paddingVertical: 10,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.border,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: colors.muted, fontWeight: '600' }}>Current plan</Text>
                        </View>
                      ) : (
                        <AppButton
                          title={upgradingPlanId === plan.id ? 'Upgrading…' : isPremium ? 'Subscribe to Premium' : 'Upgrade'}
                          onPress={() => handleUpgrade(plan.id)}
                          loading={upgradingPlanId === plan.id}
                          variant={isPremium ? 'primary' : 'secondary'}
                        />
                      )}
                    </View>
                  );
                })}
              </View>

              <Text style={{ fontSize: 11, color: colors.muted, marginTop: 16, textAlign: 'center' }}>
                Secure payment via Stripe. You'll be redirected to complete payment.
              </Text>
            </>
          )}
        </Card>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <Card title="Notifications" subtitle="Email alerts and preferences">
          <Toggle
            label="Email notifications"
            description="Receive general account notifications by email"
            value={notifForm.emailNotifications}
            onChange={(v) => setNotifForm((p) => ({ ...p, emailNotifications: v }))}
          />
          <Toggle
            label="Payment alerts"
            description="Get alerts when payments are recorded or fail"
            value={notifForm.paymentAlerts}
            onChange={(v) => setNotifForm((p) => ({ ...p, paymentAlerts: v }))}
          />
          <Toggle
            label="Product updates"
            description="Occasional updates about new features"
            value={notifForm.productUpdates}
            onChange={(v) => setNotifForm((p) => ({ ...p, productUpdates: v }))}
          />
          <AppButton title="Save preferences" onPress={saveNotifications} />
        </Card>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <>
          <Card title="Security" subtitle="Password and authentication">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
              <View>
                <Text style={{ fontWeight: '600', color: colors.text }}>Change password</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Update your account password</Text>
              </View>
              <AppButton
                title={showPasswordForm ? 'Cancel' : 'Change'}
                variant="secondary"
                onPress={() => setShowPasswordForm((v) => !v)}
              />
            </View>

            {showPasswordForm && (
              <View style={{ marginTop: 12, gap: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
                <Field
                  label="Current password"
                  secureTextEntry
                  value={passwordForm.currentPassword}
                  onChangeText={(value) => setPasswordForm((p) => ({ ...p, currentPassword: value }))}
                />
                <Field
                  label="New password"
                  secureTextEntry
                  value={passwordForm.newPassword}
                  onChangeText={(value) => setPasswordForm((p) => ({ ...p, newPassword: value }))}
                />
                <Field
                  label="Confirm new password"
                  secureTextEntry
                  value={passwordForm.confirmNewPassword}
                  onChangeText={(value) => setPasswordForm((p) => ({ ...p, confirmNewPassword: value }))}
                />
                <AppButton
                  title={loading ? 'Updating…' : 'Update password'}
                  onPress={savePassword}
                  disabled={loading}
                />
              </View>
            )}
          </Card>

          <Card title="Session" subtitle="Account session">
            <Text style={{ color: colors.muted, marginBottom: 12 }}>
              Logged in as {user?.email || '—'}
            </Text>
            <AppButton title="Logout" onPress={logout} />
          </Card>
        </>
      )}

      {/* Modals */}
      <Modal visible={accountTypePickerOpen} transparent animationType="fade" onRequestClose={() => setAccountTypePickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setAccountTypePickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select account type</Text>
            <ScrollView>
              {ACCOUNT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setCompanyForm((p) => ({ ...p, accountType: type }));
                    setAccountTypePickerOpen(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 8,
                    backgroundColor: companyForm.accountType === type ? '#f5f3ff' : '#fff',
                  }}
                >
                  <Text style={{ fontWeight: companyForm.accountType === type ? '700' : '400', color: colors.text }}>{type}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={dateFormatPickerOpen} transparent animationType="fade" onRequestClose={() => setDateFormatPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.18)', justifyContent: 'flex-end' }} onPress={() => setDateFormatPickerOpen(false)}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, gap: 12, maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>Select date format</Text>
            <ScrollView>
              {DATE_FORMATS.map((fmt) => (
                <Pressable
                  key={fmt.value}
                  onPress={() => {
                    setAcctForm((p) => ({ ...p, dateFormat: fmt.value }));
                    setDateFormatPickerOpen(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 8,
                    backgroundColor: acctForm.dateFormat === fmt.value ? '#f5f3ff' : '#fff',
                  }}
                >
                  <Text style={{ fontWeight: acctForm.dateFormat === fmt.value ? '700' : '400', color: colors.text }}>{fmt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
