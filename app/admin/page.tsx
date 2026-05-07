"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const ok = adminLogin(password)
    if (ok) {
      router.push("/admin/dashboard")
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-pixel text-sm tracking-[0.3em] text-black/40">ALPINE CORP</span>
          <p className="text-xs text-black/30 mt-2 tracking-widest">ADMIN PORTAL</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-8 shadow-sm">
          <h1 className="text-xl font-light text-[#111] mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] tracking-widest text-black/35 mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                placeholder="••••••••"
                required
                autoFocus
                className={`w-full bg-[#F5F4F0] border rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/20 focus:outline-none transition-colors ${
                  error ? "border-red-400 focus:border-red-400" : "border-black/10 focus:border-black/25"
                }`}
              />
              {error && (
                <p className="text-xs text-red-500 mt-1.5">Incorrect password. Try again.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-black/20 mt-6 tracking-wide">
          © 2026 Alpine Corporation
        </p>
      </div>
    </div>
  )
}
