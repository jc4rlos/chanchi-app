import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsService } from '@/services/debts'
import type { Database } from '@/lib/database.types'

type DebtInsert = Database['public']['Tables']['debts']['Insert']
type PaymentInsert = Database['public']['Tables']['debt_payments']['Insert']

export const useDebts = (userId: string) => {
  const qc = useQueryClient()
  const key = ['debts', userId]

  const debts = useQuery({
    queryKey: key,
    queryFn: () => debtsService.findByUser(userId),
  })

  const create = useMutation({
    mutationFn: (payload: DebtInsert) => debtsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const markPaid = useMutation({
    mutationFn: (id: string) => debtsService.markPaid(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const markUnpaid = useMutation({
    mutationFn: (id: string) => debtsService.markUnpaid(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => debtsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const addPayment = useMutation({
    mutationFn: (payload: PaymentInsert) => debtsService.addPayment(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const deletePayment = useMutation({
    mutationFn: (id: string) => debtsService.deletePayment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return {
    debts,
    create,
    markPaid,
    markUnpaid,
    remove,
    addPayment,
    deletePayment,
  }
}
