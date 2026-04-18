import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '@/services/categories'
import type { Database } from '@/lib/database.types'

type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export const useCategories = (userId: string) => {
  const qc = useQueryClient()
  const key = ['categories', userId]

  const categories = useQuery({
    queryKey: key,
    queryFn: () => categoriesService.findAll(userId),
  })

  const create = useMutation({
    mutationFn: (payload: CategoryInsert) =>
      categoriesService.createForUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryUpdate }) =>
      categoriesService.updateForUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => categoriesService.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return { categories, create, update, remove }
}
