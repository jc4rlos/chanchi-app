import { investmentsService } from '@/services/investments'
import type { Investment } from '@/types/finance'
import { formatCurrency, calcGainPct } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

type Props = { investments: Investment[] }

export const PortfolioPreview = ({ investments }: Props) => {
  const { totalInvested, currentValue, gain, gainPct } =
    investmentsService.portfolioSummary(investments)

  return (
    <Card
      title='Portafolio'
      titleRight={
        <Badge variant={gainPct >= 0 ? 'success' : 'danger'}>
          {gainPct >= 0 ? '+' : ''}
          {gainPct.toFixed(1)}%
        </Badge>
      }
    >
      <div className='mb-3 flex justify-between border-b border-border pb-3 text-xs'>
        <div>
          <p className='mb-0.5 text-muted'>Invertido</p>
          <p className='font-mono font-semibold'>
            {formatCurrency(totalInvested)}
          </p>
        </div>
        <div className='text-center'>
          <p className='mb-0.5 text-muted'>Valor actual</p>
          <p className='font-mono font-semibold text-primary'>
            {formatCurrency(currentValue)}
          </p>
        </div>
        <div className='text-right'>
          <p className='mb-0.5 text-muted'>Ganancia</p>
          <p
            className={`font-mono font-semibold ${gain >= 0 ? 'text-primary' : 'text-danger'}`}
          >
            {gain >= 0 ? '+' : ''}
            {formatCurrency(gain)}
          </p>
        </div>
      </div>
      <div className='flex flex-col divide-y divide-[#F9FAFB]'>
        {investments.slice(0, 3).map((inv) => {
          const g = calcGainPct(inv.total_invested, inv.current_value)
          return (
            <div
              key={inv.id}
              className='flex items-center justify-between py-2 first:pt-0 last:pb-0'
            >
              <div>
                <p className='text-sm font-medium text-foreground'>
                  {inv.name}
                </p>
                <p className='text-soft font-mono text-[11px]'>
                  {inv.ticker && `${inv.ticker} · `}
                  {inv.asset_type}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-mono text-sm font-semibold'>
                  {formatCurrency(inv.current_value, inv.currency)}
                </p>
                <p
                  className={`text-[11px] ${g >= 0 ? 'text-primary' : 'text-danger'}`}
                >
                  {g >= 0 ? '+' : ''}
                  {g.toFixed(1)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
