import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { TransactionForm } from '@/features/transactions/transaction-form'
import { TransactionItem } from '@/features/transactions/transaction-item'
import { useTransactions } from '@/features/transactions/use-transactions'
import { formatCurrency } from '@/lib/utils'

const TransactionsPage = () => {
  const { user } = useAuthStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all'
  )

  const { transactions, categories, accounts, create, remove } =
    useTransactions(
      user!.id,
      {
        type: typeFilter === 'all' ? undefined : typeFilter,
      },
      { enableFormData: sheetOpen }
    )

  const handleCreate = (payload: Parameters<typeof create.mutate>[0]) => {
    create.mutate(payload, { onSuccess: () => setSheetOpen(false) })
  }

  const txList = transactions.data ?? []
  const totalIncome = txList.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = txList.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  const tabs = ['all', 'income', 'expense'] as const
  const tabLabels: Record<(typeof tabs)[number], string> = {
    all: 'Todos',
    income: 'Ingresos',
    expense: 'Gastos',
  }

  return (
    <div>
      <PageHeader title='Movimientos' />

      {!transactions.isLoading && (
        <div className='mb-4 grid grid-cols-2 gap-3'>
          <div className='rounded-xl bg-card p-4'>
            <p className='mb-1 text-xs font-semibold tracking-widest text-muted uppercase'>Ingresos</p>
            <p className='font-mono text-lg font-bold text-success'>{formatCurrency(totalIncome)}</p>
          </div>
          <div className='rounded-xl bg-card p-4'>
            <p className='mb-1 text-xs font-semibold tracking-widest text-muted uppercase'>Gastos</p>
            <p className='font-mono text-lg font-bold text-danger'>{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      )}

      <div className='scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-1'>
        {tabs.map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? 'primary' : 'secondary'}
            size='sm'
            onClick={() => setTypeFilter(t)}
            className='flex-shrink-0'
          >
            {tabLabels[t]}
          </Button>
        ))}
      </div>

      <div className='overflow-hidden rounded-[14px] border border-border bg-card shadow-card'>
        {transactions.isLoading ? (
          <div className='p-8 text-center text-sm text-muted'>Cargando...</div>
        ) : transactions.data?.length === 0 ? (
          <EmptyState
            icon='💸'
            title='Sin movimientos'
            description='Registra tu primer ingreso o gasto'
          />
        ) : (
          transactions.data?.map((tx) => (
            <TransactionItem
              key={tx.id}
              tx={tx}
              onDelete={(id) => remove.mutate(id)}
            />
          ))
        )}
      </div>

      <Fab onClick={() => setSheetOpen(true)} label='Nueva transacción' />

      {sheetOpen && (
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title='Nueva transacción'
        >
          {categories.isPending || accounts.isPending ? (
            <div className='py-10 text-center text-sm text-muted'>
              Cargando cuentas y categorías…
            </div>
          ) : categories.data && accounts.data ? (
            <TransactionForm
              userId={user!.id}
              accounts={accounts.data}
              categories={categories.data}
              onSubmit={handleCreate}
              loading={create.isPending}
            />
          ) : (
            <div className='text-danger py-8 text-center text-sm'>
              No se pudieron cargar cuentas o categorías. Intenta de nuevo.
            </div>
          )}
        </BottomSheet>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_app/transactions')({
  component: TransactionsPage,
})
