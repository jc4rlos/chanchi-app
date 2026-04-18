import type { Debt } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

const base = createSupabaseService('debts')

export const debtsService = {
  ...base,

  findByUser: async (userId: string, onlyPending = true): Promise<Debt[]> => {
    let query = supabase
      .from('debts')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false })
    if (onlyPending) query = query.eq('is_paid', false)
    const { data, error } = await query
    if (error) throw error
    return (data ?? []) as unknown as Debt[]
  },

  markPaid: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('debts')
      .update({ is_paid: true, paid_at: new Date().toISOString() } as never)
      .eq('id', id)
    if (error) throw error
  },
}
