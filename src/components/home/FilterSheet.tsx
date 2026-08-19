import { Sheet } from '@/components/ui/Sheet'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { useFilterStore, TIME_BANDS, BUDGET_BANDS } from '@/store/useFilterStore'
import {
  CUISINE_LABELS,
  MEAL_LABELS,
  DIETARY_LABELS,
  HEALTH_LABELS,
  DIFFICULTY_LABELS,
} from '@/types/domain'
import type { Cuisine, DietaryTag, Difficulty, HealthTag, MealType } from '@/types/domain'
import { pluralise } from '@/lib/utils'

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <h3 className="mb-3 text-micro uppercase text-ink-mute">{label}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function FilterSheet({
  open,
  onClose,
  resultCount,
}: {
  open: boolean
  onClose: () => void
  resultCount: number
}) {
  const s = useFilterStore()
  const active = s.activeCount()

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      subtitle={active ? `${pluralise(active, 'filter')} applied` : 'Narrow things down'}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={s.clearAll} disabled={!active} className="flex-1">
            Clear all
          </Button>
          <Button onClick={onClose} className="flex-[1.6]">
            Show {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
          </Button>
        </div>
      }
    >
      <Group label="Meal">
        {(Object.keys(MEAL_LABELS) as MealType[]).map((m) => (
          <Chip key={m} size="sm" selected={s.meal.includes(m)} onClick={() => s.toggle('meal', m)}>
            {MEAL_LABELS[m]}
          </Chip>
        ))}
      </Group>

      <Group label="Cuisine">
        {(Object.keys(CUISINE_LABELS) as Cuisine[]).map((c) => (
          <Chip
            key={c}
            size="sm"
            selected={s.cuisine.includes(c)}
            onClick={() => s.toggle('cuisine', c)}
          >
            {CUISINE_LABELS[c]}
          </Chip>
        ))}
      </Group>

      <Group label="Dietary preference">
        {(Object.keys(DIETARY_LABELS) as DietaryTag[]).map((d) => (
          <Chip
            key={d}
            size="sm"
            selected={s.dietary.includes(d)}
            onClick={() => s.toggle('dietary', d)}
          >
            {DIETARY_LABELS[d]}
          </Chip>
        ))}
      </Group>

      <Group label="Time">
        {TIME_BANDS.map((b) => (
          <Chip
            key={b.id}
            size="sm"
            selected={s.timeBandId === b.id}
            onClick={() => s.setTimeBand(b.id)}
          >
            {b.label}
          </Chip>
        ))}
      </Group>

      <Group label="Difficulty">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
          <Chip
            key={d}
            size="sm"
            selected={s.difficulty.includes(d)}
            onClick={() => s.toggle('difficulty', d)}
          >
            {DIFFICULTY_LABELS[d]}
          </Chip>
        ))}
      </Group>

      <Group label="Budget">
        {BUDGET_BANDS.map((b) => (
          <Chip
            key={b.id}
            size="sm"
            selected={s.budgetBandId === b.id}
            onClick={() => s.setBudgetBand(b.id)}
          >
            {b.label}
          </Chip>
        ))}
      </Group>

      <Group label="Health">
        {(Object.keys(HEALTH_LABELS) as HealthTag[]).map((h) => (
          <Chip
            key={h}
            size="sm"
            selected={s.health.includes(h)}
            onClick={() => s.toggle('health', h)}
          >
            {HEALTH_LABELS[h]}
          </Chip>
        ))}
      </Group>
    </Sheet>
  )
}
