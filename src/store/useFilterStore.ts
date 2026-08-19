import { create } from 'zustand'
import type {
  Cuisine,
  DietaryTag,
  Difficulty,
  HealthTag,
  MealType,
} from '@/types/domain'
import type { RecipeFilters, SortKey } from '@/types/recipe'

export interface BudgetBand {
  id: string
  label: string
  min: number
  max: number | null
}

export const TIME_BANDS = [
  { id: '15', label: 'Under 15 min', maxTimeMins: 15 },
  { id: '30', label: 'Under 30 min', maxTimeMins: 30 },
  { id: '60', label: 'Under 60 min', maxTimeMins: 60 },
  { id: '60+', label: '60+ min', maxTimeMins: null },
] as const

export const BUDGET_BANDS: BudgetBand[] = [
  { id: 'u200', label: 'Under ₹200', min: 0, max: 200 },
  { id: '200-500', label: '₹200–₹500', min: 200, max: 500 },
  { id: '500-1000', label: '₹500–₹1,000', min: 500, max: 1000 },
  { id: '1000+', label: '₹1,000+', min: 1000, max: null },
]

interface FilterState {
  query: string
  meal: MealType[]
  cuisine: Cuisine[]
  dietary: DietaryTag[]
  health: HealthTag[]
  difficulty: Difficulty[]
  timeBandId: string | null
  budgetBandId: string | null
  sort: SortKey

  setQuery: (q: string) => void
  toggle: <K extends 'meal' | 'cuisine' | 'dietary' | 'health' | 'difficulty'>(
    key: K,
    value: FilterState[K][number],
  ) => void
  setTimeBand: (id: string | null) => void
  setBudgetBand: (id: string | null) => void
  setSort: (sort: SortKey) => void
  clearAll: () => void
  activeCount: () => number
  toFilters: () => RecipeFilters
}

const EMPTY = {
  meal: [] as MealType[],
  cuisine: [] as Cuisine[],
  dietary: [] as DietaryTag[],
  health: [] as HealthTag[],
  difficulty: [] as Difficulty[],
  timeBandId: null,
  budgetBandId: null,
}

export const useFilterStore = create<FilterState>()((set, get) => ({
  query: '',
  ...EMPTY,
  sort: 'popular',

  setQuery: (query) => set({ query }),

  toggle: (key, value) =>
    set((s) => {
      const list = s[key] as unknown[]
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { [key]: next } as unknown as Partial<FilterState>
    }),

  setTimeBand: (id) => set((s) => ({ timeBandId: s.timeBandId === id ? null : id })),
  setBudgetBand: (id) => set((s) => ({ budgetBandId: s.budgetBandId === id ? null : id })),
  setSort: (sort) => set({ sort }),
  clearAll: () => set({ ...EMPTY }),

  activeCount: () => {
    const s = get()
    return (
      s.meal.length +
      s.cuisine.length +
      s.dietary.length +
      s.health.length +
      s.difficulty.length +
      (s.timeBandId ? 1 : 0) +
      (s.budgetBandId ? 1 : 0)
    )
  },

  toFilters: () => {
    const s = get()
    const band = TIME_BANDS.find((b) => b.id === s.timeBandId)
    const budget = BUDGET_BANDS.find((b) => b.id === s.budgetBandId)

    return {
      query: s.query,
      meal: s.meal,
      cuisine: s.cuisine,
      dietary: s.dietary,
      health: s.health,
      difficulty: s.difficulty,
      // The "60+ min" band is a floor, not a ceiling — handled as "no max".
      maxTimeMins: band?.maxTimeMins ?? null,
      budget: budget ? { min: budget.min, max: budget.max } : null,
      sort: s.sort,
    }
  },
}))
