import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'

type CategoryExpense = {
  category_id: string
  total: number
  name: string
  icon: string | null
  color: string | null
}

const COLORS = [
  '#DC2626',
  '#D97706',
  '#0284C7',
  '#7C3AED',
  '#9333EA',
  '#16A34A',
  '#EC4899',
]

type Props = { data: CategoryExpense[]; totalExpenses: number }

export const ExpenseDonut = ({ data, totalExpenses }: Props) => {
  const top5 = data.slice(0, 5)

  return (
    <Card title='Gastos por categoría'>
      <div className='flex items-center gap-3'>
        <div className='h-20 w-20 flex-shrink-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={top5}
                dataKey='total'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={24}
                outerRadius={36}
                strokeWidth={0}
              >
                {top5.map((entry, i) => (
                  <Cell
                    key={entry.category_id}
                    fill={entry.color ?? COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                }}
                formatter={(v) => formatCurrency(Number(v))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex flex-1 flex-col gap-1.5'>
          {top5.map((entry, i) => {
            const pct =
              totalExpenses > 0
                ? Math.round((entry.total / totalExpenses) * 100)
                : 0
            return (
              <div
                key={entry.category_id}
                className='flex items-center justify-between text-xs'
              >
                <div className='flex items-center gap-1.5 text-foreground'>
                  <span
                    className='inline-block h-2 w-2 flex-shrink-0 rounded-sm'
                    style={{
                      background: entry.color ?? COLORS[i % COLORS.length],
                    }}
                  />
                  {entry.icon} {entry.name}
                </div>
                <span className='font-mono font-semibold text-muted'>
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
