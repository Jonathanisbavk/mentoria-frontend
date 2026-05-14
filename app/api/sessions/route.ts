import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(id, full_name, avatar_url),
      apprentice:profiles!sessions_apprentice_id_fkey(id, full_name, avatar_url)
    `)
    .or(`mentor_id.eq.${user.id},apprentice_id.eq.${user.id}`)
    .order('scheduled_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { mentor_id, title, description, scheduled_at, duration_minutes } = body

  if (!mentor_id || !title || !scheduled_at) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // Validar que el mentor exista y esté activo
  const { data: mentorProfile } = await supabase
    .from('mentor_profiles')
    .select('id, is_active')
    .eq('id', mentor_id)
    .single()

  if (!mentorProfile) {
    return NextResponse.json({ error: 'Mentor no encontrado' }, { status: 400 })
  }

  if (!mentorProfile.is_active) {
    return NextResponse.json({ error: 'Este mentor no está disponible actualmente' }, { status: 400 })
  }

  // Validar que la fecha sea futura
  if (new Date(scheduled_at) <= new Date()) {
    return NextResponse.json({ error: 'La fecha de la sesión debe ser futura' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      mentor_id,
      apprentice_id: user.id,
      title,
      description,
      scheduled_at,
      duration_minutes: duration_minutes ?? 60,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
