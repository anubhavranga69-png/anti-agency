"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function BlogPostClient({ slug }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("Article not found or not published.");
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to estimate reading time
  const calculateReadingTime = (content) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  // Normalizes literal escaped newline strings ("\\n", "\\r\\n") and standard carriage returns into real newlines
  const normalizeNewlines = (raw) => {
    if (!raw) return "";
    return raw
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  };

  // Inline formatting helper (e.g. **bold**)
  const formatInlineText = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Safe Markdown-to-JSX renderer for article content
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const normalized = normalizeNewlines(content);
    const paragraphs = normalized.split(/\n{2,}/);

    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-tight mt-10 mb-4 text-[#E40101]/90"
          >
            {formatInlineText(trimmed.replace(/^##\s+/, ""))}
          </h2>
        );
      }

      // H3
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight mt-8 mb-3"
          >
            {formatInlineText(trimmed.replace(/^###\s+/, ""))}
          </h3>
        );
      }

      // H1 (in body)
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-tight mt-10 mb-4"
          >
            {formatInlineText(trimmed.replace(/^#\s+/, ""))}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith(">")) {
        const quoteText = trimmed.replace(/^>\s*/gm, "");
        return (
          <blockquote
            key={idx}
            className="my-8 pl-5 border-l-2 border-[#E40101] italic text-zinc-300 bg-zinc-950/60 py-4 pr-4 rounded-r-xl text-base sm:text-lg"
          >
            {formatInlineText(quoteText)}
          </blockquote>
        );
      }

      // Unordered list
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").filter((i) => i.trim());
        return (
          <ul key={idx} className="my-6 space-y-2.5 pl-4">
            {items.map((item, iIdx) => (
              <li
                key={iIdx}
                className="flex items-start gap-2.5 text-zinc-300 text-base sm:text-lg leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E40101] mt-2.5 shrink-0" />
                <span>{formatInlineText(item.replace(/^[-*]\s+/, ""))}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split("\n").filter((i) => i.trim());
        return (
          <ol key={idx} className="my-6 space-y-2.5 pl-4 list-none">
            {items.map((item, iIdx) => (
              <li
                key={iIdx}
                className="flex items-start gap-3 text-zinc-300 text-base sm:text-lg leading-relaxed"
              >
                <span className="font-mono text-xs font-bold text-[#E40101] mt-1 shrink-0 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                  {iIdx + 1}
                </span>
                <span>{formatInlineText(item.replace(/^\d+\.\s+/, ""))}</span>
              </li>
            ))}
          </ol>
        );
      }

      // Standard paragraph
      const lines = trimmed.split("\n");
      return (
        <p
          key={idx}
          className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6 font-light"
        >
          {lines.map((line, lIdx) => (
            <span key={lIdx}>
              {formatInlineText(line)}
              {lIdx < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      <PageNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Breadcrumb Bar */}
        <section className="pt-8 pb-4 border-b border-zinc-800/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <Link href="/blog" className="hover:text-white transition-colors">
                Journal
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#E40101]" />
              <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
                {post?.title || "Article"}
              </span>
            </nav>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#E40101] animate-spin mb-4" />
            <p className="text-zinc-400 text-sm font-mono tracking-wider uppercase">
              Loading article…
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && (error || !post) && (
          <div className="max-w-xl mx-auto px-4 py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-500">
              <AlertCircle className="w-8 h-8 text-[#E40101]" />
            </div>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white mb-3">
              Article Not Found
            </h1>
            <p className="text-zinc-400 text-sm mb-8">
              {error || "This article may have been unpublished or removed."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E40101]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journal</span>
            </Link>
          </div>
        )}

        {/* Article View */}
        {!loading && post && (
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            {/* Header Meta */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-[#E40101] border border-red-500/20 text-xs font-semibold uppercase tracking-wider">
                  <Tag className="w-3 h-3" />
                  {post.category || "Perspective"}
                </span>

                <span className="text-zinc-600">•</span>

                <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {formatDate(post.published_at || post.created_at)}
                </span>

                <span className="text-zinc-600">•</span>

                <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {calculateReadingTime(post.content)}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight leading-[1.15] mb-6">
                {post.title}
              </h1>

              {/* Excerpt Lead */}
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed mb-8 border-b border-zinc-800/80 pb-8">
                  {normalizeNewlines(post.excerpt)}
                </p>
              )}

              {/* Author & Share Bar */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101] font-bold text-sm">
                    {post.author ? post.author[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {post.author || "Anti-Agency Editorial"}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      Author & Contributor
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 aspect-[16/9] relative shadow-2xl shadow-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.parentElement?.classList.add("hidden");
                  }}
                />
              </div>
            )}

            {/* Main Content Body */}
            <div className="prose-dark max-w-none mb-16">
              {renderFormattedContent(post.content)}
            </div>

            {/* Bottom Navigation & CTA */}
            <div className="pt-10 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#E40101]" />
                <span>Back to All Articles</span>
              </Link>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-full transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share this article</span>
              </button>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
