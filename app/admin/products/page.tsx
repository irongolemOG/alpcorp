"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/supabase"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .order("display_order", { ascending: true })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    setDeletingId(id)
    await supabase.from("products").delete().eq("id", id)
    await load()
    setDeletingId(null)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#111] mb-1">Products</h1>
          <p className="text-sm text-black/35">{loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-wider"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD PRODUCT
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-12 text-center text-sm text-black/30">
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-12 text-center">
          <p className="text-sm text-black/30 mb-4">No products yet.</p>
          <Link href="/admin/products/new" className="text-sm text-[#111] underline underline-offset-4">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
          <div className="divide-y divide-black/[0.04]">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf8] transition-colors"
                style={{ opacity: 0, animation: `fadeIn 0.4s ease ${i * 60}ms forwards` }}
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-black/[0.06] bg-[#F5F4F0]">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-4 4 4"/><path d="M3 15l4 4 4-4 4 4 4-4"/></svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] tracking-widest text-black/30 font-mono">
                      {(product.category as any)?.name || "UNCATEGORISED"}
                    </span>
                    <span className="text-[10px] text-black/20">·</span>
                    <span className="text-[10px] text-black/25">ORDER {product.display_order}</span>
                  </div>
                  <div className="text-sm font-medium text-[#111] truncate">{product.name}</div>
                  <div className="text-[11px] text-black/35 truncate mt-0.5">{product.best_for}</div>
                </div>

                {/* Price/Stats */}
                <div className="hidden md:flex flex-col items-end gap-1 px-4 shrink-0">
                  <div className="text-sm font-light text-[#111]">{product.mrp || "—"}</div>
                  <div className="text-[10px] text-black/25 tracking-widest uppercase">MRP</div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="p-2 rounded-lg text-black/30 hover:text-black/70 hover:bg-black/[0.04] transition-all"
                    title="Edit"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 rounded-lg text-black/25 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
                    title="Delete"
                  >
                    {deletingId === product.id ? (
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
