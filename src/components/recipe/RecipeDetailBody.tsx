import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, X, Clock, ChefHat, Wallet, Flame } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import type { ScaledIngredient } from '@/types/ingredient'
import { CUISINE_LABELS, DIFFICULTY_LABELS, DIETARY_LABELS, HEALTH_LABELS } from '@/types/domain'
import { FoodImage } from '@/components/ui/FoodImage'
import { Rating, Tag, VegIndicator, SectionHead } from '@/components/ui/primitives'
import { TasteAndCreators } from '@/components/recipe/TasteAndCreators'
import { ServingSelector } from '@/components/recipe/ServingSelector'
import { formatDuration, formatPrice, formatServings, pluralise } from '@/lib/utils'

interface SelectionLike {
  variantId: string | null
  creatorId: string | null
  servings: number
  setVariant: (id: string) => void
  setCreator: (id: string | null) => void
  setServings: (n: number) => void
}

/**
 * All of a recipe's content, minus the chrome around it. Shared by the
 * full-page route (direct/shared links) and the modal (in-app browsing) so
 * the two never drift apart — only the frame differs.
 */
export function RecipeDetailBody({
  recipe,
  selection,
  shoppingList,
  onClose,
  closeIcon = 'back',
  heroHeightClass = 'h-[46vh] min-h-[280px] sm:h-[52vh] sm:min-h-[380px]',
}: {
  recipe: Recipe
  selection: SelectionLike
  shoppingList: ScaledIngredient[]
  onClose: () => void
  closeIcon?: 'back' | 'close'
  heroHeightClass?: string
}) {
  const time = recipe.prepTimeMins + recipe.cookTimeMins
  const costAtServings = Math.round((recipe.estimatedCost / recipe.baseServings) * selection.servings)

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <div className="relative">
        <div className={`relative w-full overflow-hidden ${heroHeightClass}`}>
          <FoodImage src={recipe.image} alt={recipe.name} eager />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim/95 via-scrim/45 via-45% to-transparent" />
          <div className="absolute inset-0 bg-scrim/15" />
        </div>

        <button
          onClick={onClose}
          aria-label={closeIcon === 'back' ? 'Go back' : 'Close'}
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-paper/90 text-ink shadow-card backdrop-blur-sm transition-transform active:scale-95 sm:left-6 sm:top-6"
        >
          {closeIcon === 'back' ? <ArrowLeft size={18} /> : <X size={18} />}
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

              <h1 className="text-h1 heading-display text-balance text-white sm:text-[2.75rem]">{recipe.name}</h1>
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

        {/* ── Taste + creators ──────────────────────────── */}
        {(recipe.variants.length > 0 || recipe.creators.length > 0) && (
          <section className="py-8">
            <SectionHead
              eyebrow="Step 1"
              title="How do you like it?"
              subtitle="Pick a spice level, or follow one of our best cooks."
            />
            <TasteAndCreators
              variants={recipe.variants}
              selectedVariantId={selection.variantId}
              onSelectVariant={selection.setVariant}
              creators={recipe.creators}
              selectedCreatorId={selection.creatorId}
              onSelectCreator={selection.setCreator}
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
      </div>
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
