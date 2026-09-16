"use client";

import { useState } from "react";
import { Sparkles, X, CheckCircle2, ArrowRight } from "lucide-react";

export default function BrandAuditModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    challenge: "",
    revenue: "",
    timeline: "",
    name: "",
    email: "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleOptionSelect = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Results / Contact input step
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-zinc-700 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#E40101] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-[#E40101] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 fill-[#E40101]" />
            Free Brand Health Audit
          </div>
          <h3 className="font-heading text-3xl text-white font-bold uppercase tracking-wide">
            Instant Brand Score Calculator
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Answer 3 quick questions to calculate your brand's digital health score and get an executive review.
          </p>
        </div>

        {/* Step Progress Bar */}
        {!submitted && (
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-[#E40101] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Step 1: Challenge */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              1. What is your biggest brand challenge right now?
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                "Outdated or Low-Converting Website",
                "Weak Brand Identity & Recognition",
                "Inconsistent Social Media & Video Content",
                "Entering a New Market / Scaling Up",
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect("challenge", opt)}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#E40101] hover:bg-zinc-800/80 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-between group"
                >
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#E40101] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Revenue */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              2. What is your current monthly business revenue?
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                "Early Stage (< $10k / month)",
                "Growing Brand ($10k - $50k / month)",
                "Scaling Enterprise ($50k - $200k / month)",
                "Established Leader ($200k+ / month)",
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect("revenue", opt)}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#E40101] hover:bg-zinc-800/80 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-between group"
                >
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#E40101] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Timeline */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              3. When are you looking to execute this upgrade?
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                "Immediately (Next 2 Weeks)",
                "Within 30 Days",
                "Next Quarter",
                "Just Exploring Options",
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect("timeline", opt)}
                  className="w-full text-left p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#E40101] hover:bg-zinc-800/80 text-xs font-semibold text-zinc-200 transition-all flex items-center justify-between group"
                >
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#E40101] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact Input & Results */}
        {step === 4 && !submitted && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 text-center">
              <span className="text-xs font-mono text-[#E40101] uppercase tracking-widest block mb-1">
                Estimated Brand Score Calculated
              </span>
              <span className="font-heading text-5xl font-bold text-white">74 / 100</span>
              <p className="text-[11px] text-zinc-400 mt-1">
                Your brand has growth potential in website conversion and positioning consistency.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={answers.name}
                  onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={answers.email}
                  onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={answers.website}
                  onChange={(e) => setAnswers({ ...answers, website: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E40101]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E40101]/30"
            >
              Get Full Executive Audit Report
            </button>
          </form>
        )}

        {/* Submitted Confirmation */}
        {submitted && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
            <h4 className="font-heading text-3xl text-white uppercase font-bold">
              Audit Request Confirmed!
            </h4>
            <p className="text-xs text-zinc-300 mt-2 max-w-sm">
              We have received your audit parameters. Our lead strategist will prepare a 5-page teardown and email it to <strong>{answers.email}</strong> within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-white hover:border-[#E40101]"
            >
              Back to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
