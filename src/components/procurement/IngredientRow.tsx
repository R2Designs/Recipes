import { Check, X } from 'lucide-react'
import type { CartLine } from '@/types/cart'
import { Stepper } from '@/components/ui/Stepper'
import { formatPrice, cn } from '@/lib/utils'

/**
 * One shopping-list line: what the recipe needs, what we'd buy for it, and
 * the two controls the spec calls out explicitly — quantity and
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
  onOpenSwap,
}: {
  line: CartLine
  onToggleHave: () => void
  onSetPackQty: (qty: number) => void
  onOpenSwap: () => void
}) {
  const { ingredient, product } = line
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
          {line.alreadyHave ? <X size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
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
      </div>

      {/* Mobile-only second row: quantity + price get full-size tap targets
          instead of being squeezed into the main row. */}
      {showStepper && (
        <div className="mt-2.5 flex items-center justify-end gap-3 pl-9 sm:hidden">
          <Stepper value={line.packQty} onChange={onSetPackQty} max={10} />
          <span className="w-16 shrink-0 text-right text-[0.9375rem] font-bold tabular-nums text-ink">
            {formatPrice(product!.price * line.packQty)}
          </span>
        </div>
      )}
    </div>
  )
}
