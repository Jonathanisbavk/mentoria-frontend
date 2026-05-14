'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const SPECIALTIES_OPTIONS = [
  'Matemáticas', 'Programación', 'Diseño', 'Inglés', 'Física',
  'Química', 'Estadística', 'Base de Datos', 'Redes', 'Electrónica',
]

export default function EditProfilePage() {
  const { profile } = useSupabase()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [specialties, setSpecialties] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState(0)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [loading, setLoading] = useState(false)

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
        }
      })
      .catch(() => {})
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        bio,
        specialties,
        experience_years: experienceYears,
        linkedin_url: linkedinUrl,
      }),
    })
    setLoading(false)
    router.push('/profile')
  }

  function toggleSpecialty(s: string) {
    setSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
          </CardContent>
        </Card>

        {profile?.role === 'mentor' && (
          <Card>
            <CardHeader><CardTitle>Datos de Mentor</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        specialties.includes(s)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="experience"
                label="Años de experiencia"
                type="number"
                min={0}
                value={experienceYears}
                onChange={e => setExperienceYears(parseInt(e.target.value))}
              />
              <Input
                id="linkedin"
                label="LinkedIn URL"
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </CardContent>
          </Card>
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
