import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, PackageSearch } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import type { ScaledIngredient } from '@/types/ingredient'
import { getRecipeBySlug } from '@/services/recipeService'
import { getShoppingList } from '@/services/scalingService'
import { matchAll } from '@/services/ingredientMatcher'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useCartStore } from '@/store/useCartStore'
import { orderableLines, priceCart } from '@/services/cartService'
import { IngredientRow } from '@/components/procurement/IngredientRow'
import { ProductSwapSheet } from '@/components/procurement/ProductSwapSheet'
import { ServingSelector } from '@/components/recipe/ServingSelector'
import { Button } from '@/components/ui/Button'
import { StickyActionBar } from '@/components/ui/StickyActionBar'
import { Skeleton, EmptyState } from '@/components/ui/primitives'
import { formatPrice, formatServings, pluralise } from '@/lib/utils'
import NotFound from './NotFound'

export default function Ingredients() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const selection = useSelectionStore()
  const cartStore = useCartStore()
  const { selectRecipe } = selection

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(true)
  const [swapIngredient, setSwapIngredient] = useState<ScaledIngredient | null>(null)

  // Deep-link support: landing here directly with no prior selection defaults
  // to the first variant at the recipe's base serving count.
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

  const shoppingList = useMemo(() => {
    if (!recipe) return []
    return getShoppingList(recipe, selection.variantId, selection.servings)
  }, [recipe, selection.variantId, selection.servings])

  // Re-match products whenever the underlying ingredient list changes —
  // servings, variant, or recipe.
  useEffect(() => {
    if (!recipe || shoppingList.length === 0) return
    let alive = true
    setMatching(true)

    matchAll(shoppingList).then((matches) => {
      if (!alive) return
      const variant = recipe.variants.find((v) => v.id === selection.variantId)
      const creator = recipe.creators.find((c) => c.id === selection.creatorId)
      const existing = cartStore.cart?.recipeSlug === recipe.slug ? cartStore.cart : null

      cartStore.buildCart({
        recipeSlug: recipe.slug,
        recipeName: recipe.name,
        recipeImage: recipe.image,
        variantId: selection.variantId,
        variantName: variant?.name ?? null,
        creatorId: selection.creatorId,
        creatorName: creator?.creatorName ?? null,
        servings: selection.servings,
        ingredients: shoppingList,
        matches,
        // Preserve what the user already ticked/removed when servings change.
        ownedIngredientIds: existing
          ? new Set(existing.lines.filter((l) => l.alreadyHave).map((l) => l.lineId))
          : undefined,
        deliveryEstimateMins: 28,
      })
      setMatching(false)
    })

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, shoppingList])

  if (loading) return <IngredientsSkeleton />
  if (!recipe) return <NotFound />

  const cart = cartStore.cart
  const lines = cart?.lines ?? []
  const totals = cart ? priceCart(cart) : null
  const activeLines = lines.filter((l) => !l.removed)
  const removedLines = lines.filter((l) => l.removed)
  const orderable = cart ? orderableLines(cart) : []

  return (
    <div className="pb-32">
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 sm:px-6">
        <button
          onClick={() => navigate(`/recipe/${recipe.slug}`)}
          className="mb-4 inline-flex items-center gap-1.5 text-meta font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={14} /> {recipe.name}
        </button>

        <h1 className="text-h1 text-ink">Everything you need</h1>
        <p className="mt-1.5 text-body text-ink-soft">
          For <span className="font-semibold text-ink">{recipe.name}</span>
          {cart?.variantName && cart.variantName !== 'Classic' && ` · ${cart.variantName}`}
        </p>

        {/* Servings — editable right here, the list rescales live. */}
        <div className="mt-5 rounded-card border border-line bg-surface p-4">
          <p className="mb-2.5 text-micro uppercase text-ink-mute">
            Cooking for {formatServings(selection.servings)}
          </p>
          <ServingSelector value={selection.servings} onChange={selection.setServings} compact />
        </div>

        {/* Shopping list */}
        <div className="mt-6">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-h3 text-ink">Ingredients</h2>
            <span className="text-meta text-ink-mute">{pluralise(activeLines.length, 'item')}</span>
          </div>

          <div className="divide-y divide-line">
            {matching
              ? Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <Skeleton className="size-6 rounded-[7px]" />
                    <Skeleton className="size-[52px] rounded-tile" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-2/5" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))
              : activeLines.map((line) => (
                  <IngredientRow
                    key={line.lineId}
                    line={line}
                    onToggleHave={() => cartStore.toggleAlreadyHave(line.lineId)}
                    onSetPackQty={(qty) => cartStore.setPackQty(line.lineId, qty)}
                    onRemove={() => cartStore.removeLine(line.lineId)}
                    onRestore={() => cartStore.restoreLine(line.lineId)}
                    onOpenSwap={() => setSwapIngredient(line.ingredient)}
                  />
                ))}
          </div>

          {!matching && activeLines.length === 0 && (
            <EmptyState
              icon={<PackageSearch size={22} />}
              title="Nothing left on the list"
              body="You’ve removed every ingredient. Undo below, or head back and pick something else to cook."
              action={
                removedLines.length > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => removedLines.forEach((l) => cartStore.restoreLine(l.lineId))}
                  >
                    Undo all removals
                  </Button>
                ) : undefined
              }
            />
          )}

          {!matching && removedLines.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 text-micro uppercase text-ink-mute">
                {pluralise(removedLines.length, 'item')} removed
              </p>
              <div className="divide-y divide-line">
                {removedLines.map((line) => (
                  <IngredientRow
                    key={line.lineId}
                    line={line}
                    onToggleHave={() => cartStore.toggleAlreadyHave(line.lineId)}
                    onSetPackQty={(qty) => cartStore.setPackQty(line.lineId, qty)}
                    onRemove={() => cartStore.removeLine(line.lineId)}
                    onRestore={() => cartStore.restoreLine(line.lineId)}
                    onOpenSwap={() => setSwapIngredient(line.ingredient)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!matching && totals && (
        <StickyActionBar>
          <div className="min-w-0 flex-1">
            <p className="text-meta font-bold text-ink">
              {pluralise(orderable.length, 'item')}
              {totals.alreadyHaveCount > 0 && ` · ${totals.alreadyHaveCount} you have`}
            </p>
            <p className="text-[1.0625rem] font-extrabold tabular-nums text-ink">
              {formatPrice(totals.subtotal)}
            </p>
          </div>
          <Button size="lg" disabled={orderable.length === 0} onClick={() => navigate('/cart')}>
            Review basket
            <ArrowRight size={17} />
          </Button>
        </StickyActionBar>
      )}

      <ProductSwapSheet
        open={!!swapIngredient}
        onClose={() => setSwapIngredient(null)}
        ingredient={swapIngredient}
        currentProductId={lines.find((l) => l.lineId === swapIngredient?.ingredientId)?.product?.id}
        onSelect={(product) => {
          if (swapIngredient) cartStore.swapProduct(swapIngredient.ingredientId, product)
        }}
      />
    </div>
  )
}

function IngredientsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8 sm:px-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}
