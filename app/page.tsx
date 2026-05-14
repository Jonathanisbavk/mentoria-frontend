import Link from 'next/link'
import { GraduationCap, Users, CalendarDays, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MentorIA</span>
          </div>
          <Link href="/login">
            <Button size="sm">Comenzar</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-br from-indigo-50 via-white to-white py-24 text-center px-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Aprende de quienes ya<br />
              <span className="text-indigo-600">recorrieron tu camino</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Conecta con estudiantes de ciclos avanzados de tu carrera.
              Agenda sesiones, recibe guía personalizada y avanza más rápido.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg">Empieza gratis con Google</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
              Todo lo que necesitas para crecer
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: 'Encuentra tu mentor',
                  desc: 'Busca por especialidad y lee reseñas reales de otros estudiantes.',
                },
                {
                  icon: CalendarDays,
                  title: 'Agenda sesiones',
                  desc: 'Elige horarios disponibles y sincroniza con Google Calendar automáticamente.',
                },
                {
                  icon: GraduationCap,
                  title: 'Aprende en vivo',
                  desc: 'Sesiones con Google Meet integrado, directamente desde la plataforma.',
                },
                {
                  icon: Star,
                  title: 'Califica y mejora',
                  desc: 'Tu feedback ayuda a los mentores a mejorar y a otros estudiantes a elegir.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
                    <Icon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 py-16 text-center px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white">¿Eres mentor?</h2>
            <p className="mt-4 text-indigo-100">
              Comparte tu conocimiento, fortalece tus habilidades de liderazgo
              y ayuda a otros estudiantes a triunfar.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="mt-8">
                Registrarme como mentor
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
        <p>© 2025 MentorIA · Aplicación de Mentoría entre Estudiantes</p>
      </footer>
    </div>
  )
}
