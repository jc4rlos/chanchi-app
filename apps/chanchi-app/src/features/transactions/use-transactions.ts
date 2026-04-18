import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsService } from '@/services/accounts'
import { categoriesService } from '@/services/categories'
import { transactionsService } from '@/services/transactions'
import type { TransactionFilters } from '@/types/finance'
import type { Database } from '@/lib/database.types'

type TxInsert = Database['public']['Tables']['transactions']['Insert']

export const useTransactions = (
  userId: string,
  filters?: TransactionFilters
) => {
  const qc = useQueryClient()

  const transactions = useQuery({
    queryKey: ['transactions', userId, filters],
    queryFn: () => transactionsService.findByUser(userId, filters ?? {}),
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
    mutationFn: (payload: TxInsert) => transactionsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions', userId] })
      qc.invalidateQueries({ queryKey: ['dashboard-summary', userId] })
      qc.invalidateQueries({ queryKey: ['recent-transactions', userId] })
      qc.invalidateQueries({ queryKey: ['accounts', userId] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => transactionsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions', userId] })
      qc.invalidateQueries({ queryKey: ['dashboard-summary', userId] })
    },
  })

  return { transactions, categories, accounts, create, remove }
}
