import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DebtInsert = Database['public']['Tables']['debts']['Insert']

type Props = {
  userId: string
  onSubmit: (payload: DebtInsert) => void
  loading?: boolean
}

export const DebtForm = ({ userId, onSubmit, loading }: Props) => {
  const [counterpart, setCounterpart] = useState('')
  const [direction, setDirection] = useState<'i_owe' | 'they_owe_me'>('i_owe')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      counterpart,
      direction,
      amount: parseFloat(amount),
      description: description || null,
      due_date: dueDate || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex gap-2'>
        {(['i_owe', 'they_owe_me'] as const).map((d) => (
          <button
            key={d}
            type='button'
            onClick={() => setDirection(d)}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
              direction === d
                ? 'bg-primary text-white'
                : 'bg-border text-muted'
            }`}
          >
            {d === 'i_owe' ? '😬 Yo debo' : '🤝 Me deben'}
          </button>
        ))}
      </div>
      <Input
        label='Persona o entidad'
        placeholder='Ej: Carlos Ríos'
        value={counterpart}
        onChange={(e) => setCounterpart(e.target.value)}
        required
      />
      <Input
        label='Monto'
        type='number'
        step='0.01'
        min='0.01'
        placeholder='0.00'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label='Descripción (opcional)'
        placeholder='Ej: Préstamo para emergencia'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        label='Fecha de vencimiento (opcional)'
        type='date'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Guardar deuda
      </Button>
    </form>
  )
}
