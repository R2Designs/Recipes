import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search, ArrowRight } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'
import { suggestRecipes } from '@/services/recipeService'
import { FoodImage } from '@/components/ui/FoodImage'
import { CUISINE_LABELS } from '@/types/domain'

export function Hero() {
  const navigate = useNavigate()
  const setQuery = useFilterStore((s) => s.setQuery)
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const suggestions = focused ? suggestRecipes(value, 5) : []

  function submit(q: string) {
    setQuery(q)
    navigate('/search')
  }

  return (
    <section className="relative px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
      <div className="mx-auto w-full max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-micro uppercase text-saffron-deep"
        >
          Discover · Scale · Shop
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-display heading-display text-balance text-ink"
        >
          Let's start cooking!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-md text-pretty text-[1.0625rem] leading-relaxed text-ink-soft"
        >
          Discover something delicious. Get everything you need to make it.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mx-auto mt-8 max-w-xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(value)
            }}
            className="relative"
          >
            <Search
              size={19}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 140)}
              placeholder="Search dosa, biryani, pasta, paneer..."
              aria-label="Search recipes"
              className="h-[60px] w-full rounded-pill border border-line bg-surface pl-[52px] pr-14 text-[1rem] text-ink shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-ink-mute focus:border-saffron/40 focus:shadow-lift"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-saffron text-white transition-colors hover:bg-saffron-deep active:scale-95"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-card border border-line bg-surface py-1.5 text-left shadow-pop">
              {suggestions.map((r) => (
                <button
                  key={r.slug}
                  onMouseDown={() => navigate(`/recipe/${r.slug}`)}
                  className="flex w-full items-center gap-3 px-3 py-2 transition-colors hover:bg-sunk"
                >
                  <div className="size-10 shrink-0 overflow-hidden rounded-[10px]">
                    <FoodImage src={r.image} alt={r.name} />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-bold text-ink">
                      {r.name}
                    </span>
                    <span className="block truncate text-meta text-ink-mute">
                      {CUISINE_LABELS[r.cuisine]}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
