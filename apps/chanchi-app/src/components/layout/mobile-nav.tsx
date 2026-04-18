import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  MoreHorizontal,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Settings,
  Tag,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  icon: React.ElementType
  label: string
}

const mainNav: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Movimientos' },
  { to: '/accounts', icon: Wallet, label: 'Cuentas' },
  { to: '/budgets', icon: PiggyBank, label: 'Presupuesto' },
]

const moreNav: NavItem[] = [
  { to: '/savings', icon: PiggyBank, label: 'Ahorros' },
  { to: '/investments', icon: TrendingUp, label: 'Inversiones' },
  { to: '/debts', icon: CreditCard, label: 'Deudas' },
  { to: '/recurring', icon: RefreshCw, label: 'Recurrentes' },
  { to: '/categories', icon: Tag, label: 'Categorías' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
]

const NavTab = ({ item, active }: { item: NavItem; active: boolean }) => {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-1 py-2',
        'text-[10px] font-medium transition-colors',
        active ? 'text-primary' : 'text-soft'
      )}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
      <span>{item.label}</span>
    </Link>
  )
}

export const MobileNav = () => {
  const [moreOpen, setMoreOpen] = useState(false)
  const { location } = useRouterState()
  const path = location.pathname

  return (
    <>
      <nav className='safe-bottom fixed right-0 bottom-0 left-0 z-30 flex border-t border-border bg-card md:hidden'>
        {mainNav.map((item) => (
          <NavTab key={item.to} item={item} active={path.startsWith(item.to)} />
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-2',
            'text-[10px] font-medium transition-colors',
            moreNav.some((i) => path.startsWith(i.to))
              ? 'text-primary'
              : 'text-soft'
          )}
        >
          <MoreHorizontal size={22} strokeWidth={1.8} />
          <span>Más</span>
        </button>
      </nav>

      {moreOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/30 backdrop-blur-sm'
            onClick={() => setMoreOpen(false)}
          />
          <div className='safe-bottom fixed right-0 bottom-0 left-0 z-50 animate-in rounded-t-3xl bg-card duration-300 slide-in-from-bottom'>
            <div className='flex items-center justify-between px-5 pt-5 pb-3'>
              <div className='absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-border' />
              <span className='text-sm font-semibold text-foreground'>
                Más opciones
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className='flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]'
              >
                <X size={16} className='text-muted' />
              </button>
            </div>
            <div className='grid grid-cols-4 gap-2 px-5 py-4'>
              {moreNav.map((item) => {
                const Icon = item.icon
                const active = path.startsWith(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className='flex flex-col items-center gap-2 py-3'
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl',
                        active
                          ? 'bg-primary text-white'
                          : 'bg-[#F3F4F6] text-muted'
                      )}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <span className='text-center text-[11px] font-medium text-foreground'>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
