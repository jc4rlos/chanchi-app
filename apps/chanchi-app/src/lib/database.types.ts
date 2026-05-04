export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'credit_card'
  | 'investment'
export type CategoryType = 'income' | 'expense'
export type TransactionType = 'income' | 'expense' | 'transfer'
export type AssetType =
  | 'stock'
  | 'etf'
  | 'crypto'
  | 'bond'
  | 'fund'
  | 'real_estate'
  | 'other'
export type RecurringInterval =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'
export type DebtDirection = 'i_owe' | 'they_owe_me'
export type SavingsGoalStatus = 'active' | 'completed' | 'cancelled'

export interface Database {
  public: {
    PostgrestVersion: "12"
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          preferred_currency: string
          auto_save_pct: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_currency?: string
          auto_save_pct?: number
          created_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          preferred_currency?: string
          auto_save_pct?: number
        }
        Relationships: []
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: AccountType
          currency: string
          balance: number
          color: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: AccountType
          currency?: string
          balance?: number
          color?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          type?: AccountType
          currency?: string
          balance?: number
          color?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: CategoryType
          icon: string | null
          color: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: CategoryType
          icon?: string | null
          color?: string | null
          is_active?: boolean
        }
        Update: {
          name?: string
          type?: CategoryType
          icon?: string | null
          color?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          destination_account_id: string | null
          category_id: string | null
          type: TransactionType
          amount: number
          description: string | null
          date: string
          receipt_url: string | null
          is_recurring: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          destination_account_id?: string | null
          category_id?: string | null
          type: TransactionType
          amount: number
          description?: string | null
          date: string
          receipt_url?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Update: {
          account_id?: string
          destination_account_id?: string | null
          category_id?: string | null
          type?: TransactionType
          amount?: number
          description?: string | null
          date?: string
          receipt_url?: string | null
          is_recurring?: boolean
        }
        Relationships: []
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          month: string
          amount: number
          alert_at_pct: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          month: string
          amount: number
          alert_at_pct?: number
          created_at?: string
        }
        Update: {
          category_id?: string
          month?: string
          amount?: number
          alert_at_pct?: number
        }
        Relationships: []
      }
      debts: {
        Row: {
          id: string
          user_id: string
          counterpart: string
          direction: DebtDirection
          amount: number
          currency: string
          description: string | null
          due_date: string | null
          is_paid: boolean
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          counterpart: string
          direction: DebtDirection
          amount: number
          currency?: string
          description?: string | null
          due_date?: string | null
          is_paid?: boolean
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          counterpart?: string
          direction?: DebtDirection
          amount?: number
          currency?: string
          description?: string | null
          due_date?: string | null
          is_paid?: boolean
          paid_at?: string | null
        }
        Relationships: []
      }
      debt_payments: {
        Row: {
          id: string
          debt_id: string
          amount: number
          note: string | null
          paid_at: string
          created_at: string
        }
        Insert: {
          id?: string
          debt_id: string
          amount: number
          note?: string | null
          paid_at?: string
          created_at?: string
        }
        Update: {
          amount?: number
          note?: string | null
          paid_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          name: string
          target_amount: number
          saved_amount: number
          currency: string
          target_date: string | null
          status: SavingsGoalStatus
          icon: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          name: string
          target_amount: number
          saved_amount?: number
          currency?: string
          target_date?: string | null
          status?: SavingsGoalStatus
          icon?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          name?: string
          target_amount?: number
          saved_amount?: number
          currency?: string
          target_date?: string | null
          status?: SavingsGoalStatus
          icon?: string | null
          color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          id: string
          user_id: string
          name: string
          ticker: string | null
          asset_type: AssetType
          currency: string
          total_invested: number
          current_value: number
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          ticker?: string | null
          asset_type: AssetType
          currency?: string
          total_invested?: number
          current_value?: number
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          ticker?: string | null
          asset_type?: AssetType
          currency?: string
          total_invested?: number
          current_value?: number
          notes?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          type: 'income' | 'expense'
          amount: number
          description: string
          interval: RecurringInterval
          next_date: string
          end_date: string | null
          is_active: boolean
          last_executed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          type: 'income' | 'expense'
          amount: number
          description: string
          interval: RecurringInterval
          next_date: string
          end_date?: string | null
          is_active?: boolean
          last_executed_at?: string | null
          created_at?: string
        }
        Update: {
          account_id?: string
          category_id?: string | null
          type?: 'income' | 'expense'
          amount?: number
          description?: string
          interval?: RecurringInterval
          next_date?: string
          end_date?: string | null
          is_active?: boolean
          last_executed_at?: string | null
        }
        Relationships: []
      }
    }
  }
}
