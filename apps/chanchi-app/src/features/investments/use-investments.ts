import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { investmentsService } from '@/services/investments'
import type { Database } from '@/lib/database.types'

type InvestmentInsert = Database['public']['Tables']['investments']['Insert']
type InvestmentUpdate = Database['public']['Tables']['investments']['Update']

export const useInvestments = (userId: string) => {
  const qc = useQueryClient()

  const investments = useQuery({
    queryKey: ['investments', userId],
    queryFn: () => investmentsService.findByUser(userId),
  })

  const create = useMutation({
    mutationFn: (payload: InvestmentInsert) =>
      investmentsService.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['investments', userId] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InvestmentUpdate }) =>
      investmentsService.update(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['investments', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => investmentsService.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['investments', userId] }),
  })

  return { investments, create, update, remove }
}
