import type { Account } from '@/types/finance'
import { Trash2 } from 'lucide-react'
import { AmountText } from '@/components/ui/amount-text'

const ACCOUNT_TYPE_LABELS: Record<Account['type'], string> = {
  checking: 'Cuenta corriente',
  savings: 'Ahorros',
  cash: 'Efectivo',
  credit_card: 'Tarjeta de crédito',
  investment: 'Inversión',
}

const ACCOUNT_TYPE_EMOJI: Record<Account['type'], string> = {
  checking: '🏦',
  savings: '💰',
  cash: '💵',
  credit_card: '💳',
  investment: '📈',
}

type Props = {
  account: Account
  onDelete?: (id: string) => void
}

export const AccountCard = ({ account, onDelete }: Props) => (
  <div className='rounded-[14px] border border-border bg-card p-4 shadow-card'>
    <div className='mb-3 flex items-start justify-between'>
      <div className='flex items-center gap-3'>
        <div
          className='flex h-10 w-10 items-center justify-center rounded-xl text-xl'
          style={{
            background: account.color ? `${account.color}20` : 'var(--color-border)',
          }}
        >
          {ACCOUNT_TYPE_EMOJI[account.type]}
        </div>
        <div>
          <p className='font-semibold text-foreground'>{account.name}</p>
          <p className='text-xs text-muted'>
            {ACCOUNT_TYPE_LABELS[account.type]}
          </p>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(account.id)}
          className='text-soft hover:text-danger p-1 transition-colors'
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
    <AmountText
      amount={account.balance}
      currency={account.currency}
      type={account.balance >= 0 ? 'neutral' : 'expense'}
      size='xl'
    />
    <p className='mt-1 text-xs text-muted'>{account.currency}</p>
  </div>
)
