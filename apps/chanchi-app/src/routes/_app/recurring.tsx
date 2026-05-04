import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { Select } from '@/components/ui/select'
import { RecurringForm } from '@/features/recurring/recurring-form'
import { RecurringItem } from '@/features/recurring/recurring-item'
import { useRecurring } from '@/features/recurring/use-recurring'
import type { RecurringTransaction } from '@/types/finance'

const currentMonth = new Date().toISOString().slice(0, 7)

const INTERVALS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
] as const

// ── Inline modal shell ──────────────────────────────────────────────────────
const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) => (
  <div
    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
    onClick={onClose}
  >
    <div
      className='w-full max-w-sm rounded-[18px] bg-card p-5 shadow-card'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='mb-4 flex items-center justify-between'>
        <p className='font-semibold text-foreground'>{title}</p>
        <button onClick={onClose} className='p-1 text-soft hover:text-foreground'>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

// ───────────────────────────────────────────────────────────────────────────
const RecurringPage = () => {
  const { user } = useAuthStore()
  const { recurring, categories, accounts, create, remove, update, register } =
    useRecurring(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Edit modal
  const [editTarget, setEditTarget] = useState<RecurringTransaction | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editInterval, setEditInterval] =
    useState<RecurringTransaction['interval']>('monthly')

  const openEdit = (item: RecurringTransaction) => {
    setEditTarget(item)
    setEditDesc(item.description)
    setEditAmount(String(item.amount))
    setEditInterval(item.interval)
  }
  const closeEdit = () => setEditTarget(null)
  const confirmEdit = () => {
    if (!editTarget) return
    update.mutate(
      {
        id: editTarget.id,
        payload: {
          description: editDesc,
          amount: parseFloat(editAmount),
          interval: editInterval,
        },
      },
      { onSuccess: closeEdit }
    )
  }

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const closeDelete = () => setDeleteTarget(null)
  const confirmDelete = () => {
    if (!deleteTarget) return
    remove.mutate(deleteTarget, { onSuccess: closeDelete })
  }

  // Execute modal
  const [executeTarget, setExecuteTarget] = useState<RecurringTransaction | null>(null)
  const [executeAmount, setExecuteAmount] = useState('')

  const openExecute = (item: RecurringTransaction) => {
    setExecuteTarget(item)
    setExecuteAmount(String(item.amount))
  }
  const closeExecute = () => setExecuteTarget(null)
  const confirmExecute = () => {
    if (!executeTarget) return
    register.mutate(
      { ...executeTarget, amount: parseFloat(executeAmount) },
      { onSuccess: closeExecute }
    )
  }

  // Lists
  const pending =
    recurring.data?.filter(
      (r) => !r.last_executed_at || !r.last_executed_at.startsWith(currentMonth)
    ) ?? []

  const executedThisMonth =
    recurring.data?.filter((r) => r.last_executed_at?.startsWith(currentMonth)) ?? []

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
        <>
          <div className='mb-3 flex items-center gap-4 text-xs text-muted'>
            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-amber' />
              Vence hoy o antes — ejecutar
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-border' />
              Próximo período
            </span>
          </div>

          {pending.length > 0 && (
            <div className='mb-4 flex flex-col gap-3'>
              {pending.map((r) => (
                <RecurringItem
                  key={r.id}
                  item={r}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onRegister={openExecute}
                  registering={register.isPending}
                />
              ))}
            </div>
          )}

          {executedThisMonth.length > 0 && (
            <div className='flex flex-col gap-3'>
              <p className='text-xs font-medium text-muted'>Ejecutados este mes</p>
              {executedThisMonth.map((r) => (
                <RecurringItem
                  key={r.id}
                  item={r}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  registering={false}
                />
              ))}
            </div>
          )}
        </>
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

      {/* ── Edit modal ── */}
      {editTarget && (
        <Modal title='Editar recurrente' onClose={closeEdit}>
          <div className='flex flex-col gap-3'>
            <Input
              label='Nombre'
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
            <Input
              label='Monto'
              type='number'
              step='0.01'
              min='0.01'
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <Select
              label='Frecuencia'
              value={editInterval}
              onChange={(e) =>
                setEditInterval(e.target.value as RecurringTransaction['interval'])
              }
            >
              {INTERVALS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </Select>
            <div className='mt-1 flex gap-2'>
              <Button variant='ghost' fullWidth onClick={closeEdit}>
                Cancelar
              </Button>
              <Button
                fullWidth
                loading={update.isPending}
                onClick={confirmEdit}
                disabled={!editDesc || !editAmount}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <Modal title='Eliminar recurrente' onClose={closeDelete}>
          <p className='mb-4 text-sm text-muted'>
            Esta acción no se puede deshacer. ¿Confirmas la eliminación?
          </p>
          <div className='flex gap-2'>
            <Button variant='ghost' fullWidth onClick={closeDelete}>
              Cancelar
            </Button>
            <Button
              fullWidth
              loading={remove.isPending}
              onClick={confirmDelete}
              className='bg-danger text-white hover:bg-danger/90'
            >
              CONFIRMAR
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Execute modal ── */}
      {executeTarget && (
        <Modal title='Ejecutar recurrente' onClose={closeExecute}>
          <p className='mb-3 text-sm text-muted'>
            {executeTarget.description} — ajusta el monto si es necesario.
          </p>
          <div className='flex flex-col gap-3'>
            <Input
              label='Monto'
              type='number'
              step='0.01'
              min='0.01'
              value={executeAmount}
              onChange={(e) => setExecuteAmount(e.target.value)}
            />
            <div className='flex gap-2'>
              <Button variant='ghost' fullWidth onClick={closeExecute}>
                Cancelar
              </Button>
              <Button
                fullWidth
                loading={register.isPending}
                onClick={confirmExecute}
                disabled={!executeAmount}
                className='bg-amber text-white hover:bg-amber/90'
              >
                Ejecutar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_app/recurring')({
  component: RecurringPage,
})
