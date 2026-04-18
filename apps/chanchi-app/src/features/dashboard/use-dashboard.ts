import { useQuery } from '@tanstack/react-query'
import { accountsService } from '@/services/accounts'
import { budgetsService } from '@/services/budgets'
import { investmentsService } from '@/services/investments'
import { savingsGoalsService } from '@/services/savings-goals'
import { transactionsService } from '@/services/transactions'
import { currentMonthStart } from '@/lib/utils'

export const useDashboard = (userId: string) => {
  const month = currentMonthStart()

  const summary = useQuery({
    queryKey: ['dashboard-summary', userId, month],
    queryFn: () => transactionsService.monthlySummary(userId, month),
  })

  const recentTx = useQuery({
    queryKey: ['recent-transactions', userId],
    queryFn: () => transactionsService.findByUser(userId, {}, 8),
  })

  const expenseByCategory = useQuery({
    queryKey: ['expense-by-category', userId, month],
    queryFn: () => transactionsService.expensesByCategory(userId, month),
  })

  const trend = useQuery({
    queryKey: ['monthly-trend', userId],
    queryFn: () => transactionsService.monthlyTrend(userId, 6),
  })

  const accounts = useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountsService.findByUser(userId),
  })

  const budgets = useQuery({
    queryKey: ['budgets', userId, month],
    queryFn: () => budgetsService.findByMonth(userId, month),
  })

  const goals = useQuery({
    queryKey: ['savings-goals', userId],
    queryFn: () => savingsGoalsService.findByUser(userId),
  })

  const investments = useQuery({
    queryKey: ['investments', userId],
    queryFn: () => investmentsService.findByUser(userId),
  })

  return {
    summary,
    recentTx,
    expenseByCategory,
    trend,
    accounts,
    budgets,
    goals,
    investments,
  }
}
