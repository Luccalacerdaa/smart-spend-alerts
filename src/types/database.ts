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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      credit_card_statements: {
        Row: {
          created_at: string | null
          credit_card_id: string
          due_date: string
          id: string
          is_paid: boolean | null
          paid_amount: number | null
          statement_date: string
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_card_id: string
          due_date: string
          id?: string
          is_paid?: boolean | null
          paid_amount?: number | null
          statement_date: string
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_card_id?: string
          due_date?: string
          id?: string
          is_paid?: boolean | null
          paid_amount?: number | null
          statement_date?: string
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_statements_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          card_limit: number
          closing_day: number
          color: string
          created_at: string | null
          due_day: number
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_limit?: number
          closing_day: number
          color?: string
          created_at?: string | null
          due_day: number
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_limit?: number
          closing_day?: number
          color?: string
          created_at?: string | null
          due_day?: number
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fixed_payments: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["category_type"]
          created_at: string | null
          due_day: number
          id: string
          is_paid: boolean | null
          month: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          due_day: number
          id?: string
          is_paid?: boolean | null
          month: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          due_day?: number
          id?: string
          is_paid?: boolean | null
          month?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          month: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          month: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          month?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type_enum"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          notification_time_bills: string | null
          notification_time_followup: string | null
          notifications_enabled: boolean | null
          phone: string | null
          timezone: string | null
          updated_at: string | null
          whatsapp_formatted: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          notification_time_bills?: string | null
          notification_time_followup?: string | null
          notifications_enabled?: boolean | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          whatsapp_formatted?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notification_time_bills?: string | null
          notification_time_followup?: string | null
          notifications_enabled?: boolean | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string | null
          whatsapp_formatted?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["category_type"] | null
          created_at: string | null
          credit_card_id: string | null
          current_installment: number | null
          date: string
          id: string
          installments: number | null
          is_installment: boolean | null
          note: string | null
          source: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["category_type"] | null
          created_at?: string | null
          credit_card_id?: string | null
          current_installment?: number | null
          date: string
          id?: string
          installments?: number | null
          is_installment?: boolean | null
          note?: string | null
          source?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["category_type"] | null
          created_at?: string | null
          credit_card_id?: string | null
          current_installment?: number | null
          date?: string
          id?: string
          installments?: number | null
          is_installment?: boolean | null
          note?: string | null
          source?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          id: string
          notification_id: string | null
          payload: Json
          response_body: string | null
          response_status: number | null
          sent_at: string | null
          success: boolean | null
          user_id: string
          webhook_url: string
        }
        Insert: {
          id?: string
          notification_id?: string | null
          payload: Json
          response_body?: string | null
          response_status?: number | null
          sent_at?: string | null
          success?: boolean | null
          user_id: string
          webhook_url: string
        }
        Update: {
          id?: string
          notification_id?: string | null
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          sent_at?: string | null
          success?: boolean | null
          user_id?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_settings: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
          webhook_secret: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
          webhook_secret?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
          webhook_secret?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_statement_total: {
        Args: { p_card_id: string; p_statement_date: string }
        Returns: number
      }
      create_installment_transactions: {
        Args: {
          p_amount: number
          p_category: Database["public"]["Enums"]["category_type"]
          p_credit_card_id: string
          p_first_date: string
          p_installments: number
          p_note?: string
          p_user_id: string
        }
        Returns: string[]
      }
      get_card_expenses: {
        Args: { p_card_id: string; p_month: string }
        Returns: number
      }
      get_credit_card_history: {
        Args: { p_card_id: string; p_limit?: number }
        Returns: {
          amount: number
          category: Database["public"]["Enums"]["category_type"]
          current_installment: number
          date: string
          id: string
          installment_info: string
          is_installment: boolean
          note: string
          total_installments: number
        }[]
      }
      get_expenses_by_category: {
        Args: { p_month: string; p_user_id: string }
        Returns: {
          category: Database["public"]["Enums"]["category_type"]
          total: number
        }[]
      }
      get_future_installments: {
        Args: { p_card_id: string; p_from_date?: string }
        Returns: {
          amount: number
          category: Database["public"]["Enums"]["category_type"]
          current_installment: number
          date: string
          id: string
          months_ahead: number
          note: string
          total_installments: number
        }[]
      }
      get_installments_by_month: {
        Args: { p_card_id: string; p_months_ahead?: number }
        Returns: {
          installment_count: number
          month_date: string
          month_year: string
          total_amount: number
        }[]
      }
      get_monthly_expenses: {
        Args: { p_month: string; p_user_id: string }
        Returns: number
      }
      get_monthly_income: {
        Args: { p_month: string; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      category_type:
        | "alimentacao"
        | "transporte"
        | "lazer"
        | "contas"
        | "outros"
      notification_type_enum:
        | "due_date_morning"
        | "due_date_followup"
        | "budget_alert"
        | "goal_achieved"
        | "goal_warning"
        | "payment_reminder"
        | "card_limit_warning"
        | "unusual_spending"
        | "monthly_summary"
      transaction_type: "income" | "expense"
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
      category_type: ["alimentacao", "transporte", "lazer", "contas", "outros"],
      notification_type_enum: [
        "due_date_morning",
        "due_date_followup",
        "budget_alert",
        "goal_achieved",
        "goal_warning",
        "payment_reminder",
        "card_limit_warning",
        "unusual_spending",
        "monthly_summary",
      ],
      transaction_type: ["income", "expense"],
    },
  },
} as const

