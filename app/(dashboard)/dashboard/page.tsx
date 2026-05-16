import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CalendarDays, Users, Star, Clock, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import type { Profile, MentorProfile } from '@/lib/types/app'

type SessionRow = {
  id: string
  title: string
  scheduled_at: string
  status: string
  mentor_id: string
  apprentice_id: string
  mentor: { id: string; full_name: string; avatar_url: string | null }
  apprentice: { id: string; full_name: string; avatar_url: string | null }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = profileData as Profile | null

  const { data: sessionsData } = await supabase
    .from('sessions')
    .select(`
      *,
      mentor:profiles!sessions_mentor_id_fkey(id, full_name, avatar_url),
      apprentice:profiles!sessions_apprentice_id_fkey(id, full_name, avatar_url)
    `)
    .or(`mentor_id.eq.${user.id},apprentice_id.eq.${user.id}`)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(3)
  const upcomingSessions = sessionsData as SessionRow[] | null

  const { count: totalSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .or(`mentor_id.eq.${user.id},apprentice_id.eq.${user.id}`)

  const { data: mentorRawData } = await supabase
    .from('mentor_profiles')
    .select('avg_rating, session_count')
    .eq('id', user.id)
    .single()
  const mentorData = mentorRawData as Pick<MentorProfile, 'avg_rating' | 'session_count'> | null

  // Solicitudes pendientes (solo mentor)
  type PendingRequest = {
    id: string
    title: string
    scheduled_at: string
    apprentice: { id: string; full_name: string; avatar_url: string | null }
  }
  const pendingRequests: PendingRequest[] = []
  if (profile?.role === 'mentor') {
    const { data: pr } = await supabase
      .from('sessions')
      .select(`id, title, scheduled_at, apprentice:profiles!sessions_apprentice_id_fkey(id, full_name, avatar_url)`)
      .eq('mentor_id', user.id)
      .eq('status', 'pending')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5)
    if (pr) pendingRequests.push(...(pr as PendingRequest[]))
  }

  const statusColors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'info',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {profile?.full_name?.split(' ')[0] || 'estudiante'} 👋
        </h1>
        <p className="text-gray-500">
          {profile?.role === 'mentor'
            ? 'Comparte tu experiencia en desarrollo y ayuda a tus compañeros a crecer'
            : 'Aprende desarrollo de software con la guía de estudiantes avanzados de Certus'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSessions ?? 0}</p>
                <p className="text-sm text-gray-500">Sesiones totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingSessions?.length ?? 0}</p>
                <p className="text-sm text-gray-500">Próximas sesiones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {profile?.role === 'mentor' && mentorData && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-100 p-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {mentorData.avg_rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500">Rating promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mentorData.session_count}</p>
                    <p className="text-sm text-gray-500">Sesiones completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* ── Solicitudes pendientes (solo mentor) ── */}
      {profile?.role === 'mentor' && (
        <Card className={pendingRequests.length > 0 ? 'border-amber-200 bg-amber-50' : undefined}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className={`h-4 w-4 ${pendingRequests.length > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                <CardTitle>Solicitudes pendientes</CardTitle>
                {pendingRequests.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
              <Link href="/sessions">
                <Button variant="ghost" size="sm">Ver sesiones</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-500 text-sm">No tienes solicitudes pendientes</p>
                <p className="text-gray-400 text-xs mt-1">Los aprendices te encontrarán en el directorio de mentores</p>
              </div>
            ) : (
              <ul className="divide-y divide-amber-100">
                {pendingRequests.map(req => {
                  const apprentice = req.apprentice as { full_name: string; avatar_url: string | null }
                  return (
                    <li key={req.id} className="py-3">
                      <Link href={`/sessions/${req.id}`} className="flex items-center gap-3 hover:bg-amber-100/50 -mx-2 px-2 rounded-lg transition-colors">
                        <Avatar src={apprentice.avatar_url} name={apprentice.full_name} size={36} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{req.title}</p>
                          <p className="text-sm text-gray-500">
                            {apprentice.full_name} ·{' '}
                            {new Date(req.scheduled_at).toLocaleDateString('es-PE', {
                              weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge variant="warning">Confirmar</Badge>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Próximas sesiones ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Próximas sesiones</CardTitle>
            <Link href="/sessions">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!upcomingSessions?.length ? (
            <div className="py-8 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No tienes sesiones próximas</p>
              {profile?.role === 'apprentice' && (
                <Link href="/mentors">
                  <Button className="mt-4" size="sm">Buscar mentor de desarrollo</Button>
                </Link>
              )}
              {profile?.role === 'mentor' && (
                <p className="text-xs text-gray-400 mt-2">
                  Cuando confirmes solicitudes, aparecerán aquí
                </p>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingSessions.map(session => {
                const other = profile?.role === 'mentor'
                  ? (session.apprentice as { full_name: string })
                  : (session.mentor as { full_name: string })
                return (
                  <li key={session.id} className="py-3">
                    <Link href={`/sessions/${session.id}`} className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{session.title}</p>
                        <p className="text-sm text-gray-500">
                          con {other?.full_name} ·{' '}
                          {new Date(session.scheduled_at).toLocaleDateString('es-PE', {
                            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge variant={statusColors[session.status]}>
                        {statusLabels[session.status]}
                      </Badge>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
