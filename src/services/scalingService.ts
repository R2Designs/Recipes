import type { Recipe } from '@/types/recipe'
import type { RecipeIngredient, ScaledIngredient } from '@/types/ingredient'
import { scaleIngredients } from '@/lib/scaling'
import { getIngredient } from '@/data/ingredients'

/**
 * Serving-size scaling.
 *
 * Deliberately synchronous and local: recipe discovery has to be useful with no
 * network and no grocery partner at all. Nothing here ever calls out.
 */

/**
 * Apply a variant's ingredient overrides to the recipe's base list.
 * Variants add, remove or re-quantify ingredients — "Spicy" doubles the chilli
 * and adds red chutney; "Kids-friendly" drops the chilli and adds cheese.
 */
export function resolveIngredients(recipe: Recipe, variantId: string | null): RecipeIngredient[] {
  const variant = variantId ? recipe.variants.find((v) => v.id === variantId) : null
  if (!variant?.ingredientOverrides?.length) return recipe.ingredients

  let list = [...recipe.ingredients]

  for (const override of variant.ingredientOverrides) {
    switch (override.op) {
      case 'remove':
        list = list.filter((ing) => ing.ingredientId !== override.ingredientId)
        break
      case 'scale':
        list = list.map((ing) =>
          ing.ingredientId === override.ingredientId
            ? { ...ing, quantity: ing.quantity * override.factor }
            : ing,
        )
        break
      case 'add': {
        // Guard against a variant adding something the base list already has.
        const exists = list.some((ing) => ing.ingredientId === override.ingredient.ingredientId)
        if (!exists) list.push(override.ingredient)
        break
      }
    }
  }

  return list
}

/** Scale a resolved ingredient list to the requested number of servings. */
export function scaleForServings(
  ingredients: RecipeIngredient[],
  baseServings: number,
  targetServings: number,
): ScaledIngredient[] {
  return scaleIngredients(ingredients, baseServings, targetServings, getIngredient)
}

/** Convenience: resolve the variant and scale in one step. */
export function getShoppingList(
  recipe: Recipe,
  variantId: string | null,
  servings: number,
): ScaledIngredient[] {
  return scaleForServings(resolveIngredients(recipe, variantId), recipe.baseServings, servings)
}
