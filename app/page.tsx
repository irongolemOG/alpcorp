"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { IntroAnimation, HERO_REVEAL_MS } from "@/components/intro-animation"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { PixelIcon } from "@/components/pixel-icon"
import { RevealText } from "@/components/reveal-text"
import { BentoCard, Tag, handleMouse } from "@/components/ui-elements"
import Link from "next/link"

const WHY_STEPS = [
  { n: "01", title: "Consistent Performance", desc: "Every batch is tested for identical output. No surprises, no defects — consistent quality every time.", img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/define-5aafAmGBrxZpOqJ3XLHY3n3qzC2I5K.png" },
  { n: "02", title: "Built for Indian Conditions", desc: "Handles voltage fluctuations, abrasive materials, and the demands of Indian construction sites.", img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compose-5RT5VR4f1Y3GoFmovqTKLTG4UXp3g2.png" },
  { n: "03", title: "Dealer-Friendly Pricing", desc: "Transparent pricing structure with margins designed for long-term dealer profitability.", img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zm8guZwxJHtwWsJ7XO4B0CF7GzlNK8.png" },
  { n: "04", title: "Reliable Supply Chain", desc: "Stable inventory and fast dispatch within 48 hours. No stockouts, no delays, no excuses.", img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deploy-an8fgHSLzniojkcmRyGGIFQUJF9T5J.png" },
]

const PRODUCTS_PREVIEW = [
  { cat: "Diamond Saw Blades", name: 'Pro-Cut Diamond Blade 4"', best_for: "Marble, Granite, Ceramic" },
  { cat: "TCT Saw Blades", name: 'Woodmaster TCT Blade 4" 40T', best_for: "Softwood, Hardwood, Plywood" },
  { cat: "Cutting Discs", name: 'Metal Cutting Disc 4"', best_for: "Steel, Iron, Metal sheets" },
]

export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [countDone, setCountDone] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const handleIntroDone = useCallback(() => setHeroReady(true), [])

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setCountDone(true); observer.disconnect() }
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">
      <IntroAnimation onDone={handleIntroDone} />
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"
          style={{ transform: videoReady ? "scale(1.05)" : "scale(0.85)", transition: "transform 2s cubic-bezier(0.16,1,0.3,1)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="h-20" />
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-light text-[#111] leading-[1.0] tracking-tight mb-10"
            style={{ fontFamily: '"IBM Plex Sans", sans-serif', opacity: heroReady ? 1 : 0, filter: heroReady ? "blur(0px)" : "blur(24px)", transform: heroReady ? "translateY(0px)" : "translateY(32px)", transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms" }}>
            Industrial-Grade<br />Cutting Tools for<br />Professionals
          </h1>
          <div className="flex gap-8 sm:gap-12">
            {[{ value: "100%", label: "Tested" }, { value: "24/7", label: "Reliable Supply" }, { value: "PAN", label: "India Network" }].map((stat, i) => (
              <div key={i} style={{ opacity: heroReady ? 1 : 0, filter: heroReady ? "blur(0px)" : "blur(16px)", transform: heroReady ? "translateY(0px)" : "translateY(20px)", transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms` }}>
                <div className="text-3xl sm:text-4xl text-[#111] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 tracking-widest uppercase mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-12 px-6 md:px-12 lg:px-20 border-t border-b border-black/[0.06] bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "500+", l: "Dealers Served" },
            { v: "50+", l: "Product Categories" },
            { v: "120+", l: "Cities Reached" },
            { v: "24h", l: "Fast Dispatch" },
          ].map((s, i) => (
            <div key={s.l} className="text-center"
              style={{ opacity: countDone ? 1 : 0, transform: countDone ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms` }}>
              <div className="text-4xl font-light text-[#111]">{s.v}</div>
              <div className="text-xs text-black/40 tracking-widest mt-1.5">{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 border-b border-black/[0.06] animate-fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Tag>OUR RANGE</Tag>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Tools built for every\nindustrial application."}
              </RevealText>
            </div>
            <Link href="/products" className="shrink-0 text-sm text-black/40 hover:text-[#111] tracking-widest transition-colors self-start md:self-auto">
              VIEW ALL PRODUCTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" onMouseMove={handleMouse}>
            {PRODUCTS_PREVIEW.map((p, i) => (
              <BentoCard key={p.name} className="p-7 flex flex-col justify-between min-h-[180px]" delay={i * 80}>
                <div>
                  <div className="text-[10px] tracking-widest text-black/30 mb-3">{p.cat.toUpperCase()}</div>
                  <h3 className="text-lg font-light text-[#111] mb-2">{p.name}</h3>
                  <p className="text-xs text-black/40">{p.best_for}</p>
                </div>
                <Link href="/products" className="mt-6 inline-flex items-center gap-1 text-xs text-black/30 hover:text-black/60 tracking-widest transition-colors">
                  EXPLORE →
                </Link>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────── */}
      <section id="workflow" className="py-32 px-6 md:px-12 lg:px-20 border-b border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>WHY US</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Engineered for the job\nbuilt for performance."}
            </RevealText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {WHY_STEPS.map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={parseInt(step.n) * 60}>
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover object-top"
                    style={{ maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)" }} />
                </div>
                <div className="relative z-10 p-7">
                  <span className="font-pixel text-[11px] text-black/20 tracking-widest block">{step.n}</span>
                </div>
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALER STRIP ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#111] animate-fade-up">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="text-[11px] tracking-widest text-white/30 mb-3">DEALER NETWORK</div>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Grow your business with<br />Alpine Corporation.
            </h2>
            <p className="text-sm text-white/40 mt-4 max-w-md leading-relaxed">
              Join 500+ dealers across 120+ cities. Competitive margins, stable supply, and a dedicated support team.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link href="/dealer"
              className="px-8 py-3.5 bg-white text-[#111] text-sm rounded-xl hover:bg-white/90 transition-colors tracking-widest font-medium text-center">
              BECOME A DEALER
            </Link>
            <Link href="/products"
              className="px-8 py-3.5 border border-white/20 text-white text-sm rounded-xl hover:border-white/40 transition-colors tracking-widest text-center">
              VIEW PRODUCTS
            </Link>
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
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
