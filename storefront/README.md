# Krino Shop (reference build, not the live Shop)

**The real Shop is `/shop/` in the Ghost theme itself** — `index-shop.hbs`
and friends, one directory up, already live with real product tags
(`reports`/`merch`/`certificates`), category pages, and checkout via a
native Button card per product. That's what's actually deployed and what
visitors use.

This folder is a Gumroad Discover-style React/Vite build of the same idea
as its own app, kept here as reference code rather than a second deployed
site — it's not wired into the theme's build or served by Ghost. If a
standalone storefront app ever becomes worth deploying separately (e.g.
`shop.krinomedia.com` as its own property), this is a working starting
point; until then, treat everything below as inert example code, not a
live system.

**Not a second product database, if it's ever activated**: it was built
to read Shop products live from the same Ghost site via the Content API
— a product published in Ghost Admin (tagged `shop` +
`reports`/`merch`/`certificates`) would show up here automatically. One
source of truth either way.

## Setup

```
npm install
cp .env.example .env.local
```

Fill in `.env.local`:
- `VITE_GHOST_API_URL` — your Ghost site's URL, e.g. `https://krinomedia.com`
- `VITE_GHOST_CONTENT_API_KEY` — Ghost Admin → Settings → Integrations →
  "Ghost Core Content API" (or create a new Custom Integration). This key
  is read-only and safe to ship in client-side code — it only ever
  returns already-published content.

```
npm run dev
```

Without those two values set, every page shows an explicit "not
connected yet" state instead of a broken or empty-looking storefront.

## How checkout actually works

Ghost has no native cart. Each product's real "Buy now" button comes from
a **Lemon Squeezy checkout URL you add in the Ghost post itself** — open
the product in Ghost Admin, add a Button card (`+` menu → Button) with
your real Lemon Squeezy/Gumroad/Stripe Payment Link, and this storefront
picks it up automatically (`src/types/product.ts` extracts the link from
the post's HTML). Until that link exists, the product page shows a
"not connected to checkout yet" state with a link back to the Ghost post
instead of a dead button.

Lemon Squeezy's overlay script (`src/lib/lemonsqueezy.ts`) loads once and
turns any `<a class="lemonsqueezy-button">` into an on-page checkout —
that's the entire integration on this end. If you use a different
platform's plain checkout link instead, the button still works as a
normal link to their hosted checkout page.

## Deploying (only if this ever gets activated as its own app)

**Netlify** (`netlify.toml` is already configured):
1. Push this folder as its own repo to GitHub (it'll need its own repo —
   Netlify builds one repo per site, so it can't stay a subfolder of the
   theme repo for this step).
2. In Netlify: New site from Git → pick this repo. Build command and
   publish directory are already set via `netlify.toml`.
3. Add the same three env vars from `.env.local` under Site settings →
   Environment variables (Netlify doesn't read `.env.local` — that file
   is git-ignored and local-only).
4. Point `shop.krinomedia.com` at Netlify: Domain settings → Add custom
   domain → follow Netlify's DNS instructions (a CNAME to your Netlify
   subdomain is the standard path; keep it "DNS only" if your registrar
   has a proxy/CDN option, to avoid SSL redirect loops).

## Shared design tokens

`src/tokens.css` mirrors `krino-media-theme/assets/css/screen.css`'s
`:root` values exactly (Bone/Ink/Gold/Slate/Stone, same three fonts).
It's hand-synced for now, not a shared package — if you change the
palette in the Ghost theme, update this file too so the two properties
don't visually drift apart. Publishing it once (a tiny npm package, or a
single CDN-hosted file both projects `@import`) is the real fix if that
drift becomes a problem.

## What's real vs. placeholder here

- **Real**: the Content API integration, the product grid/category nav/
  product detail pages, the Lemon Squeezy overlay wiring, the shared
  design language.
- **Needs you**: an actual Lemon Squeezy (or Gumroad/Stripe) account —
  can't be created on your behalf, it needs your real business/bank
  details. Until products have real checkout links, "Buy now" honestly
  says so instead of pretending to work.
- **Not built**: physical-merch fulfillment (Shopify/Printful), which the
  original build checklist flagged as a separate lane once merch volume
  justifies it — this app only handles the storefront UI + digital
  checkout via Lemon Squeezy's overlay.
