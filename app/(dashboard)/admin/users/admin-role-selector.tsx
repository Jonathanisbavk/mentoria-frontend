'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = { userId: string; currentRole: string }

export function AdminRoleSelector({ userId, currentRole }: Props) {
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(newRole: string) {
    if (newRole === role) return
    setLoading(true)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })
    setRole(newRole)
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className="h-8 rounded-lg border border-gray-300 px-2 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-50"
    >
      <option value="apprentice">Aprendiz</option>
      <option value="mentor">Mentor</option>
      <option value="admin">Admin</option>
    </select>
  )
}
