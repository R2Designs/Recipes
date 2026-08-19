import type { Ingredient } from '@/types/ingredient'

/**
 * Master ingredient catalogue. Recipes reference these by id, so "urad dal"
 * means the same thing — and matches the same SKUs — everywhere it appears.
 *
 * `pantryStaple: true` pre-ticks "I already have this" on the procurement
 * screen. Nobody wants a 200g bag of salt added to their order.
 */
export const INGREDIENTS: Ingredient[] = [
  // ── Grains & flours ───────────────────────────────────────
  { id: 'rice', name: 'Rice', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false, substitutes: ['basmati-rice'] },
  { id: 'basmati-rice', name: 'Basmati rice', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false, substitutes: ['rice'] },
  { id: 'poha', name: 'Poha', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'semolina', name: 'Semolina (rava)', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'atta', name: 'Whole wheat flour', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: true },
  { id: 'maida', name: 'All-purpose flour', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'besan', name: 'Gram flour (besan)', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'noodles', name: 'Hakka noodles', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'pasta', name: 'Pasta', category: 'grains', defaultUnit: 'g', discrete: false, pantryStaple: false },

  // ── Pulses ────────────────────────────────────────────────
  { id: 'urad-dal', name: 'Urad dal', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'toor-dal', name: 'Toor dal', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'chana-dal', name: 'Chana dal', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'moong-dal', name: 'Moong dal', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'chickpeas', name: 'Chickpeas (kabuli chana)', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'rajma-beans', name: 'Rajma (kidney beans)', category: 'pulses', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'fenugreek-seeds', name: 'Fenugreek seeds (methi)', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },

  // ── Vegetables ────────────────────────────────────────────
  { id: 'potato', name: 'Potatoes', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'onion', name: 'Onions', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'tomato', name: 'Tomatoes', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'green-chilli', name: 'Green chillies', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'ginger', name: 'Ginger', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'garlic', name: 'Garlic', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetables', defaultUnit: 'piece', discrete: true, halvable: true, pantryStaple: false },
  { id: 'peas', name: 'Green peas', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'carrot', name: 'Carrots', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'capsicum', name: 'Capsicum', category: 'vegetables', defaultUnit: 'piece', discrete: true, halvable: true, pantryStaple: false },
  { id: 'cabbage', name: 'Cabbage', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'brinjal', name: 'Brinjal (aubergine)', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'spinach', name: 'Spinach', category: 'vegetables', defaultUnit: 'bunch', discrete: true, pantryStaple: false },
  { id: 'beans', name: 'French beans', category: 'vegetables', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'lemon', name: 'Lemons', category: 'fruits', defaultUnit: 'piece', discrete: true, halvable: true, pantryStaple: false },
  { id: 'coconut', name: 'Fresh coconut', category: 'fruits', defaultUnit: 'piece', discrete: true, halvable: true, pantryStaple: false },

  // ── Herbs ─────────────────────────────────────────────────
  { id: 'curry-leaves', name: 'Curry leaves', category: 'herbs', defaultUnit: 'bunch', discrete: true, pantryStaple: false },
  { id: 'coriander-leaves', name: 'Coriander leaves', category: 'herbs', defaultUnit: 'bunch', discrete: true, pantryStaple: false },
  { id: 'mint-leaves', name: 'Mint leaves', category: 'herbs', defaultUnit: 'bunch', discrete: true, pantryStaple: false },
  { id: 'basil', name: 'Basil', category: 'herbs', defaultUnit: 'bunch', discrete: true, pantryStaple: false },

  // ── Dairy ─────────────────────────────────────────────────
  { id: 'paneer', name: 'Paneer', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'milk', name: 'Milk', category: 'dairy', defaultUnit: 'ml', discrete: false, pantryStaple: true },
  { id: 'curd', name: 'Curd (yoghurt)', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'butter', name: 'Butter', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: true },
  { id: 'ghee', name: 'Ghee', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: true },
  { id: 'cream', name: 'Fresh cream', category: 'dairy', defaultUnit: 'ml', discrete: false, pantryStaple: false },
  { id: 'cheese', name: 'Mozzarella', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'khoya', name: 'Khoya', category: 'dairy', defaultUnit: 'g', discrete: false, pantryStaple: false },

  // ── Meat & seafood ────────────────────────────────────────
  { id: 'chicken', name: 'Chicken', category: 'meat', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'mutton', name: 'Mutton', category: 'meat', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'fish', name: 'Fish fillets', category: 'seafood', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'prawns', name: 'Prawns', category: 'seafood', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'egg', name: 'Eggs', category: 'dairy', defaultUnit: 'piece', discrete: true, pantryStaple: false },

  // ── Spices ────────────────────────────────────────────────
  { id: 'salt', name: 'Salt', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'turmeric', name: 'Turmeric powder', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'chilli-powder', name: 'Red chilli powder', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'coriander-powder', name: 'Coriander powder', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'cumin-seeds', name: 'Cumin seeds', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'mustard-seeds', name: 'Mustard seeds', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'garam-masala', name: 'Garam masala', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'asafoetida', name: 'Asafoetida (hing)', category: 'spices', defaultUnit: 'pinch', discrete: false, pantryStaple: true },
  { id: 'bay-leaf', name: 'Bay leaves', category: 'spices', defaultUnit: 'piece', discrete: true, pantryStaple: true },
  { id: 'cardamom', name: 'Green cardamom', category: 'spices', defaultUnit: 'piece', discrete: true, pantryStaple: true },
  { id: 'cinnamon', name: 'Cinnamon stick', category: 'spices', defaultUnit: 'piece', discrete: true, pantryStaple: true },
  { id: 'cloves', name: 'Cloves', category: 'spices', defaultUnit: 'piece', discrete: true, pantryStaple: true },
  { id: 'dry-red-chilli', name: 'Dry red chillies', category: 'spices', defaultUnit: 'piece', discrete: true, pantryStaple: true },
  { id: 'pav-bhaji-masala', name: 'Pav bhaji masala', category: 'spices', defaultUnit: 'tbsp', discrete: false, pantryStaple: false },
  { id: 'chaat-masala', name: 'Chaat masala', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'tea-leaves', name: 'Tea leaves', category: 'spices', defaultUnit: 'tsp', discrete: false, pantryStaple: true },
  { id: 'saffron', name: 'Saffron', category: 'spices', defaultUnit: 'pinch', discrete: false, pantryStaple: false },

  // ── Oils & condiments ─────────────────────────────────────
  { id: 'oil', name: 'Cooking oil', category: 'oils', defaultUnit: 'ml', discrete: false, pantryStaple: true },
  { id: 'olive-oil', name: 'Olive oil', category: 'oils', defaultUnit: 'ml', discrete: false, pantryStaple: false },
  { id: 'soy-sauce', name: 'Soy sauce', category: 'condiments', defaultUnit: 'tbsp', discrete: false, pantryStaple: false },
  { id: 'vinegar', name: 'Vinegar', category: 'condiments', defaultUnit: 'tbsp', discrete: false, pantryStaple: true },
  { id: 'tomato-ketchup', name: 'Tomato ketchup', category: 'condiments', defaultUnit: 'tbsp', discrete: false, pantryStaple: true },
  { id: 'tamarind', name: 'Tamarind', category: 'condiments', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'sugar', name: 'Sugar', category: 'sweeteners', defaultUnit: 'g', discrete: false, pantryStaple: true },
  { id: 'jaggery', name: 'Jaggery', category: 'sweeteners', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'cashews', name: 'Cashews', category: 'nuts', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'almonds', name: 'Almonds', category: 'nuts', defaultUnit: 'g', discrete: false, pantryStaple: false },
  { id: 'pav', name: 'Pav buns', category: 'bakery', defaultUnit: 'piece', discrete: true, pantryStaple: false },
  { id: 'bread', name: 'Bread', category: 'bakery', defaultUnit: 'piece', discrete: true, pantryStaple: false },
]

const BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

export function getIngredient(id: string): Ingredient | undefined {
  return BY_ID.get(id)
}
