import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LayoutList,
  ShieldCheck,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  LayoutList,
  Users,
  UtensilsCrossed,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
}

export const resolveIcon = (name: string | null): LucideIcon | undefined =>
  name ? ICON_MAP[name] : undefined
