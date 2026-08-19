import { Check, RotateCcw, X } from 'lucide-react'
import type { CartLine } from '@/types/cart'
import { FoodImage } from '@/components/ui/FoodImage'
import { Stepper } from '@/components/ui/Stepper'
import { IconButton } from '@/components/ui/Button'
import { formatPrice, cn } from '@/lib/utils'

/**
 * One shopping-list line: what the recipe needs, what we'd buy for it, and
 * the three controls the spec calls out explicitly — quantity, remove, and
 * "I already have this".
 *
 * Two layouts share one DOM: on mobile, product info and the quantity
 * stepper drop to a second line so the stepper's tap targets stay full-size
 * rather than being squeezed out — a real control here, not a desktop extra.
 */
export function IngredientRow({
  line,
  onToggleHave,
  onSetPackQty,
  onRemove,
  onRestore,
  onOpenSwap,
}: {
  line: CartLine
  onToggleHave: () => void
  onSetPackQty: (qty: number) => void
  onRemove: () => void
  onRestore: () => void
  onOpenSwap: () => void
}) {
  const { ingredient, product } = line

  if (line.removed) {
    return (
      <div className="flex items-center justify-between gap-3 py-3 opacity-60">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] text-ink-mute line-through">{ingredient.name}</p>
          <p className="text-meta text-ink-mute">Removed</p>
        </div>
        <button
          onClick={onRestore}
          className="flex shrink-0 items-center gap-1 text-meta font-bold text-saffron-deep hover:text-saffron"
        >
          <RotateCcw size={13} /> Undo
        </button>
      </div>
    )
  }

  const showStepper = product && !line.alreadyHave

  return (
    <div className={cn('py-3 transition-opacity', line.alreadyHave && 'opacity-55')}>
      <div className="flex items-center gap-3">
        {/* "I already have this" toggle */}
        <button
          onClick={onToggleHave}
          aria-label={line.alreadyHave ? 'Mark as needed' : 'I already have this'}
          aria-pressed={line.alreadyHave}
          className={cn(
            'grid size-6 shrink-0 place-items-center rounded-[7px] border-[1.5px] transition-colors',
            line.alreadyHave
              ? 'border-veg bg-veg text-white'
              : 'border-line bg-surface text-transparent hover:border-ink-mute',
          )}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        <button
          onClick={onOpenSwap}
          className="size-[52px] shrink-0 overflow-hidden rounded-tile bg-sunk"
          aria-label={`Change product for ${ingredient.name}`}
        >
          {product ? (
            <FoodImage src={product.image} alt={product.name} rounded="rounded-tile" />
          ) : (
            <div className="grid size-full place-items-center text-ink-mute">
              <X size={16} />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[0.9375rem] font-bold text-ink">{ingredient.name}</p>
            <span className="shrink-0 text-meta text-ink-mute">{ingredient.displayQuantity}</span>
          </div>

          {/* Product line + stepper/price, desktop only — mobile gets its own row below. */}
          <div className="mt-0.5 hidden items-baseline justify-between gap-3 sm:flex">
            {line.alreadyHave ? (
              <p className="text-meta font-semibold text-veg">Already have this — won't be added</p>
            ) : product ? (
              <button onClick={onOpenSwap} className="min-w-0 text-left">
                <p className="truncate text-meta text-ink-soft">
                  {product.brand} · {product.packLabel}
                  {line.leftoverLabel && <span className="text-ink-mute"> · {line.leftoverLabel}</span>}
                </p>
              </button>
            ) : (
              <p className="text-meta text-nonveg">No match found — try swapping</p>
            )}

            {showStepper && (
              <div className="flex shrink-0 items-center gap-3">
                <Stepper value={line.packQty} onChange={onSetPackQty} max={10} compact />
                <span className="w-16 shrink-0 text-right text-[0.9375rem] font-bold tabular-nums text-ink">
                  {formatPrice(product!.price * line.packQty)}
                </span>
              </div>
            )}
          </div>

          {/* Product line only, mobile — stepper/price move to their own row. */}
          <p className="mt-0.5 truncate text-meta sm:hidden">
            {line.alreadyHave ? (
              <span className="font-semibold text-veg">Already have this — won't be added</span>
            ) : product ? (
              <button onClick={onOpenSwap} className="text-ink-soft">
                {product.brand} · {product.packLabel}
              </button>
            ) : (
              <span className="text-nonveg">No match found — try swapping</span>
            )}
          </p>
        </div>

        <IconButton label={`Remove ${ingredient.name}`} onClick={onRemove} className="shrink-0">
          <X size={16} />
        </IconButton>
      </div>

      {/* Mobile-only second row: quantity + price get full-size tap targets
          instead of being squeezed into the main row. */}
      {showStepper && (
        <div className="mt-2.5 flex items-center justify-end gap-3 pl-[76px] sm:hidden">
          <Stepper value={line.packQty} onChange={onSetPackQty} max={10} />
          <span className="w-16 shrink-0 text-right text-[0.9375rem] font-bold tabular-nums text-ink">
            {formatPrice(product!.price * line.packQty)}
          </span>
        </div>
      )}
    </div>
  )
}
