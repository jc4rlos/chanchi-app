import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useRoutines, useDeleteRoutine } from './use-routines'
import type { Routine } from './use-routines'

interface RoutineListProps {
  onCreateNew: () => void
  onSelectRoutine: (routine: Routine) => void
}

export function RoutineList({ onCreateNew, onSelectRoutine }: RoutineListProps) {
  const { data: routines, isLoading } = useRoutines()
  const deleteMutation = useDeleteRoutine()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <div className='flex items-center justify-between px-5 py-3 border-b border-border'>
        <h1 className='text-xl font-bold'>Mis Rutinas</h1>
      </div>

      <div className='flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-20'>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <div className='animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full' />
          </div>
        ) : !routines || routines.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <p className='text-sm text-muted mb-4'>No tienes rutinas creadas</p>
            <button
              onClick={onCreateNew}
              className='px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-sm'
            >
              Crear primera rutina
            </button>
          </div>
        ) : (
          routines.map((routine) => (
            <div
              key={routine.id}
              onClick={() => onSelectRoutine(routine)}
              className='bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-card-dark transition-colors'
            >
              <div className='flex items-start justify-between mb-2'>
                <h3 className='font-bold text-sm flex-1'>{routine.name}</h3>
                <div className='flex items-center gap-2'>
                  <span className='text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-medium'>
                    {routine.routine_exercises?.length || 0} ejercicios
                  </span>
                  {confirmId === routine.id ? (
                    <div className='flex items-center gap-1' onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { deleteMutation.mutate(routine.id); setConfirmId(null) }}
                        className='text-xs px-2 py-1 bg-red-500 text-white rounded-md font-semibold'
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className='text-xs px-2 py-1 bg-card-dark text-muted rounded-md'
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmId(routine.id) }}
                      className='p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
              {routine.description && <p className='text-xs text-muted mb-2'>{routine.description}</p>}
              <p className='text-xs text-soft'>Creada el {new Date(routine.created_at).toLocaleDateString('es-ES')}</p>
            </div>
          ))
        )}
      </div>

      <div className='safe-bottom fixed bottom-24 right-5 z-40'>
        <button
          onClick={onCreateNew}
          className='w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors'
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  )
}
