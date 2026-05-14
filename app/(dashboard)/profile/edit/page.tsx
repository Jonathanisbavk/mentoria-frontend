'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'

const SPECIALTIES_OPTIONS = [
  'JavaScript', 'TypeScript', 'React / Next.js', 'Vue / Nuxt',
  'Node.js / Express', 'Python', 'Django / FastAPI', 'Java / Spring Boot',
  'C# / .NET', 'SQL / PostgreSQL', 'MongoDB / NoSQL', 'Git / GitHub',
  'Docker / DevOps', 'AWS / Cloud', 'Algoritmos y estructuras de datos',
  'APIs REST / GraphQL', 'React Native / Flutter', 'Seguridad web', 'Testing / QA',
  'Diseño de sistemas',
]

const DAYS = [
  { key: 'monday',    label: 'Lunes' },
  { key: 'tuesday',   label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday',  label: 'Jueves' },
  { key: 'friday',    label: 'Viernes' },
  { key: 'saturday',  label: 'Sábado' },
  { key: 'sunday',    label: 'Domingo' },
]

type DaySlot = { enabled: boolean; start: string; end: string }
type AvailabilityState = Record<string, DaySlot>

function buildAvailabilityState(raw: Record<string, { start: string; end: string }> | null): AvailabilityState {
  return Object.fromEntries(
    DAYS.map(({ key }) => [
      key,
      {
        enabled: !!raw && key in raw,
        start: raw?.[key]?.start ?? '18:00',
        end:   raw?.[key]?.end   ?? '20:00',
      },
    ])
  )
}

function serializeAvailability(state: AvailabilityState): Record<string, { start: string; end: string }> {
  return Object.fromEntries(
    Object.entries(state)
      .filter(([, v]) => v.enabled)
      .map(([k, v]) => [k, { start: v.start, end: v.end }])
  )
}

export default function EditProfilePage() {
  return (
    <Suspense>
      <EditProfileContent />
    </Suspense>
  )
}

function EditProfileContent() {
  const { profile } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === '1'

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [specialties, setSpecialties] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState(0)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [availability, setAvailability] = useState<AvailabilityState>(buildAvailabilityState(null))
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name ?? '')
    setBio(profile.bio ?? '')

    fetch('/api/profile')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ mentorProfile }) => {
        if (mentorProfile) {
          setSpecialties(mentorProfile.specialties ?? [])
          setExperienceYears(mentorProfile.experience_years ?? 0)
          setLinkedinUrl(mentorProfile.linkedin_url ?? '')
          setAvailability(buildAvailabilityState(mentorProfile.availability ?? {}))
        }
      })
      .catch(() => {})
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        bio,
        specialties,
        experience_years: experienceYears,
        linkedin_url: linkedinUrl,
        availability: serializeAvailability(availability),
      }),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => router.push('/profile'), 1200)
  }

  function toggleSpecialty(s: string) {
    setSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function updateDay(key: string, patch: Partial<DaySlot>) {
    setAvailability(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  const isMentor = profile?.role === 'mentor'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {isWelcome && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <p className="font-semibold text-blue-800">¡Bienvenido a MentorIA! 🎉</p>
          <p className="text-sm text-blue-600 mt-1">
            Completa tu perfil para {isMentor ? 'que los aprendices puedan encontrarte' : 'encontrar mentores que se adapten a ti'}.
          </p>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información personal */}
        <Card>
          <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="name"
              label="Nombre completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Bio <span className="text-gray-400 font-normal">({bio.length}/300)</span>
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value.slice(0, 300))}
                rows={4}
                maxLength={300}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder={isMentor
                  ? 'Cuéntales a los aprendices tu experiencia, proyectos y en qué puedes ayudarles...'
                  : 'Cuéntanos en qué área estudias y qué temas quieres aprender...'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Datos de mentor */}
        {isMentor && (
          <>
            <Card>
              <CardHeader><CardTitle>Perfil de Mentor</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {/* Especialidades */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Especialidades en Desarrollo de Software
                    <span className="ml-2 text-xs text-gray-400">({specialties.length} seleccionadas)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES_OPTIONS.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpecialty(s)}
                        className="rounded-full px-3 py-1 text-sm font-medium transition-colors"
                        style={{
                          background: specialties.includes(s) ? '#0B2272' : '#F3F4F6',
                          color: specialties.includes(s) ? 'white' : '#374151',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  id="experience"
                  label="Años de experiencia en desarrollo"
                  type="number"
                  min={0}
                  max={20}
                  value={experienceYears}
                  onChange={e => setExperienceYears(parseInt(e.target.value) || 0)}
                />

                <Input
                  id="linkedin"
                  label="LinkedIn URL (opcional)"
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </CardContent>
            </Card>

            {/* Disponibilidad */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad Semanal</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Marca los días y horarios en que puedes dar mentorías.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {DAYS.map(({ key, label }) => {
                  const slot = availability[key]
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                      style={{
                        borderColor: slot.enabled ? '#0B2272' : '#E5E7EB',
                        background: slot.enabled ? '#F8F9FF' : 'white',
                      }}
                    >
                      {/* Toggle día */}
                      <button
                        type="button"
                        onClick={() => updateDay(key, { enabled: !slot.enabled })}
                        className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          borderColor: slot.enabled ? '#0B2272' : '#D1D5DB',
                          background: slot.enabled ? '#0B2272' : 'white',
                        }}
                      >
                        {slot.enabled && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <span
                        className="w-24 text-sm font-medium shrink-0"
                        style={{ color: slot.enabled ? '#0B2272' : '#9CA3AF' }}
                      >
                        {label}
                      </span>

                      {slot.enabled ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={e => updateDay(key, { start: e.target.value })}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none"
                          />
                          <span className="text-gray-400 text-sm">→</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={e => updateDay(key, { end: e.target.value })}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No disponible</span>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </>
        )}

        {saved && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ¡Perfil guardado! Redirigiendo...
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
