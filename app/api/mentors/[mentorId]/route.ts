import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ mentorId: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { mentorId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio')
    .eq('id', mentorId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Mentor no encontrado' }, { status: 404 })
  }

  const { data: mentorProfile } = await supabase
    .from('mentor_profiles')
    .select('specialties, avg_rating, experience_years')
    .eq('id', mentorId)
    .single()

  return NextResponse.json({ ...profile, mentorProfile })
}
