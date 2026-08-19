/** Join class names, dropping falsy values. Keeps conditional styling readable. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/** ₹1,240 — Indian digit grouping, no decimals (nothing here costs paise). */
export function formatPrice(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

/** 45 → "45 min"; 75 → "1 hr 15 min" */
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

/** "4 people" / "1 person" */
export function formatServings(n: number): string {
  return `${n} ${n === 1 ? 'person' : 'people'}`
}

export function pluralise(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`
}
