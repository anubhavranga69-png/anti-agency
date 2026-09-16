"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  Loader2,
  LogOut,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  ChevronDown,
  MessageSquare,
  Eye,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

const STATUS_CONFIG = {
  new: {
    label: "New",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  converted: {
    label: "Converted",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
    dot: "bg-zinc-500",
  },
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Lead Details Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Action states
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // 1. Authentication & Admin Authorization check
  useEffect(() => {
    verifyAdminSession().then(async ({ session, user: sessionUser, isAdmin }) => {
      if (!session || !isAdmin) {
        if (session && !isAdmin) {
          await supabase.auth.signOut();
        }
        router.replace("/admin");
      } else {
        setUser(sessionUser);
        setCheckingSession(false);
      }
    });
  }, [router]);

  // 2. Fetch leads from public.leads
  const fetchLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setLeads(data || []);

      // If a lead is currently open in modal, keep its data fresh
      if (selectedLead) {
        const updated = (data || []).find((l) => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(
        err.message || "Failed to load leads from Supabase. Please verify table permissions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedLead]);

  useEffect(() => {
    if (!checkingSession && user) {
      fetchLeads();
    }
  }, [checkingSession, user, fetchLeads]);

  // 3. Status update handler
  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    setActionNotice(null);

    try {
      const { error: updateError } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (updateError) throw updateError;

      // Update local state
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      // Also update modal view if open
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      }

      showNotice(`Lead status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`, "success");
    } catch (err) {
      console.error("Error updating lead status:", err);
      showNotice(err.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. Delete lead handler
  const handleDeleteLead = async (leadId) => {
    setDeletingId(leadId);
    setActionNotice(null);

    try {
      const { error: deleteError } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (deleteError) throw deleteError;

      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      setDeleteConfirmId(null);

      // Close modal if deleting the currently viewed lead
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }

      showNotice("Lead deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting lead:", err);
      showNotice(err.message || "Failed to delete lead", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // 5. Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  const showNotice = (message, type = "success") => {
    setActionNotice({ message, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const copyToClipboard = (text, fieldName) => {
    if (typeof window !== "undefined" && text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 3000);
    }
  };

  // 6. Metrics & Filtering
  const counts = useMemo(() => {
    return {
      all: leads.length,
      new: leads.filter((l) => (l.status || "new").toLowerCase() === "new").length,
      contacted: leads.filter((l) => (l.status || "").toLowerCase() === "contacted").length,
      converted: leads.filter((l) => (l.status || "").toLowerCase() === "converted").length,
      closed: leads.filter((l) => (l.status || "").toLowerCase() === "closed").length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const currentStatus = (lead.status || "new").toLowerCase();
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (lead.name || "").toLowerCase().includes(query);
        const emailMatch = (lead.email || "").toLowerCase().includes(query);
        const companyMatch = (lead.company || "").toLowerCase().includes(query);
        const serviceMatch = (lead.service || "").toLowerCase().includes(query);
        const messageMatch = (lead.message || "").toLowerCase().includes(query);
        const phoneMatch = (lead.phone || "").toLowerCase().includes(query);
        return (
          nameMatch ||
          emailMatch ||
          companyMatch ||
          serviceMatch ||
          messageMatch ||
          phoneMatch
        );
      }

      return true;
    });
  }, [leads, statusFilter, searchQuery]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
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

  // Auth checking screen
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E40101] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-[#E40101] selection:text-white">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#E40101]/5 blur-[160px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#E40101]/4 blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 border-b border-zinc-800/60 bg-zinc-900/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand + Back link */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-zinc-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                <Image
                  src="/logo.svg"
                  alt="Anti-Agency Logo"
                  width={20}
                  height={20}
                  className="w-5 h-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg tracking-wider text-white font-bold leading-none">
                  ANTI<span className="text-[#E40101]">-AGENCY</span>
                </span>
                <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-mono">
                  Leads Management
                </span>
              </div>
            </div>
          </div>

          {/* User info & Logout */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden md:block text-xs text-zinc-500 font-mono">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notice alert */}
        {actionNotice && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm transition-all ${
              actionNotice.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionNotice.message}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-[#E40101] uppercase tracking-widest mb-2">
              <Users className="w-3 h-3" />
              Enquiries & Prospects
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Client <span className="text-[#E40101]">Leads</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchLeads(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#E40101]" : ""}`}
              />
              <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { id: "all", label: "Total Leads", count: counts.all, icon: Users, color: "text-white" },
            { id: "new", label: "New", count: counts.new, icon: Clock, color: "text-red-400" },
            { id: "contacted", label: "Contacted", count: counts.contacted, icon: MessageSquare, color: "text-amber-400" },
            { id: "converted", label: "Converted", count: counts.converted, icon: CheckCircle2, color: "text-emerald-400" },
            { id: "closed", label: "Closed", count: counts.closed, icon: Briefcase, color: "text-zinc-400" },
          ].map((item) => {
            const Icon = item.icon;
            const active = statusFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? "bg-zinc-900 border-[#E40101]/50 shadow-lg shadow-red-950/20"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                    {item.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className={`text-xl font-bold font-mono ${item.color}`}>
                  {item.count}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search leads by name, email, company, service, or message…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 mr-1" />
              {["all", "new", "contacted", "converted", "closed"].map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setStatusFilter(statusKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === statusKey
                      ? "bg-[#E40101] text-white"
                      : "bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {statusKey === "all" ? "All" : STATUS_CONFIG[statusKey]?.label || statusKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#E40101] animate-spin mb-3" />
            <p className="text-zinc-400 text-sm">Loading enquiries from Supabase…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Leads</h3>
            <p className="text-sm text-red-300/90 max-w-lg mx-auto mb-4">{error}</p>
            <button
              onClick={() => fetchLeads()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetching
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl py-20 px-4 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
              No Leads Found
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-4">
              {searchQuery || statusFilter !== "all"
                ? "No leads match your active search and filter criteria."
                : "No enquiries have been submitted through the website yet."}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-xs text-[#E40101] hover:underline font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Leads Listing */}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const currentStatus = (lead.status || "new").toLowerCase();
              const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
              const isUpdating = updatingId === lead.id;
              const isDeleting = deletingId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-200"
                >
                  {/* Lead Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        {lead.name || "Anonymous Prospect"}
                      </h2>

                      {lead.company && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 text-xs font-medium border border-zinc-700/50">
                          <Building2 className="w-3 h-3 text-zinc-400" />
                          {lead.company}
                        </span>
                      )}

                      {lead.service && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E40101]/10 text-red-400 text-xs font-medium border border-red-500/20">
                          <Briefcase className="w-3 h-3 text-[#E40101]" />
                          {lead.service}
                        </span>
                      )}
                    </div>

                    {/* Status & Action Controls */}
                    <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E40101]" />
                        <span>Details</span>
                      </button>

                      {/* Status Selector */}
                      <div className="relative inline-block">
                        <select
                          disabled={isUpdating}
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`appearance-none text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 pr-8 rounded-full border cursor-pointer transition-all disabled:opacity-50 bg-zinc-950 ${statusInfo.badge}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>

                      {isUpdating && (
                        <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                      )}

                      {/* Delete Button / Trigger */}
                      <button
                        onClick={() => setDeleteConfirmId(lead.id)}
                        disabled={isDeleting}
                        title="Delete Lead"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lead Contact Info & Timestamp */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-white hover:underline truncate font-mono"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-zinc-600">No email provided</span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-white hover:underline truncate font-mono"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-zinc-600">No phone provided</span>
                      )}
                    </div>

                    {/* Submitted date */}
                    <div className="flex items-center gap-2 text-zinc-400 sm:justify-end font-mono">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{formatDate(lead.created_at)}</span>
                    </div>
                  </div>

                  {/* Message / Details Section */}
                  {lead.message ? (
                    <div className="mt-1 pt-3 border-t border-zinc-800/40">
                      <div className="flex items-start gap-2 bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3.5 text-xs text-zinc-300 leading-relaxed">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <div className="flex-1 whitespace-pre-wrap line-clamp-3">
                          {lead.message}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 pt-2 border-t border-zinc-800/30 text-[11px] text-zinc-600 italic">
                      No additional project details provided.
                    </div>
                  )}

                  {/* Inline Delete Confirmation Dialog */}
                  {deleteConfirmId === lead.id && (
                    <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>
                          Are you sure you want to permanently delete lead for{" "}
                          <strong className="text-white">{lead.name || "this prospect"}</strong>? This action cannot be undone.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Confirm Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Complete Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101] font-bold text-base">
                  {selectedLead.name ? selectedLead.name[0].toUpperCase() : "P"}
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-white">
                    {selectedLead.name || "Anonymous Prospect"}
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono">
                    Submitted: {formatDate(selectedLead.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Status Selector Bar inside Modal */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-3">
                  Lead Status Management
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["new", "contacted", "converted", "closed"].map((statusKey) => {
                    const active = (selectedLead.status || "new").toLowerCase() === statusKey;
                    const info = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
                    return (
                      <button
                        key={statusKey}
                        onClick={() => handleStatusChange(selectedLead.id, statusKey)}
                        disabled={updatingId === selectedLead.id}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          active
                            ? `${info.badge} shadow-md`
                            : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#E40101]" />
                      Email Address
                    </span>
                    {selectedLead.email && (
                      <button
                        onClick={() => copyToClipboard(selectedLead.email, "email")}
                        className="text-zinc-500 hover:text-zinc-200 p-1 rounded transition-colors cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedField === "email" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {selectedLead.email ? (
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-sm font-mono text-white hover:text-[#E40101] hover:underline break-all"
                    >
                      {selectedLead.email}
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">Not provided</span>
                  )}
                </div>

                {/* Phone */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#E40101]" />
                      Phone Number
                    </span>
                    {selectedLead.phone && (
                      <button
                        onClick={() => copyToClipboard(selectedLead.phone, "phone")}
                        className="text-zinc-500 hover:text-zinc-200 p-1 rounded transition-colors cursor-pointer"
                        title="Copy Phone"
                      >
                        {copiedField === "phone" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-sm font-mono text-white hover:text-[#E40101] hover:underline"
                    >
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">Not provided</span>
                  )}
                </div>

                {/* Company */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#E40101]" />
                    Company Name
                  </span>
                  <span className="text-sm font-semibold text-white block">
                    {selectedLead.company || "Not provided"}
                  </span>
                </div>

                {/* Service */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#E40101]" />
                    Service Requested
                  </span>
                  <span className="text-sm font-semibold text-white block">
                    {selectedLead.service || "Website Design"}
                  </span>
                </div>
              </div>

              {/* Project Message / Enquiry Details */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5 mb-3">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E40101]" />
                  Full Project Enquiry / Message
                </span>
                {selectedLead.message ? (
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-600 italic">
                    No additional message or notes were included with this enquiry.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40">
              <button
                onClick={() => setDeleteConfirmId(selectedLead.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Lead</span>
              </button>

              <div className="flex items-center gap-3">
                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E40101] hover:bg-[#ff1a1a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply by Email</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-zinc-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
