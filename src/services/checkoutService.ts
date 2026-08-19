import type { Cart } from '@/types/cart'
import type { Order } from '@/types/order'
import { priceCart } from './cartService'
import * as swiggy from './swiggyMcpClient'

/**
 * Checkout.
 *
 * The only irreversible step in the product, so it is the most guarded:
 * `confirmCheckout` is called from exactly one place — the user pressing
 * "Confirm order" on the cart review screen — and never as a side effect of
 * navigation, cart edits, or the Instamart hand-off.
 */

const USE_MOCK = !swiggy.IS_CONNECTED

function orderId(): string {
  return `RCP-${Date.now().toString(36).toUpperCase()}`
}

/**
 * Place the order.
 *
 * The returned Order carries `isMock: true` as a non-optional field, so the UI
 * cannot render an order summary without also being able to say it was a demo.
 */
export async function confirmCheckout(cart: Cart, vendorCartId: string): Promise<Order> {
  if (!USE_MOCK) {
    await swiggy.placeOrder(vendorCartId)
  }

  await new Promise((r) => setTimeout(r, 1100))

  return {
    id: orderId(),
    placedAt: new Date().toISOString(),
    cart,
    totals: priceCart(cart),
    status: 'confirmed',
    etaMins: cart.deliveryEstimateMins,
    isMock: true,
    trackingUrl: swiggy.getTrackingUrl(vendorCartId),
  }
}

/**
 * Whether we can hand the user off to Instamart to track the order.
 * False until the MCP is connected and we know tracking is actually supported.
 */
export function canTrackOrder(order: Order): boolean {
  return order.trackingUrl !== null
}
