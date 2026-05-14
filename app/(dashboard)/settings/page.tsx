import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CalendarDays, CheckCircle } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const hasCalendar = !!profile?.google_calendar_token

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Link href="/profile/edit">
              <Button variant="secondary" size="sm">Editar perfil</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays size={20} />
            Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Conecta tu Google Calendar para que las sesiones agendadas aparezcan automáticamente
            en tu calendario y recibas recordatorios.
          </p>

          {hasCalendar ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Calendar conectado</p>
                <p className="text-xs text-green-700">
                  Las sesiones confirmadas se agregarán automáticamente a tu calendario
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-600">No has conectado Google Calendar aún.</p>
              </div>
              <Link href="/api/auth/google-calendar">
                <Button variant="secondary">
                  <CalendarDays size={16} />
                  Conectar Google Calendar
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Zona Horaria</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">{profile?.timezone}</p>
              <p className="text-xs text-gray-500">Todas las sesiones se muestran en esta zona horaria</p>
            </div>
            <Badge variant="default">América/Lima</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
