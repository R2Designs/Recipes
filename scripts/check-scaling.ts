/**
 * Verifies the scaling algorithm against the quantities specified in the
 * product brief for Masala Dosa at 10 servings (base 4 → ×2.5), plus a few
 * edge cases that naive multiplication gets wrong.
 *
 *   npx tsx scripts/check-scaling.ts
 */
import { scaleQuantity, formatQuantity } from '../src/lib/scaling'
import type { Unit } from '../src/types/domain'

interface Case {
  label: string
  qty: number
  unit: Unit
  factor: number
  expect: string
  discrete?: boolean
  halvable?: boolean
}

const SPEC_CASES: Case[] = [
  // Masala Dosa, base 4 → 10 servings. Targets taken verbatim from the brief.
  { label: 'Rice', qty: 600, unit: 'g', factor: 2.5, expect: '1.5 kg' },
  { label: 'Urad dal', qty: 200, unit: 'g', factor: 2.5, expect: '500 g' },
  { label: 'Potatoes', qty: 800, unit: 'g', factor: 2.5, expect: '2 kg' },
  { label: 'Onion', qty: 200, unit: 'g', factor: 2.5, expect: '500 g' },
  { label: 'Curry leaves', qty: 1, unit: 'bunch', factor: 2.5, expect: '2 bunches', discrete: true },
  { label: 'Green chilli', qty: 40, unit: 'g', factor: 2.5, expect: '100 g' },
  { label: 'Oil', qty: 100, unit: 'ml', factor: 2.5, expect: '250 ml' },
]

const EDGE_CASES: Case[] = [
  { label: 'Turmeric scaled down', qty: 1, unit: 'tsp', factor: 0.25, expect: '¼ tsp' },
  { label: 'Pinch never vanishes', qty: 1, unit: 'pinch', factor: 0.25, expect: '1 pinch' },
  { label: 'Pinches become tsp', qty: 2, unit: 'pinch', factor: 4, expect: '½ tsp' },
  { label: 'Eggs stay whole', qty: 2, unit: 'piece', factor: 1.75, expect: '3', discrete: true },
  { label: 'Onion halves are fine', qty: 1, unit: 'piece', factor: 2.5, expect: '2½', discrete: true, halvable: true },
  { label: 'tsp promotes to tbsp', qty: 1, unit: 'tsp', factor: 3, expect: '1 tbsp' },
  { label: 'Single serving of rice', qty: 600, unit: 'g', factor: 0.25, expect: '150 g' },
  { label: 'Big batch promotes to kg', qty: 500, unit: 'g', factor: 6, expect: '3 kg' },
]

function run(cases: Case[], title: string): number {
  console.log(`\n\x1b[1m${title}\x1b[0m`)
  let failures = 0

  for (const c of cases) {
    const meta = { discrete: c.discrete ?? false, halvable: c.halvable }
    const result = scaleQuantity(c.qty, c.unit, c.factor, meta)
    const actual = formatQuantity(result.quantity, result.unit)
    const ok = actual === c.expect

    if (!ok) failures++
    const mark = ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'
    const from = formatQuantity(c.qty, c.unit)
    const detail = ok ? '' : `  \x1b[31m(expected ${c.expect})\x1b[0m`
    console.log(`  ${mark} ${c.label.padEnd(24)} ${from.padStart(9)} ×${c.factor} → ${actual}${detail}`)
  }
  return failures
}

const failures = run(SPEC_CASES, 'Spec: Masala Dosa at 10 servings') + run(EDGE_CASES, 'Edge cases')

console.log(
  failures === 0
    ? '\n\x1b[32mAll scaling checks passed.\x1b[0m\n'
    : `\n\x1b[31m${failures} check(s) failed.\x1b[0m\n`,
)
process.exit(failures === 0 ? 0 : 1)
