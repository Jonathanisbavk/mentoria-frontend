import Link from 'next/link'
import Image from 'next/image'
import { Users, CalendarDays, Code2, Star, GitBranch, Layers, Terminal, Palette } from 'lucide-react'

const TECH_TAGS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'SQL', 'Git', 'Docker', 'Figma', 'APIs REST', 'MongoDB',
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/certus-logo.svg" alt="Certus" width={120} height={38} priority />
            <span className="hidden sm:block text-xs font-medium text-gray-400 border-l border-gray-200 pl-3">
              Desarrollo de Software
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
            >
              Ingresar
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: '#0B2272' }}
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-6 py-20 lg:py-28" style={{ background: 'linear-gradient(135deg, #EEF1F9 0%, #ffffff 65%)' }}>
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Copy */}
              <div className="space-y-6">
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
                  style={{ borderColor: '#0B2272', color: '#0B2272', background: '#EEF1F9' }}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Exclusivo para estudiantes de Certus
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  Aprende a programar<br />
                  <span style={{ color: '#0B2272' }}>con quien ya lo hizo</span>
                </h1>

                <p className="text-base text-gray-600 max-w-md leading-relaxed">
                  Conecta con estudiantes de ciclos avanzados de Diseño y Desarrollo de Software.
                  Recibe mentoría real en las tecnologías que el mercado demanda.
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {TECH_TAGS.map(t => (
                    <span
                      key={t}
                      className="rounded-md px-2.5 py-1 text-xs font-medium border"
                      style={{ borderColor: '#CBD5E1', color: '#475569', background: 'white' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    style={{ background: '#0B2272' }}
                  >
                    Buscar un mentor →
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-xl border-2 px-8 text-sm font-semibold transition hover:bg-gray-50"
                    style={{ borderColor: '#0B2272', color: '#0B2272' }}
                  >
                    Ser mentor
                  </Link>
                </div>
              </div>

              {/* Code window visual */}
              <div className="hidden lg:block">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  {/* Window bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-gray-400 font-mono">session.tsx</span>
                  </div>
                  {/* Code */}
                  <div className="bg-gray-900 px-6 py-5 font-mono text-sm leading-7">
                    <p><span className="text-purple-400">import</span> <span className="text-white">{'{ useState }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span></p>
                    <p className="mt-2"><span className="text-blue-400">function</span> <span className="text-yellow-300">MentorSession</span><span className="text-white">() {'{'}</span></p>
                    <p className="pl-4"><span className="text-blue-400">const</span> <span className="text-white">[ready, setReady] =</span></p>
                    <p className="pl-6"><span className="text-yellow-300">useState</span><span className="text-white">({'<'}boolean{'>'}(false)</span></p>
                    <p className="mt-2 pl-4 text-gray-500">{'// Tu mentor te guía en vivo'}</p>
                    <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-white">ready</span></p>
                    <p className="pl-6"><span className="text-white">? </span><span className="text-green-400">"¡Listo para el mercado!"</span></p>
                    <p className="pl-6"><span className="text-white">: </span><span className="text-orange-400">"Agendemos una sesión"</span></p>
                    <p><span className="text-white">{'}'}</span></p>
                  </div>
                  {/* Session banner */}
                  <div className="bg-gray-800 px-6 py-4 flex items-center gap-3 border-t border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">CM</div>
                    <div>
                      <p className="text-white text-xs font-medium">Carlos Mendoza · Mentor</p>
                      <p className="text-gray-400 text-xs">React & Node.js · Ciclo VIII</p>
                    </div>
                    <span className="ml-auto text-xs text-green-400 font-medium">● En sesión</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-y border-gray-100 bg-white py-10 px-6">
          <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: 'Frontend', icon: Layers,   desc: 'React, Vue, CSS' },
              { value: 'Backend',  icon: Terminal, desc: 'Node.js, Python, Java' },
              { value: 'Base de datos', icon: GitBranch, desc: 'SQL, MongoDB, Redis' },
              { value: 'Diseño UI', icon: Palette,  desc: 'Figma, UX, Prototipado' },
            ].map(({ value, icon: Icon, desc }) => (
              <div key={value} className="space-y-2">
                <Icon className="mx-auto h-6 w-6" style={{ color: '#0B2272' }} />
                <p className="font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900">¿Cómo funciona?</h2>
              <p className="mt-3 text-gray-500 text-sm max-w-lg mx-auto">
                En 3 pasos puedes comenzar a recibir mentoría de un estudiante avanzado de tu misma carrera.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Encuentra tu mentor',
                  desc: 'Filtra por tecnología: React, Python, SQL, Figma y más. Lee reseñas de compañeros y elige según tu necesidad.',
                  icon: Users,
                },
                {
                  step: '02',
                  title: 'Agenda tu sesión',
                  desc: 'Selecciona un horario disponible. La sesión se sincroniza con Google Calendar y genera un link de Google Meet automáticamente.',
                  icon: CalendarDays,
                },
                {
                  step: '03',
                  title: 'Aprende y califica',
                  desc: 'Sesión en vivo por Google Meet. Al terminar, deja tu valoración para ayudar a otros estudiantes a elegir mejor.',
                  icon: Star,
                },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="relative space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold text-white"
                      style={{ background: '#0B2272' }}
                    >
                      {step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 px-6" style={{ background: '#F8F9FF' }}>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
              Diseñado para estudiantes de desarrollo
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Code2,
                  title: 'Tecnologías reales',
                  desc: 'Mentores especializados en las herramientas que usan las empresas hoy.',
                },
                {
                  icon: GitBranch,
                  title: 'Proyectos prácticos',
                  desc: 'Trabaja en proyectos reales bajo la guía de alguien que ya aprendió.',
                },
                {
                  icon: CalendarDays,
                  title: 'Horarios flexibles',
                  desc: 'Los mentores publican su disponibilidad. Elige el horario que mejor te convenga.',
                },
                {
                  icon: Star,
                  title: 'Mentores verificados',
                  desc: 'Calificaciones reales de tus compañeros. Elige con confianza.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: '#EEF1F9' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: '#0B2272' }} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Mentor ── */}
        <section className="py-16 px-6" style={{ background: '#0B2272' }}>
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80">
              <Code2 className="h-3.5 w-3.5" /> Para estudiantes de ciclos avanzados
            </div>
            <h2 className="text-3xl font-bold text-white">
              ¿Ya dominas React, Python o SQL?
            </h2>
            <p className="text-blue-200 text-sm max-w-xl mx-auto">
              Conviértete en mentor. Refuerza lo que sabes enseñando,
              construye tu reputación profesional y ayuda a tus compañeros
              a llegar donde tú ya estás.
            </p>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-semibold transition hover:bg-gray-100"
              style={{ color: '#0B2272' }}
            >
              Registrarme como mentor →
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/certus-logo.svg" alt="Certus" width={80} height={25} />
            <span className="text-xs text-gray-400">Diseño y Desarrollo de Software</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 MentorIA Certus · Plataforma de mentoría entre estudiantes
          </p>
        </div>
      </footer>
    </div>
  )
}
