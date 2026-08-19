import { Info } from 'lucide-react'

/**
 * Shown on every screen that looks like commerce.
 *
 * Non-dismissible by design. A prototype that renders an order summary,
 * a total and a delivery ETA is one glance away from being mistaken for a real
 * purchase — so it says so, plainly, every time.
 */
export function MockDataBanner({ tone = 'default' }: { tone?: 'default' | 'strong' }) {
  return (
    <div
      className={
        tone === 'strong'
          ? 'flex items-start gap-2.5 rounded-tile border border-saffron/25 bg-saffron-wash px-3.5 py-3'
          : 'flex items-start gap-2.5 rounded-tile border border-line bg-sunk/60 px-3.5 py-3'
      }
    >
      <Info
        size={15}
        className={tone === 'strong' ? 'mt-0.5 shrink-0 text-saffron-deep' : 'mt-0.5 shrink-0 text-ink-mute'}
      />
      <p className="text-meta text-ink-soft">
        <span className="font-bold text-ink">Demo mode.</span> Instamart isn’t connected — no real
        order is placed and nothing is charged.
      </p>
    </div>
  )
}
