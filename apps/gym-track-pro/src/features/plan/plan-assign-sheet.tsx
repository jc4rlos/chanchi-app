import { X, Calendar, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan, PlanWeekAssignment } from './use-plans'
import {
  useAssignPlanToWeek,
  useUnassignPlanFromWeek,
  getUpcomingWeeks,
} from './use-plans'
import { getISOWeek } from './plan-utils'

type Props = {
  plan: Plan
  assignments: PlanWeekAssignment[]
  onClose: () => void
}

export function PlanAssignSheet({ plan, assignments, onClose }: Props) {
  const weeks = getUpcomingWeeks(10)
  const { week: currentWeek, year: currentYear } = getISOWeek(new Date())
  const assignMutation = useAssignPlanToWeek()
  const unassignMutation = useUnassignPlanFromWeek()

  const getAssignment = (week: number, year: number) =>
    assignments.find((a) => a.week_number === week && a.year === year)

  const toggle = (week: number, year: number) => {
    const existing = getAssignment(week, year)
    if (existing) {
      unassignMutation.mutate(existing.id)
    } else {
      assignMutation.mutate({ planId: plan.id, weekNumber: week, year })
    }
  }

  const isBusy = assignMutation.isPending || unassignMutation.isPending

  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 bottom-0 left-0 z-50 flex max-h-[80dvh] flex-col rounded-t-3xl border-t border-border bg-card'>
        <div className='flex items-center justify-between px-5 pt-4 pb-3 border-b border-border'>
          <div className='h-1 w-10 rounded-full bg-soft/30 absolute top-2.5 left-1/2 -translate-x-1/2' />
          <div>
            <h2 className='text-foreground text-[16px] font-bold'>
              Asignar semanas
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

        <div className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2'>
          {weeks.map(({ week, year, label }) => {
            const assigned = !!getAssignment(week, year)
            const isCurrentWeek = week === currentWeek && year === currentYear
            return (
              <button
                key={`${year}-${week}`}
                onClick={() => !isBusy && toggle(week, year)}
                disabled={isBusy}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all',
                  assigned
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card-dark'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                    assigned ? 'bg-primary' : 'bg-card border border-border'
                  )}
                >
                  {assigned ? (
                    <Check size={16} strokeWidth={2.5} className='text-primary-foreground' />
                  ) : (
                    <Calendar size={14} className='text-muted' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p
                    className={cn(
                      'text-[13px] font-semibold',
                      assigned ? 'text-foreground' : 'text-muted'
                    )}
                  >
                    {label}
                    {isCurrentWeek && (
                      <span className='ml-2 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5'>
                        Esta semana
                      </span>
                    )}
                  </p>
                  {assigned && (
                    <p className='text-primary text-[11px] mt-0.5'>Asignado</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className='px-4 py-3 border-t border-border'>
          <button
            onClick={onClose}
            className='w-full rounded-2xl bg-card-dark border border-border py-3 text-[14px] font-semibold text-muted'
          >
            Listo
          </button>
        </div>
      </div>
    </>
  )
}
