import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type AuthEmployee = {
  id: number
  role: string
  firstName: string
  lastName: string
}

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('No se pudo iniciar sesión.')
  return data.session
}

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/change-password`,
  })
  if (error) throw new Error(error.message)
}

export const updatePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    data: { must_change_password: false },
  })
  if (error) throw new Error(error.message)
}

export const getEmployeeByUserId = async (
  userId: string
): Promise<AuthEmployee> => {
  const { data, error } = await supabase
    .from('employee')
    .select('id, role, first_name, last_name')
    .eq('auth_user_id', userId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw new Error(`Error al obtener empleado: ${error.message}`)
  if (!data)
    throw new Error(
      'Este usuario no tiene un empleado asociado. Contacta al administrador.'
    )

  return {
    id: data.id,
    role: data.role,
    firstName: data.first_name,
    lastName: data.last_name,
  }
}

export const createAuthUser = async (
  email: string,
  tempPassword: string
): Promise<string> => {
  if (!supabaseAdmin)
    throw new Error('La clave de servicio no está configurada.')

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { must_change_password: true },
  })

  if (error) throw new Error(error.message)
  return data.user.id
}

export const deleteAuthUser = async (userId: string): Promise<void> => {
  if (!supabaseAdmin)
    throw new Error('La clave de servicio no está configurada.')
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
}

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut()
}
