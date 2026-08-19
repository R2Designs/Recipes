import { Check, Play, ExternalLink } from 'lucide-react'
import type { RecipeVariant, CreatorRecipe } from '@/types/recipe'
import { DIFFICULTY_LABELS } from '@/types/domain'
import { Chip } from '@/components/ui/Chip'
import { SpiceMeter } from '@/components/ui/primitives'
import { formatDuration, cn } from '@/lib/utils'

/**
 * One combined section: "how spicy do you want it" plus "whose recipe do you
 * want to follow" — deliberately merged rather than two separate steps.
 * Neither choice needs a photo grid to be legible: spice level is a chip row
 * (the flame icons carry the information a thumbnail used to), and creators
 * are a compact list, not cards, since the thing that differentiates them is
 * a sentence, not an image.
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
  const activeVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0]

  return (
    <div>
      {variants.length > 0 && (
        <div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {variants.map((variant) => (
              <Chip
                key={variant.id}
                // A chef's pick and a spice-level chip answer the same question —
                // only one can read as "selected" at a time, so a chip never shows
                // active while a creator row is.
                selected={variant.id === selectedVariantId && !selectedCreatorId}
                onClick={() => onSelectVariant(variant.id)}
              >
                {variant.name}
                <SpiceMeter level={variant.spiceLevel} />
              </Chip>
            ))}
          </div>

          {activeVariant && (
            <div className="mt-4 rounded-card border border-line bg-surface p-4">
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                {activeVariant.description}
              </p>
              <p className="mt-2 text-meta text-ink-mute">
                {formatDuration(activeVariant.timeMins)} · {DIFFICULTY_LABELS[activeVariant.difficulty]}
              </p>
            </div>
          )}
        </div>
      )}

      {creators.length > 0 && (
        <div className={variants.length > 0 ? 'mt-7' : undefined}>
          <p className="mb-3 text-micro uppercase text-saffron-deep">Follow our best cooks</p>

          <div className="divide-y divide-line rounded-card border border-line bg-surface">
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
                    <p className="mt-0.5 truncate text-[0.9375rem] font-semibold text-ink">
                      {creator.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-meta text-ink-soft">{creator.blurb}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <SpiceMeter level={creator.spiceLevel} />
                      <span className="text-micro uppercase text-ink-mute">
                        {formatDuration(creator.timeMins)}
                      </span>
                    </div>
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
        </div>
      )}
    </div>
  )
}
