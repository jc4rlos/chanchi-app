import { cn } from '@/lib/utils'

type KpiVariant = 'income' | 'expense' | 'balance' | 'saving'

type KpiCardProps = {
  label: string
  value: string
  sub?: string
  variant: KpiVariant
}

const variantStyles: Record<KpiVariant, { accent: string; value: string }> = {
  income: { accent: 'bg-primary', value: 'text-primary' },
  expense: { accent: 'bg-danger', value: 'text-danger' },
  balance: { accent: 'bg-blue', value: 'text-blue' },
  saving: { accent: 'bg-purple', value: 'text-purple' },
}

export const KpiCard = ({ label, value, sub, variant }: KpiCardProps) => {
  const styles = variantStyles[variant]

  return (
    <div className='relative overflow-hidden rounded-[14px] border border-border bg-card p-4 shadow-card'>
      <div
        className={cn(
          'absolute top-0 left-0 h-full w-[3px] rounded-l-[14px]',
          styles.accent
        )}
      />
      <div className='mb-1.5 pl-1 text-[11px] font-semibold tracking-widest text-muted uppercase'>
        {label}
      </div>
      <div
        className={cn(
          'pl-1 font-mono text-[22px] leading-none font-semibold',
          styles.value
        )}
      >
        {value}
      </div>
      {sub && <div className='text-soft mt-1.5 pl-1 text-[11px]'>{sub}</div>}
    </div>
  )
}
