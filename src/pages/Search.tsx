import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search as SearchIcon, X, SearchX } from 'lucide-react'
import type { Recipe, SortKey } from '@/types/recipe'
import { listRecipes } from '@/services/recipeService'
import { useFilterStore, TIME_BANDS, BUDGET_BANDS } from '@/store/useFilterStore'
import { RecipeCard, RecipeCardSkeleton } from '@/components/recipe/RecipeCard'
import { FilterSheet } from '@/components/home/FilterSheet'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/primitives'
import {
  CUISINE_LABELS,
  MEAL_LABELS,
  DIETARY_LABELS,
  HEALTH_LABELS,
  DIFFICULTY_LABELS,
} from '@/types/domain'
import { pluralise } from '@/lib/utils'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'quickest', label: 'Quickest' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'rating', label: 'Top rated' },
]

export default function Search() {
  const [params, setParams] = useSearchParams()
  const store = useFilterStore()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [input, setInput] = useState(store.query)

  const filters = store.toFilters()
  // Serialise so the effect re-runs on any filter change without deep-compare.
  const key = JSON.stringify(filters)

  // Keep ?q= in the URL so a search is shareable and survives a refresh.
  useEffect(() => {
    const q = params.get('q')
    if (q !== null && q !== store.query) {
      store.setQuery(q)
      setInput(q)
    }
    // Only on mount — afterwards the store is the source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (store.query) setParams({ q: store.query }, { replace: true })
    else setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.query])

  useEffect(() => {
    let alive = true
    setLoading(true)
    listRecipes(filters).then((r) => {
      if (!alive) return
      setRecipes(r)
      setLoading(false)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const activePills = useMemo(() => {
    const pills: { label: string; clear: () => void }[] = []
    store.meal.forEach((m) => pills.push({ label: MEAL_LABELS[m], clear: () => store.toggle('meal', m) }))
    store.cuisine.forEach((c) => pills.push({ label: CUISINE_LABELS[c], clear: () => store.toggle('cuisine', c) }))
    store.dietary.forEach((d) => pills.push({ label: DIETARY_LABELS[d], clear: () => store.toggle('dietary', d) }))
    store.health.forEach((h) => pills.push({ label: HEALTH_LABELS[h], clear: () => store.toggle('health', h) }))
    store.difficulty.forEach((d) => pills.push({ label: DIFFICULTY_LABELS[d], clear: () => store.toggle('difficulty', d) }))
    const t = TIME_BANDS.find((b) => b.id === store.timeBandId)
    if (t) pills.push({ label: t.label, clear: () => store.setTimeBand(t.id) })
    const b = BUDGET_BANDS.find((x) => x.id === store.budgetBandId)
    if (b) pills.push({ label: b.label, clear: () => store.setBudgetBand(b.id) })
    return pills
  }, [store])

  const activeCount = store.activeCount()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      {/* Search field */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          store.setQuery(input)
        }}
        className="relative"
      >
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
        />
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            store.setQuery(e.target.value)
          }}
          placeholder="Search dosa, biryani, pasta, paneer..."
          aria-label="Search recipes"
          className="h-[52px] w-full rounded-pill border border-line bg-surface pl-11 pr-11 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink-mute focus:border-saffron/40"
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput('')
              store.setQuery('')
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-mute transition-colors hover:bg-sunk hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Filter bar */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className={activeCount ? 'border-saffron/35 bg-saffron-wash text-saffron-deep' : ''}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 grid size-4.5 place-items-center rounded-full bg-saffron px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>

        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
          {SORTS.map((s) => (
            <Chip key={s.id} size="sm" selected={store.sort === s.id} onClick={() => store.setSort(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      {activePills.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activePills.map((p) => (
            <button
              key={p.label}
              onClick={p.clear}
              className="inline-flex items-center gap-1 rounded-pill border border-saffron/30 bg-saffron-wash px-2.5 py-1 text-meta font-semibold text-saffron-deep transition-colors hover:border-saffron/60"
            >
              {p.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={store.clearAll}
            className="px-1 text-meta font-semibold text-ink-mute underline underline-offset-2 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      )}

      <p className="mt-5 text-meta text-ink-mute">
        {loading ? 'Searching…' : pluralise(recipes.length, 'recipe')}
        {store.query && !loading && ` for “${store.query}”`}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <RecipeCardSkeleton key={i} />)
          : recipes.map((recipe, i) => <RecipeCard key={recipe.slug} recipe={recipe} index={i} />)}
      </div>

      {!loading && recipes.length === 0 && (
        <EmptyState
          icon={<SearchX size={24} />}
          title="Nothing matches that yet"
          body={
            activeCount > 0
              ? 'Try removing a filter or two — the combination might be a bit narrow.'
              : 'Try a different dish, ingredient or cuisine.'
          }
          action={
            activeCount > 0 ? (
              <Button variant="secondary" onClick={store.clearAll}>
                Clear all filters
              </Button>
            ) : undefined
          }
        />
      )}

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} resultCount={recipes.length} />
    </div>
  )
}
