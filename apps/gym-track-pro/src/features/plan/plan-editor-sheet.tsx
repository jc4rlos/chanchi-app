import { useState } from 'react'
import { X, BookOpen, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useTogglePlanDayRest,
  useAddRoutineToPlanDay,
  useRemoveRoutineFromPlanDay,
} from './use-plans'
import type { Plan, PlanDay } from './use-plans'
import { DAY_LABELS } from './plan-utils'
import { useRoutines } from '@/features/routines/use-routines'

type RoutinePickerProps = {
  planDay: PlanDay
  onClose: () => void
}

function RoutinePicker({ planDay, onClose }: RoutinePickerProps) {
  const { data: routines = [] } = useRoutines()
  const addRoutine = useAddRoutineToPlanDay()
  const alreadyAdded = (planDay.plan_day_routines || []).map((r) => r.routine_id)
  const available = routines.filter((r) => !alreadyAdded.includes(r.id))

  return (
    <div
      className='fixed inset-0 z-[60] flex items-end justify-center bg-black/80'
      onClick={onClose}
    >
      <div
        className='w-full max-w-lg bg-card border border-border rounded-t-3xl pb-10'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-5 py-4 border-b border-border'>
          <h3 className='font-bold text-[15px]'>Agregar rutina</h3>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-card-dark'
          >
            <X size={16} className='text-muted' />
          </button>
        </div>
        <div className='flex flex-col gap-2 px-4 pt-4 max-h-80 overflow-y-auto'>
          {available.length === 0 ? (
            <p className='text-sm text-muted text-center py-6'>
              No hay más rutinas disponibles
            </p>
          ) : (
            available.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  addRoutine.mutate({ planDayId: planDay.id, routineId: r.id })
                  onClose()
                }}
                className='flex items-center gap-3 p-3 rounded-xl border border-border bg-card-dark text-sm text-left'
              >
                <BookOpen size={16} className='text-primary shrink-0' />
                <div>
                  <p className='font-semibold'>{r.name}</p>
                  <p className='text-xs text-muted'>
                    {r.routine_exercises?.length || 0} ejercicios
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

type Props = {
  plan: Plan
  onClose: () => void
}

export function PlanEditorSheet({ plan, onClose }: Props) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [showPicker, setShowPicker] = useState(false)
  const toggleRest = useTogglePlanDayRest()
  const removeRoutine = useRemoveRoutineFromPlanDay()

  const dayMap = new Map((plan.plan_days ?? []).map((d) => [d.day_of_week, d]))
  const currentDay = dayMap.get(selectedDay)
  const routineEntries = currentDay?.plan_day_routines ?? []

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 bottom-0 left-0 z-50 flex max-h-[90dvh] flex-col rounded-t-3xl border-t border-border bg-card'>
        <div className='flex items-center justify-between px-5 pt-4 pb-3 border-b border-border'>
          <div className='h-1 w-10 rounded-full bg-soft/30 absolute top-2.5 left-1/2 -translate-x-1/2' />
          <div>
            <h2 className='text-foreground text-[16px] font-bold'>
              Editar plan
            </h2>
            <p className='text-muted text-[12px] mt-0.5'>{plan.name}</p>
          </div>
          <button
            onClick={onClose}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card-dark'
          >
            <X size={16} className='text-muted' />
          </button>
        </div>

        <div className='flex gap-1.5 px-4 pt-3 pb-2'>
          {DAY_LABELS.map(({ short }, i) => {
            const day = dayMap.get(i)
            const hasRoutines = (day?.plan_day_routines?.length ?? 0) > 0
            const isRest = !!day?.is_rest_day
            const isSelected = i === selectedDay
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card-dark'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-bold',
                    isSelected ? 'text-foreground' : 'text-muted'
                  )}
                >
                  {short}
                </span>
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isRest
                      ? 'bg-border'
                      : hasRoutines
                        ? 'bg-primary'
                        : 'bg-border'
                  )}
                />
              </button>
            )
          })}
        </div>

        <div className='flex-1 overflow-y-auto px-4 pb-4'>
          <div className='flex items-center justify-between mb-3 mt-1'>
            <p className='text-[13px] font-bold text-foreground'>
              {DAY_LABELS[selectedDay].label}
            </p>
            {currentDay && (
              <button
                onClick={() =>
                  toggleRest.mutate({
                    planDayId: currentDay.id,
                    isRest: !currentDay.is_rest_day,
                  })
                }
                className={cn(
                  'text-[11px] px-3 py-1 rounded-full border font-semibold transition-colors',
                  currentDay.is_rest_day
                    ? 'bg-card-dark border-border text-muted'
                    : 'bg-primary/10 border-primary/30 text-primary'
                )}
              >
                {currentDay.is_rest_day ? 'Descanso' : 'Activo'}
              </button>
            )}
          </div>

          {currentDay?.is_rest_day ? (
            <div className='flex items-center justify-center py-8 text-muted text-sm rounded-2xl border border-dashed border-border'>
              Día de descanso
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {routineEntries.map((entry) => (
                <div
                  key={entry.id}
                  className='flex items-center gap-3 p-3 bg-card-dark border border-border rounded-xl'
                >
                  <BookOpen size={15} className='text-primary shrink-0' />
                  <p className='flex-1 text-sm font-semibold'>
                    {entry.routines?.name}
                  </p>
                  <button
                    onClick={() => removeRoutine.mutate(entry.id)}
                    className='p-1.5 text-muted rounded-lg'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {currentDay && (
                <button
                  onClick={() => setShowPicker(true)}
                  className='flex items-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-primary font-medium'
                >
                  <Plus size={15} />
                  Agregar rutina
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showPicker && currentDay && (
        <RoutinePicker
          planDay={currentDay}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
