import { useState } from 'react'
import { X, BookOpen, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAddRoutineToDay, useRemoveRoutineFromDay, useToggleRestDay, todayDayOfWeek } from './use-weekly-plan'
import type { WeeklyPlan, WeeklyPlanDay } from './use-weekly-plan'
import { useRoutines } from '@/features/routines/use-routines'

const DAY_LABELS = [
  { short: 'L', label: 'Lunes' },
  { short: 'M', label: 'Martes' },
  { short: 'X', label: 'Miércoles' },
  { short: 'J', label: 'Jueves' },
  { short: 'V', label: 'Viernes' },
  { short: 'S', label: 'Sábado' },
  { short: 'D', label: 'Domingo' },
]

function getDayDate(dayOfWeek: number) {
  const now = new Date()
  const diff = dayOfWeek - todayDayOfWeek()
  const d = new Date(now)
  d.setDate(d.getDate() + diff)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
}

interface RoutinePickerProps {
  planDay: WeeklyPlanDay
  onClose: () => void
}

function RoutinePicker({ planDay, onClose }: RoutinePickerProps) {
  const { data: routines = [] } = useRoutines()
  const addRoutine = useAddRoutineToDay()
  const alreadyAdded = (planDay.weekly_plan_day_routines || []).map((r) => r.routine_id)
  const available = routines.filter((r) => !alreadyAdded.includes(r.id))

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/80' onClick={onClose}>
      <div className='w-full max-w-lg bg-card border border-border rounded-t-3xl pb-10' onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between px-5 py-4 border-b border-border'>
          <h3 className='font-bold'>Agregar rutina</h3>
          <button onClick={onClose} className='p-2 hover:bg-card-dark rounded-lg'><X size={18} /></button>
        </div>
        <div className='flex flex-col gap-2 px-5 pt-4 max-h-80 overflow-y-auto'>
          {available.length === 0 ? (
            <p className='text-sm text-muted text-center py-6'>No hay más rutinas disponibles</p>
          ) : (
            available.map((r) => (
              <button
                key={r.id}
                onClick={() => { addRoutine.mutate({ planDayId: planDay.id, routineId: r.id }); onClose() }}
                className='flex items-center gap-3 p-3 rounded-xl border border-border text-sm text-left hover:bg-card-dark hover:border-primary transition-colors'
              >
                <BookOpen size={16} className='text-primary shrink-0' />
                <div>
                  <p className='font-semibold'>{r.name}</p>
                  <p className='text-xs text-muted'>{r.routine_exercises?.length || 0} ejercicios</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

interface WeeklyPlanViewProps {
  plan: WeeklyPlan
  weekNumber: number
  previousPlan: WeeklyPlan | null
  previousWeek: number
  onCopyPrevious: () => void
}

export function WeeklyPlanView({ plan, weekNumber, previousPlan, previousWeek, onCopyPrevious }: WeeklyPlanViewProps) {
  const today = todayDayOfWeek()
  const [selectedDay, setSelectedDay] = useState(today)
  const [showPicker, setShowPicker] = useState(false)
  const removeRoutine = useRemoveRoutineFromDay()
  const toggleRest = useToggleRestDay()

  const dayMap = new Map(plan.weekly_plan_days.map((d) => [d.day_of_week, d]))
  const currentDay: WeeklyPlanDay | undefined = dayMap.get(selectedDay)
  const routineEntries = currentDay?.weekly_plan_day_routines?.filter((r) => r.routine_id) ?? []

  return (
    <div className='flex flex-col min-h-screen bg-background pb-32'>
      <div className='flex items-center justify-between px-5 py-3 border-b border-border'>
        <h1 className='text-xl font-bold'>Plan semanal</h1>
        <span className='text-xs text-muted bg-card border border-border px-3 py-1 rounded-full'>Semana {weekNumber}</span>
      </div>

      <div className='flex gap-1.5 px-5 pt-4 pb-2'>
        {DAY_LABELS.map(({ short, label }, i) => {
          const day = dayMap.get(i)
          const hasRoutines = (day?.weekly_plan_day_routines?.length ?? 0) > 0
          const isRest = !!day?.is_rest_day
          const isToday = i === today
          const isSelected = i === selectedDay

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border transition-colors',
                isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card',
              )}
            >
              <span className={cn('text-sm font-bold', isSelected ? 'text-foreground' : 'text-muted')}>
                {short}
              </span>
              <span className='text-[9px] text-muted'>{isToday && !isSelected ? 'Hoy' : label.slice(0, 3)}</span>
              <div className={cn(
                'w-1.5 h-1.5 rounded-full',
                isRest ? 'bg-border' : hasRoutines ? 'bg-primary' : 'bg-border'
              )} />
            </button>
          )
        })}
      </div>

      <div className='mx-5 mt-2 bg-card border border-border rounded-2xl overflow-hidden'>
        <div className='flex items-center justify-between px-4 py-3.5 border-b border-border'>
          <div>
            <p className='font-bold text-sm'>{DAY_LABELS[selectedDay].label}</p>
            <p className='text-xs text-muted mt-0.5'>{getDayDate(selectedDay)}</p>
          </div>
          {currentDay && (
            <button
              onClick={() => toggleRest.mutate({ planDayId: currentDay.id, isRest: !currentDay.is_rest_day })}
              className={cn(
                'text-xs px-3 py-1 rounded-full border font-semibold transition-colors',
                currentDay.is_rest_day
                  ? 'bg-card-dark border-border text-muted'
                  : 'bg-primary/10 border-primary/30 text-primary'
              )}
            >
              {currentDay.is_rest_day ? 'Descanso' : 'Activo'}
            </button>
          )}
        </div>

        <div className='px-4 py-4 flex flex-col gap-2'>
          <p className='text-xs font-semibold text-muted mb-1'>Rutinas del día</p>

          {currentDay?.is_rest_day ? (
            <div className='flex items-center justify-center py-6 text-muted text-sm'>Día de descanso</div>
          ) : (
            <>
              {routineEntries.map((entry) => (
                <div key={entry.id} className='flex items-center gap-3 p-3 bg-background border border-border rounded-xl'>
                  <BookOpen size={15} className='text-primary shrink-0' />
                  <p className='flex-1 text-sm font-semibold'>{entry.routines?.name}</p>
                  <button
                    onClick={() => removeRoutine.mutate(entry.id)}
                    className='p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {currentDay && (
                <button
                  onClick={() => setShowPicker(true)}
                  className='flex items-center gap-2 p-3 bg-background border border-dashed border-border rounded-xl text-sm text-primary font-medium hover:bg-card-dark transition-colors'
                >
                  <Plus size={15} />
                  Agregar rutina
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {previousPlan && (
        <div className='mx-5 mt-3 flex items-center justify-between p-4 bg-card border border-border rounded-2xl'>
          <div>
            <p className='text-sm font-medium text-muted'>Reutilizar plan anterior</p>
            <p className='text-xs text-muted/60 mt-0.5'>
              Semana {previousWeek} · {previousPlan.weekly_plan_days.reduce((acc, d) => acc + (d.weekly_plan_day_routines?.length ?? 0), 0)} rutinas
            </p>
          </div>
          <button
            onClick={onCopyPrevious}
            className='text-xs px-3 py-1.5 bg-card-dark border border-border rounded-full font-semibold text-primary hover:border-primary transition-colors'
          >
            Usar este
          </button>
        </div>
      )}

      {showPicker && currentDay && (
        <RoutinePicker planDay={currentDay} onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}
