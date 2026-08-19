import type { ScaledIngredient } from '@/types/ingredient'
import type { Location, Product, ProductMatch } from '@/types/product'
import { productsForIngredient } from '@/data/products'
import { toBaseUnit, formatQuantity } from '@/lib/scaling'

/**
 * Ingredient → product matching.
 *
 * The seam between "what the recipe needs" and "what you can actually buy".
 * Today it scores a local mock catalogue; later it will call
 * `swiggyMcpClient.searchCatalogue()` through the application API. Either way
 * the UI only ever sees `Product` and `ProductMatch` — no vendor shapes leak
 * upward, and no component ever constructs a product itself.
 */

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/**
 * Compare a required quantity against a pack size.
 * Treats grams and millilitres as interchangeable — near enough for spices and
 * liquids at grocery resolution, and it avoids "no match" on a technicality.
 */
function comparableAmounts(ing: ScaledIngredient, product: Product) {
  const required = toBaseUnit(ing.quantity, ing.unit)
  const pack = toBaseUnit(product.packSize, product.packUnit)

  const isCount = required.base === 'count' || pack.base === 'count'
  if (isCount && required.base !== pack.base) return null

  return { required: required.value, pack: pack.value }
}

/**
 * Score a SKU for how well it satisfies the requirement.
 *
 * Weighted the way a person shops: mostly "is this the right size", then
 * "can I actually get it", then "is it good value".
 */
function score(ing: ScaledIngredient, product: Product): number | null {
  const amounts = comparableAmounts(ing, product)
  if (!amounts) return null
  if (product.availability === 'out-of-stock') return null

  const { required, pack } = amounts
  if (pack <= 0) return null

  const packQty = Math.max(1, Math.ceil(required / pack))
  const bought = packQty * pack
  // 1.0 = pack matches the requirement exactly; falls off as surplus grows.
  const efficiency = required / bought

  let fit = efficiency
  // Hauling home four bags of anything is a bad suggestion even if it is efficient.
  if (packQty > 3) fit *= 0.55
  else if (packQty > 2) fit *= 0.85

  const availability = product.availability === 'low-stock' ? 0.6 : 1
  // Cheaper per unit is better, normalised into a small 0–1 nudge.
  const unitPrice = product.price / pack
  const value = 1 / (1 + unitPrice * 40)

  return fit * 0.6 + availability * 0.25 + value * 0.15
}

function buildMatch(ing: ScaledIngredient, product: Product): ProductMatch {
  const amounts = comparableAmounts(ing, product)
  const required = amounts?.required ?? 0
  const pack = amounts?.pack ?? product.packSize

  const packQty = Math.max(1, Math.ceil(required / pack))
  const leftoverBase = packQty * pack - required

  // Only mention leftovers when they're meaningful — a stray 8 g is noise.
  const meaningful = leftoverBase > pack * 0.15 && leftoverBase > 20
  const leftoverInPackUnit = leftoverBase / pack

  return {
    product,
    packQty,
    leftover: leftoverBase,
    leftoverLabel: meaningful
      ? `~${formatQuantity(
          Math.round(leftoverInPackUnit * product.packSize * 10) / 10,
          product.packUnit,
        )} left over`
      : null,
  }
}

/** All viable SKUs for an ingredient, best first. Powers the "swap product" sheet. */
export async function findProducts(
  ing: ScaledIngredient,
  _location?: Location,
): Promise<Product[]> {
  const candidates = productsForIngredient(ing.ingredientId)
    .map((product) => ({ product, s: score(ing, product) }))
    .filter((c): c is { product: Product; s: number } => c.s !== null)
    .sort((a, b) => b.s - a.s)
    .map((c) => c.product)

  return delay(candidates, 180)
}

/** The single SKU we'd put in the cart by default. */
export async function findBestProduct(
  ing: ScaledIngredient,
  location?: Location,
): Promise<ProductMatch | null> {
  const products = await findProducts(ing, location)
  if (!products.length) return null
  return buildMatch(ing, products[0])
}

/**
 * Match a whole shopping list in one call — the procurement page's entry point.
 * Batched deliberately: this is one round trip to the catalogue, not N.
 */
export async function matchAll(
  ingredients: ScaledIngredient[],
  _location?: Location,
): Promise<Map<string, ProductMatch | null>> {
  const result = new Map<string, ProductMatch | null>()

  for (const ing of ingredients) {
    const products = productsForIngredient(ing.ingredientId)
      .map((product) => ({ product, s: score(ing, product) }))
      .filter((c): c is { product: Product; s: number } => c.s !== null)
      .sort((a, b) => b.s - a.s)

    result.set(ing.ingredientId, products.length ? buildMatch(ing, products[0].product) : null)
  }

  return delay(result, 420)
}

/** Recompute pack count when the user changes servings or swaps a SKU. */
export function matchFor(ing: ScaledIngredient, product: Product): ProductMatch {
  return buildMatch(ing, product)
}
