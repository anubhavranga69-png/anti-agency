"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageNavbar() {
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
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        !showNavbar ? "-translate-y-full" : ""
      } ${
        scrolled
          ? "bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-800/60 py-3 shadow-2xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
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

        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 rounded-full px-5 py-2 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-xs font-medium uppercase tracking-wider text-zinc-300 hover:text-white px-4 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E40101] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#E40101] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/#hero-enquiry"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] px-5 py-2.5 rounded-full shadow-lg shadow-[#E40101]/25 hover:shadow-[#E40101]/40 transition-all hover:-translate-y-0.5"
          >
            Start Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-zinc-900/90 backdrop-blur-2xl flex flex-col items-center justify-center px-6 py-6 space-y-4"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="relative text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-[#E40101] py-2 border-b border-zinc-900"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <a
              href="/#hero-enquiry"
              onClick={handleLinkClick}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] py-3 rounded-xl shadow-lg shadow-[#E40101]/30"
            >
              Start Your Project
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
