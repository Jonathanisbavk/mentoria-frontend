import type { Database } from './database'

export type UserRole = 'admin' | 'mentor' | 'apprentice'
export type SessionStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type MentorProfile = Database['public']['Tables']['mentor_profiles']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Feedback = Database['public']['Tables']['feedback']['Row']

export type MentorWithProfile = MentorProfile & {
  profiles: Profile
}

export type SessionWithParticipants = Session & {
  mentor: Profile
  apprentice: Profile
  feedback?: Feedback[]
}

export type GoogleCalendarTokens = {
  access_token: string
  refresh_token: string
  expiry_date: number
}

export type WeeklyAvailability = {
  [day: string]: { start: string; end: string }[]
}
