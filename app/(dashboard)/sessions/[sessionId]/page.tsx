import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CalendarDays, Clock, Video } from 'lucide-react'
import { SessionActions } from './session-actions'

type Params = { params: Promise<{ sessionId: string }> }

type SessionFull = {
  id: string
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number
  status: string
  mentor_id: string
  apprentice_id: string
  meet_url: string | null
  mentor: { id: string; full_name: string; avatar_url: string | null; bio: string | null }
  apprentice: { id: string; full_name: string; avatar_url: string | null }
}

const statusColors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente confirmación',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

export default async function SessionDetailPage({ params }: Params) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: sessionData } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(id, full_name, avatar_url, bio),
      apprentice:profiles!sessions_apprentice_id_fkey(id, full_name, avatar_url)
    `)
    .eq('id', sessionId)
    .single()
  const session = sessionData as SessionFull | null

  if (!session) notFound()

  const isMentor = session.mentor_id === user.id
  const isApprentice = session.apprentice_id === user.id
  const other = isMentor
    ? (session.apprentice as { id: string; full_name: string; avatar_url: string | null })
    : (session.mentor as { id: string; full_name: string; avatar_url: string | null })

  const { data: existingFeedback } = await supabase
    .from('feedback')
    .select('id')
    .eq('session_id', sessionId)
    .eq('reviewer_id', user.id)
    .single()

  const canLeaveFeedback = session.status === 'completed' && !existingFeedback

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
        <Badge variant={statusColors[session.status]}>{statusLabels[session.status]}</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Participantes</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={other.avatar_url} name={other.full_name} />
            <div>
              <p className="font-medium text-gray-900">{other.full_name}</p>
              <p className="text-sm text-gray-500">{isMentor ? 'Aprendiz' : 'Mentor'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Detalles</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <CalendarDays size={16} className="text-gray-400" />
            <span>
              {new Date(session.scheduled_at).toLocaleDateString('es-PE', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock size={16} className="text-gray-400" />
            <span>{session.duration_minutes} minutos</span>
          </div>
          {session.description && (
            <p className="text-gray-700 mt-2 pt-2 border-t border-gray-100">
              {session.description}
            </p>
          )}
          {session.meet_url && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <a
                href={session.meet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#0B2272] hover:opacity-90 text-white font-medium py-2.5 px-4 transition-opacity"
              >
                <Video size={18} />
                {session.meet_url.includes('meet.google.com')
                  ? 'Unirse a Google Meet'
                  : 'Unirse a la videollamada'}
              </a>
              <p className="text-xs text-gray-400 text-center break-all">
                {session.meet_url}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <SessionActions
        sessionId={sessionId}
        status={session.status}
        isMentor={isMentor}
        isApprentice={isApprentice}
      />

      {canLeaveFeedback && (
        <Link href={`/sessions/${sessionId}/feedback`}>
          <Button className="w-full">Dejar reseña</Button>
        </Link>
      )}
    </div>
  )
}
