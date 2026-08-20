import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection, Recipe } from '@/types/recipe'
import { getFeaturedCollections, listRecipes } from '@/services/recipeService'
import { Hero } from '@/components/home/Hero'
import { IntentChips } from '@/components/home/IntentChips'
import { CollectionRow } from '@/components/home/CollectionRow'
import { ChefRail } from '@/components/home/ChefRail'
import { RecipeCard, RecipeCardSkeleton } from '@/components/recipe/RecipeCard'
import { CHEFS } from '@/data/chefs'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([listRecipes({ sort: 'popular' }), getFeaturedCollections()]).then(([r, c]) => {
      if (!alive) return
      setRecipes(r)
      setCollections(c)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      <Hero />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <IntentChips />
      </div>

      {/* Popular grid first — the fastest path to "just show me food." Regional
          rails (a slower, more editorial browse) follow it. */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-micro uppercase text-saffron-deep">Everything</p>
            <h2 className="text-h2 heading-display text-ink">Popular right now</h2>
          </div>
          <Link
            to="/search"
            className="flex shrink-0 items-center gap-1 text-meta font-bold text-saffron-deep transition-colors hover:text-saffron"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <RecipeCardSkeleton key={i} />)
            : recipes.slice(0, 12).map((recipe, i) => (
                <RecipeCard key={recipe.slug} recipe={recipe} index={i} />
              ))}
        </div>
      </section>

      {/* Chefs sit between the grid and the regional rails deliberately — it's
          a change of pace, and it stops the page being six variations on the
          same food card all the way down. */}
      <ChefRail chefs={CHEFS} />

      {!loading &&
        collections.map((collection) => <CollectionRow key={collection.id} collection={collection} />)}
    </>
  )
}
