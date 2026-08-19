import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Truck, Clock, Sparkles } from 'lucide-react'
import { useOrderStore } from '@/store/useOrderStore'
import { canTrackOrder } from '@/services/checkoutService'
import { FoodImage } from '@/components/ui/FoodImage'
import { Button, ButtonLink } from '@/components/ui/Button'
import { MockDataBanner } from '@/components/system/MockDataBanner'
import { formatPrice, formatServings, pluralise } from '@/lib/utils'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const order = useOrderStore((s) => s.lastOrder)

  // Nothing to show without a real (mock) order behind it — never render a
  // success state from a bare URL visit.
  useEffect(() => {
    if (!order) navigate('/', { replace: true })
  }, [order, navigate])

  if (!order) return <Navigate to="/" replace />

  const trackable = canTrackOrder(order)
  const orderableItems = order.cart.lines.filter((l) => !l.removed && !l.alreadyHave && l.product)

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-20 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-veg/10"
        >
          <Sparkles size={28} className="text-veg" />
        </motion.div>

        <h1 className="text-h1 font-display text-ink">You’re all set. 🍳</h1>
        <p className="mt-2 text-[1.0625rem] text-ink-soft">
          {order.cart.recipeName} for {order.cart.servings}
        </p>
        <p className="mt-0.5 text-body text-ink-mute">Ingredients ordered successfully.</p>
      </motion.div>

      <div className="mt-7">
        <MockDataBanner tone="strong" />
      </div>

      {/* Order summary */}
      <div className="mt-5 overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <div className="size-14 shrink-0 overflow-hidden rounded-tile bg-sunk">
            <FoodImage src={order.cart.recipeImage} alt={order.cart.recipeName} rounded="rounded-tile" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-bold text-ink">{order.cart.recipeName}</p>
            <p className="text-meta text-ink-soft">
              {order.cart.variantName ? `${order.cart.variantName} · ` : ''}
              {formatServings(order.cart.servings)}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 p-4">
          <div className="flex items-center gap-2 text-meta text-ink-soft">
            <Clock size={14} className="shrink-0 text-ink-mute" />
            Order placed {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 text-meta text-ink-soft">
            <Truck size={14} className="shrink-0 text-ink-mute" />
            Estimated delivery in {order.etaMins} minutes
          </div>
        </div>

        <div className="border-t border-line p-4">
          <p className="mb-2 text-micro uppercase text-ink-mute">
            {pluralise(orderableItems.length, 'item')}
          </p>
          <p className="line-clamp-2 text-meta text-ink-soft">
            {orderableItems.map((l) => l.ingredient.name).join(', ')}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line p-4">
          <span className="text-[0.9375rem] font-bold text-ink">Total</span>
          <span className="text-h3 text-ink">{formatPrice(order.totals.total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          full
          size="lg"
          disabled={!trackable}
          title={trackable ? undefined : 'Live tracking arrives with the Instamart connection'}
        >
          {trackable ? 'Track in Instamart' : 'Track in Instamart — coming soon'}
        </Button>
        <ButtonLink to="/" variant="secondary" size="lg" full>
          Back to discovery
        </ButtonLink>
      </div>
    </div>
  )
}
