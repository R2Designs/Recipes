import type {
  Cuisine,
  DietaryTag,
  Difficulty,
  HealthTag,
  MealType,
  SpiceLevel,
  VegClass,
} from './domain'
import type { RecipeIngredient } from './ingredient'

export interface Nutrition {
  /** All values are per serving. */
  calories: number
  protein: number
  carbs: number
  fat: number
  fibre: number
}

export type IngredientOverride =
  | { op: 'add'; ingredient: RecipeIngredient }
  | { op: 'remove'; ingredientId: string }
  | { op: 'scale'; ingredientId: string; factor: number }

/** A way of making the same dish — "Spicy", "Kerala-style", "Kids-friendly". */
export interface RecipeVariant {
  id: string
  name: string
  description: string
  spiceLevel: SpiceLevel
  difficulty: Difficulty
  timeMins: number
  thumbnail: string
  /** How this version's shopping list differs from the recipe's base list. */
  ingredientOverrides?: IngredientOverride[]
}

/**
 * A creator's take on the dish. We attribute and link out — we never reproduce
 * their method or steps. Recipes helps users discover and procure, not copy.
 */
export interface CreatorRecipe {
  id: string
  creatorName: string
  creatorAvatar: string
  creatorHandle: string
  title: string
  blurb: string
  thumbnail: string
  hasVideo: boolean
  sourceUrl?: string
  spiceLevel: SpiceLevel
  timeMins: number
  difficulty: Difficulty
  followerLabel?: string
}

export interface Recipe {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  cuisine: Cuisine
  region: string
  mealType: MealType[]
  image: string
  vegClass: VegClass
  /** Ingredient quantities below are stated for this many people. */
  baseServings: number
  prepTimeMins: number
  cookTimeMins: number
  difficulty: Difficulty
  dietaryTags: DietaryTag[]
  healthTags: HealthTag[]
  /** Approximate ₹ cost of ingredients at `baseServings`. */
  estimatedCost: number
  rating?: { value: number; count: number }
  nutrition: Nutrition
  ingredients: RecipeIngredient[]
  variants: RecipeVariant[]
  creators: CreatorRecipe[]
}

export interface Collection {
  id: string
  title: string
  subtitle: string
  recipeSlugs: string[]
}

export type SortKey = 'popular' | 'quickest' | 'cheapest' | 'rating'

export interface RecipeFilters {
  query?: string
  meal?: MealType[]
  cuisine?: Cuisine[]
  dietary?: DietaryTag[]
  health?: HealthTag[]
  difficulty?: Difficulty[]
  /** Max total time in minutes. `null` / absent = no limit. */
  maxTimeMins?: number | null
  /** Inclusive ₹ range on `estimatedCost`. */
  budget?: { min: number; max: number | null } | null
  sort?: SortKey
}
