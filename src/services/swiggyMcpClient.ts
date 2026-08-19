import type { Cart } from '@/types/cart'
import type { Product } from '@/types/product'

/**
 * ─────────────────────────────────────────────────────────────
 *  Swiggy Instamart MCP client — NOT IMPLEMENTED
 * ─────────────────────────────────────────────────────────────
 *
 * This is the ONLY file in the app that knows Swiggy exists. Everything above
 * it deals in `Product`, `Cart` and `Order`, so swapping vendors — or dropping
 * the grocery integration entirely — touches this file and nothing else.
 *
 * None of these functions work yet, and each throws rather than returning
 * plausible-looking fake data: a silent stub is how a demo accidentally
 * convinces someone a real order was placed. `cartService` and
 * `checkoutService` route around this file while `USE_MOCK` is true.
 *
 * IMPORTANT: this must run server-side when it is implemented. Instamart
 * session and credential handling cannot be done from browser code, so the
 * real call path is:
 *
 *     Browser → /api/cart, /api/checkout → this client → Instamart
 *
 * Capabilities below are stated as intentions, not as documented MCP features.
 * Anything the MCP turns out not to support stays a local concern (see
 * `getTrackingUrl`) rather than being faked here.
 */

export class NotImplementedError extends Error {
  constructor(capability: string) {
    super(`Swiggy Instamart MCP not connected — ${capability} is unavailable.`)
    this.name = 'NotImplementedError'
  }
}

/** Whether a real MCP connection is configured. Always false in the prototype. */
export const IS_CONNECTED = false

/** Maps to: catalogue search for a location. Would replace the mock SKU list. */
export async function searchCatalogue(_query: string, _pincode: string): Promise<Product[]> {
  throw new NotImplementedError('catalogue search')
}

/** Maps to: create or replace a vendor-side cart from our line items. */
export async function createCart(_cart: Cart): Promise<{ vendorCartId: string }> {
  throw new NotImplementedError('cart creation')
}

/** Maps to: serviceability + ETA for a delivery address. */
export async function getDeliveryEstimate(_pincode: string): Promise<{ etaMins: number }> {
  throw new NotImplementedError('delivery estimates')
}

/**
 * Maps to: placing the order.
 * Guarded hardest of all — this is the irreversible one.
 */
export async function placeOrder(_vendorCartId: string): Promise<{ orderId: string }> {
  throw new NotImplementedError('order placement')
}

/**
 * Order tracking deep link.
 *
 * Not assumed to exist. Until we know the MCP exposes tracking, this returns
 * null and the UI disables the button rather than linking somewhere hopeful.
 */
export function getTrackingUrl(_orderId: string): string | null {
  return null
}
