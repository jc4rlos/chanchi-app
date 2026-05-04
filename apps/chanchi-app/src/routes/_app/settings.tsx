import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LogOut, Bell, KeyRound, ChevronRight, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { ChangePasswordForm } from '@/features/auth/change-password-form'

const Toggle = ({
  value,
  onToggle,
}: {
  value: boolean
  onToggle: () => void
}) => (
  <button
    type='button'
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      value ? 'bg-primary' : 'bg-border'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        value ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

const SettingsPage = () => {
  const { user, signOut } = useAuthStore()
  const { amountsVisible, toggleAmounts, darkMode, toggleDarkMode } = useUIStore()
  const [pwdSheetOpen, setPwdSheetOpen] = useState(false)

  return (
    <div>
      <PageHeader title='Ajustes' />

      <div className='flex flex-col gap-4'>
        <Card>
          <div className='flex items-center gap-4'>
            <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white'>
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className='font-semibold text-foreground'>{user?.email}</p>
              <p className='mt-0.5 text-xs text-muted'>Cuenta activa</p>
            </div>
          </div>
        </Card>

        {/* Privacidad */}
        <Card>
          <p className='mb-3 text-xs font-semibold tracking-widest text-muted uppercase'>
            Privacidad
          </p>
          <div className='flex items-center gap-3'>
            {amountsVisible ? (
              <Eye size={18} className='flex-shrink-0 text-muted' />
            ) : (
              <EyeOff size={18} className='flex-shrink-0 text-muted' />
            )}
            <div className='flex-1'>
              <p className='text-sm text-foreground'>Mostrar montos</p>
              <p className='text-xs text-muted'>
                {amountsVisible
                  ? 'Los montos son visibles'
                  : 'Montos ocultos ••••••'}
              </p>
            </div>
            <Toggle value={amountsVisible} onToggle={toggleAmounts} />
          </div>
          <div className='mt-3 flex items-center gap-3 border-t border-border pt-3'>
            {darkMode ? (
              <Moon size={18} className='flex-shrink-0 text-muted' />
            ) : (
              <Sun size={18} className='flex-shrink-0 text-muted' />
            )}
            <div className='flex-1'>
              <p className='text-sm text-foreground'>Modo oscuro</p>
              <p className='text-xs text-muted'>
                {darkMode ? 'Tema oscuro activo' : 'Tema claro activo'}
              </p>
            </div>
            <Toggle value={darkMode} onToggle={toggleDarkMode} />
          </div>
        </Card>

        {/* Cuenta */}
        <Card>
          <div className='flex flex-col divide-y divide-border'>
            <button
              onClick={() => setPwdSheetOpen(true)}
              className='flex w-full items-center gap-3 py-3.5 text-left text-sm text-foreground'
            >
              <KeyRound size={18} className='flex-shrink-0 text-muted' />
              <span className='flex-1'>Cambiar contraseña</span>
              <ChevronRight size={15} className='text-soft' />
            </button>
            <button className='flex w-full items-center gap-3 py-3.5 text-left text-sm text-foreground'>
              <Bell size={18} className='flex-shrink-0 text-muted' />
              <span className='flex-1'>Notificaciones</span>
              <ChevronRight size={15} className='text-soft' />
            </button>
          </div>
        </Card>

        <button
          onClick={signOut}
          className='border-danger-light bg-danger-light text-danger flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-medium'
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>

      <BottomSheet
        open={pwdSheetOpen}
        onClose={() => setPwdSheetOpen(false)}
        title='Cambiar contraseña'
      >
        <ChangePasswordForm onSuccess={() => setPwdSheetOpen(false)} />
      </BottomSheet>
    </div>
  )
}

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})
