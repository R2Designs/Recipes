import type { IngredientCategory, Unit } from './domain'

/** Master catalogue entry — one per real-world ingredient, shared across recipes. */
export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  defaultUnit: Unit
  /** Countable in the real world (onion, egg) vs measured (oil, flour). */
  discrete: boolean
  /**
   * Large produce where a half is a natural amount to buy/use.
   * Lets scaling produce "2½ onions" but never "2½ eggs".
   */
  halvable?: boolean
  /** Likely already in the user's kitchen — pre-ticks "I already have this". */
  pantryStaple: boolean
  substitutes?: string[]
}

/** A recipe's use of an ingredient. Quantities are stated at `Recipe.baseServings`. */
export interface RecipeIngredient {
  ingredientId: string
  name: string
  quantity: number
  unit: Unit
  optional?: boolean
  /** e.g. "for tempering", "to garnish" */
  note?: string
}

/** A RecipeIngredient after serving-size scaling. */
export interface ScaledIngredient extends RecipeIngredient {
  baseQuantity: number
  baseUnit: Unit
  scaleFactor: number
  /** Pre-formatted for display, e.g. "1.5 kg", "2 bunches", "½ tsp". */
  displayQuantity: string
}
