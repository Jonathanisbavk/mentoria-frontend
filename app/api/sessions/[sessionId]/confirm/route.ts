import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCalendarEvent } from '@/lib/google-calendar/calendar'
import { getUserEmail, sendSessionConfirmed } from '@/lib/email'
import type { GoogleCalendarTokens, Profile, Session } from '@/lib/types/app'

type Params = { params: Promise<{ sessionId: string }> }

// Fallback cuando el mentor no ha conectado Google Calendar:
// genera una sala Jitsi (funciona sin OAuth, gratis, no requiere cuenta).
// El nombre de la sala es determinístico => mentor y aprendiz entran al mismo room.
function generateFallbackMeetUrl(sessionId: string): string {
  const room = `CertusMentoria-${sessionId.replace(/-/g, '').slice(0, 12)}`
  return `https://meet.jit.si/${room}`
}

export async function POST(_request: Request, { params }: Params) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: sessionRaw } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  const session = sessionRaw as Session | null

  if (!session) {
    return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
  }

  if (session.mentor_id !== user.id) {
    return NextResponse.json({ error: 'Solo el mentor puede confirmar' }, { status: 403 })
  }

  if (session.status !== 'pending') {
    return NextResponse.json({ error: 'La sesión no está en estado pendiente' }, { status: 400 })
  }

  const [{ data: mentorRaw }, { data: apprenticeRaw }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.mentor_id).single(),
    supabase.from('profiles').select('*').eq('id', session.apprentice_id).single(),
  ])

  const mentorProfile = mentorRaw as Profile | null
  const apprenticeProfile = apprenticeRaw as Profile | null

  let calendarEventId: string | null = null
  let meetUrl: string | null = null

  // Crear evento en Google Calendar + Meet si alguno tiene tokens
  if (mentorProfile?.google_calendar_token && mentorProfile && apprenticeProfile) {
    const result = await createCalendarEvent(
      mentorProfile.id,
      mentorProfile.google_calendar_token as GoogleCalendarTokens,
      session,
      mentorProfile,
      apprenticeProfile
    )
    calendarEventId = result.eventId
    meetUrl = result.meetUrl
  } else if (apprenticeProfile?.google_calendar_token && mentorProfile && apprenticeProfile) {
    const result = await createCalendarEvent(
      apprenticeProfile.id,
      apprenticeProfile.google_calendar_token as GoogleCalendarTokens,
      session,
      mentorProfile,
      apprenticeProfile
    )
    calendarEventId = result.eventId
    meetUrl = result.meetUrl
  }

  // Si ambos tienen tokens, crear también en el calendario del aprendiz
  if (
    calendarEventId &&
    mentorProfile?.google_calendar_token &&
    apprenticeProfile?.google_calendar_token &&
    mentorProfile && apprenticeProfile
  ) {
    await createCalendarEvent(
      apprenticeProfile.id,
      apprenticeProfile.google_calendar_token as GoogleCalendarTokens,
      session,
      mentorProfile,
      apprenticeProfile
    )
  }

  // Fallback: si nadie tiene Google Calendar, generar sala de Jitsi
  if (!meetUrl) {
    meetUrl = generateFallbackMeetUrl(sessionId)
  }

  const { data, error } = await supabase
    .from('sessions')
    .update({
      status: 'confirmed',
      ...(calendarEventId ? { calendar_event_id: calendarEventId } : {}),
      meet_url: meetUrl,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Notificar al aprendiz por correo (no bloqueante)
  if (apprenticeProfile && mentorProfile) {
    getUserEmail(session.apprentice_id).then(apprenticeEmail => {
      if (apprenticeEmail) {
        sendSessionConfirmed({
          apprenticeEmail,
          apprenticeName: apprenticeProfile.full_name,
          mentorName: mentorProfile.full_name,
          sessionTitle: session.title,
          scheduledAt: session.scheduled_at,
          durationMinutes: session.duration_minutes,
          meetUrl,
          sessionId,
        }).catch(console.error)
      }
    }).catch(console.error)
  }

  return NextResponse.json({
    ...data,
    meetUrl,
    calendarCreated: !!calendarEventId,
  })
}
