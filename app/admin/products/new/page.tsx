"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/lib/supabase"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState("")
  const [name, setName] = useState("")
  const [bestFor, setBestFor] = useState("")
  const [mrp, setMrp] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")
  const [features, setFeatures] = useState(["", "", ""])
  const [specs, setSpecs] = useState([{ key: "", val: "" }, { key: "", val: "" }])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [useUrl, setUseUrl] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from("categories").select("*").order("display_order").then(({ data }) => setCategories(data ?? []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setSaving(true)
    let finalImageUrl = imageUrl.trim()
    if (!useUrl && imageFile) {
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
    const { error: dbError } = await supabase.from("products").insert([{
      category_id: categoryId || null, name: name.trim(), best_for: bestFor.trim(),
      mrp: mrp.trim(), image_url: finalImageUrl, features: validFeatures,
      specifications: validSpecs, display_order: parseInt(displayOrder) || 0,
    }])
    if (dbError) { setError(dbError.message); setSaving(false); return }
    router.push("/admin/products")
  }

  const inputCls = "w-full bg-[#F5F4F0] border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none focus:border-black/25 transition-colors"
  const labelCls = "block text-[11px] tracking-widest text-black/35 mb-2"
  const cardCls = "bg-white rounded-2xl border border-black/[0.07] p-6"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="text-black/30 hover:text-black/60 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <h1 className="text-2xl font-light text-[#111]">Add Product</h1>
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
            <input value={name} onChange={e => setName(e.target.value)} required placeholder='e.g. Pro-Cut Diamond Blade 4"' className={inputCls} />
          </div>
          <div><label className={labelCls}>BEST FOR</label>
            <input value={bestFor} onChange={e => setBestFor(e.target.value)} placeholder="e.g. Marble, Granite, Ceramic Tiles" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>MRP</label>
              <input value={mrp} onChange={e => setMrp(e.target.value)} placeholder="e.g. ₹450" className={inputCls} />
            </div>
            <div><label className={labelCls}>DISPLAY ORDER</label>
              <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} min="0" className={inputCls} />
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#111]">Product Image</h2>
            <button type="button" onClick={() => { setUseUrl(v => !v); setImageFile(null); setImagePreview(null) }}
              className="text-[11px] text-black/35 hover:text-black/60 tracking-widest transition-colors">
              {useUrl ? "← UPLOAD FILE" : "USE URL →"}
            </button>
          </div>
          {useUrl ? (
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/product.jpg" className={inputCls} />
          ) : (
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f))} }} />
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden h-40 border border-black/[0.07]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-white/80 text-black/50 px-2 py-1 rounded-lg">Click to change</span>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-black/[0.1] h-40 flex flex-col items-center justify-center gap-2 hover:border-black/25 hover:bg-[#F5F4F0] transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/25"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span className="text-xs text-black/30">Click to upload (PNG, JPG, WEBP)</span>
                </div>
              )}
            </label>
          )}
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-sm font-medium text-[#111]">Features</h2>
              <p className="text-[11px] text-black/30 mt-0.5">Bullet points on spec page</p></div>
            <button type="button" onClick={() => setFeatures(f => [...f, ""])} className="text-[11px] text-black/35 hover:text-black/60 tracking-widest">+ ADD</button>
          </div>
          <div className="space-y-2.5">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input value={feat} onChange={e => setFeatures(f => f.map((v, idx) => idx === i ? e.target.value : v))}
                  placeholder={`Feature ${i + 1}…`} className={inputCls} />
                {features.length > 1 && (
                  <button type="button" onClick={() => setFeatures(f => f.filter((_, idx) => idx !== i))} className="p-2 text-black/20 hover:text-red-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-sm font-medium text-[#111]">Specifications</h2>
              <p className="text-[11px] text-black/30 mt-0.5">Key-value pairs e.g. Size → 4 inch</p></div>
            <button type="button" onClick={() => setSpecs(s => [...s, { key: "", val: "" }])} className="text-[11px] text-black/35 hover:text-black/60 tracking-widest">+ ADD</button>
          </div>
          <div className="space-y-2.5">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input value={spec.key} onChange={e => setSpecs(s => s.map((v, idx) => idx === i ? { ...v, key: e.target.value } : v))} placeholder="Label" className={inputCls} />
                <input value={spec.val} onChange={e => setSpecs(s => s.map((v, idx) => idx === i ? { ...v, val: e.target.value } : v))} placeholder="Value" className={inputCls} />
                {specs.length > 1 && (
                  <button type="button" onClick={() => setSpecs(s => s.filter((_, idx) => idx !== i))} className="p-2 text-black/20 hover:text-red-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] tracking-widest font-medium disabled:opacity-40">
            {uploading ? "UPLOADING…" : saving ? "SAVING…" : "SAVE PRODUCT"}
          </button>
          <Link href="/admin/products" className="py-3 px-6 border border-black/10 text-black/50 text-sm rounded-xl hover:border-black/20 tracking-widest">CANCEL</Link>
        </div>
      </form>
    </div>
  )
}
