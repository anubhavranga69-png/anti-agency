"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminAuth";

export function useAdminLogin() {
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
          setError(
            "Access denied. Your account does not have administrator privileges."
          );
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
        setError(
          "Access denied. Your account does not have administrator privileges."
        );
        setLoading(false);
      } else {
        router.replace("/admin/dashboard");
      }
    }
  }

  return {
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
  };
}
