import { useState } from 'react'
import type { Account, Category } from '@/types/finance'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

type TxInsert = Database['public']['Tables']['transactions']['Insert']
type TxType = 'income' | 'expense' | 'transfer'

type Props = {
  userId: string
  accounts: Account[]
  categories: Category[]
  onSubmit: (payload: TxInsert) => void
  loading?: boolean
}

const TYPE_LABELS: Record<TxType, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  transfer: 'Transferencia',
}

export const TransactionForm = ({
  userId,
  accounts,
  categories,
  onSubmit,
  loading,
}: Props) => {
  const [type, setType] = useState<TxType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [destAccountId, setDestAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const filteredCategories = categories.filter((c) =>
    type === 'income' ? c.type === 'income' : c.type === 'expense'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      user_id: userId,
      type,
      amount: parseFloat(amount),
      description: description || null,
      account_id: accountId,
      destination_account_id:
        type === 'transfer' ? destAccountId || null : null,
      category_id: type !== 'transfer' ? categoryId || null : null,
      date,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex gap-2'>
        {(['expense', 'income', 'transfer'] as TxType[]).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setType(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${
              type === t
                ? t === 'income'
                  ? 'bg-primary text-white'
                  : t === 'expense'
                    ? 'bg-danger text-white'
                    : 'bg-blue text-white'
                : 'bg-[#F3F4F6] text-muted'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <Input
        label='Monto'
        type='number'
        placeholder='0.00'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step='0.01'
        min='0.01'
        required
      />

      <Input
        label='Descripción'
        placeholder='Ej: Supermercado, Netflix...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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

      {type === 'transfer' && (
        <Select
          label='Cuenta destino'
          value={destAccountId}
          onChange={(e) => setDestAccountId(e.target.value)}
          placeholder='Seleccionar cuenta'
        >
          {accounts
            .filter((a) => a.id !== accountId)
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </Select>
      )}

      {type !== 'transfer' && (
        <Select
          label='Categoría'
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
      )}

      <Input
        label='Fecha'
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Button type='submit' fullWidth loading={loading} size='lg'>
        Guardar
      </Button>
    </form>
  )
}
