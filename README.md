# Recipes

A discovery-first Indian recipe app that bridges "what should I cook" with
"what do I need to buy" — browse dishes, pick a version and serving size,
review a real shopping list, and hand it off to Instamart.

This is a **design prototype on mock data**. No real orders — see
[Architecture](#architecture) for how the real Instamart integration is
being built in without touching the UI, and
[Deployment](#deployment--backend) for where that stands.

## Running it

```bash
npm install
npm run dev      # frontend only — http://localhost:5173
```

```bash
npm run build     # type-checks (frontend + /api), then builds to dist/
npm run preview   # serve the production build locally
```

The `/api/instamart/*` routes only run under Vercel's dev server, not
plain `npm run dev`:

```bash
npx vercel dev    # serves the frontend AND /api together, one port
                   # (first run needs `vercel login` + linking the project)
```

Verify the serving-size scaling algorithm against the reference quantities:

```bash
npx tsx scripts/check-scaling.ts
```

## The flow

Home → search or browse → recipe detail → choose a version → set servings →
optionally follow a creator → **Everything you need** (the procurement
screen — the core of the product) → tick off what you already have, remove
what you don't want, swap products → basket review → **Add everything to
Instamart** (mock) → **Confirm order** (mock, explicit) → order success.

Nothing is ever added to a cart or ordered without an explicit tap. A
"Demo mode" banner appears on every commerce screen as a standing reminder.

## Architecture

```
Frontend → Application services → Recipe / Scaling / Ingredient-matching → swiggyMcpClient → /api/instamart/* → Swiggy MCP → Instamart
```

- `src/types/` — Recipe, Ingredient, Product, Cart, Order. No vendor concepts
  leak in here; `Product.vendorRef` is the one deliberate exception.
- `src/lib/scaling.ts` — pure, local serving-size scaling with per-unit
  rounding rules (grams round differently from teaspoons; discrete items
  like eggs never go fractional). No network involved — this part of the
  product works with zero backend.
- `src/services/` — `recipeService`, `scalingService`, `ingredientMatcher`,
  `cartService`, `checkoutService` are all async today (simulated latency)
  so swapping the mock body for a real call is a contained, one-file
  change.
- `src/services/swiggyMcpClient.ts` — the **only** frontend file that knows
  Swiggy exists. It calls `/api/instamart/*` for real; nothing else imports
  it directly, and `cartService`/`checkoutService` route around it entirely
  behind a `USE_MOCK` flag (`IS_CONNECTED`, gated on
  `VITE_INSTAMART_ENABLED`) until that flag is deliberately turned on.
- `api/instamart/` — the actual backend: server-side routes for OAuth,
  address lookup, product search, cart sync, checkout, and order tracking.
  Runs on Vercel, not in the browser — Instamart credentials and session
  tokens are handled here and never reach frontend code. Every route is
  currently a typed `501` stub; see [Deployment](#deployment--backend).
- `src/store/` — Zustand, persisted: cart survives a refresh mid-flow,
  filters stay in the URL for shareable search results.
- `src/data/` — 24 recipes (Masala Dosa is the fully-fleshed flagship: 7
  variants, 5 creators), ~60 master ingredients, ~140 mock product SKUs,
  curated food photography (hotlinked Unsplash CDN URLs, not downloaded).

## Design system

Near-black paper, a jade-green accent, Plus Jakarta Sans for UI text and a
licensed display serif (PP Editorial New, italic) for headings — tokens
live in `src/styles/theme.css` as a Tailwind v4 `@theme` block. No raw hex
belongs in a component. (The accent is still named `saffron` in every
token and class — `bg-saffron`, `text-saffron-deep` — even though the
color moved from amber to green; renaming every call site wasn't worth it
for a cosmetic change. `theme.css` documents this.)

## Deployment / backend

Hosted on [Vercel](https://vercel.com) — its `/api/*.ts` file convention
maps directly onto the `Browser → /api/instamart/* → Swiggy MCP →
Instamart` shape this integration needs, and it's the reason the project
moved off GitHub Pages (which can only serve static files — no OAuth token
exchange, no server-held credentials, no way to keep a Swiggy client
secret out of the browser bundle).

`vercel.json` handles the build (`npm run build` → `dist/`) and rewrites
every non-`/api` path to `index.html` for client-side routing.

**Current status:** the `/api/instamart/*` routes exist and are typed, but
every one returns `501` — there's no Swiggy client ID yet (needs an email
to `builders@swiggy.in` requesting one, plus a registered redirect URI).
Until then `VITE_INSTAMART_ENABLED` stays unset, `swiggyMcpClient.ts`'s
`IS_CONNECTED` is `false`, and the app runs exactly as described below.

## What's mocked vs. real

**Real:** discovery, filtering, search, serving-size math, product matching
heuristics (pack-fit scoring, leftover estimates), cart/removal/already-have
state, all client-side.

**Mocked, clearly labelled:** the Instamart cart hand-off and order
placement (`cartService.pushToInstamart`, `checkoutService.confirmCheckout`)
simulate latency and return believable results, but never call a real API.
`Order.isMock` is a non-optional `true` — there's no code path that can
produce an order object without it. The `/api/instamart/*` backend these
will eventually call already exists (see
[Deployment](#deployment--backend)) but isn't live yet.
