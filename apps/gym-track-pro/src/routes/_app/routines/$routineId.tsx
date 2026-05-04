import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRoutineDetail, useUpdateRoutine } from '@/features/routines/use-routines'
import { RoutineBuilder } from '@/features/routines/routine-builder'

function EditRoutinePage() {
  const navigate = useNavigate()
  const { routineId } = Route.useParams()
  const { data: routine } = useRoutineDetail(routineId)
  const updateMutation = useUpdateRoutine()

  const handleSave = async (name: string) => {
    try {
      await updateMutation.mutateAsync({ id: routineId, name })
      navigate({ to: '/routines' })
    } catch (error) {
      console.error('Error saving routine:', error)
    }
  }

  return (
    <RoutineBuilder
      routineId={routineId}
      routineName={routine?.name || ''}
      onBack={() => navigate({ to: '/routines' })}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
    />
  )
}

export const Route = createFileRoute('/_app/routines/$routineId')({
  component: EditRoutinePage,
})
