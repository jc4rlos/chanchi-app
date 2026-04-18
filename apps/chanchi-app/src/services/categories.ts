import type { Category } from '@/types/finance'
import type { CategoryType, Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { createSupabaseService } from '@/lib/supabase-service'

type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

const base = createSupabaseService('categories')

export const categoriesService = {
  ...base,

  findAll: async (userId: string): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data ?? []
  },

  findByType: async (
    userId: string,
    type: CategoryType
  ): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('type', type)
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data ?? []
  },

  createForUser: async (payload: CategoryInsert): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert(payload as never)
      .select()
      .single()
    if (error) throw error
    return data as unknown as Category
  },

  updateForUser: async (
    id: string,
    payload: CategoryUpdate
  ): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update(payload as never)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as unknown as Category
  },

  softDelete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: false } as never)
      .eq('id', id)
    if (error) throw error
  },
}
