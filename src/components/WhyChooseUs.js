"use client";

import { useRef, useEffect, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Code2,
  Layers,
  Sparkles,
  BarChart3,
} from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Strategic Brand-First Approach",
    description:
      "Building lasting category authority and customer loyalty instead of short-lived ad hacks.",
    tag: "Category Authority",
  },
  {
    icon: Code2,
    number: "02",
    title: "Bespoke Technical Mastery",
    description:
      "Ultra-fast custom Next.js web applications engineered with zero template bloat.",
    tag: "Custom Architecture",
  },
  {
    icon: Zap,
    number: "03",
    title: "AI-Powered Velocity",
    description:
      "Scaling asset production speed 10x using custom generative AI workflows.",
    tag: "10x Production Speed",
  },
  {
    icon: Layers,
    number: "04",
    title: "Complete Creative Ecosystem",
    description:
      "Brand strategy, custom code, high-end video, and social management under one roof.",
    tag: "All-in-One Studio",
  },
  {
    icon: Sparkles,
    number: "05",
    title: "Obsessive Visual Polish",
    description:
      "Meticulous typography pairings, micro-interactions, and high-converting aesthetics.",
    tag: "Pixel Perfection",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "Conversion-Driven ROI",
    description:
      "Every creative asset is engineered with clear intent to turn visitors into paying clients.",
    tag: "Revenue-Focused",
  },
];

// Triple to guarantee seamless wrap at any screen width
const items = [...pillars, ...pillars, ...pillars];

const CARD_W = 320; // px per card including gap
const SPEED = 0.6;  // px per frame at normal pace
const HOVER_SPEED = 0.12; // slowed speed on hover

export default function WhyChooseUs() {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const speedRef = useRef(SPEED);
  const rafRef = useRef(null);
  const isHoveredRef = useRef(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const viewportRef = useRef(null);
  
  const isWheelingRef = useRef(false);
  const wheelTimeoutRef = useRef(null);

  // The single-set width used for the seamless wrap
  const singleSetW = pillars.length * CARD_W;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // start midway so we can scroll left & right without hitting the edge
    xRef.current = -singleSetW;
    track.style.transform = `translateX(${xRef.current}px)`;

    const animate = () => {
      // Ease speed toward target
      const target = isHoveredRef.current ? HOVER_SPEED : SPEED;
      speedRef.current += (target - speedRef.current) * 0.06;

      if (!isDraggingRef.current && !isWheelingRef.current) {
        xRef.current -= speedRef.current;
      }

      // Wrap when we've scrolled one full set width
      if (xRef.current <= -singleSetW * 2) xRef.current += singleSetW;
      if (xRef.current > -singleSetW) xRef.current -= singleSetW;

      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [singleSetW]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      // Determine dominant scrolling direction
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 0) {
        e.preventDefault(); // prevent native scrolling
      }

      xRef.current -= delta;
      isWheelingRef.current = true;

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      
      wheelTimeoutRef.current = setTimeout(() => {
        isWheelingRef.current = false;
      }, 150);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  const handleDragStart = (clientX) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    if (viewportRef.current) {
      viewportRef.current.classList.remove("cursor-grab");
      viewportRef.current.classList.add("cursor-grabbing");
    }
    if (trackRef.current) {
      trackRef.current.style.pointerEvents = "none";
    }
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    xRef.current += deltaX;
    startXRef.current = clientX;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    if (viewportRef.current) {
      viewportRef.current.classList.remove("cursor-grabbing");
      viewportRef.current.classList.add("cursor-grab");
    }
    if (trackRef.current) {
      trackRef.current.style.pointerEvents = "auto";
    }
  };

  return (
    <section className="py-14 relative bg-[#09090b] overflow-hidden border-t border-b border-zinc-900 select-none">
      {/* Ambient bg */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#7c93a3]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-slate-400/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-[#7c93a3]" />
              Why Anti-Agency
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
              Built Different. <br />
              <span className="text-[#7c93a3]">Engineered for Distinction.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest hidden sm:block">
            Hover to inspect · Auto-gliding
          </p>
        </div>
      </div>

      {/* Carousel viewport */}
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden cursor-grab"
        style={{ touchAction: "pan-y" }}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { 
          isHoveredRef.current = false; 
          setHoveredIdx(null);
          handleDragEnd();
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Edge fades */}
        <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-[#09090b] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-[#09090b] to-transparent z-20 pointer-events-none" />

        {/* Moving track — no overflow-x, pure transform */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: "20px", paddingBlock: "12px", pointerEvents: "auto" }}
        >
          {items.map((pillar, idx) => {
            const IconComp = pillar.icon;
            const isHov = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  width: `${CARD_W - 20}px`,
                  flexShrink: 0,
                  transform: isHov
                    ? "scale(1.04) translateY(-6px) rotate(-0.5deg)"
                    : "scale(1) translateY(0px) rotate(0deg)",
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.3s ease",
                  boxShadow: isHov
                    ? "0 24px 60px rgba(124,147,163,0.15), 0 0 0 1px rgba(124,147,163,0.3)"
                    : "0 4px 24px rgba(0,0,0,0.5)",
                }}
                className="glass-card rounded-md p-6 border border-zinc-800/90 flex flex-col justify-between min-h-[240px] relative overflow-hidden bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 cursor-pointer"
              >
                {/* Hover flare */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none transition-opacity duration-500"
                  style={{ background: "#7c93a3", opacity: isHov ? 0.12 : 0.04 }}
                />

                <div>
                  {/* Icon + Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-400"
                      style={{
                        background: isHov ? "#7c93a3" : "rgba(39,39,42,0.9)",
                        border: isHov ? "1px solid #7c93a3" : "1px solid rgba(63,63,70,1)",
                        color: isHov ? "#fff" : "#7c93a3",
                        transform: isHov ? "rotate(6deg) scale(1.1)" : "rotate(0deg) scale(1)",
                        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-heading text-base font-bold uppercase tracking-tight mb-2 leading-snug transition-colors duration-300"
                    style={{ color: "#fff" }}
                  >
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom tag */}
                <div className="pt-4 border-t border-zinc-800/80 mt-5 flex items-center">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider flex items-center gap-2" style={{ color: isHov ? "#7c93a3" : "#71717a" }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#7c93a3",
                        boxShadow: isHov ? "0 0 6px #7c93a3" : "none",
                        transition: "box-shadow 0.3s",
                      }}
                    />
                    {pillar.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
