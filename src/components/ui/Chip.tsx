import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Toggleable pill. The workhorse of the filter system and the intent chips.
 * Selected state is a saffron wash with a matching border — never a heavy fill,
 * which would compete with the CTA for attention.
 */
export function Chip({
  children,
  selected,
  onClick,
  size = 'md',
  className,
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-pill border font-semibold',
        'transition-[background-color,border-color,color,transform] duration-200',
        'active:scale-[0.96]',
        size === 'sm' ? 'h-8 px-3 text-meta' : 'h-10 px-4 text-[0.875rem]',
        selected
          ? 'border-saffron/35 bg-saffron-wash text-saffron-deep'
          : 'border-line bg-surface text-ink-soft hover:border-ink-mute hover:text-ink',
        className,
      )}
    >
      {children}
    </button>
  )
}
