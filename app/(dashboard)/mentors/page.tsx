'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { StarRating } from '@/components/ui/star-rating'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Search } from 'lucide-react'

const SPECIALTIES = [
  'Todos', 'Matemáticas', 'Programación', 'Diseño', 'Inglés',
  'Física', 'Química', 'Estadística', 'Base de Datos',
]

type MentorResult = {
  id: string
  specialties: string[]
  avg_rating: number
  session_count: number
  experience_years: number
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
    bio: string | null
  }
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorResult[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('Todos')

  const fetchMentors = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (specialty !== 'Todos') params.set('specialty', specialty)
    try {
      const res = await fetch(`/api/mentors?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMentors(Array.isArray(data) ? data : [])
    } catch {
      setMentors([])
    } finally {
      setLoading(false)
    }
  }, [query, specialty])

  useEffect(() => {
    const t = setTimeout(fetchMentors, 300)
    return () => clearTimeout(t)
  }, [fetchMentors])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buscar Mentores</h1>
        <p className="text-gray-500">Encuentra el mentor ideal para tu área de estudio</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.map(s => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              specialty === s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No se encontraron mentores con esos filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map(mentor => (
            <Link key={mentor.id} href={`/mentors/${mentor.profiles.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={mentor.profiles.avatar_url}
                      name={mentor.profiles.full_name}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {mentor.profiles.full_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRating value={mentor.avg_rating} readonly size="sm" />
                        <span className="text-xs text-gray-500">
                          ({mentor.session_count})
                        </span>
                      </div>
                    </div>
                  </div>

                  {mentor.profiles.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{mentor.profiles.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {mentor.specialties.slice(0, 3).map(s => (
                      <Badge key={s} variant="info" className="text-xs">{s}</Badge>
                    ))}
                    {mentor.specialties.length > 3 && (
                      <Badge variant="default" className="text-xs">+{mentor.specialties.length - 3}</Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">{mentor.experience_years} años de experiencia</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
