import type { TransactionWithCategory } from '@/types/finance'
import { Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { AmountText } from '@/components/ui/amount-text'

type Props = {
  tx: TransactionWithCategory
  onDelete?: (id: string) => void
}

const BG_BY_TYPE = {
  income: '#DCFCE7',
  expense: '#FEE2E2',
  transfer: '#E0F2FE',
}

export const TransactionItem = ({ tx, onDelete }: Props) => (
  <div className='flex items-center gap-3 border-b border-[#F9FAFB] bg-card px-4 py-3 last:border-0'>
    <div
      className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base'
      style={{ background: BG_BY_TYPE[tx.type] }}
    >
      {tx.categories?.icon ??
        (tx.type === 'income' ? '💰' : tx.type === 'transfer' ? '↔️' : '💸')}
    </div>
    <div className='min-w-0 flex-1'>
      <p className='truncate text-sm font-medium text-foreground'>
        {tx.description ?? tx.categories?.name ?? 'Sin descripción'}
      </p>
      <p className='text-soft text-[11px]'>
        {tx.categories?.name && `${tx.categories.name} · `}
        {formatDate(tx.date)}
      </p>
    </div>
    <div className='flex items-center gap-2'>
      <AmountText
        amount={tx.amount}
        type={
          tx.type === 'income'
            ? 'income'
            : tx.type === 'expense'
              ? 'expense'
              : 'neutral'
        }
        showSign
      />
      {onDelete && (
        <button
          onClick={() => onDelete(tx.id)}
          className='text-soft hover:text-danger p-1 transition-colors'
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  </div>
)
