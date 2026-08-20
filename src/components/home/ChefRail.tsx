import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Chef } from '@/types/chef'
import { cn } from '@/lib/utils'

/**
 * The chefs carousel.
 *
 * Deliberately a different object from `CollectionRow`: taller portrait cards,
 * a desaturated resting state that comes to colour on hover, and the chef's
 * name set large in the display serif so it straddles the bottom edge of the
 * photograph rather than sitting politely beneath it. The recipe rails are a
 * catalogue; this is meant to read as a masthead.
 */
export function ChefRail({ chefs }: { chefs: Chef[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [showFade, setShowFade] = useState(false)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth
      setShowFade(max > 4 && rail.scrollLeft < max - 4)
    }
    update()
    rail.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      rail.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [chefs.length])

  if (!chefs.length) return null

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-micro uppercase text-saffron-deep">The people who cook</p>
            <h2 className="text-h2 heading-display text-ink">Chefs worth following</h2>
            <p className="mt-1 max-w-md text-body text-ink-soft">
              Cooks with a point of view — and the dishes they’re known for.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-4 px-4 pb-3 sm:scroll-pl-6 sm:px-6"
        >
          {/* Centres the rail on wide screens; snap-start so the browser's
              initial snap doesn't skip it and eat the left gutter. */}
          <div className="hidden shrink-0 snap-start xl:block xl:w-[max(0px,calc((100vw-72rem)/2))]" />

          {chefs.map((chef, i) => (
            <Link
              key={chef.slug}
              to={`/chef/${chef.slug}`}
              className="group w-[276px] shrink-0 snap-start sm:w-[320px]"
            >
              <article className="relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-card shadow-card">
                  <img
                    src={chef.portrait}
                    alt={chef.name}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={cn(
                      'size-full object-cover',
                      // Rests desaturated and comes to full colour on hover —
                      // the whole rail reads as one editorial spread until you
                      // reach for a specific chef.
                      'saturate-[0.55] transition-[filter,transform] duration-[700ms] ease-out',
                      'group-hover:scale-[1.04] group-hover:saturate-100',
                    )}
                  />

                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-scrim via-scrim/55 to-transparent" />

                  {/* Index — a masthead device, not information. */}
                  <span
                    aria-hidden
                    className="absolute right-4 top-3 text-[2.75rem] leading-none text-white/15 heading-display"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
                    <p className="mb-1.5 text-micro uppercase text-white/70">{chef.city}</p>
                    {/* Breaks the left margin so the name sits against the
                        frame edge rather than inside a tidy box. */}
                    <h3 className="-ml-0.5 text-[1.75rem] leading-[1.05] heading-display text-white">
                      {chef.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3 px-0.5 pt-3">
                  <div className="min-w-0">
                    <p className="text-meta font-semibold text-ink">{chef.role}</p>
                    <p className="mt-0.5 line-clamp-2 text-meta text-ink-soft">{chef.tagline}</p>
                  </div>
                  <span className="mt-0.5 shrink-0 text-ink-mute transition-colors group-hover:text-saffron">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </article>
            </Link>
          ))}

          {/* Tail card — a way out of the rail rather than a dead end. */}
          <Link
            to="/search"
            className="group flex w-[220px] shrink-0 snap-start items-center sm:w-[240px]"
          >
            <div className="flex aspect-[3/4] w-full flex-col items-start justify-end rounded-card border border-line bg-surface p-5 transition-colors group-hover:border-ink-mute">
              <span className="mb-2 grid size-9 place-items-center rounded-full bg-saffron-wash text-saffron-deep">
                <ArrowRight size={16} />
              </span>
              <p className="text-[1.0625rem] heading-display text-ink">Browse every dish</p>
              <p className="mt-1 text-meta text-ink-soft">
                All {chefs.length} chefs cook from the same catalogue.
              </p>
            </div>
          </Link>
        </div>

        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent transition-opacity duration-200 sm:w-28',
            showFade ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </section>
  )
}
