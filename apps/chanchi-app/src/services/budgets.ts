import type { BudgetWithSpent } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

type RawBudget = {
  id: string
  user_id: string
  category_id: string
  month: string
  amount: number
  alert_at_pct: number
  created_at: string
  categories: { name: string; icon: string | null; color: string | null }
}

type RawTx = { category_id: string | null; amount: number }

const base = createSupabaseService('budgets')

export const budgetsService = {
  ...base,

  findByMonth: async (
    userId: string,
    monthStart: string
  ): Promise<BudgetWithSpent[]> => {
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .eq('month', monthStart)
    if (error) throw error

    const year = monthStart.slice(0, 4)
    const month = monthStart.slice(5, 7)
    const dateFrom = `${year}-${month}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`

    const { data: txs, error: txErr } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', dateFrom)
      .lte('date', dateTo)
    if (txErr) throw txErr

    const rows = budgets as unknown as RawBudget[]
    const txRows = (txs ?? []) as unknown as RawTx[]

    const spentMap = new Map<string, number>()
    for (const tx of txRows) {
      if (!tx.category_id) continue
      spentMap.set(
        tx.category_id,
        (spentMap.get(tx.category_id) ?? 0) + tx.amount
      )
    }

    return rows.map((b) => ({
      ...b,
      spent: spentMap.get(b.category_id) ?? 0,
      categories: b.categories,
    }))
  },
}
