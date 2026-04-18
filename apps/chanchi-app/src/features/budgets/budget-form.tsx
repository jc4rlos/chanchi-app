import { useState } from 'react'
import type { Category } from '@/types/finance'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type BudgetInsert = Database['public']['Tables']['budgets']['Insert']

type Props = {
  userId: string
  categories: Category[]
  month: string
  onSubmit: (payload: BudgetInsert) => void
  loading?: boolean
}

export const BudgetForm = ({
  userId,
  categories,
  month,
  onSubmit,
  loading,
}: Props) => {
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [alertPct, setAlertPct] = useState('80')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      category_id: categoryId,
      month,
      amount: parseFloat(amount),
      alert_at_pct: parseInt(alertPct),
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Select
        label='Categoría'
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder='Seleccionar'
        required
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </Select>
      <Input
        label='Monto límite'
        type='number'
        step='0.01'
        min='0.01'
        placeholder='0.00'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label='Alerta al (%)'
        type='number'
        min='1'
        max='100'
        value={alertPct}
        onChange={(e) => setAlertPct(e.target.value)}
      />
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Guardar presupuesto
      </Button>
    </form>
  )
}
