import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { EmojiPicker } from './emoji-picker'

type CategoryInsert = Database['public']['Tables']['categories']['Insert']

type InitialValues = {
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
}

type Props = {
  userId: string
  initial?: InitialValues
  onSubmit: (payload: CategoryInsert) => void
  loading?: boolean
}

const COLORS = [
  '#16A34A',
  '#0284C7',
  '#DC2626',
  '#D97706',
  '#7C3AED',
  '#EC4899',
  '#9333EA',
  '#14B8A6',
  '#F59E0B',
  '#6B7280',
]

const DEFAULT_EMOJI = '💰'

export const CategoryForm = ({ userId, initial, onSubmit, loading }: Props) => {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<'income' | 'expense'>(
    initial?.type ?? 'expense'
  )
  const [icon, setIcon] = useState(initial?.icon ?? DEFAULT_EMOJI)
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
  const [showPicker, setShowPicker] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ user_id: userId, name, type, icon, color })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Nombre'
        placeholder='Ej: Transporte personal'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Select
        label='Tipo'
        value={type}
        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
      >
        <option value='expense'>Gasto</option>
        <option value='income'>Ingreso</option>
      </Select>

      {/* Emoji selector */}
      <div>
        <p className='mb-2 text-sm font-medium text-foreground'>Icono</p>
        <button
          type='button'
          onClick={() => setShowPicker((v) => !v)}
          className='flex w-full items-center gap-3 rounded-xl border border-border px-4 py-2.5 text-left transition-colors hover:bg-[#F9FAFB]'
        >
          <span className='text-2xl'>{icon}</span>
          <span className='flex-1 text-sm text-muted'>
            {showPicker ? 'Cerrar selector' : 'Cambiar emoji'}
          </span>
          <span className='text-soft text-xs'>{showPicker ? '▲' : '▼'}</span>
        </button>
        {showPicker && (
          <div className='mt-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-3'>
            <EmojiPicker
              value={icon}
              onChange={(e) => {
                setIcon(e)
                setShowPicker(false)
              }}
            />
          </div>
        )}
      </div>

      {/* Color picker */}
      <div>
        <p className='mb-2 text-sm font-medium text-foreground'>Color</p>
        <div className='flex flex-wrap gap-2'>
          {COLORS.map((c) => (
            <button
              key={c}
              type='button'
              onClick={() => setColor(c)}
              className='h-8 w-8 rounded-full border-2 transition-all'
              style={{
                background: c,
                borderColor: color === c ? '#111827' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className='flex items-center gap-3 rounded-xl bg-[#F9FAFB] px-4 py-3'>
        <div
          className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl'
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        <div>
          <p className='text-sm font-semibold text-foreground'>
            {name || 'Nombre categoría'}
          </p>
          <p className='text-xs text-muted'>
            {type === 'income' ? 'Ingreso' : 'Gasto'}
          </p>
        </div>
      </div>

      <Button type='submit' fullWidth loading={loading} size='lg'>
        {initial ? 'Guardar cambios' : 'Crear categoría'}
      </Button>
    </form>
  )
}
