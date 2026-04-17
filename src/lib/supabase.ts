import { createClient } from '@supabase/supabase-js'
import { type Database } from './database.types'

export type DbBranch = Database['public']['Tables']['branch']['Row']
export type DbCategory = Database['public']['Tables']['category']['Row']
export type DbEmployee = Database['public']['Tables']['employee']['Row']
export type DbOrder = Database['public']['Tables']['order']['Row']
export type DbOrderItem = Database['public']['Tables']['order_item']['Row']
export type DbDish = Database['public']['Tables']['dish']['Row']
export type DbDailyMenu = Database['public']['Tables']['daily_menu']['Row']
export type DbRestaurantTable =
  Database['public']['Tables']['restaurant_table']['Row']

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabasePublishableKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey
)
