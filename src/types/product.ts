import type { Unit } from './domain'

/**
 * A purchasable SKU. This is the ONLY core model allowed to reference a vendor,
 * and only through the opaque `vendorRef` — no UI code should read it.
 */
export interface Product {
  id: string
  /** Which master ingredient this SKU satisfies. */
  ingredientId: string
  name: string
  brand: string
  packSize: number
  packUnit: Unit
  /** Human label for the pack, e.g. "5 kg", "500 g". */
  packLabel: string
  price: number
  mrp?: number
  image: string
  availability: 'in-stock' | 'low-stock' | 'out-of-stock'
  vendorRef?: { vendor: 'instamart'; productId: string }
}

export interface Location {
  pincode: string
  city: string
}

/** What the matcher concluded for one ingredient — product plus how many packs. */
export interface ProductMatch {
  product: Product
  /** Packs needed to cover the required quantity. */
  packQty: number
  /** Surplus after buying `packQty` packs, in the product's pack unit. */
  leftover: number
  leftoverLabel: string | null
}
