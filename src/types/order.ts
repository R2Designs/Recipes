import type { Cart, CartTotals } from './cart'

export interface Order {
  id: string
  placedAt: string
  cart: Cart
  totals: CartTotals
  status: 'confirmed'
  etaMins: number
  /**
   * Always true in this prototype. Gates the "Demo mode" banner so a mock
   * order can never be mistaken for a real one. Not optional by design.
   */
  isMock: true
  /** Reserved for a real Instamart deep link. `null` until MCP is connected. */
  trackingUrl: string | null
}

/** Result of handing a cart to the vendor, before the user confirms checkout. */
export interface VendorCartResult {
  ok: boolean
  vendorCartId: string
  isMock: true
  unavailableLineIds: string[]
}
