/**
 * Prepare chef photography for the featured-chef pages.
 *
 * Two outputs per source, because the two uses have opposite needs:
 *
 * - `*-hero.webp` feeds the scroll cinematic, which scales the image up to
 *   ~1.9×. A 1600px source rendered full-bleed is already ~1:1 with a retina
 *   viewport, so zooming it would visibly pixelate. Lanczos-upscaling the
 *   source to 3200px buys back that headroom: the zoom never asks the browser
 *   to invent pixels, it just spends the ones we pre-computed. Upscaling adds
 *   no real detail, but soft is fine and blocky is not — and the focus-pull
 *   blur that ramps in near max zoom hides the softness anyway.
 *
 * - `*-portrait.webp` is a 3:4 crop for the carousel card, where the whole
 *   point is the chef's face, not the room around them.
 *
 *   node scripts/prepare-chef-images.mjs
 */
import sharp from 'sharp'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(here, '../src/assets/chefs')

/** Headroom for the scroll zoom (see above). */
const HERO_WIDTH = 3200
/** Card is ~340px wide; 2.5× covers retina. */
const PORTRAIT_WIDTH = 900

const SOURCES = [
  {
    from: '/Users/raj/Downloads/recipes/rb.webp',
    slug: 'ranveer-brar',
    /**
     * Where the subject sits in the frame, as fractions of the source. Used to
     * pull the 3:4 portrait crop — `sharp`'s attention/entropy strategies pick
     * the busiest region, which on a styled kitchen set is the shelving behind
     * the chef rather than the chef.
     */
    focus: { x: 0.52, y: 0.42 },
  },
]

await mkdir(OUT, { recursive: true })

for (const { from, slug, focus } of SOURCES) {
  const meta = await sharp(from).metadata()
  const before = (await stat(from)).size

  // ── Hero ────────────────────────────────────────────────────
  const heroPath = path.join(OUT, `${slug}-hero.webp`)
  await sharp(from)
    .resize({ width: HERO_WIDTH, kernel: 'lanczos3' })
    .webp({ quality: 84, effort: 6 })
    .toFile(heroPath)

  // ── Portrait (3:4, centred on the subject) ──────────────────
  const cropH = meta.height
  const cropW = Math.round((cropH * 3) / 4)
  const left = Math.max(0, Math.min(meta.width - cropW, Math.round(meta.width * focus.x - cropW / 2)))

  const portraitPath = path.join(OUT, `${slug}-portrait.webp`)
  await sharp(from)
    .extract({ left, top: 0, width: cropW, height: cropH })
    .resize({ width: PORTRAIT_WIDTH, kernel: 'lanczos3' })
    .webp({ quality: 84, effort: 6 })
    .toFile(portraitPath)

  const heroSize = (await stat(heroPath)).size
  const portraitSize = (await stat(portraitPath)).size

  console.log(
    `${slug}\n` +
      `  source    ${meta.width}×${meta.height}  ${(before / 1024).toFixed(0)} KB\n` +
      `  hero      ${HERO_WIDTH}px wide        ${(heroSize / 1024).toFixed(0)} KB\n` +
      `  portrait  ${PORTRAIT_WIDTH}×${Math.round((PORTRAIT_WIDTH * 4) / 3)}       ${(portraitSize / 1024).toFixed(0)} KB`,
  )
}
