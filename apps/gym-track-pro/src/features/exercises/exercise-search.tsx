import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const ExerciseSearch = ({ value, onChange, placeholder = 'Buscar ejercicio...' }: Props) => (
  <div className='relative px-5 py-2.5'>
    <Search
      size={16}
      className='absolute left-7.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none' />
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='w-full rounded-[12px] bg-card border border-border px-10.5 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary' />
  </div>
)
