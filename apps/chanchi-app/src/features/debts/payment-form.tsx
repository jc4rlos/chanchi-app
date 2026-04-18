import { useState } from 'react'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PaymentInsert = Database['public']['Tables']['debt_payments']['Insert']

type Props = {
  debtId: string
  maxAmount?: number
  onSubmit: (payload: PaymentInsert) => void
  loading?: boolean
}

const today = () => new Date().toISOString().split('T')[0]

export const PaymentForm = ({
  debtId,
  maxAmount,
  onSubmit,
  loading,
}: Props) => {
  const [amount, setAmount] = useState(maxAmount ? String(maxAmount) : '')
  const [note, setNote] = useState('')
  const [paidAt, setPaidAt] = useState(today())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      debt_id: debtId,
      amount: parseFloat(amount),
      note: note || null,
      paid_at: paidAt,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Monto pagado'
        type='number'
        step='0.01'
        min='0.01'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label='Fecha'
        type='date'
        value={paidAt}
        onChange={(e) => setPaidAt(e.target.value)}
        required
      />
      <Input
        label='Nota (opcional)'
        placeholder='Ej: Cuota enero'
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type='submit' fullWidth loading={loading} size='lg'>
        Registrar pago
      </Button>
    </form>
  )
}
