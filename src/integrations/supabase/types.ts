export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          stars_reward: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          stars_reward?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          stars_reward?: number
        }
        Relationships: []
      }
      activity_data: {
        Row: {
          activity_type: string
          calories_burned: number | null
          created_at: string | null
          distance_meters: number | null
          duration_minutes: number
          end_time: string
          heart_rate_average: number | null
          heart_rate_max: number | null
          id: string
          intensity_level: string | null
          source: string | null
          start_time: string
          steps: number | null
          user_id: string | null
          workout_data: Json | null
        }
        Insert: {
          activity_type: string
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_minutes: number
          end_time: string
          heart_rate_average?: number | null
          heart_rate_max?: number | null
          id?: string
          intensity_level?: string | null
          source?: string | null
          start_time: string
          steps?: number | null
          user_id?: string | null
          workout_data?: Json | null
        }
        Update: {
          activity_type?: string
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_minutes?: number
          end_time?: string
          heart_rate_average?: number | null
          heart_rate_max?: number | null
          id?: string
          intensity_level?: string | null
          source?: string | null
          start_time?: string
          steps?: number | null
          user_id?: string | null
          workout_data?: Json | null
        }
        Relationships: []
      }
      correlation_analysis: {
        Row: {
          activity_correlation: Json | null
          analysis_date: string
          created_at: string | null
          energy_score: number | null
          heart_rate_correlation: Json | null
          id: string
          insights: Json | null
          mood_score: number | null
          recommendations: Json | null
          sleep_correlation: Json | null
          stress_score: number | null
          user_id: string | null
          voice_analysis_id: string | null
        }
        Insert: {
          activity_correlation?: Json | null
          analysis_date: string
          created_at?: string | null
          energy_score?: number | null
          heart_rate_correlation?: Json | null
          id?: string
          insights?: Json | null
          mood_score?: number | null
          recommendations?: Json | null
          sleep_correlation?: Json | null
          stress_score?: number | null
          user_id?: string | null
          voice_analysis_id?: string | null
        }
        Update: {
          activity_correlation?: Json | null
          analysis_date?: string
          created_at?: string | null
          energy_score?: number | null
          heart_rate_correlation?: Json | null
          id?: string
          insights?: Json | null
          mood_score?: number | null
          recommendations?: Json | null
          sleep_correlation?: Json | null
          stress_score?: number | null
          user_id?: string | null
          voice_analysis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "correlation_analysis_voice_analysis_id_fkey"
            columns: ["voice_analysis_id"]
            isOneToOne: false
            referencedRelation: "voice_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_activities: {
        Row: {
          activity_date: string
          activity_type: string
          completed_at: string
          id: string
          stars_earned: number
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          completed_at?: string
          id?: string
          stars_earned?: number
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          completed_at?: string
          id?: string
          stars_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      feed_posts: {
        Row: {
          category: string | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          created_at: string | null
          data_type: string
          device_info: Json | null
          id: string
          recorded_at: string
          source: string | null
          synced_at: string | null
          unit: string
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          data_type: string
          device_info?: Json | null
          id?: string
          recorded_at: string
          source?: string | null
          synced_at?: string | null
          unit: string
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          data_type?: string
          device_info?: Json | null
          id?: string
          recorded_at?: string
          source?: string | null
          synced_at?: string | null
          unit?: string
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      heart_rate_data: {
        Row: {
          context: string | null
          created_at: string | null
          heart_rate: number
          id: string
          recorded_at: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          heart_rate: number
          id?: string
          recorded_at: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          heart_rate?: number
          id?: string
          recorded_at?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kindness_acts: {
        Row: {
          created_at: string
          description: string
          id: string
          impact_count: number | null
          photo_url: string | null
          recipients: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          impact_count?: number | null
          photo_url?: string | null
          recipients?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          impact_count?: number | null
          photo_url?: string | null
          recipients?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kindness_chain: {
        Row: {
          created_at: string
          follower_act_id: string
          id: string
          original_act_id: string
        }
        Insert: {
          created_at?: string
          follower_act_id: string
          id?: string
          original_act_id: string
        }
        Update: {
          created_at?: string
          follower_act_id?: string
          id?: string
          original_act_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kindness_chain_follower_act_id_fkey"
            columns: ["follower_act_id"]
            isOneToOne: false
            referencedRelation: "kindness_acts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kindness_chain_original_act_id_fkey"
            columns: ["original_act_id"]
            isOneToOne: false
            referencedRelation: "kindness_acts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_data: {
        Row: {
          awake_minutes: number | null
          created_at: string | null
          deep_sleep_minutes: number | null
          duration_minutes: number
          heart_rate_average: number | null
          heart_rate_variability: number | null
          id: string
          interruptions_count: number | null
          light_sleep_minutes: number | null
          quality_score: number | null
          raw_data: Json | null
          rem_sleep_minutes: number | null
          sleep_end: string
          sleep_start: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          awake_minutes?: number | null
          created_at?: string | null
          deep_sleep_minutes?: number | null
          duration_minutes: number
          heart_rate_average?: number | null
          heart_rate_variability?: number | null
          id?: string
          interruptions_count?: number | null
          light_sleep_minutes?: number | null
          quality_score?: number | null
          raw_data?: Json | null
          rem_sleep_minutes?: number | null
          sleep_end: string
          sleep_start: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          awake_minutes?: number | null
          created_at?: string | null
          deep_sleep_minutes?: number | null
          duration_minutes?: number
          heart_rate_average?: number | null
          heart_rate_variability?: number | null
          id?: string
          interruptions_count?: number | null
          light_sleep_minutes?: number | null
          quality_score?: number | null
          raw_data?: Json | null
          rem_sleep_minutes?: number | null
          sleep_end?: string
          sleep_start?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          daily_questions_limit: number | null
          daily_questions_used: number | null
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          daily_questions_limit?: number | null
          daily_questions_used?: number | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          daily_questions_limit?: number | null
          daily_questions_used?: number | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trending_topics: {
        Row: {
          category: string
          created_at: string
          engagement_score: number
          id: string
          post_count: number
          topic_name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          engagement_score?: number
          id?: string
          post_count?: number
          topic_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          engagement_score?: number
          id?: string
          post_count?: number
          topic_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          content: string | null
          created_at: string
          id: string
          topic_name: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          content?: string | null
          created_at?: string
          id?: string
          topic_name?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          content?: string | null
          created_at?: string
          id?: string
          topic_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          created_at: string
          current_streak: number
          experience_points: number
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          total_stars: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_stars?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          experience_points?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_stars?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          id: string
          is_public: boolean | null
          lgpd_consent: boolean | null
          lgpd_consent_date: string | null
          name: string
          sign: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          id: string
          is_public?: boolean | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          name: string
          sign?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          name?: string
          sign?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      voice_analysis: {
        Row: {
          audio_file_url: string | null
          confidence_score: number | null
          created_at: string | null
          emotional_tone: Json | null
          harmonics: number | null
          id: string
          jitter: number | null
          pause_frequency: number | null
          pitch_average: number | null
          pitch_variability: number | null
          psychological_analysis: Json | null
          session_duration: number | null
          speech_rate: number | null
          stress_indicators: Json | null
          transcription: string | null
          updated_at: string | null
          user_id: string | null
          volume_average: number | null
        }
        Insert: {
          audio_file_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          emotional_tone?: Json | null
          harmonics?: number | null
          id?: string
          jitter?: number | null
          pause_frequency?: number | null
          pitch_average?: number | null
          pitch_variability?: number | null
          psychological_analysis?: Json | null
          session_duration?: number | null
          speech_rate?: number | null
          stress_indicators?: Json | null
          transcription?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_average?: number | null
        }
        Update: {
          audio_file_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          emotional_tone?: Json | null
          harmonics?: number | null
          id?: string
          jitter?: number | null
          pause_frequency?: number | null
          pitch_average?: number | null
          pitch_variability?: number | null
          psychological_analysis?: Json | null
          session_duration?: number | null
          speech_rate?: number | null
          stress_indicators?: Json | null
          transcription?: string | null
          updated_at?: string | null
          user_id?: string | null
          volume_average?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_trending_topics: {
        Args: Record<PropertyKey, never>
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
    Enums: {},
  },
} as const
