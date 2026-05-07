import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ───────────────────────────────────────────────────────────────────────

export type Category = {
  id: string
  name: string
  description: string
  display_order: number
  created_at: string
}

export type Product = {
  id: string
  category_id: string | null
  name: string
  best_for: string
  mrp: string
  image_url: string
  features: string[]
  specifications: Record<string, string>
  display_order: number
  created_at: string
  // joined
  category?: Category
}

export type Lead = {
  id?: string
  email: string
  type: 'contact' | 'dealer'
  name?: string
  message?: string
  created_at?: string
}
