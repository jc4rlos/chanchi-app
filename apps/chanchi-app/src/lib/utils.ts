import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatCurrency = (amount: number, currency = 'PEN'): string =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)

/**
 * `new Date("yyyy-mm-dd")` es medianoche UTC; al formatear en zona local (p. ej. es-PE)
 * puede mostrarse el día anterior. Las fechas calendario puras se interpretan en hora local.
 */
function dateFromString(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  }
  return new Date(value)
}

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(
    dateFromString(date)
  )

export const formatMonth = (date: string): string =>
  new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(
    dateFromString(date)
  )

export const currentMonthStart = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export const calcGainPct = (invested: number, current: number): number => {
  if (invested === 0) return 0
  return ((current - invested) / invested) * 100
}
