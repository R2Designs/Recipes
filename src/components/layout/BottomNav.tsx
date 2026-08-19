import { Link, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingBasket } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { orderableLines } from '@/services/cartService'
import { cn } from '@/lib/utils'

/** Mobile-only tab bar. Hidden from `sm` up, where the header carries navigation. */
export function BottomNav() {
  const { pathname } = useLocation()
  const cart = useCartStore((s) => s.cart)
  const count = cart ? orderableLines(cart).reduce((n, l) => n + l.packQty, 0) : 0

  const tabs = [
    { to: '/', label: 'Discover', icon: Home, active: pathname === '/' },
    { to: '/search', label: 'Search', icon: Search, active: pathname === '/search' },
    { to: '/cart', label: 'Basket', icon: ShoppingBasket, active: pathname === '/cart', count },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-lg sm:hidden"
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex h-14 items-stretch">
        {tabs.map(({ to, label, icon: Icon, active, count: c }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors',
              active ? 'text-saffron-deep' : 'text-ink-mute',
            )}
          >
            <span className="relative">
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              {!!c && (
                <span className="absolute -right-2 -top-1 grid min-w-[16px] place-items-center rounded-pill bg-saffron px-1 text-[10px] font-bold text-white">
                  {c}
                </span>
              )}
            </span>
            <span className="text-[10px] font-bold tracking-[0.02em]">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
