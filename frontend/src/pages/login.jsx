import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { useAuth } from "../features/auth/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
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
            Manage quotes, invoices, payments, and client accounts in one place.
          </p>
          <div className="mt-10 flex gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">Invoicing</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">Payments</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm">Statements</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-violet-700">Bretune Accounting</h1>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 text-center">Sign in</h2>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-violet-600 hover:text-violet-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Need an account?{" "}
            <Link to="/register" className="font-medium text-violet-600 hover:text-violet-700">
              Create admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
