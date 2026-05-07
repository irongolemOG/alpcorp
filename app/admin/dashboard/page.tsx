"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Stats {
  products: number
  leads: number
  dealers: number
  contacts: number
}

function StatCard({ label, value, sub, icon, delay = 0 }: {
  label: string; value: number | string; sub?: string; icon: React.ReactNode; delay?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), delay) }, [delay])
  return (
    <div
      className="bg-white rounded-2xl border border-black/[0.07] p-6 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl border border-black/[0.07] flex items-center justify-center text-black/40">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-light text-[#111] mb-1">{value}</div>
      <div className="text-xs text-black/40 tracking-widest">{label}</div>
      {sub && <div className="text-[11px] text-black/25 mt-1">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, leads: 0, dealers: 0, contacts: 0 })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [prodRes, leadsRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
      ])

      const total = leadsRes.data ?? []
      setStats({
        products: prodRes.count ?? 0,
        leads: total.length,
        dealers: total.filter((l: any) => l.type === "dealer").length,
        contacts: total.filter((l: any) => l.type === "contact").length,
      })
      setRecentLeads(total)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#111] mb-1">Dashboard</h1>
        <p className="text-sm text-black/35">Overview of your Alpine Corporation backend.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard delay={0}   label="PRODUCTS"       value={loading ? "—" : stats.products} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard delay={80}  label="TOTAL LEADS"    value={loading ? "—" : stats.leads}    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard delay={140} label="DEALER SIGNUPS" value={loading ? "—" : stats.dealers}  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} />
        <StatCard delay={200} label="CONTACT MSGS"   value={loading ? "—" : stats.contacts} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/products/new" className="bg-[#111] text-white rounded-2xl p-6 hover:bg-[#222] transition-colors flex items-center justify-between group">
          <div>
            <div className="text-sm font-medium mb-1">Add New Product</div>
            <div className="text-xs text-white/40">Upload images, set pricing, configure stats</div>
          </div>
          <svg className="opacity-40 group-hover:opacity-70 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </Link>
        <Link href="/admin/leads" className="bg-white border border-black/[0.07] rounded-2xl p-6 hover:border-black/[0.15] transition-colors flex items-center justify-between group">
          <div>
            <div className="text-sm font-medium mb-1 text-[#111]">View All Leads</div>
            <div className="text-xs text-black/35">Dealers and contact inquiries</div>
          </div>
          <svg className="text-black/25 group-hover:text-black/50 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <span className="text-sm font-light text-[#111]">Recent Leads</span>
          <Link href="/admin/leads" className="text-[11px] text-black/35 hover:text-black/60 tracking-widest transition-colors">VIEW ALL →</Link>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-sm text-black/30 text-center">Loading…</div>
        ) : recentLeads.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/30 text-center">No leads yet.</div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {recentLeads.map((lead: any) => (
              <div key={lead.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-black/[0.015] transition-colors">
                <div className={`shrink-0 w-2 h-2 rounded-full ${lead.type === "dealer" ? "bg-amber-400" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#111] font-light truncate">{lead.name ?? lead.email}</div>
                  {lead.name && <div className="text-[11px] text-black/35 truncate">{lead.email}</div>}
                </div>
                <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full tracking-widest ${
                  lead.type === "dealer"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                }`}>
                  {lead.type.toUpperCase()}
                </span>
                <span className="shrink-0 text-[11px] text-black/25">
                  {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
