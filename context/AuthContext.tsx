'use client'

import { createContext, useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

type AuthUser = {
  id: string
  name: string
  avatar: string | null
  role: 'admin' | 'mentor' | 'apprentice'
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
  const { user: supabaseUser, profile, reset } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const user = useMemo<AuthUser | null>(() => {
    if (!supabaseUser || !profile) return null
    return {
      id: supabaseUser.id,
      name: profile.full_name,
      avatar: profile.avatar_url,
      role: profile.role,
    }
  }, [supabaseUser, profile])

  async function logout() {
    await supabase.auth.signOut()
    reset()
    toast.success('Sesión cerrada correctamente')
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
