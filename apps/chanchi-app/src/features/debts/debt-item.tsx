import type { Debt } from '@/types/finance'
import { Check, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AmountText } from '@/components/ui/amount-text'
import { Badge } from '@/components/ui/badge'

type Props = {
  debt: Debt
  onMarkPaid?: (id: string) => void
  onDelete?: (id: string) => void
}

export const DebtItem = ({ debt, onMarkPaid, onDelete }: Props) => {
  const isIOwe = debt.direction === 'i_owe'
  const isOverdue =
    !debt.is_paid && debt.due_date && new Date(debt.due_date) < new Date()

  return (
    <div
      className={`rounded-[14px] border bg-card p-4 shadow-card ${debt.is_paid ? 'border-[#F3F4F6] opacity-60' : 'border-border'}`}
    >
      <div className='mb-2 flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>{isIOwe ? '😬' : '🤝'}</span>
          <div>
            <p className='font-semibold text-foreground'>{debt.counterpart}</p>
            <p className='text-xs text-muted'>
              {isIOwe ? 'Yo debo' : 'Me deben'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-1.5'>
          {debt.is_paid ? (
            <Badge variant='success'>Pagado</Badge>
          ) : isOverdue ? (
            <Badge variant='danger'>Vencido</Badge>
          ) : (
            <Badge variant='neutral'>Pendiente</Badge>
          )}
        </div>
      </div>

      <AmountText amount={debt.amount} currency={debt.currency} size='lg' />

      {debt.description && (
        <p className='mt-1 text-xs text-muted'>{debt.description}</p>
      )}
      {debt.due_date && (
        <p className='text-soft mt-1 text-xs'>
          Vence: {formatDate(debt.due_date)}
        </p>
      )}

      {!debt.is_paid && (
        <div className='mt-3 flex gap-2'>
          {onMarkPaid && (
            <button
              onClick={() => onMarkPaid(debt.id)}
              className='flex items-center gap-1 text-xs font-medium text-primary'
            >
              <Check size={13} /> Marcar pagado
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(debt.id)}
              className='text-soft hover:text-danger ml-auto p-0.5'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
