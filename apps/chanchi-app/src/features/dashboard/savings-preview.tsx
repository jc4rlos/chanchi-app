import type { SavingsGoal } from '@/types/finance'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'

type Props = { goals: SavingsGoal[] }

export const SavingsPreview = ({ goals }: Props) => {
  const active = goals.filter((g) => g.status === 'active').slice(0, 3)

  return (
    <Card title='Metas de ahorro'>
      <div className='flex flex-col divide-y divide-[#F9FAFB]'>
        {active.map((g) => {
          const pct = Math.round((g.saved_amount / g.target_amount) * 100)
          return (
            <div
              key={g.id}
              className='flex items-center gap-3 py-2.5 first:pt-0 last:pb-0'
            >
              <div
                className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] text-lg'
                style={{ background: g.color ? `${g.color}20` : '#DCFCE7' }}
              >
                {g.icon ?? '🎯'}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-foreground'>
                  {g.name}
                </p>
                <ProgressBar
                  value={g.saved_amount}
                  max={g.target_amount}
                  height='xs'
                  className='my-1'
                />
                <p className='font-mono text-[11px] text-muted'>
                  {formatCurrency(g.saved_amount)} /{' '}
                  {formatCurrency(g.target_amount)}
                </p>
              </div>
              <span
                className='flex-shrink-0 text-xs font-semibold'
                style={{
                  color:
                    pct >= 100 ? '#16A34A' : pct >= 80 ? '#16A34A' : '#D97706',
                }}
              >
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
