'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'

type MentorInfo = {
  id: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  mentorProfile: {
    specialties: string[]
    avg_rating: number
    experience_years: number
  } | null
}

type MentorListItem = {
  id: string
  specialties: string[]
  avg_rating: number
  experience_years: number
  profiles: { id: string; full_name: string; avatar_url: string | null; bio: string | null }
}

function NewSessionForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mentorIdFromUrl = searchParams.get('mentor')

  const [mentor, setMentor] = useState<MentorInfo | null>(null)
  const [mentors, setMentors] = useState<MentorListItem[]>([])
  const [mentorSearch, setMentorSearch] = useState('')
  const [loadingMentors, setLoadingMentors] = useState(false)
  const [step, setStep] = useState<'select-mentor' | 'fill-form'>(
    mentorIdFromUrl ? 'fill-form' : 'select-mentor'
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar mentor desde URL param
  useEffect(() => {
    if (!mentorIdFromUrl) return
    fetch(`/api/mentors/${mentorIdFromUrl}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: MentorInfo) => { if (data.id) setMentor(data) })
      .catch(() => {})
  }, [mentorIdFromUrl])

  // Buscar mentores
  useEffect(() => {
    if (step !== 'select-mentor') return
    setLoadingMentors(true)
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      if (mentorSearch) params.set('q', mentorSearch)
      fetch(`/api/mentors?${params}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => { setMentors(Array.isArray(data) ? data : []); setLoadingMentors(false) })
        .catch(() => setLoadingMentors(false))
    }, 300)
    return () => clearTimeout(t)
  }, [mentorSearch, step])

  function selectMentor(m: MentorListItem) {
    setMentor({
      id: m.profiles.id,
      full_name: m.profiles.full_name,
      avatar_url: m.profiles.avatar_url,
      bio: m.profiles.bio,
      mentorProfile: {
        specialties: m.specialties,
        avg_rating: m.avg_rating,
        experience_years: m.experience_years,
      },
    })
    setStep('fill-form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mentor) { setError('Selecciona un mentor'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentor_id: mentor.id,
        title,
        description,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: duration,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al crear la sesión')
      setLoading(false)
      return
    }

    router.push('/sessions?success=created')
  }

  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 1)
  const minDateStr = minDate.toISOString().slice(0, 16)

  // Step 1: Seleccionar mentor
  if (step === 'select-mentor') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/sessions" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Seleccionar Mentor</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={mentorSearch}
            onChange={e => setMentorSearch(e.target.value)}
            placeholder="Buscar mentor por nombre..."
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {loadingMentors ? (
          <div className="text-center py-8 text-gray-400">Cargando mentores...</div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No se encontraron mentores</div>
        ) : (
          <div className="space-y-3">
            {mentors.map(m => (
              <button
                key={m.id}
                onClick={() => selectMentor(m)}
                className="w-full text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={m.profiles.avatar_url} name={m.profiles.full_name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{m.profiles.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={m.avg_rating} readonly size="sm" />
                      <span className="text-xs text-gray-500">{m.experience_years} años exp.</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {m.specialties.slice(0, 2).map(s => (
                      <Badge key={s} variant="info" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Step 2: Formulario de sesión
  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setStep('select-mentor'); setMentor(null) }}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Agendar Sesión</h1>
      </div>

      {mentor && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar src={mentor.avatar_url} name={mentor.full_name} />
              <div>
                <p className="font-semibold text-gray-900">{mentor.full_name}</p>
                {mentor.mentorProfile && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {mentor.mentorProfile.specialties.slice(0, 3).map(s => (
                      <Badge key={s} variant="info" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => { setStep('select-mentor'); setMentor(null) }}
                className="ml-auto text-xs text-indigo-600 hover:underline"
              >
                Cambiar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardHeader><CardTitle>Detalles de la sesión</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="title"
              label="Tema de la sesión"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Ayuda con Álgebra Lineal — parcial próximo viernes"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                ¿Qué necesitas? <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Describe brevemente en qué necesitas ayuda..."
              />
            </div>

            <Input
              id="date"
              label="Fecha y hora"
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={minDateStr}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Duración</label>
              <select
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {[30, 45, 60, 90, 120].map(d => (
                  <option key={d} value={d}>{d} minutos</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          📅 Cuando el mentor confirme, se creará automáticamente un evento en Google Calendar con enlace de Google Meet.
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Enviar solicitud
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewSessionPage() {
  return (
    <Suspense>
      <NewSessionForm />
    </Suspense>
  )
}
