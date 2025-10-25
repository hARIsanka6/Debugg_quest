export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          id: string
          level: number
          language: Database["public"]["Enums"]["programming_language"]
          title: string
          description: string
          buggy_code: string
          correct_code: string
          error_message: string
          hints: string[]
          xp_reward: number
          difficulty: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          level: number
          language: Database["public"]["Enums"]["programming_language"]
          title: string
          description: string
          buggy_code: string
          correct_code: string
          error_message: string
          hints?: string[]
          xp_reward?: number
          difficulty: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          level?: number
          language?: Database["public"]["Enums"]["programming_language"]
          title?: string
          description?: string
          buggy_code?: string
          correct_code?: string
          error_message?: string
          hints?: string[]
          xp_reward?: number
          difficulty?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          description: string
          icon: string
          id: string
          name: string
          xp_reward: number | null
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          description: string
          icon: string
          id?: string
          name: string
          xp_reward?: number | null
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          description?: string
          icon?: string
          id?: string
          name?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      level_attempts: {
        Row: {
          created_at: string | null
          hints_used: number | null
          id: string
          language: Database["public"]["Enums"]["programming_language"]
          level: number
          solved: boolean | null
          time_taken: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hints_used?: number | null
          id?: string
          language: Database["public"]["Enums"]["programming_language"]
          level: number
          solved?: boolean | null
          time_taken?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hints_used?: number | null
          id?: string
          language?: Database["public"]["Enums"]["programming_language"]
          level?: number
          solved?: boolean | null
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "level_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_active: string | null
          total_xp: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          id: string
          last_active?: string | null
          total_xp?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_active?: string | null
          total_xp?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_levels: number[] | null
          created_at: string | null
          current_level: number | null
          id: string
          language: Database["public"]["Enums"]["programming_language"]
          language_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_levels?: number[] | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          language: Database["public"]["Enums"]["programming_language"]
          language_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_levels?: number[] | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          language?: Database["public"]["Enums"]["programming_language"]
          language_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      badge_type:
        | "first_debug"
        | "no_hint_pro"
        | "speed_solver"
        | "streak_killer"
        | "level_master"
      programming_language: "python" | "javascript" | "cpp" | "java"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_type: [
        "first_debug",
        "no_hint_pro",
        "speed_solver",
        "streak_killer",
        "level_master",
      ],
      programming_language: ["python", "javascript", "cpp", "java"],
    },
  },
} as const
