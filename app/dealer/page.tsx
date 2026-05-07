"use client"
import React, { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"

export default function DealerPage() {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fullMessage = [
      company ? `Company: ${company}` : null,
      phone ? `Phone: ${phone}` : null,
      city ? `City: ${city}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean).join(" | ")

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: fullMessage, type: "dealer" }),
    })
    const json = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(json.error ?? "Something went wrong. Please try again.")
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased flex flex-col">
      <MobileNav />
      <div className="h-24"></div>

      <section className="relative py-20 px-6 md:px-12 lg:px-20 overflow-hidden flex-1 animate-fade-up">
        <img src="/images/footer.png" alt="" aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none" style={{ opacity: 0.85 }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ maskImage: "linear-gradient(to top, transparent 0%, black 55%)", WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — pitch */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-black/40 bg-black/[0.04] mb-6">DEALER PROGRAMME</div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.08] mb-6">
                Partner with<br />Alpine Corporation
              </h1>
              <p className="text-sm text-black/45 leading-relaxed mb-10">
                Join our growing network of authorized dealers and distributors across India. We supply industrial-grade cutting tools with consistent quality, stable pricing, and dedicated dealer support.
              </p>
              <div className="space-y-5">
                {[
                  { icon: "📦", title: "Stable Inventory", desc: "Deep stock maintained at all times. Your orders fulfilled within 48 hours, across India." },
                  { icon: "💰", title: "Clear Dealer Margins", desc: "Transparent pricing structure — competitive margins designed for long-term profitability." },
                  { icon: "🚚", title: "Fast Dispatch", desc: "Orders dispatched within 48 hours to all major cities and tier-2 markets." },
                  { icon: "🤝", title: "Dedicated Support", desc: "Every authorized dealer gets a dedicated account manager for queries and re-orders." },
                ].map(b => (
                  <div key={b.title} className="flex items-start gap-4">
                    <span className="text-xl shrink-0 mt-0.5">{b.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-[#111]">{b.title}</div>
                      <div className="text-xs text-black/40 leading-relaxed mt-0.5">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-white rounded-2xl border border-black/[0.07] p-8 shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-lg font-light text-[#111] mb-1">Apply to become a dealer</h2>
                  <p className="text-xs text-black/35 mb-2">Fill in your details and our team will reach out within 48 hours.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">YOUR NAME *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full name"
                        className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">COMPANY NAME</label>
                      <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Business / Company"
                        className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">EMAIL ADDRESS *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Business email"
                      className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">PHONE NUMBER</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                        className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">CITY / STATE</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai, MH"
                        className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-widest text-black/30 mb-1.5">YOUR MESSAGE</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                      placeholder="Tell us about your business, what products you're interested in, or any questions…"
                      className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors resize-none" />
                  </div>

                  {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium disabled:opacity-40 mt-1">
                    {loading ? "SUBMITTING…" : "SUBMIT APPLICATION"}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm text-[#111] font-light">Application received!</p>
                  <p className="text-xs text-black/40 text-center">Our sales team will contact you within 48 hours.</p>
                </div>
              )}
            </div>
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
