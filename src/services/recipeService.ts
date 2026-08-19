import type { Recipe, RecipeFilters, Collection } from '@/types/recipe'
import { RECIPES, COLLECTIONS, getRecipe, totalTime } from '@/data/recipes'

/**
 * Recipe discovery.
 *
 * Every function is async and shaped like the HTTP call it will eventually be.
 * When a backend exists, the bodies become `fetch('/api/recipes?…')` and no
 * caller changes.
 */

/** Simulated network latency, so loading states are real rather than theoretical. */
function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function matchesQuery(recipe: Recipe, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    recipe.name.toLowerCase().includes(q) ||
    recipe.tagline.toLowerCase().includes(q) ||
    recipe.cuisine.replace('-', ' ').includes(q) ||
    recipe.region.toLowerCase().includes(q) ||
    recipe.description.toLowerCase().includes(q) ||
    recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
  )
}

function applyFilters(recipes: Recipe[], f: RecipeFilters): Recipe[] {
  return recipes.filter((r) => {
    if (f.query && !matchesQuery(r, f.query)) return false
    if (f.meal?.length && !f.meal.some((m) => r.mealType.includes(m))) return false
    if (f.cuisine?.length && !f.cuisine.includes(r.cuisine)) return false
    // Dietary and health filters are AND — asking for vegan AND gluten-free
    // should not return merely-vegan results.
    if (f.dietary?.length && !f.dietary.every((d) => r.dietaryTags.includes(d))) return false
    if (f.health?.length && !f.health.every((h) => r.healthTags.includes(h))) return false
    if (f.difficulty?.length && !f.difficulty.includes(r.difficulty)) return false
    if (f.maxTimeMins != null && totalTime(r) > f.maxTimeMins) return false
    if (f.budget) {
      if (r.estimatedCost < f.budget.min) return false
      if (f.budget.max != null && r.estimatedCost > f.budget.max) return false
    }
    return true
  })
}

function sortRecipes(recipes: Recipe[], sort: RecipeFilters['sort']): Recipe[] {
  const out = [...recipes]
  switch (sort) {
    case 'quickest':
      return out.sort((a, b) => totalTime(a) - totalTime(b))
    case 'cheapest':
      return out.sort((a, b) => a.estimatedCost - b.estimatedCost)
    case 'rating':
      return out.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0))
    case 'popular':
    default:
      return out.sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0))
  }
}

export async function listRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  return delay(sortRecipes(applyFilters(RECIPES, filters), filters.sort))
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  return listRecipes({ query })
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  return delay(getRecipe(slug) ?? null, 160)
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  return delay(COLLECTIONS, 180)
}

/** Typeahead suggestions for the search field. Local and instant — no delay. */
export function suggestRecipes(query: string, limit = 6): Recipe[] {
  if (!query.trim()) return []
  return RECIPES.filter((r) => matchesQuery(r, query)).slice(0, limit)
}
