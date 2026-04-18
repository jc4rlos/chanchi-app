import type { DebtWithPayments } from '@/types/finance'
import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

type PaymentInsert = Database['public']['Tables']['debt_payments']['Insert']

const base = createSupabaseService('debts')

export const debtsService = {
  ...base,

  findByUser: async (userId: string): Promise<DebtWithPayments[]> => {
    const { data, error } = await supabase
      .from('debts')
      .select(
        '*, debt_payments(id, debt_id, amount, note, paid_at, created_at)'
      )
      .eq('user_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false })
    if (error) throw error
    return ((data ?? []) as unknown as DebtWithPayments[]).map((d) => {
      const paid = d.debt_payments.reduce((sum, p) => sum + Number(p.amount), 0)
      return { ...d, paid_amount: paid, remaining: Number(d.amount) - paid }
    })
  },

  addPayment: async (payload: PaymentInsert) => {
    const { data, error } = await supabase
      .from('debt_payments')
      .insert(payload as never)
      .select()
      .single()
    if (error) throw error
    return data
  },

  deletePayment: async (id: string) => {
    const { error } = await supabase.from('debt_payments').delete().eq('id', id)
    if (error) throw error
  },

  markPaid: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('debts')
      .update({ is_paid: true, paid_at: new Date().toISOString() } as never)
      .eq('id', id)
    if (error) throw error
  },

  markUnpaid: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('debts')
      .update({ is_paid: false, paid_at: null } as never)
      .eq('id', id)
    if (error) throw error
  },
}
