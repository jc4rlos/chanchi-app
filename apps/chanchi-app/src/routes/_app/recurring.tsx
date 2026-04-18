import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { RecurringForm } from '@/features/recurring/recurring-form'
import { RecurringItem } from '@/features/recurring/recurring-item'
import { useRecurring } from '@/features/recurring/use-recurring'

const RecurringPage = () => {
  const { user } = useAuthStore()
  const { recurring, categories, accounts, create, remove } = useRecurring(
    user!.id
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div>
      <PageHeader title='Recurrentes' subtitle='Movimientos programados' />

      {recurring.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : recurring.data?.length === 0 ? (
        <EmptyState
          icon='🔄'
          title='Sin recurrentes'
          description='Programa ingresos y gastos que se repiten'
        />
      ) : (
        <div className='flex flex-col gap-3'>
          {recurring.data?.map((r) => (
            <RecurringItem
              key={r.id}
              item={r}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nuevo recurrente' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nuevo recurrente'
      >
        {accounts.data && categories.data && (
          <RecurringForm
            userId={user!.id}
            accounts={accounts.data}
            categories={categories.data}
            onSubmit={(p) =>
              create.mutate(p, { onSuccess: () => setSheetOpen(false) })
            }
            loading={create.isPending}
          />
        )}
      </BottomSheet>
    </div>
  )
}

export const Route = createFileRoute('/_app/recurring')({
  component: RecurringPage,
})
