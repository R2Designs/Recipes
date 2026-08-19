import type { Recipe, RecipeVariant, CreatorRecipe, Collection } from '@/types/recipe'
import type { RecipeIngredient } from '@/types/ingredient'
import type { Difficulty, SpiceLevel, Unit } from '@/types/domain'
import { PHOTOS, img, avatar } from './images'

/**
 * Mock recipe catalogue.
 *
 * Masala Dosa is the fully-fleshed flagship — 7 variants, 5 creators, complete
 * ingredient list. Everything else carries enough depth (1–4 variants, 2–3
 * creators, a full ingredient list) that any recipe can be taken all the way
 * through the procurement flow.
 *
 * Creators are fictional. We attribute and link out by design — Recipes helps
 * people discover and shop for a dish, it does not reproduce anyone's method.
 */

// ── Terse builders ──────────────────────────────────────────
// Recipe data is repetitive; these keep the catalogue scannable.

/** Ingredient line: `i('potato', 800)` or `i('salt', 1, 'tsp')`. */
function i(ingredientId: string, quantity: number, unit: Unit = 'g', extra?: Partial<RecipeIngredient>): RecipeIngredient {
  return { ingredientId, name: NAMES[ingredientId] ?? ingredientId, quantity, unit, ...extra }
}

const NAMES: Record<string, string> = {
  rice: 'Rice', 'basmati-rice': 'Basmati rice', poha: 'Poha', semolina: 'Semolina (rava)',
  atta: 'Whole wheat flour', maida: 'All-purpose flour', besan: 'Gram flour (besan)',
  noodles: 'Hakka noodles', pasta: 'Pasta', 'urad-dal': 'Urad dal', 'toor-dal': 'Toor dal',
  'chana-dal': 'Chana dal', 'moong-dal': 'Moong dal', chickpeas: 'Chickpeas (kabuli chana)',
  'rajma-beans': 'Rajma (kidney beans)', potato: 'Potatoes', onion: 'Onions', tomato: 'Tomatoes',
  'green-chilli': 'Green chillies', ginger: 'Ginger', garlic: 'Garlic', cauliflower: 'Cauliflower',
  peas: 'Green peas', carrot: 'Carrots', capsicum: 'Capsicum', cabbage: 'Cabbage',
  brinjal: 'Brinjal (aubergine)', spinach: 'Spinach', beans: 'French beans', lemon: 'Lemons',
  coconut: 'Fresh coconut', 'curry-leaves': 'Curry leaves', 'coriander-leaves': 'Coriander leaves',
  'mint-leaves': 'Mint leaves', basil: 'Basil', paneer: 'Paneer', milk: 'Milk', curd: 'Curd (yoghurt)',
  butter: 'Butter', ghee: 'Ghee', cream: 'Fresh cream', cheese: 'Mozzarella', khoya: 'Khoya',
  chicken: 'Chicken', mutton: 'Mutton', fish: 'Fish fillets', prawns: 'Prawns', egg: 'Eggs',
  salt: 'Salt', turmeric: 'Turmeric powder', 'chilli-powder': 'Red chilli powder',
  'coriander-powder': 'Coriander powder', 'cumin-seeds': 'Cumin seeds', 'mustard-seeds': 'Mustard seeds',
  'garam-masala': 'Garam masala', asafoetida: 'Asafoetida (hing)', 'bay-leaf': 'Bay leaves',
  cardamom: 'Green cardamom', cinnamon: 'Cinnamon stick', cloves: 'Cloves',
  'dry-red-chilli': 'Dry red chillies', 'pav-bhaji-masala': 'Pav bhaji masala',
  'chaat-masala': 'Chaat masala', 'tea-leaves': 'Tea leaves', saffron: 'Saffron',
  'fenugreek-seeds': 'Fenugreek seeds (methi)', oil: 'Cooking oil', 'olive-oil': 'Olive oil',
  'soy-sauce': 'Soy sauce', vinegar: 'Vinegar', 'tomato-ketchup': 'Tomato ketchup',
  tamarind: 'Tamarind', sugar: 'Sugar', jaggery: 'Jaggery', cashews: 'Cashews', almonds: 'Almonds',
  pav: 'Pav buns', bread: 'Bread',
}

interface VariantSpec {
  id: string
  name: string
  description: string
  spice: SpiceLevel
  difficulty?: Difficulty
  time: number
  photo: keyof typeof PHOTOS
  overrides?: RecipeVariant['ingredientOverrides']
}

function v(s: VariantSpec): RecipeVariant {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    spiceLevel: s.spice,
    difficulty: s.difficulty ?? 'medium',
    timeMins: s.time,
    thumbnail: img(PHOTOS[s.photo], 240, 180),
    ingredientOverrides: s.overrides,
  }
}

interface CreatorSpec {
  id: string
  name: string
  handle: string
  title: string
  blurb: string
  photo: keyof typeof PHOTOS
  hue: number
  spice: SpiceLevel
  time: number
  difficulty?: Difficulty
  video?: boolean
  followers?: string
}

function c(s: CreatorSpec): CreatorRecipe {
  return {
    id: s.id,
    creatorName: s.name,
    creatorAvatar: avatar(s.name, s.hue),
    creatorHandle: s.handle,
    title: s.title,
    blurb: s.blurb,
    thumbnail: img(PHOTOS[s.photo], 320, 240),
    hasVideo: s.video ?? true,
    spiceLevel: s.spice,
    timeMins: s.time,
    difficulty: s.difficulty ?? 'medium',
    followerLabel: s.followers,
  }
}

// ── Common spice/tempering groups ───────────────────────────
const TEMPERING = [
  i('mustard-seeds', 1, 'tsp', { note: 'for tempering' }),
  i('curry-leaves', 1, 'bunch'),
  i('asafoetida', 1, 'pinch'),
]

// ════════════════════════════════════════════════════════════
//  THE CATALOGUE
// ════════════════════════════════════════════════════════════

export const RECIPES: Recipe[] = [
  // ─────────────────────────────────────────────────────────
  //  FLAGSHIP — Masala Dosa
  //  Base quantities are tuned so that scaling 4 → 10 servings
  //  reproduces the reference amounts in the product brief.
  // ─────────────────────────────────────────────────────────
  {
    id: 'r-masala-dosa',
    slug: 'masala-dosa',
    name: 'Masala Dosa',
    tagline: 'South Indian classic',
    description:
      'A fermented rice-and-lentil crêpe, griddled until the edges lift and shatter, wrapped around soft turmeric-yellow potatoes. Traditionally eaten with coconut chutney and a bowl of sambar — and, if you ask anyone from Bengaluru, at half past seven in the morning.',
    cuisine: 'south-indian',
    region: 'Karnataka & Tamil Nadu',
    mealType: ['breakfast', 'dinner'],
    image: img(PHOTOS.masalaDosa),
    vegClass: 'veg',
    baseServings: 4,
    prepTimeMins: 20,
    cookTimeMins: 25,
    difficulty: 'medium',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free'],
    healthTags: ['high-fibre'],
    estimatedCost: 180,
    rating: { value: 4.8, count: 2140 },
    nutrition: { calories: 387, protein: 9, carbs: 62, fat: 11, fibre: 5 },
    ingredients: [
      i('rice', 600),
      i('urad-dal', 200),
      i('fenugreek-seeds', 1, 'tsp'),
      i('potato', 800),
      i('onion', 200),
      i('green-chilli', 40),
      i('ginger', 20),
      i('curry-leaves', 1, 'bunch'),
      i('turmeric', 1, 'tsp'),
      i('mustard-seeds', 1, 'tsp'),
      i('chana-dal', 30, 'g', { note: 'for tempering' }),
      i('oil', 100, 'ml'),
      i('salt', 2, 'tsp'),
      i('coriander-leaves', 1, 'bunch', { optional: true, note: 'to garnish' }),
    ],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'The standard restaurant dosa — golden, thin, folded over spiced potato.', spice: 'medium', time: 45, photo: 'masalaDosa' }),
      v({
        id: 'mild', name: 'Mild', description: 'Gentle on the chilli, heavier on the ginger and curry leaf.', spice: 'mild', difficulty: 'easy', time: 45, photo: 'southIndianPlatter',
        overrides: [{ op: 'scale', ingredientId: 'green-chilli', factor: 0.4 }],
      }),
      v({
        id: 'spicy', name: 'Spicy', description: 'Extra green chilli in the masala and a smear of red chutney inside the fold.', spice: 'spicy', time: 50, photo: 'chaat',
        overrides: [
          { op: 'scale', ingredientId: 'green-chilli', factor: 2 },
          { op: 'add', ingredient: i('dry-red-chilli', 6, 'piece', { note: 'for red chutney' }) },
          { op: 'add', ingredient: i('garlic', 30, 'g', { note: 'for red chutney' }) },
        ],
      }),
      v({
        id: 'crispy', name: 'Crispy', description: 'A thinner batter and a longer griddle for the paper-thin, shatter-crisp version.', spice: 'medium', difficulty: 'hard', time: 55, photo: 'masalaDosa',
        overrides: [{ op: 'scale', ingredientId: 'oil', factor: 1.5 }],
      }),
      v({
        id: 'karnataka', name: 'Karnataka-style', description: 'Bengaluru benne dosa — cooked in butter, a touch of sugar in the batter.', spice: 'mild', time: 50, photo: 'thali',
        overrides: [
          { op: 'add', ingredient: i('butter', 100) },
          { op: 'add', ingredient: i('sugar', 20) },
        ],
      }),
      v({
        id: 'kerala', name: 'Kerala-style', description: 'Coconut through the potato masala and a softer, thicker crêpe.', spice: 'medium', time: 50, photo: 'vegStew',
        overrides: [
          { op: 'add', ingredient: i('coconut', 1, 'piece') },
          { op: 'scale', ingredientId: 'curry-leaves', factor: 2 },
        ],
      }),
      v({
        id: 'kids', name: 'Kids-friendly', description: 'No chilli at all, a little cheese in the fold, cut into strips.', spice: 'mild', difficulty: 'easy', time: 40, photo: 'idli',
        overrides: [
          { op: 'remove', ingredientId: 'green-chilli' },
          { op: 'add', ingredient: i('cheese', 100) },
        ],
      }),
    ],
    creators: [
      c({ id: 'cd-1', name: 'Meera Iyengar', handle: '@meerascookbook', title: 'The 30-year Udupi dosa method', blurb: 'Grandmother-taught batter ratios, explained properly — including why your dosa sticks.', photo: 'masalaDosa', hue: 18, spice: 'medium', time: 45, followers: '1.2M subscribers' }),
      c({ id: 'cd-2', name: 'Arjun Rao', handle: '@bangalorebites', title: 'Benne dosa like Bengaluru', blurb: 'The butter-heavy VV Puram street version, made on a home tawa.', photo: 'thali', hue: 34, spice: 'mild', time: 50, followers: '840K subscribers' }),
      c({ id: 'cd-3', name: 'Lakshmi Nair', handle: '@keralakitchen', title: 'Coconut masala dosa', blurb: 'A softer Kerala take with fresh coconut folded through the potato.', photo: 'vegStew', hue: 140, spice: 'medium', time: 50, followers: '610K subscribers' }),
      c({ id: 'cd-4', name: 'Sanjay Bhat', handle: '@spicelab', title: 'Extra-spicy Mysore masala', blurb: 'Red chutney on the inside. Not for the faint-hearted.', photo: 'chaat', hue: 6, spice: 'fiery', time: 55, difficulty: 'hard', followers: '2.1M subscribers' }),
      c({ id: 'cd-5', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Instant dosa, no fermenting', blurb: 'A same-day batter for when you did not plan 12 hours ahead.', photo: 'southIndianPlatter', hue: 280, spice: 'mild', time: 30, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },

  // ── South Indian ─────────────────────────────────────────
  {
    id: 'r-idli-sambar', slug: 'idli-sambar', name: 'Idli Sambar', tagline: 'Steamed, soft, essential',
    description: 'Pillowy steamed rice cakes served with a tamarind-and-lentil sambar. The gentlest breakfast in the country, and the hardest to get exactly right.',
    cuisine: 'south-indian', region: 'Tamil Nadu', mealType: ['breakfast'], image: img(PHOTOS.idli),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 30, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free'], healthTags: ['low-calorie', 'high-fibre'],
    estimatedCost: 150, rating: { value: 4.7, count: 1820 },
    nutrition: { calories: 268, protein: 8, carbs: 48, fat: 4, fibre: 6 },
    ingredients: [i('rice', 500), i('urad-dal', 180), i('toor-dal', 150), i('tamarind', 30), i('tomato', 200), i('onion', 150), i('carrot', 100), i('green-chilli', 30), ...TEMPERING, i('turmeric', 1, 'tsp'), i('oil', 60, 'ml'), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Plain idli with a vegetable sambar.', spice: 'mild', difficulty: 'easy', time: 45, photo: 'idli' }),
      v({ id: 'rava', name: 'Rava idli', description: 'Semolina idli — no fermenting, ready in under an hour.', spice: 'mild', difficulty: 'easy', time: 35, photo: 'southIndianPlatter', overrides: [{ op: 'add', ingredient: i('semolina', 300) }, { op: 'scale', ingredientId: 'rice', factor: 0.3 }] }),
      v({ id: 'spicy-sambar', name: 'Spicy sambar', description: 'Twice the chilli and a darker roasted sambar powder.', spice: 'spicy', time: 50, photo: 'thali', overrides: [{ op: 'scale', ingredientId: 'green-chilli', factor: 2.5 }] }),
    ],
    creators: [
      c({ id: 'ci-1', name: 'Meera Iyengar', handle: '@meerascookbook', title: 'Idli that never goes flat', blurb: 'Batter consistency, steaming time, and the two mistakes everyone makes.', photo: 'idli', hue: 18, spice: 'mild', time: 45, followers: '1.2M subscribers' }),
      c({ id: 'ci-2', name: 'Priya Sundaram', handle: '@chennaihomecook', title: 'Hotel-style sambar', blurb: 'The tiffin-centre sambar — thinner, sweeter, more aromatic.', photo: 'thali', hue: 42, spice: 'medium', time: 40, followers: '520K subscribers' }),
    ],
  },
  {
    id: 'r-medu-vada', slug: 'medu-vada', name: 'Medu Vada', tagline: 'Crisp outside, cloud inside',
    description: 'Savoury lentil doughnuts with a crackling shell and an airy middle, studded with pepper, ginger and curry leaf.',
    cuisine: 'south-indian', region: 'Tamil Nadu & Karnataka', mealType: ['breakfast', 'snack'], image: img(PHOTOS.southIndianPlatter),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 20, cookTimeMins: 20, difficulty: 'hard',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free'], healthTags: ['high-protein'],
    estimatedCost: 140, rating: { value: 4.6, count: 940 },
    nutrition: { calories: 342, protein: 11, carbs: 38, fat: 16, fibre: 5 },
    ingredients: [i('urad-dal', 300), i('green-chilli', 30), i('ginger', 25), i('curry-leaves', 1, 'bunch'), i('oil', 500, 'ml', { note: 'for frying' }), i('salt', 2, 'tsp'), i('coconut', 1, 'piece'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'The temple-canteen vada, eaten with coconut chutney.', spice: 'medium', difficulty: 'hard', time: 40, photo: 'southIndianPlatter' }),
      v({ id: 'dahi', name: 'Dahi vada', description: 'Soaked in sweetened curd with chaat masala.', spice: 'mild', time: 50, photo: 'chaat', overrides: [{ op: 'add', ingredient: i('curd', 500) }, { op: 'add', ingredient: i('chaat-masala', 2, 'tsp') }] }),
    ],
    creators: [
      c({ id: 'cv-1', name: 'Priya Sundaram', handle: '@chennaihomecook', title: 'Vada shaping without tears', blurb: 'The wet-palm technique, slowed down.', photo: 'southIndianPlatter', hue: 42, spice: 'medium', time: 40, followers: '520K subscribers' }),
      c({ id: 'cv-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Air-fryer medu vada', blurb: 'Less oil, nearly the same crunch.', photo: 'idli', hue: 280, spice: 'mild', time: 35, difficulty: 'easy', followers: '450K followers' }),
    ],
  },
  {
    id: 'r-lemon-rice', slug: 'lemon-rice', name: 'Lemon Rice', tagline: 'Fifteen minutes, start to plate',
    description: 'Leftover rice turned bright with lemon, mustard seed, peanuts and turmeric. The lunchbox staple of half of South India.',
    cuisine: 'tamil', region: 'Tamil Nadu', mealType: ['lunch', 'snack'], image: img(PHOTOS.pulao),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 5, cookTimeMins: 10, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'jain', 'gluten-free'], healthTags: ['low-calorie'],
    estimatedCost: 90, rating: { value: 4.5, count: 760 },
    nutrition: { calories: 296, protein: 6, carbs: 52, fat: 8, fibre: 3 },
    ingredients: [i('rice', 400), i('lemon', 2, 'piece'), i('green-chilli', 30), i('cashews', 50), ...TEMPERING, i('chana-dal', 30), i('turmeric', 1, 'tsp'), i('oil', 60, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Sharp with lemon, crunchy with cashew.', spice: 'mild', difficulty: 'easy', time: 15, photo: 'pulao' }),
      v({ id: 'tangy', name: 'Extra tangy', description: 'Double lemon, added right at the end so it stays bright.', spice: 'mild', difficulty: 'easy', time: 15, photo: 'thali', overrides: [{ op: 'scale', ingredientId: 'lemon', factor: 2 }] }),
    ],
    creators: [
      c({ id: 'cl-1', name: 'Priya Sundaram', handle: '@chennaihomecook', title: '15-minute lemon rice', blurb: 'What to do with yesterday’s rice.', photo: 'pulao', hue: 42, spice: 'mild', time: 15, difficulty: 'easy', followers: '520K subscribers' }),
      c({ id: 'cl-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Lunchbox lemon rice', blurb: 'Packs well, tastes good cold.', photo: 'thali', hue: 280, spice: 'mild', time: 15, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-kerala-stew', slug: 'kerala-veg-stew', name: 'Kerala Vegetable Stew', tagline: 'Coconut milk, whole spice, no chilli heat',
    description: 'A pale, fragrant stew of vegetables simmered in coconut milk with whole cardamom and cloves. Warmth without heat — eaten with appam on Sunday mornings.',
    cuisine: 'kerala', region: 'Kerala', mealType: ['breakfast', 'dinner'], image: img(PHOTOS.vegStew),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 25, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free', 'dairy-free'], healthTags: ['low-carb', 'high-fibre'],
    estimatedCost: 220, rating: { value: 4.6, count: 580 },
    nutrition: { calories: 254, protein: 6, carbs: 24, fat: 15, fibre: 7 },
    ingredients: [i('potato', 300), i('carrot', 200), i('beans', 150), i('peas', 100), i('onion', 150), i('coconut', 1, 'piece'), i('ginger', 25), i('green-chilli', 20), i('curry-leaves', 1, 'bunch'), i('cardamom', 4, 'piece'), i('cloves', 4, 'piece'), i('cinnamon', 1, 'piece'), i('oil', 40, 'ml'), i('salt', 1.5, 'tsp')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Vegetables only, thick coconut milk finish.', spice: 'mild', difficulty: 'easy', time: 40, photo: 'vegStew' }),
      v({ id: 'chicken', name: 'Chicken stew', description: 'The Syrian Christian version, with bone-in chicken.', spice: 'mild', time: 55, photo: 'butterChickenNaan', overrides: [{ op: 'add', ingredient: i('chicken', 600) }] }),
    ],
    creators: [
      c({ id: 'ck-1', name: 'Lakshmi Nair', handle: '@keralakitchen', title: 'Appam & stew, Sunday style', blurb: 'Thin and thick coconut milk, and when to add each.', photo: 'vegStew', hue: 140, spice: 'mild', time: 40, difficulty: 'easy', followers: '610K subscribers' }),
      c({ id: 'ck-2', name: 'Thomas Kurian', handle: '@malabartable', title: 'Nadan chicken stew', blurb: 'The version his grandmother made on Christmas morning.', photo: 'butterChickenNaan', hue: 200, spice: 'mild', time: 55, followers: '290K subscribers' }),
    ],
  },
  {
    id: 'r-bisi-bele-bath', slug: 'bisi-bele-bath', name: 'Bisi Bele Bath', tagline: 'Karnataka in one pot',
    description: 'Rice, lentils and vegetables cooked together with a roasted spice blend and tamarind. Literally "hot lentil rice" — a full meal that needs nothing beside it but a spoon of ghee.',
    cuisine: 'karnataka', region: 'Karnataka', mealType: ['lunch', 'dinner'], image: img(PHOTOS.thali),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 20, cookTimeMins: 40, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'eggless'], healthTags: ['high-protein', 'high-fibre'],
    estimatedCost: 210, rating: { value: 4.7, count: 690 },
    nutrition: { calories: 412, protein: 14, carbs: 66, fat: 11, fibre: 9 },
    ingredients: [i('rice', 300), i('toor-dal', 200), i('carrot', 150), i('beans', 150), i('peas', 100), i('onion', 150), i('tamarind', 40), i('dry-red-chilli', 6, 'piece'), i('chana-dal', 40), i('cashews', 40), ...TEMPERING, i('turmeric', 1, 'tsp'), i('ghee', 60), i('oil', 40, 'ml'), i('salt', 2, 'tsp')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Restaurant consistency — loose, not stiff.', spice: 'medium', time: 60, photo: 'thali' }),
      v({ id: 'spicy', name: 'Extra spicy', description: 'A darker, hotter roast on the masala.', spice: 'spicy', time: 60, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'dry-red-chilli', factor: 2 }] }),
    ],
    creators: [
      c({ id: 'cb-1', name: 'Arjun Rao', handle: '@bangalorebites', title: 'MTR-style bisi bele bath', blurb: 'The masala blend, roasted from scratch.', photo: 'thali', hue: 34, spice: 'medium', time: 60, followers: '840K subscribers' }),
      c({ id: 'cb-2', name: 'Meera Iyengar', handle: '@meerascookbook', title: 'One-pot bisi bele bath', blurb: 'Pressure cooker method for a weeknight.', photo: 'pulao', hue: 18, spice: 'medium', time: 45, difficulty: 'easy', followers: '1.2M subscribers' }),
    ],
  },
  {
    id: 'r-prawn-curry', slug: 'coconut-prawn-curry', name: 'Coconut Prawn Curry', tagline: 'Coastal, quick, unmistakable',
    description: 'Prawns simmered in a coconut and red chilli gravy sharpened with tamarind. Twenty minutes of cooking for something that tastes like it took all afternoon.',
    cuisine: 'kerala', region: 'Malabar Coast', mealType: ['lunch', 'dinner'], image: img(PHOTOS.thaiCurry),
    vegClass: 'non-veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 20, difficulty: 'medium',
    dietaryTags: ['gluten-free', 'dairy-free'], healthTags: ['high-protein', 'low-carb'],
    estimatedCost: 520, rating: { value: 4.8, count: 430 },
    nutrition: { calories: 328, protein: 28, carbs: 12, fat: 19, fibre: 3 },
    ingredients: [i('prawns', 500), i('coconut', 1, 'piece'), i('onion', 200), i('tomato', 150), i('garlic', 30), i('ginger', 25), i('green-chilli', 30), i('dry-red-chilli', 5, 'piece'), i('tamarind', 25), i('curry-leaves', 1, 'bunch'), i('turmeric', 1, 'tsp'), i('chilli-powder', 2, 'tsp'), i('mustard-seeds', 1, 'tsp'), i('oil', 60, 'ml'), i('salt', 1.5, 'tsp')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Balanced coconut gravy with a tamarind edge.', spice: 'medium', time: 35, photo: 'thaiCurry' }),
      v({ id: 'fiery', name: 'Fiery Kerala', description: 'Double the red chilli, the way it is eaten in Alleppey.', spice: 'fiery', time: 35, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 2 }, { op: 'scale', ingredientId: 'dry-red-chilli', factor: 2 }] }),
      v({ id: 'fish', name: 'With fish', description: 'The same gravy, made with firm white fish instead.', spice: 'medium', time: 35, photo: 'vegStew', overrides: [{ op: 'remove', ingredientId: 'prawns' }, { op: 'add', ingredient: i('fish', 600) }] }),
    ],
    creators: [
      c({ id: 'cp-1', name: 'Thomas Kurian', handle: '@malabartable', title: 'Chemmeen curry, Alleppey style', blurb: 'Coconut, kokum and a very hot pan.', photo: 'thaiCurry', hue: 200, spice: 'spicy', time: 35, followers: '290K subscribers' }),
      c({ id: 'cp-2', name: 'Lakshmi Nair', handle: '@keralakitchen', title: 'Mild prawn moilee', blurb: 'The gentle, creamy cousin of this curry.', photo: 'vegStew', hue: 140, spice: 'mild', time: 30, difficulty: 'easy', followers: '610K subscribers' }),
    ],
  },

  // ── North Indian ─────────────────────────────────────────
  {
    id: 'r-paneer-butter-masala', slug: 'paneer-butter-masala', name: 'Paneer Butter Masala', tagline: 'The one everyone orders',
    description: 'Paneer in a glossy tomato-and-cashew gravy, finished with butter and a little cream. Rich, faintly sweet, and impossible to stop eating with hot naan.',
    cuisine: 'north-indian', region: 'Delhi & Punjab', mealType: ['lunch', 'dinner'], image: img(PHOTOS.paneerButterMasala),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 25, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'eggless', 'gluten-free'], healthTags: ['high-protein'],
    estimatedCost: 420, rating: { value: 4.9, count: 3260 },
    nutrition: { calories: 468, protein: 19, carbs: 22, fat: 34, fibre: 4 },
    ingredients: [i('paneer', 400), i('tomato', 600), i('onion', 200), i('cashews', 80), i('butter', 80), i('cream', 100, 'ml'), i('ginger', 25), i('garlic', 30), i('green-chilli', 20), i('chilli-powder', 2, 'tsp'), i('garam-masala', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('turmeric', 0.5, 'tsp'), i('sugar', 10), i('oil', 40, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Restaurant-style, generous with the butter.', spice: 'mild', time: 40, photo: 'paneerButterMasala' }),
      v({ id: 'spicy', name: 'Spicy', description: 'More chilli, less cream, sharper finish.', spice: 'spicy', time: 40, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 2.5 }, { op: 'scale', ingredientId: 'cream', factor: 0.5 }] }),
      v({ id: 'vegan', name: 'Vegan', description: 'Tofu and cashew cream in place of paneer and dairy.', spice: 'mild', time: 45, photo: 'buddhaBowl', overrides: [{ op: 'remove', ingredientId: 'butter' }, { op: 'remove', ingredientId: 'cream' }, { op: 'scale', ingredientId: 'cashews', factor: 2 }] }),
      v({ id: 'dhaba', name: 'Dhaba-style', description: 'Rougher gravy, smoky finish, no cream at all.', spice: 'medium', time: 45, photo: 'butterChickenNaan', overrides: [{ op: 'remove', ingredientId: 'cream' }] }),
    ],
    creators: [
      c({ id: 'cpb-1', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Restaurant-style paneer butter masala', blurb: 'The cashew paste ratio that makes the gravy glossy.', photo: 'paneerButterMasala', hue: 12, spice: 'mild', time: 40, followers: '1.8M subscribers' }),
      c({ id: 'cpb-2', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Homestyle paneer makhani', blurb: 'Lighter, less sweet, made the way it is at home.', photo: 'butterChickenNaan', hue: 320, spice: 'medium', time: 40, followers: '720K subscribers' }),
      c({ id: 'cpb-3', name: 'Nisha Kapoor', handle: '@weekendcooks', title: '30-minute paneer butter masala', blurb: 'One pan, no blender, weeknight-friendly.', photo: 'thali', hue: 280, spice: 'mild', time: 30, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-butter-chicken', slug: 'butter-chicken', name: 'Butter Chicken', tagline: 'Delhi, 1947, still undefeated',
    description: 'Tandoor-charred chicken folded into a tomato gravy softened with butter and cream. Invented to use up leftover tandoori chicken, and now the most ordered Indian dish on earth.',
    cuisine: 'punjabi', region: 'Delhi', mealType: ['lunch', 'dinner'], image: img(PHOTOS.butterChickenNaan),
    vegClass: 'non-veg', baseServings: 4, prepTimeMins: 30, cookTimeMins: 35, difficulty: 'medium',
    dietaryTags: ['gluten-free'], healthTags: ['high-protein'],
    estimatedCost: 580, rating: { value: 4.9, count: 4120 },
    nutrition: { calories: 522, protein: 34, carbs: 18, fat: 36, fibre: 3 },
    ingredients: [i('chicken', 800), i('curd', 200), i('tomato', 600), i('onion', 150), i('cashews', 60), i('butter', 100), i('cream', 120, 'ml'), i('ginger', 30), i('garlic', 40), i('chilli-powder', 2, 'tsp'), i('garam-masala', 2, 'tsp'), i('coriander-powder', 2, 'tsp'), i('turmeric', 1, 'tsp'), i('lemon', 1, 'piece'), i('oil', 50, 'ml'), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Creamy, mildly spiced, restaurant-style.', spice: 'mild', time: 65, photo: 'butterChickenNaan' }),
      v({ id: 'smoky', name: 'Smoky dhungar', description: 'Finished with a live coal and ghee for tandoor smoke.', spice: 'medium', difficulty: 'hard', time: 75, photo: 'tandooriChicken' }),
      v({ id: 'spicy', name: 'Spicy', description: 'Punchier, with extra kashmiri chilli and less cream.', spice: 'spicy', time: 65, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 2.5 }, { op: 'scale', ingredientId: 'cream', factor: 0.5 }] }),
    ],
    creators: [
      c({ id: 'cbc-1', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Butter chicken, properly', blurb: 'Why the marinade matters more than the gravy.', photo: 'butterChickenNaan', hue: 12, spice: 'mild', time: 65, followers: '1.8M subscribers' }),
      c({ id: 'cbc-2', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Old Delhi murgh makhani', blurb: 'The pre-restaurant version — thinner, tangier.', photo: 'tandooriChicken', hue: 320, spice: 'medium', time: 70, followers: '720K subscribers' }),
    ],
  },
  {
    id: 'r-chole-bhature', slug: 'chole-bhature', name: 'Chole Bhature', tagline: 'Sunday lunch, Punjabi rules',
    description: 'Dark, tea-stained chickpeas beside a balloon of fried bread. Heavy in the best possible way — plan a nap.',
    cuisine: 'punjabi', region: 'Punjab & Delhi', mealType: ['breakfast', 'lunch'], image: img(PHOTOS.choleBhature),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 30, cookTimeMins: 45, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'eggless'], healthTags: ['high-protein', 'high-fibre'],
    estimatedCost: 260, rating: { value: 4.8, count: 2480 },
    nutrition: { calories: 596, protein: 18, carbs: 82, fat: 22, fibre: 12 },
    ingredients: [i('chickpeas', 400), i('maida', 400), i('curd', 100), i('onion', 200), i('tomato', 300), i('ginger', 30), i('garlic', 30), i('green-chilli', 30), i('tea-leaves', 2, 'tsp', { note: 'for colour' }), i('chilli-powder', 2, 'tsp'), i('garam-masala', 2, 'tsp'), i('coriander-powder', 2, 'tsp'), i('chaat-masala', 1, 'tsp'), i('oil', 500, 'ml', { note: 'for frying' }), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Amritsari chole with soft, puffed bhature.', spice: 'medium', time: 75, photo: 'choleBhature' }),
      v({ id: 'pindi', name: 'Pindi chole', description: 'No onion or tomato gravy — dry, dark, heavily spiced.', spice: 'spicy', time: 70, photo: 'chanaMasala', overrides: [{ op: 'remove', ingredientId: 'tomato' }, { op: 'scale', ingredientId: 'chilli-powder', factor: 2 }] }),
      v({ id: 'kulcha', name: 'With kulcha', description: 'Baked kulcha instead of fried bread — lighter.', spice: 'medium', difficulty: 'easy', time: 60, photo: 'butterChickenNaan', overrides: [{ op: 'scale', ingredientId: 'oil', factor: 0.15 }] }),
    ],
    creators: [
      c({ id: 'ccb-1', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Amritsari chole bhature', blurb: 'Tea bags for colour, and the exact frying temperature.', photo: 'choleBhature', hue: 320, spice: 'medium', time: 75, followers: '720K subscribers' }),
      c({ id: 'ccb-2', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Pindi chole', blurb: 'The dry Rawalpindi version, no tomato at all.', photo: 'chanaMasala', hue: 12, spice: 'spicy', time: 70, followers: '1.8M subscribers' }),
    ],
  },
  {
    id: 'r-rajma-chawal', slug: 'rajma-chawal', name: 'Rajma Chawal', tagline: 'Comfort food, north of the Vindhyas',
    description: 'Kidney beans slow-cooked into a thick, faintly smoky gravy and served over plain rice. The dish every north Indian student misses most.',
    cuisine: 'punjabi', region: 'Jammu & Punjab', mealType: ['lunch', 'dinner'], image: img(PHOTOS.rajma),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 50, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free', 'dairy-free'], healthTags: ['high-protein', 'high-fibre'],
    estimatedCost: 190, rating: { value: 4.7, count: 1640 },
    nutrition: { calories: 424, protein: 16, carbs: 72, fat: 8, fibre: 14 },
    ingredients: [i('rajma-beans', 350), i('rice', 400), i('onion', 250), i('tomato', 350), i('ginger', 25), i('garlic', 30), i('green-chilli', 20), i('cumin-seeds', 1, 'tsp'), i('chilli-powder', 2, 'tsp'), i('coriander-powder', 2, 'tsp'), i('garam-masala', 1, 'tsp'), i('turmeric', 1, 'tsp'), i('bay-leaf', 2, 'piece'), i('oil', 60, 'ml'), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Thick gravy, beans partly mashed.', spice: 'medium', difficulty: 'easy', time: 65, photo: 'rajma' }),
      v({ id: 'kashmiri', name: 'Kashmiri-style', description: 'With fennel and dried ginger, no onion or garlic.', spice: 'mild', time: 70, photo: 'vegStew', overrides: [{ op: 'remove', ingredientId: 'onion' }, { op: 'remove', ingredientId: 'garlic' }] }),
    ],
    creators: [
      c({ id: 'crj-1', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Rajma like your mother made', blurb: 'Overnight soak, long simmer, no shortcuts.', photo: 'rajma', hue: 320, spice: 'medium', time: 65, difficulty: 'easy', followers: '720K subscribers' }),
      c({ id: 'crj-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Pressure-cooker rajma', blurb: 'Canned beans, 25 minutes, surprisingly good.', photo: 'chanaMasala', hue: 280, spice: 'mild', time: 25, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-chana-masala', slug: 'chana-masala', name: 'Chana Masala', tagline: 'Weeknight, no negotiation',
    description: 'Chickpeas in a tangy onion-tomato masala with amchur and garam masala. Ready in half an hour and better the next day.',
    cuisine: 'north-indian', region: 'North India', mealType: ['lunch', 'dinner'], image: img(PHOTOS.chanaMasala),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 10, cookTimeMins: 25, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free', 'dairy-free'], healthTags: ['high-protein', 'high-fibre'],
    estimatedCost: 160, rating: { value: 4.6, count: 1280 },
    nutrition: { calories: 328, protein: 14, carbs: 48, fat: 9, fibre: 12 },
    ingredients: [i('chickpeas', 400), i('onion', 250), i('tomato', 350), i('ginger', 25), i('garlic', 30), i('green-chilli', 25), i('cumin-seeds', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('garam-masala', 1.5, 'tsp'), i('chilli-powder', 1.5, 'tsp'), i('turmeric', 1, 'tsp'), i('chaat-masala', 1, 'tsp'), i('oil', 50, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Balanced, tangy, everyday.', spice: 'medium', difficulty: 'easy', time: 35, photo: 'chanaMasala' }),
      v({ id: 'jain', name: 'Jain', description: 'No onion, no garlic — built on tomato and asafoetida.', spice: 'mild', difficulty: 'easy', time: 35, photo: 'thali', overrides: [{ op: 'remove', ingredientId: 'onion' }, { op: 'remove', ingredientId: 'garlic' }, { op: 'add', ingredient: i('asafoetida', 2, 'pinch') }] }),
    ],
    creators: [
      c({ id: 'ccm-1', name: 'Nisha Kapoor', handle: '@weekendcooks', title: '30-minute chana masala', blurb: 'Canned chickpeas, no apology.', photo: 'chanaMasala', hue: 280, spice: 'medium', time: 30, difficulty: 'easy', followers: '450K followers' }),
      c({ id: 'ccm-2', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Dhaba chana masala', blurb: 'Roughly chopped, heavily fried, deeply browned.', photo: 'choleBhature', hue: 12, spice: 'spicy', time: 45, followers: '1.8M subscribers' }),
    ],
  },
  {
    id: 'r-baingan-bharta', slug: 'baingan-bharta', name: 'Baingan Bharta', tagline: 'Smoke, then everything else',
    description: 'Aubergine charred whole over a flame until it collapses, then mashed into fried onions and tomato. The smoke is the whole point.',
    cuisine: 'punjabi', region: 'Punjab', mealType: ['lunch', 'dinner'], image: img(PHOTOS.baiganBharta),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 30, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'gluten-free', 'dairy-free'], healthTags: ['low-calorie', 'low-carb', 'high-fibre'],
    estimatedCost: 140, rating: { value: 4.5, count: 720 },
    nutrition: { calories: 186, protein: 4, carbs: 18, fat: 11, fibre: 8 },
    ingredients: [i('brinjal', 700), i('onion', 250), i('tomato', 300), i('green-chilli', 30), i('ginger', 25), i('garlic', 25), i('cumin-seeds', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('chilli-powder', 1.5, 'tsp'), i('turmeric', 0.5, 'tsp'), i('oil', 60, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Flame-roasted, coarsely mashed.', spice: 'medium', time: 45, photo: 'baiganBharta' }),
      v({ id: 'dahi', name: 'With curd', description: 'Whisked curd stirred in at the end — cooler, tangier.', spice: 'mild', difficulty: 'easy', time: 45, photo: 'thali', overrides: [{ op: 'add', ingredient: i('curd', 200) }] }),
    ],
    creators: [
      c({ id: 'cbb-1', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Bharta on an open flame', blurb: 'Charring technique, and what to do without a gas hob.', photo: 'baiganBharta', hue: 320, spice: 'medium', time: 45, followers: '720K subscribers' }),
      c({ id: 'cbb-2', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Dhaba bharta', blurb: 'More oil, more onion, cooked much longer.', photo: 'alooSabzi', hue: 12, spice: 'spicy', time: 55, followers: '1.8M subscribers' }),
    ],
  },
  {
    id: 'r-aloo-gobi', slug: 'aloo-gobi', name: 'Aloo Gobi', tagline: 'Dry, turmeric-yellow, everywhere',
    description: 'Potato and cauliflower cooked dry with cumin and turmeric until the edges caramelise. No gravy, no fuss.',
    cuisine: 'punjabi', region: 'Punjab', mealType: ['lunch', 'dinner'], image: img(PHOTOS.alooSabzi),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 10, cookTimeMins: 25, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'jain', 'gluten-free', 'dairy-free'], healthTags: ['low-calorie', 'high-fibre'],
    estimatedCost: 120, rating: { value: 4.4, count: 890 },
    nutrition: { calories: 198, protein: 5, carbs: 28, fat: 8, fibre: 6 },
    ingredients: [i('potato', 400), i('cauliflower', 1, 'piece'), i('onion', 150), i('tomato', 150), i('ginger', 20), i('green-chilli', 20), i('cumin-seeds', 1, 'tsp'), i('turmeric', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('chilli-powder', 1, 'tsp'), i('garam-masala', 0.5, 'tsp'), i('oil', 50, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Dry, everyday sabzi.', spice: 'mild', difficulty: 'easy', time: 35, photo: 'alooSabzi' }),
      v({ id: 'restaurant', name: 'Restaurant-style', description: 'Cauliflower fried separately so it stays firm.', spice: 'medium', time: 45, photo: 'thali' }),
    ],
    creators: [
      c({ id: 'cag-1', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Everyday aloo gobi', blurb: 'One pan, twenty minutes.', photo: 'alooSabzi', hue: 280, spice: 'mild', time: 30, difficulty: 'easy', followers: '450K followers' }),
      c({ id: 'cag-2', name: 'Simran Kaur', handle: '@punjabikitchen', title: 'Dry aloo gobi with ajwain', blurb: 'Why frying the cauliflower separately is worth it.', photo: 'thali', hue: 320, spice: 'medium', time: 45, followers: '720K subscribers' }),
    ],
  },

  // ── Regional ─────────────────────────────────────────────
  {
    id: 'r-hyderabadi-biryani', slug: 'hyderabadi-chicken-biryani', name: 'Hyderabadi Chicken Biryani', tagline: 'Sealed, layered, worth the wait',
    description: 'Marinated chicken and part-cooked basmati layered raw and finished on dum under a sealed lid, so the rice steams in the meat’s own spice. Saffron, fried onion, mint.',
    cuisine: 'telangana', region: 'Hyderabad', mealType: ['lunch', 'dinner'], image: img(PHOTOS.biryani),
    vegClass: 'non-veg', baseServings: 4, prepTimeMins: 45, cookTimeMins: 55, difficulty: 'hard',
    dietaryTags: [], healthTags: ['high-protein'],
    estimatedCost: 650, rating: { value: 4.9, count: 5240 },
    nutrition: { calories: 648, protein: 36, carbs: 74, fat: 24, fibre: 4 },
    ingredients: [i('chicken', 800), i('basmati-rice', 600), i('curd', 300), i('onion', 400), i('ginger', 40), i('garlic', 40), i('green-chilli', 40), i('mint-leaves', 1, 'bunch'), i('coriander-leaves', 1, 'bunch'), i('saffron', 2, 'pinch'), i('milk', 50, 'ml'), i('ghee', 100), i('oil', 100, 'ml'), i('garam-masala', 2, 'tsp'), i('chilli-powder', 2, 'tsp'), i('turmeric', 1, 'tsp'), i('bay-leaf', 3, 'piece'), i('cardamom', 6, 'piece'), i('cloves', 6, 'piece'), i('cinnamon', 2, 'piece'), i('lemon', 2, 'piece'), i('salt', 3, 'tsp')],
    variants: [
      v({ id: 'kacchi', name: 'Kacchi (raw) dum', description: 'Raw marinated meat layered under the rice — the traditional method.', spice: 'spicy', difficulty: 'hard', time: 100, photo: 'biryani' }),
      v({ id: 'pakki', name: 'Pakki (cooked)', description: 'Meat cooked through first, then layered. More forgiving.', spice: 'medium', time: 85, photo: 'biryaniAlt' }),
      v({ id: 'mild', name: 'Mild', description: 'Half the chilli, more mint and saffron.', spice: 'mild', time: 90, photo: 'pulao', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 0.4 }, { op: 'scale', ingredientId: 'green-chilli', factor: 0.4 }] }),
      v({ id: 'veg', name: 'Vegetable biryani', description: 'Mixed vegetables and paneer in place of chicken.', spice: 'medium', time: 75, photo: 'pulao', overrides: [{ op: 'remove', ingredientId: 'chicken' }, { op: 'add', ingredient: i('paneer', 300) }, { op: 'add', ingredient: i('carrot', 200) }, { op: 'add', ingredient: i('peas', 150) }] }),
    ],
    creators: [
      c({ id: 'chb-1', name: 'Zainab Qureshi', handle: '@hyderabadidum', title: 'Kacchi biryani on dum', blurb: 'Dough-sealing the lid, and how to know when it is done without opening it.', photo: 'biryani', hue: 264, spice: 'spicy', time: 100, difficulty: 'hard', followers: '2.4M subscribers' }),
      c({ id: 'chb-2', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Pakki biryani for beginners', blurb: 'The safer method that still tastes right.', photo: 'biryaniAlt', hue: 12, spice: 'medium', time: 85, followers: '1.8M subscribers' }),
      c({ id: 'chb-3', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'One-pot chicken pulao', blurb: 'Not biryani, and not pretending to be. Ready in 45 minutes.', photo: 'pulao', hue: 280, spice: 'mild', time: 45, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-pav-bhaji', slug: 'pav-bhaji', name: 'Pav Bhaji', tagline: 'Mumbai, on a griddle, at night',
    description: 'A mash of vegetables cooked down with pav bhaji masala and an indecent amount of butter, served with soft buns griddled in yet more butter.',
    cuisine: 'maharashtrian', region: 'Mumbai', mealType: ['snack', 'dinner'], image: img(PHOTOS.pavBhaji),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 20, cookTimeMins: 30, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'eggless'], healthTags: ['high-fibre'],
    estimatedCost: 200, rating: { value: 4.8, count: 2960 },
    nutrition: { calories: 486, protein: 11, carbs: 62, fat: 22, fibre: 9 },
    ingredients: [i('potato', 500), i('cauliflower', 1, 'piece'), i('peas', 200), i('capsicum', 2, 'piece'), i('onion', 300), i('tomato', 400), i('pav', 8, 'piece'), i('butter', 150), i('pav-bhaji-masala', 3, 'tbsp'), i('chilli-powder', 2, 'tsp'), i('ginger', 25), i('garlic', 30), i('lemon', 2, 'piece'), i('oil', 40, 'ml'), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'The Juhu beach version — red, buttery, soft.', spice: 'medium', difficulty: 'easy', time: 50, photo: 'pavBhaji' }),
      v({ id: 'cheese', name: 'Cheese pav bhaji', description: 'Grated cheese melted over the top.', spice: 'mild', difficulty: 'easy', time: 50, photo: 'grilledSandwich', overrides: [{ op: 'add', ingredient: i('cheese', 150) }] }),
      v({ id: 'jain', name: 'Jain pav bhaji', description: 'No potato, onion or garlic — raw banana instead.', spice: 'medium', time: 55, photo: 'thali', overrides: [{ op: 'remove', ingredientId: 'potato' }, { op: 'remove', ingredientId: 'onion' }, { op: 'remove', ingredientId: 'garlic' }] }),
    ],
    creators: [
      c({ id: 'cpv-1', name: 'Kunal Shirodkar', handle: '@mumbaistreets', title: 'Beach-style pav bhaji', blurb: 'The mashing technique and how much butter is actually correct.', photo: 'pavBhaji', hue: 348, spice: 'medium', time: 50, difficulty: 'easy', followers: '1.5M subscribers' }),
      c({ id: 'cpv-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Pressure-cooker pav bhaji', blurb: 'Everything in one pot, 25 minutes.', photo: 'vadaPav', hue: 280, spice: 'mild', time: 25, difficulty: 'easy', followers: '450K followers' }),
    ],
  },
  {
    id: 'r-vada-pav', slug: 'vada-pav', name: 'Vada Pav', tagline: 'The original Indian burger',
    description: 'A spiced potato dumpling in gram-flour batter, deep-fried and pressed into a soft bun with dry garlic chutney. Costs forty rupees on the street and is worth considerably more.',
    cuisine: 'maharashtrian', region: 'Mumbai', mealType: ['snack'], image: img(PHOTOS.vadaPav),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 20, cookTimeMins: 20, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'vegan', 'eggless'], healthTags: [],
    estimatedCost: 130, rating: { value: 4.7, count: 1740 },
    nutrition: { calories: 352, protein: 8, carbs: 52, fat: 13, fibre: 4 },
    ingredients: [i('potato', 600), i('besan', 200), i('pav', 8, 'piece'), i('garlic', 60), i('green-chilli', 40), i('ginger', 25), i('dry-red-chilli', 8, 'piece'), i('coconut', 1, 'piece'), ...TEMPERING, i('turmeric', 1, 'tsp'), i('oil', 500, 'ml', { note: 'for frying' }), i('salt', 2, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'With dry garlic chutney and a fried green chilli.', spice: 'spicy', time: 40, photo: 'vadaPav' }),
      v({ id: 'cheese', name: 'Cheese vada pav', description: 'A slice of cheese under the vada.', spice: 'mild', difficulty: 'easy', time: 40, photo: 'grilledSandwich', overrides: [{ op: 'add', ingredient: i('cheese', 100) }] }),
    ],
    creators: [
      c({ id: 'cvp-1', name: 'Kunal Shirodkar', handle: '@mumbaistreets', title: 'Dadar-station vada pav', blurb: 'The dry chutney recipe is the whole secret.', photo: 'vadaPav', hue: 348, spice: 'spicy', time: 40, followers: '1.5M subscribers' }),
      c({ id: 'cvp-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Baked vada pav', blurb: 'Less oil. Honest about the trade-off.', photo: 'pavBhaji', hue: 280, spice: 'medium', time: 45, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-tandoori-chicken', slug: 'tandoori-chicken', name: 'Tandoori Chicken', tagline: 'Yoghurt, char, patience',
    description: 'Chicken marinated twice — once in lemon and chilli, once in spiced yoghurt — then blasted at high heat until the edges blacken.',
    cuisine: 'punjabi', region: 'Punjab', mealType: ['dinner', 'snack'], image: img(PHOTOS.tandooriChicken),
    vegClass: 'non-veg', baseServings: 4, prepTimeMins: 30, cookTimeMins: 30, difficulty: 'medium',
    dietaryTags: ['gluten-free'], healthTags: ['high-protein', 'low-carb'],
    estimatedCost: 480, rating: { value: 4.8, count: 1920 },
    nutrition: { calories: 386, protein: 42, carbs: 8, fat: 20, fibre: 1 },
    ingredients: [i('chicken', 900), i('curd', 300), i('ginger', 40), i('garlic', 40), i('lemon', 2, 'piece'), i('chilli-powder', 3, 'tsp'), i('garam-masala', 2, 'tsp'), i('turmeric', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('oil', 60, 'ml'), i('salt', 2, 'tsp'), i('onion', 200, 'g', { note: 'to serve' }), i('chaat-masala', 1, 'tsp')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Oven or grill, high heat, twice-marinated.', spice: 'medium', time: 60, photo: 'tandooriChicken' }),
      v({ id: 'fiery', name: 'Fiery', description: 'Double chilli and a longer marinade.', spice: 'fiery', time: 70, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 2 }] }),
      v({ id: 'malai', name: 'Malai tikka', description: 'Cream and cheese marinade instead — mild and rich.', spice: 'mild', time: 60, photo: 'butterChickenNaan', overrides: [{ op: 'scale', ingredientId: 'chilli-powder', factor: 0.2 }, { op: 'add', ingredient: i('cream', 150, 'ml') }, { op: 'add', ingredient: i('cheese', 100) }] }),
    ],
    creators: [
      c({ id: 'ctc-1', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Tandoori chicken without a tandoor', blurb: 'Oven settings and rack position that actually work.', photo: 'tandooriChicken', hue: 12, spice: 'medium', time: 60, followers: '1.8M subscribers' }),
      c({ id: 'ctc-2', name: 'Zainab Qureshi', handle: '@hyderabadidum', title: 'Double-marinade method', blurb: 'Why the first marinade has no yoghurt in it.', photo: 'butterChickenNaan', hue: 264, spice: 'spicy', time: 70, followers: '2.4M subscribers' }),
    ],
  },
  {
    id: 'r-samosa', slug: 'samosa', name: 'Samosa', tagline: 'Corners, crunch, chutney',
    description: 'Spiced potato and pea filling in a flaky pastry triangle, fried slow so the shell blisters rather than browns.',
    cuisine: 'north-indian', region: 'North India', mealType: ['snack'], image: img(PHOTOS.samosa),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 30, cookTimeMins: 25, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'vegan', 'eggless'], healthTags: [],
    estimatedCost: 130, rating: { value: 4.7, count: 2210 },
    nutrition: { calories: 308, protein: 6, carbs: 42, fat: 14, fibre: 4 },
    ingredients: [i('maida', 300), i('potato', 500), i('peas', 150), i('green-chilli', 25), i('ginger', 20), i('cumin-seeds', 1, 'tsp'), i('coriander-powder', 2, 'tsp'), i('garam-masala', 1, 'tsp'), i('chaat-masala', 1, 'tsp'), i('oil', 500, 'ml', { note: 'for frying' }), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Punjabi potato-pea samosa.', spice: 'medium', time: 55, photo: 'samosa' }),
      v({ id: 'keema', name: 'Keema samosa', description: 'Spiced minced mutton filling.', spice: 'spicy', time: 65, photo: 'kachoriPlatter', overrides: [{ op: 'remove', ingredientId: 'peas' }, { op: 'add', ingredient: i('mutton', 400) }] }),
      v({ id: 'baked', name: 'Baked', description: 'Oven-baked, brushed with oil.', spice: 'mild', difficulty: 'easy', time: 60, photo: 'kachoriPlatter', overrides: [{ op: 'scale', ingredientId: 'oil', factor: 0.12 }] }),
    ],
    creators: [
      c({ id: 'csm-1', name: 'Rohit Malhotra', handle: '@dhabadiaries', title: 'Halwai-style samosa', blurb: 'Low-temperature frying for a blistered shell.', photo: 'samosa', hue: 12, spice: 'medium', time: 55, followers: '1.8M subscribers' }),
      c({ id: 'csm-2', name: 'Zainab Qureshi', handle: '@hyderabadidum', title: 'Keema samosa', blurb: 'The Hyderabadi mince filling.', photo: 'kachoriPlatter', hue: 264, spice: 'spicy', time: 65, followers: '2.4M subscribers' }),
    ],
  },

  // ── Indo-Chinese & global ────────────────────────────────
  {
    id: 'r-hakka-noodles', slug: 'hakka-noodles', name: 'Hakka Noodles', tagline: 'High flame, fast hands',
    description: 'Noodles tossed with julienned vegetables over a very hot wok. Indo-Chinese, invented in Kolkata, and nothing like anything in China.',
    cuisine: 'indo-chinese', region: 'Kolkata', mealType: ['lunch', 'dinner', 'snack'], image: img(PHOTOS.hakkaNoodles),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 15, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'dairy-free'], healthTags: [],
    estimatedCost: 180, rating: { value: 4.5, count: 1380 },
    nutrition: { calories: 364, protein: 10, carbs: 58, fat: 11, fibre: 5 },
    ingredients: [i('noodles', 400), i('cabbage', 200), i('carrot', 150), i('capsicum', 2, 'piece'), i('onion', 150), i('garlic', 40), i('ginger', 25), i('green-chilli', 20), i('soy-sauce', 3, 'tbsp'), i('vinegar', 2, 'tbsp'), i('tomato-ketchup', 2, 'tbsp'), i('oil', 60, 'ml'), i('salt', 1, 'tsp')],
    variants: [
      v({ id: 'veg', name: 'Veg Hakka', description: 'Vegetables only, high flame.', spice: 'mild', difficulty: 'easy', time: 30, photo: 'hakkaNoodles' }),
      v({ id: 'schezwan', name: 'Schezwan', description: 'Tossed with schezwan chutney — properly hot.', spice: 'fiery', difficulty: 'easy', time: 30, photo: 'chaat', overrides: [{ op: 'scale', ingredientId: 'green-chilli', factor: 3 }, { op: 'add', ingredient: i('dry-red-chilli', 10, 'piece') }] }),
      v({ id: 'chicken', name: 'Chicken Hakka', description: 'With shredded chicken.', spice: 'medium', difficulty: 'easy', time: 35, photo: 'koreanBowl', overrides: [{ op: 'add', ingredient: i('chicken', 400) }] }),
    ],
    creators: [
      c({ id: 'chn-1', name: 'Ray Chen', handle: '@calcuttawok', title: 'Restaurant wok hei at home', blurb: 'Getting a domestic hob hot enough to matter.', photo: 'hakkaNoodles', hue: 96, spice: 'medium', time: 30, difficulty: 'easy', followers: '980K subscribers' }),
      c({ id: 'chn-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: '20-minute veg noodles', blurb: 'Weeknight version, pantry ingredients.', photo: 'koreanBowl', hue: 280, spice: 'mild', time: 20, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-veg-momos', slug: 'veg-momos', name: 'Veg Momos', tagline: 'Steamed, pleated, addictive',
    description: 'Thin-skinned dumplings filled with cabbage, carrot and spring onion, steamed and served with a fierce red chilli chutney.',
    cuisine: 'indo-chinese', region: 'Darjeeling & Delhi', mealType: ['snack'], image: img(PHOTOS.momos),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 40, cookTimeMins: 20, difficulty: 'hard',
    dietaryTags: ['vegetarian', 'vegan', 'eggless', 'dairy-free'], healthTags: ['low-calorie'],
    estimatedCost: 160, rating: { value: 4.6, count: 1120 },
    nutrition: { calories: 242, protein: 7, carbs: 42, fat: 5, fibre: 4 },
    ingredients: [i('maida', 300), i('cabbage', 300), i('carrot', 200), i('onion', 150), i('garlic', 40), i('ginger', 30), i('green-chilli', 25), i('dry-red-chilli', 10, 'piece'), i('soy-sauce', 2, 'tbsp'), i('vinegar', 2, 'tbsp'), i('oil', 40, 'ml'), i('salt', 1.5, 'tsp'), i('coriander-leaves', 1, 'bunch')],
    variants: [
      v({ id: 'steamed', name: 'Steamed', description: 'Classic, with red chutney.', spice: 'medium', difficulty: 'hard', time: 60, photo: 'momos' }),
      v({ id: 'fried', name: 'Pan-fried', description: 'Crisped on one side, potsticker-style.', spice: 'medium', time: 65, photo: 'kachoriPlatter' }),
      v({ id: 'paneer', name: 'Paneer momos', description: 'Crumbled paneer through the filling.', spice: 'mild', difficulty: 'hard', time: 60, photo: 'paneerButterMasala', overrides: [{ op: 'add', ingredient: i('paneer', 250) }] }),
    ],
    creators: [
      c({ id: 'cmo-1', name: 'Tenzin Dolma', handle: '@himalayankitchen', title: 'Pleating momos, slowly', blurb: 'Dough thickness and the pleat, shown at quarter speed.', photo: 'momos', hue: 176, spice: 'medium', time: 60, difficulty: 'hard', followers: '660K subscribers' }),
      c({ id: 'cmo-2', name: 'Ray Chen', handle: '@calcuttawok', title: 'Momo chutney that burns', blurb: 'The red chutney, made properly hot.', photo: 'chaat', hue: 96, spice: 'fiery', time: 20, difficulty: 'easy', followers: '980K subscribers' }),
    ],
  },
  {
    id: 'r-margherita-pizza', slug: 'margherita-pizza', name: 'Margherita Pizza', tagline: 'Three ingredients, nowhere to hide',
    description: 'Tomato, mozzarella, basil. The dough is the whole dish — a slow cold ferment is what separates good from forgettable.',
    cuisine: 'italian', region: 'Naples', mealType: ['dinner', 'snack'], image: img(PHOTOS.pizza),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 30, cookTimeMins: 15, difficulty: 'medium',
    dietaryTags: ['vegetarian', 'eggless'], healthTags: [],
    estimatedCost: 340, rating: { value: 4.7, count: 1560 },
    nutrition: { calories: 512, protein: 20, carbs: 64, fat: 20, fibre: 4 },
    ingredients: [i('maida', 500), i('cheese', 300), i('tomato', 400), i('basil', 1, 'bunch'), i('olive-oil', 60, 'ml'), i('garlic', 20), i('salt', 2, 'tsp'), i('sugar', 10)],
    variants: [
      v({ id: 'classic', name: 'Classic Margherita', description: 'Fior di latte, basil, nothing else.', spice: 'mild', time: 45, photo: 'pizza' }),
      v({ id: 'veggie', name: 'Loaded veggie', description: 'Capsicum, onion, olives, sweetcorn.', spice: 'mild', difficulty: 'easy', time: 45, photo: 'gardenSalad', overrides: [{ op: 'add', ingredient: i('capsicum', 2, 'piece') }, { op: 'add', ingredient: i('onion', 150) }] }),
    ],
    creators: [
      c({ id: 'cpz-1', name: 'Marco Bianchi', handle: '@fornoacasa', title: '48-hour cold ferment dough', blurb: 'Hydration, folding and why time does the work.', photo: 'pizza', hue: 84, spice: 'mild', time: 45, followers: '1.1M subscribers' }),
      c({ id: 'cpz-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Tawa pizza, no oven', blurb: 'For anyone without a proper oven.', photo: 'grilledSandwich', hue: 280, spice: 'mild', time: 35, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },
  {
    id: 'r-pesto-pasta', slug: 'pesto-pasta', name: 'Pesto Pasta', tagline: 'Twenty minutes, one blender',
    description: 'Basil, garlic and nuts blitzed raw with olive oil and tossed through hot pasta. Never cook pesto — the heat of the pasta is enough.',
    cuisine: 'italian', region: 'Liguria', mealType: ['lunch', 'dinner'], image: img(PHOTOS.pestoPasta),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 10, cookTimeMins: 12, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'eggless'], healthTags: [],
    estimatedCost: 380, rating: { value: 4.6, count: 840 },
    nutrition: { calories: 542, protein: 16, carbs: 62, fat: 26, fibre: 5 },
    ingredients: [i('pasta', 400), i('basil', 2, 'bunch'), i('cashews', 80), i('garlic', 20), i('cheese', 100), i('olive-oil', 120, 'ml'), i('lemon', 1, 'piece'), i('salt', 1.5, 'tsp')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Raw basil pesto, tossed off the heat.', spice: 'mild', difficulty: 'easy', time: 22, photo: 'pestoPasta' }),
      v({ id: 'creamy', name: 'Creamy pesto', description: 'A splash of cream for a softer sauce.', spice: 'mild', difficulty: 'easy', time: 25, photo: 'buddhaBowl', overrides: [{ op: 'add', ingredient: i('cream', 150, 'ml') }] }),
    ],
    creators: [
      c({ id: 'cps-1', name: 'Marco Bianchi', handle: '@fornoacasa', title: 'Pesto without a mortar', blurb: 'Blender method that does not bruise the basil.', photo: 'pestoPasta', hue: 84, spice: 'mild', time: 22, difficulty: 'easy', followers: '1.1M subscribers' }),
      c({ id: 'cps-2', name: 'Nisha Kapoor', handle: '@weekendcooks', title: 'Pantry pesto', blurb: 'Cashews instead of pine nuts. Nobody will know.', photo: 'gardenSalad', hue: 280, spice: 'mild', time: 20, difficulty: 'easy', video: false, followers: '450K followers' }),
    ],
  },

  // ── Drinks & desserts ────────────────────────────────────
  {
    id: 'r-masala-chai', slug: 'masala-chai', name: 'Masala Chai', tagline: 'Boiled, not brewed',
    description: 'Tea, milk, sugar and whole spices boiled together hard — the opposite of how tea is made anywhere else, and better for it.',
    cuisine: 'north-indian', region: 'Everywhere', mealType: ['drink', 'breakfast', 'snack'], image: img(PHOTOS.masalaChai),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 5, cookTimeMins: 10, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'eggless', 'gluten-free'], healthTags: ['low-calorie'],
    estimatedCost: 60, rating: { value: 4.9, count: 3840 },
    nutrition: { calories: 118, protein: 4, carbs: 18, fat: 4, fibre: 0 },
    ingredients: [i('milk', 500, 'ml'), i('tea-leaves', 4, 'tsp'), i('sugar', 40), i('ginger', 25), i('cardamom', 6, 'piece'), i('cloves', 4, 'piece'), i('cinnamon', 1, 'piece')],
    variants: [
      v({ id: 'classic', name: 'Classic', description: 'Ginger and cardamom, boiled hard.', spice: 'mild', difficulty: 'easy', time: 15, photo: 'masalaChai' }),
      v({ id: 'kadak', name: 'Kadak chai', description: 'Stronger, darker, less milk — the cutting-chai version.', spice: 'medium', difficulty: 'easy', time: 15, photo: 'chaiDark', overrides: [{ op: 'scale', ingredientId: 'tea-leaves', factor: 1.5 }, { op: 'scale', ingredientId: 'milk', factor: 0.6 }] }),
      v({ id: 'vegan', name: 'Oat milk chai', description: 'Made with oat milk — holds up to boiling.', spice: 'mild', difficulty: 'easy', time: 15, photo: 'chaiDark' }),
    ],
    creators: [
      c({ id: 'cch-1', name: 'Kunal Shirodkar', handle: '@mumbaistreets', title: 'Cutting chai, tapri style', blurb: 'How long to boil, and when to add the milk.', photo: 'masalaChai', hue: 348, spice: 'mild', time: 15, difficulty: 'easy', followers: '1.5M subscribers' }),
      c({ id: 'cch-2', name: 'Meera Iyengar', handle: '@meerascookbook', title: 'Homemade chai masala', blurb: 'The whole-spice blend, ground fresh.', photo: 'spices', hue: 18, spice: 'medium', time: 20, difficulty: 'easy', followers: '1.2M subscribers' }),
    ],
  },
  {
    id: 'r-mango-kulfi', slug: 'mango-kulfi', name: 'Mango Kulfi', tagline: 'Denser than ice cream, on purpose',
    description: 'Milk reduced until it thickens, folded with mango and frozen in moulds without churning. The result is dense rather than airy — that is the point.',
    cuisine: 'north-indian', region: 'North India', mealType: ['dessert'], image: img(PHOTOS.kulfi),
    vegClass: 'veg', baseServings: 4, prepTimeMins: 15, cookTimeMins: 40, difficulty: 'easy',
    dietaryTags: ['vegetarian', 'eggless', 'gluten-free'], healthTags: [],
    estimatedCost: 240, rating: { value: 4.7, count: 960 },
    nutrition: { calories: 286, protein: 7, carbs: 38, fat: 12, fibre: 1 },
    ingredients: [i('milk', 1, 'l'), i('khoya', 150), i('sugar', 120), i('cardamom', 6, 'piece'), i('almonds', 60), i('cashews', 50), i('saffron', 2, 'pinch')],
    variants: [
      v({ id: 'mango', name: 'Mango', description: 'Alphonso pulp folded through reduced milk.', spice: 'mild', difficulty: 'easy', time: 55, photo: 'kulfi' }),
      v({ id: 'malai', name: 'Malai kulfi', description: 'Plain, with cardamom and pistachio.', spice: 'mild', difficulty: 'easy', time: 55, photo: 'cupcakes' }),
    ],
    creators: [
      c({ id: 'ckf-1', name: 'Meera Iyengar', handle: '@meerascookbook', title: 'Kulfi without an ice-cream maker', blurb: 'Reducing the milk properly is the only hard part.', photo: 'kulfi', hue: 18, spice: 'mild', time: 55, difficulty: 'easy', followers: '1.2M subscribers' }),
      c({ id: 'ckf-2', name: 'Zainab Qureshi', handle: '@hyderabadidum', title: 'Saffron malai kulfi', blurb: 'Heavier on the khoya, set in matka pots.', photo: 'cupcakes', hue: 264, spice: 'mild', time: 60, followers: '2.4M subscribers' }),
    ],
  },
]

const BY_SLUG = new Map(RECIPES.map((r) => [r.slug, r]))

export function getRecipe(slug: string): Recipe | undefined {
  return BY_SLUG.get(slug)
}

/** Total hands-on + cooking time. Used by the time filter and card meta. */
export function totalTime(recipe: Recipe): number {
  return recipe.prepTimeMins + recipe.cookTimeMins
}

/**
 * Regional, not generic — "Flavours of Punjab" is a reason to click,
 * "Easy dinners" is a filter with extra steps. Every rail here is a real
 * place or a real regional repertoire, not a difficulty/time bucket.
 */
export const COLLECTIONS: Collection[] = [
  {
    id: 'col-south',
    title: 'South Indian Kitchen',
    subtitle: 'Fermented, tempered, built around rice and lentil',
    recipeSlugs: [
      'masala-dosa',
      'idli-sambar',
      'medu-vada',
      'lemon-rice',
      'bisi-bele-bath',
      'kerala-veg-stew',
      'coconut-prawn-curry',
    ],
  },
  {
    id: 'col-punjab',
    title: 'Flavours of Punjab',
    subtitle: 'Butter, tandoor smoke, and no half measures',
    recipeSlugs: [
      'butter-chicken',
      'paneer-butter-masala',
      'chole-bhature',
      'rajma-chawal',
      'baingan-bharta',
      'aloo-gobi',
      'tandoori-chicken',
    ],
  },
  {
    id: 'col-mumbai',
    title: 'Mumbai Street Food',
    subtitle: "The city that never stops eating, after dark especially",
    recipeSlugs: ['pav-bhaji', 'vada-pav', 'samosa', 'hakka-noodles'],
  },
]
