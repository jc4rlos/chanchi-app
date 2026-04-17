import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type BranchesParams,
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from '../data/branches-service'
import { type BranchFormValues } from '../data/schema'

export const branchQueryKeys = {
  list: (params: BranchesParams) => ['branches', 'list', params] as const,
  detail: (id: number) => ['branches', id] as const,
}

export const useBranches = (params: BranchesParams) =>
  useQuery({
    queryKey: branchQueryKeys.list(params),
    queryFn: () => getBranches(params),
    placeholderData: (prev) => prev,
  })

export const useBranch = (id: number) =>
  useQuery({
    queryKey: branchQueryKeys.detail(id),
    queryFn: () => getBranchById(id),
    enabled: id > 0,
  })

export const useCreateBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: BranchFormValues) => createBranch(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Sucursal creada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la sucursal: ${error.message}`)
    },
  })
}

export const useUpdateBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: BranchFormValues }) =>
      updateBranch(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      queryClient.setQueryData(branchQueryKeys.detail(updated.id), updated)
      toast.success('Sucursal actualizada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la sucursal: ${error.message}`)
    },
  })
}

export const useDeleteBranch = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Sucursal eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la sucursal: ${error.message}`)
    },
  })
}
