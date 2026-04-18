import type { DashboardSummary } from '@/types/finance'
import { formatCurrency } from '@/lib/utils'
import { KpiCard } from '@/components/ui/kpi-card'

type KpiRowProps = { summary: DashboardSummary }

export const KpiRow = ({ summary }: KpiRowProps) => (
  <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
    <KpiCard
      label='Ingresos'
      value={formatCurrency(summary.totalIncome)}
      sub='este mes'
      variant='income'
    />
    <KpiCard
      label='Gastos'
      value={formatCurrency(summary.totalExpenses)}
      sub={`${Math.round((summary.totalExpenses / (summary.totalIncome || 1)) * 100)}% del ingreso`}
      variant='expense'
    />
    <KpiCard
      label='Balance'
      value={formatCurrency(summary.netBalance)}
      sub='después de gastos'
      variant='balance'
    />
    <KpiCard
      label='Tasa ahorro'
      value={`${summary.savingsRate.toFixed(1)}%`}
      sub='meta: 30%'
      variant='saving'
    />
  </div>
)
