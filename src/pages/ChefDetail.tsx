import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, Info, Play } from 'lucide-react'
import { getChef } from '@/data/chefs'
import { getRecipe, totalTime } from '@/data/recipes'
import type { Chef } from '@/types/chef'
import { ChefCinematic } from '@/components/chef/ChefCinematic'
import { FoodImage } from '@/components/ui/FoodImage'
import { VegIndicator } from '@/components/ui/primitives'
import { formatDuration, formatPrice } from '@/lib/utils'
import NotFound from './NotFound'

/**
 * A chef's page.
 *
 * The scroll sequence lives in `ChefCinematic`; this file supplies the two
 * slabs of content it moves between — the dishes on the opening frame, and
 * the profile the sequence resolves into — plus everything below the fold.
 */
export default function ChefDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const chef = getChef(slug)

  // The cinematic is a scroll track; arriving mid-page would start it halfway
  // through. `ScrollToTop` in App handles route changes, but a reload lands
  // wherever the browser restored to.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!chef) return <NotFound />

  return (
    // Pulled up under the app header. The cinematic stage is `h-dvh` and
    // sticks to `top-0`, so without this it starts one header-height down the
    // page and hangs exactly that far past the bottom of the viewport — the
    // opening frame gets clipped before you've scrolled at all. Running the
    // hero under the (translucent, blurred) header is also just the right look
    // for a full-bleed page. `OpeningPlate` carries matching top padding so
    // the type still clears the bar.
    <div className="-mt-[65px] bg-paper">
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed left-4 top-20 z-40 grid size-10 place-items-center rounded-full bg-paper/80 text-ink shadow-card backdrop-blur-md transition-transform active:scale-95 sm:left-6"
      >
        <ArrowLeft size={18} />
      </button>

      <ChefCinematic chef={chef} dishes={<OpeningDishes chef={chef} />} detail={<Profile chef={chef} />} />

      <BelowTheFold chef={chef} />
    </div>
  )
}

/* ── The dishes, on the opening frame ─────────────────────────────────── */

function OpeningDishes({ chef }: { chef: Chef }) {
  return (
    <div className="mt-4 sm:mt-5 [@media(max-height:560px)]:mt-2">
      <p className="mb-2.5 text-micro uppercase text-white/60 [@media(max-height:640px)]:mb-1.5">
        {chef.isRealPerson ? 'Cook from their repertoire' : 'What they cook'}
      </p>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {chef.recipes.map(({ recipeSlug }) => {
          const recipe = getRecipe(recipeSlug)
          if (!recipe) return null
          return (
            <Link
              key={recipeSlug}
              to={`/recipe/${recipeSlug}`}
              className="group w-[124px] shrink-0 sm:w-[152px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-tile ring-1 ring-white/15">
                <FoodImage src={recipe.image} alt={recipe.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 to-transparent" />
              </div>
              <p className="mt-2 truncate text-meta font-bold text-white group-hover:text-saffron">
                {recipe.name}
              </p>
              <p className="truncate text-micro uppercase text-white/55">
                {formatDuration(totalTime(recipe))}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ── The profile the sequence dissolves into ──────────────────────────── */

function Profile({ chef }: { chef: Chef }) {
  return (
    <div className="flex min-h-full items-center px-5 py-16 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-3 text-micro uppercase text-saffron-deep">
          {chef.known.join(' · ')}
        </p>
        <h2 className="text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.02] heading-display text-ink">
          {chef.name}
        </h2>

        {chef.quote && (
          <figure className="mt-6 border-l-2 border-saffron/40 pl-4">
            <blockquote className="text-pretty text-[1.125rem] leading-relaxed text-ink-soft">
              “{chef.quote.text}”
            </blockquote>
            <figcaption className="mt-2 text-meta text-ink-mute">
              {chef.name}, {chef.quote.context} ·{' '}
              <a
                href={chef.quote.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-ink-soft"
              >
                source
              </a>
            </figcaption>
          </figure>
        )}

        <div className="mt-6 space-y-3">
          {chef.bio.map((para) => (
            <p key={para.slice(0, 24)} className="text-pretty text-body leading-relaxed text-ink-soft">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Everything after the sequence releases ───────────────────────────── */

function BelowTheFold({ chef }: { chef: Chef }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
      {/* Recipes, properly this time — the opening frame is a teaser. */}
      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-micro uppercase text-saffron-deep">
              {chef.isRealPerson ? 'In their wheelhouse' : 'Their recipes'}
            </p>
            <h3 className="text-h2 heading-display text-ink">
              {chef.recipes.length} dishes to cook
            </h3>
          </div>
          <Link
            to="/search"
            className="hidden shrink-0 items-center gap-1 text-meta font-bold text-saffron-deep transition-colors hover:text-saffron sm:flex"
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {chef.recipes.map(({ recipeSlug, note }) => {
            const recipe = getRecipe(recipeSlug)
            if (!recipe) return null
            return (
              <Link key={recipeSlug} to={`/recipe/${recipeSlug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card">
                  <FoodImage
                    src={recipe.image}
                    alt={recipe.name}
                    className="transition-transform duration-[600ms] ease-out group-hover:scale-[1.045]"
                  />
                  <div className="absolute right-3 top-3 grid size-6 place-items-center rounded-[6px] bg-paper/92 backdrop-blur-sm">
                    <VegIndicator value={recipe.vegClass} size={13} />
                  </div>
                </div>
                <h4 className="mt-3 text-card text-ink transition-colors group-hover:text-saffron-deep">
                  {recipe.name}
                </h4>
                <p className="mt-1 text-meta text-ink-soft">{note}</p>
                <p className="mt-1.5 text-micro uppercase text-ink-mute">
                  {formatDuration(totalTime(recipe))} · {formatPrice(recipe.estimatedCost)}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {chef.links && <WatchAndFollow chef={chef} />}

      {chef.isRealPerson && <EditorialNotice chef={chef} />}
    </div>
  )
}

function WatchAndFollow({ chef }: { chef: Chef }) {
  const { youtube, site, instagram } = chef.links ?? {}
  if (!youtube && !site && !instagram) return null

  return (
    <section className="border-t border-line py-10">
      <p className="mb-1.5 text-micro uppercase text-saffron-deep">Watch & follow</p>
      <h3 className="text-h2 heading-display text-ink">Straight from the source</h3>
      <p className="mt-1.5 max-w-lg text-body text-ink-soft">
        We don’t reproduce anyone’s method — these go to their own channels.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {youtube && (
          <a
            href={youtube}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-ink-mute"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-nonveg/12 text-nonveg">
              <Play size={17} className="fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-bold text-ink">YouTube channel</span>
              <span className="block truncate text-meta text-ink-soft">
                Full video recipes, in their own words
              </span>
            </span>
            <ExternalLink size={14} className="shrink-0 text-ink-mute group-hover:text-ink" />
          </a>
        )}

        {site && (
          <a
            href={site}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-ink-mute"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-saffron-wash text-saffron-deep text-[0.9375rem] font-extrabold">
              {chef.name[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-bold text-ink">Official site</span>
              <span className="block truncate text-meta text-ink-soft">
                {site.replace(/^https?:\/\//, '')}
              </span>
            </span>
            <ExternalLink size={14} className="shrink-0 text-ink-mute group-hover:text-ink" />
          </a>
        )}

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-ink-mute"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-info/12 text-info text-[0.9375rem] font-extrabold">
              @
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-bold text-ink">Instagram</span>
              <span className="block truncate text-meta text-ink-soft">
                {instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')}
              </span>
            </span>
            <ExternalLink size={14} className="shrink-0 text-ink-mute group-hover:text-ink" />
          </a>
        )}
      </div>
    </section>
  )
}

/**
 * Shown for real people only. A featured-chef page that looks official but
 * isn't is exactly the kind of thing that needs saying out loud rather than
 * being buried in a footer.
 */
function EditorialNotice({ chef }: { chef: Chef }) {
  return (
    <section className="border-t border-line py-8">
      <div className="flex gap-3 rounded-card border border-line bg-sunk/40 p-4">
        <Info size={17} className="mt-0.5 shrink-0 text-ink-mute" />
        <p className="text-meta leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Editorial feature.</span> {chef.name} is a real chef,
          profiled here from public sources. This is a design prototype and is{' '}
          <span className="font-semibold text-ink">not affiliated with or endorsed by him</span>. The
          recipes above are from this app’s own catalogue, matched to cuisines he is publicly
          associated with — they are not his recipes. For those, use the links to his own channels.
        </p>
      </div>
    </section>
  )
}
