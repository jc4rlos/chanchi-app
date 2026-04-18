import { cn } from '@/lib/utils'
import { AmountText } from './amount-text'

type KpiVariant = 'income' | 'expense' | 'balance' | 'saving'

type KpiCardProps =
  | {
      label: string
      sub?: string
      variant: 'income' | 'expense' | 'balance'
      amount: number
      currency?: string
    }
  | {
      label: string
      sub?: string
      variant: 'saving'
      value: string
    }

const variantStyles: Record<KpiVariant, { accent: string; value: string }> = {
  income: { accent: 'bg-primary', value: 'text-primary' },
  expense: { accent: 'bg-danger', value: 'text-danger' },
  balance: { accent: 'bg-blue', value: 'text-blue' },
  saving: { accent: 'bg-purple', value: 'text-purple' },
}

export const KpiCard = (props: KpiCardProps) => {
  const styles = variantStyles[props.variant]

  return (
    <div className='relative overflow-hidden rounded-[14px] border border-border bg-card p-4 shadow-card'>
      <div
        className={cn(
          'absolute top-0 left-0 h-full w-[3px] rounded-l-[14px]',
          styles.accent
        )}
      />
      <div className='mb-1.5 pl-1 text-[11px] font-semibold tracking-widest text-muted uppercase'>
        {props.label}
      </div>
      <div className='pl-1'>
        {props.variant === 'saving' ? (
          <div
            className={cn(
              'font-mono text-[22px] leading-none font-semibold',
              styles.value
            )}
          >
            {props.value}
          </div>
        ) : (
          <AmountText
            amount={props.amount}
            currency={props.currency}
            type={
              props.variant === 'income'
                ? 'income'
                : props.variant === 'expense'
                  ? 'expense'
                  : 'neutral'
            }
            size='xl'
            className={cn(
              'text-[22px] leading-none',
              props.variant === 'balance' && props.amount >= 0 && 'text-blue'
            )}
          />
        )}
      </div>
      {props.sub && (
        <div className='text-soft mt-1.5 pl-1 text-[11px]'>{props.sub}</div>
      )}
    </div>
  )
}
