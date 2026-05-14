import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: mentorProfile } = await supabase.from('mentor_profiles').select('*').eq('id', user.id).single()

  const roleLabel = { admin: 'Administrador', mentor: 'Mentor', apprentice: 'Aprendiz' }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <Link href="/profile/edit">
          <Button variant="secondary" size="sm">
            <Pencil size={14} />
            Editar
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar src={profile?.avatar_url} name={profile?.full_name || 'U'} size="xl" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Badge className="mt-2" variant="info">
                {roleLabel[profile?.role ?? 'apprentice']}
              </Badge>
              {profile?.bio && (
                <p className="mt-3 text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {mentorProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de Mentor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {mentorProfile.specialties.map(s => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-2">
                  <StarRating value={mentorProfile.avg_rating} readonly size="sm" />
                  <span className="text-sm font-medium">{mentorProfile.avg_rating.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sesiones completadas</p>
                <p className="font-semibold">{mentorProfile.session_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Años de experiencia</p>
                <p className="font-semibold">{mentorProfile.experience_years}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
