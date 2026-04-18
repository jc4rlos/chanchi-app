import type { BudgetWithSpent } from '@/types/finance'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'

type Props = {
  budget: BudgetWithSpent
  onDelete?: (id: string) => void
}

export const BudgetItem = ({ budget, onDelete }: Props) => {
  const pct = (budget.spent / budget.amount) * 100
  const status =
    pct >= 100 ? 'danger' : pct >= budget.alert_at_pct ? 'warning' : 'success'
  const statusLabel =
    pct >= 100 ? 'Excedido' : pct >= budget.alert_at_pct ? 'Alerta' : 'OK'

  return (
    <div className='rounded-[14px] border border-border bg-card p-4 shadow-card'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-lg'>{budget.categories.icon}</span>
          <span className='font-medium text-foreground'>
            {budget.categories.name}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant={status}>{statusLabel}</Badge>
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className='text-soft hover:text-danger p-0.5'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <ProgressBar value={budget.spent} max={budget.amount} />
      <div className='mt-2 flex justify-between font-mono text-xs text-muted'>
        <span>{formatCurrency(budget.spent)}</span>
        <span>{formatCurrency(budget.amount)}</span>
      </div>
    </div>
  )
}
