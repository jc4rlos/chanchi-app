import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type AccountInsert = Database['public']['Tables']['accounts']['Insert']

type Props = {
  userId: string
  onSubmit: (payload: AccountInsert) => void
  loading?: boolean
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: '🏦 Cuenta corriente' },
  { value: 'savings', label: '💰 Ahorros' },
  { value: 'cash', label: '💵 Efectivo' },
  { value: 'credit_card', label: '💳 Tarjeta de crédito' },
  { value: 'investment', label: '📈 Inversión' },
]

const COLORS = [
  '#0070C0',
  '#16A34A',
  '#F59E0B',
  '#DC2626',
  '#7C3AED',
  '#0284C7',
]

export const AccountForm = ({ userId, onSubmit, loading }: Props) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountInsert['type']>('checking')
  const [balance, setBalance] = useState('0')
  const [currency, setCurrency] = useState('PEN')
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      name,
      type,
      balance: parseFloat(balance),
      currency,
      color,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Nombre'
        placeholder='Ej: BCP Sueldo'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Select
        label='Tipo'
        value={type}
        onChange={(e) => setType(e.target.value as AccountInsert['type'])}
      >
        {ACCOUNT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>
      <Input
        label='Saldo inicial'
        type='number'
        step='0.01'
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        required
      />
      <Select
        label='Moneda'
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value='PEN'>PEN — Soles</option>
        <option value='USD'>USD — Dólares</option>
        <option value='EUR'>EUR — Euros</option>
      </Select>
      <div>
        <p className='mb-2 text-sm font-medium text-foreground'>Color</p>
        <div className='flex gap-2'>
          {COLORS.map((c) => (
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
        Guardar cuenta
      </Button>
    </form>
  )
}
