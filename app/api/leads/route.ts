import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client — uses the anon key
// Make sure to run this SQL in Supabase to allow anon inserts:
// alter table public.leads disable row level security;
// OR:
// create policy "Allow anon inserts" on public.leads for insert with check (true);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message, type } = body

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('leads')
      .insert([{ name: name || null, email, message: message || null, type }])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
