import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'

type MonthData = { month: string; income: number; expenses: number }

const SHORT_MONTHS: Record<string, string> = {
  '01': 'Ene',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dic',
}

type Props = { data: MonthData[] }

export const IncomeExpenseChart = ({ data }: Props) => {
  const chartData = data.map((d) => ({
    name: SHORT_MONTHS[d.month.slice(5, 7)] ?? d.month,
    Ingresos: d.income,
    Gastos: d.expenses,
  }))

  return (
    <Card
      title='Ingresos vs Gastos'
      titleRight={
        <div className='flex gap-3 text-[11px] text-muted'>
          <span className='flex items-center gap-1'>
            <span className='inline-block h-2 w-2 rounded-sm bg-primary' />
            Ingreso
          </span>
          <span className='flex items-center gap-1'>
            <span className='bg-danger inline-block h-2 w-2 rounded-sm' />
            Gasto
          </span>
        </div>
      }
    >
      <ResponsiveContainer width='100%' height={120}>
        <BarChart data={chartData} barGap={3} barSize={10}>
          <XAxis
            dataKey='name'
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid var(--color-border)',
            }}
            formatter={(v) => formatCurrency(Number(v))}
          />
          <Bar dataKey='Ingresos' fill='#16A34A' radius={[4, 4, 0, 0]} />
          <Bar dataKey='Gastos' fill='#DC2626' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
