"use client"
import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/supabase"

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState("")
  const [name, setName] = useState("")
  const [bestFor, setBestFor] = useState("")
  const [mrp, setMrp] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")
  const [features, setFeatures] = useState<string[]>([""])
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>([{ key: "", val: "" }])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: prod }] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("products").select("*").eq("id", id).single(),
      ])
      setCategories(cats ?? [])
      if (prod) {
        setCategoryId(prod.category_id ?? "")
        setName(prod.name ?? "")
        setBestFor(prod.best_for ?? "")
        setMrp(prod.mrp ?? "")
        setDisplayOrder(String(prod.display_order ?? 0))
        setImageUrl(prod.image_url ?? "")
        setImagePreview(prod.image_url ?? "")
        const feats = Array.isArray(prod.features) && prod.features.length > 0 ? prod.features : [""]
        setFeatures(feats)
        const specObj = typeof prod.specifications === "object" && prod.specifications !== null ? prod.specifications : {}
        const specArr = Object.entries(specObj).map(([key, val]) => ({ key, val: String(val) }))
        setSpecs(specArr.length > 0 ? specArr : [{ key: "", val: "" }])
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setSaving(true)
    let finalImageUrl = imageUrl.trim()
    if (imageFile) {
      setUploading(true)
      const ext = imageFile.name.split(".").pop()
      const path = `products/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, imageFile, { upsert: true })
      if (uploadError) { setError(`Upload failed: ${uploadError.message}`); setUploading(false); setSaving(false); return }
      finalImageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl
      setUploading(false)
    }
    const validFeatures = features.filter(f => f.trim())
    const validSpecs: Record<string, string> = {}
    specs.forEach(s => { if (s.key.trim() && s.val.trim()) validSpecs[s.key.trim()] = s.val.trim() })
    const { error: dbError } = await supabase.from("products").update({
      category_id: categoryId || null, name: name.trim(), best_for: bestFor.trim(),
      mrp: mrp.trim(), image_url: finalImageUrl, features: validFeatures,
      specifications: validSpecs, display_order: parseInt(displayOrder) || 0,
    }).eq("id", id)
    if (dbError) { setError(dbError.message); setSaving(false); return }
    router.push("/admin/products")
  }

  if (loading) return <div className="p-12 text-center text-sm text-black/30">Loading…</div>

  const inputCls = "w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors"
  const labelCls = "block text-[11px] tracking-widest text-black/35 mb-2"
  const cardCls = "bg-white rounded-2xl border border-black/[0.07] p-6"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="text-black/30 hover:text-black/60 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <h1 className="text-2xl font-light text-[#111]">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={`${cardCls} space-y-4`}>
          <h2 className="text-sm font-medium text-[#111]">Basic Info</h2>
          <div><label className={labelCls}>CATEGORY</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">— Select category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>PRODUCT NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} />
          </div>
          <div><label className={labelCls}>BEST FOR</label>
            <input value={bestFor} onChange={e => setBestFor(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>MRP</label>
              <input value={mrp} onChange={e => setMrp(e.target.value)} className={inputCls} />
            </div>
            <div><label className={labelCls}>DISPLAY ORDER</label>
              <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} min="0" className={inputCls} />
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <h2 className="text-sm font-medium text-[#111] mb-4">Product Image</h2>
          {imagePreview && <div className="rounded-xl overflow-hidden h-36 border border-black/[0.07] mb-3"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#F5F4F0] border border-black/10 rounded-xl cursor-pointer hover:border-black/25 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/35"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="text-sm text-black/40">{imageFile ? imageFile.name : "Upload new image…"}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f))} }} />
            </label>
            <input value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); setImageFile(null) }}
              placeholder="Or paste image URL…" className={inputCls} />
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-sm font-medium text-[#111]">Features</h2></div>
            <button type="button" onClick={() => setFeatures(f => [...f, ""])} className="text-[11px] text-black/35 hover:text-black/60 tracking-widest">+ ADD</button>
          </div>
          <div className="space-y-2.5">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input value={feat} onChange={e => setFeatures(f => f.map((v, idx) => idx === i ? e.target.value : v))} placeholder={`Feature ${i + 1}…`} className={inputCls} />
                {features.length > 1 && <button type="button" onClick={() => setFeatures(f => f.filter((_, idx) => idx !== i))} className="p-2 text-black/20 hover:text-red-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#111]">Specifications</h2>
            <button type="button" onClick={() => setSpecs(s => [...s, { key: "", val: "" }])} className="text-[11px] text-black/35 hover:text-black/60 tracking-widest">+ ADD</button>
          </div>
          <div className="space-y-2.5">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input value={spec.key} onChange={e => setSpecs(s => s.map((v, idx) => idx === i ? { ...v, key: e.target.value } : v))} placeholder="Label" className={inputCls} />
                <input value={spec.val} onChange={e => setSpecs(s => s.map((v, idx) => idx === i ? { ...v, val: e.target.value } : v))} placeholder="Value" className={inputCls} />
                {specs.length > 1 && <button type="button" onClick={() => setSpecs(s => s.filter((_, idx) => idx !== i))} className="p-2 text-black/20 hover:text-red-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] tracking-widest font-medium disabled:opacity-40">
            {uploading ? "UPLOADING…" : saving ? "SAVING…" : "UPDATE PRODUCT"}
          </button>
          <Link href="/admin/products" className="py-3 px-6 border border-black/10 text-black/50 text-sm rounded-xl hover:border-black/20 tracking-widest">CANCEL</Link>
        </div>
      </form>
    </div>
  )
}
