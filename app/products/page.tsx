"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Category, Product } from "@/lib/supabase"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { RevealText } from "@/components/reveal-text"

export const dynamic = "force-dynamic"

// ── Static fallback (if DB empty) ────────────────────────────────────────────
const FALLBACK_CATS = ["Diamond Saw Blades", "TCT Saw Blades", "Cutting Discs"]
const FALLBACK_PRODUCTS = [
  { id: "f1", cat: "Diamond Saw Blades", name: 'Pro-Cut Diamond Blade 4"', best_for: "Marble, Granite, Ceramic Tiles", mrp: "₹450" },
  { id: "f2", cat: "Diamond Saw Blades", name: 'Heavy Duty Diamond Blade 5"', best_for: "Concrete, Hard Bricks, Pavers", mrp: "₹650" },
  { id: "f3", cat: "TCT Saw Blades", name: 'Woodmaster TCT Blade 4" 40T', best_for: "Softwood, Hardwood, Plywood", mrp: "₹320" },
  { id: "f4", cat: "TCT Saw Blades", name: 'Alu-Cut TCT Blade 10" 100T', best_for: "Aluminum profiles, Non-ferrous metals", mrp: "₹2,100" },
  { id: "f5", cat: "Cutting Discs", name: 'Metal Cutting Disc 4"', best_for: "Steel, Iron, Metal sheets", mrp: "₹35" },
  { id: "f6", cat: "Cutting Discs", name: 'Inox Pro Cutting Disc 5"', best_for: "Stainless Steel (Inox), Cast Iron", mrp: "₹65" },
]

function ProductCard({ name, best_for, mrp, image_url, id, isFallback = false }: {
  name: string; best_for: string; mrp: string; image_url?: string; id: string; isFallback?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden hover:border-black/[0.15] hover:shadow-sm transition-all duration-300 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="shrink-0 sm:w-48 h-44 sm:h-auto bg-[#F5F4F0] flex items-center justify-center">
        {image_url ? (
          <img src={image_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-black/15 p-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span className="text-[9px] tracking-widest text-center">Add image in admin</span>
          </div>
        )}
      </div>
      {/* Details */}
      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <h3 className="text-base font-medium text-[#111] mb-2">{name}</h3>
          <div className="flex items-start gap-2">
            <span className="text-[10px] tracking-widest text-black/30 mt-0.5 shrink-0 pt-px">BEST FOR</span>
            <span className="text-sm text-black/55 leading-snug">{best_for}</span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] tracking-widest text-black/30 mb-0.5">MRP</div>
            <div className="text-xl font-light text-[#111]">{mrp || "—"}</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/products/${id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-black/10 text-[11px] text-black/55 rounded-xl hover:border-black/25 hover:text-[#111] transition-all tracking-widest">
              VIEW SPEC
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 1-1h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111] text-white text-[11px] rounded-xl hover:bg-[#333] transition-colors tracking-widest">
              INQUIRY
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [useDB, setUseDB] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [{ data: cats, error: catErr }, { data: prods, error: prodErr }] = await Promise.all([
          supabase.from("categories").select("*").order("display_order", { ascending: true }),
          supabase.from("products").select("*, category:categories(id,name)").order("display_order", { ascending: true }),
        ])

        if (!catErr && cats && cats.length > 0) {
          setCategories(cats)
          setProducts(prods ?? [])
          setUseDB(true)
        }
      } catch (_) {
        // silently fall back to static data
      }
      setLoading(false)
    }
    load()
  }, [])

  // Filtered products
  const filteredProducts = useDB
    ? (activeTab === "all" ? products : products.filter(p => p.category_id === activeTab))
    : (activeTab === "all" ? FALLBACK_PRODUCTS : FALLBACK_PRODUCTS.filter(p => p.cat === activeTab))

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased flex flex-col">
      <MobileNav />
      <div className="h-24"></div>

      {/* Hero */}
      <section className="py-14 px-6 md:px-12 lg:px-20 border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest text-black/40 bg-black/[0.04] mb-5">OUR PRODUCTS</div>
            <RevealText className="text-4xl md:text-5xl font-light tracking-tight leading-[1.08]">
              {"Precision cutting tools\nbuilt for durability."}
            </RevealText>
            <p className="mt-4 text-sm text-black/45 leading-relaxed">
              Every Alpine Corporation product undergoes rigorous quality control. Built to handle Indian industrial conditions — abrasive materials, voltage fluctuations, and heavy daily use.
            </p>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[72px] z-10 bg-[#F5F4F0]/95 backdrop-blur-md border-b border-black/[0.06] px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-[11px] tracking-widest transition-all whitespace-nowrap ${
                activeTab === "all" ? "bg-[#111] text-white" : "text-black/45 hover:text-black/70 hover:bg-black/[0.04]"
              }`}
            >
              ALL
            </button>
            {useDB
              ? categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[11px] tracking-widest transition-all whitespace-nowrap ${
                    activeTab === cat.id ? "bg-[#111] text-white" : "text-black/45 hover:text-black/70 hover:bg-black/[0.04]"
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))
              : FALLBACK_CATS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[11px] tracking-widest transition-all whitespace-nowrap ${
                    activeTab === cat ? "bg-[#111] text-white" : "text-black/45 hover:text-black/70 hover:bg-black/[0.04]"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))
            }
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-12 px-6 md:px-12 lg:px-20 flex-1">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="py-24 text-center text-sm text-black/30">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center text-sm text-black/30">No products in this category yet.</div>
          ) : (
            <div className="space-y-4">
              {useDB
                ? filteredProducts.map((p: any, i: number) => (
                  <div key={p.id} style={{ opacity: 0, animation: `fadeUp 0.45s ease ${i * 60}ms forwards` }}>
                    <ProductCard id={p.id} name={p.name} best_for={p.best_for} mrp={p.mrp} image_url={p.image_url} />
                  </div>
                ))
                : (filteredProducts as typeof FALLBACK_PRODUCTS).map((p, i) => (
                  <div key={p.id} style={{ opacity: 0, animation: `fadeUp 0.45s ease ${i * 60}ms forwards` }}>
                    <ProductCard id={p.id} name={p.name} best_for={p.best_for} mrp={p.mrp} />
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-light text-[#111] mb-3">Can't find what you're looking for?</h3>
          <p className="text-sm text-black/45 leading-relaxed mb-8 max-w-lg mx-auto">
            Our catalogue is continuously expanding. Contact us with your specific requirements and we'll source the right tool for your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest">CONTACT US</Link>
            <Link href="/dealer" className="px-8 py-3 border border-black/10 text-black/60 text-sm rounded-xl hover:border-black/25 hover:text-[#111] transition-all tracking-widest">BECOME A DEALER</Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
