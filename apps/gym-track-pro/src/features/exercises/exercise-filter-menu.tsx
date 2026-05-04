import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterMenuOption = {
  id: string
  label: string
  icon?: string
  count?: number
}

type Props = {
  options: FilterMenuOption[]
  selectedId?: string
  onSelect: (id: string) => void
  variant?: 'pills' | 'tabs'
  showArrows?: boolean
}

export const ExerciseFilterMenu = ({
  options,
  selectedId,
  onSelect,
  variant = 'pills',
  showArrows = true,
}: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <div className='relative px-5 py-2.5'>
      {showArrows && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-background to-transparent'
        >
          <ChevronLeft size={16} className='text-primary' />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className='overflow-x-auto scrollbar-hide flex gap-2'
      >
        <div className='flex gap-2 min-w-max px-2'>
          {options.map(({ id, label, icon, count }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap transition-all rounded-full',
                variant === 'pills'
                  ? selectedId === id
                    ? 'bg-primary text-primary-foreground px-3.5 py-1.5 font-bold text-[12px]'
                    : 'bg-card border border-border text-muted hover:border-primary px-3.5 py-1.5 text-[12px] font-medium'
                  : selectedId === id
                    ? 'border-b-2 border-primary text-primary px-3 py-2 font-bold text-[13px]'
                    : 'border-b-2 border-transparent text-muted hover:text-foreground px-3 py-2 text-[13px] font-medium'
              )}
            >
              {icon && <span className='text-base'>{icon}</span>}
              <span>{label}</span>
              {count && selectedId === id && (
                <span className='ml-1 text-[10px] opacity-75'>({count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showArrows && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-l from-background to-transparent'
        >
          <ChevronRight size={16} className='text-primary' />
        </button>
      )}
    </div>
  )
}
