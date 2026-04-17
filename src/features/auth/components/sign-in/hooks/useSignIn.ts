import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  getEmployeeByUserId,
  signInWithPassword,
} from '@/features/auth/auth-service'
import { getMenuItemsForRole } from '@/features/permissions/data/menu-service'
import type { FormValues } from '../components/user-auth-form.schema'

interface UseSignInOptions {
  redirectTo?: string
}

export function useSignIn({ redirectTo }: UseSignInOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  async function signIn({ email, password }: FormValues) {
    setIsLoading(true)
    try {
      const session = await signInWithPassword(email, password)

      if (session.user.user_metadata?.must_change_password) {
        navigate({ to: '/change-password', replace: true })
        return
      }

      const employee = await getEmployeeByUserId(session.user.id)
      auth.setUser({
        employeeId: employee.id,
        email: session.user.email ?? email,
        role: employee.role,
        exp: (session.expires_at ?? 0) * 1000,
      })
      auth.setAccessToken(session.access_token)

      const menuItems = await getMenuItemsForRole(employee.role)
      auth.setMenuItems(menuItems)

      navigate({ to: redirectTo || '/', replace: true })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al iniciar sesión.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, signIn }
}
