import type { Investment } from '@/types/finance'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, calcGainPct } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const ASSET_LABELS: Record<Investment['asset_type'], string> = {
  stock: 'Acciones',
  etf: 'ETF',
  crypto: 'Cripto',
  bond: 'Bonos',
  fund: 'Fondo',
  real_estate: 'Inmueble',
  other: 'Otro',
}

type Props = {
  investment: Investment
  onEdit?: (inv: Investment) => void
  onDelete?: (id: string) => void
}

export const InvestmentRow = ({ investment: inv, onEdit, onDelete }: Props) => {
  const gain = inv.current_value - inv.total_invested
  const gainPct = calcGainPct(inv.total_invested, inv.current_value)

  return (
    <div className='rounded-[14px] border border-border bg-card p-4 shadow-card'>
      <div className='mb-2 flex items-start justify-between'>
        <div>
          <p className='font-semibold text-foreground'>{inv.name}</p>
          <p className='text-soft font-mono text-[11px]'>
            {inv.ticker && `${inv.ticker} · `}
            {ASSET_LABELS[inv.asset_type]}
          </p>
        </div>
        <div className='flex items-center gap-1.5'>
          <Badge variant={gainPct >= 0 ? 'success' : 'danger'}>
            {gainPct >= 0 ? '+' : ''}
            {gainPct.toFixed(1)}%
          </Badge>
          {onEdit && (
            <button onClick={() => onEdit(inv)} className='text-soft p-0.5'>
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(inv.id)}
              className='text-soft hover:text-danger p-0.5'
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
      <div className='mt-3 flex justify-between text-xs'>
        <div>
          <p className='text-muted'>Invertido</p>
          <p className='font-mono font-semibold'>
            {formatCurrency(inv.total_invested, inv.currency)}
          </p>
        </div>
        <div className='text-center'>
          <p className='text-muted'>Valor actual</p>
          <p className='font-mono font-semibold text-primary'>
            {formatCurrency(inv.current_value, inv.currency)}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-muted'>Ganancia</p>
          <p
            className={`font-mono font-semibold ${gain >= 0 ? 'text-primary' : 'text-danger'}`}
          >
            {gain >= 0 ? '+' : ''}
            {formatCurrency(gain, inv.currency)}
          </p>
        </div>
      </div>
    </div>
  )
}
