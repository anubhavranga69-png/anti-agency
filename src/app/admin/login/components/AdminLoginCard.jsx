import LoginError from "./LoginError";
import AdminLoginForm from "./AdminLoginForm";

/**
 * The glassmorphic login card containing the header, error banner, and login form.
 * Accepts all login state / handlers as props (sourced from useAdminLogin).
 */
export default function AdminLoginCard({
  email,
  password,
  showPassword,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
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
        <LoginError message={error} />

        {/* Form */}
        <AdminLoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          loading={loading}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onTogglePassword={onTogglePassword}
          onSubmit={onSubmit}
        />
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-zinc-600 mt-6">
        Authorised personnel only. All access is logged.
      </p>
    </div>
  );
}
