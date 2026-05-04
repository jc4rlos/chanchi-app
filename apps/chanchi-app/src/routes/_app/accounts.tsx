import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { AmountText } from '@/components/ui/amount-text'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
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

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState(false)

  const total = accounts.data?.reduce((s, a) => s + a.balance, 0) ?? 0

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    remove.mutate(deleteTarget, {
      onSuccess: () => setDeleteTarget(null),
      onError: () => {
        setDeleteTarget(null)
        setDeleteError(true)
      },
    })
  }

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
              onDelete={setDeleteTarget}
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

      {/* ── Confirmation modal ── */}
      {deleteTarget && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className='w-full max-w-sm rounded-[18px] bg-card p-5 shadow-card'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-4 flex items-center justify-between'>
              <p className='font-semibold text-foreground'>Eliminar cuenta</p>
              <button
                onClick={() => setDeleteTarget(null)}
                className='p-1 text-soft hover:text-foreground'
              >
                <X size={18} />
              </button>
            </div>
            <p className='mb-4 text-sm text-muted'>
              Esta acción no se puede deshacer. ¿Confirmas la eliminación?
            </p>
            <div className='flex gap-2'>
              <Button variant='ghost' fullWidth onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button
                fullWidth
                loading={remove.isPending}
                onClick={handleConfirmDelete}
                className='bg-danger text-white hover:bg-danger/90'
              >
                CONFIRMAR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error modal ── */}
      {deleteError && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
          onClick={() => setDeleteError(false)}
        >
          <div
            className='w-full max-w-sm rounded-[18px] bg-card p-5 shadow-card'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-4 flex items-center justify-between'>
              <p className='font-semibold text-foreground'>No se puede eliminar</p>
              <button
                onClick={() => setDeleteError(false)}
                className='p-1 text-soft hover:text-foreground'
              >
                <X size={18} />
              </button>
            </div>
            <p className='mb-4 text-sm text-muted'>
              No se puede eliminar, la cuenta está siendo utilizada.
            </p>
            <Button fullWidth onClick={() => setDeleteError(false)}>
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_app/accounts')({
  component: AccountsPage,
})
