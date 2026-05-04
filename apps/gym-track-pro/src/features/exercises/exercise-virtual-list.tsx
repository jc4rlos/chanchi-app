import { ExerciseCard } from './exercise-card'
import type { Exercise } from './exercise-list'

type Props = {
  exercises: Exercise[]
  isLoading?: boolean
  onSelectExercise: (exercise: Exercise) => void
}

export const ExerciseVirtualList = ({
  exercises,
  isLoading,
  onSelectExercise,
}: Props) => {
  return (
    <div className='flex-1 overflow-y-auto scrollbar-hide'>
      {exercises.length === 0 && !isLoading ? (
        <div className='flex flex-col items-center justify-center py-12 px-5 text-center'>
          <p className='text-[14px] text-muted'>No se encontraron ejercicios</p>
          <p className='mt-1 text-[12px] text-soft'>Intenta otra búsqueda o categoría</p>
        </div>
      ) : (
        <div className='px-5 py-3'>
          <div className='space-y-2'>
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                name={exercise.name}
                muscleGroup={exercise.muscleGroup}
                equipment={exercise.equipment}
                difficulty={exercise.difficulty}
                primaryMuscles={exercise.primaryMuscles}
                secondaryMuscles={exercise.secondaryMuscles}
                emoji={exercise.emoji}
                onClick={() => onSelectExercise(exercise)}
              />
            ))}
          </div>

          {isLoading && exercises.length === 0 && (
            <div className='flex justify-center py-8'>
              <div className='animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full' />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
