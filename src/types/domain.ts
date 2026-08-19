/**
 * Core domain vocabulary. Deliberately free of any vendor/Swiggy concepts —
 * everything here would be true of the product even with no grocery partner.
 */

export type Cuisine =
  | 'south-indian'
  | 'north-indian'
  | 'bengali'
  | 'punjabi'
  | 'gujarati'
  | 'maharashtrian'
  | 'rajasthani'
  | 'kerala'
  | 'tamil'
  | 'karnataka'
  | 'andhra'
  | 'telangana'
  | 'indo-chinese'
  | 'italian'
  | 'mexican'
  | 'japanese'
  | 'korean'
  | 'continental'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'drink'

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'eggless'
  | 'jain'
  | 'gluten-free'
  | 'dairy-free'

export type HealthTag = 'high-protein' | 'low-calorie' | 'low-carb' | 'high-fibre'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'fiery'

export type VegClass = 'veg' | 'non-veg' | 'egg'

export type Unit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'piece'
  | 'bunch'
  | 'pinch'
  | 'pack'

export type IngredientCategory =
  | 'grains'
  | 'pulses'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'spices'
  | 'oils'
  | 'condiments'
  | 'bakery'
  | 'nuts'
  | 'herbs'
  | 'sweeteners'

// ── Display labels ─────────────────────────────────────────────

export const CUISINE_LABELS: Record<Cuisine, string> = {
  'south-indian': 'South Indian',
  'north-indian': 'North Indian',
  bengali: 'Bengali',
  punjabi: 'Punjabi',
  gujarati: 'Gujarati',
  maharashtrian: 'Maharashtrian',
  rajasthani: 'Rajasthani',
  kerala: 'Kerala',
  tamil: 'Tamil',
  karnataka: 'Karnataka',
  andhra: 'Andhra',
  telangana: 'Telangana',
  'indo-chinese': 'Indo-Chinese',
  italian: 'Italian',
  mexican: 'Mexican',
  japanese: 'Japanese',
  korean: 'Korean',
  continental: 'Continental',
}

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
  dessert: 'Desserts',
  drink: 'Drinks',
}

export const DIETARY_LABELS: Record<DietaryTag, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  eggless: 'Eggless',
  jain: 'Jain',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
}

export const HEALTH_LABELS: Record<HealthTag, string> = {
  'high-protein': 'High protein',
  'low-calorie': 'Low calorie',
  'low-carb': 'Low carb',
  'high-fibre': 'High fibre',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export const SPICE_LABELS: Record<SpiceLevel, string> = {
  mild: 'Mild',
  medium: 'Medium',
  spicy: 'Spicy',
  fiery: 'Fiery',
}

/** How many flame glyphs to render for a spice level. */
export const SPICE_HEAT: Record<SpiceLevel, number> = {
  mild: 1,
  medium: 2,
  spicy: 3,
  fiery: 4,
}

export const UNIT_LABELS: Record<Unit, { one: string; many: string }> = {
  g: { one: 'g', many: 'g' },
  kg: { one: 'kg', many: 'kg' },
  ml: { one: 'ml', many: 'ml' },
  l: { one: 'l', many: 'l' },
  tsp: { one: 'tsp', many: 'tsp' },
  tbsp: { one: 'tbsp', many: 'tbsp' },
  cup: { one: 'cup', many: 'cups' },
  piece: { one: '', many: '' },
  bunch: { one: 'bunch', many: 'bunches' },
  pinch: { one: 'pinch', many: 'pinches' },
  pack: { one: 'pack', many: 'packs' },
}
