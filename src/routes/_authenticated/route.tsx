import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { getEmployeeByUserId } from '@/features/auth/auth-service'
import { getMenuItemsForRole } from '@/features/permissions/data/menu-service'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') return

    const { auth } = useAuthStore.getState()

    const isStoreValid =
      auth.accessToken && auth.user && auth.user.exp > Date.now()
    if (isStoreValid) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) throw redirect({ to: '/sign-in' })

    if (session.user.user_metadata?.must_change_password) {
      throw redirect({ to: '/change-password' })
    }

    try {
      const employee = await getEmployeeByUserId(session.user.id)
      const user: Parameters<typeof auth.setUser>[0] = {
        employeeId: employee.id,
        email: session.user.email ?? '',
        role: employee.role,
        exp: (session.expires_at ?? 0) * 1000,
      }

      const [menuItems] = await Promise.all([
        getMenuItemsForRole(employee.role),
        Promise.resolve(auth.setUser(user)),
        Promise.resolve(auth.setAccessToken(session.access_token)),
      ])

      auth.setMenuItems(menuItems)
    } catch {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})
