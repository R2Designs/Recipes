import type { Product } from '@/types/product'
import type { Unit } from '@/types/domain'
import { getIngredient } from './ingredients'

/**
 * Mock SKU catalogue.
 *
 * Written as compact tuples rather than full objects — a grocery catalogue is
 * mostly repetition, and the tuple form keeps ~140 SKUs readable and easy to
 * extend. `buildCatalogue()` expands them into `Product`s.
 *
 * When Instamart MCP lands, this whole file is replaced by a live catalogue
 * search behind `ingredientMatcher` — nothing else needs to change.
 */

type Availability = 'in-stock' | 'low-stock' | 'out-of-stock'

/** [brand, packSize, packUnit, price, mrp?, availability?] */
type SKU = [string, number, Unit, number, number?, Availability?]

const CATALOGUE: Record<string, SKU[]> = {
  // ── Grains & flours ───────────────────────────────────────
  rice: [
    ['India Gate', 1, 'kg', 118, 135],
    ['India Gate', 5, 'kg', 545, 620],
    ['Daawat Rozana', 5, 'kg', 495, 560],
  ],
  'basmati-rice': [
    ['India Gate Classic', 1, 'kg', 182, 210],
    ['Daawat Super', 1, 'kg', 165, 189],
    ['India Gate Classic', 5, 'kg', 869, 995],
  ],
  poha: [
    ['Tata Sampann', 500, 'g', 62, 72],
    ['Fortune', 1, 'kg', 108, 125],
  ],
  semolina: [
    ['Aashirvaad', 500, 'g', 48, 55],
    ['Fortune', 1, 'kg', 88, 99],
  ],
  atta: [
    ['Aashirvaad', 1, 'kg', 62, 70],
    ['Aashirvaad', 5, 'kg', 289, 325],
    ['Fortune Chakki Fresh', 5, 'kg', 268, 310],
  ],
  maida: [
    ['Aashirvaad', 500, 'g', 38, 44],
    ['Rajdhani', 1, 'kg', 68, 78],
  ],
  besan: [
    ['Tata Sampann', 500, 'g', 78, 90],
    ['Rajdhani', 1, 'kg', 142, 160],
  ],
  noodles: [
    ["Ching's Secret", 150, 'g', 45, 52],
    ["Ching's Secret", 600, 'g', 165, 185],
  ],
  pasta: [
    ['Del Monte Penne', 500, 'g', 132, 155],
    ['Borges Fusilli', 500, 'g', 189, 210],
  ],

  // ── Pulses ────────────────────────────────────────────────
  'urad-dal': [
    ['Tata Sampann', 500, 'g', 96, 110],
    ['Tata Sampann', 1, 'kg', 178, 199],
    ['24 Mantra Organic', 500, 'g', 128, 145],
  ],
  'toor-dal': [
    ['Tata Sampann', 500, 'g', 105, 118],
    ['Tata Sampann', 1, 'kg', 198, 225],
  ],
  'chana-dal': [
    ['Tata Sampann', 500, 'g', 68, 78],
    ['Fortune', 1, 'kg', 128, 145],
  ],
  'moong-dal': [
    ['Tata Sampann', 500, 'g', 88, 99],
    ['24 Mantra Organic', 500, 'g', 118, 132],
  ],
  chickpeas: [
    ['Tata Sampann Kabuli', 500, 'g', 92, 105],
    ['Fortune', 1, 'kg', 168, 190],
  ],
  'rajma-beans': [
    ['Tata Sampann Chitra', 500, 'g', 118, 132],
    ['24 Mantra Organic', 500, 'g', 148, 168],
  ],

  // ── Vegetables & produce ──────────────────────────────────
  potato: [
    ['Fresho', 500, 'g', 22, 26],
    ['Fresho', 1, 'kg', 38, 45],
    ['Fresho', 2, 'kg', 72, 85],
  ],
  onion: [
    ['Fresho', 500, 'g', 24, 28],
    ['Fresho', 1, 'kg', 44, 52],
    ['Fresho', 2, 'kg', 82, 98],
  ],
  tomato: [
    ['Fresho', 500, 'g', 28, 34],
    ['Fresho', 1, 'kg', 52, 62],
  ],
  'green-chilli': [
    ['Fresho', 100, 'g', 14, 18],
    ['Fresho', 250, 'g', 30, 36],
  ],
  ginger: [
    ['Fresho', 100, 'g', 18, 22],
    ['Fresho', 250, 'g', 42, 50],
  ],
  garlic: [
    ['Fresho', 100, 'g', 24, 28],
    ['Fresho', 250, 'g', 55, 65],
  ],
  cauliflower: [['Fresho', 1, 'piece', 42, 50]],
  peas: [
    ['Fresho Green Peas', 500, 'g', 68, 78],
    ['Safal Frozen', 500, 'g', 92, 105],
  ],
  carrot: [
    ['Fresho', 500, 'g', 38, 45],
    ['Fresho', 1, 'kg', 70, 82],
  ],
  capsicum: [['Fresho', 1, 'piece', 18, 22]],
  cabbage: [['Fresho', 500, 'g', 26, 32]],
  brinjal: [['Fresho', 500, 'g', 34, 40]],
  spinach: [['Fresho', 1, 'bunch', 22, 28]],
  beans: [['Fresho', 250, 'g', 32, 38]],
  lemon: [
    ['Fresho', 4, 'piece', 24, 30],
    ['Fresho', 1, 'piece', 8, 10],
  ],
  coconut: [['Fresho', 1, 'piece', 55, 65]],

  // ── Herbs ─────────────────────────────────────────────────
  'curry-leaves': [['Fresho', 1, 'bunch', 12, 15]],
  'coriander-leaves': [['Fresho', 1, 'bunch', 15, 18]],
  'mint-leaves': [['Fresho', 1, 'bunch', 15, 18]],
  basil: [['Fresho', 1, 'bunch', 45, 55, 'low-stock']],

  // ── Dairy ─────────────────────────────────────────────────
  paneer: [
    ['Amul Fresh', 200, 'g', 95, 105],
    ['Mother Dairy', 200, 'g', 89, 99],
    ['Amul Fresh', 500, 'g', 225, 250],
  ],
  milk: [
    ['Amul Taaza', 500, 'ml', 29, 32],
    ['Amul Gold', 1, 'l', 72, 78],
  ],
  curd: [
    ['Amul Masti', 400, 'g', 45, 52],
    ['Mother Dairy', 1, 'kg', 92, 105],
  ],
  butter: [
    ['Amul', 100, 'g', 58, 64],
    ['Amul', 500, 'g', 275, 295],
  ],
  ghee: [
    ['Amul', 500, 'g', 345, 380],
    ['Gowardhan', 1, 'kg', 665, 720],
  ],
  cream: [
    ['Amul Fresh Cream', 250, 'ml', 78, 88],
    ['Nestlé Milkmaid', 200, 'ml', 92, 102],
  ],
  cheese: [
    ['Amul Mozzarella', 200, 'g', 132, 148],
    ['Go Mozzarella', 500, 'g', 315, 345],
  ],
  khoya: [['Milkfood', 200, 'g', 118, 132, 'low-stock']],

  // ── Meat, seafood & eggs ──────────────────────────────────
  chicken: [
    ['Licious Curry Cut', 500, 'g', 245, 275],
    ['Licious Curry Cut', 1, 'kg', 465, 520],
    ['Fresho Boneless', 500, 'g', 285, 320],
  ],
  mutton: [
    ['Licious Curry Cut', 500, 'g', 445, 495],
    ['Licious Curry Cut', 1, 'kg', 869, 950],
  ],
  fish: [
    ['Licious Rohu', 500, 'g', 285, 320],
    ['Licious Basa', 500, 'g', 325, 360],
  ],
  prawns: [['Licious Medium', 250, 'g', 285, 320, 'low-stock']],
  egg: [
    ['Fresho Farm Eggs', 6, 'piece', 48, 55],
    ['Fresho Farm Eggs', 12, 'piece', 89, 99],
  ],

  // ── Spices ────────────────────────────────────────────────
  salt: [
    ['Tata Salt', 1, 'kg', 28, 32],
    ['Tata Sampann Rock Salt', 500, 'g', 42, 48],
  ],
  turmeric: [
    ['Everest', 100, 'g', 42, 48],
    ['Tata Sampann', 200, 'g', 78, 88],
  ],
  'chilli-powder': [
    ['Everest Tikhalal', 100, 'g', 62, 70],
    ['MDH Deggi Mirch', 100, 'g', 78, 88],
  ],
  'coriander-powder': [
    ['Everest', 100, 'g', 45, 52],
    ['Tata Sampann', 200, 'g', 82, 92],
  ],
  'cumin-seeds': [
    ['Everest', 100, 'g', 68, 78],
    ['Tata Sampann', 200, 'g', 128, 145],
  ],
  'mustard-seeds': [['Everest', 100, 'g', 38, 45]],
  'garam-masala': [
    ['Everest', 100, 'g', 88, 98],
    ['MDH', 100, 'g', 82, 92],
  ],
  asafoetida: [['LG Hing', 50, 'g', 92, 105]],
  'bay-leaf': [['Everest Tej Patta', 50, 'g', 32, 38]],
  cardamom: [['Everest Elaichi', 50, 'g', 245, 275]],
  cinnamon: [['Everest Dalchini', 50, 'g', 68, 78]],
  cloves: [['Everest Laung', 50, 'g', 118, 132]],
  'dry-red-chilli': [['Fresho', 100, 'g', 48, 55]],
  'pav-bhaji-masala': [['Everest', 100, 'g', 78, 88]],
  'chaat-masala': [['Everest', 100, 'g', 62, 70]],
  'tea-leaves': [
    ['Tata Tea Gold', 250, 'g', 155, 175],
    ['Red Label', 500, 'g', 285, 315],
  ],
  saffron: [['Baby Brand Kesar', 1, 'g', 245, 275, 'low-stock']],
  'fenugreek-seeds': [['Everest Methi Dana', 100, 'g', 42, 48]],

  // ── Oils, condiments & sweeteners ─────────────────────────
  oil: [
    ['Fortune Sunlite', 1, 'l', 142, 160],
    ['Saffola Gold', 1, 'l', 185, 205],
    ['Fortune Sunlite', 5, 'l', 685, 760],
  ],
  'olive-oil': [['Borges Extra Virgin', 500, 'ml', 545, 610]],
  'soy-sauce': [["Ching's Secret", 200, 'ml', 62, 70]],
  vinegar: [['Kissan', 200, 'ml', 42, 48]],
  'tomato-ketchup': [['Kissan', 500, 'g', 112, 125]],
  tamarind: [['Fresho Seedless', 200, 'g', 72, 82]],
  sugar: [
    ['Madhur', 1, 'kg', 52, 58],
    ['Madhur', 5, 'kg', 248, 275],
  ],
  jaggery: [['24 Mantra Organic', 500, 'g', 82, 92]],
  cashews: [
    ['Happilo W320', 200, 'g', 245, 275],
    ['Nutraj', 500, 'g', 565, 620],
  ],
  almonds: [['Happilo California', 200, 'g', 218, 245]],
  pav: [
    ['Modern Pav', 6, 'piece', 32, 38],
    ['Harvest Gold', 12, 'piece', 58, 66],
  ],
  bread: [['Britannia Brown', 12, 'piece', 55, 62]],
}

function packLabel(size: number, unit: Unit): string {
  if (unit === 'piece') return `${size} pc`
  return `${size} ${unit}`
}

function buildCatalogue(): Product[] {
  const products: Product[] = []

  for (const [ingredientId, skus] of Object.entries(CATALOGUE)) {
    const ingredient = getIngredient(ingredientId)
    if (!ingredient) continue

    skus.forEach(([brand, size, unit, price, mrp, availability], i) => {
      products.push({
        id: `${ingredientId}-${i}`,
        ingredientId,
        name: ingredient.name,
        brand,
        packSize: size,
        packUnit: unit,
        packLabel: packLabel(size, unit),
        price,
        mrp,
        image: '',
        availability: availability ?? 'in-stock',
        vendorRef: { vendor: 'instamart', productId: `IM-${ingredientId.toUpperCase()}-${i}` },
      })
    })
  }

  return products
}

export const PRODUCTS: Product[] = buildCatalogue()

const BY_INGREDIENT = PRODUCTS.reduce<Record<string, Product[]>>((acc, p) => {
  ;(acc[p.ingredientId] ??= []).push(p)
  return acc
}, {})

export function productsForIngredient(ingredientId: string): Product[] {
  return BY_INGREDIENT[ingredientId] ?? []
}
