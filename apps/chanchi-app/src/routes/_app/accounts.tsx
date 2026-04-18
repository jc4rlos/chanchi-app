import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AmountText } from '@/components/ui/amount-text'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { AccountCard } from '@/features/accounts/account-card'
import { AccountForm } from '@/features/accounts/account-form'
import { useAccounts } from '@/features/accounts/use-accounts'

const AccountsPage = () => {
  const { user } = useAuthStore()
  const { accounts, create, remove } = useAccounts(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  const total = accounts.data?.reduce((s, a) => s + a.balance, 0) ?? 0

  return (
    <div>
      <PageHeader
        title='Cuentas'
        subtitle='Balance total'
        action={<AmountText amount={total} size='lg' />}
      />

      {accounts.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : accounts.data?.length === 0 ? (
        <EmptyState
          icon='🏦'
          title='Sin cuentas'
          description='Agrega tu primera cuenta para comenzar'
        />
      ) : (
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {accounts.data?.map((a) => (
            <AccountCard
              key={a.id}
              account={a}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nueva cuenta' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nueva cuenta'
      >
        <AccountForm
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

export const Route = createFileRoute('/_app/accounts')({
  component: AccountsPage,
})
