import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ sessionId: string }> }
type SessionRow = { mentor_id: string; apprentice_id: string; [key: string]: unknown }

export async function GET(_request: Request, { params }: Params) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: rawData, error } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(id, full_name, avatar_url, bio),
      apprentice:profiles!sessions_apprentice_id_fkey(id, full_name, avatar_url),
      feedback(*)
    `)
    .eq('id', sessionId)
    .single()
  const data = rawData as SessionRow | null

  if (error || !data) {
    return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
  }

  if (data.mentor_id !== user.id && data.apprentice_id !== user.id) {
    const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const profile = profileRaw as { role: string } | null
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: Params) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data: session } = await supabase
    .from('sessions')
    .select('mentor_id, apprentice_id')
    .eq('id', sessionId)
    .single()

  if (!session || (session.mentor_id !== user.id && session.apprentice_id !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('sessions')
    .update(body)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_request: Request, { params }: Params) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('mentor_id, apprentice_id, status')
    .eq('id', sessionId)
    .single()

  if (!session || (session.mentor_id !== user.id && session.apprentice_id !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('sessions').delete().eq('id', sessionId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
