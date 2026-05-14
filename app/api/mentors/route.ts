import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialty = searchParams.get('specialty')
  const minRating = searchParams.get('rating')
  const q = searchParams.get('q')

  const supabase = await createClient()

  let query = supabase
    .from('mentor_profiles')
    .select(`
      *,
      profiles!inner(id, full_name, avatar_url, bio)
    `)
    .eq('is_active', true)
    .order('avg_rating', { ascending: false })

  if (specialty) {
    query = query.contains('specialties', [specialty])
  }

  if (minRating) {
    query = query.gte('avg_rating', parseFloat(minRating))
  }

  if (q) {
    query = query.ilike('profiles.full_name', `%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
