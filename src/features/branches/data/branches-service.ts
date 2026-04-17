import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { toBranch, toDbInsert, toDbUpdate } from './branch-mapper'
import { type Branch, type BranchFormValues } from './schema'

type DbBranch = Database['public']['Tables']['branch']['Row']

const SELECT_FIELDS = 'id, name, address, phone, email, is_active'

export type BranchesParams = {
  page: number
  pageSize: number
  name?: string
  isActive?: string[]
}

export type PaginatedBranches = {
  data: Branch[]
  total: number
}

export const getBranches = async (
  params: BranchesParams
): Promise<PaginatedBranches> => {
  const { page, pageSize, name, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('branch')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { data: (data as DbBranch[]).map(toBranch), total: count ?? 0 }
}

export const getBranchById = async (id: number): Promise<Branch> => {
  const { data, error } = await supabase
    .from('branch')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toBranch(data as DbBranch)
}

export const createBranch = async (
  values: BranchFormValues
): Promise<Branch> => {
  const { data, error } = await supabase
    .from('branch')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toBranch(data as DbBranch)
}

export const updateBranch = async (
  id: number,
  values: BranchFormValues
): Promise<Branch> => {
  const { data, error } = await supabase
    .from('branch')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toBranch(data as DbBranch)
}

export const deleteBranch = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('branch')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
