import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Recipe } from '@/types/recipe'
import { CUISINE_LABELS, DIFFICULTY_LABELS, DIETARY_LABELS, HEALTH_LABELS } from '@/types/domain'
import { FoodImage } from '@/components/ui/FoodImage'
import { Rating, Tag, VegIndicator, MetaLine } from '@/components/ui/primitives'
import { formatDuration, formatPrice } from '@/lib/utils'
import { totalTime } from '@/data/recipes'

/**
 * The editorial recipe card. Photography is the largest element by a wide
 * margin — everything else is a caption under it.
 */
export function RecipeCard({ recipe, index = 0 }: { recipe: Recipe; index?: number }) {
  const location = useLocation()
  // At most two tags — a card with six pills stops reading as editorial.
  const tags = [
    ...recipe.dietaryTags.slice(0, 1).map((t) => ({ label: DIETARY_LABELS[t], veg: true })),
    ...recipe.healthTags.slice(0, 1).map((t) => ({ label: HEALTH_LABELS[t], veg: false })),
  ].slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.32), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/recipe/${recipe.slug}`}
        state={{ backgroundLocation: location }}
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card">
          <FoodImage
            src={recipe.image}
            alt={recipe.name}
            eager={index < 4}
            className="transition-transform duration-[600ms] ease-out group-hover:scale-[1.045]"
          />

          {recipe.rating && (
            <div className="absolute left-3 top-3 rounded-pill bg-paper/92 px-2 py-1 backdrop-blur-sm">
              <Rating value={recipe.rating.value} />
            </div>
          )}

          <div className="absolute right-3 top-3 grid size-6 place-items-center rounded-[6px] bg-paper/92 backdrop-blur-sm">
            <VegIndicator value={recipe.vegClass} size={13} />
          </div>
        </div>

        <div className="px-0.5 pt-3">
          <h3 className="text-card text-ink transition-colors group-hover:text-saffron-deep">
            {recipe.name}
          </h3>

          <MetaLine
            className="mt-1"
            parts={[
              CUISINE_LABELS[recipe.cuisine],
              formatDuration(totalTime(recipe)),
              DIFFICULTY_LABELS[recipe.difficulty],
              formatPrice(recipe.estimatedCost),
            ]}
          />

          {tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Tag key={t.label} tone={t.veg ? 'veg' : 'neutral'}>
                  {t.label}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export function RecipeCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] animate-pulse rounded-card bg-sunk" />
      <div className="space-y-2 px-0.5 pt-3">
        <div className="h-4 w-3/5 animate-pulse rounded-pill bg-sunk" />
        <div className="h-3 w-4/5 animate-pulse rounded-pill bg-sunk" />
      </div>
    </div>
  )
}
