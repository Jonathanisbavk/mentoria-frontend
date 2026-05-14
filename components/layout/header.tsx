'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import Image from 'next/image'

export function Header() {
  const { profile } = useSupabase()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const roleLabel: Record<string, string> = {
    admin: 'Administrador',
    mentor: 'Mentor',
    apprentice: 'Aprendiz',
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
      {/* Logo visible en móvil cuando el sidebar no está */}
      <div className="lg:hidden">
        <Image src="/certus-logo.svg" alt="Certus" width={100} height={32} />
      </div>
      <div className="hidden lg:block" />

      <div className="ml-auto flex items-center gap-3">
        {profile && (
          <>
            <div className="flex items-center gap-2.5">
              <Avatar src={profile.avatar_url} name={profile.full_name || 'U'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{profile.full_name}</p>
                <p className="text-xs text-gray-500 leading-tight">{roleLabel[profile.role]}</p>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
