import type { Account } from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

const base = createSupabaseService('accounts')

export const accountsService = {
  ...base,

  findByUser: async (userId: string): Promise<Account[]> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  totalBalance: async (userId: string): Promise<number> => {
    const accounts = await accountsService.findByUser(userId)
    return accounts.reduce((sum, a) => sum + a.balance, 0)
  },
}
