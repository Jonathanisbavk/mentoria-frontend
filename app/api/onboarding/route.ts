import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role } = await request.json()

  if (role !== 'mentor' && role !== 'apprentice') {
    return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (role === 'mentor') {
    const { data: existing } = await supabase
      .from('mentor_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      await supabase.from('mentor_profiles').insert({
        id: user.id,
        specialties: [],
        experience_years: 0,
        availability: {},
      })
    }
  }

  return NextResponse.json({ success: true })
}
