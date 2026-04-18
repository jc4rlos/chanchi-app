import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { LoginForm } from '@/features/auth/login-form'

const LoginPage = () => {
  const { user, isLoading } = useAuthStore()

  if (isLoading) return null
  if (user) return <Navigate to='/dashboard' />

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-5'>
      <div className='w-full max-w-sm'>
        <div className='mb-10 flex flex-col items-center'>
          <span className='mb-4 text-5xl'>🐷</span>
          <h1 className='text-2xl font-bold text-foreground'>Chanchi</h1>
          <p className='mt-1 text-sm text-muted'>Tus finanzas, ordenadas</p>
        </div>

        <div className='rounded-3xl border border-border bg-card p-6 shadow-card'>
          <h2 className='mb-6 text-lg font-semibold text-foreground'>
            Iniciar sesión
          </h2>
          <LoginForm />
        </div>

        <p className='mt-6 text-center text-xs text-muted'>
          ¿No tienes cuenta? Contacta al administrador.
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({ component: LoginPage })
