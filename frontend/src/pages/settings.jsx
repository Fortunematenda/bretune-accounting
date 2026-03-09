import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import SettingsLayout from "../components/layout/SettingsLayout";
import { useAuth } from "../features/auth/auth-context";
import { api } from "../lib/api";
import { Building2, CreditCard, Download, SlidersHorizontal, Upload, UserCircle, X, Plus, Check, Sparkles } from "lucide-react";
import { downloadTextFile, objectsToCsv } from "../lib/csv";

function Toggle({ checked, onCheckedChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={
        "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 " +
        (disabled ? "opacity-60 cursor-not-allowed " : "cursor-pointer ") +
        (checked ? "bg-violet-600 border-violet-600" : "bg-[#e5e7eb] border-[#e5e7eb]")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 " +
          (checked ? "translate-x-5" : "translate-x-0.5")
        }
      />
    </button>
  );
}

const VALID_SECTIONS = ["general", "profile", "account", "billing", "data", "notifications", "security", "appearance"];

const LOCATIONS = [
  "South Africa", "United Kingdom", "United States", "Australia", "New Zealand",
  "Canada", "Ireland", "Singapore", "Hong Kong", "Other",
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section") || "general";
  const active = VALID_SECTIONS.includes(sectionParam) ? sectionParam : "general";

  useEffect(() => {
    if (!searchParams.get("section")) {
      setSearchParams({ section: "general" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  const [profileForm, setProfileForm] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
  });

  const [profileExtended, setProfileExtended] = useState({
    jobTitle: "",
    briefBio: "",
    location: "South Africa",
    phoneCountry: "+27",
    phoneArea: "",
    phoneNumber: "",
    website: "",
  });
  const [contactFields, setContactFields] = useState([]);

  const [acctSuccess, setAcctSuccess] = useState(null);
  const [acctSaving, setAcctSaving] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [acctForm, setAcctForm] = useState({
    currency: "ZAR",
    defaultPaymentTermsDays: "30",
    dateFormat: "DD/MM/YYYY",
    showVat: true,
  });

  const [generalSuccess, setGeneralSuccess] = useState(null);
  const [generalLoading, setGeneralLoading] = useState(true);
  const [savingBankDetails, setSavingBankDetails] = useState(false);
  const [generalForm, setGeneralForm] = useState({
    businessEmail: "",
    businessPhone: "",
    addressLine: "",
    city: "",
    country: "",
    tagline: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchCode: "",
    accountType: "",
  });

  const [notifSuccess, setNotifSuccess] = useState(null);
  const [notifForm, setNotifForm] = useState({
    emailNotifications: true,
    paymentAlerts: true,
    productUpdates: false,
  });

  const [themeSuccess, setThemeSuccess] = useState(null);
  const [theme, setTheme] = useState("light");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loginToPreference, setLoginToPreference] = useState("last");

  const [dataSuccess, setDataSuccess] = useState(null);
  const [dataError, setDataError] = useState(null);

  const [plans, setPlans] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState(null);
  const [billingSuccess, setBillingSuccess] = useState(null);
  const [upgradingPlanId, setUpgradingPlanId] = useState(null);

  function downloadCustomerTemplate() {
    setDataError(null);
    setDataSuccess(null);
    const headers = [
      { key: "type", label: "type" },
      { key: "companyName", label: "companyName" },
      { key: "contactName", label: "contactName" },
      { key: "email", label: "email" },
      { key: "phone", label: "phone" },
      { key: "address", label: "address" },
      { key: "city", label: "city" },
      { key: "state", label: "state" },
      { key: "country", label: "country" },
      { key: "postalCode", label: "postalCode" },
      { key: "taxType", label: "taxType" },
      { key: "taxNumber", label: "taxNumber" },
      { key: "paymentTermsDays", label: "paymentTermsDays" },
      { key: "openingBalance", label: "openingBalance" },
      { key: "creditLimit", label: "creditLimit" },
      { key: "status", label: "status" },
      { key: "notes", label: "notes" },
    ];
    const csv = objectsToCsv({ headers, rows: [] });
    downloadTextFile("customers_template.csv", csv);
    setDataSuccess("Customer template downloaded.");
    setTimeout(() => setDataSuccess(null), 2000);
  }

  function downloadProductTemplate() {
    setDataError(null);
    setDataSuccess(null);
    const headers = [
      { key: "name", label: "name" },
      { key: "description", label: "description" },
      { key: "sku", label: "sku" },
      { key: "price", label: "price" },
      { key: "cost", label: "cost" },
      { key: "taxRate", label: "taxRate" },
      { key: "isRecurring", label: "isRecurring" },
      { key: "recurringFrequency", label: "recurringFrequency" },
      { key: "isActive", label: "isActive" },
    ];
    const csv = objectsToCsv({ headers, rows: [] });
    downloadTextFile("products_template.csv", csv);
    setDataSuccess("Product template downloaded.");
    setTimeout(() => setDataSuccess(null), 2000);
  }

  useEffect(() => {
    setProfileForm({
      companyName: user?.companyName || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ba_profile_extended");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setProfileExtended((p) => ({ ...p, ...parsed }));
        }
      }
      const cf = localStorage.getItem("ba_profile_contacts");
      if (cf) {
        const arr = JSON.parse(cf);
        if (Array.isArray(arr)) setContactFields(arr);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ba_settings_accounting");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      setAcctForm((p) => ({ ...p, ...parsed }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    api
      .listCurrencies()
      .then((list) => setCurrencies(Array.isArray(list) ? list : []))
      .catch(() => setCurrencies([]));
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .getCompanySettings()
      .then((data) => {
        if (mounted && data) {
          setGeneralForm((p) => ({
            ...p,
            businessEmail: data.businessEmail || "",
            businessPhone: data.businessPhone || "",
            addressLine: data.addressLine || "",
            city: data.city || "",
            country: data.country || "",
            tagline: data.tagline || "",
            bankName: data.bankName || "",
            accountName: data.accountName || "",
            accountNumber: data.accountNumber || "",
            branchCode: data.branchCode || "",
            accountType: data.accountType || "",
          }));
          if (data.displayCurrencyCode) {
            setAcctForm((p) => ({ ...p, currency: data.displayCurrencyCode }));
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setGeneralLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ba_settings_notifications");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setNotifForm((p) => ({ ...p, ...parsed }));
      }
    } catch {
      // ignore
    }

    try {
      const storedTheme = localStorage.getItem("ba_theme");
      if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem("ba_security_2fa");
      if (raw === "1") setTwoFactorEnabled(true);
    } catch {
      // ignore
    }

    try {
      const pref = localStorage.getItem("ba_login_to");
      if (pref === "last" || pref === "ask") setLoginToPreference(pref);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("ba_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (active !== "billing") return;
    setBillingLoading(true);
    setBillingError(null);
    Promise.all([api.listSubscriptionPlans(), api.getSubscriptionStatus()])
      .then(([plansRes, statusRes]) => {
        setPlans(plansRes?.data || []);
        setSubscriptionStatus(statusRes);
      })
      .catch((err) => {
        setBillingError(err?.message || "Failed to load billing");
      })
      .finally(() => setBillingLoading(false));
  }, [active]);

  async function handleUpgrade(planId) {
    setUpgradingPlanId(planId);
    setBillingError(null);
    setBillingSuccess(null);
    try {
      await api.upgradeSubscription(planId);
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
      setBillingSuccess("Subscription updated successfully.");
      setTimeout(() => setBillingSuccess(null), 4000);
      updateUser?.();
    } catch (err) {
      setBillingError(err?.message || "Upgrade failed. Please try again.");
    } finally {
      setUpgradingPlanId(null);
    }
  }

  const profileDirty = useMemo(() => {
    const next = {
      companyName: profileForm.companyName || "",
      firstName: profileForm.firstName || "",
      lastName: profileForm.lastName || "",
    };
    return (
      (next.companyName || "") !== String(user?.companyName || "") ||
      (next.firstName || "") !== String(user?.firstName || "") ||
      (next.lastName || "") !== String(user?.lastName || "")
    );
  }, [profileForm, user]);

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const payload = {
        companyName: profileForm.companyName,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      };
      const res = await api.updateProfile(payload);
      const nextUser = res?.user && typeof res.user === "object" ? res.user : res;
      updateUser(nextUser);
      try {
        localStorage.setItem("ba_profile_extended", JSON.stringify(profileExtended));
        localStorage.setItem("ba_profile_contacts", JSON.stringify(contactFields));
      } catch {
        // ignore
      }
      setProfileSuccess("Profile saved.");
    } catch (e) {
      setProfileError(e?.message ? String(e.message) : "Could not save settings");
    } finally {
      setSavingProfile(false);
    }
  }

  function addContactField() {
    setContactFields((prev) => [...prev, { id: crypto.randomUUID(), label: "", value: "" }]);
  }

  function removeContactField(id) {
    setContactFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateContactField(id, key, value) {
    setContactFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  }

  async function saveAccounting() {
    setAcctSaving(true);
    setAcctSuccess(null);
    try {
      localStorage.setItem("ba_settings_accounting", JSON.stringify(acctForm));
      await api.updateCompanySettings({ displayCurrencyCode: acctForm.currency || "ZAR" });
      setAcctSuccess("Saved.");
      setTimeout(() => setAcctSuccess(null), 1500);
    } catch (e) {
      setAcctSuccess(null);
      setProfileError(e?.message || "Could not save");
      setTimeout(() => setProfileError(null), 3000);
    } finally {
      setAcctSaving(false);
    }
  }

  async function saveBankDetails() {
    setSavingBankDetails(true);
    setGeneralSuccess(null);
    setProfileSuccess(null);
    setProfileError(null);
    try {
      await api.updateCompanySettings({
        businessEmail: generalForm.businessEmail,
        businessPhone: generalForm.businessPhone,
        addressLine: generalForm.addressLine,
        city: generalForm.city,
        country: generalForm.country,
        tagline: generalForm.tagline,
        bankName: generalForm.bankName,
        accountName: generalForm.accountName,
        accountNumber: generalForm.accountNumber,
        branchCode: generalForm.branchCode,
        accountType: generalForm.accountType,
      });
      if (profileDirty) {
        const payload = {
          companyName: profileForm.companyName,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
        };
        const res = await api.updateProfile(payload);
        const nextUser = res?.user && typeof res.user === "object" ? res.user : res;
        updateUser(nextUser);
      }
      setGeneralSuccess("Bank details saved successfully.");
      setTimeout(() => setGeneralSuccess(null), 3000);
    } catch (e) {
      setProfileError(e?.message ? String(e.message) : "Could not save");
      setGeneralSuccess(null);
    } finally {
      setSavingBankDetails(false);
    }
  }

  function saveNotifications() {
    try {
      localStorage.setItem("ba_settings_notifications", JSON.stringify(notifForm));
      setNotifSuccess("Saved.");
      setTimeout(() => setNotifSuccess(null), 1500);
    } catch {
      setNotifSuccess(null);
    }
  }

  function saveTwoFactor(next) {
    setTwoFactorEnabled(next);
    try {
      localStorage.setItem("ba_security_2fa", next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  function savePreferences() {
    try {
      localStorage.setItem("ba_login_to", loginToPreference);
      setProfileSuccess("Preferences updated.");
      setTimeout(() => setProfileSuccess(null), 2000);
    } catch {
      setProfileError("Could not save preferences.");
    }
  }

  async function changePassword() {
    setPwSaving(true);
    setPwError(null);
    setPwSuccess(null);

    try {
      if (!pwForm.currentPassword) throw new Error("Current password is required");
      if (!pwForm.newPassword || pwForm.newPassword.length < 8) throw new Error("New password must be at least 8 characters");
      if (pwForm.newPassword !== pwForm.confirmNewPassword) throw new Error("Passwords do not match");

      await api.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess("Password updated.");
      setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (e) {
      setPwError(e?.message ? String(e.message) : "Could not change password");
    } finally {
      setPwSaving(false);
    }
  }

  const sectionLabels = {
    general: "General",
    profile: "Profile",
    account: "Account",
    billing: "Billing",
    data: "Data",
    notifications: "Notifications",
    security: "Security",
    appearance: "Appearance",
  };
  const sectionDescriptions = {
    general: "Business details, bank info and accounting defaults",
    profile: "Basic information and contact details",
    account: "Login and workspace access",
    billing: "Plan and payment method",
    data: "Import and export data",
    notifications: "Email alerts and preferences",
    security: "Password and two-factor authentication",
    appearance: "Theme and display options",
  };

  const showSectionHeader = active !== "account" && active !== "profile";

  return (
    <SettingsLayout active={active}>
      <div className="space-y-6">
        {showSectionHeader ? (
          <div>
            <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">
              {sectionLabels[active] || "Settings"}
            </h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              {sectionDescriptions[active] || "Workspace configuration"}
            </p>
          </div>
        ) : null}

        <div className="space-y-6">
            {active === "general" ? (
              <>
                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader className="border-b border-[#f3f4f6] py-5">
                    <CardTitle className="text-base font-semibold text-[#111827]">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        General settings
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generalSuccess ? (
                      <div className="mb-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        {generalSuccess}
                      </div>
                    ) : null}
                    {profileError ? (
                      <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400">
                        {profileError}
                      </div>
                    ) : null}
                    {generalLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Business name</label>
                        <Input
                          value={profileForm.companyName}
                          onChange={(e) => setProfileForm((p) => ({ ...p, companyName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Business email</label>
                        <Input
                          value={generalForm.businessEmail}
                          onChange={(e) => setGeneralForm((p) => ({ ...p, businessEmail: e.target.value }))}
                          placeholder="accounts@yourcompany.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Business phone</label>
                        <Input
                          value={generalForm.businessPhone}
                          onChange={(e) => setGeneralForm((p) => ({ ...p, businessPhone: e.target.value }))}
                          placeholder="+27 …"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Address</label>
                        <Input
                          value={generalForm.addressLine}
                          onChange={(e) => setGeneralForm((p) => ({ ...p, addressLine: e.target.value }))}
                          placeholder="Street, Building, Suite"
                        />
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            value={generalForm.city}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, city: e.target.value }))}
                            placeholder="City"
                          />
                          <Input
                            value={generalForm.country}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, country: e.target.value }))}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 mt-3">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Tagline / slogan</label>
                        <Input
                          value={generalForm.tagline}
                          onChange={(e) => setGeneralForm((p) => ({ ...p, tagline: e.target.value }))}
                          placeholder="e.g. BEST INTERNET. BEST SERVICE."
                        />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Shown on invoices below company name</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank details</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        These appear on invoices and quotes for payment instructions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Bank name</label>
                          <Input
                            value={generalForm.bankName}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, bankName: e.target.value }))}
                            placeholder="e.g. Standard Bank"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Account name</label>
                          <Input
                            value={generalForm.accountName}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, accountName: e.target.value }))}
                            placeholder="Account holder name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Account number</label>
                          <Input
                            value={generalForm.accountNumber}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, accountNumber: e.target.value }))}
                            placeholder="Account number"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Branch code</label>
                          <Input
                            value={generalForm.branchCode}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, branchCode: e.target.value }))}
                            placeholder="e.g. 123456"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Account type</label>
                          <select
                            value={generalForm.accountType}
                            onChange={(e) => setGeneralForm((p) => ({ ...p, accountType: e.target.value }))}
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                          >
                            <option value="">Select account type</option>
                            <option value="Current">Current</option>
                            <option value="Savings">Savings</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Business">Business</option>
                            <option value="Transmission">Transmission</option>
                            <option value="Money Market">Money Market</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <Button
                        onClick={saveBankDetails}
                        disabled={savingBankDetails}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        {savingBankDetails ? "Saving…" : "Save bank details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>
                      <span className="inline-flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                        Accounting defaults
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {acctSuccess ? <div className="text-sm text-emerald-700">{acctSuccess}</div> : null}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Display currency (for dashboard rates)
                        </label>
                        <select
                          value={acctForm.currency}
                          onChange={(e) => setAcctForm((p) => ({ ...p, currency: e.target.value }))}
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        >
                          {currencies.length > 0 ? (
                            currencies.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code} – {c.name}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="ZAR">ZAR – South African Rand</option>
                              <option value="USD">USD – US Dollar</option>
                              <option value="EUR">EUR – Euro</option>
                              <option value="GBP">GBP – British Pound</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Default payment terms (days)</label>
                        <Input
                          type="number"
                          min="0"
                          value={acctForm.defaultPaymentTermsDays}
                          onChange={(e) => setAcctForm((p) => ({ ...p, defaultPaymentTermsDays: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Date format</label>
                        <select
                          value={acctForm.dateFormat}
                          onChange={(e) => setAcctForm((p) => ({ ...p, dateFormat: e.target.value }))}
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY (day, month, year)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">VAT</label>
                        <select
                          value={acctForm.showVat ? "SHOW" : "HIDE"}
                          onChange={(e) => setAcctForm((p) => ({ ...p, showVat: e.target.value === "SHOW" }))}
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="SHOW">Show VAT fields</option>
                          <option value="HIDE">Hide VAT fields</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={saveAccounting} disabled={acctSaving}>
                        {acctSaving ? "Saving…" : "Save defaults"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}

            {active === "profile" ? (
              <Card className="border-[#e5e7eb] bg-white shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-6">
                  {profileSuccess ? (
                    <div className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{profileSuccess}</div>
                  ) : null}
                  {profileError ? (
                    <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{profileError}</div>
                  ) : null}

                  {/* Basic Information */}
                  <h3 className="text-base font-semibold text-[#111827] mb-4">Basic Information</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Profile image</label>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
                          <UserCircle className="h-10 w-10 text-[#9ca3af]" />
                        </div>
                        <button
                          type="button"
                          className="text-sm font-medium text-violet-600 hover:text-violet-700"
                        >
                          Upload Image
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Name <span className="text-red-500">*</span></label>
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                          placeholder="First name"
                          className="border-[#e5e7eb] flex-1"
                        />
                        <Input
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                          placeholder="Last name"
                          className="border-[#e5e7eb] flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Job Title</label>
                      <div className="flex-1 max-w-md">
                        <Input
                          value={profileExtended.jobTitle}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, jobTitle: e.target.value }))}
                          placeholder="e.g. Accountant"
                          className="border-[#e5e7eb]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0 pt-2">Brief bio</label>
                      <div className="flex-1 max-w-md relative">
                        <textarea
                          value={profileExtended.briefBio}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, briefBio: e.target.value.slice(0, 200) }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="w-full rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-[#9ca3af]">{200 - profileExtended.briefBio.length}</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Location <span className="text-red-500">*</span></label>
                      <div className="flex-1 max-w-md">
                        <select
                          value={profileExtended.location}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, location: e.target.value }))}
                          className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                          {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <h3 className="text-base font-semibold text-[#111827] mb-4">Contact Details</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Phone</label>
                      <div className="flex-1 flex gap-2 items-center max-w-md">
                        <Input
                          value={profileExtended.phoneCountry}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, phoneCountry: e.target.value }))}
                          placeholder="+27"
                          className="border-[#e5e7eb] w-20"
                        />
                        <Input
                          value={profileExtended.phoneArea}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, phoneArea: e.target.value }))}
                          placeholder="Area"
                          className="border-[#e5e7eb] w-20"
                        />
                        <Input
                          value={profileExtended.phoneNumber}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, phoneNumber: e.target.value }))}
                          placeholder="612685933"
                          className="border-[#e5e7eb] flex-1"
                        />
                        {profileExtended.phoneNumber ? (
                          <button
                            type="button"
                            onClick={() => setProfileExtended((p) => ({ ...p, phoneNumber: "" }))}
                            className="p-1.5 rounded hover:bg-[#f3f4f6] text-[#6b7280]"
                            aria-label="Clear"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="text-sm text-[#374151] sm:w-36 shrink-0">Website</label>
                      <div className="flex-1 flex items-center gap-2 max-w-md">
                        <Input
                          value={profileExtended.website}
                          onChange={(e) => setProfileExtended((p) => ({ ...p, website: e.target.value }))}
                          placeholder="https://"
                          className="border-[#e5e7eb] flex-1"
                        />
                        {profileExtended.website ? (
                          <button
                            type="button"
                            onClick={() => setProfileExtended((p) => ({ ...p, website: "" }))}
                            className="p-1.5 rounded hover:bg-[#f3f4f6] text-[#6b7280]"
                            aria-label="Clear"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {contactFields.map((f) => (
                      <div key={f.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <label className="text-sm text-[#374151] sm:w-36 shrink-0 invisible">Extra</label>
                        <div className="flex-1 flex gap-2 items-center max-w-md">
                          <Input
                            value={f.label}
                            onChange={(e) => updateContactField(f.id, "label", e.target.value)}
                            placeholder="Label (e.g. LinkedIn)"
                            className="border-[#e5e7eb] w-32"
                          />
                          <Input
                            value={f.value}
                            onChange={(e) => updateContactField(f.id, "value", e.target.value)}
                            placeholder="Value"
                            className="border-[#e5e7eb] flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeContactField(f.id)}
                            className="p-1.5 rounded hover:bg-[#f3f4f6] text-[#6b7280]"
                            aria-label="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addContactField}
                      className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add contact field <span className="text-violet-600">▾</span>
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-[#e5e7eb]">
                    <Button
                      variant="outline"
                      onClick={() => {}}
                      className="border-violet-600 text-violet-600 bg-transparent hover:bg-violet-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveProfile}
                      disabled={savingProfile}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      {savingProfile ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {active === "account" ? (
              <>
                {/* Xero-style single Settings card */}
                <Card className="border-[#e5e7eb] bg-white shadow-sm rounded-lg overflow-hidden">
                  <CardHeader className="border-b border-[#e5e7eb] py-6">
                    <CardTitle className="text-xl font-bold text-[#111827]">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {profileSuccess ? (
                      <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{profileSuccess}</div>
                    ) : null}
                    {profileError ? (
                      <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{profileError}</div>
                    ) : null}
                    {pwSuccess ? (
                      <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{pwSuccess}</div>
                    ) : null}
                    {pwError ? (
                      <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{pwError}</div>
                    ) : null}

                    {/* Login details */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827] mb-4">Login details</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm text-[#374151] sm:w-32 shrink-0">Email address</label>
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              value={user?.email || ""}
                              readOnly
                              className="flex-1 max-w-md border-[#e5e7eb] bg-[#f9fafb] text-[#374151] cursor-default"
                            />
                            <button
                              type="button"
                              onClick={() => {}}
                              className="text-sm font-medium text-violet-600 hover:text-violet-700 shrink-0"
                              title="Contact support to change your login email"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <label className="text-sm text-[#374151] sm:w-32 shrink-0">Password</label>
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type="password"
                              value=".............."
                              readOnly
                              className="flex-1 max-w-md border-[#e5e7eb] bg-[#f9fafb] text-[#374151] cursor-default"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswordForm((v) => !v)}
                              className="text-sm font-medium text-violet-600 hover:text-violet-700 shrink-0"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                        {showPasswordForm ? (
                          <div className="mt-4 pt-4 border-t border-[#e5e7eb] space-y-3 max-w-md">
                            <Input
                              type="password"
                              placeholder="Current password"
                              value={pwForm.currentPassword}
                              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                              className="border-[#e5e7eb]"
                            />
                            <Input
                              type="password"
                              placeholder="New password"
                              value={pwForm.newPassword}
                              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                              className="border-[#e5e7eb]"
                            />
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              value={pwForm.confirmNewPassword}
                              onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                              className="border-[#e5e7eb]"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={changePassword}
                                disabled={pwSaving}
                                className="bg-violet-600 hover:bg-violet-700 text-white"
                              >
                                {pwSaving ? "Updating…" : "Update password"}
                              </Button>
                              <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Additional security */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827] mb-4">Additional security</h3>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-3">
                        <label className="text-sm text-[#374151] sm:w-44 shrink-0 pt-1">Multi-factor authentication</label>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => saveTwoFactor(!twoFactorEnabled)}
                            className="text-sm font-medium text-violet-600 hover:text-violet-700"
                          >
                            {twoFactorEnabled ? "Manage" : "Set up"}
                          </button>
                          <p className="mt-2 text-sm text-[#6b7280] leading-relaxed">
                            Multi-factor authentication adds a second layer of security to your account to help prevent unauthorised access.{" "}
                            <a href="#" className="text-violet-600 hover:text-violet-700 hover:underline" onClick={(e) => e.preventDefault()}>
                              Learn more
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827] mb-4">Preferences</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <label className="text-sm text-[#374151] sm:w-32 shrink-0">Log in to</label>
                        <select
                          value={loginToPreference}
                          onChange={(e) => setLoginToPreference(e.target.value)}
                          className="h-10 max-w-xs w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                          <option value="last">The organisation I was last in</option>
                          <option value="ask">Always ask me</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={savePreferences}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6"
                      >
                        Update preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {user?.role === "ADMIN" || user?.permissions?.includes?.("roles.manage") || user?.permissions?.includes?.("*") ? (
                  <>
                    <Card className="border-[#e5e7eb] bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Users & roles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Workspace users</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Manage user access and roles.</div>
                          </div>
                          <Link className="text-sm font-medium text-violet-600 hover:text-violet-700" to="/settings/users">
                            Manage
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-[#e5e7eb] bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Roles & permissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Access control</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Define roles and permission matrix.</div>
                          </div>
                          <Link className="text-sm font-medium text-violet-600 hover:text-violet-700" to="/settings/roles">
                            Manage
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </>
            ) : null}

            {active === "billing" ? (
              <>
                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Billing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {billingError ? (
                      <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                        {billingError}
                      </div>
                    ) : null}
                    {billingSuccess ? (
                      <div className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        {billingSuccess}
                      </div>
                    ) : null}
                    {billingLoading ? (
                      <div className="py-8 text-center text-sm text-slate-500">Loading plans…</div>
                    ) : (
                      <>
                        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Current plan</div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {subscriptionStatus?.subscription?.plan
                                ? subscriptionStatus.subscription.plan.name.replace("_", " ")
                                : subscriptionStatus?.status === "TRIAL"
                                  ? "Trial"
                                  : "Starter"}
                            </span>
                            {subscriptionStatus?.status === "TRIAL" && subscriptionStatus?.trialEndsAt && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                Trial ends {new Date(subscriptionStatus.trialEndsAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Available plans</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(plans.length ? plans : [
                            { id: "starter", name: "STARTER", price: 250, featuresJson: { features: ["1 user", "50 clients", "50 invoices/month"] } },
                            { id: "growth", name: "GROWTH", price: 350, featuresJson: { features: ["5 users", "500 clients", "500 invoices/month", "Inventory"] } },
                            { id: "professional", name: "PROFESSIONAL", price: 450, featuresJson: { features: ["Unlimited users", "Unlimited clients", "Inventory", "Advanced reports"] } },
                          ]).map((plan) => {
                            const isPremium = (plan.name || "").toUpperCase() === "PROFESSIONAL";
                            const currentPlanName = (subscriptionStatus?.subscription?.plan?.name || (subscriptionStatus?.status === "TRIAL" ? "TRIAL" : "STARTER")).toUpperCase();
                            const isCurrent = (plan.name || "").toUpperCase() === currentPlanName || (currentPlanName === "TRIAL" && (plan.name || "").toUpperCase() === "STARTER");
                            const features = plan.featuresJson?.features || [];
                            return (
                              <div key={plan.id} className={`relative rounded-xl border-2 p-4 ${isPremium ? "border-violet-500 bg-violet-50/50 dark:bg-violet-900/10" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
                                {isPremium && (
                                  <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-xs font-medium text-white">
                                    <Sparkles className="h-3 w-3" /> Premium
                                  </div>
                                )}
                                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{(plan.name || "").replace("_", " ")}</div>
                                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">R{plan.price || 0}<span className="text-sm font-normal text-slate-500">/month</span></div>
                                <ul className="mt-3 space-y-1.5">
                                  {features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />{f}</li>
                                  ))}
                                </ul>
                                <div className="mt-4">
                                  {isCurrent ? <Button variant="outline" disabled className="w-full">Current plan</Button> : (
                                    <Button onClick={() => handleUpgrade(plan.id)} disabled={!!upgradingPlanId} className={`w-full ${isPremium ? "bg-violet-600 hover:bg-violet-700" : ""}`}>
                                      {upgradingPlanId === plan.id ? "Upgrading…" : isPremium ? "Subscribe to Premium" : "Upgrade"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                    </div>

                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                      Payment processing coming soon. Upgrading activates your plan immediately.
                    </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : null}

            {active === "notifications" ? (
              <>
                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notifSuccess ? <div className="text-sm text-emerald-700">{notifSuccess}</div> : null}
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Email notifications</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Receive general account notifications by email.</div>
                        </div>
                        <Toggle checked={notifForm.emailNotifications} onCheckedChange={(v) => setNotifForm((p) => ({ ...p, emailNotifications: v }))} />
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Payment alerts</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Get alerts when payments are recorded or fail.</div>
                        </div>
                        <Toggle checked={notifForm.paymentAlerts} onCheckedChange={(v) => setNotifForm((p) => ({ ...p, paymentAlerts: v }))} />
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Product updates</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Occasional updates about new features.</div>
                        </div>
                        <Toggle checked={notifForm.productUpdates} onCheckedChange={(v) => setNotifForm((p) => ({ ...p, productUpdates: v }))} />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={saveNotifications}>
                        Save notifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}

            {active === "security" ? (
              <Card className="border-[#e5e7eb] bg-white shadow-sm rounded-lg overflow-hidden">
                <CardHeader className="border-b border-[#e5e7eb] py-6">
                  <CardTitle className="text-xl font-bold text-[#111827]">Security</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {pwError ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{pwError}</div> : null}
                  {pwSuccess ? <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{pwSuccess}</div> : null}

                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm text-[#374151]">Current password</label>
                        <Input
                          type="password"
                          value={pwForm.currentPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                          className="border-[#e5e7eb] mt-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-[#374151]">New password</label>
                        <Input
                          type="password"
                          value={pwForm.newPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                          className="border-[#e5e7eb] mt-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-[#374151]">Confirm new password</label>
                        <Input
                          type="password"
                          value={pwForm.confirmNewPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                          className="border-[#e5e7eb] mt-1"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={changePassword}
                        disabled={pwSaving}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        {pwSaving ? "Updating…" : "Update password"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Two-factor authentication</h3>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#6b7280] leading-relaxed">
                          Multi-factor authentication adds a second layer of security to your account.
                        </p>
                        <p className="mt-1 text-xs text-[#6b7280]">This toggle is UI-only until backend enforcement is added.</p>
                      </div>
                      <Toggle checked={twoFactorEnabled} onCheckedChange={saveTwoFactor} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Sessions</h3>
                    <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#374151]">
                      Active session: {user?.email || "—"}
                      <div className="mt-1 text-xs text-[#6b7280]">Session management will appear here.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {active === "appearance" ? (
              <>
                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {themeSuccess ? <div className="text-sm text-emerald-700">{themeSuccess}</div> : null}
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Theme</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Switch between Light and Dark mode.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={theme === "light" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => {
                            setTheme("light");
                            setThemeSuccess("Saved.");
                            setTimeout(() => setThemeSuccess(null), 1200);
                          }}
                        >
                          Light
                        </Button>
                        <Button
                          variant={theme === "dark" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => {
                            setTheme("dark");
                            setThemeSuccess("Saved.");
                            setTimeout(() => setThemeSuccess(null), 1200);
                          }}
                        >
                          Dark
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}

            {active === "data" ? (
              <>
                <Card className="border-[#e5e7eb] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Data import & export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dataSuccess ? <div className="mb-3 text-sm text-emerald-700">{dataSuccess}</div> : null}
                    {dataError ? <div className="mb-3 text-sm text-red-600">{dataError}</div> : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Customers</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Download a template, or use the Customers page to import/export.
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={downloadCustomerTemplate}>
                            <Download className="h-4 w-4 mr-2" />
                            Template CSV
                          </Button>
                          <Link className="text-sm underline text-violet-600 hover:text-violet-700" to="/customers">
                            Open Customers
                          </Link>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Products</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Download a template, or use the Products page to import/export.
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={downloadProductTemplate}>
                            <Download className="h-4 w-4 mr-2" />
                            Template CSV
                          </Button>
                          <Link className="text-sm underline text-violet-600 hover:text-violet-700" to="/items">
                            Open Items
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <div className="flex items-start gap-2">
                        <Upload className="h-4 w-4 mt-0.5 text-slate-500" />
                        <div>
                          <div className="font-medium">Import notes</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Required fields: Customers need contactName, Products need name. Duplicate rows may be skipped.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
        </div>
      </div>
    </SettingsLayout>
  );
}
