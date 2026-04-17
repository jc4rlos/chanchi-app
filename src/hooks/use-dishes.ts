import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Database } from '@/lib/database.types'
import { services } from '@/lib/supabase-service'

type DishRow = Database['public']['Tables']['dish']['Row']
type DishInsert = Database['public']['Tables']['dish']['Insert']
type DishUpdate = Database['public']['Tables']['dish']['Update']

export const dishQueryKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...dishQueryKeys.all, 'detail', id] as const,
}

export function useDishes() {
  return useQuery({
    queryKey: dishQueryKeys.lists(),
    queryFn: () => services.dish.findAll(),
  })
}

export function useDish(id: number) {
  return useQuery({
    queryKey: dishQueryKeys.detail(id),
    queryFn: () => services.dish.findById(id),
    enabled: id > 0,
  })
}

export function useCreateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DishInsert) => services.dish.create(payload),
    onSuccess: (created: DishRow) => {
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.lists() })
      queryClient.setQueryData(dishQueryKeys.detail(created.id), created)
      toast.success('Plato creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el plato: ${error.message}`)
    },
  })
}

export function useUpdateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DishUpdate }) =>
      services.dish.update(id, payload),
    onSuccess: (updated: DishRow) => {
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.lists() })
      queryClient.setQueryData(dishQueryKeys.detail(updated.id), updated)
      toast.success('Plato actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el plato: ${error.message}`)
    },
  })
}

export function useDeleteDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => services.dish.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: dishQueryKeys.lists() })
      queryClient.removeQueries({ queryKey: dishQueryKeys.detail(id) })
      toast.success('Plato eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el plato: ${error.message}`)
    },
  })
}
