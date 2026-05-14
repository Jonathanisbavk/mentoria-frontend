'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useSupabase } from '@/components/providers/supabase-provider'
import { CalendarDays, Plus } from 'lucide-react'

type Tab = 'upcoming' | 'completed' | 'cancelled'

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

type SessionData = {
  id: string
  title: string
  scheduled_at: string
  status: string
  duration_minutes: number
  mentor_id: string
  mentor: { id: string; full_name: string; avatar_url: string | null }
  apprentice: { id: string; full_name: string; avatar_url: string | null }
}

export default function SessionsPage() {
  const { profile } = useSupabase()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('upcoming')

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setSessions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date().toISOString()

  const filtered = sessions.filter(s => {
    if (tab === 'upcoming') return ['pending', 'confirmed'].includes(s.status) && s.scheduled_at >= now
    if (tab === 'completed') return s.status === 'completed'
    if (tab === 'cancelled') return s.status === 'cancelled' || (s.scheduled_at < now && s.status !== 'completed')
    return false
  })

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'Próximas' },
    { key: 'completed', label: 'Completadas' },
    { key: 'cancelled', label: 'Canceladas' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
          <p className="text-gray-500">Gestiona tus mentorías</p>
        </div>
        {profile?.role === 'apprentice' && (
          <Link href="/sessions/new">
            <Button size="sm">
              <Plus size={16} />
              Nueva sesión
            </Button>
          </Link>
        )}
      </div>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">No hay sesiones en esta sección</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(session => {
            const other = profile?.role === 'mentor' ? session.apprentice : session.mentor
            return (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar src={other.avatar_url} name={other.full_name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{session.title}</p>
                        <p className="text-sm text-gray-500">
                          con {other.full_name} ·{' '}
                          {new Date(session.scheduled_at).toLocaleDateString('es-PE', {
                            weekday: 'long', day: 'numeric', month: 'long',
                            hour: '2-digit', minute: '2-digit'
                          })}
                          {' · '}{session.duration_minutes} min
                        </p>
                      </div>
                      <Badge variant={statusColors[session.status]}>
                        {statusLabels[session.status]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
