import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AppLayout } from '@/components/layout/app-layout'

const AppGuard = () => {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-3'>
          <span className='text-4xl'>🐷</span>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to='/login' />

  return <AppLayout />
}

export const Route = createFileRoute('/_app')({ component: AppGuard })
