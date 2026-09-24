import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Globe, CheckCircle2 } from "lucide-react";


export const metadata = {
  title: "About | Anti-Agency — Brand Building Partner",
  description:
    "We intentionally work with only 3–4 clients per quarter so every brand gets the focused attention, strategic thinking, and creative execution it deserves.",
};

const services = [
  "Website Design & Development",
  "Branding & Visual Identity",
  "Packaging Design",
  "Social Media Management & Marketing",
  "Video Production",
  "AI-Enhanced Content Creation",
  "SEO & GEO Optimization",
];

const regions = ["India", "United States", "United Kingdom", "Australia", "UAE"];

const whySmall = [
  {
    title: "We go deeper.",
    body: "With fewer brands to manage, we spend more time understanding your business, your customers, your competitors, and the opportunities in your market.",
  },
  {
    title: "Every project gets dedicated attention.",
    body: "Whether we're building a brand identity, designing a website, producing content, or planning campaigns, your work isn't squeezed between dozens of other accounts.",
  },
  {
    title: "Enterprise-level thinking for growing businesses.",
    body: "The same strategic approach often reserved for large brands is applied to startups, founders, and growing companies that want to build something lasting.",
  },
  {
    title: "We're accountable.",
    body: "When you only work with a handful of clients, every relationship matters. Your success isn't just another metric — it's part of our reputation.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-[#E40101] selection:text-white">
      <PageNavbar />

      <main className="flex-1 pt-28 pb-20">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#8FA394]/5 rounded-md blur-[160px]" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#8FA394] uppercase tracking-wider mb-6">
              About Anti-Agency
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white font-bold uppercase tracking-tight leading-tight mb-6">
              We Don&apos;t Just Market{" "}
              <span className="text-[#8FA394]">Brands.</span>
              <br />
              We Help Build Them.
            </h1>
            <div className="max-w-3xl space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
              <p>
                Most agencies are designed to grow by taking on more clients, running more campaigns, and managing bigger portfolios. There&apos;s nothing inherently wrong with that — but it wasn&apos;t the kind of agency we wanted to build.
              </p>
              <p>
                Anti-Agency was created with a different philosophy. We intentionally work with only{" "}
                <span className="text-white font-semibold">3–4 clients each quarter</span> so every brand gets the attention, strategic thinking, and creative focus it deserves. We&apos;d rather do exceptional work for a few businesses than average work for dozens.
              </p>
              <p className="text-zinc-400 italic border-l-2 border-[#8FA394] pl-4">
                That&apos;s the idea Anti-Agency was built on, and it&apos;s still how we operate today.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why We Started ── */}
        <section className="py-16 border-t border-zinc-800/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#8FA394] uppercase tracking-wider mb-4">
                  Why We Started
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight leading-tight mb-5">
                  Built Around <span className="text-[#8FA394]">Focus,</span> Not Volume
                </h2>
                <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                  <p>
                    Before starting Anti-Agency, our founder spent years working in the marketing industry, collaborating with agencies and brands across different markets.
                  </p>
                  <p>
                    One thing became clear: most agencies were focused on volume. As client lists grew, attention became divided. Teams were stretched across dozens of accounts, and every brand received only a small share of the agency&apos;s time. The work wasn&apos;t necessarily poor — it just lacked depth.
                  </p>
                  <p>
                    Strong branding takes time. It requires research, thoughtful strategy, creative exploration, and consistent execution. Those things become difficult when one team is juggling dozens of clients at once.
                  </p>
                  <p>
                    Earlier in his career, our founder had the opportunity to work alongside several well-known brands and saw what focused, high-quality brand building actually looked like. The difference wasn&apos;t just talent — it was <span className="text-white font-semibold">attention</span>. Those brands had dedicated teams, clear strategy, and the time needed to get things right.
                  </p>
                  <p className="text-zinc-400 italic border-l-2 border-[#8FA394] pl-4">
                    Instead of building an agency around scale, we built one around focus.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-card rounded-md p-6 border border-zinc-800">
                  <h3 className="font-heading text-lg text-white font-bold uppercase tracking-wide mb-3">
                    The Name
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    The name reflects that mindset. We&apos;re not against agencies — we&apos;re against the idea that growth has to come at the expense of quality. Anti-Agency is a different way of working, not just a different name.
                  </p>
                </div>
                <div className="glass-card rounded-md p-6 border border-zinc-800">
                  <h3 className="font-heading text-lg text-white font-bold uppercase tracking-wide mb-3">
                    The Founder&apos;s Journey
                  </h3>
                  <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                    <p>
                      Our founder didn&apos;t begin in marketing or business. His career started in design — simply because that was where the opportunity was. Over time, design led to branding, branding led to strategy, and strategy eventually led to building an agency.
                    </p>
                    <p>
                      Running an agency meant learning everything from client relationships and operations to hiring, systems, and business development through real experience. Every project brought new lessons. Every client helped refine the process.
                    </p>
                    <p className="text-zinc-400 text-xs italic">
                      We don&apos;t claim to know everything, and we don&apos;t rely on buzzwords or trends. What we offer is practical experience, continuous learning, and a genuine commitment to helping brands grow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Only 3–4 Clients ── */}
        <section className="py-16 border-t border-zinc-800/60 bg-[#050505]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#8FA394] uppercase tracking-wider mb-4">
                Our Model
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight leading-tight">
                Why We Only Work With{" "}
                <span className="text-[#8FA394]">3–4 Clients Per Quarter</span>
              </h2>
              <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto">
                Keeping our client roster intentionally small isn&apos;t a limitation — it&apos;s one of our biggest strengths.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {whySmall.map((item, i) => (
                <div
                  key={i}
                  className="glass-card glass-card-hover rounded-md p-6 border border-zinc-800"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8FA394] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What We Do ── */}
        <section className="py-16 border-t border-zinc-800/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#8FA394] uppercase tracking-wider mb-4">
                  What We Do
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight leading-tight mb-4">
                  End-to-End <span className="text-[#8FA394]">Brand Building</span>
                </h2>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  We provide end-to-end brand-building and digital marketing services. Everything we do is built around one goal: helping businesses build stronger brands that grow consistently over time.
                </p>
                <ul className="space-y-2">
                  {services.map((s, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-200">
                      <span className="w-1.5 h-1.5 rounded-sm bg-[#8FA394] shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#8FA394] hover:bg-[#AAB8AD] px-5 py-2.5 rounded-md shadow-lg shadow-[#8FA394]/20 transition-all hover:-translate-y-0.5"
                >
                  View All Services
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="glass-card rounded-md p-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-5 h-5 text-[#8FA394]" />
                  <h3 className="font-heading text-lg text-white font-bold uppercase tracking-wide">
                    Where We Work
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                  We work with businesses across multiple markets. No matter where our clients are based, our approach stays the same: fewer clients, more focus, and work built around long-term growth.
                </p>
                <div className="flex flex-wrap gap-2">
                  {regions.map((r) => (
                    <span
                      key={r}
                      className="px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:border-[#8FA394]/50 transition-colors"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 border-t border-zinc-800/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#8FA394] uppercase tracking-wider mb-5">
              Looking Forward
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight leading-tight mb-4">
              Working With You
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-3">
              We&apos;re not trying to become the biggest agency. We&apos;re building the kind of agency clients recommend because they felt heard, supported, and genuinely cared for throughout the process.
            </p>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
              What won&apos;t change is the principle behind everything we do:{" "}
              <span className="text-white font-semibold">depth over volume, always.</span>
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
