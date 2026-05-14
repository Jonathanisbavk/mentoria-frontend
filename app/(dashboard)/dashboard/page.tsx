import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CalendarDays, Users, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
            ? 'Gestiona tus mentorías y aprendices'
            : 'Encuentra mentores y agenda tus sesiones'}
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
                  <Button className="mt-4" size="sm">Buscar mentores</Button>
                </Link>
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
