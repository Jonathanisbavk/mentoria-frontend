import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Mentoría Certus — Aprende de quienes ya recorrieron tu camino',
  description: 'Conecta con estudiantes de ciclos avanzados en Certus. Agenda sesiones, recibe guía personalizada y avanza más rápido.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-gray-50 font-sans">
        <SupabaseProvider>
          <AuthProvider>{children}</AuthProvider>
        </SupabaseProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}
