import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Chip } from '@/components/ui/Chip'
import { useFilterStore } from '@/store/useFilterStore'
import type { DietaryTag, HealthTag, MealType } from '@/types/domain'

/**
 * The quick-intent row under the hero. Each chip is a whole starting point,
 * not a filter toggle — tapping one lands the user on a filtered result set.
 */
type Intent =
  | { label: string; kind: 'meal'; value: MealType }
  | { label: string; kind: 'dietary'; value: DietaryTag }
  | { label: string; kind: 'health'; value: HealthTag }
  | { label: string; kind: 'time'; value: string }

const INTENTS: Intent[] = [
  { label: 'Breakfast', kind: 'meal', value: 'breakfast' },
  { label: 'Lunch', kind: 'meal', value: 'lunch' },
  { label: 'Dinner', kind: 'meal', value: 'dinner' },
  { label: 'Snacks', kind: 'meal', value: 'snack' },
  { label: 'Desserts', kind: 'meal', value: 'dessert' },
  { label: 'Drinks', kind: 'meal', value: 'drink' },
  { label: 'Quick meals', kind: 'time', value: '30' },
  { label: 'High protein', kind: 'health', value: 'high-protein' },
  { label: 'Healthy', kind: 'health', value: 'low-calorie' },
  { label: 'Vegetarian', kind: 'dietary', value: 'vegetarian' },
  { label: 'Vegan', kind: 'dietary', value: 'vegan' },
]

export function IntentChips() {
  const navigate = useNavigate()
  const { clearAll, setQuery, toggle, setTimeBand } = useFilterStore()

  function go(intent: Intent) {
    clearAll()
    setQuery('')
    if (intent.kind === 'time') setTimeBand(intent.value)
    else toggle(intent.kind, intent.value)
    navigate('/search')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-6"
    >
      {INTENTS.map((intent) => (
        <Chip key={intent.label} onClick={() => go(intent)}>
          {intent.label}
        </Chip>
      ))}
    </motion.div>
  )
}
