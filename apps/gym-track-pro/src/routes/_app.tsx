import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AppLayout } from '@/components/layout/app-layout'
import { SplashScreen } from '@/components/ui/splash-screen'

const AppGuard = () => {
  const { user, isLoading } = useAuthStore()

  if (isLoading) return <SplashScreen />

  if (!user) return <Navigate to='/login' />

  return <AppLayout />
}

export const Route = createFileRoute('/_app')({ component: AppGuard })
