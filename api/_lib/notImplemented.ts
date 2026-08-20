/**
 * Every Instamart route returns this until Phase 2+ fills it in with real
 * Swiggy calls — no Swiggy client ID exists yet (see the integration plan),
 * so there is nothing genuine any of these routes could do. Mirrors
 * `NotImplementedError` in `src/services/swiggyMcpClient.ts`: fail loudly
 * and specifically rather than return plausible-looking fake data.
 */
export function notImplemented(capability: string): Response {
  return Response.json(
    { error: 'not_implemented', message: `Swiggy Instamart MCP not connected — ${capability} is unavailable.` },
    { status: 501 },
  )
}
