import { useState, useMemo } from 'react'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { type RoutineExercise, useRoutineDetail, useAddExerciseToRoutine, useUpdateRoutineExercise, useRemoveRoutineExercise } from './use-routines'
import { ExerciseSelectorModal } from './exercise-selector-modal'
import type { Exercise } from '@/features/exercises/exercise-list'

export interface ExerciseForBuilder extends RoutineExercise {
  name: string
  muscle: string
}

interface RoutineBuilderProps {
  routineId?: string
  routineName: string
  onBack: () => void
  onSave: (name: string, exercises: ExerciseForBuilder[]) => void
  isSaving?: boolean
}

export function RoutineBuilder({ routineId, routineName: initialName, onBack, onSave, isSaving }: RoutineBuilderProps) {
  const { data: routine, isLoading } = useRoutineDetail(routineId)
  const addExerciseMutation = useAddExerciseToRoutine()
  const updateExerciseMutation = useUpdateRoutineExercise()
  const removeExerciseMutation = useRemoveRoutineExercise()

  const [name, setName] = useState(initialName || 'Nueva rutina')
  const [showModal, setShowModal] = useState(false)
  const [localExercises, setLocalExercises] = useState<ExerciseForBuilder[]>([])

  const derivedExercises = useMemo(
    () =>
      routine?.routine_exercises?.map((ex) => ({
        ...ex,
        name: ex.exercises?.name_es || ex.exercises?.name || '',
        muscle: ex.exercises?.target_muscle || '',
      })) ?? [],
    [routine]
  )

  const exercises = routineId ? derivedExercises : localExercises

  const handleAddExercise = (exercise: Exercise, sets: number, reps: string, rest: number) => {
    if (!routineId) {
      setLocalExercises([
        ...localExercises,
        {
          id: Math.random().toString(),
          routine_id: '',
          exercise_id: exercise.id,
          sets,
          reps,
          rest_seconds: rest,
          order_index: localExercises.length,
          name: exercise.name,
          muscle: exercise.muscleGroup,
        },
      ])
    } else {
      addExerciseMutation.mutate({
        routineId,
        exerciseId: exercise.id,
        sets,
        reps,
        restSeconds: rest,
      })
    }
    setShowModal(false)
  }

  const handleUpdateExercise = <K extends keyof ExerciseForBuilder>(index: number, field: K, value: ExerciseForBuilder[K]) => {
    const updatedItem = { ...exercises[index], [field]: value }

    if (routineId && updatedItem.id) {
      updateExerciseMutation.mutate({
        id: updatedItem.id,
        sets: updatedItem.sets,
        reps: updatedItem.reps,
        restSeconds: updatedItem.rest_seconds,
      })
    } else {
      const updated = [...localExercises]
      updated[index] = updatedItem
      setLocalExercises(updated)
    }
  }

  const handleRemoveExercise = (index: number) => {
    const ex = exercises[index]
    if (routineId && ex.id) {
      removeExerciseMutation.mutate(ex.id)
    } else {
      setLocalExercises(localExercises.filter((_, i) => i !== index))
    }
  }

  const handleSave = () => {
    onSave(name, exercises)
  }

  if (routineId && isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <div className='flex items-center gap-3 px-5 py-3 border-b border-border'>
        <button onClick={onBack} className='p-2 hover:bg-card rounded-lg'>
          <ChevronLeft size={20} />
        </button>
        <h1 className='text-lg font-bold'>Nueva rutina</h1>
      </div>

      <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-20'>
        <div>
          <label className='text-xs font-semibold text-muted block mb-2'>Nombre de la rutina</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-medium'
          />
        </div>

        <div>
          <div className='flex justify-between items-center mb-3'>
            <label className='text-xs font-semibold text-muted'>Ejercicios</label>
            <span className='text-xs text-muted'>{exercises.length} ejercicios</span>
          </div>

          <div className='space-y-2'>
            {exercises.map((ex, idx) => (
              <div key={idx} className='bg-card border border-border rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='text-muted'>
                    <line x1='9' y1='18' x2='15' y2='18' />
                    <line x1='9' y1='12' x2='15' y2='12' />
                    <line x1='9' y1='6' x2='15' y2='6' />
                  </svg>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold'>{ex.name}</p>
                    <p className='text-xs text-muted'>{ex.muscle}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(idx)}
                    className='p-2 hover:bg-card-dark rounded-lg text-muted hover:text-foreground'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className='grid grid-cols-3 gap-2'>
                  <div>
                    <label className='text-xs text-muted block mb-1'>Series</label>
                    <input
                      type='number'
                      value={ex.sets}
                      onChange={(e) => handleUpdateExercise(idx, 'sets', parseInt(e.target.value) || 3)}
                      className='w-full bg-background border border-border rounded px-2 py-1 text-xs text-center font-bold'
                    />
                  </div>
                  <div>
                    <label className='text-xs text-muted block mb-1'>Reps</label>
                    <input
                      value={ex.reps}
                      onChange={(e) => handleUpdateExercise(idx, 'reps', e.target.value)}
                      className='w-full bg-background border border-border rounded px-2 py-1 text-xs text-center'
                      placeholder='8-12'
                    />
                  </div>
                  <div>
                    <label className='text-xs text-muted block mb-1'>Descanso (s)</label>
                    <input
                      type='number'
                      value={ex.rest_seconds}
                      onChange={(e) => handleUpdateExercise(idx, 'rest_seconds', parseInt(e.target.value) || 60)}
                      className='w-full bg-background border border-border rounded px-2 py-1 text-xs text-center'
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowModal(true)}
              className='w-full border border-dashed border-border rounded-lg py-3 text-sm font-medium text-primary hover:bg-card-dark transition-colors'
            >
              + Agregar ejercicio del catálogo
            </button>
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 z-40 px-5 py-3 bg-card border-t border-border'>
        <button
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
          className='w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg disabled:opacity-50'
        >
          {isSaving ? 'Guardando...' : 'Guardar rutina'}
        </button>
      </div>

      <ExerciseSelectorModal open={showModal} onClose={() => setShowModal(false)} onSelect={handleAddExercise} />
    </div>
  )
}
