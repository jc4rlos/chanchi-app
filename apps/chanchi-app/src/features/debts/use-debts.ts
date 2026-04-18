import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsService } from '@/services/debts'
import type { Database } from '@/lib/database.types'

type DebtInsert = Database['public']['Tables']['debts']['Insert']

export const useDebts = (userId: string) => {
  const qc = useQueryClient()

  const debts = useQuery({
    queryKey: ['debts', userId],
    queryFn: () => debtsService.findByUser(userId, false),
  })

  const create = useMutation({
    mutationFn: (payload: DebtInsert) => debtsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts', userId] }),
  })

  const markPaid = useMutation({
    mutationFn: (id: string) => debtsService.markPaid(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => debtsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts', userId] }),
  })

  return { debts, create, markPaid, remove }
}
