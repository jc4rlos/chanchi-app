import { useUIStore } from '@/stores/ui-store'
import { cn, formatCurrency } from '@/lib/utils'

type AmountTextProps = {
  amount: number
  currency?: string
  type?: 'income' | 'expense' | 'neutral'
  className?: string
  showSign?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClass = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-2xl',
}

export const AmountText = ({
  amount,
  currency = 'PEN',
  type = 'neutral',
  className,
  showSign = false,
  size = 'md',
}: AmountTextProps) => {
  const { amountsVisible } = useUIStore()

  const colorClass =
    type === 'income'
      ? 'text-primary'
      : type === 'expense'
        ? 'text-danger'
        : amount >= 0
          ? 'text-foreground'
          : 'text-danger'

  const prefix = showSign
    ? type === 'income'
      ? '+'
      : type === 'expense'
        ? '-'
        : ''
    : ''

  return (
    <span
      className={cn(
        'font-mono font-semibold tabular-nums',
        sizeClass[size],
        colorClass,
        className
      )}
    >
      {amountsVisible ? (
        <>
          {prefix}
          {formatCurrency(Math.abs(amount), currency)}
        </>
      ) : (
        '••••••'
      )}
    </span>
  )
}
