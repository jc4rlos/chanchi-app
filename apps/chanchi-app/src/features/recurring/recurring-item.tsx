import type { RecurringTransaction } from '@/types/finance'
import { Trash2, PlayCircle, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AmountText } from '@/components/ui/amount-text'
import { Badge } from '@/components/ui/badge'

const INTERVAL_LABELS: Record<RecurringTransaction['interval'], string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  yearly: 'Anual',
}

type Props = {
  item: RecurringTransaction
  onEdit?: (item: RecurringTransaction) => void
  onDelete?: (id: string) => void
  onRegister?: (item: RecurringTransaction) => void
  registering?: boolean
}

export const RecurringItem = ({ item, onEdit, onDelete, onRegister, registering }: Props) => {
  const today = new Date().toISOString().slice(0, 7)
  const isDue = item.next_date <= new Date().toISOString().slice(0, 10)
  const isExecuted = !!item.last_executed_at?.startsWith(today)

  return (
    <div
      className={`rounded-[14px] border bg-card p-4 shadow-card ${isExecuted ? 'opacity-50' : isDue ? 'border-amber' : 'border-border'}`}
    >
      <div className='mb-3 flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-base ${item.type === 'income' ? 'bg-primary-light' : 'bg-danger-light'}`}
          >
            {item.type === 'income' ? '💰' : '💸'}
          </div>
          <div>
            <p className='font-semibold text-foreground'>{item.description}</p>
            <p className='text-xs text-muted'>{INTERVAL_LABELS[item.interval]}</p>
          </div>
        </div>
        <div className='flex items-center gap-1.5'>
          <AmountText
            amount={item.amount}
            type={item.type === 'income' ? 'income' : 'expense'}
            showSign
          />
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className='p-0.5 text-soft hover:text-primary'
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className='p-0.5 text-soft hover:text-danger'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between gap-2'>
        <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
          {item.type === 'income' ? 'Ingreso' : 'Gasto'}
        </Badge>

        <div className='flex items-center gap-2'>
          {item.last_executed_at && (
            <p className='text-soft text-xs'>Último: {formatDate(item.last_executed_at)}</p>
          )}
          <p className='text-soft text-xs'>Próximo: {formatDate(item.next_date)}</p>

          {onRegister && isDue && (
            <button
              onClick={() => onRegister(item)}
              disabled={registering}
              className='flex items-center gap-1 rounded-lg bg-amber px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50'
            >
              <PlayCircle size={12} />
              Ejecutar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
