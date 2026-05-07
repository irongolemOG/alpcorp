"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/supabase"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from("categories").select("*").order("display_order", { ascending: true })
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it will become uncategorised.")) return
    setDeletingId(id)
    await supabase.from("categories").delete().eq("id", id)
    await load()
    setDeletingId(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#111] mb-1">Categories</h1>
          <p className="text-sm text-black/35">{loading ? "Loading…" : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}</p>
        </div>
        <Link href="/admin/categories/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-wider">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD CATEGORY
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-black/30">Loading…</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-black/30 mb-4">No categories yet. Add your first category to start organising products.</p>
            <Link href="/admin/categories/new" className="text-sm text-[#111] underline underline-offset-4">Add category →</Link>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {categories.map((cat, i) => (
              <div key={cat.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf8] transition-colors"
                style={{ opacity: 0, animation: `fadeIn 0.4s ease ${i * 50}ms forwards` }}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-light text-[#111]">{cat.name}</div>
                  {cat.description && <div className="text-[11px] text-black/35 truncate mt-0.5">{cat.description}</div>}
                </div>
                <span className="shrink-0 text-[10px] text-black/25 px-2 py-1 bg-black/[0.03] rounded-lg">
                  Order: {cat.display_order}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/admin/categories/${cat.id}/edit`}
                    className="p-2 rounded-lg text-black/30 hover:text-black/70 hover:bg-black/[0.04] transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} disabled={deletingId === cat.id}
                    className="p-2 rounded-lg text-black/25 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30">
                    {deletingId === cat.id
                      ? <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}
