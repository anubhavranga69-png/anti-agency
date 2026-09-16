"use client";

import { useRef, useState, useEffect } from "react";
import {
  ShieldCheck,
  Zap,
  Code2,
  Layers,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function WhyChooseUs() {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

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

  // Quadruple items to ensure smooth infinite loop and full screen coverage
  const displayItems = [...pillars, ...pillars, ...pillars, ...pillars];

  // Update refs when states change
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Infinite auto-scroll loop
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrameId;
    const speed = 0.8; // smooth constant gliding velocity

    const step = () => {
      if (slider && !isDraggingRef.current && !isHoveredRef.current) {
        slider.scrollLeft += speed;

        const halfWidth = slider.scrollWidth / 2;
        if (slider.scrollLeft >= halfWidth) {
          slider.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle boundary wraps during manual scrolling/dragging
  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const halfWidth = slider.scrollWidth / 2;
    if (slider.scrollLeft >= halfWidth) {
      slider.scrollLeft -= halfWidth;
    } else if (slider.scrollLeft <= 0) {
      slider.scrollLeft += halfWidth;
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    slider.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    setIsHovered(false);
    isHoveredRef.current = false;
  };

  // Arrow button clicks
  const handleNavigate = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = 360;
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 relative bg-[#09090b] overflow-hidden border-t border-b border-zinc-900 select-none">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#E40101]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#E40101] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-[#E40101]" />
              Why Anti-Agency
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
              Built Different. <br />
              <span className="text-[#E40101]">Engineered for Distinction.</span>
            </h2>
          </div>

          {/* Drag Hint & Navigation Controls */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline-block mr-2">
              ← Drag or Scroll →
            </span>
            <button
              onClick={() => handleNavigate("left")}
              aria-label="Previous card"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E40101] hover:bg-zinc-800 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNavigate("right")}
              aria-label="Next card"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E40101] hover:bg-zinc-800 transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Carousel Track: Auto-moves, Draggable & Scrollable */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right gradient edge fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#09090b] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#09090b] to-transparent z-20 pointer-events-none" />

        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-5 px-4 sm:px-8 overflow-x-auto no-scrollbar py-3 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayItems.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={idx}
                className="w-[300px] sm:w-[340px] shrink-0 glass-card rounded-2xl p-6 border border-zinc-800/90 hover:border-[#E40101]/60 transition-all duration-300 group flex flex-col justify-between min-h-[250px] relative overflow-hidden bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 shadow-xl select-none"
              >
                {/* Ambient hover flare */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#E40101]/5 blur-[35px] group-hover:bg-[#E40101]/15 transition-colors pointer-events-none" />

                <div>
                  {/* Top Row: Icon & Number Badge */}
                  <div className="flex items-center justify-between mb-4 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[#E40101] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#E40101] group-hover:text-white transition-all duration-300 shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-600 group-hover:text-[#E40101] transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-heading text-base text-white font-bold uppercase tracking-tight mb-2 leading-snug group-hover:text-white transition-colors pointer-events-none">
                    {pillar.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal pointer-events-none">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="pt-3.5 border-t border-zinc-800/80 mt-4 flex items-center pointer-events-none">
                  <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E40101] group-hover:animate-ping" />
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
