"use client";

import Image from "next/image";
import { Mail, Phone, Globe, ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer({ onOpenAudit }) {
  return (
    <footer
      id="contact"
      className="relative bg-[#09090b] text-zinc-400 border-t border-zinc-800/80 pt-10 pb-6 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E40101]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top CTA Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-800 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E40101] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-[#E40101]" />
              Limited Availability • 3-4 Clients / Quarter
            </div>
            <h3 className="font-heading text-xl sm:text-2xl text-white font-bold uppercase tracking-tight">
              Ready to Stop Being an Ordinary Brand?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2">
              Let's build a brand identity and web presence that commands authority across global markets.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenAudit}
              className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider border border-zinc-700/80 transition-all text-center cursor-pointer"
            >
              Book Brand Audit
            </button>
            <a
              href="#hero-enquiry"
              className="px-5 py-2.5 rounded-full bg-[#E40101] hover:bg-[#ff1a1a] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E40101]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Enquiry
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-zinc-800/80">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101]">
                <Image src="/logo.svg" alt="Anti-Agency Logo" width={28} height={28} className="w-7 h-auto" />
              </div>
              <span className="font-heading text-2xl tracking-wider text-white font-bold">
                ANTI<span className="text-[#E40101]">-AGENCY</span>
              </span>
            </a>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Global brand-building partner engineering distinctive brand identities and custom digital platforms for ambitious companies worldwide.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/antiagency.in?stkn=dWJyNXZlc3V1N2dp"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E40101] transition-colors"
              >
                {/* Instagram SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/antiiagency/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E40101] transition-colors"
              >
                {/* LinkedIn SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-lg text-white font-bold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-white transition-colors">Services &amp; Capabilities</a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-white transition-colors">Our Philosophy (3-4 Clients)</a>
              </li>
              <li>
                <a href="#global" className="hover:text-white transition-colors">Global Reach &amp; Regions</a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">Execution Process</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">Journal / Insights</a>
              </li>
              <li>
                <button onClick={onOpenAudit} className="hover:text-[#E40101] transition-colors text-left">
                  Instant Brand Health Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-lg text-white font-bold uppercase tracking-wider">Direct Contact</h4>
            <div className="space-y-3 text-xs">
              <a href="mailto:hello@anti-agency.in" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E40101] transition-colors group">
                <Mail className="w-4 h-4 text-[#E40101]" />
                <span className="text-zinc-200 group-hover:text-white font-mono">hello@anti-agency.in</span>
              </a>

              <a href="tel:+919599557064" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E40101] transition-colors group">
                <Phone className="w-4 h-4 text-[#E40101]" />
                <span className="text-zinc-200 group-hover:text-white font-mono">+91 9599557064</span>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400">
                <Globe className="w-4 h-4 text-[#E40101]" />
                <span>Global Hubs: USA • UK • India • Aus • UAE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <div>© {new Date().getFullYear()} Anti-Agency. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Brand Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
