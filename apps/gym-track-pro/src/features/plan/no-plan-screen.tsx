import { RotateCcw, Plus, ArrowRight } from 'lucide-react'
import type { WeeklyPlan } from './use-weekly-plan'

interface NoPlanScreenProps {
  previousPlan: WeeklyPlan | null
  previousWeek: number
  onCreateNew: () => void
  onCopyPrevious: () => void
  onSkip: () => void
  isLoading: boolean
}

export function NoPlanScreen({ previousPlan, previousWeek, onCreateNew, onCopyPrevious, onSkip, isLoading }: NoPlanScreenProps) {
  const activeDays = previousPlan?.weekly_plan_days.filter((d) => !d.is_rest_day && (d.weekly_plan_day_routines?.length ?? 0) > 0).length ?? 0
  const routineNames = previousPlan?.weekly_plan_days
    .flatMap((d) => d.weekly_plan_day_routines ?? [])
    .map((r) => r.routines?.name)
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .slice(0, 4)
    .join(' · ') ?? ''

  return (
    <div className='flex items-center justify-center min-h-[70vh] px-4'>
      <div className='w-full max-w-sm bg-card border border-border rounded-3xl p-7 flex flex-col items-center gap-5'>
        <div className='w-18 h-18 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-4xl'>
          📅
        </div>

        <div className='text-center'>
          <h2 className='text-xl font-bold mb-2'>Sin plan para esta semana</h2>
          <p className='text-sm text-muted leading-relaxed'>No encontramos un plan activo. ¿Qué querés hacer?</p>
        </div>

        <div className='w-full flex flex-col gap-3'>
          <button
            onClick={onCreateNew}
            disabled={isLoading}
            className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl disabled:opacity-50'
          >
            <Plus size={16} />
            Crear nuevo plan
          </button>

          <button
            onClick={onCopyPrevious}
            disabled={isLoading || !previousPlan}
            className='w-full flex items-center justify-center gap-2 bg-card-dark border border-border text-foreground font-semibold py-3 rounded-xl disabled:opacity-40'
          >
            <RotateCcw size={16} />
            Usar semana anterior
          </button>

          {previousPlan && (
            <div className='flex items-center gap-3 p-4 bg-background border border-border rounded-2xl'>
              <div className='flex-1'>
                <p className='text-sm font-semibold'>Semana {previousWeek}</p>
                <p className='text-xs text-muted mt-0.5'>{activeDays} días · {routineNames || 'Sin rutinas asignadas'}</p>
              </div>
              <ArrowRight size={18} className='text-muted' />
            </div>
          )}

          <button
            onClick={onSkip}
            className='w-full py-3 text-sm text-muted'
          >
            Continuar sin plan
          </button>
        </div>
      </div>
    </div>
  )
}
