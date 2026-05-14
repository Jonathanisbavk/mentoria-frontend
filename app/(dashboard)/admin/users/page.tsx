import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminRoleSelector } from './admin-role-selector'
import type { Profile } from '@/lib/types/app'

const roleColors: Record<string, 'info' | 'success' | 'warning'> = {
  admin: 'warning',
  mentor: 'success',
  apprentice: 'info',
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  mentor: 'Mentor',
  apprentice: 'Aprendiz',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: usersData } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  const users = usersData as Profile[] | null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Todos los usuarios ({users?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-700">Usuario</th>
                  <th className="pb-3 font-medium text-gray-700">Rol actual</th>
                  <th className="pb-3 font-medium text-gray-700">Registrado</th>
                  <th className="pb-3 font-medium text-gray-700">Cambiar rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map(user => (
                  <tr key={user.id} className="py-3">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar_url} name={user.full_name || 'U'} size="sm" />
                        <span className="font-medium text-gray-900">{user.full_name || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3">
                      <AdminRoleSelector userId={user.id} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
