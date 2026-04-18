import type { RecurringTransaction } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

const base = createSupabaseService('recurring_transactions')

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
}
