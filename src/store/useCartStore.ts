import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Cart, CartLine } from '@/types/cart'
import type { Product } from '@/types/product'
import type { ScaledIngredient } from '@/types/ingredient'
import { matchFor } from '@/services/ingredientMatcher'

/**
 * The shopping list the user is building.
 *
 * Persisted to localStorage — someone halfway through editing a 16-item list
 * should not lose it to an accidental refresh.
 */
interface CartState {
  cart: Cart | null
  /** Set once the cart has been handed to Instamart, cleared on any edit. */
  vendorCartId: string | null

  buildCart: (input: BuildCartInput) => void
  toggleAlreadyHave: (lineId: string) => void
  setPackQty: (lineId: string, packQty: number) => void
  removeLine: (lineId: string) => void
  restoreLine: (lineId: string) => void
  swapProduct: (lineId: string, product: Product) => void
  setVendorCartId: (id: string | null) => void
  clear: () => void
}

export interface BuildCartInput {
  recipeSlug: string
  recipeName: string
  recipeImage: string
  variantId: string | null
  variantName: string | null
  creatorId: string | null
  creatorName: string | null
  servings: number
  ingredients: ScaledIngredient[]
  matches: Map<string, { product: Product; packQty: number; leftoverLabel: string | null } | null>
  /** Ingredients the user already marked as owned — preserved across rebuilds. */
  ownedIngredientIds?: Set<string>
  deliveryEstimateMins: number
}

function buildLines(input: BuildCartInput, pantryDefaults: (id: string) => boolean): CartLine[] {
  return input.ingredients.map((ing) => {
    const match = input.matches.get(ing.ingredientId) ?? null
    const owned = input.ownedIngredientIds
      ? input.ownedIngredientIds.has(ing.ingredientId)
      : pantryDefaults(ing.ingredientId)

    return {
      lineId: ing.ingredientId,
      ingredient: ing,
      product: match?.product ?? null,
      packQty: match?.packQty ?? 1,
      leftoverLabel: match?.leftoverLabel ?? null,
      alreadyHave: owned,
      removed: false,
    }
  })
}

/** Any edit invalidates the vendor-side basket — it must be pushed again. */
function invalidate(state: CartState) {
  return { ...state, vendorCartId: null }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      vendorCartId: null,

      buildCart: (input) => {
        // Pantry staples start ticked — nobody wants salt added to their order.
        const pantryDefaults = (id: string) => PANTRY_DEFAULTS.has(id)

        set({
          cart: {
            recipeSlug: input.recipeSlug,
            recipeName: input.recipeName,
            recipeImage: input.recipeImage,
            variantId: input.variantId,
            variantName: input.variantName,
            creatorId: input.creatorId,
            creatorName: input.creatorName,
            servings: input.servings,
            lines: buildLines(input, pantryDefaults),
            deliveryEstimateMins: input.deliveryEstimateMins,
          },
          vendorCartId: null,
        })
      },

      toggleAlreadyHave: (lineId) =>
        set((s) => {
          if (!s.cart) return s
          return invalidate({
            ...s,
            cart: {
              ...s.cart,
              lines: s.cart.lines.map((l) =>
                l.lineId === lineId ? { ...l, alreadyHave: !l.alreadyHave } : l,
              ),
            },
          })
        }),

      setPackQty: (lineId, packQty) =>
        set((s) => {
          if (!s.cart) return s
          return invalidate({
            ...s,
            cart: {
              ...s.cart,
              lines: s.cart.lines.map((l) =>
                l.lineId === lineId ? { ...l, packQty: Math.max(1, Math.min(20, packQty)) } : l,
              ),
            },
          })
        }),

      removeLine: (lineId) =>
        set((s) => {
          if (!s.cart) return s
          return invalidate({
            ...s,
            cart: {
              ...s.cart,
              lines: s.cart.lines.map((l) => (l.lineId === lineId ? { ...l, removed: true } : l)),
            },
          })
        }),

      restoreLine: (lineId) =>
        set((s) => {
          if (!s.cart) return s
          return invalidate({
            ...s,
            cart: {
              ...s.cart,
              lines: s.cart.lines.map((l) => (l.lineId === lineId ? { ...l, removed: false } : l)),
            },
          })
        }),

      swapProduct: (lineId, product) =>
        set((s) => {
          if (!s.cart) return s
          return invalidate({
            ...s,
            cart: {
              ...s.cart,
              lines: s.cart.lines.map((l) => {
                if (l.lineId !== lineId) return l
                // Re-derive pack count for the new SKU rather than keeping the old one.
                const m = matchFor(l.ingredient, product)
                return { ...l, product, packQty: m.packQty, leftoverLabel: m.leftoverLabel }
              }),
            },
          })
        }),

      setVendorCartId: (id) => set({ vendorCartId: id }),
      clear: () => set({ cart: null, vendorCartId: null }),
    }),
    {
      name: 'recipes:cart',
      storage: createJSONStorage(() => localStorage),
      // Maps don't survive JSON — only the built cart is persisted, never `matches`.
      partialize: (s) => ({ cart: s.cart, vendorCartId: s.vendorCartId }) as CartState,
    },
  ),
)

/** Ingredients most kitchens already have. Pre-ticked as "I already have this". */
const PANTRY_DEFAULTS = new Set([
  'salt',
  'turmeric',
  'chilli-powder',
  'coriander-powder',
  'cumin-seeds',
  'mustard-seeds',
  'garam-masala',
  'asafoetida',
  'bay-leaf',
  'cardamom',
  'cinnamon',
  'cloves',
  'dry-red-chilli',
  'chaat-masala',
  'tea-leaves',
  'fenugreek-seeds',
  'oil',
  'sugar',
  'vinegar',
  'tomato-ketchup',
  'atta',
  'milk',
  'butter',
  'ghee',
])
