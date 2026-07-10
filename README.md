# Krino Media — Ghost theme

The theme that runs krino.media: Watch, Listen, Read (with Essays/Fiction/
Poems/Book Review sub-sections), Learn (certificate programs), Stream (live
+ breaking updates), Shop (with Reports/Merch/Certificates sub-sections),
Advertise, About Us, Contact, and Jamal Awil's Writer page. Built to match
the Krino Brand Guidelines v1.0 — Gold/Ink/Bone/Slate/Stone palette,
Fraunces + Inter + JetBrains Mono.

This is a **normal Ghost theme** — every native Ghost feature (members,
paid subscriptions, the newsletter, Portal, RSS, SEO tags, etc.) works
exactly as it would with any theme. Nothing here is a special case that
needs extra steps beyond what any Ghost site owner already does in Admin.

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
- **Add/remove members, see subscriber counts** → Admin → Members.
- **Send the newsletter** → publish a post with "Send to members" enabled,
  or Admin → Members → Newsletter.

## How routing works (primary tags = sections)

Every post's **primary tag** decides which top-level section it lives in.
This is set in `routes.yaml` and doesn't need code changes to use:

| Primary tag | Section | URL pattern |
|---|---|---|
| `watch` | Watch | `/watch/{slug}/` |
| `listen` | Listen | `/listen/{slug}/` |
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
