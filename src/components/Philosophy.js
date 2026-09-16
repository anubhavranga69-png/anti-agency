"use client";

import { useState } from "react";
import { Target, Users, Zap, Award, CheckCircle2 } from "lucide-react";

export default function Philosophy() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  const pillars = [
    {
      icon: Users,
      title: "Dedicated Executive Attention",
      subtitle: "Direct access to founders & senior strategists",
      description:
        "No Junior Account Managers or outsourced junior staff. You work directly with senior brand strategists who understand business growth.",
    },
    {
      icon: Target,
      title: "Zero Stock Templates",
      subtitle: "Bespoke digital architecture",
      description:
        "Every brand identity, website code, and visual asset is built from scratch to reflect your unique market authority.",
    },
    {
      icon: Zap,
      title: "Agile High-Speed Execution",
      subtitle: "Rapid deployment & iterations",
      description:
        "We move at tech-startup speed. No slow corporate bureaucracy, no months of endless revision loops.",
    },
    {
      icon: Award,
      title: "Brand Memory Framework",
      subtitle: "Long-term positioning & equity",
      description:
        "We design visual and emotional hooks that ensure customer recall long after their first interaction with your business.",
    },
  ];

  const handleCardClick = (index) => {
    setFlippedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="philosophy" className="py-10 relative bg-[#09090b] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#E40101]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
            We Intentionally Work With{" "}
            <span className="text-[#E40101] underline decoration-white/20 underline-offset-4">
              Only 3–4 Clients Per Quarter
            </span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2.5 max-w-xl mx-auto leading-relaxed">
            We cap our client intake to guarantee direct founder access, bespoke architecture, and obsessive execution.
          </p>
        </div>

        {/* 4 Pillar Cards with 3D Flip Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            const isFlipped = flippedIndex === index;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="group perspective-1000 min-h-[210px] h-[210px] cursor-pointer"
              >
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d transition-transform group-hover:[transform:rotateY(180deg)] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between group-hover:border-[#E40101]/40 transition-colors">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101] mb-3 group-hover:bg-[#E40101]/10 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-base text-white font-bold uppercase tracking-wide mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] font-mono text-[#E40101] uppercase tracking-wider">
                        {pillar.subtitle}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E40101]" />
                        Pillar 0{index + 1}
                      </span>
                      <span className="text-[#E40101]/80 flex items-center gap-1">
                        ↻
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE (Revealed on Hover) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-card rounded-2xl p-5 border border-[#E40101]/50 bg-zinc-950/95 flex flex-col justify-between shadow-xl shadow-[#E40101]/10">
                    <div>
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/80">
                        <span className="text-[11px] font-mono text-[#E40101] uppercase tracking-wider font-semibold">
                          {pillar.subtitle}
                        </span>
                        <IconComponent className="w-4 h-4 text-[#E40101]" />
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-[10px] text-[#E40101] font-semibold uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E40101]" />
                      Anti-Agency Standard
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
