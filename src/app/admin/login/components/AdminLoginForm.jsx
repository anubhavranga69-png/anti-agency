"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

/**
 * The login form: email input, password input with show/hide toggle, and submit button.
 * Receives all state and handlers from the useAdminLogin hook via AdminLoginCard.
 */
export default function AdminLoginForm({
  email,
  password,
  showPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
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
          onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••••••"
            disabled={loading}
            className="w-full px-4 py-3 pr-11 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E40101]/50 focus:border-[#E40101]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={onTogglePassword}
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
  );
}
