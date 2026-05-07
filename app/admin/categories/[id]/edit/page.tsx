"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EditCategoryPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from("categories").select("*").eq("id", id).single().then(({ data }) => {
      if (data) { setName(data.name); setDescription(data.description ?? ""); setDisplayOrder(String(data.display_order ?? 0)) }
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error: dbError } = await supabase.from("categories").update({
      name: name.trim(),
      description: description.trim(),
      display_order: parseInt(displayOrder) || 0,
    }).eq("id", id)

    if (dbError) { setError(dbError.message); setSaving(false); return }
    router.push("/admin/categories")
  }

  if (loading) return <div className="p-12 text-center text-sm text-black/30">Loading…</div>

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/categories" className="text-black/30 hover:text-black/60 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <h1 className="text-2xl font-light text-[#111]">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/[0.07] p-8 space-y-5">
        <div>
          <label className="block text-[11px] tracking-widest text-black/35 mb-2">CATEGORY NAME</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black/25 transition-colors" />
        </div>
        <div>
          <label className="block text-[11px] tracking-widest text-black/35 mb-2">DESCRIPTION</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black/25 transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-[11px] tracking-widest text-black/35 mb-2">DISPLAY ORDER</label>
          <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} min="0"
            className="w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black/25 transition-colors" />
        </div>

        {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium disabled:opacity-40">
            {saving ? "SAVING…" : "UPDATE CATEGORY"}
          </button>
          <Link href="/admin/categories"
            className="py-3 px-6 border border-black/10 text-black/50 text-sm rounded-xl hover:border-black/20 hover:text-black/70 transition-all tracking-widest">
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  )
}
