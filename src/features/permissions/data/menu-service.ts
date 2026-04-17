import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

type EmployeeRole = Database['public']['Enums']['employee_role']

export type MenuItem = {
  id: number
  label: string
  path: string
  icon: string | null
  parentId: number | null
  sortOrder: number
  isActive: boolean
}

export type MenuRolePermission = {
  id: number
  menuItemId: number
  role: string
  enabled: boolean
}

export type MenuItemWithPermissions = MenuItem & {
  permissions: { role: string; enabled: boolean }[]
}

type DbMenuItem = {
  id: number
  label: string
  path: string
  icon: string | null
  parent_id: number | null
  sort_order: number
  is_active: boolean
}

type DbPermission = {
  id: number
  menu_item_id: number
  role: string
  enabled: boolean
}

const toMenuItem = (row: DbMenuItem): MenuItem => ({
  id: row.id,
  label: row.label,
  path: row.path,
  icon: row.icon,
  parentId: row.parent_id,
  sortOrder: row.sort_order,
  isActive: row.is_active,
})

export const getMenuItemsForRole = async (
  role: string
): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_item')
    .select(
      `
      id, label, path, icon, parent_id, sort_order, is_active,
      menu_role_permission!inner(role, enabled)
    `
    )
    .eq('is_active', true)
    .eq('menu_role_permission.role', role as EmployeeRole)
    .eq('menu_role_permission.enabled', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as DbMenuItem[]).map(toMenuItem)
}

export const getAllMenuItemsWithPermissions = async (): Promise<
  MenuItemWithPermissions[]
> => {
  const { data: items, error: itemsError } = await supabase
    .from('menu_item')
    .select('id, label, path, icon, parent_id, sort_order, is_active')
    .order('sort_order', { ascending: true })

  if (itemsError) throw new Error(itemsError.message)

  const { data: perms, error: permsError } = await supabase
    .from('menu_role_permission')
    .select('id, menu_item_id, role, enabled')

  if (permsError) throw new Error(permsError.message)

  const permsByItem = new Map<number, { role: string; enabled: boolean }[]>()
  for (const p of perms as DbPermission[]) {
    const list = permsByItem.get(p.menu_item_id) ?? []
    list.push({ role: p.role, enabled: p.enabled })
    permsByItem.set(p.menu_item_id, list)
  }

  return (items as DbMenuItem[]).map((item) => ({
    ...toMenuItem(item),
    permissions: permsByItem.get(item.id) ?? [],
  }))
}

export const upsertRolePermission = async (
  menuItemId: number,
  role: string,
  enabled: boolean
): Promise<void> => {
  const { error } = await supabase
    .from('menu_role_permission')
    .upsert(
      { menu_item_id: menuItemId, role: role as EmployeeRole, enabled },
      { onConflict: 'menu_item_id,role' }
    )
  if (error) throw new Error(error.message)
}
