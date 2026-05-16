'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSupabase } from '@/components/providers/supabase-provider'
import { CalendarDays, Plus, Check, X } from 'lucide-react'

type Tab = 'solicitudes' | 'upcoming' | 'completed' | 'cancelled'

const statusColors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  pending:   'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
}

const statusLabels: Record<string, string> = {
  pending:   'Pendiente',
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
  mentor:     { id: string; full_name: string; avatar_url: string | null }
  apprentice: { id: string; full_name: string; avatar_url: string | null }
}

export default function SessionsPage() {
  const { profile } = useSupabase()
  const isMentor = profile?.role === 'mentor'

  const [sessions, setSessions]         = useState<SessionData[]>([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState<Tab>('upcoming')
  const [refreshKey, setRefreshKey]     = useState(0)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const initialTabSet = useRef(false)

  // Set default tab to 'solicitudes' for mentors on first profile load
  useEffect(() => {
    if (profile && !initialTabSet.current) {
      initialTabSet.current = true
      if (profile.role === 'mentor') setTab('solicitudes')
    }
  }, [profile])

  useEffect(() => {
    setLoading(true)
    fetch('/api/sessions')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setSessions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [refreshKey])

  async function confirmSession(sessionId: string) {
    setLoadingAction(sessionId + '-confirm')
    const res = await fetch(`/api/sessions/${sessionId}/confirm`, { method: 'POST' })
    setLoadingAction(null)
    if (res.ok) {
      toast.success('¡Sesión confirmada! El aprendiz será notificado.')
      setRefreshKey(k => k + 1)
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error((d as { error?: string }).error ?? 'Error al confirmar la sesión')
    }
  }

  async function rejectSession(sessionId: string) {
    setLoadingAction(sessionId + '-reject')
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setLoadingAction(null)
    if (res.ok) {
      toast.success('Solicitud rechazada')
      setRefreshKey(k => k + 1)
    } else {
      toast.error('Error al rechazar la solicitud')
    }
  }

  const now = new Date().toISOString()

  const filtered = sessions.filter(s => {
    if (tab === 'solicitudes') return s.status === 'pending' && s.scheduled_at >= now
    if (tab === 'upcoming') {
      if (isMentor) return s.status === 'confirmed' && s.scheduled_at >= now
      return ['pending', 'confirmed'].includes(s.status) && s.scheduled_at >= now
    }
    if (tab === 'completed') return s.status === 'completed'
    if (tab === 'cancelled') return s.status === 'cancelled'
    return false
  })

  const pendingCount = sessions.filter(s => s.status === 'pending' && s.scheduled_at >= now).length

  const allTabs: { key: Tab; label: string; mentorOnly?: boolean }[] = [
    { key: 'solicitudes', label: 'Solicitudes', mentorOnly: true },
    { key: 'upcoming',    label: 'Próximas' },
    { key: 'completed',   label: 'Completadas' },
    { key: 'cancelled',   label: 'Canceladas' },
  ]
  const visibleTabs = allTabs.filter(t => !t.mentorOnly || isMentor)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isMentor ? 'Mis Mentorías' : 'Mis Sesiones'}
          </h1>
          <p className="text-gray-500">
            {isMentor ? 'Gestiona tus sesiones y solicitudes de aprendices' : 'Gestiona tus mentorías'}
          </p>
        </div>
        {!isMentor && (
          <Link href="/sessions/new">
            <Button size="sm">
              <Plus size={16} />
              Nueva sesión
            </Button>
          </Link>
        )}
      </div>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {visibleTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
            {t.key === 'solicitudes' && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
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
          {tab === 'solicitudes' ? (
            <>
              <p className="text-gray-500">No tienes solicitudes pendientes</p>
              <p className="text-xs text-gray-400 mt-1">Cuando un aprendiz solicite una sesión contigo, aparecerá aquí</p>
            </>
          ) : (
            <p className="text-gray-500">No hay sesiones en esta sección</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(session => {
            const other = isMentor ? session.apprentice : session.mentor
            const isPending = session.status === 'pending'

            return (
              <Card
                key={session.id}
                className={isPending && isMentor ? 'border-amber-200 bg-amber-50/50' : ''}
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    <Avatar src={other.avatar_url} name={other.full_name} />
                    <Link href={`/sessions/${session.id}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                      <p className="font-medium text-gray-900 truncate">{session.title}</p>
                      <p className="text-sm text-gray-500">
                        con {other.full_name} ·{' '}
                        {new Date(session.scheduled_at).toLocaleDateString('es-PE', {
                          weekday: 'long', day: 'numeric', month: 'long',
                          hour: '2-digit', minute: '2-digit'
                        })}
                        {' · '}{session.duration_minutes} min
                      </p>
                    </Link>

                    {/* Acciones inline para mentor en solicitudes */}
                    {isMentor && isPending ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => rejectSession(session.id)}
                          disabled={loadingAction !== null}
                          title="Rechazar"
                          className="w-8 h-8 rounded-full flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {loadingAction === session.id + '-reject'
                            ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            : <X size={14} />
                          }
                        </button>
                        <button
                          onClick={() => confirmSession(session.id)}
                          disabled={loadingAction !== null}
                          title="Confirmar"
                          className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#0B2272] text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {loadingAction === session.id + '-confirm'
                            ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                            : <Check size={13} />
                          }
                          Confirmar
                        </button>
                      </div>
                    ) : (
                      <Badge variant={statusColors[session.status]}>
                        {statusLabels[session.status]}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
