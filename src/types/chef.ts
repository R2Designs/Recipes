/**
 * A featured chef.
 *
 * Two kinds live in here, and the distinction is deliberate rather than
 * cosmetic — see `isRealPerson`:
 *
 * - Real, public figures. Everything written about them must be factual and
 *   publicly documented. No invented quotes, no invented biography, and no
 *   implication that they endorse or are affiliated with this app. Their page
 *   carries a visible editorial disclaimer.
 * - Fictional chefs, carried over from the creator roster in `recipes.ts`.
 *   These get evocative kitchen imagery rather than stock portraits of real
 *   strangers, for the same reason `images.ts` gives them generated avatars:
 *   putting a real person's face behind an invented name would be wrong.
 */
export interface ChefRecipeLink {
  recipeSlug: string
  /** Editorial note on the chef's angle. Never phrased as their own speech. */
  note: string
}

/** How the landing page's scroll sequence behaves. */
export type ChefTreatment = 'zoom-dissolve' | 'frame-collapse'

export interface Chef {
  id: string
  slug: string
  name: string
  /** e.g. "Chef · Restaurateur". */
  role: string
  city: string
  /** One editorial line, used on the carousel card. */
  tagline: string
  /** Paragraphs for the detail panel. Factual for real people. */
  bio: string[]
  /** Card image, 3:4. */
  portrait: string
  /** Full-bleed cinematic image. Must be high-res — the zoom scales it up. */
  hero: string
  /**
   * Where the food sits in the hero frame, as 0–1 fractions. Drives the zoom's
   * transform-origin so the push-in lands on the dish rather than the centre.
   */
  heroFocus: { x: number; y: number }
  treatment: ChefTreatment
  /** Short factual descriptors, e.g. "Awadhi cuisine". */
  known: string[]
  /**
   * A real, published quote — only ever set for real people, only ever
   * verbatim, and always with the source it was published in so the page can
   * link out to it. Never a paraphrase presented as speech.
   */
  quote?: { text: string; context: string; sourceUrl: string }
  recipes: ChefRecipeLink[]
  links?: { youtube?: string; site?: string; instagram?: string }
  /** Gates the editorial disclaimer and suppresses invented detail. */
  isRealPerson: boolean
}
