"use client";

import { useState, useEffect, useRef } from "react";
import { Globe2, MapPin, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import InteractiveGlobe from "./InteractiveGlobe";

export default function GlobalReach() {
  const [activeRegion, setActiveRegion] = useState("usa");
  const [mobileOpen, setMobileOpen] = useState(false);

  const regions = [
    {
      id: "usa",
      flag: "🇺🇸",
      country: "United States",
      coordinates: [37.0902, -95.7129],
      cities: ["New York", "Los Angeles", "San Francisco", "Chicago", "Miami"],
      focus: "High-growth SaaS, D2C Brands & Tech Startups",
      highlights: [
        "Silicon Valley & NYC Tech positioning",
        "US Consumer conversion frameworks",
        "High-ARPU customer acquisition focus",
      ],
    },
    {
      id: "uk",
      flag: "🇬🇧",
      country: "United Kingdom",
      coordinates: [55.3781, -3.436],
      cities: ["London", "Manchester", "Birmingham", "Edinburgh"],
      focus: "Luxury Goods, Fintech & Professional Services",
      highlights: [
        "London financial & boutique brand aesthetics",
        "EU & UK regulatory compliance standards",
        "Premium editorial & brand storytelling",
      ],
    },
    {
      id: "india",
      flag: "🇮🇳",
      country: "India",
      coordinates: [20.5937, 78.9629],
      cities: ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad"],
      focus: "Unicorn Startups, Enterprise & Global D2C Brands",
      highlights: [
        "Bangalore tech & startup ecosystem strategy",
        "High-scale viral social media production",
        "Pan-India & export brand positioning",
      ],
    },
    {
      id: "australia",
      flag: "🇦🇺",
      country: "Australia",
      coordinates: [-25.2744, 133.7751],
      cities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
      focus: "E-Commerce, Lifestyle & Sustainable Brands",
      highlights: [
        "APAC market entry & positioning",
        "Clean, minimalist design systems",
        "High-converting Shopify & custom web setups",
      ],
    },
    {
      id: "dubai",
      flag: "🇦🇪",
      country: "Dubai (UAE)",
      coordinates: [25.2048, 55.2708],
      cities: ["Dubai", "Abu Dhabi"],
      focus: "Luxury Real Estate, Crypto & High-Net-Worth Brands",
      highlights: [
        "GCC luxury branding & HNW audience appeal",
        "Bilingual Arabic/English visual storytelling",
        "High-end video production & event branding",
      ],
    },
  ];

  const activeData = regions.find((r) => r.id === activeRegion);

  const handleRegionSelect = (id) => {
    setActiveRegion(id);
    setMobileOpen(false);
  };

  return (
    <section id="global" className="py-12 relative bg-[#09090b] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E40101]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#E40101] uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5 text-[#E40101]" />
            Global Footprint
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
            Building Iconic Brands Across{" "}
            <span className="text-[#E40101]">5 Key Continents</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2.5 max-w-lg mx-auto leading-relaxed">
            Tailored brand positioning and bespoke visual architecture across international markets.
          </p>
        </div>

        {/* ── Desktop Region Tabs (hidden on mobile) ── */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-8">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeRegion === region.id
                  ? "bg-[#E40101] text-white shadow-lg shadow-[#E40101]/30 scale-105"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span className="text-sm">{region.flag}</span>
              <span>{region.country}</span>
            </button>
          ))}
        </div>

        {/* ── Mobile Region Dropdown (hidden on sm+) ── */}
        <div className="sm:hidden mb-5 relative">
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-bold uppercase tracking-wider text-white"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{activeData?.flag}</span>
              <span>{activeData?.country}</span>
            </span>
            {mobileOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {mobileOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors text-left ${
                    activeRegion === region.id
                      ? "bg-[#E40101]/15 text-[#E40101] border-l-2 border-[#E40101]"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span className="text-lg">{region.flag}</span>
                  <span>{region.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Main Card ── */}
        {activeData && (
          <div className="glass-card rounded-3xl border border-zinc-800 max-w-5xl mx-auto shadow-2xl overflow-hidden">
            {/* Globe on top for mobile, side for desktop */}
            <div className="flex flex-col lg:grid lg:grid-cols-12">

              {/* Globe Box */}
              <div
                className="lg:col-span-5 relative bg-zinc-950/50"
                style={{ height: "300px" }}
                ref={(el) => {
                  // On mobile, height is 300px; on desktop keep 420px via ResizeObserver
                  if (!el) return;
                  const updateHeight = () => {
                    if (window.innerWidth >= 1024) {
                      el.style.height = "420px";
                    } else {
                      el.style.height = "280px";
                    }
                  };
                  updateHeight();
                  window.addEventListener("resize", updateHeight);
                }}
              >
                {/* Ambient glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="w-[220px] h-[220px] bg-[#E40101]/10 rounded-full blur-[80px]" />
                </div>
                <InteractiveGlobe activeRegion={activeRegion} />
              </div>

              {/* Content Panel */}
              <div className="lg:col-span-7 p-5 sm:p-6 lg:p-8">
                {/* Country header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl">{activeData.flag}</span>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl text-white font-bold uppercase tracking-wide leading-tight">
                      {activeData.country}
                    </h3>
                    <p className="text-[11px] font-mono text-[#E40101] uppercase tracking-wider mt-0.5">
                      Regional Strategy
                    </p>
                  </div>
                </div>

                {/* Focus area */}
                <div className="mb-4">
                  <p className="text-sm text-zinc-200 font-medium bg-zinc-900/90 border border-zinc-800 px-3 py-2.5 rounded-xl leading-relaxed">
                    {activeData.focus}
                  </p>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 mb-5">
                  {activeData.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#E40101] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Cities + CTA */}
                <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800/80">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#E40101]" />
                    Hub Cities Served
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activeData.cities.map((city, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-200"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#hero-enquiry"
                    className="block w-full text-center px-6 py-2.5 rounded-full bg-[#E40101] hover:bg-[#ff1a1a] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#E40101]/25"
                  >
                    Consult for {activeData.country}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
