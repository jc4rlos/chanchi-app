import type {
  TransactionWithCategory,
  TransactionFilters,
  DashboardSummary,
} from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

type RawTx = { type: string; amount: number }
type RawCatTx = {
  category_id: string | null
  amount: number
  categories: { name: string; icon: string | null; color: string | null } | null
}

const base = createSupabaseService('transactions')

export const transactionsService = {
  ...base,

  findByUser: async (
    userId: string,
    filters: TransactionFilters = {},
    limit = 50
  ): Promise<TransactionWithCategory[]> => {
    let query = supabase
      .from('transactions')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (filters.type) query = query.eq('type', filters.type)
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    if (filters.accountId) query = query.eq('account_id', filters.accountId)
    if (filters.dateFrom) query = query.gte('date', filters.dateFrom)
    if (filters.dateTo) query = query.lte('date', filters.dateTo)

    const { data, error } = await query
    if (error) throw error
    return (data ?? []) as unknown as TransactionWithCategory[]
  },

  monthlySummary: async (
    userId: string,
    monthStart: string
  ): Promise<DashboardSummary> => {
    const year = monthStart.slice(0, 4)
    const month = monthStart.slice(5, 7)
    const dateFrom = `${year}-${month}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)
      .in('type', ['income', 'expense'])
      .gte('date', dateFrom)
      .lte('date', dateTo)

    if (error) throw error

    const rows = (data ?? []) as unknown as RawTx[]
    const totalIncome = rows
      .filter((r) => r.type === 'income')
      .reduce((s, r) => s + r.amount, 0)
    const totalExpenses = rows
      .filter((r) => r.type === 'expense')
      .reduce((s, r) => s + r.amount, 0)
    const netBalance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0

    return { totalIncome, totalExpenses, netBalance, savingsRate }
  },

  expensesByCategory: async (
    userId: string,
    monthStart: string
  ): Promise<
    {
      category_id: string
      total: number
      name: string
      icon: string | null
      color: string | null
    }[]
  > => {
    const year = monthStart.slice(0, 4)
    const month = monthStart.slice(5, 7)
    const dateFrom = `${year}-${month}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await supabase
      .from('transactions')
      .select('category_id, amount, categories(name, icon, color)')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', dateFrom)
      .lte('date', dateTo)
      .not('category_id', 'is', null)

    if (error) throw error

    const rows = (data ?? []) as unknown as RawCatTx[]
    const map = new Map<
      string,
      { total: number; name: string; icon: string | null; color: string | null }
    >()

    for (const row of rows) {
      if (!row.category_id) continue
      const existing = map.get(row.category_id)
      if (existing) {
        existing.total += row.amount
      } else {
        map.set(row.category_id, {
          total: row.amount,
          name: row.categories?.name ?? 'Sin categoría',
          icon: row.categories?.icon ?? null,
          color: row.categories?.color ?? null,
        })
      }
    }

    return Array.from(map.entries())
      .map(([category_id, v]) => ({ category_id, ...v }))
      .sort((a, b) => b.total - a.total)
  },

  monthlyTrend: async (
    userId: string,
    months = 6
  ): Promise<{ month: string; income: number; expenses: number }[]> => {
    const result: { month: string; income: number; expenses: number }[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const dateFrom = `${year}-${month}-01`
      const lastDay = new Date(year, d.getMonth() + 1, 0).getDate()
      const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`

      const { data, error } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', userId)
        .in('type', ['income', 'expense'])
        .gte('date', dateFrom)
        .lte('date', dateTo)

      if (error) throw error

      const rows = (data ?? []) as unknown as RawTx[]
      result.push({
        month: `${year}-${month}`,
        income: rows
          .filter((r) => r.type === 'income')
          .reduce((s, r) => s + r.amount, 0),
        expenses: rows
          .filter((r) => r.type === 'expense')
          .reduce((s, r) => s + r.amount, 0),
      })
    }

    return result
  },
}
