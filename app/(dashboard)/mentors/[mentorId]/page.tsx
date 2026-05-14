import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from '@/components/ui/star-rating'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink, BookOpen } from 'lucide-react'
import type { Profile, MentorProfile } from '@/lib/types/app'

type ReviewRow = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer: { full_name: string; avatar_url: string | null }
}

type Params = { params: Promise<{ mentorId: string }> }

export default async function MentorDetailPage({ params }: Params) {
  const { mentorId } = await params
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', mentorId)
    .single()
  const profile = profileData as Profile | null

  const { data: mentorProfileData } = await supabase
    .from('mentor_profiles')
    .select('*')
    .eq('id', mentorId)
    .single()
  const mentorProfile = mentorProfileData as MentorProfile | null

  if (!profile || !mentorProfile) notFound()

  const { data: reviewsData } = await supabase
    .from('feedback')
    .select(`
      *,
      reviewer:profiles!feedback_reviewer_id_fkey(full_name, avatar_url)
    `)
    .eq('reviewee_id', mentorId)
    .order('created_at', { ascending: false })
    .limit(10)
  const reviews = reviewsData as ReviewRow[] | null

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={mentorProfile.avg_rating} readonly />
                <span className="text-sm text-gray-500">
                  {mentorProfile.avg_rating.toFixed(1)} · {mentorProfile.session_count} sesiones
                </span>
              </div>
              {profile.bio && <p className="mt-3 text-gray-700">{profile.bio}</p>}

              <div className="flex flex-wrap gap-2 mt-4">
                {mentorProfile.specialties.map(s => (
                  <Badge key={s} variant="info">{s}</Badge>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span><strong>{mentorProfile.experience_years}</strong> años de exp.</span>
                {mentorProfile.linkedin_url && (
                  <a
                    href={mentorProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <ExternalLink size={14} />
                    LinkedIn
                  </a>
                )}
              </div>

              {user && user.id !== mentorId && (
                <Link href={`/sessions/new?mentor=${mentorId}`}>
                  <Button className="mt-4">
                    <BookOpen size={16} />
                    Agendar sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reseñas ({reviews?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!reviews?.length ? (
            <p className="text-gray-500 text-sm">Este mentor aún no tiene reseñas.</p>
          ) : (
            <ul className="divide-y divide-gray-100 space-y-0">
              {reviews.map(r => {
                const reviewer = r.reviewer as { full_name: string; avatar_url: string | null }
                return (
                  <li key={r.id} className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar src={reviewer?.avatar_url} name={reviewer?.full_name ?? 'U'} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{reviewer?.full_name}</p>
                          <StarRating value={r.rating} readonly size="sm" />
                        </div>
                        {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    </div>
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
