import type { ReactNode } from 'react'
import { Star } from 'lucide-react'
import type { VegClass } from '@/types/domain'
import { cn } from '@/lib/utils'

/** Small labelled pill — dietary tags, health tags, difficulty. */
export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'veg' | 'saffron'
  className?: string
}) {
  const tones = {
    neutral: 'border-line bg-surface text-ink-soft',
    veg: 'border-veg/25 bg-veg/8 text-veg',
    saffron: 'border-saffron/25 bg-saffron-wash text-saffron-deep',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2 py-[3px] text-micro uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * FSSAI-style veg/non-veg mark — the bordered square with a filled dot that
 * appears on every packaged food product in India. Instantly readable to the
 * audience, and far better than the word "veg" in small type.
 */
export function VegIndicator({ value, size = 14 }: { value: VegClass; size?: number }) {
  const color =
    value === 'veg' ? 'var(--color-veg)' : value === 'egg' ? 'var(--color-egg)' : 'var(--color-nonveg)'
  const label = value === 'veg' ? 'Vegetarian' : value === 'egg' ? 'Contains egg' : 'Non-vegetarian'

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="grid shrink-0 place-items-center rounded-[3px] border-[1.5px]"
      style={{ width: size, height: size, borderColor: color }}
    >
      <span
        className="rounded-full"
        style={{ width: size * 0.45, height: size * 0.45, background: color }}
      />
    </span>
  )
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-meta text-ink-soft">
      <Star size={13} className="fill-saffron text-saffron" />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      {count != null && <span className="text-ink-mute">({count.toLocaleString('en-IN')})</span>}
    </span>
  )
}

/** Dot-separated meta line: "South Indian · 45 min · Easy · ₹180". */
export function MetaLine({ parts, className }: { parts: (string | null)[]; className?: string }) {
  const items = parts.filter(Boolean) as string[]
  return (
    <p className={cn('text-meta text-ink-soft', className)}>
      {items.map((part, idx) => (
        <span key={part + idx}>
          {idx > 0 && <span className="mx-1.5 text-ink-mute">·</span>}
          {part}
        </span>
      ))}
    </p>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-tile bg-sunk', className)} />
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-6 py-16 text-center">
      {icon && (
        <div className="mb-5 grid size-14 place-items-center rounded-full bg-saffron-wash text-saffron-deep">
          {icon}
        </div>
      )}
      <h3 className="text-h3 heading-display text-ink">{title}</h3>
      {body && <p className="mt-2 text-body text-ink-soft">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/** Section heading with optional trailing action. */
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1.5 text-micro uppercase text-saffron-deep">{eyebrow}</p>}
        <h2 className="text-h2 heading-display text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-body text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
