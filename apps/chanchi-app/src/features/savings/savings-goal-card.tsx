import { useState } from 'react'
import type { SavingsGoal } from '@/types/finance'
import { Trash2, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProgressBar } from '@/components/ui/progress-bar'

type Props = {
  goal: SavingsGoal
  onDelete?: (id: string) => void
  onAddAmount?: (id: string, amount: number) => void
}

export const SavingsGoalCard = ({ goal, onDelete, onAddAmount }: Props) => {
  const [addingAmount, setAddingAmount] = useState(false)
  const [amount, setAmount] = useState('')
  const pct = Math.round((goal.saved_amount / goal.target_amount) * 100)

  const handleAdd = () => {
    const val = parseFloat(amount)
    if (isNaN(val) || val <= 0) return
    onAddAmount?.(goal.id, val)
    setAmount('')
    setAddingAmount(false)
  }

  return (
    <div className='rounded-[14px] border border-border bg-card p-4 shadow-card'>
      <div className='mb-3 flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl'
            style={{ background: goal.color ? `${goal.color}20` : '#DCFCE7' }}
          >
            {goal.icon ?? '🎯'}
          </div>
          <div>
            <p className='font-semibold text-foreground'>{goal.name}</p>
            {goal.target_date && (
              <p className='text-xs text-muted'>
                Meta: {formatDate(goal.target_date)}
              </p>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant={goal.status === 'completed' ? 'success' : 'neutral'}>
            {goal.status === 'completed' ? 'Completado' : `${pct}%`}
          </Badge>
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className='text-soft hover:text-danger p-0.5'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <ProgressBar value={goal.saved_amount} max={goal.target_amount} />

      <div className='mt-2 mb-3 flex justify-between font-mono text-xs text-muted'>
        <span>{formatCurrency(goal.saved_amount, goal.currency)}</span>
        <span>{formatCurrency(goal.target_amount, goal.currency)}</span>
      </div>

      {goal.status === 'active' &&
        onAddAmount &&
        (addingAmount ? (
          <div className='flex gap-2'>
            <Input
              placeholder='Monto a agregar'
              type='number'
              step='0.01'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='h-10 text-sm'
            />
            <Button size='sm' onClick={handleAdd}>
              OK
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => setAddingAmount(false)}
            >
              ✕
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setAddingAmount(true)}
            className='flex items-center gap-1 text-xs font-medium text-primary'
          >
            <Plus size={14} /> Agregar ahorro
          </button>
        ))}
    </div>
  )
}
