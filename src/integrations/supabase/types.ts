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
      ai_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          data_sources: Json | null
          id: string
          metadata: Json | null
          predicted_value: number
          prediction_date: string
          prediction_type: string
          target_date: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          data_sources?: Json | null
          id?: string
          metadata?: Json | null
          predicted_value: number
          prediction_date?: string
          prediction_type: string
          target_date: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          data_sources?: Json | null
          id?: string
          metadata?: Json | null
          predicted_value?: number
          prediction_date?: string
          prediction_type?: string
          target_date?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          content: Json
          created_at: string
          description: string
          effectiveness_score: number | null
          expires_at: string | null
          feedback_rating: number | null
          id: string
          priority: number
          recommendation_type: string
          title: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          description: string
          effectiveness_score?: number | null
          expires_at?: string | null
          feedback_rating?: number | null
          id?: string
          priority?: number
          recommendation_type: string
          title: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string
          effectiveness_score?: number | null
          expires_at?: string | null
          feedback_rating?: number | null
          id?: string
          priority?: number
          recommendation_type?: string
          title?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      behavioral_patterns: {
        Row: {
          confidence: number
          created_at: string
          frequency: string | null
          id: string
          last_observed: string | null
          pattern_data: Json
          pattern_type: string
          strength: number
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          frequency?: string | null
          id?: string
          last_observed?: string | null
          pattern_data: Json
          pattern_type: string
          strength?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          frequency?: string | null
          id?: string
          last_observed?: string | null
          pattern_data?: Json
          pattern_type?: string
          strength?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clothing_items: {
        Row: {
          brand: string | null
          category: Database["public"]["Enums"]["clothing_category"]
          color: string | null
          condition: Database["public"]["Enums"]["clothing_condition"]
          created_at: string
          description: string
          id: string
          is_featured: boolean | null
          price_credits: number
          size: Database["public"]["Enums"]["clothing_size"]
          status: Database["public"]["Enums"]["clothing_status"]
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          brand?: string | null
          category: Database["public"]["Enums"]["clothing_category"]
          color?: string | null
          condition: Database["public"]["Enums"]["clothing_condition"]
          created_at?: string
          description: string
          id?: string
          is_featured?: boolean | null
          price_credits?: number
          size: Database["public"]["Enums"]["clothing_size"]
          status?: Database["public"]["Enums"]["clothing_status"]
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["clothing_category"]
          color?: string | null
          condition?: Database["public"]["Enums"]["clothing_condition"]
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean | null
          price_credits?: number
          size?: Database["public"]["Enums"]["clothing_size"]
          status?: Database["public"]["Enums"]["clothing_status"]
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      clothing_photos: {
        Row: {
          clothing_item_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          order_index: number | null
          photo_url: string
        }
        Insert: {
          clothing_item_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url: string
        }
        Update: {
          clothing_item_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "clothing_photos_clothing_item_id_fkey"
            columns: ["clothing_item_id"]
            isOneToOne: false
            referencedRelation: "clothing_items"
            referencedColumns: ["id"]
          },
        ]
      }
      clothing_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
          reviewed_user_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clothing_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          clothing_item_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          clothing_item_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          clothing_item_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_clothing_item_id_fkey"
            columns: ["clothing_item_id"]
            isOneToOne: false
            referencedRelation: "clothing_items"
            referencedColumns: ["id"]
          },
        ]
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
      location_visits: {
        Row: {
          address: string | null
          arrived_at: string
          created_at: string
          duration_minutes: number | null
          id: string
          latitude: number
          left_at: string | null
          location_id: string | null
          longitude: number
          mood_score: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          arrived_at?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          latitude: number
          left_at?: string | null
          location_id?: string | null
          longitude: number
          mood_score?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          arrived_at?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          latitude?: number
          left_at?: string | null
          location_id?: string | null
          longitude?: number
          mood_score?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_location_correlations: {
        Row: {
          avg_mood_score: number
          created_at: string
          id: string
          last_visit_at: string
          latitude: number
          location_id: string | null
          location_name: string
          longitude: number
          mood_trend: string | null
          total_duration_minutes: number
          updated_at: string
          user_id: string
          visit_count: number
        }
        Insert: {
          avg_mood_score: number
          created_at?: string
          id?: string
          last_visit_at?: string
          latitude: number
          location_id?: string | null
          location_name: string
          longitude: number
          mood_trend?: string | null
          total_duration_minutes?: number
          updated_at?: string
          user_id: string
          visit_count?: number
        }
        Update: {
          avg_mood_score?: number
          created_at?: string
          id?: string
          last_visit_at?: string
          latitude?: number
          location_id?: string | null
          location_name?: string
          longitude?: number
          mood_trend?: string | null
          total_duration_minutes?: number
          updated_at?: string
          user_id?: string
          visit_count?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string
          clothing_item_id: string
          created_at: string
          delivered_at: string | null
          id: string
          platform_fee: number
          seller_id: string
          shipped_at: string | null
          shipping_address: Json
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"]
          total_credits: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          clothing_item_id: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          platform_fee: number
          seller_id: string
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          total_credits: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          clothing_item_id?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          platform_fee?: number
          seller_id?: string
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          total_credits?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_clothing_item_id_fkey"
            columns: ["clothing_item_id"]
            isOneToOne: false
            referencedRelation: "clothing_items"
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
      premium_subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean
          starts_at: string
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["premium_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["premium_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["premium_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      therapy_sessions: {
        Row: {
          ai_notes: Json | null
          completed_at: string | null
          completion_status: string
          content: Json
          created_at: string
          duration_minutes: number | null
          effectiveness_rating: number | null
          id: string
          session_type: string
          title: string
          user_id: string
        }
        Insert: {
          ai_notes?: Json | null
          completed_at?: string | null
          completion_status?: string
          content: Json
          created_at?: string
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          session_type: string
          title: string
          user_id: string
        }
        Update: {
          ai_notes?: Json | null
          completed_at?: string | null
          completion_status?: string
          content?: Json
          created_at?: string
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          session_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
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
      user_locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number
          location_type: string
          longitude: number
          name: string
          radius_meters: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude: number
          location_type?: string
          longitude: number
          name: string
          radius_meters?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number
          location_type?: string
          longitude?: number
          name?: string
          radius_meters?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_personality_profiles: {
        Row: {
          communication_style: string | null
          coping_mechanisms: Json | null
          created_at: string
          id: string
          learning_style: string | null
          motivation_factors: Json | null
          personality_traits: Json
          stress_triggers: Json | null
          therapy_preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          coping_mechanisms?: Json | null
          created_at?: string
          id?: string
          learning_style?: string | null
          motivation_factors?: Json | null
          personality_traits?: Json
          stress_triggers?: Json | null
          therapy_preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          coping_mechanisms?: Json | null
          created_at?: string
          id?: string
          learning_style?: string | null
          motivation_factors?: Json | null
          personality_traits?: Json
          stress_triggers?: Json | null
          therapy_preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          city: string | null
          created_at: string
          id: string
          is_public: boolean | null
          lgpd_consent: boolean | null
          lgpd_consent_date: string | null
          name: string
          phone: string | null
          reputation_score: number | null
          sign: string | null
          state: string | null
          total_purchases: number | null
          total_sales: number | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          id: string
          is_public?: boolean | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          name: string
          phone?: string | null
          reputation_score?: number | null
          sign?: string | null
          state?: string | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          name?: string
          phone?: string | null
          reputation_score?: number | null
          sign?: string | null
          state?: string | null
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          available_credits: number
          created_at: string
          id: string
          lifetime_earned: number
          lifetime_spent: number
          reserved_credits: number
          total_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_credits?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          reserved_credits?: number
          total_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_credits?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          reserved_credits?: number
          total_credits?: number
          updated_at?: string
          user_id?: string
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_trending_topics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      clothing_category:
        | "dresses"
        | "tops"
        | "bottoms"
        | "jackets"
        | "shoes"
        | "accessories"
        | "bags"
      clothing_condition: "new" | "excellent" | "good" | "fair"
      clothing_size:
        | "PP"
        | "P"
        | "M"
        | "G"
        | "GG"
        | "XG"
        | "34"
        | "36"
        | "38"
        | "40"
        | "42"
        | "44"
        | "46"
        | "48"
      clothing_status:
        | "available"
        | "sold"
        | "reserved"
        | "shipped"
        | "delivered"
      order_status:
        | "pending"
        | "paid"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      premium_tier: "free" | "premium"
      transaction_status: "pending" | "completed" | "cancelled" | "refunded"
      transaction_type:
        | "purchase"
        | "sale"
        | "credit_buy"
        | "withdrawal"
        | "fee"
        | "refund"
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
      app_role: ["admin", "moderator", "user"],
      clothing_category: [
        "dresses",
        "tops",
        "bottoms",
        "jackets",
        "shoes",
        "accessories",
        "bags",
      ],
      clothing_condition: ["new", "excellent", "good", "fair"],
      clothing_size: [
        "PP",
        "P",
        "M",
        "G",
        "GG",
        "XG",
        "34",
        "36",
        "38",
        "40",
        "42",
        "44",
        "46",
        "48",
      ],
      clothing_status: [
        "available",
        "sold",
        "reserved",
        "shipped",
        "delivered",
      ],
      order_status: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      premium_tier: ["free", "premium"],
      transaction_status: ["pending", "completed", "cancelled", "refunded"],
      transaction_type: [
        "purchase",
        "sale",
        "credit_buy",
        "withdrawal",
        "fee",
        "refund",
      ],
    },
  },
} as const
