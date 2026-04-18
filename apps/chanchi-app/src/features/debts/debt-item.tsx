import { useState } from 'react'
import type { DebtWithPayments } from '@/types/finance'
import { Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AmountText } from '@/components/ui/amount-text'
import { Badge } from '@/components/ui/badge'

type Props = {
  debt: DebtWithPayments
  onAddPayment: (debt: DebtWithPayments) => void
  onDelete?: (id: string) => void
}

export const DebtItem = ({ debt, onAddPayment, onDelete }: Props) => {
  const [historyOpen, setHistoryOpen] = useState(false)

  const isIOwe = debt.direction === 'i_owe'
  const isOverdue =
    !debt.is_paid && debt.due_date && new Date(debt.due_date) < new Date()
  const pct = Math.min((debt.paid_amount / debt.amount) * 100, 100)
  const payments = debt.debt_payments
    .slice()
    .sort(
      (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
    )

  return (
    <div
      className={`rounded-[14px] border bg-card p-4 shadow-card ${debt.is_paid ? 'border-[#F3F4F6] opacity-60' : 'border-border'}`}
    >
      {/* Header */}
      <div className='mb-3 flex items-start justify-between'>
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
          {onDelete && (
            <button
              onClick={() => onDelete(debt.id)}
              className='text-soft hover:text-danger p-1 transition-colors'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className='mb-2 flex items-baseline justify-between'>
        <AmountText amount={debt.amount} currency={debt.currency} size='lg' />
        {debt.paid_amount > 0 && !debt.is_paid && (
          <span className='text-xs text-muted'>
            Restante:{' '}
            <span className='font-semibold text-foreground'>
              {debt.currency} {debt.remaining.toFixed(2)}
            </span>
          </span>
        )}
      </div>

      {/* Progress bar */}
      {debt.amount > 0 && (
        <div className='mb-3'>
          <div className='h-1.5 w-full rounded-full bg-[#F3F4F6]'>
            <div
              className='h-full rounded-full bg-primary transition-all duration-500'
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className='mt-1 flex justify-between'>
            <span className='text-[10px] text-muted'>
              Pagado: {debt.currency} {debt.paid_amount.toFixed(2)}
            </span>
            <span className='text-[10px] text-muted'>{Math.round(pct)}%</span>
          </div>
        </div>
      )}

      {debt.description && (
        <p className='mb-2 text-xs text-muted'>{debt.description}</p>
      )}
      {debt.due_date && (
        <p className='text-soft mb-3 text-xs'>
          Vence: {formatDate(debt.due_date)}
        </p>
      )}

      {/* Actions */}
      {!debt.is_paid && (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onAddPayment(debt)}
            className='bg-primary-light flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white'
          >
            <Plus size={12} /> Registrar pago
          </button>
          {payments.length > 0 && (
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className='ml-auto flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground'
            >
              {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
              {historyOpen ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
          )}
        </div>
      )}

      {/* Payment history */}
      {historyOpen && payments.length > 0 && (
        <div className='mt-3 flex flex-col gap-1.5 border-t border-[#F3F4F6] pt-3'>
          {payments.map((p) => (
            <div key={p.id} className='flex items-center justify-between'>
              <div>
                <span className='text-xs text-muted'>
                  {formatDate(p.paid_at)}
                </span>
                {p.note && (
                  <span className='text-soft ml-2 text-xs'>· {p.note}</span>
                )}
              </div>
              <span className='text-xs font-semibold text-primary'>
                + {debt.currency} {Number(p.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Paid: show history directly */}
      {debt.is_paid && payments.length > 0 && (
        <div className='mt-2 flex flex-col gap-1 border-t border-[#F3F4F6] pt-2'>
          {payments.map((p) => (
            <div key={p.id} className='flex items-center justify-between'>
              <span className='text-xs text-muted'>
                {formatDate(p.paid_at)}
                {p.note ? ` · ${p.note}` : ''}
              </span>
              <span className='text-xs text-primary'>
                +{debt.currency} {Number(p.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
