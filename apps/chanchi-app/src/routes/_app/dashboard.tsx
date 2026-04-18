import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { BudgetOverview } from '@/features/dashboard/budget-overview'
import { ExpenseDonut } from '@/features/dashboard/expense-donut'
import { IncomeExpenseChart } from '@/features/dashboard/income-expense-chart'
import { KpiRow } from '@/features/dashboard/kpi-row'
import { PortfolioPreview } from '@/features/dashboard/portfolio-preview'
import { RecentTransactions } from '@/features/dashboard/recent-transactions'
import { SavingsPreview } from '@/features/dashboard/savings-preview'
import { useDashboard } from '@/features/dashboard/use-dashboard'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const {
    summary,
    recentTx,
    expenseByCategory,
    trend,
    budgets,
    goals,
    investments,
  } = useDashboard(user!.id)

  return (
    <div className='flex flex-col gap-4'>
      {summary.data && <KpiRow summary={summary.data} />}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {trend.data && <IncomeExpenseChart data={trend.data} />}
        {expenseByCategory.data && summary.data && (
          <ExpenseDonut
            data={expenseByCategory.data}
            totalExpenses={summary.data.totalExpenses}
          />
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {budgets.data && budgets.data.length > 0 && (
          <BudgetOverview budgets={budgets.data} />
        )}
        {goals.data && goals.data.length > 0 && (
          <SavingsPreview goals={goals.data} />
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {investments.data && investments.data.length > 0 && (
          <PortfolioPreview investments={investments.data} />
        )}
        {recentTx.data && recentTx.data.length > 0 && (
          <RecentTransactions transactions={recentTx.data} />
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})
