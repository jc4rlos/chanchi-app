import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Debt } from '@/types/finance'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { DebtForm } from '@/features/debts/debt-form'
import { DebtItem } from '@/features/debts/debt-item'
import { useDebts } from '@/features/debts/use-debts'

const DebtsPage = () => {
  const { user } = useAuthStore()
  const { debts, create, markPaid, remove } = useDebts(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('pending')

  const filtered =
    debts.data?.filter((d) => {
      if (filter === 'pending') return !d.is_paid
      if (filter === 'paid') return d.is_paid
      return true
    }) ?? []

  const iOwe = filtered.filter((d: Debt) => d.direction === 'i_owe')
  const theyOweMe = filtered.filter((d: Debt) => d.direction === 'they_owe_me')

  return (
    <div>
      <PageHeader title='Deudas' />

      <div className='mb-4 flex gap-2'>
        {(['pending', 'paid', 'all'] as const).map((f) => (
          <Button
            key={f}
            size='sm'
            variant={filter === f ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
          >
            {f === 'pending'
              ? 'Pendientes'
              : f === 'paid'
                ? 'Pagadas'
                : 'Todas'}
          </Button>
        ))}
      </div>

      {debts.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon='🤝'
          title='Sin deudas'
          description='No hay deudas en esta categoría'
        />
      ) : (
        <div className='flex flex-col gap-6'>
          {theyOweMe.length > 0 && (
            <div>
              <p className='mb-3 text-xs font-semibold tracking-widest text-muted uppercase'>
                Me deben
              </p>
              <div className='flex flex-col gap-3'>
                {theyOweMe.map((d) => (
                  <DebtItem
                    key={d.id}
                    debt={d}
                    onMarkPaid={(id) => markPaid.mutate(id)}
                    onDelete={(id) => remove.mutate(id)}
                  />
                ))}
              </div>
            </div>
          )}
          {iOwe.length > 0 && (
            <div>
              <p className='mb-3 text-xs font-semibold tracking-widest text-muted uppercase'>
                Yo debo
              </p>
              <div className='flex flex-col gap-3'>
                {iOwe.map((d) => (
                  <DebtItem
                    key={d.id}
                    debt={d}
                    onMarkPaid={(id) => markPaid.mutate(id)}
                    onDelete={(id) => remove.mutate(id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nueva deuda' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nueva deuda'
      >
        <DebtForm
          userId={user!.id}
          onSubmit={(p) =>
            create.mutate(p, { onSuccess: () => setSheetOpen(false) })
          }
          loading={create.isPending}
        />
      </BottomSheet>
    </div>
  )
}

export const Route = createFileRoute('/_app/debts')({ component: DebtsPage })
