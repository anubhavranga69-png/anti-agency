"use client";

import { useAdminLogin } from "../hooks/useAdminLogin";
import AmbientBackground from "./AmbientBackground";
import AdminBrand from "./AdminBrand";
import AdminLoginCard from "./AdminLoginCard";
import LoginLoading from "./LoginLoading";

/**
 * Composes the full admin login page from smaller components.
 * Uses useAdminLogin to source all state and handlers.
 */
export default function AdminLoginScreen() {
  const {
    email,
    password,
    showPassword,
    loading,
    checkingSession,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  } = useAdminLogin();

  // Full-screen loading while checking existing session
  if (checkingSession) {
    return <LoginLoading />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <AmbientBackground />
      <AdminBrand />
      <AdminLoginCard
        email={email}
        password={password}
        showPassword={showPassword}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
        onSubmit={handleLogin}
      />
    </div>
  );
}
