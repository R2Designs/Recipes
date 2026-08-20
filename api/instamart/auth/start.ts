import { notImplemented } from '../../_lib/notImplemented.js'

/**
 * Phase 2: builds the PKCE code_verifier/code_challenge pair, stashes the
 * verifier server-side against a short-lived state token, and redirects the
 * browser to `mcp.swiggy.com/auth/authorize`. Needs SWIGGY_CLIENT_ID, which
 * doesn't exist yet — see the integration plan.
 */
export default function handler(): Response {
  return notImplemented('starting Instamart sign-in')
}
