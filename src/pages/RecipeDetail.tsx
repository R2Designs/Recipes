import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Clock, ChefHat, Wallet, Flame, ArrowRight } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { getRecipeBySlug } from '@/services/recipeService'
import { getShoppingList } from '@/services/scalingService'
import { useSelectionStore } from '@/store/useSelectionStore'
import { CUISINE_LABELS, DIFFICULTY_LABELS, DIETARY_LABELS, HEALTH_LABELS } from '@/types/domain'
import { FoodImage } from '@/components/ui/FoodImage'
import { Rating, Tag, VegIndicator, SectionHead, Skeleton } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { StickyActionBar } from '@/components/ui/StickyActionBar'
import { VariantPicker } from '@/components/recipe/VariantPicker'
import { CreatorRail } from '@/components/recipe/CreatorRail'
import { ServingSelector } from '@/components/recipe/ServingSelector'
import { formatDuration, formatPrice, formatServings, pluralise } from '@/lib/utils'
import NotFound from './NotFound'

export default function RecipeDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  const selection = useSelectionStore()
  const { selectRecipe } = selection

  useEffect(() => {
    let alive = true
    setLoading(true)
    getRecipeBySlug(slug).then((r) => {
      if (!alive) return
      setRecipe(r)
      setLoading(false)
      if (r) {
        selectRecipe(r.slug, {
          variantId: r.variants[0]?.id ?? null,
          servings: r.baseServings,
        })
      }
    })
    return () => {
      alive = false
    }
  }, [slug, selectRecipe])

  // Preview the scaled list so the CTA can say how many items it's about to add.
  const shoppingList = useMemo(() => {
    if (!recipe) return []
    return getShoppingList(recipe, selection.variantId, selection.servings)
  }, [recipe, selection.variantId, selection.servings])

  if (loading) return <RecipeDetailSkeleton />
  if (!recipe) return <NotFound />

  const time = recipe.prepTimeMins + recipe.cookTimeMins
  const costAtServings = Math.round(
    (recipe.estimatedCost / recipe.baseServings) * selection.servings,
  )
  const activeVariant = recipe.variants.find((v) => v.id === selection.variantId)

  return (
    <div className="pb-28">
      {/* ── Hero ────────────────────────────────────────── */}
      <div className="relative">
        <div className="relative h-[46vh] min-h-[280px] w-full overflow-hidden sm:h-[52vh] sm:min-h-[380px]">
          <FoodImage src={recipe.image} alt={recipe.name} eager />
          {/* Two stacked scrims: a deep one anchored to the caption, a light one
              overall. A single gradient can't hold text over a bright photo. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-45% to-transparent" />
          <div className="absolute inset-0 bg-ink/15" />
        </div>

        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-paper/90 text-ink shadow-card backdrop-blur-sm transition-transform active:scale-95 sm:left-6 sm:top-6"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <VegIndicator value={recipe.vegClass} size={14} />
                <span className="text-micro uppercase text-white/80">
                  {CUISINE_LABELS[recipe.cuisine]} · {recipe.region}
                </span>
              </div>

              <h1 className="text-h1 text-balance text-white sm:text-[2.75rem]">{recipe.name}</h1>
              <p className="mt-1.5 text-[1.0625rem] text-white/80">{recipe.tagline}</p>

              {recipe.rating && (
                <div className="mt-3 inline-flex rounded-pill bg-paper/92 px-2.5 py-1 backdrop-blur-sm">
                  <Rating value={recipe.rating.value} count={recipe.rating.count} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* ── Meta strip ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
          <MetaCell icon={<Clock size={16} />} label="Total time" value={formatDuration(time)} />
          <MetaCell
            icon={<ChefHat size={16} />}
            label="Difficulty"
            value={DIFFICULTY_LABELS[recipe.difficulty]}
          />
          <MetaCell
            icon={<Wallet size={16} />}
            label="Approx. cost"
            value={formatPrice(costAtServings)}
            hint={formatServings(selection.servings)}
          />
          <MetaCell
            icon={<Flame size={16} />}
            label="Per serving"
            value={`${recipe.nutrition.calories} kcal`}
          />
        </div>

        {/* ── About ─────────────────────────────────────── */}
        <section className="py-8">
          <p className="max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-ink-soft">
            {recipe.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {recipe.dietaryTags.map((t) => (
              <Tag key={t} tone="veg">
                {DIETARY_LABELS[t]}
              </Tag>
            ))}
            {recipe.healthTags.map((t) => (
              <Tag key={t} tone="saffron">
                {HEALTH_LABELS[t]}
              </Tag>
            ))}
          </div>

          <div className="mt-7 rounded-card border border-line bg-surface p-5">
            <h3 className="mb-4 text-micro uppercase text-ink-mute">Nutrition per serving</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[
                { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
                { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
                { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g' },
                { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
                { label: 'Fibre', value: recipe.nutrition.fibre, unit: 'g' },
              ].map((n) => (
                <div key={n.label}>
                  <p className="text-[1.375rem] font-extrabold tracking-tight text-ink">
                    {n.value}
                    <span className="ml-0.5 text-meta font-semibold text-ink-mute">{n.unit}</span>
                  </p>
                  <p className="mt-0.5 text-meta text-ink-soft">{n.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Variants ──────────────────────────────────── */}
        {recipe.variants.length > 0 && (
          <section className="py-8">
            <SectionHead
              eyebrow="Step 1"
              title="Choose your version"
              subtitle={`${pluralise(recipe.variants.length, 'way')} to make ${recipe.name} — each changes what you'll need.`}
            />
            <VariantPicker
              variants={recipe.variants}
              selectedId={selection.variantId}
              onSelect={selection.setVariant}
            />
          </section>
        )}

        {/* ── Servings ──────────────────────────────────── */}
        <section className="py-8">
          <SectionHead
            eyebrow="Step 2"
            title="How many people are you cooking for?"
            subtitle="Every ingredient quantity updates to match."
          />
          <ServingSelector value={selection.servings} onChange={selection.setServings} />

          <div className="mt-6 rounded-card border border-line bg-sunk/40 p-5">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-micro uppercase text-ink-mute">
                You’ll need · {formatServings(selection.servings)}
              </h3>
              <span className="text-meta font-bold text-ink">
                {pluralise(shoppingList.length, 'ingredient')}
              </span>
            </div>

            <ul className="columns-1 gap-x-8 sm:columns-2">
              {shoppingList.slice(0, 8).map((ing) => (
                <li
                  key={ing.ingredientId}
                  className="flex items-baseline justify-between gap-3 break-inside-avoid border-b border-line/70 py-2"
                >
                  <span className="text-[0.9375rem] text-ink-soft">{ing.name}</span>
                  <span className="shrink-0 text-[0.9375rem] font-bold tabular-nums text-ink">
                    {ing.displayQuantity}
                  </span>
                </li>
              ))}
            </ul>

            {shoppingList.length > 8 && (
              <p className="mt-3 text-meta text-ink-mute">
                + {shoppingList.length - 8} more on the next step
              </p>
            )}
          </div>
        </section>

        {/* ── Creators ──────────────────────────────────── */}
        {recipe.creators.length > 0 && (
          <section className="py-8">
            <SectionHead
              eyebrow="Step 3 · Optional"
              title={`Popular ways to make ${recipe.name}`}
              subtitle="Pick a cook to follow, or skip straight to the ingredients."
            />
            <CreatorRail
              creators={recipe.creators}
              selectedId={selection.creatorId}
              onSelect={selection.setCreator}
            />
          </section>
        )}
      </div>

      {/* ── Sticky CTA ──────────────────────────────────── */}
      <StickyActionBar raised>
        <div className="min-w-0 flex-1">
          <p className="truncate text-meta font-bold text-ink">
            {activeVariant?.name ?? recipe.name} · {formatServings(selection.servings)}
          </p>
          <p className="truncate text-meta text-ink-mute">
            {pluralise(shoppingList.length, 'ingredient')} · about {formatPrice(costAtServings)}
          </p>
        </div>
        <Button size="lg" onClick={() => navigate(`/recipe/${recipe.slug}/ingredients`)}>
          Get ingredients
          <ArrowRight size={17} />
        </Button>
      </StickyActionBar>
    </div>
  )
}

function MetaCell({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="bg-surface px-4 py-3.5">
      <div className="mb-1 flex items-center gap-1.5 text-ink-mute">
        {icon}
        <span className="text-micro uppercase">{label}</span>
      </div>
      <p className="text-[1.0625rem] font-extrabold tracking-tight text-ink">{value}</p>
      {hint && <p className="text-meta text-ink-mute">{hint}</p>}
    </div>
  )
}

function RecipeDetailSkeleton() {
  return (
    <div className="pb-20">
      <Skeleton className="h-[46vh] min-h-[280px] w-full rounded-none sm:h-[52vh]" />
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
