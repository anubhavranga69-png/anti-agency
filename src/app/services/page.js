import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { servicesData } from "@/data/servicesData";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Services | Anti-Agency — Brand Building, Web Design & Digital Agency",
  description:
    "From custom Next.js websites and bespoke branding to social media, video production, and AI-implemented content — full end-to-end brand building services.",
};

export default function ServicesPage() {
  const serviceList = Object.values(servicesData);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      <PageNavbar />

      <main className="flex-1 pt-28 pb-20">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#8FA394]/5 rounded-md blur-[140px]" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#8FA394] uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 fill-[#8FA394]" />
              What We Do
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white font-bold uppercase tracking-tight leading-tight mb-5">
              Full-Spectrum{" "}
              <span className="text-[#8FA394]">Brand Building</span>
              <br />
              Under One Roof
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              From custom web applications and bespoke brand identity to social media, video production, and AI-implemented content — every service is integrated and built for one outcome: making your brand impossible to ignore.
            </p>
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="py-10 border-t border-zinc-800/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceList.map((service) => {
                const Icon = service.icon;
                return (
                  <a
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="glass-card glass-card-hover group rounded-md p-6 border border-zinc-800/90 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-[#8FA394]/50 hover:bg-[#121412] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#8FA394] group-hover:bg-[#8FA394] group-hover:text-[#050505] transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-heading text-2xl font-bold text-zinc-700 group-hover:text-[#8FA394] transition-colors">
                          {service.number}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-[#8FA394] uppercase tracking-widest mb-1">
                        {service.tagline || "Service"}
                      </div>

                      <h2 className="font-heading text-xl text-white font-bold uppercase tracking-wide mb-2 group-hover:text-[#8FA394] transition-colors">
                        {service.title}
                      </h2>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {service.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {service.tags?.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 group-hover:text-[#8FA394] transition-colors">
                        Explore Full Service
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#8FA394] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Strip ── */}
        <section className="py-20 border-t border-zinc-800/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight leading-tight mb-4">
              Ready to Build Something{" "}
              <span className="text-[#8FA394]">Remarkable?</span>
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
              We work with only 3–4 clients per quarter. If you&apos;re serious about building a brand that leads its category, let&apos;s talk.
            </p>
            <a
              href="/#hero-enquiry"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#050505] bg-[#8FA394] hover:bg-[#AAB8AD] px-8 py-3.5 rounded-md shadow-xl shadow-[#8FA394]/20 hover:shadow-[#8FA394]/30 transition-all hover:-translate-y-0.5"
            >
              Start the Conversation
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
