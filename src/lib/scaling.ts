import type { Ingredient, RecipeIngredient, ScaledIngredient } from '@/types/ingredient'
import type { Unit } from '@/types/domain'

/**
 * Serving-size scaling.
 *
 * Naive multiplication gives you "0.83 onions" and "1.6 pinches of turmeric".
 * Real cooks round to amounts you can actually buy and measure, and the rounding
 * they apply depends on the unit and the magnitude. That's what this encodes.
 *
 * Invariants:
 *  - Anything present at base servings is still present after scaling (never 0).
 *  - Discrete items stay whole (or halved, for produce where that's natural).
 *  - Small spice quantities have a floor so they can't vanish.
 */

const FRACTION_GLYPHS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '0.33': '⅓',
  '0.67': '⅔',
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/**
 * Ties round DOWN for countable items — buying 2 bunches of curry leaves when
 * the maths says 2.5 beats buying 3 and binning one.
 */
function roundHalfDown(value: number): number {
  return Math.ceil(value - 0.5)
}

/** Rounding ladder for measured quantities (g / ml). Coarser as amounts grow. */
function roundMeasured(value: number): number {
  if (value < 10) return Math.max(1, Math.round(value))
  if (value < 50) return roundTo(value, 5)
  if (value < 200) return roundTo(value, 10)
  if (value < 1000) return roundTo(value, 25)
  return roundTo(value, 50)
}

export interface ScaledAmount {
  quantity: number
  unit: Unit
}

/**
 * Scale one quantity, applying unit-appropriate rounding and promoting to a
 * larger unit where that reads better (1500 g → 1.5 kg, 3 tsp → 1 tbsp).
 */
export function scaleQuantity(
  quantity: number,
  unit: Unit,
  factor: number,
  meta?: Pick<Ingredient, 'discrete' | 'halvable'>,
): ScaledAmount {
  if (quantity <= 0) return { quantity, unit }

  const raw = quantity * factor

  switch (unit) {
    // ── Measured weight ──────────────────────────────────────
    case 'g': {
      const g = roundMeasured(raw)
      return g >= 1000 ? { quantity: trim(g / 1000), unit: 'kg' } : { quantity: g, unit: 'g' }
    }
    case 'kg': {
      const g = roundMeasured(raw * 1000)
      return g >= 1000 ? { quantity: trim(g / 1000), unit: 'kg' } : { quantity: g, unit: 'g' }
    }

    // ── Measured volume ──────────────────────────────────────
    case 'ml': {
      const ml = roundMeasured(raw)
      return ml >= 1000 ? { quantity: trim(ml / 1000), unit: 'l' } : { quantity: ml, unit: 'ml' }
    }
    case 'l': {
      const ml = roundMeasured(raw * 1000)
      return ml >= 1000 ? { quantity: trim(ml / 1000), unit: 'l' } : { quantity: ml, unit: 'ml' }
    }

    // ── Spoons — quarter steps, with a floor so spices survive ─
    case 'tsp': {
      const tsp = Math.max(0.25, roundTo(raw, 0.25))
      // Promote only on clean multiples so we never lose precision.
      if (tsp >= 3 && tsp % 3 === 0) return { quantity: tsp / 3, unit: 'tbsp' }
      return { quantity: trim(tsp), unit: 'tsp' }
    }
    case 'tbsp': {
      const tbsp = Math.max(0.25, roundTo(raw, 0.25))
      if (tbsp >= 8 && tbsp % 4 === 0) return { quantity: tbsp / 16, unit: 'cup' }
      return { quantity: trim(tbsp), unit: 'tbsp' }
    }
    case 'cup':
      return { quantity: Math.max(0.25, roundTo(raw, 0.25)), unit: 'cup' }

    // ── Pinches — cap at 3, then it's really a quarter-teaspoon ─
    case 'pinch': {
      const pinches = Math.max(1, Math.round(raw))
      if (pinches > 3) {
        // ~16 pinches to a teaspoon.
        return { quantity: Math.max(0.25, roundTo(raw / 16, 0.25)), unit: 'tsp' }
      }
      return { quantity: pinches, unit: 'pinch' }
    }

    // ── Countable ────────────────────────────────────────────
    case 'piece':
    case 'bunch':
    case 'pack': {
      if (meta?.halvable) {
        return { quantity: Math.max(0.5, roundTo(raw, 0.5)), unit }
      }
      return { quantity: Math.max(1, roundHalfDown(raw)), unit }
    }
  }
}

/** Drop floating-point noise; keep at most 2 decimals. */
function trim(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Units where a vulgar fraction is how people actually write it ("½ tsp",
 * "2½ onions"). Metric weights and volumes take decimals instead — nobody
 * writes "1½ kg" on a shopping list.
 */
const FRACTION_UNITS: Unit[] = ['tsp', 'tbsp', 'cup', 'piece', 'bunch', 'pinch', 'pack']

/** Render a number the way a recipe would: 0.5 → "½", 1.5 → "1½", 2 → "2". */
export function formatNumber(value: number, useFractions = true): string {
  const whole = Math.floor(value)
  const frac = trim(value - whole)

  if (frac === 0) return String(whole)

  if (useFractions) {
    const glyph = FRACTION_GLYPHS[String(frac)]
    if (glyph) return whole === 0 ? glyph : `${whole}${glyph}`
  }

  return String(trim(value))
}

/** Full display string including the unit, pluralised. e.g. "2 bunches", "1.5 kg". */
export function formatQuantity(quantity: number, unit: Unit): string {
  const num = formatNumber(quantity, FRACTION_UNITS.includes(unit))

  switch (unit) {
    case 'piece':
      return num
    case 'bunch':
      return `${num} ${quantity === 1 ? 'bunch' : 'bunches'}`
    case 'pinch':
      return `${num} ${quantity === 1 ? 'pinch' : 'pinches'}`
    case 'cup':
      return `${num} ${quantity === 1 ? 'cup' : 'cups'}`
    case 'pack':
      return `${num} ${quantity === 1 ? 'pack' : 'packs'}`
    default:
      return `${num} ${unit}`
  }
}

export type IngredientMetaLookup = (ingredientId: string) => Ingredient | undefined

/**
 * Scale a whole ingredient list from `baseServings` to `targetServings`.
 * Pure — the caller supplies the ingredient catalogue lookup.
 */
export function scaleIngredients(
  ingredients: RecipeIngredient[],
  baseServings: number,
  targetServings: number,
  getMeta?: IngredientMetaLookup,
): ScaledIngredient[] {
  const factor = targetServings / baseServings

  return ingredients.map((ing) => {
    const meta = getMeta?.(ing.ingredientId)
    const scaled = scaleQuantity(ing.quantity, ing.unit, factor, meta)

    return {
      ...ing,
      quantity: scaled.quantity,
      unit: scaled.unit,
      baseQuantity: ing.quantity,
      baseUnit: ing.unit,
      scaleFactor: factor,
      displayQuantity: formatQuantity(scaled.quantity, scaled.unit),
    }
  })
}

/** Normalise any quantity to a base unit (g / ml / count) for matcher comparisons. */
export function toBaseUnit(quantity: number, unit: Unit): { value: number; base: 'g' | 'ml' | 'count' } {
  switch (unit) {
    case 'kg':
      return { value: quantity * 1000, base: 'g' }
    case 'g':
      return { value: quantity, base: 'g' }
    case 'l':
      return { value: quantity * 1000, base: 'ml' }
    case 'ml':
      return { value: quantity, base: 'ml' }
    case 'tbsp':
      return { value: quantity * 15, base: 'ml' }
    case 'tsp':
      return { value: quantity * 5, base: 'ml' }
    case 'cup':
      return { value: quantity * 240, base: 'ml' }
    case 'pinch':
      return { value: quantity * 0.3, base: 'ml' }
    default:
      return { value: quantity, base: 'count' }
  }
}
