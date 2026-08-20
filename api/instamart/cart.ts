import { notImplemented } from '../_lib/notImplemented.js'

/**
 * Phase 4: POST creates/updates the real vendor-side cart from our
 * `CartLine[]` (SKU + qty pairs, resolved via `vendorRef.productId`); GET
 * reads it back so the UI can show Instamart's real pricing/availability
 * instead of the local `priceCart` estimate. Local cart stays the review
 * state; the vendor cart becomes the source of truth for what's actually
 * buyable, at what price, right now.
 */
export default function handler(req: Request): Response {
  if (req.method === 'GET') return notImplemented('reading the Instamart cart')
  if (req.method === 'POST') return notImplemented('syncing the Instamart cart')
  return Response.json({ error: 'method_not_allowed' }, { status: 405 })
}
