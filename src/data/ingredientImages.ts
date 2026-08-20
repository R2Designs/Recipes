/**
 * Curated Unsplash photo per ingredient, keyed by ingredient id (see
 * src/data/ingredients.ts). Follows the same hotlinked-CDN pattern as
 * src/data/images.ts / recipes.ts: one representative photo per ingredient,
 * reused across every product SKU of that ingredient regardless of brand.
 *
 * Every URL was checked against a live Unsplash search (matched on the
 * photo's alt/description text) and verified to return HTTP 200 with an
 * image content-type before being added here. A handful of entries are
 * closest-available approximations rather than exact matches — see the
 * delivery notes for the list.
 */
export const INGREDIENT_IMAGES: Record<string, string> = {
  // ── Grains & flours ───────────────────────────────────────
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop',
  'basmati-rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80&auto=format&fit=crop',
  poha: 'https://images.unsplash.com/photo-1782227026828-777a6559e907?w=800&q=80&auto=format&fit=crop',
  semolina: 'https://images.unsplash.com/photo-1638405803231-40312cd276b6?w=800&q=80&auto=format&fit=crop',
  atta: 'https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?w=800&q=80&auto=format&fit=crop',
  maida: 'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=800&q=80&auto=format&fit=crop',
  besan: 'https://images.unsplash.com/photo-1595414902678-862fe51c9f27?w=800&q=80&auto=format&fit=crop',
  noodles: 'https://images.unsplash.com/photo-1664337873053-840ea51d271d?w=800&q=80&auto=format&fit=crop',
  pasta: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&q=80&auto=format&fit=crop',

  // ── Pulses ────────────────────────────────────────────────
  'urad-dal': 'https://images.unsplash.com/photo-1542308744-011fa9a309f7?w=800&q=80&auto=format&fit=crop',
  'toor-dal': 'https://images.unsplash.com/photo-1630409349416-24884761a307?w=800&q=80&auto=format&fit=crop',
  'chana-dal': 'https://images.unsplash.com/photo-1780478238047-13e4e6c07cba?w=800&q=80&auto=format&fit=crop',
  'moong-dal': 'https://images.unsplash.com/photo-1702041357314-db5826c96f04?w=800&q=80&auto=format&fit=crop',
  chickpeas: 'https://images.unsplash.com/photo-1644432757699-bb5a01e8fb0e?w=800&q=80&auto=format&fit=crop',
  'rajma-beans': 'https://images.unsplash.com/photo-1763368397625-32c8f75fed44?w=800&q=80&auto=format&fit=crop',
  'fenugreek-seeds': 'https://images.unsplash.com/photo-1528613526328-8c19bd037322?w=800&q=80&auto=format&fit=crop',

  // ── Vegetables ────────────────────────────────────────────
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80&auto=format&fit=crop',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80&auto=format&fit=crop',
  tomato: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&q=80&auto=format&fit=crop',
  'green-chilli': 'https://images.unsplash.com/photo-1599987141071-f5810d32e21a?w=800&q=80&auto=format&fit=crop',
  ginger: 'https://images.unsplash.com/photo-1635843104103-ddd88e1c5141?w=800&q=80&auto=format&fit=crop',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&q=80&auto=format&fit=crop',
  cauliflower: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?w=800&q=80&auto=format&fit=crop',
  peas: 'https://images.unsplash.com/photo-1690023614293-ac2ba2eb0731?w=800&q=80&auto=format&fit=crop',
  carrot: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=800&q=80&auto=format&fit=crop',
  capsicum: 'https://images.unsplash.com/photo-1592548868664-f8b4e4b1cfb7?w=800&q=80&auto=format&fit=crop',
  cabbage: 'https://images.unsplash.com/photo-1693500387488-e2ca0aa70019?w=800&q=80&auto=format&fit=crop',
  brinjal: 'https://images.unsplash.com/photo-1683543122945-513029986574?w=800&q=80&auto=format&fit=crop',
  spinach: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=800&q=80&auto=format&fit=crop',
  beans: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=800&q=80&auto=format&fit=crop',
  lemon: 'https://images.unsplash.com/photo-1582287104445-6754664dbdb2?w=800&q=80&auto=format&fit=crop',
  coconut: 'https://images.unsplash.com/photo-1560769680-ba2f3767c785?w=800&q=80&auto=format&fit=crop',

  // ── Herbs ─────────────────────────────────────────────────
  'curry-leaves': 'https://images.unsplash.com/photo-1662097735076-1eeb3aafa3ab?w=800&q=80&auto=format&fit=crop',
  'coriander-leaves': 'https://images.unsplash.com/photo-1776089770931-e422e57f760c?w=800&q=80&auto=format&fit=crop',
  'mint-leaves': 'https://images.unsplash.com/photo-1618130070080-91f4d55a2383?w=800&q=80&auto=format&fit=crop',
  basil: 'https://images.unsplash.com/photo-1527964105263-1ac6265a569f?w=800&q=80&auto=format&fit=crop',

  // ── Dairy ─────────────────────────────────────────────────
  paneer: 'https://images.unsplash.com/photo-1781332146569-9c5093bc2ca5?w=800&q=80&auto=format&fit=crop',
  milk: 'https://images.unsplash.com/photo-1517448931760-9bf4414148c5?w=800&q=80&auto=format&fit=crop',
  curd: 'https://images.unsplash.com/photo-1621659758940-360efaa1d9fa?w=800&q=80&auto=format&fit=crop',
  butter: 'https://images.unsplash.com/photo-1603596310923-dbb12732f9c7?w=800&q=80&auto=format&fit=crop',
  ghee: 'https://images.unsplash.com/photo-1785502108797-a4ca87a0bc94?w=800&q=80&auto=format&fit=crop',
  cream: 'https://images.unsplash.com/photo-1633893215271-f7e1fca081ad?w=800&q=80&auto=format&fit=crop',
  cheese: 'https://images.unsplash.com/photo-1707730583937-1add20f8287e?w=800&q=80&auto=format&fit=crop',
  khoya: 'https://images.unsplash.com/photo-1704650312191-005ab02786f5?w=800&q=80&auto=format&fit=crop',

  // ── Meat & seafood ────────────────────────────────────────
  chicken: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80&auto=format&fit=crop',
  mutton: 'https://images.unsplash.com/photo-1628543108325-1c27cd7246b3?w=800&q=80&auto=format&fit=crop',
  fish: 'https://images.unsplash.com/photo-1633244092661-4519a1ffc67e?w=800&q=80&auto=format&fit=crop',
  prawns: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80&auto=format&fit=crop',
  egg: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80&auto=format&fit=crop',

  // ── Spices ────────────────────────────────────────────────
  salt: 'https://images.unsplash.com/photo-1559477882-f1a7c5931735?w=800&q=80&auto=format&fit=crop',
  turmeric: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80&auto=format&fit=crop',
  'chilli-powder': 'https://images.unsplash.com/photo-1547332226-395d746d139a?w=800&q=80&auto=format&fit=crop',
  'coriander-powder': 'https://images.unsplash.com/photo-1603122612817-2fe0e0631a93?w=800&q=80&auto=format&fit=crop',
  'cumin-seeds': 'https://images.unsplash.com/photo-1587493053604-f943541023aa?w=800&q=80&auto=format&fit=crop',
  'mustard-seeds': 'https://images.unsplash.com/photo-1701188542949-210beb8e382c?w=800&q=80&auto=format&fit=crop',
  'garam-masala': 'https://images.unsplash.com/photo-1682490301133-db17d61a5324?w=800&q=80&auto=format&fit=crop',
  asafoetida: 'https://images.unsplash.com/photo-1543376798-62217a8d85cc?w=800&q=80&auto=format&fit=crop',
  'bay-leaf': 'https://images.unsplash.com/photo-1498612753354-772a30629934?w=800&q=80&auto=format&fit=crop',
  cardamom: 'https://images.unsplash.com/photo-1758657996330-095d08451cd9?w=800&q=80&auto=format&fit=crop',
  cinnamon: 'https://images.unsplash.com/photo-1601379760622-0d2e7ad24c11?w=800&q=80&auto=format&fit=crop',
  cloves: 'https://images.unsplash.com/photo-1701191310584-3f319e0e6c59?w=800&q=80&auto=format&fit=crop',
  'dry-red-chilli': 'https://images.unsplash.com/photo-1609158793803-7060643f9168?w=800&q=80&auto=format&fit=crop',
  'pav-bhaji-masala': 'https://images.unsplash.com/photo-1771541897176-44a3e01dc484?w=800&q=80&auto=format&fit=crop',
  'chaat-masala': 'https://images.unsplash.com/photo-1622042914579-f5d10cf8ea4d?w=800&q=80&auto=format&fit=crop',
  'tea-leaves': 'https://images.unsplash.com/photo-1672846785798-a8e82326abab?w=800&q=80&auto=format&fit=crop',
  saffron: 'https://images.unsplash.com/photo-1643471672168-f4a4b6cfa440?w=800&q=80&auto=format&fit=crop',

  // ── Oils & condiments ─────────────────────────────────────
  oil: 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?w=800&q=80&auto=format&fit=crop',
  'olive-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80&auto=format&fit=crop',
  'soy-sauce': 'https://images.unsplash.com/photo-1711915528610-8699564923e8?w=800&q=80&auto=format&fit=crop',
  vinegar: 'https://images.unsplash.com/photo-1566557087503-b839ce6e5aa0?w=800&q=80&auto=format&fit=crop',
  'tomato-ketchup': 'https://images.unsplash.com/photo-1624462048568-72794ee6d6f8?w=800&q=80&auto=format&fit=crop',
  tamarind: 'https://images.unsplash.com/photo-1771229389277-a0a7546913f9?w=800&q=80&auto=format&fit=crop',
  sugar: 'https://images.unsplash.com/photo-1673791031093-eb8eefa60083?w=800&q=80&auto=format&fit=crop',
  jaggery: 'https://images.unsplash.com/photo-1633299258059-66b1111f4ea3?w=800&q=80&auto=format&fit=crop',
  cashews: 'https://images.unsplash.com/photo-1726771517475-e7acdd34cd8a?w=800&q=80&auto=format&fit=crop',
  almonds: 'https://images.unsplash.com/photo-1631815333332-e3ffb24e2bf8?w=800&q=80&auto=format&fit=crop',
  pav: 'https://images.unsplash.com/photo-1588861472194-6883d8b5e552?w=800&q=80&auto=format&fit=crop',
  bread: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=800&q=80&auto=format&fit=crop',
}
