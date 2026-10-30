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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          addons: string[]
          address: string
          admin_notes: string
          bathrooms: number
          bedrooms: number
          booking_code: string
          created_at: string
          customer_id: string | null
          email: string
          estimated_price: number
          frequency: string
          full_name: string
          home_size: string
          id: string
          phone: string
          preferred_date: string
          preferred_time: string
          service_name: string
          service_slug: string
          special_instructions: string
          status: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          addons?: string[]
          address: string
          admin_notes?: string
          bathrooms?: number
          bedrooms?: number
          booking_code: string
          created_at?: string
          customer_id?: string | null
          email: string
          estimated_price?: number
          frequency: string
          full_name: string
          home_size: string
          id?: string
          phone: string
          preferred_date: string
          preferred_time: string
          service_name: string
          service_slug: string
          special_instructions?: string
          status?: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          addons?: string[]
          address?: string
          admin_notes?: string
          bathrooms?: number
          bedrooms?: number
          booking_code?: string
          created_at?: string
          customer_id?: string | null
          email?: string
          estimated_price?: number
          frequency?: string
          full_name?: string
          home_size?: string
          id?: string
          phone?: string
          preferred_date?: string
          preferred_time?: string
          service_name?: string
          service_slug?: string
          special_instructions?: string
          status?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string
          service: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string
          service?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string
          service?: string
          status?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string
          phone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing: {
        Row: {
          amount: number
          category: string
          key: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          bathrooms: number
          bedrooms: number
          cleaning_type: string
          created_at: string
          email: string
          estimated_price: number
          full_name: string
          home_size: string
          id: string
          phone: string
          status: string
          zip_code: string
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          cleaning_type: string
          created_at?: string
          email?: string
          estimated_price?: number
          full_name?: string
          home_size: string
          id?: string
          phone?: string
          status?: string
          zip_code: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          cleaning_type?: string
          created_at?: string
          email?: string
          estimated_price?: number
          full_name?: string
          home_size?: string
          id?: string
          phone?: string
          status?: string
          zip_code?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          city: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          sort_order: number
          state: string
          zip_codes: string[]
        }
        Insert: {
          city: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          state?: string
          zip_codes?: string[]
        }
        Update: {
          city?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          state?: string
          zip_codes?: string[]
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          is_active: boolean
          name: string
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          base_price?: number
          is_active?: boolean
          name: string
          short_description?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          base_price?: number
          is_active?: boolean
          name?: string
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          is_published: boolean
          is_sample: boolean
          location: string
          rating: number
          review: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          is_published?: boolean
          is_sample?: boolean
          location?: string
          rating?: number
          review: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          is_published?: boolean
          is_sample?: boolean
          location?: string
          rating?: number
          review?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
