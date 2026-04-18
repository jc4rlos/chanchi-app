import type { Profile } from '@/types/finance'
import { supabase } from '@/lib/supabase'

export const profilesService = {
  findById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as unknown as Profile
  },

  upsert: async (profile: Profile): Promise<void> => {
    const { error } = await supabase.from('profiles').upsert(profile as never)
    if (error) throw error
  },

  update: async (
    id: string,
    payload: Partial<Omit<Profile, 'id' | 'created_at'>>
  ): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update(payload as never)
      .eq('id', id)
    if (error) throw error
  },
}
