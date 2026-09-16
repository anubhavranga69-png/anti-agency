"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onOpenAudit }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { 
      name: "Services", 
      href: "#services",
      dropdown: [
        { name: "Website Design", href: "/services/website-design" },
        { name: "Branding", href: "/services/branding" },
        { name: "Social Media", href: "/services/social-media" },
        { name: "Video Production", href: "/services/video-production" },
        { name: "AI Content", href: "/services/ai-content" },
      ]
    },
    { name: "Global Reach", href: "#global" },
    { name: "Process", href: "#process" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header role="navigation" aria-label="Main navigation"
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${!showNavbar ? '-translate-y-full' : ''} ${
    scrolled
      ? "bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-800/60 py-3 shadow-2xl shadow-black/40"
      : "bg-transparent py-5"
  }`}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-[#E40101]/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(228,1,1,0.3)]">
            <Image src="/logo.svg" alt="Anti-Agency Logo" width={28} height={28} className="w-7 h-auto transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl tracking-wider text-white font-bold group-hover:text-[#E40101] transition-colors">
              ANTI<span className="text-[#E40101]">-AGENCY</span>
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-mono -mt-1">
              Brand Building Partner
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 rounded-full px-5 py-2 backdrop-blur-md">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <a
                href={link.href}
                className="inline-block relative text-xs font-medium uppercase tracking-wider text-zinc-300 hover:text-white px-4 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E40101] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#E40101] after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.name}
              </a>
              {link.dropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="w-56 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-xl shadow-black/50 overflow-hidden flex flex-col p-2">
                    {link.dropdown.map((sublink) => (
                      <a
                        key={sublink.name}
                        href={sublink.href}
                        className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800/80 px-4 py-3 rounded-xl transition-colors whitespace-nowrap"
                      >
                        {sublink.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 px-4 py-2.5 rounded-full transition-all hover:border-[#E40101]/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E40101]" />
            Brand Audit
          </button>
          <a
            href="#hero-enquiry"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] px-5 py-2.5 rounded-full shadow-lg shadow-[#E40101]/25 hover:shadow-[#E40101]/40 transition-all hover:-translate-y-0.5"
          >
            Start Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-2xl flex flex-col justify-between px-6 pt-24 pb-8 overflow-y-auto w-full"
          >
            <nav className="flex flex-col space-y-3 w-full">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="relative text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-[#E40101] py-2 border-b border-zinc-900 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#E40101] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E40101]"
                  >
                    {link.name}
                  </a>
                  {link.dropdown && (
                    <div className="flex flex-col pl-4 mt-2 space-y-2 border-l-2 border-zinc-800 ml-2">
                      {link.dropdown.map((sublink) => (
                        <a
                          key={sublink.name}
                          href={sublink.href}
                          onClick={handleLinkClick}
                          className="text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-[#E40101] py-1.5"
                        >
                          {sublink.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="pt-6 flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAudit();
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-900 border border-zinc-700 py-3 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E40101]" />
                Book Brand Audit
              </button>
              <a
                href="#hero-enquiry"
                onClick={handleLinkClick}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] py-3 rounded-xl shadow-lg shadow-[#E40101]/30"
              >
                Start Your Enquiry
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
