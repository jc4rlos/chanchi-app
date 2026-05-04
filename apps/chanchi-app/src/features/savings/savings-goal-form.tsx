import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type GoalInsert = Database['public']['Tables']['savings_goals']['Insert']

const GOAL_ICONS = ['🎯', '✈️', '🏖️', '🏠', '💻', '🚗', '📚', '❤️', '🎓', '🚨']
const GOAL_COLORS = [
  '#16A34A',
  '#0284C7',
  '#7C3AED',
  '#D97706',
  '#DC2626',
  '#9333EA',
]

type Props = {
  userId: string
  onSubmit: (payload: GoalInsert) => void
  loading?: boolean
}

export const SavingsGoalForm = ({ userId, onSubmit, loading }: Props) => {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [saved, setSaved] = useState('0')
  const [targetDate, setTargetDate] = useState('')
  const [icon, setIcon] = useState(GOAL_ICONS[0])
  const [color, setColor] = useState(GOAL_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      name,
      target_amount: parseFloat(target),
      saved_amount: parseFloat(saved),
      target_date: targetDate || null,
      icon,
      color,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Nombre de la meta'
        placeholder='Ej: Vacaciones Cusco'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label='Monto objetivo'
        type='number'
        step='0.01'
        min='0.01'
        placeholder='0.00'
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        required
      />
      <Input
        label='Ya tengo ahorrado'
        type='number'
        step='0.01'
        min='0'
        placeholder='0.00'
        value={saved}
        onChange={(e) => setSaved(e.target.value)}
      />
      <Input
        label='Fecha objetivo (opcional)'
        type='date'
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
      />
      <div>
        <p className='mb-2 text-sm font-medium text-foreground'>Ícono</p>
        <div className='flex flex-wrap gap-2'>
          {GOAL_ICONS.map((i) => (
            <button
              key={i}
              type='button'
              onClick={() => setIcon(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${icon === i ? 'bg-primary-light ring-2 ring-primary' : 'bg-border'}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className='mb-2 text-sm font-medium text-foreground'>Color</p>
        <div className='flex gap-2'>
          {GOAL_COLORS.map((c) => (
            <button
              key={c}
              type='button'
              onClick={() => setColor(c)}
              className='h-8 w-8 rounded-full border-2 transition-all'
              style={{
                background: c,
                borderColor: color === c ? 'var(--color-foreground)' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Crear meta
      </Button>
    </form>
  )
}
