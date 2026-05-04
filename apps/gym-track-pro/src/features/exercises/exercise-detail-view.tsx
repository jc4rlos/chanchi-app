import { Heart, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExerciseDifficultyDots } from './exercise-difficulty-dots'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

type Props = {
  name: string
  primaryMuscle: string
  secondaryMuscles: string[]
  equipment: string
  difficulty: Difficulty
  instructions: string[]
  gifUrl?: string
  onBack: () => void
  onAddToRoutine?: () => void
  onAddToToday?: () => void
}

export const ExerciseDetailView = ({
  name,
  primaryMuscle,
  secondaryMuscles,
  equipment,
  difficulty,
  instructions,
  gifUrl,
  onBack,
  onAddToRoutine,
  onAddToToday,
}: Props) => {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <div className='flex items-center gap-3 px-5 pt-3 pb-2'>
        <button
          onClick={onBack}
          className='flex h-8.5 w-8.5 items-center justify-center rounded-full bg-card border border-border hover:bg-card-dark transition-colors'
        >
          <ChevronLeft size={16} className='text-foreground' />
        </button>
        <h1 className='text-[17px] font-bold text-foreground flex-1 truncate'>{name}</h1>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className='flex h-8.5 w-8.5 items-center justify-center rounded-full bg-primary-light border border-[#2a4a1a] hover:bg-primary-mid transition-colors'
        >
          <Heart
            size={16}
            className={isFavorite ? 'fill-primary text-primary' : 'text-primary'}
          />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto pb-20'>
        <div className='space-y-3'>
          <div className='mx-auto px-2 bg-card rounded-[16px] border border-border overflow-hidden h-50 flex items-center justify-center w-fit'>
            {gifUrl ? (
              <img src={gifUrl} alt={name} className='rounded-xl'  />
            ) : (
              <div className='text-center'>
                <div className='text-5xl mb-2'>💪</div>
                <p className='text-[12px] text-muted'>GIF animado del ejercicio</p>
                <p className='text-[11px] text-soft mt-1'>vía ExerciseDB API</p>
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-2 px-5'>
            <div className='bg-card-dark rounded-[12px] p-3 border border-border'>
              <p className='text-[10px] text-muted mb-1'>Músculo principal</p>
              <p className='text-[14px] font-bold text-primary'>{primaryMuscle}</p>
            </div>
            <div className='bg-card-dark rounded-[12px] p-3 border border-border'>
              <p className='text-[10px] text-muted mb-1'>Equipamiento</p>
              <p className='text-[14px] font-bold text-foreground'>{equipment}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 px-5'>
            <div className='bg-card-dark rounded-[12px] p-3 border border-border'>
              <p className='text-[10px] text-muted mb-2'>Músculos secundarios</p>
              <div className='flex flex-wrap gap-1.5'>
                {secondaryMuscles.slice(0, 2).map((muscle) => (
                  <span
                    key={muscle}
                    className='px-2 py-1 bg-[#1a1a2a] text-[#818cf8] text-[10px] rounded-[10px] border border-[#2a2a3a] font-medium'
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
            <div className='bg-card-dark rounded-[12px] p-3 border border-border flex flex-col items-start'>
              <p className='text-[10px] text-muted mb-2'>Dificultad</p>
              <ExerciseDifficultyDots difficulty={difficulty} size='sm' />
            </div>
          </div>

          {instructions.length > 0 && (
            <div className='mx-5 bg-card-dark rounded-[14px] p-3 border border-border'>
              <p className='text-[11px] font-bold uppercase text-muted mb-3 tracking-wider'>Instrucciones</p>
              <div className='space-y-2.5'>
                {instructions.map((instruction, i) => (
                  <div key={i} className='flex gap-3 items-start'>
                    <div
                      className={cn(
                        'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        i === 0
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary-light text-primary border border-[#2a4a1a]'
                      )}
                    >
                      {i + 1}
                    </div>
                    <p className='text-[13px] text-foreground leading-relaxed pt-0.5'>{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='px-5 flex flex-col gap-2'>
            <button
              onClick={onAddToRoutine}
              className='w-full flex items-center justify-center gap-2 rounded-[14px] bg-primary py-3.5 text-[15px] font-bold text-primary-foreground'
              style={{ boxShadow: '0 4px 24px rgba(163,230,53,.2)' }}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                <line x1='12' y1='5' x2='12' y2='19' />
                <line x1='5' y1='12' x2='19' y2='12' />
              </svg>
              Agregar a rutina
            </button>
            <button
              onClick={onAddToToday}
              className='w-full rounded-[14px] bg-card border border-border py-3.5 text-[15px] font-bold text-foreground hover:bg-card-dark transition-colors'
            >
              Agregar al plan de hoy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
