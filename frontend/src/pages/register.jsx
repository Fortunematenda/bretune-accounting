import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.createAdmin({ companyName, firstName, lastName, email, password });
      setSuccess("Admin account created. Signing you in...");
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.03]" />
        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          <h2 className="text-3xl font-bold text-white tracking-tight">Bretune Accounting</h2>
          <p className="mt-4 text-violet-100 text-lg max-w-sm">
            Set up your admin account to start managing invoices, quotes, and clients.
          </p>
          <div className="mt-10 flex gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">First-time setup</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">Admin access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-violet-700">Bretune Accounting</h1>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 text-center">Create admin</h2>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Company name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
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
              {loading ? "Creating..." : "Create admin"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
