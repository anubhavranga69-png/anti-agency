import { notFound } from "next/navigation";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";
import { servicesData } from "@/data/servicesData";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
  Globe2,
  ShieldCheck,
  ChevronRight,
  Send,
} from "lucide-react";

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) return {};
  return {
    title: `${service.title} | Anti-Agency`,
    description: service.heroDescription,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      <PageNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* ── Breadcrumbs ── */}
        <section className="pt-8 pb-4 border-b border-zinc-800/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <a href="/services" className="hover:text-white transition-colors">
                Services
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-[#E40101]" />
              <span className="text-zinc-200 truncate">{service.title}</span>
            </nav>
          </div>
        </section>

        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#E40101]/10 rounded-full blur-[170px]" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#E40101] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 fill-[#E40101]" />
                {service.tagline || "Service"} • {service.number}
              </div>

              <div className="flex flex-wrap gap-2">
                {service.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-white font-bold uppercase tracking-tight leading-[1.05] mb-6">
              {service.headingSplit ? (
                <>
                  {service.headingSplit[0]}{" "}
                  <span className="text-[#E40101]">{service.headingSplit[1]}</span>
                </>
              ) : (
                service.title
              )}
            </h1>

            <p className="font-heading text-xl sm:text-2xl text-zinc-300 font-bold uppercase tracking-wide mb-4">
              {service.subtitle}
            </p>

            <p className="text-zinc-400 text-sm sm:text-base max-w-3xl leading-relaxed mb-10">
              {service.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/#hero-enquiry"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] px-7 py-3.5 rounded-full shadow-xl shadow-[#E40101]/30 hover:shadow-[#E40101]/50 transition-all hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#what-we-do"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-6 py-3.5 rounded-full transition-all"
              >
                Explore Capabilities
              </a>
            </div>
          </div>
        </section>

        {/* ── Why It Matters ── */}
        {service.whyItMatters && (
          <section className="py-16 border-t border-zinc-800/60 bg-zinc-950/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.whyItMattersSub || "Why It Matters"}
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold uppercase tracking-tight">
                  {service.whyItMattersHeading}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.whyItMatters.map((point, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-5 border border-zinc-800/80 flex items-start gap-3.5 group hover:border-[#E40101]/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E40101]/10 border border-[#E40101]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#E40101]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-snug">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── AI Approach Section (For AI Content) ── */}
        {service.approachSection && (
          <section className="py-16 border-t border-zinc-800/60 bg-gradient-to-b from-transparent to-zinc-950/70">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.approachSection.sub}
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold uppercase tracking-tight">
                  {service.approachSection.title}
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start mb-10">
                <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <p className="text-zinc-100 font-medium">
                    {service.approachSection.leadParagraph}
                  </p>
                  <p className="text-zinc-400">
                    {service.approachSection.bodyParagraph1}
                  </p>
                  <p className="text-zinc-400">
                    {service.approachSection.bodyParagraph2}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {service.approachSection.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-2xl p-5 border border-zinc-800"
                    >
                      <div className="text-[10px] font-mono text-[#E40101] uppercase tracking-widest mb-1.5">
                        Pillar 0{idx + 1}
                      </div>
                      <h3 className="font-heading text-base text-white font-bold uppercase tracking-wide mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── What We Do / Sub-Services Grid ── */}
        <section id="what-we-do" className="py-16 border-t border-zinc-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                {service.whatWeDoSub || "What We Do"}
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                {service.whatWeDoHeading || "OUR SERVICES"}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {service.subServices?.map((sub, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 border border-zinc-800/90 flex flex-col justify-between group hover:border-[#E40101]/40 transition-colors relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg text-[#E40101] font-mono font-bold">
                        {sub.icon}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg text-white font-bold uppercase tracking-wide mb-3 group-hover:text-[#E40101] transition-colors">
                      {sub.title}
                    </h3>

                    {sub.desc && (
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {sub.desc}
                      </p>
                    )}

                    {sub.forText && (
                      <div className="text-[11px] font-mono text-[#E40101] font-semibold mb-2">
                        {sub.forText}
                      </div>
                    )}

                    {sub.items && (
                      <ul className="space-y-2 mb-4">
                        {sub.items.map((item, iIdx) => (
                          <li
                            key={iIdx}
                            className="flex items-start gap-2 text-xs text-zinc-300"
                          >
                            <span className="text-[#E40101] font-bold">›</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Delivered with Precision</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E40101]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Capability (Branding Packaging) ── */}
        {service.featuredCapability && (
          <section className="py-16 border-t border-zinc-800/60 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-card rounded-3xl p-8 sm:p-12 border border-zinc-700/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E40101]/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <div className="text-xs font-mono text-[#E40101] uppercase tracking-widest mb-3">
                    {service.featuredCapability.sub}
                  </div>
                  <h3 className="font-heading text-2xl sm:text-4xl text-white font-bold uppercase tracking-tight mb-4">
                    {service.featuredCapability.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                    {service.featuredCapability.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.featuredCapability.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Where We Operate (Platforms for Social Media) ── */}
        {service.platformsSection && (
          <section className="py-16 border-t border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.platformsSection.sub}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.platformsSection.title}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {service.platformsSection.platforms.map((plat, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-6 border border-zinc-800 hover:border-[#E40101]/40 transition-colors"
                  >
                    <div className="font-heading text-xl text-white font-bold uppercase tracking-wide mb-2 text-[#E40101]">
                      {plat.name}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{plat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Video Types (For Video Production) ── */}
        {service.videoFormatsSection && (
          <section className="py-16 border-t border-zinc-800/60 bg-zinc-950/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.videoFormatsSection.sub}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.videoFormatsSection.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {service.videoFormatsSection.formats.map((fmt, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#E40101]/50 text-xs font-mono text-zinc-300 transition-colors"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GEO Section (For AI Content) ── */}
        {service.geoSection && (
          <section className="py-16 border-t border-zinc-800/60 bg-zinc-950/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-card rounded-3xl p-8 sm:p-12 border border-zinc-800 relative">
                <div className="text-xs font-mono text-[#E40101] uppercase tracking-widest mb-3">
                  {service.geoSection.sub}
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight mb-4">
                  {service.geoSection.title}
                </h3>
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line mb-8 max-w-3xl">
                  {service.geoSection.desc}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {service.geoSection.tools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"
                    >
                      <div className="font-heading text-base text-white font-bold tracking-wide">
                        {tool.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#E40101] uppercase mt-0.5">
                        {tool.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How We Work / Our Process ── */}
        {service.process && (
          <section className="py-16 border-t border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.processSub || "How We Work"}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.processHeading || "OUR PROCESS"}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {service.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-6 border border-zinc-800 relative group hover:border-[#E40101]/40 transition-colors"
                  >
                    <div className="text-3xl font-heading font-bold text-[#E40101] mb-3">
                      {step.step}
                    </div>
                    <h3 className="font-heading text-lg text-white font-bold uppercase tracking-wide mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why Choose Anti-Agency ── */}
        {service.whyUs && (
          <section className="py-16 border-t border-zinc-800/60 bg-zinc-950/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.whyUsSub || "Why Us"}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.whyUsHeading || "WHY CHOOSE ANTI-AGENCY"}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {service.whyUs.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-2xl p-6 border border-zinc-800"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E40101] mb-4">
                      <Sparkles className="w-4 h-4 fill-[#E40101]" />
                    </div>
                    <h3 className="font-heading text-base text-white font-bold uppercase tracking-wide mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Industries We Serve ── */}
        {service.industries && (
          <section className="py-16 border-t border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.industriesSub || "Who We Serve"}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.industriesHeading || "INDUSTRIES"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {service.industries.map((ind, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-[#E40101]/40 transition-colors"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ Accordion ── */}
        {service.faqs && (
          <section className="py-16 border-t border-zinc-800/60 bg-zinc-950/40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  {service.faqsSub || "Questions"}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                  {service.faqsHeading || "FREQUENTLY ASKED QUESTIONS"}
                </h2>
              </div>

              <ServiceFaqAccordion faqs={service.faqs} />
            </div>
          </section>
        )}

        {/* ── Related Services ── */}
        {service.relatedServices && (
          <section className="py-16 border-t border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#E40101] uppercase tracking-widest mb-2">
                  Explore More
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold uppercase tracking-tight">
                  RELATED SERVICES
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {service.relatedServices.map((rel, idx) => (
                  <a
                    key={idx}
                    href={`/services/${rel.slug}`}
                    className="glass-card glass-card-hover rounded-2xl p-4 border border-zinc-800 group flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-[#E40101] transition-colors">
                      {rel.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#E40101] transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Final Conversion CTA ── */}
        <section className="py-20 border-t border-zinc-800/60 relative overflow-hidden bg-gradient-to-b from-transparent to-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E40101]/10 rounded-full blur-[180px] pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="text-xs font-mono text-[#E40101] uppercase tracking-widest mb-3">
              Let&apos;s Build Together
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl text-white font-bold uppercase tracking-tight leading-tight mb-4">
              {service.ctaHeadline}
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
              {service.ctaSub}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/#hero-enquiry"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E40101] hover:bg-[#ff1a1a] px-8 py-3.5 rounded-full shadow-xl shadow-[#E40101]/30 hover:shadow-[#E40101]/50 transition-all hover:-translate-y-0.5"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-6 py-3.5 rounded-full transition-all"
              >
                All Services
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
