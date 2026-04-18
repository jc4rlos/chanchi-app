import type {
  Database,
  TransactionType,
  CategoryType,
} from '@/lib/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Account = Database['public']['Tables']['accounts']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Budget = Database['public']['Tables']['budgets']['Row']
export type Debt = Database['public']['Tables']['debts']['Row']
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row']
export type Investment = Database['public']['Tables']['investments']['Row']
export type RecurringTransaction =
  Database['public']['Tables']['recurring_transactions']['Row']

export type TransactionWithCategory = Transaction & {
  categories: Pick<Category, 'name' | 'icon' | 'color'> | null
}

export type BudgetWithSpent = Budget & {
  spent: number
  categories: Pick<Category, 'name' | 'icon' | 'color'>
}

export type DashboardSummary = {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  savingsRate: number
}

export type TransactionFilters = {
  type?: TransactionType
  categoryId?: string
  accountId?: string
  dateFrom?: string
  dateTo?: string
}

export type CategoryWithType = Category & { type: CategoryType }
