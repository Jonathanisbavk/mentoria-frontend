'use client'

import { createContext, useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/supabase-provider'

type AuthUser = {
  name: string
  avatar: string
  role: 'admin' | 'mentor' | 'apprentice'
  cycle?: string
}

type AuthContextType = {
  user: AuthUser | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useSupabase()
  const router = useRouter()
  const supabase = createClient()

  const user = useMemo<AuthUser | null>(() => {
    if (!profile) return null

    return {
      name: profile.full_name,
      avatar: profile.full_name,
      role: profile.role,
      cycle: profile.timezone,
    }
  }, [profile])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
