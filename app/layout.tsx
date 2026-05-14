import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/supabase-provider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'MentorIA — Mentoría entre Estudiantes',
  description: 'Conecta con mentores de ciclos avanzados para impulsar tu carrera académica',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-gray-50 font-sans">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
