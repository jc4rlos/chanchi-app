import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetsService } from '@/services/budgets'
import { categoriesService } from '@/services/categories'
import type { Database } from '@/lib/database.types'
import { currentMonthStart } from '@/lib/utils'

type BudgetInsert = Database['public']['Tables']['budgets']['Insert']

export const useBudgets = (userId: string) => {
  const qc = useQueryClient()
  const month = currentMonthStart()

  const budgets = useQuery({
    queryKey: ['budgets', userId, month],
    queryFn: () => budgetsService.findByMonth(userId, month),
  })

  const categories = useQuery({
    queryKey: ['categories-expense', userId],
    queryFn: () => categoriesService.findByType(userId, 'expense'),
  })

  const create = useMutation({
    mutationFn: (payload: BudgetInsert) => budgetsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => budgetsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets', userId] }),
  })

  return { budgets, categories, create, remove, month }
}
