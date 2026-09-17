"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  Clock,
  ArrowUpRight,
  Search,
  Tag,
  Sparkles,
  BookOpen,
  Loader2,
  AlertCircle,
  X,
  Filter,
} from "lucide-react";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPublishedPosts() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false });

        if (fetchError) throw fetchError;

        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load journal articles. Please check back shortly.");
      } finally {
        setLoading(false);
      }
    }

    fetchPublishedPosts();
  }, []);

  // Compute unique categories from published posts
  const categories = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (
        selectedCategory !== "all" &&
        (post.category || "").toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = (post.title || "").toLowerCase().includes(query);
        const matchExcerpt = (post.excerpt || "").toLowerCase().includes(query);
        const matchCategory = (post.category || "").toLowerCase().includes(query);
        const matchAuthor = (post.author || "").toLowerCase().includes(query);
        return matchTitle || matchExcerpt || matchCategory || matchAuthor;
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const calculateReadingTime = (content) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      <PageNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative pt-16 pb-14 border-b border-zinc-800/60 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#E40101]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-[#E40101] uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              The Anti-Agency Journal
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white max-w-3xl mx-auto leading-tight mb-6">
              Perspectives On <span className="text-[#E40101]">Digital Dominance</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Unfiltered thoughts on brand engineering, bespoke digital craft, and
              the ruthless pursuit of distinct market positioning.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-8 border-b border-zinc-800/40 bg-[#09090b]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-[#E40101] text-white shadow-lg shadow-[#E40101]/25"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {cat === "all" ? "All Articles" : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
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
            </div>
          </div>
        </section>

        {/* Articles Grid / Content */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading */}
            {loading && (
              <div className="py-28 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#E40101] animate-spin mb-4" />
                <p className="text-zinc-400 text-sm font-mono tracking-wider uppercase">
                  Loading articles…
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="max-w-xl mx-auto p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Unable to Load Journal</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="py-24 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-5 text-zinc-600">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-white mb-2">
                  No Articles Found
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                  {searchQuery || selectedCategory !== "all"
                    ? "No published articles match your current search and filter settings."
                    : "Fresh articles and strategic perspectives will be published here soon."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="text-xs uppercase tracking-wider font-semibold text-[#E40101] hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}

            {/* Articles List */}
            {!loading && !error && filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="aspect-[16/10] bg-zinc-950 block relative overflow-hidden border-b border-zinc-800/60"
                    >
                      {post.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.classList.remove("hidden");
                          }}
                        />
                      ) : null}

                      <div
                        className={`w-full h-full flex items-center justify-center relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ${
                          post.featured_image ? "hidden" : ""
                        }`}
                      >
                        <div className="absolute inset-0 bg-[#E40101]/5 group-hover:bg-[#E40101]/10 transition-colors" />
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-[#E40101] transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Category Badge overlay */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/10">
                          {post.category || "Insight"}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {calculateReadingTime(post.content)}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#E40101] transition-colors line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-6 font-light">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Footer Read More */}
                      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                        <span className="text-xs text-zinc-500 font-mono">
                          By {post.author || "Editorial"}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#E40101] transition-colors"
                        >
                          <span>Read</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
