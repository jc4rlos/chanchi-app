import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savingsGoalsService } from '@/services/savings-goals'
import type { Database } from '@/lib/database.types'

type GoalInsert = Database['public']['Tables']['savings_goals']['Insert']

export const useSavings = (userId: string) => {
  const qc = useQueryClient()

  const goals = useQuery({
    queryKey: ['savings-goals', userId],
    queryFn: () => savingsGoalsService.findByUser(userId),
  })

  const create = useMutation({
    mutationFn: (payload: GoalInsert) => savingsGoalsService.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['savings-goals', userId] }),
  })

  const addAmount = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      savingsGoalsService.addAmount(id, amount),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['savings-goals', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => savingsGoalsService.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['savings-goals', userId] }),
  })

  return { goals, create, addAmount, remove }
}
