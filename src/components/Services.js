"use client";

import { useState } from "react";
import {
  Globe,
  Palette,
  Share2,
  Video,
  Cpu,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Services({ onOpenAudit }) {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: "website-design",
      slug: "website-design",
      icon: Globe,
      number: "01",
      title: "Website Design & Development",
      shortDesc:
        "High-converting, ultra-fast custom web applications built with Next.js, React & modern dynamic animations.",
      fullDesc:
        "Your website is your 24/7 digital flagship. We design and build bespoke, high-converting web applications optimized for speed, search engine ranking, and visual storytelling.",
      tags: ["Custom UI/UX", "Next.js / React", "SEO & Performance", "eCommerce"],
      deliverables: [
        "Custom UI/UX Wireframing & Design",
        "Full-Stack Next.js / React Frontend & API Integration",
        "Business & eCommerce Website Development",
        "Core Web Vitals & Speed Optimization",
        "Landing Page Design & Conversion Optimization",
        "Website Redesign & SEO Preservation",
      ],
    },
    {
      id: "branding",
      slug: "branding",
      icon: Palette,
      number: "02",
      title: "Branding & Packaging",
      shortDesc:
        "Distinctive brand identity systems, custom logos, visual design books, and high-impact physical/digital packaging.",
      fullDesc:
        "We build brand identities that cut through the noise. From signature logomarks to complete brand guidelines and product packaging design that commands attention.",
      tags: ["Brand Strategy", "Visual Identity", "Packaging Design", "Guidelines"],
      deliverables: [
        "Brand Strategy & Positioning Workshops",
        "Logo Design & Custom Typography Systems",
        "Brand Messaging, Story & Voice Guidelines",
        "Comprehensive Brand Identity Guidelines",
        "Retail & Luxury Packaging Design",
        "Dielines & Print Production Specifications",
      ],
    },
    {
      id: "social-media",
      slug: "social-media",
      icon: Share2,
      number: "03",
      title: "Social Media Management & Marketing",
      shortDesc:
        "End-to-end content production, aesthetic grid curation, viral short-form video strategy, and audience growth.",
      fullDesc:
        "Turn social channels into automated lead drivers. We plan, write, design, and publish high-performing content tailored for Instagram, LinkedIn, YouTube, and X.",
      tags: ["Strategy", "Content Creation", "Reels & Short Video", "Paid Ads"],
      deliverables: [
        "Social Media Audits & Growth Strategy",
        "Graphic Design, Carousels & Reels Production",
        "Account Scheduling, Publishing & Engagement",
        "Product Launch & Marketing Campaigns",
        "Paid Social Advertising & Performance Tracking",
        "Multi-Platform Optimization (IG, LI, YT, X, TikTok)",
      ],
    },
    {
      id: "video-production",
      slug: "video-production",
      icon: Video,
      number: "04",
      title: "Video Shoots & Editing",
      shortDesc:
        "High-production brand documentaries, product commercial shoots, dynamic motion graphics, and post-production.",
      fullDesc:
        "Video is the most powerful medium for trust. We handle everything from concept scripting, multi-cam studio production, to high-end color grading and motion graphics.",
      tags: ["Brand Films", "Product Shoots", "Social Reels", "Post-Production"],
      deliverables: [
        "Creative Pre-Production, Scripts & Shot Lists",
        "Cinematic Multi-Cam Studio & On-Location Shoots",
        "Product Video Shoots & Commercial Ads",
        "High-End Color Grading & Sound Design",
        "Platform-Native Vertical Reels & Shorts",
        "Full Post-Production Editing & Motion Graphics",
      ],
    },
    {
      id: "ai-content",
      slug: "ai-content",
      icon: Cpu,
      number: "05",
      title: "AI-Implemented Content Solutions",
      shortDesc:
        "Leveraging generative AI workflows to produce scalable, high-volume copy, graphics, and automated assets.",
      fullDesc:
        "Scale content velocity without sacrificing brand quality. We build custom AI content engines that combine human editorial strategy with AI acceleration.",
      tags: ["Human Strategy", "AI Production", "GEO Optimization", "AI Search"],
      deliverables: [
        "Human-in-the-Loop AI Content Strategy",
        "Website Copywriting & High-Volume SEO Articles",
        "Generative Engine Optimization (GEO & AI Search)",
        "Automated Social Media & Newsletter Workflows",
        "Brand Voice Calibration & Prompt Frameworks",
        "Optimization for ChatGPT, Perplexity & AI Overviews",
      ],
    },
  ];

  return (
    <section id="services" className="py-14 relative bg-[#09090b]">
      {/* Glow background */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#7c93a3]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-[#7c93a3]" />
              Core Capabilities
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
              Services Tailored for <br />
              <span className="text-[#7c93a3]">Brand Authority</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              We don&apos;t offer bloated, generic agency menus. Every service is engineered to build authority, drive recall, and accelerate customer conversion.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2.5 rounded-md whitespace-nowrap self-start sm:self-auto transition-colors"
            >
              All Services
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7c93a3]" />
            </a>
          </div>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {services.map((service, index) => {
            const IconComp = service.icon;

            // Bento Grid Logic: Make the first item span 2 columns on large screens
            const isLargeCard = index === 0;
            const gridClass = isLargeCard ? "lg:col-span-2 md:col-span-2" : "col-span-1";

            return (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 100, damping: 20 }
                  }
                }}
                className={`glass-card glass-card-hover rounded-md p-6 md:p-8 border border-zinc-800/90 flex flex-col justify-between group relative overflow-hidden ${gridClass}`}
              >
                {/* Background Accent on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7c93a3]/0 to-[#7c93a3]/0 group-hover:from-[#7c93a3]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                {/* Number Badge & Icon */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#7c93a3] group-hover:bg-[#7c93a3] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(124,147,163,0.3)] transition-all duration-300 group-hover:scale-110">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-heading text-3xl font-bold text-zinc-800 group-hover:text-[#7c93a3]/20 transition-colors">
                        {service.number}
                      </span>
                    </div>

                    <a href={`/services/${service.slug}`} className="block">
                      <h3 className={`font-heading ${isLargeCard ? 'text-2xl md:text-3xl' : 'text-xl'} text-white font-bold uppercase tracking-wide mb-3 group-hover:text-[#7c93a3] transition-colors`}>
                        {service.title}
                      </h3>
                    </a>
                    <p className={`text-zinc-400 leading-relaxed mb-6 ${isLargeCard ? 'text-sm md:text-base max-w-xl' : 'text-xs'}`}>
                      {service.shortDesc}
                    </p>

                    {/* Capability Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 group-hover:border-zinc-700 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-semibold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 group-hover/btn:text-[#7c93a3] transition-colors" />
                      Quick Preview
                    </button>
                    <a
                      href={`/services/${service.slug}`}
                      className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 group-hover:text-[#7c93a3] transition-colors"
                    >
                      Details
                      <ArrowUpRight className="w-4 h-4 text-[#7c93a3] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card rounded-lg max-w-2xl w-full p-6 sm:p-8 border border-zinc-700 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#7c93a3]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[#7c93a3] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <span>Service Details</span>
              <span>•</span>
              <span>{selectedService.number}</span>
            </div>

            <h3 className="font-heading text-3xl text-white font-bold uppercase tracking-wide mb-3">
              {selectedService.title}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedService.fullDesc}
            </p>

            <div className="bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800 mb-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Key Deliverables &amp; Capabilities:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#7c93a3] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href={`/services/${selectedService.slug}`}
                onClick={() => setSelectedService(null)}
                className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white flex items-center gap-1"
              >
                View Full Service Page
                <ArrowUpRight className="w-3.5 h-3.5 text-[#7c93a3]" />
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-zinc-400 hover:text-white uppercase"
                >
                  Close
                </button>
                <a
                  href="/#hero-enquiry"
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2 rounded-md bg-[#7c93a3] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#7c93a3]/30 hover:bg-[#6a8292]"
                >
                  Inquire
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
