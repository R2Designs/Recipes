import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { getRecipeBySlug } from '@/services/recipeService'
import { getShoppingList } from '@/services/scalingService'
import { useSelectionStore } from '@/store/useSelectionStore'
import { Skeleton } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { StickyActionBar } from '@/components/ui/StickyActionBar'
import { RecipeDetailBody } from '@/components/recipe/RecipeDetailBody'
import { formatPrice, formatServings, pluralise } from '@/lib/utils'
import NotFound from './NotFound'

/**
 * Full-page recipe view — used for direct/shared links and as the fallback
 * when a recipe is opened without app navigation state (e.g. a hard refresh
 * while `RecipeModal` was open). In-app browsing opens `RecipeModal` instead;
 * both render the same `RecipeDetailBody`.
 */
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

  const costAtServings = Math.round(
    (recipe.estimatedCost / recipe.baseServings) * selection.servings,
  )
  const activeVariant = recipe.variants.find((v) => v.id === selection.variantId)

  return (
    <div className="pb-28">
      <RecipeDetailBody
        recipe={recipe}
        selection={selection}
        shoppingList={shoppingList}
        onClose={() => navigate(-1)}
        closeIcon="back"
      />

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
