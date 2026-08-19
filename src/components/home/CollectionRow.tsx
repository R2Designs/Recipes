import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '@/types/recipe'
import { getRecipe, totalTime } from '@/data/recipes'
import { FoodImage } from '@/components/ui/FoodImage'
import { VegIndicator, MetaLine } from '@/components/ui/primitives'
import { CUISINE_LABELS } from '@/types/domain'
import { cn, formatDuration, formatPrice } from '@/lib/utils'

/**
 * Horizontal editorial rail. Deliberately a different card shape from the main
 * grid — a rail of identical cards would read as duplicated content.
 */
export function CollectionRow({ collection }: { collection: Collection }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [showRightFade, setShowRightFade] = useState(false)
  const recipes = collection.recipeSlugs.map(getRecipe).filter((r) => r != null)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    // Only a hint that there's more to scroll — hide it once the last card is
    // actually in view rather than leaving it permanently glued over the edge.
    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth
      setShowRightFade(maxScroll > 4 && rail.scrollLeft < maxScroll - 4)
    }
    update()
    rail.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      rail.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [recipes.length])

  if (!recipes.length) return null

  return (
    <section className="py-7">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-h2 heading-display text-ink">{collection.title}</h2>
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

      <div className="relative">
        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2 sm:scroll-pl-6 sm:px-6"
        >
          {/* Centres the rail on wide screens without breaking the edge-to-edge scroll.
              `snap-start` here too: without it, this spacer isn't a valid snap point, so
              on any row with enough cards to overflow, the browser's initial snap pass
              jumps straight to card 1 and skips the spacer — silently eating the left
              gutter on wide screens exactly like the padding bug on mobile did. Rows with
              too few cards to overflow never hit this, which is why some rails looked
              correctly aligned and others didn't. */}
          <div className="hidden shrink-0 snap-start xl:block xl:w-[max(0px,calc((100vw-72rem)/2))]" />

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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-scrim/85 via-scrim/35 to-transparent p-4 pt-14">
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

        {/* Fades the trailing edge toward the page background — a wordless
            "there's more" cue for a rail with no visible scrollbar. */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent transition-opacity duration-200 sm:w-28',
            showRightFade ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </section>
  )
}
