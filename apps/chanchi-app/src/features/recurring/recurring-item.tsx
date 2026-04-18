import type { RecurringTransaction } from '@/types/finance'
import { Trash2 } from 'lucide-react'
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
  onDelete?: (id: string) => void
}

export const RecurringItem = ({ item, onDelete }: Props) => (
  <div className='rounded-[14px] border border-border bg-card p-4 shadow-card'>
    <div className='mb-2 flex items-start justify-between'>
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
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className='text-soft hover:text-danger p-0.5'
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
    <div className='mt-1 flex items-center justify-between'>
      <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
        {item.type === 'income' ? 'Ingreso' : 'Gasto'}
      </Badge>
      <p className='text-soft text-xs'>Próximo: {formatDate(item.next_date)}</p>
    </div>
  </div>
)
