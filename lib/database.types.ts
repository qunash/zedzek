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
          text: string
          translation: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          translation: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
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
      votes: {
        Row: {
          created_at: string
          id: string
          translation_id: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string
          id?: string
          translation_id: string
          user_id: string
          vote: number
        }
        Update: {
          created_at?: string
          id?: string
          translation_id?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_translation_id_fkey"
            columns: ["translation_id"]
            referencedRelation: "translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
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
      get_10_random_translations: {
        Args: {
          p_user_id: string
        }
        Returns: {
          created_at: string
          id: string
          text: string
          translation: string
          user_id: string
        }[]
      }
      translation_downvote: {
        Args: {
          p_user_id: string
          p_text: string
          p_translation: string
        }
        Returns: undefined
      }
      translation_remove_vote: {
        Args: {
          p_user_id: string
          p_text: string
          p_translation: string
        }
        Returns: undefined
      }
      translation_upvote: {
        Args: {
          p_user_id: string
          p_text: string
          p_translation: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
