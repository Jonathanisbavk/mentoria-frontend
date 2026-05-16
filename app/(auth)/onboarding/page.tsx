'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

// ─── Datos de referencia ──────────────────────────────────────────────────────

const SPECIALTIES = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Python', 'Java', 'Node.js', 'PHP', 'C#',
  'SQL', 'MongoDB', 'Docker', 'Git', 'AWS',
  'Figma', 'UI/UX', 'CSS/Tailwind', 'REST APIs', 'Testing',
]

const CAREERS = [
  'Desarrollo de Software',
  'Diseño Gráfico',
  'Marketing Digital',
  'Administración de Empresas',
  'Contabilidad',
  'Otro',
]

const GOALS = [
  'Aprender a programar',
  'Mejorar en frontend',
  'Backend y bases de datos',
  'Conseguir mis primeras prácticas',
  'Diseño UI/UX',
  'Crear mi portafolio',
  'Metodologías ágiles',
  'Preparar certificaciones',
]

const DAYS = [
  { key: 'monday',    label: 'Lun' },
  { key: 'tuesday',   label: 'Mar' },
  { key: 'wednesday', label: 'Mié' },
  { key: 'thursday',  label: 'Jue' },
  { key: 'friday',    label: 'Vie' },
  { key: 'saturday',  label: 'Sáb' },
  { key: 'sunday',    label: 'Dom' },
]

const TIME_BLOCKS = [
  { id: 'morning',   icon: '🌅', label: 'Mañana',  range: '8:00 – 12:00',  start: '08:00', end: '12:00' },
  { id: 'afternoon', icon: '☀️',  label: 'Tarde',   range: '12:00 – 18:00', start: '12:00', end: '18:00' },
  { id: 'evening',   icon: '🌙', label: 'Noche',   range: '18:00 – 22:00', start: '18:00', end: '22:00' },
]

const TOTAL_STEPS = 4

const STEP_TITLES: Record<number, string> = {
  0: 'Elige tu rol',
  1: 'Información personal',
  2: 'Tus detalles',
  3: 'Disponibilidad',
}

function getStepTitle(step: number, role: Role | null): string {
  if (step === 1) return role === 'mentor' ? 'Perfil profesional' : 'Cuéntanos de ti'
  if (step === 2) return role === 'mentor' ? 'Tus especialidades' : 'Nivel y objetivos'
  return STEP_TITLES[step] ?? `Paso ${step + 1}`
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Role = 'apprentice' | 'mentor'

type WizardData = {
  role: Role | null
  full_name: string
  bio: string
  career: string
  level: string
  goals: string[]
  specialties: string[]
  experience_years: number
  linkedin_url: string
  available_days: string[]
  time_block: string
}

const INITIAL: WizardData = {
  role: null,
  full_name: '',
  bio: '',
  career: '',
  level: '',
  goals: [],
  specialties: [],
  experience_years: 1,
  linkedin_url: '',
  available_days: [],
  time_block: '',
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)

  // Pre-llenar nombre y rol desde auth metadata
  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''
        const raw = user.user_metadata?.intended_role
        const intendedRole: Role | null =
          raw === 'apprentice' || raw === 'mentor' ? raw : null
        setData(d => ({
          ...d,
          ...(name && { full_name: name }),
          ...(intendedRole && { role: intendedRole }),
        }))
      }
    })
  }, [])

  function update(partial: Partial<WizardData>) {
    setData(prev => ({ ...prev, ...partial }))
  }

  function toggle(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!data.role
      case 1:
        if (!data.full_name.trim()) return false
        return data.role === 'mentor' ? true : !!data.career
      case 2:
        if (data.role === 'apprentice') return !!data.level && data.goals.length > 0
        return data.specialties.length > 0
      case 3: return data.available_days.length > 0 && !!data.time_block
      default: return true
    }
  }

  async function handleSubmit() {
    setSubmitting(true)

    // Construir bio para aprendiz desde sus respuestas
    let bio = data.bio
    if (data.role === 'apprentice') {
      const parts: string[] = []
      if (data.career) parts.push(`Estudio ${data.career}`)
      if (data.level) parts.push(`nivel ${data.level.toLowerCase()}`)
      if (data.goals.length) parts.push(`Objetivos: ${data.goals.join(', ')}`)
      bio = parts.join('. ')
    }

    // Construir disponibilidad desde días + bloque horario
    const block = TIME_BLOCKS.find(b => b.id === data.time_block)
    const availability: Record<string, { start: string; end: string }> = {}
    if (block) {
      data.available_days.forEach(day => {
        availability[day] = { start: block.start, end: block.end }
      })
    }

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.role,
          full_name: data.full_name.trim(),
          bio,
          ...(data.role === 'mentor' && {
            specialties: data.specialties,
            experience_years: data.experience_years,
            linkedin_url: data.linkedin_url.trim() || null,
            availability,
          }),
        }),
      })

      if (!res.ok) throw new Error()
      setStep(TOTAL_STEPS) // pantalla de éxito
    } catch {
      toast.error('Ocurrió un error al guardar. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const isLastStep = step === TOTAL_STEPS - 1
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #EEF1F9 0%, #ffffff 60%, #EEF1F9 100%)' }}
    >
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/certus-logo.svg" alt="Certus Mentoría" width={120} height={38} priority />
        </div>

        {/* Barra de progreso */}
        {step < TOTAL_STEPS && (
          <div className="mb-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-700">
                  {getStepTitle(step, data.role)}
                </span>
                {step > 0 && data.role && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#EEF1F9', color: '#0B2272' }}
                  >
                    <span>{data.role === 'mentor' ? '👨‍💻' : '🎓'}</span>
                    {data.role === 'mentor' ? 'Mentor' : 'Aprendiz'}
                  </span>
                )}
              </div>
              <span className="text-gray-400 shrink-0">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #091A5A, #0B2272)' }}
              />
            </div>
            <div className="flex justify-between px-0.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    i < step
                      ? 'bg-blue-900'
                      : i === step
                        ? 'bg-blue-700 scale-125'
                        : 'bg-gray-300'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tarjeta del paso */}
        <div key={step} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          {step === 0 && <StepRole data={data} update={update} />}
          {step === 1 && <StepPersonal data={data} update={update} />}
          {step === 2 && <StepDetails data={data} update={update} toggle={toggle} />}
          {step === 3 && <StepAvailability data={data} update={update} toggle={toggle} />}
          {step === TOTAL_STEPS && (
            <StepDone role={data.role!} onGo={() => router.push('/dashboard')} />
          )}
        </div>

        {/* Navegación */}
        {step < TOTAL_STEPS && (
          <div className={cn('mt-4 flex gap-3', step === 0 && 'justify-end')}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-5 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
            )}
            <button
              onClick={isLastStep ? handleSubmit : () => setStep(s => s + 1)}
              disabled={!canProceed() || submitting}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#0B2272' }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : isLastStep ? (
                <>Guardar y continuar <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Continuar <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tipos compartidos entre pasos ────────────────────────────────────────────

type StepProps = {
  data: WizardData
  update: (p: Partial<WizardData>) => void
}

type ToggleStepProps = StepProps & {
  toggle: (arr: string[], item: string) => string[]
}

// ─── Paso 0: Rol ──────────────────────────────────────────────────────────────

function StepRole({ data, update }: StepProps) {
  const roles = [
    {
      value: 'apprentice' as Role,
      icon: '🎓',
      title: 'Soy Aprendiz',
      subtitle: 'Ciclos iniciales — busco orientación',
      features: ['Accede a mentores verificados', 'Agenda sesiones de estudio', 'Recibe feedback personalizado'],
    },
    {
      value: 'mentor' as Role,
      icon: '👨‍💻',
      title: 'Soy Mentor',
      subtitle: 'Ciclos avanzados — quiero enseñar',
      features: ['Crea tu perfil profesional', 'Define tu disponibilidad', 'Gana reputación y experiencia'],
    },
  ]

  const preselected = !!data.role

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1.5">
        <h1 className="text-xl font-bold text-gray-900">¡Bienvenido a MentorIA!</h1>
        <p className="text-sm text-gray-500">
          {preselected
            ? 'Confirma tu rol o cámbialo si lo necesitas.'
            : '¿Cómo participarás en la plataforma?'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map(({ value, icon, title, subtitle, features }) => {
          const active = data.role === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => update({ role: value })}
              className={cn(
                'text-left rounded-xl border-2 p-5 transition-all space-y-3',
                active
                  ? 'border-blue-900 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-hidden>{icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    active ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{ background: '#0B2272' }}
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <ul className="space-y-1.5">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: active ? '#EEF1F9' : '#F9FAFB' }}
                    >
                      <svg className="w-2 h-2" style={{ color: '#0B2272' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      {preselected && (
        <p className="text-center text-xs text-gray-400">
          Puedes cambiar tu rol en cualquier momento desde esta pantalla.
        </p>
      )}
    </div>
  )
}

// ─── Paso 1: Info personal ────────────────────────────────────────────────────

function StepPersonal({ data, update }: StepProps) {
  const isMentor = data.role === 'mentor'

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">
          {isMentor ? 'Tu perfil profesional' : 'Cuéntanos sobre ti'}
        </h2>
        <p className="text-sm text-gray-500">
          {isMentor
            ? 'Esta información aparecerá en tu perfil público.'
            : 'Ayúdanos a personalizar tu experiencia.'}
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Nombre completo <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.full_name}
          onChange={e => update({ full_name: e.target.value })}
          placeholder="Tu nombre completo"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-colors"
        />
      </div>

      {/* Aprendiz: carrera */}
      {!isMentor && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ¿Qué carrera estudias? <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CAREERS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => update({ career: c })}
                className={cn(
                  'rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-all',
                  data.career === c
                    ? 'border-blue-900 bg-blue-50 font-semibold text-blue-900'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mentor: bio */}
      {isMentor && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Descripción breve{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={data.bio}
            onChange={e => update({ bio: e.target.value })}
            placeholder="Ej: Estudiante de 8vo ciclo especializado en desarrollo web. Me apasiona enseñar y ayudar a quienes recién comienzan..."
            rows={4}
            maxLength={300}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{data.bio.length}/300</p>
        </div>
      )}
    </div>
  )
}

// ─── Paso 2: Detalles ─────────────────────────────────────────────────────────

function StepDetails({ data, update, toggle }: ToggleStepProps) {
  const isApprentice = data.role === 'apprentice'

  return (
    <div className="space-y-5">
      {isApprentice ? (
        <>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Tu nivel y objetivos</h2>
            <p className="text-sm text-gray-500">Así conectamos mejor con tu mentor ideal.</p>
          </div>

          {/* Nivel */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nivel actual <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'Principiante', desc: '1er – 2do ciclo', icon: '🌱' },
                { value: 'Intermedio',   desc: '3er – 5to ciclo', icon: '🌿' },
                { value: 'Avanzado',     desc: '6to+ ciclo',      icon: '🌳' },
              ].map(({ value, desc, icon }) => {
                const active = data.level === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ level: value })}
                    className={cn(
                      'rounded-xl border-2 p-3 text-center transition-all space-y-1',
                      active ? 'border-blue-900 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="text-2xl">{icon}</div>
                    <p className={cn('text-xs font-semibold', active ? 'text-blue-900' : 'text-gray-700')}>
                      {value}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ¿Qué quieres lograr?{' '}
              <span className="text-red-400">*</span>
              <span className="text-gray-400 font-normal ml-1">(elige uno o más)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(g => {
                const active = data.goals.includes(g)
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update({ goals: toggle(data.goals, g) })}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      active
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
            {data.goals.length > 0 && (
              <p className="text-xs text-gray-400">{data.goals.length} seleccionado{data.goals.length > 1 ? 's' : ''}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Tus especialidades</h2>
            <p className="text-sm text-gray-500">¿En qué áreas puedes guiar a otros?</p>
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Especialidades <span className="text-red-400">*</span>
              <span className="text-gray-400 font-normal ml-1">(elige al menos 1)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(s => {
                const active = data.specialties.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ specialties: toggle(data.specialties, s) })}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      active
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            {data.specialties.length > 0 && (
              <p className="text-xs text-gray-400">{data.specialties.length} seleccionada{data.specialties.length > 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Años de experiencia */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Años de experiencia:{' '}
              <span className="font-bold" style={{ color: '#0B2272' }}>
                {data.experience_years} {data.experience_years === 1 ? 'año' : 'años'}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={data.experience_years}
              onChange={e => update({ experience_years: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-900"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Recién empezando</span>
              <span>10+ años</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Paso 3: Disponibilidad ───────────────────────────────────────────────────

function StepAvailability({ data, update, toggle }: ToggleStepProps) {
  const isMentor = data.role === 'mentor'

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Tu disponibilidad</h2>
        <p className="text-sm text-gray-500">
          {isMentor
            ? 'Indica cuándo estás disponible para dar mentorías.'
            : '¿Cuándo prefieres tener tus sesiones?'}
        </p>
      </div>

      {/* LinkedIn (solo mentor) */}
      {isMentor && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            LinkedIn{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="url"
            value={data.linkedin_url}
            onChange={e => update({ linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/tu-perfil"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-colors"
          />
        </div>
      )}

      {/* Días */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Días disponibles <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {DAYS.map(({ key, label }) => {
            const active = data.available_days.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ available_days: toggle(data.available_days, key) })}
                className={cn(
                  'w-11 h-11 rounded-xl border-2 text-xs font-semibold transition-all',
                  active
                    ? 'border-blue-900 bg-blue-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bloque horario */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Horario preferido <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_BLOCKS.map(({ id, icon, label, range }) => {
            const active = data.time_block === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => update({ time_block: id })}
                className={cn(
                  'rounded-xl border-2 p-3 text-center transition-all space-y-1',
                  active ? 'border-blue-900 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="text-2xl">{icon}</div>
                <p className={cn('text-xs font-semibold', active ? 'text-blue-900' : 'text-gray-700')}>
                  {label}
                </p>
                <p className="text-xs text-gray-400">{range}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Paso final: Éxito ────────────────────────────────────────────────────────

function StepDone({ role, onGo }: { role: Role; onGo: () => void }) {
  return (
    <div className="py-4 text-center space-y-5">
      <div className="flex justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#EEF1F9' }}
        >
          <CheckCircle className="w-9 h-9" style={{ color: '#0B2272' }} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          ¡Todo listo, {role === 'mentor' ? 'Mentor' : 'Aprendiz'}!
        </h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          {role === 'mentor'
            ? 'Tu perfil está configurado. Los aprendices podrán encontrarte y agendar sesiones contigo.'
            : 'Tu cuenta está lista. Explora los mentores disponibles y agenda tu primera sesión.'}
        </p>
      </div>

      <button
        onClick={onGo}
        className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: '#0B2272' }}
      >
        Ir al dashboard →
      </button>
    </div>
  )
}
