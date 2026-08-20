import type { Chef } from '@/types/chef'
import { img } from './images'
import ranveerHero from '@/assets/chefs/ranveer-brar-hero.webp'
import ranveerPortrait from '@/assets/chefs/ranveer-brar-portrait.webp'

/**
 * Featured chefs.
 *
 * ── The one real person in here ─────────────────────────────────────────────
 * Ranveer Brar is a real, living public figure. Everything written about him
 * below is drawn from publicly documented sources (his own site, his verified
 * YouTube channel, Wikipedia, published interviews) and nothing is invented:
 * no fabricated quotes, no fabricated biography, no implication that he is
 * affiliated with or endorses this app. `isRealPerson` gates a visible
 * editorial notice on his page saying exactly that.
 *
 * Two things were deliberately left out despite being easy to find:
 *   - The "youngest executive chef in India at 25" line. It traces back to his
 *     own bio copy rather than to independent reporting, so it is not stated
 *     here as fact.
 *   - A subscriber count. Sources disagree and the real number moves.
 *
 * The recipes attached to him are OUR catalogue's recipes, matched to cuisines
 * and dishes he is publicly documented as working in. They are not his
 * recipes, and the page says so.
 *
 * ── Everyone else ───────────────────────────────────────────────────────────
 * The remaining chefs are the fictional creators already used throughout
 * `recipes.ts`, promoted to full profiles. They get cooking imagery rather
 * than stock portraits, for the same reason `images.ts` gives them generated
 * avatars: a real stranger's face should not sit behind an invented name.
 */

/** Big enough for the cinematic to scale into without falling apart. */
const heroImg = (id: string) => img(id, 2400, 1600)
const portraitImg = (id: string) => img(id, 900, 1200)

/**
 * Imagery for the fictional chefs.
 *
 * Every one of these is cooking *in action* with the face cropped, turned away
 * or absent — hands on a tawa, arms over a wok, a torso at a kadai. That is
 * the point: these people don't exist, so a real stranger's portrait must not
 * stand in for them. Each id was loaded and visually checked before being
 * added here (several plausible-looking ids turned out to be 404s, and two
 * otherwise-good photos were rejected for showing identifiable faces).
 */
const AT_WORK = {
  tawa: 'photo-1786640442878-0c216561af21',
  tandoor: 'photo-1763951718950-c536b1295213',
  dumPot: 'photo-1752654976426-f0de0cbf8bb5',
  kadai: 'photo-1515931215890-366d3990cf8d',
  coastal: 'photo-1673068065942-6063389ea3f0',
  wok: 'photo-1681889870636-3f58e5288e03',
} as const

export const CHEFS: Chef[] = [
  {
    id: 'chef-ranveer-brar',
    slug: 'ranveer-brar',
    name: 'Ranveer Brar',
    role: 'Chef · Restaurateur',
    city: 'Lucknow',
    tagline:
      'Awadhi cooking and kebab craft, learned in Lucknow and carried into restaurants from Boston to Dubai.',
    bio: [
      'Ranveer Brar grew up in Lucknow, and traces his interest in cooking to the city’s street-kebab vendors. He trained at the Institute of Hotel Management there and apprenticed under the kebab ustad Munir Ahmed.',
      'He has judged MasterChef India across several seasons, and hosted shows including Raja Rasoi Aur Andaaz Anokha, Thank God It’s Fryday and Ranveer On The Road.',
      'His restaurants have included Banq in Boston and Kashkan in Dubai — a name that spans Kashmir to Kanyakumari. He published Come Into My Kitchen in 2016.',
    ],
    portrait: ranveerPortrait,
    hero: ranveerHero,
    // The right-hand plate of chaat — where the push-in lands.
    heroFocus: { x: 0.58, y: 0.63 },
    treatment: 'zoom-dissolve',
    known: ['Awadhi cuisine', 'Kebab craft', 'Street food'],
    quote: {
      text: 'It is delicate. It is nuanced. It is built on restraint.',
      context: 'on Awadhi cuisine, speaking to CNN in 2026',
      sourceUrl:
        'https://kvia.com/entertainment/cnn-style/2026/07/07/one-of-indias-greatest-food-cities-is-finally-getting-the-global-attention-it-deserves/',
    },
    recipes: [
      {
        recipeSlug: 'butter-chicken',
        note: 'A dish he has published his own version of — his runs as sliders.',
      },
      {
        recipeSlug: 'paneer-butter-masala',
        note: 'Also in his published repertoire of North Indian classics.',
      },
      {
        recipeSlug: 'tandoori-chicken',
        note: 'Close cousin to the kebab craft he apprenticed in under a Lucknow ustad.',
      },
      {
        recipeSlug: 'hyderabadi-chicken-biryani',
        note: 'Dum cooking — the sealed-pot method at the centre of Awadhi kitchens.',
      },
      {
        recipeSlug: 'samosa',
        note: 'Street food, which is where his cooking started in the first place.',
      },
    ],
    links: {
      youtube: 'https://www.youtube.com/@ranveerbrar',
      site: 'https://ranveerbrar.com',
      instagram: 'https://www.instagram.com/ranveer.brar/',
    },
    isRealPerson: true,
  },

  {
    id: 'chef-meera-iyengar',
    slug: 'meera-iyengar',
    name: 'Meera Iyengar',
    role: 'Home cook · Teacher',
    city: 'Udupi',
    tagline: 'Thirty years of batter ratios, and a very direct opinion about why your dosa sticks.',
    bio: [
      'Meera learned to cook in an Udupi household where the dosa batter was started before anything else in the day, and has taught the same method largely unchanged since.',
      'Her teaching focuses on the parts people skip — soaking times, fermentation temperature, and the state of the tawa before the batter ever touches it.',
    ],
    portrait: portraitImg(AT_WORK.tawa),
    hero: heroImg(AT_WORK.tawa),
    heroFocus: { x: 0.5, y: 0.55 },
    treatment: 'frame-collapse',
    known: ['Fermentation', 'Udupi cooking', 'Tiffin'],
    recipes: [
      { recipeSlug: 'masala-dosa', note: 'The batter ratios, explained properly.' },
      { recipeSlug: 'idli-sambar', note: 'Steaming times, and the two mistakes everyone makes.' },
      { recipeSlug: 'bisi-bele-bath', note: 'One-pot, pressure cooker, weeknight-friendly.' },
      { recipeSlug: 'medu-vada', note: 'The wet-palm shaping technique, slowed down.' },
      { recipeSlug: 'lemon-rice', note: 'What to do with yesterday’s rice.' },
    ],
    isRealPerson: false,
  },

  {
    id: 'chef-rohit-malhotra',
    slug: 'rohit-malhotra',
    name: 'Rohit Malhotra',
    role: 'Cook · Dhaba diarist',
    city: 'Amritsar',
    tagline: 'More oil, more onion, cooked much longer. The highway-dhaba school of North Indian food.',
    bio: [
      'Rohit cooks the way roadside dhabas do — heavy pans, deep browning, and none of the shortcuts a restaurant kitchen takes to keep service moving.',
      'His method notes tend to be about patience: how long to fry the onion, when to stop stirring, and why the gravy should be rougher than it looks in photographs.',
    ],
    portrait: portraitImg(AT_WORK.tandoor),
    hero: heroImg(AT_WORK.tandoor),
    heroFocus: { x: 0.5, y: 0.5 },
    treatment: 'zoom-dissolve',
    known: ['Dhaba cooking', 'Tandoor', 'Slow-fried masala'],
    recipes: [
      { recipeSlug: 'butter-chicken', note: 'Why the marinade matters more than the gravy.' },
      { recipeSlug: 'chole-bhature', note: 'The dry Rawalpindi version, no tomato at all.' },
      { recipeSlug: 'baingan-bharta', note: 'Charred on an open flame, mashed coarse.' },
      { recipeSlug: 'chana-masala', note: 'Roughly chopped, heavily fried, deeply browned.' },
    ],
    isRealPerson: false,
  },

  {
    id: 'chef-zainab-qureshi',
    slug: 'zainab-qureshi',
    name: 'Zainab Qureshi',
    role: 'Cook · Dum specialist',
    city: 'Hyderabad',
    tagline: 'Sealing the lid with dough, and knowing when it’s done without opening it.',
    bio: [
      'Zainab cooks biryani the kacchi way — raw marinated meat layered under the rice and sealed in, which leaves no room to check on it or correct course.',
      'Most of her teaching is about reading the pot from the outside: the sound, the steam, and the timing that makes opening it unnecessary.',
    ],
    portrait: portraitImg(AT_WORK.dumPot),
    hero: heroImg(AT_WORK.dumPot),
    heroFocus: { x: 0.5, y: 0.52 },
    treatment: 'frame-collapse',
    known: ['Dum cooking', 'Biryani', 'Hyderabadi'],
    recipes: [
      { recipeSlug: 'hyderabadi-chicken-biryani', note: 'Kacchi dum, dough-sealed.' },
      { recipeSlug: 'tandoori-chicken', note: 'Why the first marinade has no yoghurt in it.' },
      { recipeSlug: 'samosa', note: 'The Hyderabadi keema filling.' },
    ],
    isRealPerson: false,
  },

  {
    id: 'chef-kunal-shirodkar',
    slug: 'kunal-shirodkar',
    name: 'Kunal Shirodkar',
    role: 'Cook · Street food',
    city: 'Mumbai',
    tagline: 'Griddle-first Mumbai cooking, and an exact position on how much butter is correct.',
    bio: [
      'Kunal cooks the Mumbai street repertoire on a home hob — pav bhaji, vada pav, and the dry chutneys that do most of the work.',
      'His recipes are written around the griddle: how hard to mash, how long to let it catch, and when to stop adding butter (later than you think).',
    ],
    portrait: portraitImg(AT_WORK.kadai),
    hero: heroImg(AT_WORK.kadai),
    heroFocus: { x: 0.5, y: 0.5 },
    treatment: 'zoom-dissolve',
    known: ['Street food', 'Griddle', 'Chutney'],
    recipes: [
      { recipeSlug: 'pav-bhaji', note: 'The mashing technique, and the butter question.' },
      { recipeSlug: 'vada-pav', note: 'The dry garlic chutney is the whole secret.' },
    ],
    isRealPerson: false,
  },

  {
    id: 'chef-lakshmi-nair',
    slug: 'lakshmi-nair',
    name: 'Lakshmi Nair',
    role: 'Cook · Coastal Kerala',
    city: 'Alappuzha',
    tagline: 'Thin coconut milk and thick coconut milk — and knowing which one goes in when.',
    bio: [
      'Lakshmi cooks the Kerala coastal repertoire: stews built on whole spice rather than chilli heat, and seafood curries finished with coconut and kokum.',
      'The distinction she returns to most is the two extractions of coconut milk, which go into the pot at different moments and behave differently under heat.',
    ],
    portrait: portraitImg(AT_WORK.coastal),
    hero: heroImg(AT_WORK.coastal),
    heroFocus: { x: 0.5, y: 0.5 },
    treatment: 'frame-collapse',
    known: ['Coconut milk', 'Coastal seafood', 'Whole spice'],
    recipes: [
      { recipeSlug: 'kerala-veg-stew', note: 'Appam and stew, Sunday style.' },
      { recipeSlug: 'coconut-prawn-curry', note: 'The gentle, creamy moilee end of the spectrum.' },
      { recipeSlug: 'masala-dosa', note: 'A softer Kerala take, coconut through the potato.' },
    ],
    isRealPerson: false,
  },

  {
    id: 'chef-ray-chen',
    slug: 'ray-chen',
    name: 'Ray Chen',
    role: 'Cook · Indo-Chinese',
    city: 'Kolkata',
    tagline: 'Getting a domestic hob hot enough to matter, which is most of the battle.',
    bio: [
      'Ray cooks the Kolkata Indo-Chinese repertoire — the Hakka cooking that grew out of the city’s Chinese community and became its own cuisine.',
      'Almost everything he teaches comes back to heat: preheating the wok past the point that feels sensible, cooking in smaller batches, and keeping the food moving.',
    ],
    portrait: portraitImg(AT_WORK.wok),
    hero: heroImg(AT_WORK.wok),
    heroFocus: { x: 0.5, y: 0.5 },
    treatment: 'zoom-dissolve',
    known: ['Wok hei', 'Hakka cooking', 'High flame'],
    recipes: [
      { recipeSlug: 'hakka-noodles', note: 'Restaurant wok hei, on a home hob.' },
      { recipeSlug: 'veg-momos', note: 'Steamed, pleated, with the red chutney.' },
    ],
    isRealPerson: false,
  },
]

export function getChef(slug: string): Chef | undefined {
  return CHEFS.find((c) => c.slug === slug)
}

/** Chefs whose profiles reference a given recipe — powers cross-links. */
export function chefsForRecipe(recipeSlug: string): Chef[] {
  return CHEFS.filter((c) => c.recipes.some((r) => r.recipeSlug === recipeSlug))
}
