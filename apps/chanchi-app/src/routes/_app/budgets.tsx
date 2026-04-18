import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { formatMonth } from '@/lib/utils'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { BudgetForm } from '@/features/budgets/budget-form'
import { BudgetItem } from '@/features/budgets/budget-item'
import { useBudgets } from '@/features/budgets/use-budgets'

const BudgetsPage = () => {
  const { user } = useAuthStore()
  const { budgets, categories, create, remove, month } = useBudgets(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div>
      <PageHeader title='Presupuestos' subtitle={formatMonth(month)} />

      {budgets.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : budgets.data?.length === 0 ? (
        <EmptyState
          icon='🐷'
          title='Sin presupuestos'
          description='Define límites de gasto por categoría'
        />
      ) : (
        <div className='flex flex-col gap-3'>
          {budgets.data?.map((b) => (
            <BudgetItem
              key={b.id}
              budget={b}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nuevo presupuesto' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nuevo presupuesto'
      >
        {categories.data && (
          <BudgetForm
            userId={user!.id}
            categories={categories.data}
            month={month}
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

export const Route = createFileRoute('/_app/budgets')({
  component: BudgetsPage,
})
