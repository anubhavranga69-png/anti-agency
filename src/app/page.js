"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Philosophy from "@/components/Philosophy";
import Services from "@/components/Services";
import GlobalReach from "@/components/GlobalReach";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import BrandAuditModal from "@/components/BrandAuditModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar onOpenAudit={() => setAuditModalOpen(true)} />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenAudit={() => setAuditModalOpen(true)} />

        {/* Infinite Marquee Ticker */}
        <Ticker />

        {/* Core Philosophy ("3-4 Clients Per Quarter") */}
        <Philosophy />

        {/* 6 Core Services Ecosystem */}
        <Services onOpenAudit={() => setAuditModalOpen(true)} />

        {/* Global Reach (US, UK, India, Aus, Dubai) */}
        <GlobalReach />

        {/* Why Choose Anti-Agency */}
        <WhyChooseUs />

        {/* 4-Step Process Timeline */}
        <Process />
      </main>

      {/* Footer */}
      <Footer onOpenAudit={() => setAuditModalOpen(true)} />

      {/* Interactive Brand Audit Modal */}
      <BrandAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />
    </div>
  );
}
