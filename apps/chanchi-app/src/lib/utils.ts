import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatCurrency = (amount: number, currency = 'PEN'): string =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(
    new Date(date)
  )

export const formatMonth = (date: string): string =>
  new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(
    new Date(date)
  )

export const currentMonthStart = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export const calcGainPct = (invested: number, current: number): number => {
  if (invested === 0) return 0
  return ((current - invested) / invested) * 100
}
