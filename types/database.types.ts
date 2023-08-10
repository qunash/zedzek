export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string
          id: string
          name: string
          username: string
        }
        Insert: {
          avatar_url: string
          id: string
          name: string
          username: string
        }
        Update: {
          avatar_url?: string
          id?: string
          name?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      translations: {
        Row: {
          created_at: string
          id: string
          is_user_translation: boolean
          text: string
          translation: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          text: string
          translation: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          text?: string
          translation?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
