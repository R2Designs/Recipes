import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '@/types/recipe'
import { getRecipe, totalTime } from '@/data/recipes'
import { FoodImage } from '@/components/ui/FoodImage'
import { VegIndicator, MetaLine } from '@/components/ui/primitives'
import { CUISINE_LABELS } from '@/types/domain'
import { formatDuration, formatPrice } from '@/lib/utils'

/**
 * Horizontal editorial rail. Deliberately a different card shape from the main
 * grid — a rail of identical cards would read as duplicated content.
 */
export function CollectionRow({ collection }: { collection: Collection }) {
  const recipes = collection.recipeSlugs.map(getRecipe).filter((r) => r != null)
  if (!recipes.length) return null

  return (
    <section className="py-7">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-h2 font-display text-ink">{collection.title}</h2>
            <p className="mt-0.5 text-body text-ink-soft">{collection.subtitle}</p>
          </div>
          <Link
            to="/search"
            className="hidden shrink-0 items-center gap-1 text-meta font-bold text-saffron-deep transition-colors hover:text-saffron sm:flex"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
        {/* Centres the rail on wide screens without breaking the edge-to-edge scroll. */}
        <div className="hidden shrink-0 xl:block xl:w-[max(0px,calc((100vw-72rem)/2))]" />

        {recipes.map((recipe) => (
          <Link
            key={recipe.slug}
            to={`/recipe/${recipe.slug}`}
            className="group w-[248px] shrink-0 snap-start sm:w-[272px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-card shadow-card">
              <FoodImage
                src={recipe.image}
                alt={recipe.name}
                className="transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
              />
              {/* Scrim so the caption stays legible over any photo. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-4 pt-14">
                <div className="mb-1.5 flex items-center gap-2">
                  <VegIndicator value={recipe.vegClass} size={12} />
                  <span className="text-micro uppercase text-white/75">
                    {CUISINE_LABELS[recipe.cuisine]}
                  </span>
                </div>
                <h3 className="text-card text-white">{recipe.name}</h3>
                <MetaLine
                  className="mt-0.5 !text-white/70"
                  parts={[formatDuration(totalTime(recipe)), formatPrice(recipe.estimatedCost)]}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
