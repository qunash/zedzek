export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["roles"]
          username: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["roles"]
          username: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["roles"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      proofread_texts: {
        Row: {
          id: string
          text: string
          text_id: string
          user_id: string
        }
        Insert: {
          id: string
          text: string
          text_id: string
          user_id: string
        }
        Update: {
          id?: string
          text?: string
          text_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_proofread_texts_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "texts_to_proofread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_proofread_texts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sentences: {
        Row: {
          created_at: string
          id: string
          lang: string | null
          source: string | null
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lang?: string | null
          source?: string | null
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lang?: string | null
          source?: string | null
          text?: string | null
        }
        Relationships: []
      }
      texts_to_proofread: {
        Row: {
          created_at: string | null
          id: string
          int_id: number | null
          source: string | null
          text: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          int_id?: number | null
          source?: string | null
          text?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          int_id?: number | null
          source?: string | null
          text?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          is_user_translation: boolean
          lang: string | null
          text: string
          translation: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          lang?: string | null
          text: string
          translation: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          lang?: string | null
          text?: string
          translation?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      translations_backup_180923_1638PM: {
        Row: {
          created_at: string
          id: string
          is_user_translation: boolean
          lang: string | null
          text: string
          translation: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          lang?: string | null
          text: string
          translation: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user_translation?: boolean
          lang?: string | null
          text?: string
          translation?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_backup_180923_1638PM_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      votes_backup_180923_1638PM: {
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
            foreignKeyName: "votes_backup_180923_1638PM_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "translations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_backup_180923_1638PM_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      get_10_random_texts_to_proofread: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          id: string
          int_id: number | null
          source: string | null
          text: string | null
        }[]
      }
      get_10_random_translations: {
        Args: {
          p_user_id: string
          p_lang: string
        }
        Returns: {
          created_at: string
          id: string
          is_user_translation: boolean
          lang: string | null
          text: string
          translation: string
          user_id: string
        }[]
      }
      get_10_random_untranslated_sentences: {
        Args: {
          p_user_id: string
          p_lang: string
        }
        Returns: {
          created_at: string
          id: string
          lang: string | null
          source: string | null
          text: string | null
        }[]
      }
      insert_or_update_proofread_text: {
        Args: {
          p_user_id: string
          p_text_id: string
          p_text: string
        }
        Returns: undefined
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
          p_lang: string
          p_text: string
          p_translation: string
          p_is_user_translation: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      roles: "regular_user" | "proofreader"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
