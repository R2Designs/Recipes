import { Play, Check, ExternalLink } from 'lucide-react'
import type { CreatorRecipe } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/domain'
import { FoodImage } from '@/components/ui/FoodImage'
import { SpiceMeter } from '@/components/ui/primitives'
import { formatDuration, cn } from '@/lib/utils'

/**
 * "Popular ways to make X."
 *
 * We show who made it, how hot it is and how long it takes — then link out.
 * Reproducing a creator's method here would make this a recipe blog and take
 * their work; the product's job is discovery and procurement.
 */
export function CreatorRail({
  creators,
  selectedId,
  onSelect,
}: {
  creators: CreatorRecipe[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {creators.map((creator) => {
        const selected = creator.id === selectedId
        return (
          <div
            key={creator.id}
            className={cn(
              'group flex w-[264px] shrink-0 flex-col overflow-hidden rounded-card border bg-surface',
              'transition-[border-color,box-shadow] duration-200',
              selected ? 'border-saffron/50 shadow-card' : 'border-line hover:shadow-card',
            )}
          >
            <button
              onClick={() => onSelect(selected ? null : creator.id)}
              className="relative block aspect-[16/9] overflow-hidden text-left"
            >
              <FoodImage
                src={creator.thumbnail}
                alt={creator.title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              {creator.hasVideo && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-11 place-items-center rounded-full bg-ink/55 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                    <Play size={16} className="ml-0.5 fill-white text-white" />
                  </span>
                </span>
              )}
              {selected && (
                <span className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-saffron text-white shadow-card">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
            </button>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <img
                  src={creator.creatorAvatar}
                  alt=""
                  className="size-7 shrink-0 rounded-full"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-meta font-bold text-ink">{creator.creatorName}</p>
                  {creator.followerLabel && (
                    <p className="truncate text-[11px] text-ink-mute">{creator.followerLabel}</p>
                  )}
                </div>
              </div>

              <h3 className="text-[0.9375rem] font-bold leading-snug tracking-[-0.01em] text-ink">
                {creator.title}
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-meta leading-relaxed text-ink-soft">
                {creator.blurb}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-micro uppercase text-ink-mute">
                  {formatDuration(creator.timeMins)} · {DIFFICULTY_LABELS[creator.difficulty]}
                </span>
                <SpiceMeter level={creator.spiceLevel} />
              </div>

              <button
                onClick={() => onSelect(selected ? null : creator.id)}
                className={cn(
                  'mt-3.5 h-9 w-full rounded-pill text-meta font-bold transition-colors',
                  selected
                    ? 'bg-saffron text-white hover:bg-saffron-deep'
                    : 'border border-line text-ink-soft hover:border-ink-mute hover:text-ink',
                )}
              >
                {selected ? 'Following this recipe' : 'Follow this recipe'}
              </button>

              {creator.sourceUrl && (
                <a
                  href={creator.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-ink-mute hover:text-ink-soft"
                >
                  View original <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
