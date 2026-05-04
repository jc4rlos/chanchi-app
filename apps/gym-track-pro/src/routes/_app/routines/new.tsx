import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCreateRoutine, useAddExerciseToRoutine } from '@/features/routines/use-routines'
import { RoutineBuilder, type ExerciseForBuilder } from '@/features/routines/routine-builder'

function NewRoutinePage() {
  const navigate = useNavigate()
  const createMutation = useCreateRoutine()
  const addExerciseMutation = useAddExerciseToRoutine()

  const handleSave = async (name: string, exercises: ExerciseForBuilder[]) => {
    try {
      const routine = await createMutation.mutateAsync({ name })

      for (const ex of exercises) {
        await addExerciseMutation.mutateAsync({
          routineId: routine.id,
          exerciseId: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.rest_seconds,
        })
      }

      navigate({ to: '/routines' })
    } catch (error) {
      console.error('Error saving routine:', error)
    }
  }

  return (
    <RoutineBuilder
      routineName=''
      onBack={() => navigate({ to: '/routines' })}
      onSave={handleSave}
      isSaving={createMutation.isPending || addExerciseMutation.isPending}
    />
  )
}

export const Route = createFileRoute('/_app/routines/new')({
  component: NewRoutinePage,
})
