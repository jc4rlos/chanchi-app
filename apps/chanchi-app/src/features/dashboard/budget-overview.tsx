import type { BudgetWithSpent } from '@/types/finance'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'

type Props = { budgets: BudgetWithSpent[] }

export const BudgetOverview = ({ budgets }: Props) => {
  const exceeded = budgets.filter((b) => b.spent > b.amount).length

  return (
    <Card
      title='Presupuestos'
      titleRight={
        exceeded > 0 ? (
          <Badge variant='danger'>
            {exceeded} excedido{exceeded > 1 ? 's' : ''}
          </Badge>
        ) : (
          <Badge variant='success'>Todo OK</Badge>
        )
      }
    >
      <div className='flex flex-col gap-3'>
        {budgets.slice(0, 4).map((b) => {
          return (
            <div key={b.id}>
              <div className='mb-1.5 flex items-center justify-between text-xs'>
                <span className='font-medium text-foreground'>
                  {b.categories.icon} {b.categories.name}
                </span>
                <span className='font-mono text-muted'>
                  {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                </span>
              </div>
              <ProgressBar value={b.spent} max={b.amount} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
