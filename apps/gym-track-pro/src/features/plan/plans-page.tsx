import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  Plus,
  Calendar,
  Pencil,
  Trash2,
  BookOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  usePlans,
  usePlanAssignments,
  useCreatePlan,
  useDeletePlan,
  useRenamePlan,
} from './use-plans'
import type { Plan } from './use-plans'
import { PlanAssignSheet } from './plan-assign-sheet'
import { PlanEditorSheet } from './plan-editor-sheet'
import { DAY_LABELS } from './plan-utils'

// ── Day dots summary ─────────────────────────────────────────

function PlanDayDots({ plan }: { plan: Plan }) {
  const dayMap = new Map((plan.plan_days ?? []).map((d) => [d.day_of_week, d]))
  return (
    <div className='flex gap-1'>
      {DAY_LABELS.map(({ short }, i) => {
        const day = dayMap.get(i)
        const hasRoutines = (day?.plan_day_routines?.length ?? 0) > 0
        const isRest = !!day?.is_rest_day
        return (
          <div key={i} className='flex flex-col items-center gap-0.5'>
            <div
              className={cn(
                'w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold',
                hasRoutines
                  ? 'bg-primary/15 text-primary'
                  : isRest
                    ? 'bg-card-dark text-soft'
                    : 'bg-card-dark text-soft'
              )}
            >
              {short}
            </div>
            <div
              className={cn(
                'w-1 h-1 rounded-full',
                hasRoutines ? 'bg-primary' : 'bg-border'
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Create sheet ─────────────────────────────────────────────

function CreatePlanSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const create = useCreatePlan()

  const submit = () => {
    if (!name.trim()) return
    create.mutate(name.trim(), { onSuccess: onClose })
  }

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t border-border bg-card px-5 pt-5 pb-8'>
        <div className='h-1 w-10 rounded-full bg-soft/30 absolute top-2.5 left-1/2 -translate-x-1/2' />
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-[16px] font-bold text-foreground'>Nuevo plan</h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-card-dark'
          >
            <X size={16} className='text-muted' />
          </button>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='rounded-2xl border border-border bg-card-dark px-4 py-3'>
            <p className='text-[10px] font-semibold text-muted uppercase tracking-wide mb-1'>
              Nombre del plan
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder='Ej: Fuerza 5 días'
              className='w-full bg-transparent text-foreground text-[15px] font-semibold placeholder:text-soft focus:outline-none'
            />
          </div>
          <button
            onClick={submit}
            disabled={!name.trim() || create.isPending}
            className='bg-primary text-primary-foreground w-full rounded-2xl py-3.5 text-[15px] font-bold disabled:opacity-50'
            style={{ boxShadow: '0 4px 24px rgba(163,230,53,.2)' }}
          >
            {create.isPending ? 'Creando...' : 'Crear plan'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Plan card ─────────────────────────────────────────────────

type PlanCardProps = {
  plan: Plan
  assignedWeeks: number
  onEdit: () => void
  onAssign: () => void
  onDelete: () => void
  onRename: () => void
}

function PlanCard({
  plan,
  assignedWeeks,
  onEdit,
  onAssign,
  onDelete,
  onRename,
}: PlanCardProps) {
  const activeDays = (plan.plan_days ?? []).filter(
    (d) => !d.is_rest_day && (d.plan_day_routines?.length ?? 0) > 0
  ).length
  const totalRoutines = (plan.plan_days ?? []).reduce(
    (acc, d) => acc + (d.plan_day_routines?.length ?? 0),
    0
  )

  return (
    <div className='rounded-2xl border border-border bg-card overflow-hidden'>
      <div className='px-4 pt-4 pb-3'>
        <div className='flex items-start justify-between gap-2 mb-3'>
          <div className='flex-1 min-w-0'>
            <p className='text-foreground text-[15px] font-bold leading-tight'>
              {plan.name}
            </p>
            <p className='text-muted text-[11px] mt-0.5'>
              {activeDays} días activos · {totalRoutines} rutinas
              {assignedWeeks > 0 && (
                <span className='text-primary ml-1.5 font-semibold'>
                  · {assignedWeeks} sem. asignadas
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onRename}
            className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card-dark text-muted'
          >
            <Pencil size={13} />
          </button>
        </div>

        <PlanDayDots plan={plan} />
      </div>

      <div className='flex border-t border-border'>
        <button
          onClick={onEdit}
          className='flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-muted border-r border-border'
        >
          <BookOpen size={13} />
          Editar días
        </button>
        <button
          onClick={onAssign}
          className='flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-primary border-r border-border'
        >
          <Calendar size={13} />
          Asignar
        </button>
        <button
          onClick={onDelete}
          className='flex h-full items-center justify-center px-4 py-2.5 text-muted'
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Rename sheet ─────────────────────────────────────────────

function RenameSheet({
  plan,
  onClose,
}: {
  plan: Plan
  onClose: () => void
}) {
  const [name, setName] = useState(plan.name)
  const rename = useRenamePlan()

  const submit = () => {
    if (!name.trim() || name.trim() === plan.name) { onClose(); return }
    rename.mutate({ planId: plan.id, name: name.trim() }, { onSuccess: onClose })
  }

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t border-border bg-card px-5 pt-5 pb-8'>
        <div className='h-1 w-10 rounded-full bg-soft/30 absolute top-2.5 left-1/2 -translate-x-1/2' />
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-[16px] font-bold text-foreground'>Renombrar plan</h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-card-dark'
          >
            <X size={16} className='text-muted' />
          </button>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='rounded-2xl border border-border bg-card-dark px-4 py-3'>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className='w-full bg-transparent text-foreground text-[15px] font-semibold focus:outline-none'
            />
          </div>
          <button
            onClick={submit}
            disabled={!name.trim() || rename.isPending}
            className='bg-primary text-primary-foreground w-full rounded-2xl py-3.5 text-[15px] font-bold disabled:opacity-50'
          >
            {rename.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Delete confirm ────────────────────────────────────────────

function DeleteConfirm({
  plan,
  onClose,
}: {
  plan: Plan
  onClose: () => void
}) {
  const deletePlan = useDeletePlan()

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t border-border bg-card px-5 pt-5 pb-8'>
        <div className='h-1 w-10 rounded-full bg-soft/30 absolute top-2.5 left-1/2 -translate-x-1/2' />
        <div className='flex flex-col gap-4 mt-2'>
          <div className='text-center'>
            <p className='text-foreground text-[16px] font-bold'>
              ¿Eliminar "{plan.name}"?
            </p>
            <p className='text-muted text-[13px] mt-1'>
              Se eliminará el plan y todas sus asignaciones.
            </p>
          </div>
          <button
            onClick={() =>
              deletePlan.mutate(plan.id, { onSuccess: onClose })
            }
            disabled={deletePlan.isPending}
            className='w-full rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 py-3.5 text-[15px] font-bold disabled:opacity-50'
          >
            {deletePlan.isPending ? 'Eliminando...' : 'Eliminar plan'}
          </button>
          <button
            onClick={onClose}
            className='w-full rounded-2xl bg-card-dark border border-border text-muted py-3 text-[14px] font-semibold'
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────

type Sheet =
  | { type: 'create' }
  | { type: 'edit'; plan: Plan }
  | { type: 'assign'; plan: Plan }
  | { type: 'rename'; plan: Plan }
  | { type: 'delete'; plan: Plan }

export function PlansPage() {
  const navigate = useNavigate()
  const { data: plans = [], isLoading } = usePlans()
  const { data: assignments = [] } = usePlanAssignments()
  const [sheet, setSheet] = useState<Sheet | null>(null)

  const getAssignedWeeks = (planId: string) =>
    assignments.filter((a) => a.plan_id === planId).length

  return (
    <div className='flex flex-col gap-4 pb-32'>
      <div className='flex items-center gap-3 border-b border-border pb-3'>
        <button
          onClick={() => navigate({ to: '/plan' })}
          className='border-border bg-card flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border'
        >
          <ChevronLeft size={16} className='text-foreground' />
        </button>
        <div className='flex-1'>
          <p className='text-foreground text-[15px] font-bold'>Mis planes</p>
          <p className='text-muted text-[11px]'>
            {plans.length} {plans.length === 1 ? 'plan' : 'planes'} guardados
          </p>
        </div>
        <button
          onClick={() => setSheet({ type: 'create' })}
          className='bg-primary text-primary-foreground flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-bold'
        >
          <Plus size={14} strokeWidth={2.5} />
          Nuevo
        </button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
        </div>
      ) : plans.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
          <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl'>
            <Calendar size={28} className='text-primary' strokeWidth={1.5} />
          </div>
          <div>
            <p className='text-foreground text-[17px] font-bold'>Sin planes aún</p>
            <p className='text-muted mt-1 text-[13px]'>
              Creá planes reutilizables y asignalos a tus semanas
            </p>
          </div>
          <button
            onClick={() => setSheet({ type: 'create' })}
            className='bg-primary text-primary-foreground rounded-[14px] px-8 py-3.5 text-[15px] font-bold'
            style={{ boxShadow: '0 4px 24px rgba(163,230,53,.2)' }}
          >
            Crear primer plan
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              assignedWeeks={getAssignedWeeks(plan.id)}
              onEdit={() => setSheet({ type: 'edit', plan })}
              onAssign={() => setSheet({ type: 'assign', plan })}
              onDelete={() => setSheet({ type: 'delete', plan })}
              onRename={() => setSheet({ type: 'rename', plan })}
            />
          ))}
        </div>
      )}

      {sheet?.type === 'create' && (
        <CreatePlanSheet onClose={() => setSheet(null)} />
      )}
      {sheet?.type === 'edit' && (
        <PlanEditorSheet plan={sheet.plan} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === 'assign' && (
        <PlanAssignSheet
          plan={sheet.plan}
          assignments={assignments.filter((a) => a.plan_id === sheet.plan.id)}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet?.type === 'rename' && (
        <RenameSheet plan={sheet.plan} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === 'delete' && (
        <DeleteConfirm plan={sheet.plan} onClose={() => setSheet(null)} />
      )}
    </div>
  )
}
