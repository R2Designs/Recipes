import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { getRecipeBySlug } from '@/services/recipeService'
import { getShoppingList } from '@/services/scalingService'
import { useSelectionStore } from '@/store/useSelectionStore'
import { Skeleton } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { RecipeDetailBody } from '@/components/recipe/RecipeDetailBody'
import { formatPrice, formatServings, pluralise } from '@/lib/utils'

/**
 * In-app recipe view: a fixed-height overlay over the still-mounted grid
 * behind it, so browsing recipes never leaves the page you were scrolling.
 * Content scrolls inside the frame; the CTA stays put as the last flex child
 * rather than viewport-`fixed`, which is what makes it "sticky" without
 * fighting the modal's own bounds. Rendered by `App` alongside a background
 * route — see the `backgroundLocation` routing there.
 */
export function RecipeModal() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  const selection = useSelectionStore()
  const { selectRecipe } = selection

  const close = () => navigate(-1)

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A slug that doesn't resolve to a recipe shouldn't hang a blank modal open.
  useEffect(() => {
    if (!loading && !recipe) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, recipe])

  const shoppingList = useMemo(() => {
    if (!recipe) return []
    return getShoppingList(recipe, selection.variantId, selection.servings)
  }, [recipe, selection.variantId, selection.servings])

  const costAtServings = recipe
    ? Math.round((recipe.estimatedCost / recipe.baseServings) * selection.servings)
    : 0
  const activeVariant = recipe?.variants.find((v) => v.id === selection.variantId)

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="absolute inset-0 bg-scrim/50 backdrop-blur-[2px]"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={recipe?.name ?? 'Recipe'}
          initial={{ y: '100%', opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.4 }}
          transition={{ type: 'spring', damping: 32, stiffness: 340 }}
          className="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-[24px] bg-paper shadow-pop sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-card"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {loading || !recipe ? (
              <ModalSkeleton />
            ) : (
              <RecipeDetailBody
                recipe={recipe}
                selection={selection}
                shoppingList={shoppingList}
                onClose={close}
                closeIcon="close"
                heroHeightClass="h-[34vh] min-h-[220px] sm:h-[280px]"
              />
            )}
          </div>

          {!loading && recipe && (
            <div
              className="shrink-0 border-t border-line bg-paper/98 px-4 py-3 shadow-bar backdrop-blur-xl sm:px-6"
              style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  )
}

function ModalSkeleton() {
  return (
    <div>
      <Skeleton className="h-[34vh] min-h-[220px] w-full rounded-none sm:h-[280px]" />
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
