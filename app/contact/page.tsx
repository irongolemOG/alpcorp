"use client"
import React, { useState } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { PixelIcon } from "@/components/pixel-icon"
import { RevealText } from "@/components/reveal-text"
import { BentoCard, Tag } from "@/components/ui-elements"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, type: "contact" }),
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

      {/* Hero */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-b border-black/[0.06] animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-start">
            <PixelIcon type="integrations" size={36} />
            <div className="mt-4"><Tag>CONTACT US</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Get in touch with\nAlpine Corporation."}
            </RevealText>
            <p className="mt-4 text-sm text-black/45 leading-relaxed max-w-lg">
              Whether you're a contractor, fabricator, or retailer — we're here to answer your questions about our industrial cutting tools, dealer partnerships, and bulk pricing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 lg:px-20 flex-1 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="max-w-5xl mx-auto w-full">

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <BentoCard className="p-7 text-center flex flex-col items-center" delay={0}>
              <div className="w-11 h-11 rounded-xl border border-black/[0.08] flex items-center justify-center mb-4 text-black/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-sm font-medium text-[#111] mb-1">Office Address</h3>
              <p className="text-xs text-black/45 leading-relaxed text-center">
                123 Industrial Estate<br />Phase 1, Mumbai, India
              </p>
            </BentoCard>

            <BentoCard className="p-7 text-center flex flex-col items-center" delay={80}>
              <div className="w-11 h-11 rounded-xl border border-black/[0.08] flex items-center justify-center mb-4 text-black/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 className="text-sm font-medium text-[#111] mb-1">Phone</h3>
              <p className="text-xs text-black/45">+91 98765 43210</p>
              <p className="text-[11px] text-black/30 mt-1">Mon–Sat, 9 AM – 6 PM IST</p>
            </BentoCard>

            <BentoCard className="p-7 text-center flex flex-col items-center" delay={140}>
              <div className="w-11 h-11 rounded-xl border border-black/[0.08] flex items-center justify-center mb-4 text-black/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3 className="text-sm font-medium text-[#111] mb-1">Email</h3>
              <p className="text-xs text-black/45">sales@alpinecorp.com</p>
              <p className="text-[11px] text-black/30 mt-1">Reply within 24 hours</p>
            </BentoCard>
          </div>

          {/* Two-col layout: form + info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Form */}
            <div className="lg:col-span-3">
              <BentoCard className="p-8" delay={180}>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h3 className="text-lg font-light text-[#111] mb-1">Send us a message</h3>
                    <p className="text-xs text-black/35 mb-2">We respond to every inquiry within one business day.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] tracking-widest text-black/35 mb-1.5">YOUR NAME</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-widest text-black/35 mb-1.5">EMAIL ADDRESS</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                          placeholder="you@company.com"
                          className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-widest text-black/35 mb-1.5">MESSAGE</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                        placeholder="Tell us what you're looking for — product type, quantity, or any questions…"
                        className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors resize-none" />
                    </div>

                    {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}

                    <button type="submit" disabled={loading}
                      className="self-start px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium disabled:opacity-40">
                      {loading ? "SENDING…" : "SEND MESSAGE"}
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-sm text-[#111] font-light">Message sent successfully!</p>
                    <p className="text-xs text-black/40">Our team will get back to you within 24 hours.</p>
                  </div>
                )}
              </BentoCard>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-4">
              <BentoCard className="p-7" delay={220}>
                <h3 className="text-sm font-medium text-[#111] mb-3">Business Hours</h3>
                <div className="space-y-2">
                  {[
                    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                    { day: "Saturday", time: "9:00 AM – 2:00 PM" },
                    { day: "Sunday", time: "Closed" },
                  ].map(r => (
                    <div key={r.day} className="flex justify-between text-xs">
                      <span className="text-black/45">{r.day}</span>
                      <span className="text-[#111] font-light">{r.time}</span>
                    </div>
                  ))}
                </div>
              </BentoCard>

              <BentoCard className="p-7" delay={260}>
                <h3 className="text-sm font-medium text-[#111] mb-3">Looking to become a dealer?</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">
                  Join our growing dealer network across India. We offer competitive margins, stable supply, and dedicated partner support.
                </p>
                <a href="/dealer" className="inline-flex items-center gap-2 text-xs text-[#111] border border-black/10 rounded-xl px-4 py-2.5 hover:border-black/25 hover:bg-black/[0.03] transition-all tracking-widest">
                  BECOME A DEALER →
                </a>
              </BentoCard>
            </div>
          </div>
        </div>
      </section>

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
      <Footer />
    </div>
  )
}
