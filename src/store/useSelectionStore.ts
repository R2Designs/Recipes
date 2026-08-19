import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * What the user has chosen so far for the dish they're cooking.
 *
 * Persisted to sessionStorage so the choice survives navigation between recipe
 * detail → procurement → cart, and a refresh in the middle of that flow.
 */
interface SelectionState {
  recipeSlug: string | null
  variantId: string | null
  creatorId: string | null
  servings: number

  selectRecipe: (slug: string, defaults: { variantId: string | null; servings: number }) => void
  setVariant: (variantId: string) => void
  setCreator: (creatorId: string | null) => void
  setServings: (servings: number) => void
  reset: () => void
}

export const SERVING_PRESETS = [1, 2, 4, 6, 10]
export const MAX_SERVINGS = 50

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      recipeSlug: null,
      variantId: null,
      creatorId: null,
      servings: 4,

      selectRecipe: (slug, defaults) => {
        // Switching dishes clears variant/creator; staying on the same dish keeps them.
        if (get().recipeSlug === slug) return
        set({
          recipeSlug: slug,
          variantId: defaults.variantId,
          creatorId: null,
          servings: defaults.servings,
        })
      },

      setVariant: (variantId) => set({ variantId }),
      setCreator: (creatorId) => set({ creatorId }),
      setServings: (servings) =>
        set({ servings: Math.min(MAX_SERVINGS, Math.max(1, Math.round(servings))) }),

      reset: () => set({ recipeSlug: null, variantId: null, creatorId: null, servings: 4 }),
    }),
    {
      name: 'recipes:selection',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
