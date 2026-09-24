"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  Loader2,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  Building2,
  Calendar,
  Briefcase,
  AlertCircle,
  Globe,
  Tag,
} from "lucide-react";

const STATUS_CONFIG = {
  new: {
    label: "New",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  converted: {
    label: "Converted",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  closed: {
    label: "Closed",
    badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 1. Verify authentication and admin authorization on mount
  useEffect(() => {
    verifyAdminSession().then(async ({ session, user: sessionUser, isAdmin }) => {
      if (!session || !isAdmin) {
        if (session && !isAdmin) {
          await supabase.auth.signOut();
        }
        router.replace("/admin/login");
      } else {
        setUser(sessionUser);
        setCheckingSession(false);
      }
    });
  }, [router]);

  // 2. Fetch statistics and recent leads from Supabase
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoadingData(true);
    setError(null);

    try {
      // Query leads
      const { data: leadsData, error: leadsErr } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsErr) throw leadsErr;

      // Query blog posts
      const { data: postsData, error: postsErr } = await supabase
        .from("blog_posts")
        .select("id, published, created_at");

      if (postsErr) throw postsErr;

      const allLeads = leadsData || [];
      const allPosts = postsData || [];

      setStats({
        totalLeads: allLeads.length,
        newLeads: allLeads.filter(
          (l) => (l.status || "new").toLowerCase() === "new"
        ).length,
        totalPosts: allPosts.length,
        publishedPosts: allPosts.filter((p) => p.published).length,
        draftPosts: allPosts.filter((p) => !p.published).length,
      });

      // 5 newest leads
      setRecentLeads(allLeads.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      setError(
        err.message ||
          "Failed to load dashboard statistics from Supabase. Please verify database permissions."
      );
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingSession && user) {
      fetchDashboardData();
    }
  }, [checkingSession, user, fetchDashboardData]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Full-screen loading while verifying session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E40101] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-[#E40101] selection:text-white">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-60 left-1/4 w-[600px] h-[600px] rounded-full bg-[#E40101]/5 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#E40101]/4 blur-[120px]" />
      </div>

      {/* Top navigation bar */}
      <header className="relative z-20 border-b border-zinc-800/60 bg-zinc-900/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
              <Image
                src="/logo.svg"
                alt="Anti-Agency Logo"
                width={24}
                height={24}
                className="w-6 h-auto"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl tracking-wider text-white font-bold leading-none">
                ANTI<span className="text-[#E40101]">-AGENCY</span>
              </span>
              <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-mono">
                Admin Portal
              </span>
            </div>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden sm:block text-xs text-zinc-500 font-mono">
                {user.email}
              </span>
            )}
            <button
              id="admin-logout-button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 hover:border-zinc-600 px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              {loggingOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Quick Actions Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              System Active • Authorized
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Dashboard <span className="text-[#E40101]">Overview</span>
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loadingData}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#E40101]" : ""}`}
              />
              <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
            </button>

            <Link
              href="/admin/leads"
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md group"
            >
              <Users className="w-4 h-4 text-[#E40101]" />
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/blog"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#E40101] hover:bg-[#ff1a1a] text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-lg shadow-[#E40101]/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Manage Blog</span>
            </Link>

            <Link
              href="/blog"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-xs text-zinc-400 hover:text-white rounded-xl transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#E40101]" />
              <span>View Journal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Unable to Load Statistics
            </h3>
            <p className="text-sm text-red-300 max-w-lg mx-auto mb-4">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetching
            </button>
          </div>
        )}

        {/* Top Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Card 1: Total Leads */}
          <Link
            href="/admin/leads"
            className="p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                Total Leads
              </span>
              <Users className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
              {loadingData ? "—" : stats.totalLeads}
            </div>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1 group-hover:text-zinc-400">
              <span>View leads table</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          {/* Card 2: New Leads */}
          <Link
            href="/admin/leads"
            className="p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-red-500/20 hover:border-red-500/40 transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-red-400 font-semibold">
                New Leads
              </span>
              <Clock className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-red-400 mb-1">
              {loadingData ? "—" : stats.newLeads}
            </div>
            <span className="text-[11px] text-red-500/80">
              Needs response / action
            </span>
          </Link>

          {/* Card 3: Total Articles */}
          <Link
            href="/admin/blog"
            className="p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                Total Articles
              </span>
              <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
              {loadingData ? "—" : stats.totalPosts}
            </div>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1 group-hover:text-zinc-400">
              <span>Manage editorial</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          {/* Card 4: Published Articles */}
          <Link
            href="/admin/blog"
            className="p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Published
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mb-1">
              {loadingData ? "—" : stats.publishedPosts}
            </div>
            <span className="text-[11px] text-emerald-500/80">
              Live on /blog journal
            </span>
          </Link>

          {/* Card 5: Draft Articles */}
          <Link
            href="/admin/blog"
            className="p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-all group block col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Drafts
              </span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mb-1">
              {loadingData ? "—" : stats.draftPosts}
            </div>
            <span className="text-[11px] text-amber-500/80">
              Unpublished drafts
            </span>
          </Link>
        </div>

        {/* Main Section: Recent Leads Table */}
        <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight">
                  Recent Enquiries
                </h2>
                <p className="text-xs text-zinc-500 font-mono">
                  5 newest prospect submissions
                </p>
              </div>
            </div>

            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E40101] hover:text-[#ff3b3b] transition-colors"
            >
              <span>View All ({stats.totalLeads})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Loading state */}
          {loadingData && (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#E40101] animate-spin mb-3" />
              <p className="text-zinc-400 text-xs font-mono uppercase tracking-wider">
                Loading recent leads…
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loadingData && recentLeads.length === 0 && (
            <div className="py-16 text-center px-4">
              <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                No Leads Yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Website form enquiries will appear here automatically when prospective clients submit.
              </p>
            </div>
          )}

          {/* Recent Leads List */}
          {!loadingData && recentLeads.length > 0 && (
            <div className="divide-y divide-zinc-800/60">
              {recentLeads.map((lead) => {
                const currentStatus = (lead.status || "new").toLowerCase();
                const statusInfo =
                  STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;

                return (
                  <div
                    key={lead.id}
                    className="p-4 sm:p-5 hover:bg-zinc-900/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left details: Name & Company */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-white truncate">
                          {lead.name || "Anonymous Prospect"}
                        </span>
                        {lead.company && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 text-[11px] font-mono border border-zinc-700/50">
                            <Building2 className="w-3 h-3 text-zinc-400" />
                            {lead.company}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        {lead.email && <span className="font-mono">{lead.email}</span>}
                        {lead.phone && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{lead.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Middle details: Service & Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      {lead.service && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E40101]/10 text-red-400 text-xs font-medium border border-red-500/20">
                          <Briefcase className="w-3 h-3 text-[#E40101]" />
                          {lead.service}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusInfo.badge}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Right: Date & Link */}
                    <div className="flex items-center justify-between md:justify-end gap-4 text-xs text-zinc-500 font-mono shrink-0">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer View All CTA */}
          <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/60 text-center">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              <span>Manage all client leads in full dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E40101]" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
