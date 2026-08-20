import { Check, ExternalLink, Play } from 'lucide-react'
import type { RecipeVariant, CreatorRecipe } from '@/types/recipe'
import type { SpiceLevel } from '@/types/domain'
import { DIFFICULTY_LABELS, SPICE_HEAT, SPICE_LABELS } from '@/types/domain'
import { formatDuration, cn } from '@/lib/utils'
import spiceLevel1 from '@/assets/icons/spice/level1.svg'
import spiceLevel2 from '@/assets/icons/spice/level2.svg'
import spiceLevel3 from '@/assets/icons/spice/level3.svg'

// Custom flame-cluster art, one per heat level — more flames spread wider
// across the same canvas as it gets hotter. Only three drawings exist, so
// "fiery" (heat 4) reuses the level-3 art rather than inventing a fourth
// in a different style; swap in a real level-4 asset if one shows up.
const SPICE_ICON: Record<number, string> = {
  1: spiceLevel1,
  2: spiceLevel2,
  3: spiceLevel3,
  4: spiceLevel3,
}

/**
 * The left badge for a spice-level row — the custom flame-cluster artwork
 * for that heat level, standing in for both the icon and the meter.
 */
function SpiceBadge({ level }: { level: SpiceLevel }) {
  const heat = SPICE_HEAT[level]
  return (
    <div
      title={SPICE_LABELS[level]}
      className="grid size-14 shrink-0 place-items-center rounded-tile bg-sunk p-2"
    >
      <img src={SPICE_ICON[heat]} alt="" aria-hidden className="h-auto w-full object-contain" />
    </div>
  )
}

/**
 * One combined, single-choice list: "how spicy do you want it" and "whose
 * recipe do you want to follow" are the same question, answered two
 * different ways — so they render as one continuous list of same-shaped
 * rows, not a chip row sitting above an unrelated-looking card list. Every
 * row — spice level or chef — gets a left badge, a title, a description
 * line, a meta line, and the same selected-checkmark on the right.
 */
export function TasteAndCreators({
  variants,
  selectedVariantId,
  onSelectVariant,
  creators,
  selectedCreatorId,
  onSelectCreator,
}: {
  variants: RecipeVariant[]
  selectedVariantId: string | null
  onSelectVariant: (id: string) => void
  creators: CreatorRecipe[]
  selectedCreatorId: string | null
  onSelectCreator: (id: string | null) => void
}) {
  if (variants.length === 0 && creators.length === 0) return null

  return (
    <div className="divide-y divide-line rounded-card border border-line bg-surface">
      {variants.map((variant) => {
        const selected = variant.id === selectedVariantId && !selectedCreatorId
        return (
          <button
            key={variant.id}
            onClick={() => onSelectVariant(variant.id)}
            className={cn(
              'flex w-full items-center gap-3 p-3 text-left transition-colors',
              selected ? 'bg-saffron-wash/40' : 'hover:bg-sunk',
            )}
          >
            <SpiceBadge level={variant.spiceLevel} />

            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-bold text-ink">{variant.name}</p>
              <p className="mt-0.5 line-clamp-1 text-meta text-ink-soft">{variant.description}</p>
              <p className="mt-1 text-micro uppercase text-ink-mute">
                {formatDuration(variant.timeMins)} · {DIFFICULTY_LABELS[variant.difficulty]}
              </p>
            </div>

            {selected && (
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-white">
                <Check size={13} strokeWidth={3} />
              </span>
            )}
          </button>
        )
      })}

      {creators.length > 0 && (
        <div className="bg-sunk/50 px-3 py-2">
          <p className="text-micro uppercase text-saffron-deep">Follow our best cooks</p>
        </div>
      )}

      {creators.map((creator) => {
        const selected = creator.id === selectedCreatorId
        return (
          <button
            key={creator.id}
            onClick={() => onSelectCreator(selected ? null : creator.id)}
            className={cn(
              'flex w-full items-center gap-3 p-3 text-left transition-colors',
              selected ? 'bg-saffron-wash/40' : 'hover:bg-sunk',
            )}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-tile">
              <img
                src={creator.thumbnail}
                alt=""
                aria-hidden
                className="size-full object-cover"
                loading="lazy"
              />
              {creator.hasVideo && (
                <span className="absolute inset-0 grid place-items-center bg-scrim/25">
                  <Play size={14} className="fill-white text-white" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <img src={creator.creatorAvatar} alt="" aria-hidden className="size-4 shrink-0 rounded-full" />
                <p className="truncate text-meta font-bold text-ink">{creator.creatorName}</p>
              </div>
              <p className="mt-0.5 truncate text-[0.9375rem] font-semibold text-ink">{creator.title}</p>
              <p className="mt-0.5 line-clamp-1 text-meta text-ink-soft">{creator.blurb}</p>
              <p className="mt-1 text-micro uppercase text-ink-mute">{formatDuration(creator.timeMins)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {selected && (
                <span className="grid size-6 place-items-center rounded-full bg-saffron text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
              {creator.sourceUrl && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-ink-mute">
                  YouTube <ExternalLink size={10} />
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
