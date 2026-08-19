import { Check } from 'lucide-react'
import type { RecipeVariant } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/domain'
import { FoodImage } from '@/components/ui/FoodImage'
import { SpiceMeter } from '@/components/ui/primitives'
import { formatDuration, cn } from '@/lib/utils'

/**
 * "Choose your version."
 *
 * A dish isn't one immutable recipe — Masala Dosa alone has seven legitimate
 * versions, and picking one changes the shopping list downstream.
 */
export function VariantPicker({
  variants,
  selectedId,
  onSelect,
}: {
  variants: RecipeVariant[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {variants.map((variant) => {
        const selected = variant.id === selectedId
        return (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            aria-pressed={selected}
            className={cn(
              'group relative flex w-[220px] shrink-0 flex-col overflow-hidden rounded-card border text-left',
              'transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]',
              'sm:w-auto',
              selected
                ? 'border-saffron/50 bg-saffron-wash/45 shadow-card'
                : 'border-line bg-surface hover:border-ink-mute/50 hover:shadow-card',
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <FoodImage
                src={variant.thumbnail}
                alt={variant.name}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              {selected && (
                <span className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-saffron text-white shadow-card">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-3.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[0.9375rem] font-bold tracking-[-0.01em] text-ink">
                  {variant.name}
                </h3>
                <SpiceMeter level={variant.spiceLevel} />
              </div>

              <p className="mt-1 line-clamp-2 flex-1 text-meta leading-relaxed text-ink-soft">
                {variant.description}
              </p>

              <p className="mt-2.5 text-micro uppercase text-ink-mute">
                {formatDuration(variant.timeMins)} · {DIFFICULTY_LABELS[variant.difficulty]}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
