import { google } from 'googleapis'
import { getOAuth2Client } from './oauth'
import type { GoogleCalendarTokens } from '@/lib/types/app'
import type { Session, Profile } from '@/lib/types/app'
import { createClient } from '@/lib/supabase/server'

async function getAuthenticatedClient(userId: string, tokens: GoogleCalendarTokens) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials(tokens)

  if (tokens.expiry_date < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken()
    const newTokens: GoogleCalendarTokens = {
      access_token: credentials.access_token!,
      refresh_token: credentials.refresh_token ?? tokens.refresh_token,
      expiry_date: credentials.expiry_date!,
    }
    oauth2Client.setCredentials(newTokens)

    const supabase = await createClient()
    await supabase
      .from('profiles')
      .update({ google_calendar_token: newTokens })
      .eq('id', userId)
  }

  return oauth2Client
}

export type CalendarEventResult = {
  eventId: string | null
  meetUrl: string | null
}

export async function createCalendarEvent(
  userId: string,
  tokens: GoogleCalendarTokens,
  session: Session,
  mentor: Profile,
  apprentice: Profile
): Promise<CalendarEventResult> {
  try {
    const auth = await getAuthenticatedClient(userId, tokens)
    const calendar = google.calendar({ version: 'v3', auth })

    const endTime = new Date(session.scheduled_at)
    endTime.setMinutes(endTime.getMinutes() + session.duration_minutes)

    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: `MentorIA: ${session.title}`,
        description: [
          session.description ?? '',
          '',
          `Mentor: ${mentor.full_name}`,
          `Aprendiz: ${apprentice.full_name}`,
          '',
          'Sesión agendada desde MentorIA.',
        ].join('\n'),
        start: { dateTime: session.scheduled_at, timeZone: 'America/Lima' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Lima' },
        conferenceData: {
          createRequest: {
            requestId: `mentoria-${session.id}-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      },
    })

    const meetUrl =
      event.data.hangoutLink ??
      event.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri ??
      null

    return { eventId: event.data.id ?? null, meetUrl }
  } catch {
    return { eventId: null, meetUrl: null }
  }
}

export async function deleteCalendarEvent(
  userId: string,
  tokens: GoogleCalendarTokens,
  eventId: string
): Promise<void> {
  try {
    const auth = await getAuthenticatedClient(userId, tokens)
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.delete({ calendarId: 'primary', eventId })
  } catch {}
}

export async function updateCalendarEvent(
  userId: string,
  tokens: GoogleCalendarTokens,
  eventId: string,
  session: Session
): Promise<void> {
  try {
    const auth = await getAuthenticatedClient(userId, tokens)
    const calendar = google.calendar({ version: 'v3', auth })

    const endTime = new Date(session.scheduled_at)
    endTime.setMinutes(endTime.getMinutes() + session.duration_minutes)

    await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary: `MentorIA: ${session.title}`,
        start: { dateTime: session.scheduled_at, timeZone: 'America/Lima' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Lima' },
      },
    })
  } catch {}
}
