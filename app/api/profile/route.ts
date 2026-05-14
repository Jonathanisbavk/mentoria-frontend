import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: mentorProfile } = await supabase
    .from('mentor_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ profile, mentorProfile })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { full_name, bio, timezone, specialties, experience_years, linkedin_url, availability } = body

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name, bio, timezone })
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  if (specialties !== undefined) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role === 'mentor') {
      const { data: existing } = await supabase.from('mentor_profiles').select('id').eq('id', user.id).single()

      if (existing) {
        await supabase.from('mentor_profiles').update({
          specialties, experience_years, linkedin_url, availability,
        }).eq('id', user.id)
      } else {
        await supabase.from('mentor_profiles').insert({
          id: user.id,
          specialties, experience_years, linkedin_url, availability,
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}
