'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GraduationCap } from 'lucide-react'
import { useState } from 'react'

type Mode = 'google' | 'email-login' | 'email-signup'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  async function handleGoogle() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    })
    if (error) {
      setError(`Error al conectar con Google: ${error.message}`)
      setLoading(false)
    }
    // Si no hay error, el navegador redirige automáticamente a Google
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Correo o contraseña incorrectos'
        : error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('¡Revisa tu correo! Te enviamos un enlace de verificación.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MentorIA</h1>
          <p className="mt-2 text-gray-600">
            Conecta con mentores y acelera tu crecimiento académico
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
          {success ? (
            <div className="rounded-lg bg-green-50 p-4 text-center text-green-800 text-sm">
              {success}
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => { setMode('google'); setError('') }}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    mode === 'google' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => { setMode('email-login'); setError('') }}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    mode === 'email-login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Ingresar
                </button>
                <button
                  onClick={() => { setMode('email-signup'); setError('') }}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    mode === 'email-signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Google */}
              {mode === 'google' && (
                <div className="space-y-3">
                  <Button onClick={handleGoogle} loading={loading} size="lg" className="w-full gap-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </Button>
                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <p className="text-center text-xs text-gray-400">
                    Recomendado — acceso instantáneo con tu cuenta universitaria
                  </p>
                </div>
              )}

              {/* Email Login */}
              {mode === 'email-login' && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <Input
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    autoComplete="email"
                  />
                  <Input
                    id="password"
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" loading={loading} size="lg" className="w-full">
                    Iniciar sesión
                  </Button>
                  <p className="text-center text-xs text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('email-signup')}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </form>
              )}

              {/* Email Signup */}
              {mode === 'email-signup' && (
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <Input
                    id="name"
                    label="Nombre completo"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    required
                    autoComplete="name"
                  />
                  <Input
                    id="email-reg"
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    autoComplete="email"
                  />
                  <Input
                    id="password-reg"
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" loading={loading} size="lg" className="w-full">
                    Crear cuenta
                  </Button>
                  <p className="text-center text-xs text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('email-login')}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 text-center text-sm text-gray-600">
          {[
            { icon: '🎓', text: 'Aprende de expertos' },
            { icon: '📅', text: 'Agenda sesiones' },
            { icon: '⭐', text: 'Califica mentores' },
          ].map(({ icon, text }) => (
            <div key={text} className="rounded-xl bg-white p-3 shadow-sm border border-gray-100">
              <div className="text-2xl">{icon}</div>
              <p className="mt-1 text-xs">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
