"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type LeadType = "all" | "dealer" | "contact"

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<LeadType>("all")
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
    setLeads(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead?")) return
    setDeletingId(id)
    await supabase.from("leads").delete().eq("id", id)
    setLeads(prev => prev.filter(l => l.id !== id))
    setDeletingId(null)
  }

  const filtered = leads.filter(l => {
    const matchType = filter === "all" || l.type === filter
    const q = search.toLowerCase()
    const matchSearch = !q || (l.email?.toLowerCase().includes(q) || l.name?.toLowerCase().includes(q) || l.message?.toLowerCase().includes(q))
    return matchType && matchSearch
  })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#111] mb-1">Leads</h1>
        <p className="text-sm text-black/35">{loading ? "Loading…" : `${leads.length} total lead${leads.length !== 1 ? "s" : ""}`}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-white border border-black/[0.07] rounded-xl p-1">
          {(["all", "dealer", "contact"] as LeadType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-[11px] tracking-widest transition-all ${
                filter === t ? "bg-[#111] text-white" : "text-black/40 hover:text-black/70"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 bg-white border border-black/[0.07] rounded-xl px-4 py-2.5 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/20 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-black/30">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-black/30">No leads found.</div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-black/[0.06] bg-[#fafaf8]">
              {["NAME", "EMAIL", "TYPE", "DATE", ""].map(h => (
                <span key={h} className="text-[10px] tracking-widest text-black/30">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-black/[0.04]">
              {filtered.map((lead, i) => (
                <div
                  key={lead.id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr_1fr_auto_auto] gap-2 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-[#fafaf8] transition-colors"
                  style={{ opacity: 0, animation: `fadeIn 0.35s ease ${i * 40}ms forwards` }}
                >
                  <div className="text-sm text-[#111] font-light">{lead.name || <span className="text-black/25 italic text-xs">no name</span>}</div>
                  <div className="text-sm text-black/50 truncate">{lead.email}</div>
                  <span className={`self-start md:self-auto text-[10px] px-2.5 py-1 rounded-full tracking-widest border ${
                    lead.type === "dealer"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  }`}>
                    {lead.type?.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-black/25 shrink-0">
                    {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </span>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    disabled={deletingId === lead.id}
                    className="self-start md:self-auto p-1.5 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                  >
                    {deletingId === lead.id ? (
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Messages expand section — show messages for contact leads */}
            {filtered.some(l => l.message) && (
              <div className="border-t border-black/[0.06] px-6 py-5">
                <div className="text-[11px] tracking-widest text-black/30 mb-4">CONTACT MESSAGES</div>
                <div className="space-y-4">
                  {filtered.filter(l => l.message).map(lead => (
                    <div key={lead.id + "-msg"} className="bg-[#F5F4F0] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-light text-[#111]">{lead.name || lead.email}</span>
                        <span className="text-[10px] text-black/25">·</span>
                        <span className="text-[10px] text-black/30">{lead.email}</span>
                        <span className="text-[10px] text-black/25 ml-auto">{new Date(lead.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                      <p className="text-sm text-black/55 leading-relaxed">{lead.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
