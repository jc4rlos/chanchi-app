import type { Investment } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

const base = createSupabaseService('investments')

export const investmentsService = {
  ...base,

  findByUser: async (userId: string): Promise<Investment[]> => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  portfolioSummary: (investments: Investment[]) => {
    const totalInvested = investments.reduce((s, i) => s + i.total_invested, 0)
    const currentValue = investments.reduce((s, i) => s + i.current_value, 0)
    const gain = currentValue - totalInvested
    const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0
    return { totalInvested, currentValue, gain, gainPct }
  },
}
