'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Header() {
  const { profile } = useSupabase()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const roleLabel = {
    admin: 'Administrador',
    mentor: 'Mentor',
    apprentice: 'Aprendiz',
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="lg:hidden text-xl font-bold text-indigo-600">MentorIA</div>
      <div className="ml-auto flex items-center gap-4">
        {profile && (
          <>
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatar_url} name={profile.full_name || 'U'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500">{roleLabel[profile.role]}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 text-gray-500"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
