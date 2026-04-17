import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { createAuthUser, deleteAuthUser } from '@/features/auth/auth-service'
import { type Employee, type EmployeeRole } from './schema'

type DbEmployee = Database['public']['Tables']['employee']['Row']
type DbEmployeeInsert = Database['public']['Tables']['employee']['Insert']
type DbEmployeeUpdate = Database['public']['Tables']['employee']['Update']
type DbBranch = Database['public']['Tables']['branch']['Row']

export type Branch = {
  id: number
  name: string
}

export type EmployeesParams = {
  page: number
  pageSize: number
  search?: string
  role?: string[]
  isActive?: string[]
}

export type PaginatedEmployees = {
  data: Employee[]
  total: number
}

const SELECT_FIELDS =
  'id, branch_id, first_name, last_name, document_number, role, phone, email, hire_date, is_active, auth_user_id'

const toEmployee = (row: DbEmployee): Employee => ({
  id: row.id,
  branchId: row.branch_id,
  firstName: row.first_name,
  lastName: row.last_name,
  documentNumber: row.document_number,
  role: row.role,
  phone: row.phone,
  email: row.email,
  hireDate: row.hire_date,
  isActive: row.is_active,
  authUserId: row.auth_user_id ?? null,
})

export const getEmployees = async (
  params: EmployeesParams
): Promise<PaginatedEmployees> => {
  const { page, pageSize, search, role, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('employee')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('last_name', { ascending: true })
    .range(from, to)

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }
  if (role?.length) query = query.in('role', role as EmployeeRole[])
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: (data as DbEmployee[]).map(toEmployee), total: count ?? 0 }
}

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employee')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toEmployee(data as DbEmployee)
}

export const createEmployee = async (
  payload: Omit<Employee, 'id'>
): Promise<Employee> => {
  const insert: DbEmployeeInsert = {
    branch_id: payload.branchId,
    first_name: payload.firstName,
    last_name: payload.lastName,
    document_number: payload.documentNumber,
    role: payload.role,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    hire_date: payload.hireDate,
    is_active: payload.isActive,
    created_by: 'system',
  }

  const { data, error } = await supabase
    .from('employee')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toEmployee(data as DbEmployee)
}

export const updateEmployee = async (
  id: number,
  payload: Partial<Omit<Employee, 'id'>>
): Promise<Employee> => {
  const update: DbEmployeeUpdate = {}
  if (payload.branchId !== undefined) update.branch_id = payload.branchId
  if (payload.firstName !== undefined) update.first_name = payload.firstName
  if (payload.lastName !== undefined) update.last_name = payload.lastName
  if (payload.documentNumber !== undefined)
    update.document_number = payload.documentNumber
  if (payload.role !== undefined) update.role = payload.role
  if (payload.phone !== undefined) update.phone = payload.phone
  if (payload.email !== undefined) update.email = payload.email
  if (payload.hireDate !== undefined) update.hire_date = payload.hireDate
  if (payload.isActive !== undefined) update.is_active = payload.isActive

  const { data, error } = await supabase
    .from('employee')
    .update(update)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toEmployee(data as DbEmployee)
}

export const deleteEmployee = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('employee')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteEmployees = async (ids: number[]): Promise<void> => {
  const { error } = await supabase
    .from('employee')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(error.message)
}

export const linkEmployeeAccess = async (
  employeeId: number,
  email: string,
  tempPassword: string
): Promise<void> => {
  const authUserId = await createAuthUser(email, tempPassword)
  const { error } = await supabase
    .from('employee')
    .update({ auth_user_id: authUserId, updated_at: new Date().toISOString() })
    .eq('id', employeeId)

  if (error) {
    await deleteAuthUser(authUserId).catch(() => null)
    throw new Error(error.message)
  }
}

export const unlinkEmployeeAccess = async (
  employeeId: number,
  authUserId: string
): Promise<void> => {
  const { error } = await supabase
    .from('employee')
    .update({ auth_user_id: null, updated_at: new Date().toISOString() })
    .eq('id', employeeId)

  if (error) throw new Error(error.message)
  await deleteAuthUser(authUserId)
}

export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branch')
    .select('id, name')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Pick<DbBranch, 'id' | 'name'>[]).map((b) => ({
    id: b.id,
    name: b.name,
  }))
}
