import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { session_id, rating, comment } = body

  if (!session_id || !rating) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating debe ser entre 1 y 5' }, { status: 400 })
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('mentor_id, apprentice_id, status')
    .eq('id', session_id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
  }

  if (session.status !== 'completed') {
    return NextResponse.json({ error: 'La sesión no está completada' }, { status: 400 })
  }

  const isParticipant = session.mentor_id === user.id || session.apprentice_id === user.id
  if (!isParticipant) {
    return NextResponse.json({ error: 'No eres participante de esta sesión' }, { status: 403 })
  }

  const reviewee_id = session.mentor_id === user.id ? session.apprentice_id : session.mentor_id

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      session_id,
      reviewer_id: user.id,
      reviewee_id,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Recalcular avg_rating del mentor (el trigger de BD también lo hace,
  // pero esto garantiza consistencia si el trigger aún no está aplicado)
  if (reviewee_id === session.mentor_id) {
    const { data: allFeedback } = await supabase
      .from('feedback')
      .select('rating')
      .eq('reviewee_id', reviewee_id)

    if (allFeedback && allFeedback.length > 0) {
      const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
      await supabase
        .from('mentor_profiles')
        .update({ avg_rating: parseFloat(avg.toFixed(2)) })
        .eq('id', reviewee_id)
    }
  }

  return NextResponse.json(data, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mentorId = searchParams.get('mentor_id')

  const supabase = await createClient()

  let query = supabase
    .from('feedback')
    .select(`
      *,
      reviewer:profiles!feedback_reviewer_id_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (mentorId) {
    query = query.eq('reviewee_id', mentorId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
