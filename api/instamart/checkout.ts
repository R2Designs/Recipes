import { notImplemented } from '../_lib/notImplemented.js'

/**
 * Phase 5: places the real order. POST only, called from exactly one place
 * in the UI — the user pressing "Confirm order" — never as a side effect of
 * navigation, cart edits, or the Instamart hand-off. The most guarded route
 * in this integration; it is the one genuinely irreversible action.
 */
export default function handler(req: Request): Response {
  if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405 })
  return notImplemented('placing the order')
}
