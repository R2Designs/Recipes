import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import type { Product } from '@/types/product'
import type { ScaledIngredient } from '@/types/ingredient'
import { findProducts } from '@/services/ingredientMatcher'
import { Sheet } from '@/components/ui/Sheet'
import { FoodImage } from '@/components/ui/FoodImage'
import { Skeleton } from '@/components/ui/primitives'
import { formatPrice, cn } from '@/lib/utils'

/** Lets the user pick a different SKU for one ingredient — brand, size, price. */
export function ProductSwapSheet({
  open,
  onClose,
  ingredient,
  currentProductId,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  ingredient: ScaledIngredient | null
  currentProductId: string | null | undefined
  onSelect: (product: Product) => void
}) {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    if (!open || !ingredient) return
    setProducts(null)
    findProducts(ingredient).then(setProducts)
  }, [open, ingredient])

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={ingredient ? `Choose a product` : 'Choose a product'}
      subtitle={ingredient ? `For ${ingredient.displayQuantity} ${ingredient.name.toLowerCase()}` : undefined}
    >
      {!products ? (
        <div className="space-y-3 py-1">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="py-8 text-center text-body text-ink-soft">
          No products available for this ingredient right now.
        </p>
      ) : (
        <div className="-mx-1 space-y-1 py-1">
          {products.map((product) => {
            const selected = product.id === currentProductId
            return (
              <button
                key={product.id}
                onClick={() => {
                  onSelect(product)
                  onClose()
                }}
                disabled={product.availability === 'out-of-stock'}
                className={cn(
                  'flex w-full items-center gap-3 rounded-tile border p-2.5 text-left transition-colors',
                  selected ? 'border-saffron/45 bg-saffron-wash/50' : 'border-transparent hover:bg-sunk',
                  product.availability === 'out-of-stock' && 'opacity-40',
                )}
              >
                <div className="size-[52px] shrink-0 overflow-hidden rounded-tile bg-sunk">
                  <FoodImage src={product.image} alt={product.name} rounded="rounded-tile" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9375rem] font-bold text-ink">{product.brand}</p>
                  <p className="text-meta text-ink-soft">
                    {product.packLabel}
                    {product.availability === 'low-stock' && (
                      <span className="text-saffron-deep"> · Low stock</span>
                    )}
                    {product.availability === 'out-of-stock' && (
                      <span className="text-nonveg"> · Out of stock</span>
                    )}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[0.9375rem] font-bold tabular-nums text-ink">
                    {formatPrice(product.price)}
                  </p>
                  {product.mrp && product.mrp > product.price && (
                    <p className="text-[11px] text-ink-mute line-through">{formatPrice(product.mrp)}</p>
                  )}
                </div>

                {selected && (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-saffron text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </Sheet>
  )
}
