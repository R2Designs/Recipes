import type { Cart, CartLine, CartTotals } from '@/types/cart'
import type { VendorCartResult } from '@/types/order'
import * as swiggy from './swiggyMcpClient'

/**
 * Cart assembly, pricing and hand-off to the vendor.
 *
 * `USE_MOCK` is the single switch between the demo path and the real one.
 * While it's true, nothing here touches `swiggyMcpClient`.
 */
const USE_MOCK = !swiggy.IS_CONNECTED

const DELIVERY_FEE = 29
const FREE_DELIVERY_OVER = 499

/** Lines that will actually be ordered — excludes owned and removed items. */
export function orderableLines(cart: Cart): CartLine[] {
  return cart.lines.filter((l) => !l.removed && !l.alreadyHave && l.product)
}

export function priceCart(cart: Cart): CartTotals {
  const orderable = orderableLines(cart)

  const subtotal = orderable.reduce((sum, l) => sum + (l.product?.price ?? 0) * l.packQty, 0)

  const alreadyHave = cart.lines.filter((l) => l.alreadyHave && !l.removed)
  const savedFromPantry = alreadyHave.reduce((sum, l) => sum + (l.product?.price ?? 0) * l.packQty, 0)

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE

  return {
    itemCount: orderable.reduce((n, l) => n + l.packQty, 0),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    alreadyHaveCount: alreadyHave.length,
    removedCount: cart.lines.filter((l) => l.removed).length,
    unmatchedCount: cart.lines.filter((l) => !l.product && !l.removed && !l.alreadyHave).length,
    savedFromPantry,
  }
}

export function freeDeliveryShortfall(totals: CartTotals): number {
  if (totals.subtotal === 0 || totals.subtotal >= FREE_DELIVERY_OVER) return 0
  return FREE_DELIVERY_OVER - totals.subtotal
}

/**
 * Hand the cart to Instamart. This creates or updates a vendor-side basket —
 * it does NOT place an order. Checkout is a separate, explicit step.
 */
export async function pushToInstamart(cart: Cart): Promise<VendorCartResult> {
  if (!USE_MOCK) {
    const { vendorCartId } = await swiggy.createCart(cart)
    return { ok: true, vendorCartId, isMock: true, unavailableLineIds: [] }
  }

  await new Promise((r) => setTimeout(r, 900))

  // Surface low-stock items as a soft warning rather than silently dropping them.
  const unavailableLineIds = orderableLines(cart)
    .filter((l) => l.product?.availability === 'low-stock')
    .map((l) => l.lineId)

  return {
    ok: true,
    vendorCartId: `mock-cart-${Date.now().toString(36)}`,
    isMock: true,
    unavailableLineIds,
  }
}
