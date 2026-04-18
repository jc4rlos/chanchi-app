import type { SavingsGoal } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

type RawGoal = { saved_amount: number; target_amount: number }

const base = createSupabaseService('savings_goals')

export const savingsGoalsService = {
  ...base,

  findByUser: async (userId: string): Promise<SavingsGoal[]> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as unknown as SavingsGoal[]
  },

  addAmount: async (id: string, amount: number): Promise<void> => {
    const { data: goal, error: fetchErr } = await supabase
      .from('savings_goals')
      .select('saved_amount, target_amount')
      .eq('id', id)
      .single()
    if (fetchErr) throw fetchErr

    const g = goal as unknown as RawGoal
    const newAmount = g.saved_amount + amount
    const status = newAmount >= g.target_amount ? 'completed' : 'active'

    const { error } = await supabase
      .from('savings_goals')
      .update({
        saved_amount: newAmount,
        status,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', id)
    if (error) throw error
  },
}
