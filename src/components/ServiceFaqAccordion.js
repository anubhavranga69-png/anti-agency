"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function ServiceFaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const num = String(index + 1).padStart(2, "0");
        return (
          <div
            key={index}
            className={`glass-card rounded-md border transition-all duration-200 overflow-hidden ${
              isOpen ? "border-[#8FA394]/50 bg-zinc-900/90" : "border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="font-mono text-xs text-[#8FA394] font-bold">
                  {num}
                </span>
                <span className="font-heading text-base sm:text-lg text-white font-bold tracking-wide group-hover:text-[#8FA394] transition-colors">
                  {faq.q}
                </span>
              </div>
              <div
                className={`w-8 h-8 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                  isOpen
                    ? "bg-[#8FA394] text-[#050505] border-[#8FA394]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700"
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
