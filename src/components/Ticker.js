"use client";

import { Sparkles } from "lucide-react";

export default function Ticker() {
  const items = [
    "WEBSITE DESIGN",
    "BRANDING & PACKAGING",
    "SOCIAL MEDIA MANAGEMENT",
    "VIDEO SHOOTS & EDITING",
    "AI-IMPLEMENTED CONTENT",
    "BRAND STRATEGY",
    "GLOBAL BRAND BUILDING",
    "3–4 CLIENTS PER QUARTER",
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative py-3.5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-zinc-800/80 overflow-hidden select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {repeated.map((text, idx) => (
          <div key={idx} className="flex items-center gap-5 mx-3">
            <span className="font-heading text-xs sm:text-sm font-bold tracking-widest text-zinc-300 hover:text-white transition-colors uppercase">
              {text}
            </span>
            <Sparkles className="w-3 h-3 text-[#7c93a3] shrink-0 fill-[#7c93a3]" />
          </div>
        ))}
      </div>
    </div>
  );
}
