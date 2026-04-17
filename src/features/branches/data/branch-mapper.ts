import { type Database } from '@/lib/database.types'
import { type Branch, type BranchFormValues } from './schema'

type DbBranch = Database['public']['Tables']['branch']['Row']
type DbBranchInsert = Database['public']['Tables']['branch']['Insert']
type DbBranchUpdate = Database['public']['Tables']['branch']['Update']

export const toBranch = (row: DbBranch): Branch => ({
  id: row.id,
  name: row.name,
  address: row.address,
  phone: row.phone,
  email: row.email,
  isActive: row.is_active,
})

export const toDbInsert = (values: BranchFormValues): DbBranchInsert => ({
  name: values.name,
  address: values.address,
  phone: values.phone || null,
  email: values.email || null,
  is_active: values.isActive,
  created_by: 'system',
})

export const toDbUpdate = (values: BranchFormValues): DbBranchUpdate => ({
  name: values.name,
  address: values.address,
  phone: values.phone || null,
  email: values.email || null,
  is_active: values.isActive,
})
