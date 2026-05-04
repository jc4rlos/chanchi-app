import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsService } from '@/services/accounts'
import { categoriesService } from '@/services/categories'
import { recurringService } from '@/services/recurring'
import type { Database } from '@/lib/database.types'

type RecurringInsert =
  Database['public']['Tables']['recurring_transactions']['Insert']
type RecurringUpdate =
  Database['public']['Tables']['recurring_transactions']['Update']

export const useRecurring = (userId: string) => {
  const qc = useQueryClient()

  const recurring = useQuery({
    queryKey: ['recurring', userId],
    queryFn: () => recurringService.findByUser(userId),
  })

  const categories = useQuery({
    queryKey: ['categories', userId],
    queryFn: () => categoriesService.findAll(userId),
  })

  const accounts = useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountsService.findByUser(userId),
  })

  const create = useMutation({
    mutationFn: (payload: RecurringInsert) => recurringService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => recurringService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring', userId] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RecurringUpdate }) =>
      recurringService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring', userId] }),
  })

  const register = useMutation({
    mutationFn: (item: Parameters<typeof recurringService.register>[0]) =>
      recurringService.register(item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recurring', userId] })
      qc.invalidateQueries({ queryKey: ['transactions', userId] })
      qc.invalidateQueries({ queryKey: ['dashboard-summary', userId] })
      qc.invalidateQueries({ queryKey: ['recent-transactions', userId] })
      qc.invalidateQueries({ queryKey: ['monthly-trend', userId] })
      qc.invalidateQueries({ queryKey: ['expense-by-category', userId] })
    },
  })

  return { recurring, categories, accounts, create, remove, update, register }
}
