'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  sessionId: string
  status: string
  isMentor: boolean
  isApprentice: boolean
}

export function SessionActions({ sessionId, status, isMentor, isApprentice }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setLoading('confirm')
    setError(null)
    const res = await fetch(`/api/sessions/${sessionId}/confirm`, { method: 'POST' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError((d as { error?: string }).error ?? 'Error al confirmar la sesión')
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  async function updateStatus(newStatus: string) {
    setLoading(newStatus)
    setError(null)
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError((d as { error?: string }).error ?? 'Error al actualizar la sesión')
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  if (status === 'cancelled' || status === 'completed') return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          {isMentor && status === 'pending' && (
            <Button onClick={confirm} loading={loading === 'confirm'}>
              Confirmar sesión
            </Button>
          )}
          {status === 'confirmed' && (
            <Button onClick={() => updateStatus('completed')} loading={loading === 'completed'}>
              Marcar como completada
            </Button>
          )}
          {(status === 'pending' || status === 'confirmed') && (
            <Button
              variant="danger"
              onClick={() => updateStatus('cancelled')}
              loading={loading === 'cancelled'}
            >
              Cancelar sesión
            </Button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  )
}
