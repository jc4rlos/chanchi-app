import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Settings,
  Tag,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

type NavItem = { to: string; icon: React.ElementType; label: string }

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Movimientos' },
  { to: '/accounts', icon: Wallet, label: 'Cuentas' },
  { to: '/budgets', icon: PiggyBank, label: 'Presupuestos' },
  { to: '/savings', icon: PiggyBank, label: 'Ahorros' },
  { to: '/investments', icon: TrendingUp, label: 'Inversiones' },
  { to: '/debts', icon: CreditCard, label: 'Deudas' },
  { to: '/recurring', icon: RefreshCw, label: 'Recurrentes' },
  { to: '/categories', icon: Tag, label: 'Categorías' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

export const DesktopSidebar = () => {
  const { location } = useRouterState()
  const { user, signOut } = useAuthStore()
  const path = location.pathname
  const initials = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <aside className='fixed top-0 left-0 z-20 hidden h-screen w-56 flex-col border-r border-border bg-card md:flex'>
      <div className='border-b border-border px-5 py-5'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>🐷</span>
          <span className='text-base font-semibold text-foreground'>
            Chanchi
          </span>
        </div>
      </div>

      <nav className='flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4'>
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = path.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:bg-[#F3F4F6] hover:text-foreground'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className='flex items-center gap-3 border-t border-border px-4 py-4'>
        <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white'>
          {initials}
        </div>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-medium text-foreground'>
            {user?.email}
          </p>
        </div>
        <button
          onClick={signOut}
          className='text-xs text-muted transition-colors hover:text-foreground'
        >
          Salir
        </button>
      </div>
    </aside>
  )
}
