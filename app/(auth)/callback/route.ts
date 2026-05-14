import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existing) {
        const meta = data.user.user_metadata ?? {}
        const provider = data.user.app_metadata?.provider ?? 'email'
        const fullName =
          meta.full_name ?? meta.name ?? data.user.email?.split('@')[0] ?? 'Usuario'
        const avatarUrl = meta.avatar_url ?? meta.picture ?? null
        const intendedRole = meta.intended_role === 'mentor' ? 'mentor' : null

        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: intendedRole ?? 'apprentice',
          timezone: 'America/Lima',
        })

        if (intendedRole === 'mentor') {
          await supabase.from('mentor_profiles').insert({
            id: data.user.id,
            specialties: [],
            experience_years: 0,
            availability: {},
          })
        }

        // Google OAuth users haven't chosen a role yet → onboarding
        if (provider === 'google' && !intendedRole) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // New email users go to profile edit to complete their info
        return NextResponse.redirect(`${origin}/profile/edit?welcome=1`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
