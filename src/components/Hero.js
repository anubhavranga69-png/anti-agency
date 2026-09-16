"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Hero({ onOpenAudit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Website Design",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: insertError } = await supabase.from("leads").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        service: formData.service,
        message: formData.details || null,
      },
    ]);

    if (insertError) {
      setError(
        "Something went wrong submitting your enquiry. Please try again or email us directly."
      );
      setLoading(false);
    } else {
      setLoading(false);
      setSubmitted(true);
      // Reset form for next submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "Website Design",
        details: "",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-4 overflow-hidden bg-[#09090b]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E40101]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-3 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-[#E40101] animate-pulse" />
              <span className="text-[#E40101] font-mono font-bold uppercase tracking-wider">
                Anti-Agency
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Brand-Building Partner</span>
            </div>

            {/* Main Title */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight text-white font-bold leading-[1.05] uppercase mb-3">
              We Don't Just <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#E40101]">
                Market Brands.
              </span>{" "}
              <br />
              <span className="underline decoration-[#E40101] underline-offset-4">
                We Build Them.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed mb-4 font-normal">
              Bespoke brand identities and high-performance digital platforms built for ambitious companies across the US, UK, India, Australia & Dubai.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={onOpenAudit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#E40101]/30 hover:shadow-[#E40101]/50 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                Book Brand Audit
              </button>
              <a
                href="#services"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-bold text-xs uppercase tracking-wider transition-all hover:border-[#E40101]/50 cursor-pointer"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>


          </div>

          {/* Right Column: Hero Enquiry Form Card */}
          <div className="lg:col-span-5" id="hero-enquiry">
            <div className="glass-card rounded-2xl p-4 sm:p-5 border border-zinc-800 relative shadow-2xl">
              <div className="mb-2.5">
                <div className="flex items-center gap-2 text-[#E40101] font-mono text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  <Zap className="w-3.5 h-3.5 fill-[#E40101]" />
                  Direct Consultation
                </div>
                <h3 className="font-heading text-xl text-white font-bold uppercase tracking-wide">
                  Start Your Project
                </h3>
              </div>

              {submitted ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center bg-zinc-900/60 rounded-2xl border border-emerald-500/30">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="font-heading text-2xl text-white uppercase font-bold">
                    Enquiry Submitted!
                  </h4>
                  <p className="text-xs text-zinc-300 mt-2 max-w-xs">
                    Thank you! Our strategy team will review your requirements
                    and reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setError(""); }}
                    className="mt-6 text-xs font-semibold text-[#E40101] underline hover:text-white"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5 -mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Primary Service Needed *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E40101] transition-colors"
                    >
                      <option value="Website Design">Website Design & Development</option>
                      <option value="Branding & Packaging">Branding & Packaging</option>
                      <option value="Social Media">Social Media Management</option>
                      <option value="Video Production">Video Shoots & Editing</option>
                      <option value="AI Content">AI-Implemented Content</option>
                      <option value="Brand Strategy">Full Brand Strategy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Project Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What are you trying to build or improve?"
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                      className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101] transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-[#E40101]/10 border border-[#E40101]/30 text-[11px] text-red-300"
                    >
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#E40101]" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E40101]/30 transition-all hover:shadow-[#E40101]/50 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry Now
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400 pt-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#E40101]" /> No Obligation
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#E40101]" /> Confidential
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
