import { notImplemented } from '../_lib/notImplemented.js'

/**
 * Phase 3: proxies Swiggy MCP's product search (`search_groceries` or
 * equivalent — confirm exact tool name against Swiggy's docs when this
 * phase starts, not assumed here). Replaces the local mock catalogue in
 * `src/services/ingredientMatcher.ts` behind the same `findProducts` /
 * `findBestProduct` / `matchAll` signatures — callers don't change.
 */
export default function handler(): Response {
  return notImplemented('searching Instamart products')
}
