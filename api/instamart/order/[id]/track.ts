import { notImplemented } from '../../../_lib/notImplemented.js'

/**
 * Phase 6: real tracking, if Swiggy's MCP actually exposes it — not assumed.
 * If it doesn't, this stays a 404/null rather than inventing a deep link;
 * `src/services/swiggyMcpClient.ts`'s `getTrackingUrl` already returns
 * `null` in that case and the UI already disables the track button for it.
 */
export default function handler(req: Request): Response {
  const id = new URL(req.url).pathname.split('/').at(-2)
  return notImplemented(`tracking order ${id}`)
}
