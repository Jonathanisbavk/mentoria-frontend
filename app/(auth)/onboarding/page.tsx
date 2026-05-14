'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Role = 'apprentice' | 'mentor'

const ROLES = [
  {
    value: 'apprentice' as Role,
    icon: '🎓',
    title: 'Soy Aprendiz',
    description: 'Estoy en ciclos iniciales y busco orientación de estudiantes avanzados para mejorar mis habilidades.',
    features: ['Busca mentores por especialidad', 'Agenda sesiones de estudio', 'Recibe feedback personalizado'],
  },
  {
    value: 'mentor' as Role,
    icon: '👨‍💻',
    title: 'Soy Mentor',
    description: 'Estoy en ciclos avanzados y quiero compartir mi experiencia con estudiantes que recién comienzan.',
    features: ['Crea tu perfil profesional', 'Define tu disponibilidad horaria', 'Gana reputación con calificaciones'],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: selected }),
    })

    if (!res.ok) {
      setError('Ocurrió un error. Intenta de nuevo.')
      setLoading(false)
      return
    }

    router.push('/profile/edit?welcome=1')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #EEF1F9 0%, #ffffff 60%, #EEF1F9 100%)' }}
    >
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Image src="/certus-logo.svg" alt="Certus" width={140} height={44} priority />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido a MentorIA!</h1>
          <p className="text-gray-500">Para personalizar tu experiencia, dinos cómo participarás en la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map(({ value, icon, title, description, features }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className="text-left rounded-2xl border-2 p-6 transition-all space-y-4"
              style={{
                borderColor: selected === value ? '#0B2272' : '#E5E7EB',
                background: selected === value ? '#EEF1F9' : 'white',
                boxShadow: selected === value ? '0 0 0 3px rgba(11,34,114,0.1)' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{icon}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{title}</h2>
                </div>
                {selected === value && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#0B2272' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">{description}</p>

              <ul className="space-y-1.5">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#0B2272' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full h-12 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#0B2272' }}
        >
          {loading ? 'Configurando tu cuenta...' : 'Continuar →'}
        </button>
      </div>
    </div>
  )
}
