"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminAuth";
import {
  Loader2,
  LogOut,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Globe,
  Eye,
  EyeOff,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  FileText,
  Tag,
  Save,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const INITIAL_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author: "Anti-Agency Editorial",
  category: "Insights",
  published: false,
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor Modal / View State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Actions
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [notice, setNotice] = useState(null);

  // 1. Auth & Admin Authorization Verification
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

  // 2. Fetch All Posts (Drafts & Published)
  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(
        err.message || "Failed to load blog posts. Please verify database table and policies."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingSession && user) {
      fetchPosts();
    }
  }, [checkingSession, user, fetchPosts]);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // 3. Slug Helper
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val) => {
    setFormData((prev) => {
      const autoSlug = !editingPost || prev.slug === generateSlug(prev.title);
      return {
        ...prev,
        title: val,
        slug: autoSlug ? generateSlug(val) : prev.slug,
      };
    });
  };

  // 4. Open Editor
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(INITIAL_FORM);
    setFormError("");
    setUploadError("");
    setUploadSuccess("");
    setEditorOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      author: post.author || "Anti-Agency Editorial",
      category: post.category || "Insights",
      published: !!post.published,
    });
    setFormError("");
    setUploadError("");
    setUploadSuccess("");
    setEditorOpen(true);
  };

  // 4b. Image Upload to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB.");
      return;
    }

    setUploadingImage(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const filePath = `${timestamp}-${randomStr}-${cleanName}`;

      const { data, error: uploadErr } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) throw uploadErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        featured_image: publicUrl,
      }));

      setUploadSuccess("Image uploaded successfully!");
      setTimeout(() => setUploadSuccess(""), 4000);
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadError(
        err.message || "Failed to upload image. Please verify the 'blog-images' bucket exists and allows uploads."
      );
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 5. Save (Create or Update)
  const handleSavePost = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.slug.trim()) {
      setFormError("Slug is required.");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Article content is required.");
      return;
    }

    setSaving(true);

    try {
      // 1. Verify active authenticated session exists before attempting DB operation
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        const authMsg = "Authentication required: No active admin session found. Please log in again.";
        console.error("Save aborted:", authMsg, sessionError);
        setFormError(authMsg);
        setSaving(false);
        return;
      }

      // 2. Prepare payload matching public.blog_posts schema exactly
      const payload = {
        title: formData.title.trim(),
        slug: generateSlug(formData.slug),
        excerpt: formData.excerpt?.trim() || null,
        content: formData.content.trim(),
        featured_image: formData.featured_image?.trim() || null,
        author: formData.author?.trim() || "Anti-Agency Editorial",
        category: formData.category?.trim() || "Insights",
        published: Boolean(formData.published),
        published_at: formData.published
          ? editingPost?.published_at || new Date().toISOString()
          : null,
      };

      if (editingPost) {
        // Update existing post
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPost.id);

        if (updateError) {
          const errDetails = {
            message: updateError.message || "Unknown error occurred",
            code: updateError.code || "UNKNOWN",
            details: updateError.details || null,
            hint: updateError.hint || null,
          };
          console.error("Supabase UPDATE error details:", errDetails);
          console.error(
            `Supabase error [${errDetails.code}]: ${errDetails.message}${
              errDetails.details ? ` | Details: ${errDetails.details}` : ""
            }${errDetails.hint ? ` | Hint: ${errDetails.hint}` : ""}`
          );
          setFormError(
            `[${errDetails.code}] ${errDetails.message}${
              errDetails.details ? ` — ${errDetails.details}` : ""
            }${errDetails.hint ? ` (${errDetails.hint})` : ""}`
          );
          setSaving(false);
          return;
        }

        showNotice("Blog post updated successfully.");
      } else {
        // Create new post
        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert([payload]);

        if (insertError) {
          const errDetails = {
            message: insertError.message || "Unknown error occurred",
            code: insertError.code || "UNKNOWN",
            details: insertError.details || null,
            hint: insertError.hint || null,
          };
          console.error("Supabase INSERT error details:", errDetails);
          console.error(
            `Supabase error [${errDetails.code}]: ${errDetails.message}${
              errDetails.details ? ` | Details: ${errDetails.details}` : ""
            }${errDetails.hint ? ` | Hint: ${errDetails.hint}` : ""}`
          );
          setFormError(
            `[${errDetails.code}] ${errDetails.message}${
              errDetails.details ? ` — ${errDetails.details}` : ""
            }${errDetails.hint ? ` (${errDetails.hint})` : ""}`
          );
          setSaving(false);
          return;
        }

        showNotice("Blog post created successfully.");
      }

      setEditorOpen(false);
      fetchPosts();
    } catch (err) {
      const errDetails = {
        message: err?.message || (typeof err === "string" ? err : "Unexpected error"),
        code: err?.code || "UNKNOWN",
        details: err?.details || null,
        hint: err?.hint || null,
      };
      console.error("Unexpected error saving blog post:", errDetails);
      console.error("Raw error:", err);
      setFormError(
        `[${errDetails.code}] ${errDetails.message}${
          errDetails.details ? ` — ${errDetails.details}` : ""
        }${errDetails.hint ? ` (${errDetails.hint})` : ""}`
      );
    } finally {
      setSaving(false);
    }
  };

  // 6. Toggle Publish Status
  const handleTogglePublish = async (post) => {
    setTogglingId(post.id);
    const newPublished = !post.published;

    try {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          published: newPublished,
          published_at: newPublished ? post.published_at || new Date().toISOString() : post.published_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (updateError) throw updateError;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                published: newPublished,
                published_at: newPublished ? p.published_at || new Date().toISOString() : p.published_at,
              }
            : p
        )
      );

      showNotice(
        newPublished ? "Post published to public journal." : "Post converted to draft."
      );
    } catch (err) {
      console.error("Error updating publish status:", err);
      showNotice(err.message || "Failed to update publish state.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  // 7. Delete Post
  const handleDeletePost = async (postId) => {
    setDeletingId(postId);

    try {
      const { error: deleteError } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (deleteError) throw deleteError;

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeleteConfirmId(null);
      showNotice("Blog post deleted.");
    } catch (err) {
      console.error("Error deleting post:", err);
      showNotice(err.message || "Failed to delete post.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // 8. Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  // Metrics
  const counts = useMemo(() => {
    return {
      all: posts.length,
      published: posts.filter((p) => p.published).length,
      drafts: posts.filter((p) => !p.published).length,
    };
  }, [posts]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter === "published" && !p.published) return false;
      if (statusFilter === "draft" && p.published) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (p.title || "").toLowerCase().includes(q) ||
          (p.slug || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.author || "").toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [posts, statusFilter, searchQuery]);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E40101] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative overflow-x-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#E40101]/5 blur-[160px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 border-b border-zinc-800/60 bg-zinc-900/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
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
                  Blog & Editorial
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#E40101]" />
              <span>View Public Journal</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 px-3.5 py-1.5 rounded-full transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notice alert */}
        {notice && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm transition-all ${
              notice.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-[#E40101] uppercase tracking-widest mb-2">
              <BookOpen className="w-3 h-3" />
              Content Engine
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Blog <span className="text-[#E40101]">Management</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPosts(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#E40101]" : ""}`}
              />
              <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] px-4 py-2.5 rounded-xl shadow-lg shadow-[#E40101]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { id: "all", label: "All Posts", count: counts.all, icon: BookOpen, color: "text-white" },
            { id: "published", label: "Published", count: counts.published, icon: CheckCircle2, color: "text-emerald-400" },
            { id: "draft", label: "Drafts", count: counts.drafts, icon: Clock, color: "text-amber-400" },
          ].map((item) => {
            const Icon = item.icon;
            const active = statusFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  active
                    ? "bg-zinc-900 border-[#E40101]/50 shadow-lg shadow-red-950/20"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                    {item.label}
                  </span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className={`text-2xl font-bold font-mono ${item.color}`}>
                  {item.count}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles by title, slug, category, or author…"
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

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 mr-1" />
              {["all", "published", "draft"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    statusFilter === st
                      ? "bg-[#E40101] text-white"
                      : "bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {st === "all" ? "All" : st === "published" ? "Published" : "Drafts"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl py-24 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#E40101] animate-spin mb-3" />
            <p className="text-zinc-400 text-sm">Loading articles from Supabase…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Articles</h3>
            <p className="text-sm text-red-300/90 max-w-lg mx-auto mb-4">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetching
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl py-20 px-4 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
              No Articles Found
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              {searchQuery || statusFilter !== "all"
                ? "No articles match your current search and filter criteria."
                : "Create your first article to start building the Anti-Agency journal."}
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Article</span>
            </button>
          </div>
        )}

        {/* Articles Table / Cards List */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isDeleting = deletingId === post.id;
              const isToggling = togglingId === post.id;

              return (
                <div
                  key={post.id}
                  className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 sm:p-6 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                            post.published
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              post.published ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          {post.published ? "Published" : "Draft"}
                        </span>

                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700/50 font-mono">
                          <Tag className="w-3 h-3 text-zinc-400" />
                          {post.category || "Insights"}
                        </span>

                        {/* Slug */}
                        <span className="text-xs text-zinc-500 font-mono truncate">
                          /blog/{post.slug}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight hover:text-[#E40101] transition-colors mb-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                        <span>By {post.author || "Editorial"}</span>
                        <span>•</span>
                        <span>Created: {formatDate(post.created_at)}</span>
                        {post.published && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-500">
                              Published: {formatDate(post.published_at)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/60 w-full lg:w-auto justify-between lg:justify-start">
                      {/* Publish / Unpublish Toggle */}
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={isToggling}
                        title={post.published ? "Unpublish to Draft" : "Publish to Journal"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 border ${
                          post.published
                            ? "bg-zinc-950 hover:bg-amber-500/10 text-zinc-300 hover:text-amber-400 border-zinc-800 hover:border-amber-500/30"
                            : "bg-zinc-950 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-400 border-zinc-800 hover:border-emerald-500/30"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : post.published ? (
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{post.published ? "Unpublish" : "Publish"}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#E40101]" />
                        <span>Edit</span>
                      </button>

                      {/* Public Preview Link */}
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          title="View on site"
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}

                      {/* Delete Trigger */}
                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        disabled={isDeleting}
                        title="Delete Article"
                        className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Delete Confirmation */}
                  {deleteConfirmId === post.id && (
                    <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>
                          Are you sure you want to permanently delete{" "}
                          <strong className="text-white">"{post.title}"</strong>?
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-1.5"
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

      {/* Editor Modal / Overlay */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-white">
                  {editingPost ? "Edit Article" : "Create New Article"}
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  {editingPost ? `Editing: ${editingPost.title}` : "Draft a new publication for the journal"}
                </p>
              </div>
              <button
                onClick={() => setEditorOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePost} className="p-6 overflow-y-auto flex-1 space-y-6">
              {formError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Why Corporate Branding Fails in 2026"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-600">
                      /blog/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="corporate-branding-fails-2026"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                      }
                      className="w-full pl-16 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#E40101]"
                  >
                    <option value="Insights">Insights</option>
                    <option value="Design">Design</option>
                    <option value="Branding">Branding</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Anti-Agency Editorial"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                  />
                </div>
              </div>

              {/* Featured Image URL & Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Featured Image (URL or Upload)
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="https://... or upload from your device"
                      value={formData.featured_image}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, featured_image: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                    />
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-[#E40101] animate-spin" />
                        <span>Uploading…</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#E40101]" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Upload Status Alerts */}
                {uploadError && (
                  <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {/* Image Preview */}
                {formData.featured_image && (
                  <div className="mt-3 p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.featured_image}
                          alt="Featured preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-zinc-200 block truncate">
                          Featured Image Preview
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono block truncate">
                          {formData.featured_image}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, featured_image: "" }))
                      }
                      className="text-xs text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Excerpt / Brief Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise, compelling summary to display on cards and search previews…"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                />
              </div>

              {/* Content (Markdown) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Content (Markdown Supported) *
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Supports ## headings, &gt; quotes, - lists
                  </span>
                </div>
                <textarea
                  rows={12}
                  required
                  placeholder={`Write your article content here...\n\n## Subheading\n\nYour paragraph goes here.\n\n> Important quote callout\n\n- Key takeaway 1\n- Key takeaway 2`}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#E40101] leading-relaxed"
                />
              </div>

              {/* Publish Toggle checkbox */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">
                    Publish Article Immediately
                  </span>
                  <span className="text-xs text-zinc-500">
                    If checked, this article will immediately appear in the public /blog journal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="published-toggle"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                  className="w-5 h-5 accent-[#E40101] cursor-pointer rounded"
                />
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#E40101] hover:bg-[#ff1a1a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#E40101]/25 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingPost ? "Save Changes" : "Create Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
