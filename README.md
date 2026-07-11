# Krino Media — Ghost theme

The theme that runs krinomedia.com: Watch, Listen, Read (with Essays/Fiction/
Poems/Book Review sub-sections), Learn (certificate programs), Stream (live
+ breaking updates), Shop (with Reports/Merch/Certificates sub-sections),
Advertise, About Us, Contact, and Jamal Awil's Writer page. Built to match
the Krino Brand Guidelines v1.0 — Gold/Ink/Bone/Slate/Stone palette,
Fraunces + Inter + JetBrains Mono.

This is a **normal Ghost theme** — every native Ghost feature (members,
paid subscriptions, the newsletter, Portal, RSS, SEO tags, etc.) works
exactly as it would with any theme. Nothing here is a special case that
needs extra steps beyond what any Ghost site owner already does in Admin.

**`/shop/` is the real Shop** — a page in this theme (`index-shop.hbs`
and friends), not a separate site. There's a `storefront/` folder in this
repo with a standalone React/Vite build of a Gumroad-style storefront —
it's dormant reference code, not deployed or wired into the theme's
build; see `storefront/README.md` before assuming it's live.

## Everyday editing (no code required)

Almost everything a publisher needs day-to-day happens in **Ghost Admin**
(`/ghost`), not in this repo:

- **Write a post** → Admin → Posts → New post. Add a **primary tag** to
  route it to the right section (see table below). Publish.
- **Add an embedded video or podcast player** → in the post editor, paste
  a YouTube/Vimeo/Spotify link on its own line (Ghost auto-embeds it via
  oEmbed), or use the **Video**/**Audio** card from the `+` menu to upload
  a file directly. The theme makes these responsive and on-brand
  automatically — no theme change needed per post.
- **Edit theme colors, social links, taglines, etc.** → Admin → Settings →
  Design & branding → **Theme settings**. See the full list below.
- **Change the homepage cover photo** → Admin → Settings → General →
  **Publication cover**. This is Ghost's native site-level cover image; the
  homepage hero (`index.hbs`) uses it as a full-bleed background with a dark
  gradient overlay so the headline stays legible. No cover set = the hero
  just shows the plain brand background, no broken image, no code change
  needed either way.
- **Set a cover image for one episode/video/post** → open the post in the
  editor → post settings (gear icon, top right) → **Feature image**. This
  is per-post, separate from the site-level Publication cover above. Watch
  and Listen posts intentionally *don't* show this image on the post page
  itself (the embedded video/audio is the hero there instead — see
  `post.hbs`), but it **does** show as the episode's thumbnail everywhere
  it's listed as a card: `/listen/`, `/listen/shows/{show}/`, and the
  homepage spotlight. No Feature image set = the card falls back to the
  Krino mark rather than rendering blank.
- **Add/remove members, see subscriber counts** → Admin → Members.
- **Send the newsletter** → publish a post with "Send to members" enabled,
  or Admin → Members → Newsletter.

## How routing works (primary tags = sections)

Every post's **primary tag** decides which top-level section it lives in.
This is set in `routes.yaml` and doesn't need code changes to use:

| Primary tag | Section | URL pattern |
|---|---|---|
| `watch` | Watch | `/watch/{slug}/` |
| `listen` + a show tag (see below) | Listen → that show | `/listen/shows/{show}/{slug}/` |
| `listen` (no show tag) | Listen → All only | `/listen/{slug}/` |
| `read` + secondary tag `essays` | Read → Essays | `/read/essays/{slug}/` |
| `read` + secondary tag `fiction` | Read → Fiction | `/read/fiction/{slug}/` |
| `read` + secondary tag `poems` | Read → Poems | `/read/poems/{slug}/` |
| `read` + secondary tag `book-review` | Read → Book Review | `/read/book-review/{slug}/` |
| `read` (no matching secondary tag) | Read → All only | `/read/{slug}/` |
| `learn` | Learn (certificate programs) | `/learn/{slug}/` |
| `shop` + secondary tag `reports` | Shop → Reports | `/shop/reports/{slug}/` |
| `shop` + secondary tag `merch` | Shop → Merch | `/shop/merch/{slug}/` |
| `shop` + secondary tag `certificates` | Shop → Certificates | `/shop/certificates/{slug}/` |
| `shop` (no matching secondary tag) | Shop → All only | `/shop/{slug}/` |
| `stream` | Stream (live + breaking) | `/stream/{slug}/` |
| *(anything else)* | Homepage feed | `/{slug}/` |

Also meaningful: tag it `breakdown` to make a post eligible for the
homepage's "The Breakdown" spotlight card.

## Homepage anatomy (`index.hbs`)

The homepage pulls live content from all six sections, not just Read — each
row below is its own `{{#get "posts" filter="primary_tag:X" limit="3"}}`
query and self-hides (`{{#if}}`) if that section has no posts yet, so an
empty pillar never leaves a blank gap:

| Section (top to bottom) | Query | Card partial |
|---|---|---|
| Hero | 1 latest Watch/Listen post | `episode-spotlight` |
| The Breakdown | 1 post tagged `breakdown` | `breakdown-card` |
| Latest on Watch | 3 latest `primary_tag:watch` | `watch-card` |
| Latest episodes | 3 latest `primary_tag:listen` | `episode-card` |
| Latest from The Record | 3 latest `primary_tag:read` | `article-card` |
| Certificate programs | 3 latest `primary_tag:learn` | `learn-card` |
| From the Shop | 3 latest `primary_tag:shop` | `product-card` |
| Live & breaking | 3 latest `primary_tag:stream` | `breaking-row` |
| Newsletter | — | `newsletter-cta` |

There's no separate tile-grid nav on the homepage — the header
(`site-header.hbs`) already links to all six sections, so a second set of
tiles repeating the same links right below the hero was redundant and got
dropped. In its place is a small `.section-divider` (a thin rule with the
Krino mark centered on it) marking the end of the hero before The
Breakdown — purely decorative rhythm, not navigation.

**Card thumbnails all have a fallback now**: `watch-card`, `watch-feature`,
`episode-card`, `learn-card`, and `product-card` fall back to the Krino
mark when a post has no Feature image set, so a homepage with mixed
image/no-image content never shows a blank gap where a thumbnail should
be — same pattern as `show-card`.

**The Breakdown is styled as a broadcast frame**, not a text card:
`feature_image` (if the post has one) fills a 16:9 video frame — if not,
it falls back to the original ink/gold-arc placeholder rather than going
blank. On top of that: a gold "on-air" pill with a pulsing dot (top-left,
like a channel bug), a centered play button, and a lower-third caption
bar (gradient scrim + gold rule + headline + Krino lockup + "Watch now")
like a cable-news chyron. Since a `breakdown`-tagged post is always also
`watch` or `listen` (it's a real published episode, just double-tagged
for the homepage spotlight), it always has somewhere real to link to.

## Listen → Shows → Seasons

Each **show** is a real Ghost tag (not a separate content type) — its
`name`, `description`, and `feature_image` are the show's title, blurb,
and thumbnail on `/listen/shows/`. Tag an episode with `listen` + a show
tag (e.g. `krino-politics-podcast`) + a season tag (`season-1` through
`season-4`) and it automatically appears on that show's page, grouped
under the right season, with a season tab if any episodes exist for it.
An episode with just `listen` and no show tag still shows up in "All
episodes" on `/listen/` — shows are additive, not required.

**5 shows ship seeded**: The Krino Politics Podcast, On the Record,
Breaking Points, The Fact Check, Cross Examined — each with one Season 1
episode. No thumbnails are set (falls back to the Krino mark) since no
real show art exists yet; upload one per show via Admin → Tags → (the
show) → Feature image.

**Adding a 6th show is two steps, no code**: create a new tag in Admin
(with a description, ideally a feature image), then tag episodes with it
plus `listen` and a season tag — it'll show up in "All episodes" and on
its own `/tag/{slug}/` archive immediately. **To get it a real
`/listen/shows/{slug}/` page** (not just the generic tag archive) needs
one small code change: add a new collection block to `routes.yaml`
(copy one of the 5 existing `/listen/shows/{show}/` blocks) and a new
template file that calls `{{> "show-page" showSlug="..."}}` — see
`index-listen-show-cross-examined.hbs` for the ~2-line pattern to copy.
This is a deliberate ceiling, not an oversight: Ghost's routes.yaml
doesn't support a single dynamic `/listen/shows/{any-slug}/` route, so
each show needs its own explicit block, same as Read's Essays/Fiction/
Poems/Book Review sub-sections.

**`/listen/` also embeds all 5 shows inline** as click-to-expand
accordions (`partials/show-accordion.hbs`, native `<details>`/`<summary>`
— zero JS, keyboard/screen-reader accessible for free), right above the
"All episodes" list, so visitors can browse by show without leaving the
page. Each accordion is a normal Ghost tag lookup for the header (name,
description, image, count) plus one `{{#get "posts" ...}}` per season
tag, same idea as `show-page.hbs`. Adding a 6th show to the page-level
accordion list is one line in `index-listen.hbs`:
`{{> "show-accordion" showSlug="your-new-slug"}}`. Each accordion row
darkens to a gold tint on hover/focus (name and chevron shift to
`--gold-dark`) so it's clear it's clickable before you open it.

**Real bug hit and fixed building the accordion**: Ghost's `{{#get}}`
dynamic-filter substitution — the `{{...}}` you can embed inside a
`filter="..."` string, e.g. `filter="tag:{{showSlug}}"` — resolves
against the **immediate call-site context only**. It is not full
Handlebars path resolution, so the usual parent-context escape hatch
(`{{../showSlug}}`) does **not** work there, unlike a normal
`{{../foo}}` reference elsewhere in a template. The first version of
`show-accordion.hbs` nested its four season `{{#get "posts"
filter="...{{showSlug}}..."}}` calls inside `{{#foreach showTag}}`
(to keep the whole `<details>` element self-contained), which silently
resolved `showSlug` to an empty string — rendering zero seasons and a
broken `/listen/shows//` link, no error thrown. Switching `{{showSlug}}`
to `{{../showSlug}}` did **not** fix it, confirming the dynamic-filter
lookup really doesn't walk contexts. The actual fix: keep every
`{{#get}}` that filters on `{{showSlug}}` at the partial's **root**
scope (never nested inside `{{#foreach}}` or any other context-changing
block) — same structural rule `show-page.hbs` already followed. Worth
knowing before nesting a `{{#get ... filter="{{param}}"}}` inside any
block helper in this theme: hoist it to the top level instead of
reaching for `../`.

**Real bug hit and fixed while seeding this**: when creating a post via
the Admin API and referencing an *existing* tag by `{"name": slug,
"slug": slug}`, Ghost matched by name (not slug) and silently created a
duplicate tag (`krino-politics-podcast-2`) instead of reusing the real
one — the episode ended up in "All episodes" but not on its show page,
and the real tag's description went unused. Fixed by referencing the
existing tag by its actual `id` instead. Worth knowing if you ever script
content creation against this site: **reference existing tags by id, not
by name/slug**, when you need to guarantee reuse rather than risk a
duplicate.

**Shop has no cart or checkout** — Ghost doesn't have one natively. Each
product post's "Buy now" is a real link *you* add: open the product post,
add a **Button card** (`+` menu → Button) with your actual checkout URL
(a Stripe Payment Link, Gumroad, Lemon Squeezy — whatever you use), same
idea as the Contact form's configurable endpoint. The seeded placeholder
products each have a note in the body reminding you to do this. Price is
set via the post's **excerpt** field (e.g. "$29 · PDF, 34 pages") — plain
text only, no HTML entities (a real bug I hit seeding this: `&middot;`
in an excerpt renders as the literal text "&middot;", not a middle dot,
because excerpt isn't HTML-parsed the way post body content is — use the
actual character instead).

**A post can only have one primary tag**, so it lives in exactly one
section — that's a Ghost/routes.yaml constraint, not something this theme
can work around.

## Theme settings reference

Admin → Settings → Design & branding → Theme settings:

| Setting | What it controls |
|---|---|
| Gold / Ink | The two brand colors used everywhere (buttons, dark panels) |
| Hero tagline | Homepage hero subhead |
| Newsletter intro text | Copy shown above every newsletter signup form |
| Learn intro text | Subhead on the `/learn/` hero |
| YouTube URL | "Watch on YouTube" links (footer, Listen sidebar, Learn) |
| Podcast Apple/Spotify/Overcast URLs | "Listen on..." platform links |
| Radio stream URL | Radio player link |
| Twitter/Instagram/LinkedIn URLs | Social links (footer, Writer page) |
| Advertise email | `mailto:` link on `/advertise/` |
| Contact form action | POST endpoint for the `/contact/` form (see below) — leave blank and it shows a plain email link instead of a dead form |
| Contact email | Email shown on `/contact/` when no form endpoint is set |
| Stream YouTube channel ID | Powers the live embed on `/stream/` (channel ID, not URL) |
| Stream live banner | Toggle the site-wide "Live now" banner on/off during a stream |

## Monetization — what's live vs. what needs your action

**Already fully wired (this is real, native Ghost, not a mockup):**
- Free membership tier
- A paid tier, "Krino Insider" ($8/mo, $80/yr — edit anytime in Admin →
  Settings → Membership), with starter benefits
- Portal (the signup modal) configured to show both plans
- Newsletter signup forms throughout the theme, all using Ghost's real
  Members API

**Needs your action — I can't do this part for you, it requires your real
business/bank details:**
1. **Connect Stripe** (Admin → Settings → Membership → payment options) —
   until this is done, visitors can join for free but can't actually pay.
   This is the one step standing between "Krino Insider" and real revenue.
2. **Connect Mailgun** (Admin → Settings → Email newsletter) for sending
   the newsletter to your list in bulk — the built-in "Direct" mail
   transport works for small transactional emails (signup confirmations)
   but isn't meant for broadcasting to a real subscriber list.
3. **A contact form endpoint** (see Theme settings above) — a free
   Formspree account is the fastest path.

## Updating the theme's code

This repo (`~/krino-media-theme` locally, `jamaawil/polymathradio` on
GitHub) is the actual theme source — separate from the Ghost install that
runs it.

**Local preview** (`~/ghost-krino-local`, port 2369):
```
cd ~/ghost-krino-local && ghost restart   # picks up routes.yaml / new files
```
Editing an existing `.hbs`/`.css`/`.js` file is picked up live without a
restart in development mode; adding a *new* template file or changing
`routes.yaml` needs one.

`routes.yaml` lives in **two places** and they must be kept in sync:
`~/krino-media-theme/routes.yaml` (source of truth, in git) and
`~/ghost-krino-local/content/settings/routes.yaml` (what Ghost actually
reads — Ghost does not read routes.yaml from the theme folder). After
editing the source, copy it over:
```
cp ~/krino-media-theme/routes.yaml ~/ghost-krino-local/content/settings/routes.yaml
```

**Validate before shipping anything:**
```
npx gscan ~/krino-media-theme
```

**Ship to production**, once real hosting exists:
- *Self-hosted Ghost*: `git pull` inside the theme's location on the
  server, or `zip` this repo and upload via Admin → Design → Themes →
  Upload theme, then Activate.
- *Ghost(Pro)*: zip the repo (exclude `.git`) and upload the same way —
  Ghost(Pro) doesn't give server shell access, so git-pull isn't an option
  there.

**Commit and push**:
```
cd ~/krino-media-theme
git add -A && git commit -m "..." && git push origin main
```

## Adding video/podcast embeds — quick reference

- **YouTube/Vimeo**: paste the URL on its own line in the post editor.
  Renders full-width, true 16:9, rounded corners.
- **Spotify/SoundCloud/Anchor** (podcast platform embeds): same — paste
  the episode URL. Renders at the platform's natural widget height
  instead of being stretched to 16:9.
- **Self-hosted audio/video file**: use the Video or Audio card from the
  editor's `+` menu. Ghost's own player UI is used (loaded automatically
  via `card_assets: true` in `package.json`); this theme only adds the
  responsive frame and spacing around it.
- On `/watch/` and `/listen/` posts specifically, the embed is the page's
  hero — the static feature image is skipped for these two sections so
  the real player isn't competing with a duplicate thumbnail above it.
- YouTube embeds on Watch posts render as a click-to-load thumbnail
  facade (real YouTube JS/iframe doesn't load until clicked) — a Core Web
  Vitals win, handled entirely in `assets/js/main.js`, no editor action
  needed.

## Internal tags (opt-in per post, no public archive page)

Add these as extra tags on a post — they're `#`-prefixed so Ghost never
gives them a public `/tag/` page:

| Tag | Effect |
|---|---|
| `#dropcap` | Large decorative first letter on the post's opening paragraph |
| `#vertical` | Forces embedded video/audio to a 9:16 frame (Shorts/Reels-style posts) |
| `#lesson` | Turns a Learn post into a course lesson: adds a "Mark as complete" button and prev/next lesson nav (scoped to same primary tag — see Learning pillar below) |
| `breakdown` (no `#`, public tag) | Makes a post eligible for the homepage's "The Breakdown" spotlight |

## Video pillar (Watch)

- `partials/schema-video.hbs` emits `VideoObject` JSON-LD. Real gap: Ghost
  has no structured field for a video's `duration` or `contentUrl`/
  `embedUrl` (the video lives inside `{{content}}` as a pasted embed, not
  a post property), so those are omitted rather than guessed. For a
  specific episode where exact values matter for Search rich results, add
  them via that post's Settings → Code injection (head).
- "More to watch" at the bottom of every Watch post pulls 4 other Watch
  posts via `{{#get}}`.
- `#vertical` tag (above) for Shorts-style vertical video posts.

## Podcast pillar (Listen)

- **Custom iTunes-namespaced feed** at `/listen/rss/` (`listen-rss.hbs`,
  registered in `routes.yaml` — it overrides Ghost's own auto-generated
  feed at that same path, which has no podcast tags).
- **Real gap, don't submit this feed to Apple/Spotify as-is**: it has no
  `<enclosure>` (the actual audio file URL, which those platforms
  require) for the same structural reason as the video schema gap above.
  Two real paths forward: host episodes on dedicated podcast infra
  (Transistor etc.) and submit *that* feed to Apple/Spotify instead,
  using this one only for the site's own `/listen/` page and its RSS
  reader subscribers; or hand-add enclosures per episode via Code
  injection once each has a stable public audio URL.
- **Sticky mini-player**: mirrors whichever native Audio card is playing
  in a fixed bottom bar. This is page-scoped, not cross-navigation — full
  page loads reset it. True persistent playback across navigation would
  need a pjax/SPA layer, a materially bigger change than a standard Ghost
  theme takes on.
- **Transcripts**: use a native `<details><summary>Transcript</summary>...
  </details>` block in the post editor's HTML card — styled automatically,
  no theme change needed per episode.

## Reading pillar (Read)

- Reading progress bar + auto-built table of contents (3+ headings
  required) on every Read post — see `assets/js/main.js`.
- "Related reading" pulls 3 other Read posts.
- Footnotes (Markdown card `[^1]`) and pull quotes (`.kg-blockquote-alt`
  class on a quote block) are styled automatically.

## Learning pillar (Learn)

Two ways to use Learn, both supported:
- **Standalone certificate program** (current seeded content): one post
  = one program, sold via the Free/Learn membership tier or one-time via
  Shop → Certificates.
- **Multi-lesson course**: tag each lesson post `learn` + `#lesson` (plus
  any shared secondary tag you want for grouping/display). Prev/next
  lesson nav uses Ghost's native `{{#prev_post in="primary_tag"}}`, which
  scopes navigation to same-pillar posts — with only one course live at a
  time this means "the other Learn posts in order"; with multiple
  concurrent courses you'd want a more specific secondary-tag-scoped
  nav, which Ghost's native prev/next helper doesn't support out of the
  box (only `in="primary_tag"` or `in="tag"` for *all* shared tags, not a
  single specific one).
- **Completion tracking is localStorage-only** (`assets/js/main.js`), per
  browser, not per member, not cross-device. Ghost has no native
  per-member progress store. For durable, cross-device tracking, the
  checklist's own suggestion — a small Supabase table keyed by member
  email, read via a client-side fetch against the Content API — is the
  right next step, not something this theme repo builds on its own.
- Downloadable resources: native Ghost **File card** (`+` menu → File),
  styled automatically (`.kg-file-card`).

## Social web / fediverse

`social_web_enabled` is **on by default in this Ghost 6 install** —
nothing to configure. It just doesn't do anything visible on localhost:
the ActivityPub federation gateway needs a real public HTTPS domain to
actually serve actor/webfinger endpoints, which is exactly what's missing
in local dev. Once this theme is live on krinomedia.com, no further setup
is needed for the site to become a followable fediverse account.

## PWA

- `assets/manifest.json` + a service worker at `/service-worker/`
  (registered from a **routes.yaml route, not a static asset file** — a
  service worker's scope defaults to its own directory, and a copy sitting
  under `/assets/js/` could only ever control requests to that one
  subfolder; root-scoped via routes.yaml, it can see every request).
- **Real gap**: the manifest icon is the existing `favicon.svg`. No PNG
  icons exist (192×192, 512×512 are the usual requirement) — this
  machine has no SVG→PNG conversion tool installed and installing one
  wasn't in scope for a theme-code pass. Generate real PNGs from
  `assets/images/krino-mark.svg` before relying on "Add to Home Screen"
  looking right on iOS, which doesn't accept SVG manifest icons.

## Comments — real constraints

`{{comments}}` is enabled (Settings → Membership → Access → currently
"All members"). Two things this theme genuinely cannot change: the
comments UI renders in a sandboxed iframe Ghost controls, so no theme CSS
reaches it; and there's no public Comments write API (as of this Ghost
version), which matters if you ever want a headless/non-Ghost-templated
frontend to show or post comments.
