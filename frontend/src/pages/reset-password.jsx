import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { api } from "../lib/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset link. Please request a new one.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.resetPassword(token, password);
      setSuccess(res?.message || "Password reset successfully. You can now sign in.");
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-full flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.03]" />
          <div className="relative flex flex-col justify-center px-12 xl:px-20">
            <h2 className="text-3xl font-bold text-white tracking-tight">Bretune Accounting</h2>
            <p className="mt-4 text-violet-100 text-lg max-w-sm">
              Use the link from your reset email to set a new password.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="lg:hidden mb-8">
              <h1 className="text-2xl font-bold text-violet-700">Bretune Accounting</h1>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Invalid reset link</h2>
            <p className="mt-4 text-slate-600">
              This link is invalid or has expired. Please request a new password reset.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block font-medium text-violet-600 hover:text-violet-700"
            >
              Request new reset link
            </Link>
            <p className="mt-8 text-sm text-slate-600">
              <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.03]" />
        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          <h2 className="text-3xl font-bold text-white tracking-tight">Bretune Accounting</h2>
          <p className="mt-4 text-violet-100 text-lg max-w-sm">
            Enter your new password below to regain access to your account.
          </p>
          <div className="mt-10 flex gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">8+ characters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-violet-700">Bretune Accounting</h1>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 text-center">Reset password</h2>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
              <p className="text-xs text-slate-500">Use at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
