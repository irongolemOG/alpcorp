"use client"
import React from "react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { PixelIcon } from "@/components/pixel-icon"
import { RevealText } from "@/components/reveal-text"
import { BentoCard, Tag, handleMouse } from "@/components/ui-elements"
import Link from "next/link"

const STATS = [
  { v: "500+", l: "Dealers Served" },
  { v: "50+", l: "Product Categories" },
  { v: "120+", l: "Cities Reached" },
  { v: "24h", l: "Fast Dispatch" },
]

const WHY = [
  { n: "01", title: "Consistent Performance", desc: "Every batch tested for identical output", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { n: "02", title: "Built for Indian Conditions", desc: "Handles voltage fluctuations & harsh environments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { n: "03", title: "Dealer-Friendly Pricing", desc: "Margins designed for long-term partnerships", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { n: "04", title: "Reliable Supply Chain", desc: "Stable inventory and fast dispatch", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
]

export default function AboutPage() {
  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased flex flex-col">
      <MobileNav />
      <div className="h-24"></div>

      {/* ── HERO ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-b border-black/[0.06] animate-fade-up">
        <div className="max-w-6xl mx-auto">
          <PixelIcon type="platform" size={36} />
          <div className="mt-4"><Tag>ABOUT US</Tag></div>
          <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] max-w-3xl">
            {"Engineered for consistency\nand reliability."}
          </RevealText>
          <p className="mt-6 text-sm text-black/45 leading-relaxed max-w-2xl">
            Alpine Corporation delivers high-performance industrial cutting tools engineered for consistency and reliability. We focus on providing distributors and professionals with equipment that withstands rigorous daily operations without compromise.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 px-6 md:px-12 lg:px-20 bg-white border-b border-black/[0.06] animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-4xl font-light text-[#111]">{s.v}</div>
              <div className="text-xs text-black/40 tracking-widest mt-1.5">{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUILT FOR REALITY ── */}
      <section id="platform" className="py-20 px-6 md:px-12 lg:px-20 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-3" onMouseMove={handleMouse}>
            <BentoCard className="col-span-12 p-8 min-h-[220px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              <img src="/images/arc.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 70%" }} />
              <div className="absolute inset-0" style={{ maskImage: "linear-gradient(to bottom, transparent 45%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 100%)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 35%, rgba(245,244,240,0.3) 50%, rgba(245,244,240,0.75) 65%, rgba(245,244,240,0.95) 80%, rgb(245,244,240) 100%)" }} />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-white/60 flex items-center justify-center mb-6" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
                </div>
                <h2 className="text-2xl font-light mb-3">Built for Reality</h2>
                <p className="text-sm text-black/45 leading-relaxed max-w-xl">
                  Our tools are specifically manufactured to handle Indian industrial conditions — managing voltage fluctuations and harsh environments with ease. We prioritize consistent quality standards and a professional supply mindset to ensure our dealer network remains robust, supplied, and profitable.
                </p>
              </div>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={80}>
              <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center mb-5 text-black/40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Consistent Quality</h3>
              <p className="text-sm text-black/45 leading-relaxed">Every tool meets rigorous industrial standards for identical output. Batch-tested for dimensional accuracy, hardness, and longevity before dispatch.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={130}>
              <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center mb-5 text-black/40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Reliable Supply</h3>
              <p className="text-sm text-black/45 leading-relaxed">Stable inventory and fast dispatch to keep your operations moving. We maintain deep stock levels so your business never faces a stockout.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={180}>
              <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center mb-5 text-black/40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Dealer Partnership</h3>
              <p className="text-sm text-black/45 leading-relaxed">Built on mutual growth, transparency, and clear margins. A dedicated account manager for every authorized dealer. We succeed when you succeed.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── WHY ALPINE ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <Tag>WHY ALPINE CORPORATION?</Tag>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHY.map((w, i) => (
              <div key={w.n}
                className="flex items-start gap-5 bg-white rounded-2xl border border-black/[0.07] p-7 hover:border-black/[0.14] hover:shadow-sm transition-all duration-300"
                style={{ opacity: 0, animation: `fadeUp 0.5s ease ${i * 80}ms forwards` }}>
                <div className="shrink-0 w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-black/40">{w.icon}</div>
                <div>
                  <div className="text-[10px] tracking-widest text-black/25 mb-1">{w.n}</div>
                  <h3 className="text-base font-medium text-[#111] mb-1">{w.title}</h3>
                  <p className="text-sm text-black/40 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-2xl font-light text-[#111]">Ready to partner with Alpine?</h3>
            <p className="text-sm text-black/40 mt-2">Join our dealer network or explore our full product range.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/dealer" className="px-7 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest">BECOME A DEALER</Link>
            <Link href="/products" className="px-7 py-3 border border-black/10 text-black/60 text-sm rounded-xl hover:border-black/25 hover:text-[#111] transition-all tracking-widest">PRODUCTS</Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
