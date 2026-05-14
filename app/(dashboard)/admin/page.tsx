import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Users, CalendarDays, Star, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalMentors },
    { count: totalSessions },
    { count: completedSessions },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ])

  const stats = [
    { label: 'Total usuarios', value: totalUsers ?? 0, icon: Users, color: 'indigo' },
    { label: 'Mentores activos', value: totalMentors ?? 0, icon: GraduationCap, color: 'green' },
    { label: 'Total sesiones', value: totalSessions ?? 0, icon: CalendarDays, color: 'yellow' },
    { label: 'Sesiones completadas', value: completedSessions ?? 0, icon: Star, color: 'purple' },
  ]

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona usuarios, sesiones y la plataforma</p>
        </div>
        <Link href="/admin/users">
          <Button variant="secondary" size="sm">Gestionar usuarios</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${colorMap[color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
