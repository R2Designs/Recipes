import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBasket, UserRound } from 'lucide-react'
import logoMark from '@/assets/logo/logo-mark.svg'
import logoFull from '@/assets/logo/logo-full.svg'
import { useCartStore } from '@/store/useCartStore'
import { orderableLines } from '@/services/cartService'
import { MEAL_LABELS } from '@/types/domain'
import type { MealType } from '@/types/domain'
import { useFilterStore } from '@/store/useFilterStore'
import { cn } from '@/lib/utils'

const NAV_MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink']

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const cart = useCartStore((s) => s.cart)
  const setQuery = useFilterStore((s) => s.setQuery)
  const toggle = useFilterStore((s) => s.toggle)
  const clearAll = useFilterStore((s) => s.clearAll)

  const count = cart ? orderableLines(cart).reduce((n, l) => n + l.packQty, 0) : 0
  const onSearchPage = location.pathname === '/search'

  function goToMeal(meal: MealType) {
    clearAll()
    setQuery('')
    toggle('meal', meal)
    navigate('/search')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="mr-1 flex items-center" aria-label="Recipes — home">
          <img src={logoMark} alt="" className="size-8 sm:hidden" />
          <img src={logoFull} alt="Recipes" className="hidden h-9 w-auto sm:block" />
        </Link>

        {/* Meal nav — desktop only; mobile uses the bottom nav and intent chips. */}
        <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
          {NAV_MEALS.map((meal) => (
            <button
              key={meal}
              onClick={() => goToMeal(meal)}
              className="rounded-pill px-3 py-1.5 text-meta font-semibold text-ink-soft transition-colors hover:bg-sunk hover:text-ink"
            >
              {MEAL_LABELS[meal]}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {!onSearchPage && (
          <button
            onClick={() => navigate('/search')}
            aria-label="Search recipes"
            className="grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunk hover:text-ink"
          >
            <Search size={19} />
          </button>
        )}

        <Link
          to="/cart"
          aria-label={count ? `Basket, ${count} items` : 'Basket'}
          className="relative grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunk hover:text-ink"
        >
          <ShoppingBasket size={19} />
          {count > 0 && (
            <span
              className={cn(
                'absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-pill',
                'bg-saffron px-1 text-[10px] font-bold text-white',
              )}
            >
              {count}
            </span>
          )}
        </Link>

        <button
          aria-label="Account"
          className="hidden size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunk hover:text-ink sm:grid"
        >
          <UserRound size={19} />
        </button>
      </div>
    </header>
  )
}
