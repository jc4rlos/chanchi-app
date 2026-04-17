import type { Database } from './database.types'
import { supabase } from './supabase'

type PublicTables = Database['public']['Tables']
type TableName = keyof PublicTables & string

type Row<T extends TableName> = PublicTables[T]['Row']
type Insert<T extends TableName> = PublicTables[T]['Insert']
type Update<T extends TableName> = PublicTables[T]['Update']

type TableNameWithId = {
  [K in TableName]: Row<K> extends { id: unknown } ? K : never
}[TableName]

type IdOf<T extends TableNameWithId> =
  Row<T> extends { id: infer I } ? I : never

function ensureData<D>(data: D | null, message: string): D {
  if (data === null) throw new Error(message)
  return data
}

export function createSupabaseService<T extends TableNameWithId>(table: T) {
  return {
    async findAll(): Promise<Row<T>[]> {
      const { data, error } = await supabase.from(table).select('*')
      if (error) throw error
      return ensureData(
        data as unknown as Row<T>[] | null,
        `No data returned for table "${table}"`
      )
    },

    async findById(id: IdOf<T>): Promise<Row<T>> {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id' as never, id as never)
        .single()
      if (error) throw error
      return ensureData(
        data as unknown as Row<T> | null,
        `No row found in "${table}" with id "${String(id)}"`
      )
    },

    async create(payload: Insert<T>): Promise<Row<T>> {
      const { data, error } = await supabase
        .from(table)
        .insert(payload as never)
        .select()
        .single()
      if (error) throw error
      return ensureData(
        data as unknown as Row<T> | null,
        `Insert did not return data for table "${table}"`
      )
    },

    async update(id: IdOf<T>, payload: Update<T>): Promise<Row<T>> {
      const { data, error } = await supabase
        .from(table)
        .update(payload as never)
        .eq('id' as never, id as never)
        .select()
        .single()
      if (error) throw error
      return ensureData(
        data as unknown as Row<T> | null,
        `Update did not return data for table "${table}"`
      )
    },

    async remove(id: IdOf<T>): Promise<void> {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id' as never, id as never)
      if (error) throw error
    },
  }
}

export const services = {
  branch: createSupabaseService('branch'),
  category: createSupabaseService('category'),
  dailyMenu: createSupabaseService('daily_menu'),
  dish: createSupabaseService('dish'),
  employee: createSupabaseService('employee'),
  menuItem: createSupabaseService('menu_item'),
  menuRolePermission: createSupabaseService('menu_role_permission'),
  order: createSupabaseService('order'),
  orderDelivery: createSupabaseService('order_delivery'),
  orderItem: createSupabaseService('order_item'),
  restaurantTable: createSupabaseService('restaurant_table'),
} as const

export type SupabaseService<T extends TableNameWithId> = ReturnType<
  typeof createSupabaseService<T>
>
