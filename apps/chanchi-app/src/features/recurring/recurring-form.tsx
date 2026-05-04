import { useState } from 'react'
import type { Account, Category } from '@/types/finance'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type RecurringInsert =
  Database['public']['Tables']['recurring_transactions']['Insert']

type Props = {
  userId: string
  accounts: Account[]
  categories: Category[]
  onSubmit: (payload: RecurringInsert) => void
  loading?: boolean
}

const INTERVALS = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
]

export const RecurringForm = ({
  userId,
  accounts,
  categories,
  onSubmit,
  loading,
}: Props) => {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [categoryId, setCategoryId] = useState('')
  const [interval, setInterval] =
    useState<RecurringInsert['interval']>('monthly')
  const [nextDate, setNextDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      type,
      description,
      amount: parseFloat(amount),
      account_id: accountId,
      category_id: categoryId || null,
      interval,
      next_date: nextDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex gap-2'>
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setType(t)}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${type === t ? (t === 'income' ? 'bg-primary text-white' : 'bg-danger text-white') : 'bg-border text-muted'}`}
          >
            {t === 'income' ? '💰 Ingreso' : '💸 Gasto'}
          </button>
        ))}
      </div>
      <Input
        label='Descripción'
        placeholder='Ej: Netflix, Sueldo...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
      <Select
        label='Cuenta'
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </Select>
      <Select
        label='Categoría (opcional)'
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder='Sin categoría'
      >
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </Select>
      <Select
        label='Frecuencia'
        value={interval}
        onChange={(e) =>
          setInterval(e.target.value as RecurringInsert['interval'])
        }
      >
        {INTERVALS.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </Select>
      <Input
        label='Próxima fecha'
        type='date'
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
        required
      />
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Guardar recurrente
      </Button>
    </form>
  )
}
