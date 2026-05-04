import type { RecurringTransaction } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

const base = createSupabaseService('recurring_transactions')

const calcNextDate = (current: string, interval: RecurringTransaction['interval']): string => {
  const d = new Date(current)
  switch (interval) {
    case 'daily':    d.setDate(d.getDate() + 1); break
    case 'weekly':   d.setDate(d.getDate() + 7); break
    case 'biweekly': d.setDate(d.getDate() + 14); break
    case 'monthly':  d.setMonth(d.getMonth() + 1); break
    case 'yearly':   d.setFullYear(d.getFullYear() + 1); break
  }
  return d.toISOString().slice(0, 10)
}

export const recurringService = {
  ...base,

  findByUser: async (userId: string): Promise<RecurringTransaction[]> => {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('next_date', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  register: async (item: RecurringTransaction): Promise<void> => {
    const today = new Date().toISOString().slice(0, 10)

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: item.user_id,
      account_id: item.account_id,
      category_id: item.category_id,
      type: item.type,
      amount: item.amount,
      description: item.description,
      date: today,
      is_recurring: true,
    })
    if (txError) throw txError

    const { error: recError } = await supabase
      .from('recurring_transactions')
      .update({
        next_date: calcNextDate(item.next_date, item.interval),
        last_executed_at: today,
      })
      .eq('id', item.id)
    if (recError) throw recError
  },
}
