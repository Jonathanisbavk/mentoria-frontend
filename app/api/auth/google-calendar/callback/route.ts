import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOAuth2Client } from '@/lib/google-calendar/oauth'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('calendar_oauth_state')?.value

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=calendar_auth_failed`
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
  }

  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)

  const calendarTokens = {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token!,
    expiry_date: tokens.expiry_date!,
  }

  await supabase
    .from('profiles')
    .update({ google_calendar_token: calendarTokens })
    .eq('id', user.id)

  cookieStore.delete('calendar_oauth_state')

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=calendar_connected`
  )
}
