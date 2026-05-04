import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useExercisesFiltered } from '@/features/exercises/use-exercises-filtered'
import { ExerciseSearch } from '@/features/exercises/exercise-search'
import { ExerciseFilterMenu, type FilterMenuOption } from '@/features/exercises/exercise-filter-menu'
import { ExerciseVirtualList } from '@/features/exercises/exercise-virtual-list'
import { ExercisePagination } from '@/features/exercises/exercise-pagination'

const FILTER_OPTIONS: FilterMenuOption[] = [
  { id: 'all', label: 'Todo' },
  { id: 'chest', label: 'Pecho' },
  { id: 'back', label: 'Espalda' },
  { id: 'arms', label: 'Brazos' },
  { id: 'legs', label: 'Piernas' },
  { id: 'shoulders', label: 'Hombros' },
  { id: 'core', label: 'Core' },
]

function ExercisesPage() {
  const navigate = useNavigate()
  const listRef = useRef<HTMLDivElement>(null)
  const { exercises, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, isLoading, page, setPage, totalPages } =
    useExercisesFiltered()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <div className='flex items-center gap-3 px-5 pt-3 pb-2'>
        <h1 className='text-[20px] font-bold text-foreground'>Ejercicios</h1>
      </div>

      <ExerciseSearch value={searchQuery} onChange={setSearchQuery} />

      <ExerciseFilterMenu
        options={FILTER_OPTIONS}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id as any)}
        variant='pills'
        showArrows={true}
      />

      <div ref={listRef} className='flex-1 overflow-y-auto scrollbar-hide'>
        <ExerciseVirtualList
          exercises={exercises}
          isLoading={isLoading}
          onSelectExercise={(exercise) => {
            navigate({ to: '/exercises/$exerciseId', params: { exerciseId: exercise.id } })
          }}
        />
      </div>

      {totalPages > 1 && (
        <ExercisePagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export const Route = createFileRoute('/_app/exercises/')({
  component: ExercisesPage,
})
