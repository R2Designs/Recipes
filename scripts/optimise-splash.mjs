/**
 * Compress the splash-screen cut-outs.
 *
 * The originals are print-resolution PNGs (one is 4096² / 14 MB). They render
 * as decorative corner elements a few hundred pixels wide, and they're on the
 * very first frame the user sees — so they need to be small enough to arrive
 * before the animation starts.
 *
 * WebP with alpha gets us ~95% off with no visible loss at display size.
 *
 *   node scripts/optimise-splash.mjs
 */
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(here, '../src/assets/splash')

// Rendered at ~340–520px CSS width; 2× covers retina with room to spare.
const TARGET_WIDTH = 900

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png'))

for (const file of files) {
  const from = path.join(SRC, file)
  const to = from.replace(/\.png$/, '.webp')

  const before = (await stat(from)).size

  await sharp(from)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(to)

  const after = (await stat(to)).size
  const saved = Math.round((1 - after / before) * 100)

  console.log(
    `${file.padEnd(16)} ${(before / 1024 / 1024).toFixed(2)} MB → ` +
      `${(after / 1024).toFixed(0)} KB  (−${saved}%)`,
  )
}

console.log('\nDone. Delete the .png sources once the .webp files are wired up.')
