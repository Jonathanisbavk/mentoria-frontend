export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'mentor' | 'apprentice'
          full_name: string
          avatar_url: string | null
          bio: string | null
          timezone: string
          google_calendar_token: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'mentor' | 'apprentice'
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          google_calendar_token?: Json | null
        }
        Update: {
          role?: 'admin' | 'mentor' | 'apprentice'
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          google_calendar_token?: Json | null
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          id: string
          specialties: string[]
          experience_years: number
          linkedin_url: string | null
          availability: Json
          is_active: boolean
          avg_rating: number
          session_count: number
          created_at: string
        }
        Insert: {
          id: string
          specialties?: string[]
          experience_years?: number
          linkedin_url?: string | null
          availability?: Json
          is_active?: boolean
          avg_rating?: number
          session_count?: number
        }
        Update: {
          specialties?: string[]
          experience_years?: number
          linkedin_url?: string | null
          availability?: Json
          is_active?: boolean
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          mentor_id: string
          apprentice_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          meet_url: string | null
          calendar_event_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          apprentice_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          meet_url?: string | null
          calendar_event_id?: string | null
          notes?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          meet_url?: string | null
          calendar_event_id?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          session_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'admin' | 'mentor' | 'apprentice'
      session_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    }
    CompositeTypes: Record<string, never>
  }
}
