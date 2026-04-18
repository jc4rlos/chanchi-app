import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsService } from '@/services/accounts'
import type { Database } from '@/lib/database.types'

type AccountInsert = Database['public']['Tables']['accounts']['Insert']
type AccountUpdate = Database['public']['Tables']['accounts']['Update']

export const useAccounts = (userId: string) => {
  const qc = useQueryClient()

  const accounts = useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountsService.findByUser(userId),
  })

  const create = useMutation({
    mutationFn: (payload: AccountInsert) => accountsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts', userId] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AccountUpdate }) =>
      accountsService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts', userId] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => accountsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts', userId] }),
  })

  return { accounts, create, update, remove }
}
