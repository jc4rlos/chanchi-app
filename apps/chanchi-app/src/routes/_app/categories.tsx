import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Category } from '@/types/finance'
import { useAuthStore } from '@/stores/auth-store'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { CategoryCard } from '@/features/categories/category-card'
import { CategoryForm } from '@/features/categories/category-form'
import { useCategories } from '@/features/categories/use-categories'

type TabType = 'expense' | 'income'

const CategoriesPage = () => {
  const { user } = useAuthStore()
  const { categories, create, update, remove } = useCategories(user!.id)
  const [tab, setTab] = useState<TabType>('expense')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const filtered = categories.data?.filter((c) => c.type === tab) ?? []

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setSheetOpen(true)
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        title='Categorías'
        subtitle={`${categories.data?.length ?? 0} categorías`}
      />

      {/* Tabs */}
      <div className='mb-4 flex rounded-xl bg-border p-1'>
        {(['expense', 'income'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted'
            }`}
          >
            {t === 'expense' ? 'Gastos' : 'Ingresos'}
          </button>
        ))}
      </div>

      {categories.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={tab === 'expense' ? '📂' : '💰'}
          title='Sin categorías'
          description='Agrega tu primera categoría personalizada'
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {filtered.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={openEdit}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openCreate} label='Nueva categoría' />

      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
      >
        <CategoryForm
          userId={user!.id}
          initial={
            editing
              ? {
                  name: editing.name,
                  type: editing.type as 'income' | 'expense',
                  icon: editing.icon ?? '📂',
                  color: editing.color ?? '#16A34A',
                }
              : undefined
          }
          onSubmit={(payload) => {
            if (editing) {
              update.mutate(
                { id: editing.id, payload },
                { onSuccess: closeSheet }
              )
            } else {
              create.mutate(payload, { onSuccess: closeSheet })
            }
          }}
          loading={create.isPending || update.isPending}
        />
      </BottomSheet>
    </div>
  )
}

export const Route = createFileRoute('/_app/categories')({
  component: CategoriesPage,
})
