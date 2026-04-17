import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type EmployeesParams,
  createEmployee,
  deleteEmployees,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  getBranches,
} from '../data/employees-service'
import { type Employee } from '../data/schema'

export const employeesQueryKeys = {
  list: (params: EmployeesParams) => ['employees', 'list', params] as const,
  detail: (id: number) => ['employees', id] as const,
  branches: ['employees', 'branches'] as const,
}

export const useEmployees = (params: EmployeesParams) =>
  useQuery({
    queryKey: employeesQueryKeys.list(params),
    queryFn: () => getEmployees(params),
    placeholderData: (prev) => prev,
  })

export const useEmployee = (id: number) =>
  useQuery({
    queryKey: employeesQueryKeys.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: id > 0,
  })

export const useBranches = () =>
  useQuery({
    queryKey: employeesQueryKeys.branches,
    queryFn: getBranches,
    staleTime: 5 * 60 * 1000,
  })

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Employee, 'id'>) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Empleado creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el empleado: ${error.message}`)
    },
  })
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Employee, 'id'>>
    }) => updateEmployee(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.setQueryData(employeesQueryKeys.detail(updated.id), updated)
      toast.success('Empleado actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el empleado: ${error.message}`)
    },
  })
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Empleado eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el empleado: ${error.message}`)
    },
  })
}

export const useDeleteEmployees = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteEmployees(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success(
        `${ids.length} empleado${ids.length === 1 ? '' : 's'} eliminado${ids.length === 1 ? '' : 's'}.`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar los empleados: ${error.message}`)
    },
  })
}
