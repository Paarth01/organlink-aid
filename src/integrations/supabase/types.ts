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
      donors: {
        Row: {
          availability: boolean | null
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          city: string | null
          created_at: string | null
          id: string
          last_donation_date: string | null
          latitude: number | null
          longitude: number | null
          medical_notes: string | null
          organ_types: Database["public"]["Enums"]["organ_type"][] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: boolean | null
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          city?: string | null
          created_at?: string | null
          id?: string
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          medical_notes?: string | null
          organ_types?: Database["public"]["Enums"]["organ_type"][] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: boolean | null
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          city?: string | null
          created_at?: string | null
          id?: string
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          medical_notes?: string | null
          organ_types?: Database["public"]["Enums"]["organ_type"][] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          created_at: string | null
          id: string
          license_number: string | null
          name: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          license_number?: string | null
          name: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          license_number?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          donor_id: string
          id: string
          matched_at: string | null
          notes: string | null
          request_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["match_status"]
        }
        Insert: {
          donor_id: string
          id?: string
          matched_at?: string | null
          notes?: string | null
          request_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
        }
        Update: {
          donor_id?: string
          id?: string
          matched_at?: string | null
          notes?: string | null
          request_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
        }
        Relationships: [
          {
            foreignKeyName: "matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          blood_type_needed: Database["public"]["Enums"]["blood_type"]
          city: string
          created_at: string | null
          description: string | null
          hospital_id: string
          id: string
          organ_needed: Database["public"]["Enums"]["organ_type"]
          patient_age: number | null
          patient_name: string
          required_by: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          blood_type_needed: Database["public"]["Enums"]["blood_type"]
          city: string
          created_at?: string | null
          description?: string | null
          hospital_id: string
          id?: string
          organ_needed: Database["public"]["Enums"]["organ_type"]
          patient_age?: number | null
          patient_name: string
          required_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          blood_type_needed?: Database["public"]["Enums"]["blood_type"]
          city?: string
          created_at?: string | null
          description?: string | null
          hospital_id?: string
          id?: string
          organ_needed?: Database["public"]["Enums"]["organ_type"]
          patient_age?: number | null
          patient_name?: string
          required_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "requests_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      match_status: "pending" | "accepted" | "declined"
      organ_type:
        | "kidney"
        | "liver"
        | "heart"
        | "lung"
        | "cornea"
        | "bone_marrow"
        | "skin"
        | "blood"
      request_status: "pending" | "matched" | "completed" | "cancelled"
      urgency_level: "low" | "medium" | "high"
      user_role: "donor" | "hospital" | "ngo" | "admin"
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
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      match_status: ["pending", "accepted", "declined"],
      organ_type: [
        "kidney",
        "liver",
        "heart",
        "lung",
        "cornea",
        "bone_marrow",
        "skin",
        "blood",
      ],
      request_status: ["pending", "matched", "completed", "cancelled"],
      urgency_level: ["low", "medium", "high"],
      user_role: ["donor", "hospital", "ngo", "admin"],
    },
  },
} as const
