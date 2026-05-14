'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { StarRating } from '@/components/ui/star-rating'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FeedbackPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Selecciona una calificación'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, rating, comment }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al enviar reseña')
      setLoading(false)
      return
    }

    router.push('/sessions')
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dejar Reseña</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>¿Cómo fue tu mentoría?</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Calificación</p>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Comparte tu experiencia con la mentoría..."
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Publicar reseña
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
