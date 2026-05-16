import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { role, full_name, bio, specialties, experience_years, linkedin_url, availability } = body

  if (role !== 'mentor' && role !== 'apprentice') {
    return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
  }

  // Actualizar perfil base
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role,
      ...(full_name?.trim() && { full_name: full_name.trim() }),
      ...(bio !== undefined && { bio }),
    })
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Crear/actualizar perfil de mentor si corresponde
  if (role === 'mentor') {
    const mentorData = {
      specialties: specialties ?? [],
      experience_years: experience_years ?? 0,
      linkedin_url: linkedin_url ?? null,
      availability: availability ?? {},
    }

    const { data: existing } = await supabase
      .from('mentor_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existing) {
      await supabase.from('mentor_profiles').update(mentorData).eq('id', user.id)
    } else {
      await supabase.from('mentor_profiles').insert({ id: user.id, ...mentorData })
    }
  }

  return NextResponse.json({ success: true })
}
