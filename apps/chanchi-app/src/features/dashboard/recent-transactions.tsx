import { Link } from '@tanstack/react-router'
import type { TransactionWithCategory } from '@/types/finance'
import { formatDate } from '@/lib/utils'
import { AmountText } from '@/components/ui/amount-text'
import { Card } from '@/components/ui/card'

type Props = { transactions: TransactionWithCategory[] }

const TransactionRow = ({ tx }: { tx: TransactionWithCategory }) => (
  <div className='flex items-center justify-between border-b border-[#F9FAFB] py-2.5 last:border-0'>
    <div className='flex items-center gap-2.5'>
      <div
        className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm'
        style={{
          background:
            tx.type === 'income'
              ? '#DCFCE7'
              : tx.type === 'transfer'
                ? '#E0F2FE'
                : '#FEE2E2',
        }}
      >
        {tx.categories?.icon ??
          (tx.type === 'income' ? '💰' : tx.type === 'transfer' ? '↔️' : '💸')}
      </div>
      <div>
        <p className='text-sm leading-tight font-medium text-foreground'>
          {tx.description ?? tx.categories?.name ?? 'Sin descripción'}
        </p>
        <p className='text-soft text-[11px]'>{formatDate(tx.date)}</p>
      </div>
    </div>
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
  </div>
)

export const RecentTransactions = ({ transactions }: Props) => (
  <Card
    title='Últimos movimientos'
    titleRight={
      <Link to='/transactions' className='text-[11px] font-medium text-primary'>
        Ver todos
      </Link>
    }
  >
    <div className='-mx-0'>
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} />
      ))}
    </div>
  </Card>
)
