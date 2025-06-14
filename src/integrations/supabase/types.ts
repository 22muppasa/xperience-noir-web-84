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
      contact_messages: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          message: string
          name: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          message: string
          name?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          message?: string
          name?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: number
          id: number
          user_id: string
        }
        Insert: {
          group_id: number
          id?: number
          user_id: string
        }
        Update: {
          group_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_work: {
        Row: {
          assigned_to: string | null
          description: string | null
          id: number
          media_url: string | null
          title: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          title?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          description?: string | null
          id?: number
          media_url?: string | null
          title?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kids_work_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kids_work_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_work_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: number
          kids_work_id: number
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: number
          kids_work_id: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: number
          kids_work_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kids_work_comments_kids_work_id_fkey"
            columns: ["kids_work_id"]
            isOneToOne: false
            referencedRelation: "kids_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kids_work_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          group_id: number | null
          id: number
          is_read: boolean | null
          recipient_id: string | null
          sender_id: string
          subject: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          group_id?: number | null
          id?: number
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id: string
          subject?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          group_id?: number | null
          id?: number
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          link: string | null
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          link?: string | null
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          link?: string | null
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      program_categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      program_registrations: {
        Row: {
          created_at: string | null
          id: number
          program_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          program_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          program_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_registrations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: number
          start_date: string | null
          title: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
          title: string
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          start_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "program_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: number
          media_url: string | null
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          media_url?: string | null
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          media_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_created_by_fkey"
            columns: ["created_by"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
