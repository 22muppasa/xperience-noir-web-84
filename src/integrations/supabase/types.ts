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
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      child_association_requests: {
        Row: {
          child_id: string
          id: string
          notes: string | null
          parent_id: string
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          child_id: string
          id?: string
          notes?: string | null
          parent_id: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          child_id?: string
          id?: string
          notes?: string | null
          parent_id?: string
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_association_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_association_requests_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_association_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_milestones: {
        Row: {
          achieved_date: string
          category: string
          child_id: string
          created_at: string
          description: string | null
          id: string
          notes: string | null
          recorded_by: string
          title: string
        }
        Insert: {
          achieved_date: string
          category: string
          child_id: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          recorded_by: string
          title: string
        }
        Update: {
          achieved_date?: string
          category?: string
          child_id?: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          recorded_by?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_milestones_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          last_name: string
          medical_notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          last_name: string
          medical_notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          last_name?: string
          medical_notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          responded_at: string | null
          responded_by: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          can_pickup: boolean
          child_id: string
          created_at: string
          email: string | null
          id: string
          is_primary: boolean
          name: string
          notes: string | null
          phone: string
          relationship: string
          updated_at: string
        }
        Insert: {
          can_pickup?: boolean
          child_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name: string
          notes?: string | null
          phone: string
          relationship: string
          updated_at?: string
        }
        Update: {
          can_pickup?: boolean
          child_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          notes?: string | null
          phone?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          child_age: number | null
          child_id: string | null
          child_name: string
          completed_at: string | null
          customer_id: string | null
          enrolled_at: string | null
          id: string
          notes: string | null
          program_id: string | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Insert: {
          child_age?: number | null
          child_id?: string | null
          child_name: string
          completed_at?: string | null
          customer_id?: string | null
          enrolled_at?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Update: {
          child_age?: number | null
          child_id?: string | null
          child_name?: string
          completed_at?: string | null
          customer_id?: string | null
          enrolled_at?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          bucket_name: string
          completed_at: string | null
          created_at: string | null
          file_path: string
          file_size: number
          id: string
          mime_type: string
          original_filename: string
          upload_status: string | null
          user_id: string
        }
        Insert: {
          bucket_name: string
          completed_at?: string | null
          created_at?: string | null
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          original_filename: string
          upload_status?: string | null
          user_id: string
        }
        Update: {
          bucket_name?: string
          completed_at?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          original_filename?: string
          upload_status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kids_work: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          enrollment_id: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          google_drive_file_id: string | null
          google_drive_link: string | null
          id: string
          link_status: string | null
          parent_customer_id: string | null
          storage_path: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          enrollment_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          google_drive_file_id?: string | null
          google_drive_link?: string | null
          id?: string
          link_status?: string | null
          parent_customer_id?: string | null
          storage_path?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          enrollment_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          google_drive_file_id?: string | null
          google_drive_link?: string | null
          id?: string
          link_status?: string | null
          parent_customer_id?: string | null
          storage_path?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kids_work_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kids_work_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_work_tags: {
        Row: {
          id: string
          tag_id: string
          work_id: string
        }
        Insert: {
          id?: string
          tag_id: string
          work_id: string
        }
        Update: {
          id?: string
          tag_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kids_work_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "work_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kids_work_tags_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "kids_work"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_posts_cache: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          last_synced: string
          linkedin_post_id: string
          linkedin_url: string
        }
        Insert: {
          content: string
          created_at: string
          id?: string
          image_url?: string | null
          last_synced?: string
          linkedin_post_id: string
          linkedin_url: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_synced?: string
          linkedin_post_id?: string
          linkedin_url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          recipient_id: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          digest_frequency: string
          email_enabled: boolean
          id: string
          notification_type: string
          push_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          digest_frequency?: string
          email_enabled?: boolean
          id?: string
          notification_type: string
          push_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          digest_frequency?: string
          email_enabled?: boolean
          id?: string
          notification_type?: string
          push_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_work_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_work_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_work_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_work_id_fkey"
            columns: ["related_work_id"]
            isOneToOne: false
            referencedRelation: "kids_work"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_relationships: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          can_receive_notifications: boolean
          can_view_work: boolean
          child_id: string
          created_at: string
          id: string
          parent_id: string
          relationship_type: string
          status: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          can_receive_notifications?: boolean
          can_view_work?: boolean
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
          relationship_type?: string
          status?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          can_receive_notifications?: boolean
          can_view_work?: boolean
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
          relationship_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_relationships_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_relationships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          emergency_contact: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          storage_path: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          emergency_contact?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          storage_path?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          emergency_contact?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          storage_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: string | null
          end_date: string | null
          id: string
          image_url: string | null
          max_participants: number | null
          price: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["program_status"] | null
          storage_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          max_participants?: number | null
          price?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["program_status"] | null
          storage_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          max_participants?: number | null
          price?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["program_status"] | null
          storage_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          image_url: string | null
          published_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          storage_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          storage_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          storage_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      work_collection_items: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          work_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          work_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "work_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_collection_items_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "kids_work"
            referencedColumns: ["id"]
          },
        ]
      }
      work_collections: {
        Row: {
          child_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_collections_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      work_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_enrollment_capacity: {
        Args: { program_id_param: string }
        Returns: {
          current_count: number
          max_participants: number
          is_full: boolean
        }[]
      }
      get_admin_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          first_name: string
          last_name: string
          email: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_programs_with_capacity: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          price: number
          duration: string
          start_date: string
          end_date: string
          max_participants: number
          image_url: string
          status: Database["public"]["Enums"]["program_status"]
          current_enrollments: number
          is_full: boolean
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      enrollment_status: "pending" | "active" | "completed" | "cancelled"
      message_status:
        | "unread"
        | "read"
        | "archived"
        | "in_progress"
        | "responded"
      post_status: "draft" | "scheduled" | "published" | "archived"
      program_status: "draft" | "published" | "archived"
      user_role: "admin" | "customer"
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
    Enums: {
      enrollment_status: ["pending", "active", "completed", "cancelled"],
      message_status: [
        "unread",
        "read",
        "archived",
        "in_progress",
        "responded",
      ],
      post_status: ["draft", "scheduled", "published", "archived"],
      program_status: ["draft", "published", "archived"],
      user_role: ["admin", "customer"],
    },
  },
} as const
