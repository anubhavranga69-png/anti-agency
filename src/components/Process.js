"use client";

import { Compass, Lightbulb, Rocket, BarChart } from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "01",
      icon: Compass,
      title: "Discovery & Audit",
      description:
        "Dissecting your market landscape and pinpointing high-leverage positioning opportunities.",
    },
    {
      number: "02",
      icon: Lightbulb,
      title: "Strategy Blueprint",
      description:
        "Designing the comprehensive brand blueprint, messaging hierarchy, and technical architecture.",
    },
    {
      number: "03",
      icon: Rocket,
      title: "Rapid Execution",
      description:
        "Engineering custom web applications, visual design systems, and high-impact assets.",
    },
    {
      number: "04",
      icon: BarChart,
      title: "Launch & Scale",
      description:
        "Deploying your digital ecosystem and compounding long-term category authority.",
    },
  ];

  return (
    <section id="process" className="py-10 relative bg-[#09090b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Execution Roadmap
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight">
            How We Build <span className="text-[#7c93a3]">Market Leaders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-md p-5 border border-zinc-800 flex flex-col justify-between relative group transition-all duration-300 ease-out sm:hover:scale-[1.06] sm:hover:-translate-y-1 sm:hover:z-20 sm:hover:border-[#7c93a3]/60 sm:hover:shadow-[0_12px_40px_-10px_rgba(124,147,163,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading text-2xl font-bold text-[#7c93a3]">
                      {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading text-sm text-white font-bold uppercase tracking-wide mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
