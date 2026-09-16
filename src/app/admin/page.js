"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminAuth";
import { Loader2, AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  // On mount — if already authenticated and an admin, redirect to dashboard
  useEffect(() => {
    verifyAdminSession().then(async ({ session, isAdmin }) => {
      if (session && isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        if (session && !isAdmin) {
          await supabase.auth.signOut();
          setError("Access denied. Your account does not have administrator privileges.");
        }
        setCheckingSession(false);
      }
    });
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : signInError.message
      );
      setLoading(false);
    } else {
      // Check that the authenticated user is authorized as an admin
      const { isAdmin } = await verifyAdminSession();

      if (!isAdmin) {
        await supabase.auth.signOut();
        setError("Access denied. Your account does not have administrator privileges.");
        setLoading(false);
      } else {
        router.replace("/admin/dashboard");
      }
    }
  }

  // Full-screen loading while checking existing session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E40101] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#E40101]/6 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#E40101]/4 blur-[140px]" />
      </div>

      {/* Grid noise texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Brand mark */}
      <a
        href="/"
        className="relative z-10 flex items-center gap-3 mb-10 group"
        aria-label="Back to Anti-Agency homepage"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-[#E40101]/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(228,1,1,0.3)]">
          <Image
            src="/logo.svg"
            alt="Anti-Agency Logo"
            width={28}
            height={28}
            className="w-7 h-auto"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-2xl tracking-wider text-white font-bold">
            ANTI<span className="text-[#E40101]">-AGENCY</span>
          </span>
          <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono -mt-1">
            Admin Portal
          </span>
        </div>
      </a>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl border border-zinc-800/80 p-8 sm:p-10"
          style={{
            background: "rgba(14, 14, 18, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px -16px rgba(0,0,0,0.7), 0 0 60px -20px rgba(228,1,1,0.08)",
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-[#E40101] uppercase tracking-widest mb-4">
              Secure Admin Access
            </div>
            <h1 className="font-heading text-3xl text-white font-bold uppercase tracking-tight leading-tight">
              Admin Login
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              Sign in to access the Anti-Agency admin panel.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 px-4 py-3 mb-6 rounded-xl bg-[#E40101]/10 border border-[#E40101]/30 text-sm text-red-300"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#E40101]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@anti-agency.com"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E40101]/50 focus:border-[#E40101]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E40101]/50 focus:border-[#E40101]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] transition-all shadow-lg shadow-[#E40101]/25 hover:shadow-[#E40101]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E40101] disabled:hover:shadow-[#E40101]/25 disabled:transform-none hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E40101]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Authorised personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
