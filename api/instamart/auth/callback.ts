import { notImplemented } from '../../_lib/notImplemented.js'

/**
 * Phase 2: receives Swiggy's `code`, exchanges it server-side for an access
 * token (POST /auth/token), and stores the token in a server-side session —
 * never in browser JS or a `VITE_`-prefixed env var. The browser only ever
 * holds an opaque session id (e.g. an httpOnly cookie).
 */
export default function handler(): Response {
  return notImplemented('completing Instamart sign-in')
}
