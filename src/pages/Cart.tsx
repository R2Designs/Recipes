import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ShoppingBasket, Truck, Loader2, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useOrderStore } from '@/store/useOrderStore'
import { orderableLines, priceCart, freeDeliveryShortfall, pushToInstamart } from '@/services/cartService'
import { confirmCheckout } from '@/services/checkoutService'
import { FoodImage } from '@/components/ui/FoodImage'
import { Button, ButtonLink } from '@/components/ui/Button'
import { StickyActionBar } from '@/components/ui/StickyActionBar'
import { EmptyState } from '@/components/ui/primitives'
import { ControlNotice } from '@/components/cart/ControlNotice'
import { MockDataBanner } from '@/components/system/MockDataBanner'
import { formatPrice, formatServings, pluralise } from '@/lib/utils'

export default function Cart() {
  const navigate = useNavigate()
  const cartStore = useCartStore()
  const recordOrder = useOrderStore((s) => s.recordOrder)
  const [busy, setBusy] = useState<'push' | 'confirm' | null>(null)
  const [showOwned, setShowOwned] = useState(false)

  const cart = cartStore.cart

  if (!cart || orderableLines(cart).length === 0) {
    return (
      <div className="py-14">
        <EmptyState
          icon={<ShoppingBasket size={24} />}
          title="Your basket is empty"
          body="Pick a recipe and build a shopping list — it'll show up here ready to review."
          action={<ButtonLink to="/">Browse recipes</ButtonLink>}
        />
      </div>
    )
  }

  const totals = priceCart(cart)
  const orderable = orderableLines(cart)
  const owned = cart.lines.filter((l) => l.alreadyHave && !l.removed)
  const shortfall = freeDeliveryShortfall(totals)
  const pushed = !!cartStore.vendorCartId

  async function handlePrimary() {
    if (!cart) return

    if (!pushed) {
      setBusy('push')
      const result = await pushToInstamart(cart)
      cartStore.setVendorCartId(result.vendorCartId)
      setBusy(null)
      return
    }

    setBusy('confirm')
    const order = await confirmCheckout(cart, cartStore.vendorCartId!)
    recordOrder(order)
    cartStore.clear()
    setBusy(null)
    navigate('/order/success')
  }

  return (
    <div className="pb-36">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 sm:px-6">
        <h1 className="text-h1 text-ink">Your basket</h1>
        <div className="mt-1.5 flex items-center gap-2 text-body text-ink-soft">
          <span className="size-8 shrink-0 overflow-hidden rounded-tile bg-sunk">
            <FoodImage src={cart.recipeImage} alt={cart.recipeName} rounded="rounded-tile" />
          </span>
          {cart.recipeName} · {formatServings(cart.servings)}
        </div>

        <div className="mt-5">
          <MockDataBanner tone="strong" />
        </div>

        <div className="mt-5 divide-y divide-line rounded-card border border-line bg-surface px-4">
          {orderable.map((line) => (
            <div key={line.lineId} className="flex items-center gap-3 py-3.5">
              <div className="size-12 shrink-0 overflow-hidden rounded-tile bg-sunk">
                <FoodImage src={line.product!.image} alt={line.product!.name} rounded="rounded-tile" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] font-bold text-ink">{line.ingredient.name}</p>
                <p className="truncate text-meta text-ink-soft">
                  {line.product!.brand} · {line.product!.packLabel}
                  {line.packQty > 1 && ` · ×${line.packQty}`}
                </p>
              </div>
              <span className="shrink-0 text-[0.9375rem] font-bold tabular-nums text-ink">
                {formatPrice(line.product!.price * line.packQty)}
              </span>
            </div>
          ))}
        </div>

        {owned.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-card border border-line">
            <button
              onClick={() => setShowOwned((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-meta font-semibold text-ink-soft">
                {pluralise(owned.length, 'item')} excluded — you already have these
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-ink-mute transition-transform ${showOwned ? 'rotate-180' : ''}`}
              />
            </button>
            {showOwned && (
              <div className="divide-y divide-line border-t border-line px-4">
                {owned.map((line) => (
                  <div key={line.lineId} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-meta text-ink-mute">{line.ingredient.name}</span>
                    <span className="text-meta text-ink-mute">
                      Saved {line.product ? formatPrice(line.product.price * line.packQty) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="mt-5 space-y-2 rounded-card border border-line bg-sunk/40 p-4">
          <Row label={`Subtotal (${pluralise(totals.itemCount, 'item')})`} value={formatPrice(totals.subtotal)} />
          <Row
            label="Delivery"
            value={totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}
            valueClass={totals.deliveryFee === 0 ? 'text-veg' : undefined}
          />
          {shortfall > 0 && (
            <p className="text-meta text-saffron-deep">
              Add {formatPrice(shortfall)} more for free delivery
            </p>
          )}
          <div className="!mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[0.9375rem] font-bold text-ink">Total</span>
            <span className="text-h3 text-ink">{formatPrice(totals.total)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-meta text-ink-soft">
          <Truck size={15} className="text-ink-mute" />
          Estimated delivery in {cart.deliveryEstimateMins} minutes
        </div>

        <div className="mt-5">
          <ControlNotice />
        </div>

        <button
          onClick={() => navigate(`/recipe/${cart.recipeSlug}/ingredients`)}
          className="mt-5 text-meta font-bold text-saffron-deep hover:text-saffron"
        >
          ← Review ingredients
        </button>
      </div>

      <StickyActionBar>
        <div className="min-w-0 flex-1">
          <p className="text-meta text-ink-mute">{pushed ? 'Ready to confirm' : 'Total'}</p>
          <p className="text-[1.0625rem] font-extrabold tabular-nums text-ink">
            {formatPrice(totals.total)}
          </p>
        </div>
        <Button size="lg" onClick={handlePrimary} disabled={busy !== null}>
          {busy ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            >
              <Loader2 size={17} />
            </motion.span>
          ) : (
            <>
              {pushed ? 'Confirm order' : 'Add everything to Instamart'}
              <ArrowRight size={17} />
            </>
          )}
        </Button>
      </StickyActionBar>
    </div>
  )
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between text-[0.9375rem]">
      <span className="text-ink-soft">{label}</span>
      <span className={valueClass ?? 'font-semibold text-ink'}>{value}</span>
    </div>
  )
}
