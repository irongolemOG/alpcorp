"use client"
import React, { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import Link from "next/link"

const FALLBACK_PRODUCTS = [
  { id: "f1", cat: "Diamond Saw Blades", name: 'Pro-Cut Diamond Blade 4"', best_for: "Marble, Granite, Ceramic Tiles", mrp: "₹450", features: ["Premium diamond segments","Laser-welded"], specs: {"Size":"4 inch","Bore":"20mm"} },
  { id: "f2", cat: "Diamond Saw Blades", name: 'Heavy Duty Diamond Blade 5"', best_for: "Concrete, Hard Bricks, Pavers", mrp: "₹650", features: ["Heavy-duty segments","Reinforced core"], specs: {"Size":"5 inch","Bore":"22.23mm"} },
  { id: "f3", cat: "TCT Saw Blades", name: 'Woodmaster TCT Blade 4" 40T', best_for: "Softwood, Hardwood, Plywood", mrp: "₹320", features: ["40 TCT teeth","Anti-corrosion"], specs: {"Size":"4 inch","Teeth":"40T"} },
  { id: "f4", cat: "TCT Saw Blades", name: 'Alu-Cut TCT Blade 10" 100T', best_for: "Aluminum profiles, Non-ferrous metals", mrp: "₹2,100", features: ["100 TCT teeth","Burr-free cuts"], specs: {"Size":"10 inch","Teeth":"100T"} },
  { id: "f5", cat: "Cutting Discs", name: 'Metal Cutting Disc 4"', best_for: "Steel, Iron, Metal sheets", mrp: "₹35", features: ["Aluminium oxide","Double reinforced"], specs: {"Size":"4 inch","Thickness":"1mm"} },
  { id: "f6", cat: "Cutting Discs", name: 'Inox Pro Cutting Disc 5"', best_for: "Stainless Steel (Inox), Cast Iron", mrp: "₹65", features: ["Special abrasive mix","Iron-free"], specs: {"Size":"5 inch","Thickness":"1.2mm"} },
]

export default function ProductSpecPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function load() {
      // 1. Try DB
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(name)")
        .eq("id", id)
        .single()
      
      if (data) {
        setProduct(data)
        setLoading(false)
        return
      }

      // 2. Try Fallback
      const fallback = FALLBACK_PRODUCTS.find(p => p.id === id)
      if (fallback) {
        setProduct({
          ...fallback,
          specifications: fallback.specs,
          category: { name: fallback.cat }
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="bg-[#F5F4F0] min-h-screen flex items-center justify-center">
        <div className="text-sm text-black/30 tracking-widest animate-pulse">LOADING SPECIFICATIONS…</div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  const features: string[] = Array.isArray(product.features) ? product.features : []
  const specs: Record<string, string> = typeof product.specifications === "object" && product.specifications !== null
    ? product.specifications as Record<string, string>
    : {}

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased flex flex-col">
      <MobileNav />
      <div className="h-24"></div>

      {/* Breadcrumb */}
      <div className="px-6 md:px-12 lg:px-20 pt-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-black/35">
          <Link href="/products" className="hover:text-black/60 transition-colors">Products</Link>
          <span>/</span>
          {product.category && <span className="text-black/45">{product.category.name}</span>}
          <span>/</span>
          <span className="text-black/55">{product.name}</span>
        </div>
      </div>

      <main className="flex-1 py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-up">
            <div className="rounded-2xl overflow-hidden border border-black/[0.07] bg-white aspect-square flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-black/20">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <span className="text-xs tracking-widest">No image available</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              {product.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-black/40 bg-black/[0.04] self-start mb-4">
                  {product.category.name}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-light text-[#111] leading-tight mb-4">{product.name}</h1>

              {product.best_for && (
                <div className="bg-white rounded-xl border border-black/[0.07] px-5 py-4 mb-4">
                  <div className="text-[10px] tracking-widest text-black/30 mb-1.5">BEST FOR</div>
                  <div className="text-sm text-black/65 leading-relaxed">{product.best_for}</div>
                </div>
              )}

              {product.mrp && (
                <div className="mb-6">
                  <div className="text-[10px] tracking-widest text-black/30 mb-1">MRP</div>
                  <div className="text-3xl font-light text-[#111]">{product.mrp}</div>
                  <div className="text-[11px] text-black/30 mt-1">Inclusive of all taxes. Contact for bulk pricing.</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact"
                  className="flex-1 text-center py-3.5 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium">
                  FIND A DEALER / INQUIRY
                </Link>
                <Link href="/dealer"
                  className="flex-1 text-center py-3.5 border border-black/10 text-black/60 text-sm rounded-xl hover:border-black/25 hover:text-[#111] transition-all tracking-widest">
                  BECOME A DEALER
                </Link>
              </div>
            </div>
          </div>

          {/* Features + Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-fade-up" style={{ animationDelay: '150ms' }}>
            {features.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/[0.07] p-8">
                <h2 className="text-lg font-light text-[#111] mb-6 pb-4 border-b border-black/[0.06]">Features</h2>
                <ul className="space-y-3">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-black/60 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#111]/30 shrink-0 mt-1.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Object.keys(specs).length > 0 && (
              <div className="bg-white rounded-2xl border border-black/[0.07] p-8">
                <h2 className="text-lg font-light text-[#111] mb-6 pb-4 border-b border-black/[0.06]">Specifications</h2>
                <div className="divide-y divide-black/[0.05]">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-3 text-sm">
                      <span className="text-black/40 capitalize">{key}</span>
                      <span className="text-[#111] font-light">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-[#111] rounded-2xl px-8 py-10 text-center">
            <h3 className="text-xl font-light text-white mb-2">Ready to order or have questions?</h3>
            <p className="text-sm text-white/40 mb-6">Reach out to our sales team for pricing, bulk orders, and dealer enquiries.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="px-8 py-3 bg-white text-[#111] text-sm rounded-xl hover:bg-white/90 transition-colors tracking-widest font-medium">
                CONTACT US
              </Link>
              <Link href="/products"
                className="px-8 py-3 border border-white/20 text-white text-sm rounded-xl hover:border-white/40 transition-colors tracking-widest">
                ← BACK TO PRODUCTS
              </Link>
            </div>
          </div>
        </div>
      </main>
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
