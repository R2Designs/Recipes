# Recipes

A discovery-first Indian recipe app that bridges "what should I cook" with
"what do I need to buy" — browse dishes, pick a version and serving size,
review a real shopping list, and hand it off to Instamart.

This is a **design prototype on mock data**. No backend, no real orders —
see [Architecture](#architecture) for how a real Instamart integration
would slot in later without touching the UI.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build     # type-checks, then builds to dist/
npm run preview   # serve the production build locally
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
Frontend → Application services → Recipe / Scaling / Ingredient-matching → swiggyMcpClient → Instamart
```

- `src/types/` — Recipe, Ingredient, Product, Cart, Order. No vendor concepts
  leak in here; `Product.vendorRef` is the one deliberate exception.
- `src/lib/scaling.ts` — pure, local serving-size scaling with per-unit
  rounding rules (grams round differently from teaspoons; discrete items
  like eggs never go fractional). No network involved — this part of the
  product works with zero backend.
- `src/services/` — `recipeService`, `scalingService`, `ingredientMatcher`,
  `cartService`, `checkoutService` are all async today (simulated latency)
  so swapping the mock body for a real `fetch('/api/...')` later is a
  contained, one-file change.
- `src/services/swiggyMcpClient.ts` — the **only** file that knows Swiggy
  exists. Every export throws `NotImplementedError` today. Nothing else
  imports it directly; `cartService`/`checkoutService` route around it
  behind a `USE_MOCK` flag.
- `src/store/` — Zustand, persisted: cart survives a refresh mid-flow,
  filters stay in the URL for shareable search results.
- `src/data/` — 24 recipes (Masala Dosa is the fully-fleshed flagship: 7
  variants, 5 creators), ~60 master ingredients, ~140 mock product SKUs,
  curated food photography (hotlinked Unsplash CDN URLs, not downloaded).

## Design system

Warm off-white paper, saffron-amber CTAs, all Plus Jakarta Sans — tokens
live in `src/styles/theme.css` as a Tailwind v4 `@theme` block. No raw hex
belongs in a component.

## What's mocked vs. real

**Real:** discovery, filtering, search, serving-size math, product matching
heuristics (pack-fit scoring, leftover estimates), cart/removal/already-have
state, all client-side.

**Mocked, clearly labelled:** the Instamart cart hand-off and order
placement (`cartService.pushToInstamart`, `checkoutService.confirmCheckout`)
simulate latency and return believable results, but never call a real API.
`Order.isMock` is a non-optional `true` — there's no code path that can
produce an order object without it.
