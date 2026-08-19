import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Quantity control. 44px targets so it stays usable with a thumb. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
  compact,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  compact?: boolean
}) {
  const btn =
    'grid place-items-center text-ink-soft transition-colors hover:text-ink ' +
    'disabled:opacity-30 disabled:hover:text-ink-soft active:scale-90'

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-pill border border-line bg-surface',
        compact ? 'h-9' : 'h-10',
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={cn(btn, compact ? 'size-9' : 'size-10')}
      >
        <Minus size={15} />
      </button>
      <span
        className={cn(
          'min-w-6 text-center text-[0.9375rem] font-bold tabular-nums text-ink',
          compact && 'text-meta',
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={cn(btn, compact ? 'size-9' : 'size-10')}
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
