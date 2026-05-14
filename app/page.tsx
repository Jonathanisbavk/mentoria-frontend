import Link from 'next/link'
import Image from 'next/image'
import { Users, CalendarDays, GraduationCap, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Image src="/certus-logo.svg" alt="Certus" width={130} height={42} priority />
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: '#0B2272' }}
          >
            Comenzar
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-6 py-24 text-center" style={{ background: 'linear-gradient(135deg, #EEF1F9 0%, #ffffff 70%)' }}>
          <div className="mx-auto max-w-3xl">
            <div
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
              style={{ borderColor: '#0B2272', color: '#0B2272', background: '#EEF1F9' }}
            >
              <GraduationCap className="h-4 w-4" />
              Plataforma exclusiva del Instituto Certus
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl leading-tight">
              Aprende de quienes ya<br />
              <span style={{ color: '#0B2272' }}>recorrieron tu camino</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Conecta con estudiantes de ciclos avanzados de tu carrera.
              Agenda sesiones personalizadas y avanza más rápido en tus estudios.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ background: '#0B2272' }}
              >
                Empezar con Google
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 px-8 text-sm font-semibold transition hover:bg-gray-50"
                style={{ borderColor: '#0B2272', color: '#0B2272' }}
              >
                Ingresar con correo
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto text-sm">
              Una plataforma diseñada exclusivamente para la comunidad estudiantil de Certus.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: 'Encuentra tu mentor',
                  desc: 'Busca por especialidad y lee reseñas reales de compañeros.',
                },
                {
                  icon: CalendarDays,
                  title: 'Agenda sesiones',
                  desc: 'Elige horarios y sincroniza con Google Calendar automáticamente.',
                },
                {
                  icon: GraduationCap,
                  title: 'Aprende en vivo',
                  desc: 'Sesiones por Google Meet integradas directamente en la plataforma.',
                },
                {
                  icon: Star,
                  title: 'Califica y mejora',
                  desc: 'Tu feedback ayuda a los mentores a mejorar y a otros a elegir mejor.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl"
                    style={{ background: '#EEF1F9' }}
                  >
                    <Icon className="h-6 w-6" style={{ color: '#0B2272' }} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-6 text-center" style={{ background: '#0B2272' }}>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white">¿Eres de ciclos avanzados?</h2>
            <p className="mt-4 text-blue-200 text-sm">
              Comparte tu conocimiento, fortalece tus habilidades de liderazgo
              y ayuda a tus compañeros de Certus a triunfar.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-semibold transition hover:bg-gray-100"
              style={{ color: '#0B2272' }}
            >
              Registrarme como mentor
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Image src="/certus-logo.svg" alt="Certus" width={90} height={28} />
        </div>
        <p className="text-xs text-gray-400">
          © 2025 Mentoría Certus · Plataforma de Mentoría entre Estudiantes del Instituto Certus
        </p>
      </footer>
    </div>
  )
}
