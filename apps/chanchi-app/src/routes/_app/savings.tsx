import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { SavingsGoalCard } from '@/features/savings/savings-goal-card'
import { SavingsGoalForm } from '@/features/savings/savings-goal-form'
import { useSavings } from '@/features/savings/use-savings'

const SavingsPage = () => {
  const { user } = useAuthStore()
  const { goals, create, addAmount, remove } = useSavings(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div>
      <PageHeader title='Metas de ahorro' />

      {goals.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : goals.data?.length === 0 ? (
        <EmptyState
          icon='🎯'
          title='Sin metas'
          description='Crea una meta de ahorro y empieza a avanzar'
        />
      ) : (
        <div className='flex flex-col gap-3'>
          {goals.data?.map((g) => (
            <SavingsGoalCard
              key={g.id}
              goal={g}
              onDelete={(id) => remove.mutate(id)}
              onAddAmount={(id, amount) => addAmount.mutate({ id, amount })}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nueva meta' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nueva meta de ahorro'
      >
        <SavingsGoalForm
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

export const Route = createFileRoute('/_app/savings')({
  component: SavingsPage,
})
