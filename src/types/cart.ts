import type { ScaledIngredient } from './ingredient'
import type { Product } from './product'

export interface CartLine {
  lineId: string
  ingredient: ScaledIngredient
  /** `null` when no SKU could satisfy this ingredient. */
  product: Product | null
  packQty: number
  leftoverLabel: string | null
  /** User already has it — excluded from the order, still shown. */
  alreadyHave: boolean
  /** User removed it — excluded from the order, restorable. */
  removed: boolean
}

export interface CartTotals {
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
  alreadyHaveCount: number
  removedCount: number
  unmatchedCount: number
  /** ₹ the user avoided spending on pantry items they already own. */
  savedFromPantry: number
}

export interface Cart {
  recipeSlug: string
  recipeName: string
  recipeImage: string
  variantId: string | null
  variantName: string | null
  creatorId: string | null
  creatorName: string | null
  servings: number
  lines: CartLine[]
  deliveryEstimateMins: number
}
