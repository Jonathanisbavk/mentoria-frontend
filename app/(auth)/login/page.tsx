'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useState } from 'react'

type Mode = 'google' | 'email-login' | 'email-signup'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [intendedRole, setIntendedRole] = useState<'apprentice' | 'mentor'>('apprentice')
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
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos'
          : error.message
      )
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
        data: { full_name: name, intended_role: intendedRole },
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #EEF1F9 0%, #ffffff 60%, #EEF1F9 100%)' }}
    >
      <div className="w-full max-w-md space-y-6">

        {/* Logo + título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/certus-logo.svg"
              alt="Certus"
              width={160}
              height={50}
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MentorIA · Certus</h1>
            <p className="mt-1 text-sm text-gray-500">
              Mentoría entre estudiantes de Diseño y Desarrollo de Software
            </p>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {success ? (
            <div className="p-8 text-center space-y-3">
              <div className="text-4xl">📧</div>
              <h2 className="font-semibold text-gray-900">¡Revisa tu correo!</h2>
              <p className="text-sm text-gray-500">{success}</p>
              <button
                onClick={() => { setSuccess(''); setMode('email-login') }}
                className="text-sm font-medium text-[#0B2272] hover:underline"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {(['google', 'email-login', 'email-signup'] as Mode[]).map((m) => {
                  const labels: Record<Mode, string> = {
                    'google': 'Google',
                    'email-login': 'Ingresar',
                    'email-signup': 'Registrarse',
                  }
                  return (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError('') }}
                      className="flex-1 py-3.5 text-sm font-medium transition-colors"
                      style={{
                        color: mode === m ? '#0B2272' : '#6B7280',
                        borderBottom: mode === m ? '2px solid #0B2272' : '2px solid transparent',
                        background: 'transparent',
                      }}
                    >
                      {labels[m]}
                    </button>
                  )
                })}
              </div>

              <div className="p-7 space-y-4">

                {/* ── Google ── */}
                {mode === 'google' && (
                  <div className="space-y-4">
                    <button
                      onClick={handleGoogle}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      <span>Continuar con Google</span>
                    </button>

                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <p className="text-center text-xs text-gray-400">
                      Recomendado — acceso con tu cuenta universitaria Google
                    </p>

                    <div className="relative flex items-center gap-3">
                      <div className="flex-1 border-t border-gray-100" />
                      <span className="text-xs text-gray-400">o usa correo</span>
                      <div className="flex-1 border-t border-gray-100" />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setMode('email-login')}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        Iniciar sesión
                      </button>
                      <button
                        onClick={() => setMode('email-signup')}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        Registrarse
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Email Login ── */}
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
                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: '#0B2272' }}
                    >
                      {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                    <p className="text-center text-xs text-gray-500">
                      ¿No tienes cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('email-signup')}
                        className="font-semibold hover:underline"
                        style={{ color: '#0B2272' }}
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  </form>
                )}

                {/* ── Email Signup ── */}
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

                    {/* Selector de rol */}
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">¿Cuál es tu rol?</p>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'apprentice', icon: '🎓', label: 'Aprendiz', desc: 'Busco un mentor' },
                          { value: 'mentor', icon: '👨‍💻', label: 'Mentor', desc: 'Quiero enseñar' },
                        ] as const).map(({ value, icon, label, desc }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setIntendedRole(value)}
                            className="flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm transition-all"
                            style={{
                              borderColor: intendedRole === value ? '#0B2272' : '#E5E7EB',
                              background: intendedRole === value ? '#EEF1F9' : 'white',
                              color: intendedRole === value ? '#0B2272' : '#374151',
                            }}
                          >
                            <span className="text-xl">{icon}</span>
                            <span className="font-semibold">{label}</span>
                            <span className="text-xs text-gray-500">{desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: '#0B2272' }}
                    >
                      {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                    <p className="text-center text-xs text-gray-500">
                      ¿Ya tienes cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('email-login')}
                        className="font-semibold hover:underline"
                        style={{ color: '#0B2272' }}
                      >
                        Inicia sesión
                      </button>
                    </p>
                  </form>
                )}

              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '💻', text: 'Aprende a programar' },
            { icon: '📅', text: 'Agenda sesiones' },
            { icon: '⭐', text: 'Califica mentores' },
          ].map(({ icon, text }) => (
            <div key={text} className="rounded-xl bg-white border border-gray-200 p-3 shadow-sm">
              <div className="text-2xl">{icon}</div>
              <p className="mt-1 text-xs text-gray-600 font-medium">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
