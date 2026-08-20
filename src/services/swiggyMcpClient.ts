import type { Cart } from '@/types/cart'
import type { Product } from '@/types/product'

/**
 * ─────────────────────────────────────────────────────────────
 *  Swiggy Instamart MCP client — the only file that knows Swiggy exists
 * ─────────────────────────────────────────────────────────────
 *
 * Everything above it deals in `Product`, `Cart` and `Order`, so swapping
 * vendors — or dropping the grocery integration entirely — touches this
 * file and nothing else.
 *
 * Every function here calls our own `/api/instamart/*` backend, never
 * Swiggy directly — Instamart session and credential handling cannot be
 * done from browser code, so the real call path is:
 *
 *     Browser → /api/instamart/* → this client's server-side counterpart → Instamart
 *
 * `IS_CONNECTED` stays false until `VITE_INSTAMART_ENABLED=true` is set,
 * which won't happen until there's a real Swiggy client ID and the `/api`
 * routes do more than return 501. Until then `cartService` and
 * `checkoutService` route around this file entirely via `USE_MOCK` — no
 * behavior changes for anyone using the app today.
 */

export class InstamartApiError extends Error {
  capability: string
  status: number

  constructor(capability: string, status: number) {
    super(`Instamart request failed — ${capability} (HTTP ${status}).`)
    this.name = 'InstamartApiError'
    this.capability = capability
    this.status = status
  }
}

/** Whether a real MCP connection is configured. */
export const IS_CONNECTED = import.meta.env.VITE_INSTAMART_ENABLED === 'true'

async function callApi<T>(capability: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  if (!res.ok) throw new InstamartApiError(capability, res.status)
  return res.json() as Promise<T>
}

/** Catalogue search for a location. Replaces the mock SKU list. */
export async function searchCatalogue(query: string, pincode: string): Promise<Product[]> {
  const params = new URLSearchParams({ q: query, pincode })
  return callApi('catalogue search', `/api/instamart/search?${params}`)
}

/** Create or replace a vendor-side cart from our line items. */
export async function createCart(cart: Cart): Promise<{ vendorCartId: string }> {
  return callApi('cart creation', '/api/instamart/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cart),
  })
}

/** Serviceability + ETA for a delivery address. */
export async function getDeliveryEstimate(pincode: string): Promise<{ etaMins: number }> {
  const params = new URLSearchParams({ pincode })
  return callApi('delivery estimates', `/api/instamart/delivery-estimate?${params}`)
}

/**
 * Places the order. Guarded hardest of all — this is the irreversible one.
 * Called from exactly one place in the UI: the user pressing "Confirm order".
 */
export async function placeOrder(vendorCartId: string): Promise<{ orderId: string }> {
  return callApi('order placement', '/api/instamart/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorCartId }),
  })
}

/**
 * Order tracking deep link.
 *
 * Not assumed to exist. Until we know the MCP exposes tracking, this returns
 * null and the UI disables the button rather than linking somewhere hopeful.
 * (Phase 6 will make this a real check against `/api/instamart/order/:id/track`
 * if Swiggy's MCP turns out to support it — kept synchronous and null for now
 * since nothing calls it yet.)
 */
export function getTrackingUrl(_orderId: string): string | null {
  return null
}
