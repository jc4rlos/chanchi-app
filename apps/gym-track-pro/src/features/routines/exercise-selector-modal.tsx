import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { useExercisesFiltered } from '@/features/exercises/use-exercises-filtered'
import { ExerciseCard } from '@/features/exercises/exercise-card'
import { ExerciseSearch } from '@/features/exercises/exercise-search'
import { ExerciseFilterMenu } from '@/features/exercises/exercise-filter-menu'
import type { Exercise } from '@/features/exercises/exercise-list'

interface ExerciseSelectorModalProps {
  open: boolean
  onClose: () => void
  onSelect: (exercise: Exercise, sets: number, reps: string, rest: number) => void
}

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'chest', label: 'Pecho' },
  { id: 'back', label: 'Espalda' },
  { id: 'arms', label: 'Brazos' },
  { id: 'legs', label: 'Piernas' },
  { id: 'shoulders', label: 'Hombros' },
  { id: 'core', label: 'Core' },
]

export function ExerciseSelectorModal({ open, onClose, onSelect }: ExerciseSelectorModalProps) {
  const {
    exercises,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isLoading,
  } = useExercisesFiltered()

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [sets, setSets] = useState('3')
  const [reps, setReps] = useState('10-12')
  const [rest, setRest] = useState('60')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleConfirm = () => {
    if (selectedExercise) {
      onSelect(selectedExercise, parseInt(sets) || 3, reps || '10-12', parseInt(rest) || 60)
      setSelectedExercise(null)
      setSets('3')
      setReps('10-12')
      setRest('60')
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center'>
      <div className='w-full h-[90vh] sm:max-w-96 sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-card border border-border overflow-hidden'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-border'>
          <h2 className='text-lg font-bold'>Agregar ejercicio</h2>
          <button onClick={onClose} className='p-2 hover:bg-card-dark rounded-lg'>
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 flex flex-col overflow-hidden'>
          {!selectedExercise ? (
            <>
              <ExerciseSearch value={searchQuery} onChange={setSearchQuery} />

              <ExerciseFilterMenu
                options={FILTERS}
                selectedId={selectedCategory}
                onSelect={(id) => setSelectedCategory(id as any)}
                variant='pills'
                showArrows={true}
              />

              <div ref={scrollRef} className='flex-1 overflow-y-auto px-5 py-3'>
                <div className='space-y-2'>
                  {exercises.length === 0 && !isLoading ? (
                    <div className='text-center py-8'>
                      <p className='text-sm text-muted'>No se encontraron ejercicios</p>
                    </div>
                  ) : (
                    exercises.map((ex) => (
                      <div key={ex.id} onClick={() => setSelectedExercise(ex)}>
                        <ExerciseCard
                          name={ex.name}
                          muscleGroup={ex.muscleGroup}
                          equipment={ex.equipment}
                          difficulty={ex.difficulty}
                          primaryMuscles={ex.primaryMuscles}
                          secondaryMuscles={ex.secondaryMuscles}
                          emoji={ex.emoji}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex flex-col p-5'>
              <button
                onClick={() => setSelectedExercise(null)}
                className='self-start text-primary text-sm font-medium mb-4 flex items-center gap-1'
              >
                ← Volver
              </button>

              <div className='mb-6'>
                <h3 className='text-base font-bold mb-2'>{selectedExercise.name}</h3>
                <p className='text-xs text-muted'>
                  {selectedExercise.muscleGroup} · {selectedExercise.equipment}
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-semibold text-muted block mb-2'>Series</label>
                  <input
                    type='number'
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className='w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-center'
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold text-muted block mb-2'>Repeticiones</label>
                  <input
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className='w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-center'
                    placeholder='8-12'
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold text-muted block mb-2'>Descanso (segundos)</label>
                  <input
                    type='number'
                    value={rest}
                    onChange={(e) => setRest(e.target.value)}
                    className='w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-center'
                  />
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className='mt-auto w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg'
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
