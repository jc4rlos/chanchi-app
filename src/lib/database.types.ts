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
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      branch: {
        Row: {
          address: string
          created_at: string
          created_by: string
          deleted_at: string | null
          email: string | null
          id: number
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      daily_menu: {
        Row: {
          branch_id: number
          created_at: string
          created_by: string
          deleted_at: string | null
          dish_id: number
          id: number
          is_active: boolean
          menu_date: string
          price: number
          stock: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          branch_id: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          dish_id: number
          id?: number
          is_active?: boolean
          menu_date: string
          price: number
          stock?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          branch_id?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          dish_id?: number
          id?: number
          is_active?: boolean
          menu_date?: string
          price?: number
          stock?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'daily_menu_branch_id_fkey'
            columns: ['branch_id']
            isOneToOne: false
            referencedRelation: 'branch'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'daily_menu_dish_id_fkey'
            columns: ['dish_id']
            isOneToOne: false
            referencedRelation: 'dish'
            referencedColumns: ['id']
          },
        ]
      }
      dish: {
        Row: {
          base_price: number
          category_id: number
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          base_price: number
          category_id: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          base_price?: number
          category_id?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'dish_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'category'
            referencedColumns: ['id']
          },
        ]
      }
      employee: {
        Row: {
          auth_user_id: string | null
          branch_id: number
          created_at: string
          created_by: string
          deleted_at: string | null
          document_number: string
          email: string | null
          first_name: string
          hire_date: string
          id: number
          is_active: boolean
          last_name: string
          phone: string | null
          role: Database['public']['Enums']['employee_role']
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          auth_user_id?: string | null
          branch_id: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          document_number: string
          email?: string | null
          first_name: string
          hire_date: string
          id?: number
          is_active?: boolean
          last_name: string
          phone?: string | null
          role: Database['public']['Enums']['employee_role']
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          auth_user_id?: string | null
          branch_id?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          document_number?: string
          email?: string | null
          first_name?: string
          hire_date?: string
          id?: number
          is_active?: boolean
          last_name?: string
          phone?: string | null
          role?: Database['public']['Enums']['employee_role']
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'employee_branch_id_fkey'
            columns: ['branch_id']
            isOneToOne: false
            referencedRelation: 'branch'
            referencedColumns: ['id']
          },
        ]
      }
      menu_item: {
        Row: {
          created_at: string
          created_by: string
          icon: string | null
          id: number
          is_active: boolean
          label: string
          parent_id: number | null
          path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label: string
          parent_id?: number | null
          path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label?: string
          parent_id?: number | null
          path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'menu_item_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'menu_item'
            referencedColumns: ['id']
          },
        ]
      }
      menu_role_permission: {
        Row: {
          enabled: boolean
          id: number
          menu_item_id: number
          role: Database['public']['Enums']['employee_role']
        }
        Insert: {
          enabled?: boolean
          id?: number
          menu_item_id: number
          role: Database['public']['Enums']['employee_role']
        }
        Update: {
          enabled?: boolean
          id?: number
          menu_item_id?: number
          role?: Database['public']['Enums']['employee_role']
        }
        Relationships: [
          {
            foreignKeyName: 'menu_role_permission_menu_item_id_fkey'
            columns: ['menu_item_id']
            isOneToOne: false
            referencedRelation: 'menu_item'
            referencedColumns: ['id']
          },
        ]
      }
      order: {
        Row: {
          branch_id: number
          created_at: string
          created_by: string
          customer_name: string | null
          customer_phone: string | null
          deleted_at: string | null
          id: number
          notes: string | null
          order_type: Database['public']['Enums']['order_type']
          ordered_at: string
          status: Database['public']['Enums']['order_status']
          table_id: number | null
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
          waiter_id: number
        }
        Insert: {
          branch_id: number
          created_at?: string
          created_by: string
          customer_name?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          id?: number
          notes?: string | null
          order_type?: Database['public']['Enums']['order_type']
          ordered_at?: string
          status?: Database['public']['Enums']['order_status']
          table_id?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
          waiter_id: number
        }
        Update: {
          branch_id?: number
          created_at?: string
          created_by?: string
          customer_name?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          id?: number
          notes?: string | null
          order_type?: Database['public']['Enums']['order_type']
          ordered_at?: string
          status?: Database['public']['Enums']['order_status']
          table_id?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
          waiter_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_branch_id_fkey'
            columns: ['branch_id']
            isOneToOne: false
            referencedRelation: 'branch'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_table_id_fkey'
            columns: ['table_id']
            isOneToOne: false
            referencedRelation: 'restaurant_table'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_waiter_id_fkey'
            columns: ['waiter_id']
            isOneToOne: false
            referencedRelation: 'employee'
            referencedColumns: ['id']
          },
        ]
      }
      order_delivery: {
        Row: {
          address: string | null
          created_at: string
          created_by: string
          delivered_at: string | null
          delivery_fee: number
          district: string | null
          estimated_at: string | null
          id: number
          order_id: number
          phone: string | null
          recipient_name: string
          reference: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by: string
          delivered_at?: string | null
          delivery_fee?: number
          district?: string | null
          estimated_at?: string | null
          id?: number
          order_id: number
          phone?: string | null
          recipient_name: string
          reference?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string
          delivered_at?: string | null
          delivery_fee?: number
          district?: string | null
          estimated_at?: string | null
          id?: number
          order_id?: number
          phone?: string | null
          recipient_name?: string
          reference?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_delivery_order_id_fkey'
            columns: ['order_id']
            isOneToOne: true
            referencedRelation: 'order'
            referencedColumns: ['id']
          },
        ]
      }
      order_item: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          dish_id: number
          id: number
          notes: string | null
          order_id: number
          quantity: number
          subtotal: number | null
          unit_price: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          dish_id: number
          id?: number
          notes?: string | null
          order_id: number
          quantity?: number
          subtotal?: number | null
          unit_price: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          dish_id?: number
          id?: number
          notes?: string | null
          order_id?: number
          quantity?: number
          subtotal?: number | null
          unit_price?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_item_dish_id_fkey'
            columns: ['dish_id']
            isOneToOne: false
            referencedRelation: 'dish'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_item_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'order'
            referencedColumns: ['id']
          },
        ]
      }
      restaurant_table: {
        Row: {
          branch_id: number
          capacity: number
          created_at: string
          created_by: string
          deleted_at: string | null
          id: number
          is_active: boolean
          number: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          branch_id: number
          capacity?: number
          created_at?: string
          created_by: string
          deleted_at?: string | null
          id?: number
          is_active?: boolean
          number: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          branch_id?: number
          capacity?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: number
          is_active?: boolean
          number?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'restaurant_table_branch_id_fkey'
            columns: ['branch_id']
            isOneToOne: false
            referencedRelation: 'branch'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_access: { Args: never; Returns: Json }
    }
    Enums: {
      employee_role:
        | 'WAITER'
        | 'COOK'
        | 'CASHIER'
        | 'MANAGER'
        | 'SUPERVISOR'
        | 'ADMIN'
      order_status:
        | 'PENDING'
        | 'IN_PROGRESS'
        | 'READY'
        | 'DELIVERED'
        | 'CANCELLED'
        | 'CONFIRMED'
        | 'PREPARING'
        | 'ON_THE_WAY'
      order_type: 'DINE_IN' | 'DELIVERY' | 'TAKEAWAY'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employee_role: [
        'WAITER',
        'COOK',
        'CASHIER',
        'MANAGER',
        'SUPERVISOR',
        'ADMIN',
      ],
      order_status: [
        'PENDING',
        'IN_PROGRESS',
        'READY',
        'DELIVERED',
        'CANCELLED',
        'CONFIRMED',
        'PREPARING',
        'ON_THE_WAY',
      ],
      order_type: ['DINE_IN', 'DELIVERY', 'TAKEAWAY'],
    },
  },
} as const
