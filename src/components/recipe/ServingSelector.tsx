import { useState } from 'react'
import { Users } from 'lucide-react'
import { Chip } from '@/components/ui/Chip'
import { SERVING_PRESETS, MAX_SERVINGS } from '@/store/useSelectionStore'
import { cn } from '@/lib/utils'

/**
 * "How many people are you cooking for?"
 *
 * Presets cover almost every real case; Custom exists for the rest. Changing
 * this rescales the entire shopping list, so it stays visible on both the
 * recipe page and the procurement page rather than being a one-time choice.
 */
export function ServingSelector({
  value,
  onChange,
  compact,
}: {
  value: number
  onChange: (n: number) => void
  compact?: boolean
}) {
  const isPreset = SERVING_PRESETS.includes(value)
  const [customOpen, setCustomOpen] = useState(!isPreset)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {SERVING_PRESETS.map((n) => (
          <Chip
            key={n}
            size={compact ? 'sm' : 'md'}
            selected={value === n}
            onClick={() => {
              setCustomOpen(false)
              onChange(n)
            }}
            className={compact ? 'min-w-11 justify-center' : 'min-w-12 justify-center'}
          >
            {n}
          </Chip>
        ))}

        <Chip
          size={compact ? 'sm' : 'md'}
          selected={customOpen && !isPreset}
          onClick={() => setCustomOpen(true)}
        >
          Custom
        </Chip>
      </div>

      {customOpen && (
        <div className="mt-3 flex items-center gap-2.5">
          <Users size={16} className="text-ink-mute" />
          <input
            type="number"
            min={1}
            max={MAX_SERVINGS}
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 1)}
            aria-label="Number of people"
            className={cn(
              'h-10 w-20 rounded-tile border border-line bg-surface px-3 text-center',
              'text-[0.9375rem] font-bold tabular-nums text-ink outline-none',
              'transition-colors focus:border-saffron/45',
            )}
          />
          <span className="text-meta text-ink-soft">
            {value === 1 ? 'person' : 'people'}
            <span className="ml-1 text-ink-mute">(max {MAX_SERVINGS})</span>
          </span>
        </div>
      )}
    </div>
  )
}
