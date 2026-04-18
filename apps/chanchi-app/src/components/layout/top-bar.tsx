import { useRouterState } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { formatMonth, currentMonthStart } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '',
  '/transactions': 'Movimientos',
  '/accounts': 'Cuentas',
  '/budgets': 'Presupuestos',
  '/savings': 'Ahorros',
  '/investments': 'Inversiones',
  '/debts': 'Deudas',
  '/recurring': 'Recurrentes',
  '/settings': 'Ajustes',
}

export const TopBar = () => {
  const { location } = useRouterState()
  const { user } = useAuthStore()
  const path = location.pathname
  const title = PAGE_TITLES[path] ?? ''
  const isDashboard = path === '/dashboard'
  const initials = user?.email?.[0]?.toUpperCase() ?? 'U'

  if (isDashboard) {
    return (
      <header className='sticky top-0 z-20 bg-background px-4 pt-4 pb-3 md:hidden'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-semibold text-foreground'>
              Mis Finanzas
            </h1>
            <p className='mt-0.5 text-xs text-muted'>
              {formatMonth(currentMonthStart())}
            </p>
          </div>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
            {initials}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className='sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden'>
      <button
        onClick={() => window.history.back()}
        className='flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]'
      >
        <ChevronLeft size={18} className='text-foreground' />
      </button>
      <h1 className='text-base font-semibold text-foreground'>{title}</h1>
    </header>
  )
}
