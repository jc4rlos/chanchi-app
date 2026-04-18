import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { investmentsService } from '@/services/investments'
import { useAuthStore } from '@/stores/auth-store'
import { AmountText } from '@/components/ui/amount-text'
import { Badge } from '@/components/ui/badge'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Fab } from '@/components/ui/fab'
import { PageHeader } from '@/components/ui/page-header'
import { InvestmentForm } from '@/features/investments/investment-form'
import { InvestmentRow } from '@/features/investments/investment-row'
import { useInvestments } from '@/features/investments/use-investments'

const InvestmentsPage = () => {
  const { user } = useAuthStore()
  const { investments, create, remove } = useInvestments(user!.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  const summary = investments.data
    ? investmentsService.portfolioSummary(investments.data)
    : null

  return (
    <div>
      <PageHeader title='Inversiones' />

      {summary && (
        <Card className='mb-4'>
          <div className='flex justify-between text-sm'>
            <div>
              <p className='mb-1 text-xs text-muted'>Invertido</p>
              <p className='font-mono font-semibold'>
                <AmountText
                  amount={summary.totalInvested}
                  currency={summary.currency}
                  size='sm'
                />
              </p>
            </div>
            <div className='text-center'>
              <p className='mb-1 text-xs text-muted'>Valor actual</p>
              <p className='font-mono font-semibold text-primary'>
                <AmountText
                  amount={summary.currentValue}
                  currency={summary.currency}
                  size='sm'
                />
              </p>
            </div>
            <div className='text-right'>
              <p className='mb-1 text-xs text-muted'>Ganancia</p>
              <div className='flex items-center justify-end gap-1'>
                <p
                  className={`font-mono font-semibold ${summary.gain >= 0 ? 'text-primary' : 'text-danger'}`}
                >
                  {summary.gain >= 0 ? '+' : ''}
                  <AmountText
                    amount={summary.gain}
                    currency={summary.currency}
                    size='sm'
                  />
                </p>
                <Badge variant={summary.gainPct >= 0 ? 'success' : 'danger'}>
                  {summary.gainPct >= 0 ? '+' : ''}
                  {summary.gainPct.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {investments.isLoading ? (
        <div className='py-8 text-center text-sm text-muted'>Cargando...</div>
      ) : investments.data?.length === 0 ? (
        <EmptyState
          icon='📈'
          title='Sin inversiones'
          description='Registra tus activos y sigue tu portafolio'
        />
      ) : (
        <div className='flex flex-col gap-3'>
          {investments.data?.map((inv) => (
            <InvestmentRow
              key={inv.id}
              investment={inv}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} label='Nueva inversión' />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Nueva inversión'
      >
        <InvestmentForm
          userId={user!.id}
          onSubmit={(p) =>
            create.mutate(p, { onSuccess: () => setSheetOpen(false) })
          }
          loading={create.isPending}
        />
      </BottomSheet>
    </div>
  )
}

export const Route = createFileRoute('/_app/investments')({
  component: InvestmentsPage,
})
