import type { Category } from '@/types/finance'
import { Pencil, Trash2 } from 'lucide-react'

type Props = {
  category: Category
  onEdit?: (category: Category) => void
  onDelete?: (id: string) => void
}

const TYPE_LABEL = { income: 'Ingreso', expense: 'Gasto' } as const

export const CategoryCard = ({ category, onEdit, onDelete }: Props) => {
  const isGlobal = category.user_id === null

  return (
    <div className='flex items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-3 shadow-card'>
      <div
        className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl'
        style={{
          background: category.color ? `${category.color}20` : '#F3F4F6',
        }}
      >
        {category.icon ?? '📂'}
      </div>

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-foreground'>
          {category.name}
        </p>
        <div className='mt-0.5 flex items-center gap-1.5'>
          <span
            className='rounded-full px-1.5 py-0.5 text-[10px] font-medium'
            style={{
              background: category.type === 'income' ? '#DCFCE7' : '#FEE2E2',
              color: category.type === 'income' ? '#16A34A' : '#DC2626',
            }}
          >
            {TYPE_LABEL[category.type as keyof typeof TYPE_LABEL]}
          </span>
          {isGlobal && (
            <span className='rounded-full bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-medium text-muted'>
              Global
            </span>
          )}
        </div>
      </div>

      {!isGlobal && (
        <div className='flex flex-shrink-0 items-center gap-1'>
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className='text-soft hover:bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:text-primary'
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(category.id)}
              className='text-soft hover:text-danger hover:bg-danger-light flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
