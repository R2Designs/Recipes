/**
 * Curated food photography.
 *
 * These are hotlinked Unsplash CDN URLs — nothing is downloaded or re-hosted.
 * Every id below was loaded in a browser and visually confirmed to show the
 * dish it's named after, so the grid never shows a biryani labelled "samosa".
 *
 * `FoodImage` degrades to a designed gradient tile if any of these ever 404,
 * so a dead URL is a cosmetic downgrade, never a broken layout.
 */

const CDN = 'https://images.unsplash.com'

/** Build a sized, cropped URL. Keeps requests small and consistent. */
export function img(id: string, w = 800, h = 600): string {
  return `${CDN}/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=75&auto=format`
}

export const PHOTOS = {
  // ── South Indian ──────────────────────────────────────────
  masalaDosa: 'photo-1668236543090-82eba5ee5976',
  idli: 'photo-1589301760014-d929f3979dbc',
  southIndianPlatter: 'photo-1630383249896-424e482df921',

  // ── North Indian & regional ───────────────────────────────
  paneerButterMasala: 'photo-1631452180519-c014fe946bc7',
  butterChickenNaan: 'photo-1565557623262-b51c2513a641',
  chanaMasala: 'photo-1585937421612-70a008356fbe',
  choleBhature: 'photo-1606491956689-2ea866880c84',
  rajma: 'photo-1534939561126-855b8675edd7',
  baiganBharta: 'photo-1596797038530-2c107229654b',
  alooSabzi: 'photo-1567188040759-fb8a883dc6d8',
  thali: 'photo-1546833999-b9f581a1996d',
  tandooriChicken: 'photo-1626074353765-517a681e40be',
  biryani: 'photo-1631515243349-e0cb75fb8d3a',
  biryaniAlt: 'photo-1589302168068-964664d93dc0',
  pulao: 'photo-1512058564366-18510be2db19',
  vegStew: 'photo-1541518763669-27fef04b14ea',

  // ── Snacks & street food ──────────────────────────────────
  samosa: 'photo-1601050690597-df0568f70950',
  kachoriPlatter: 'photo-1613292443284-8d10ef9383fe',
  pavBhaji: 'photo-1626132647523-66f5bf380027',
  vadaPav: 'photo-1606755962773-d324e0a13086',
  chaat: 'photo-1610192244261-3f33de3f55e4',
  momos: 'photo-1601050690117-94f5f6fa8bd7',

  // ── Indo-Chinese ──────────────────────────────────────────
  hakkaNoodles: 'photo-1585032226651-759b368d7246',

  // ── Drinks & desserts ─────────────────────────────────────
  masalaChai: 'photo-1544787219-7f47ccb76574',
  chaiDark: 'photo-1571934811356-5cc061b6821f',
  kulfi: 'photo-1517093157656-b9eccef91cb1',
  berryCake: 'photo-1565958011703-44f9829ba187',
  cupcakes: 'photo-1615832494873-b0c52d519696',

  // ── Global ────────────────────────────────────────────────
  pizza: 'photo-1604382354936-07c5d9983bd3',
  pestoPasta: 'photo-1473093295043-cdd812d0e601',
  thaiCurry: 'photo-1455619452474-d2be8b1e70cd',
  buddhaBowl: 'photo-1512621776951-a57141f2eefd',
  gardenSalad: 'photo-1540189549336-e6e99c3679fe',
  koreanBowl: 'photo-1609501676725-7186f017a4b7',
  grilledSandwich: 'photo-1476224203421-9ac39bcb3327',

  // ── Editorial / collection art ────────────────────────────
  spices: 'photo-1596040033229-a9821ebd058d',
  vegBoard: 'photo-1466637574441-749b8f19452f',
} as const

export type PhotoKey = keyof typeof PHOTOS

/**
 * Creator avatars. Deterministic, generated SVG portraits — these are fictional
 * people, so using real photographs of real humans would be wrong.
 */
export function avatar(seed: string, hue: number): string {
  const initials = seed
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 70% 62%)"/>
      <stop offset="1" stop-color="hsl(${hue + 24} 68% 46%)"/>
    </linearGradient></defs>
    <rect width="80" height="80" fill="url(#g)"/>
    <text x="40" y="40" font-family="system-ui,sans-serif" font-size="30" font-weight="700"
      fill="#fff" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Unsplash asks that hotlinked photos credit the platform. Rendered in the footer.
 */
export const IMAGE_CREDIT = {
  source: 'Unsplash',
  url: 'https://unsplash.com',
  note: 'Food photography via Unsplash. Recipes is a design prototype.',
}
