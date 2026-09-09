# QueueFlow landing — art direction: "NOW SERVING"

Branch `feat/landing-showstopper`. Toolkit already installed and proven (see §6).
This document is the brief for the build agent. It does not touch the page; the page
is still the v2 ink-hero build under `src/components/landing/`.

---

## 1. Concept

QueueFlow's whole world is a lobby: a paper ticket in your hand, a "NOW SERVING" board
on the wall, a counter that calls your number. The landing page *is* that lobby —
the wall board is the hero, the ticket is the recurring motif, and every surface the
product really has (board, staff dashboard, customer phone) is shown advancing from
**one** "Call next", so the page proves the product instead of decorating it.

**Signature moment — "The Call".** Behind the headline, a full-width LED dot-matrix
board reads `NOW SERVING A-042` in amber. Every four seconds (and every time the
visitor presses the real-looking **Call next** button on the staff-dashboard mock),
the digits roll like a mechanical counter to `A-043`, the mock's queue shifts up one
row, and the customer's phone ticket updates from "#3 in line" to "#2". Three
surfaces, one heartbeat. The board's dots flicker faintly like a real display; the
headline's words arrive one at a time, *called* onto the page.

---

## 2. Palette (hex, with measured contrast)

| Token | Hex | Role | Contrast checked |
|---|---|---|---|
| `--ink` | `#0B1220` | Hero / CTA / footer ground (kept) | — |
| `--board` | `#07090F` | The LED board panel inside the hero | — |
| `--led` | `#FFB020` | LED amber: ticket digits, "NOW SERVING", eyebrow on ink | 10.2:1 on `--ink`, 10.9:1 on `--board` |
| `--led-hot` | `#FFC957` | Brightest dot in the LED glow gradient (never body text) | 13.0:1 on `--board` |
| `--on-ink-1` | `#FFFFFF` | Headline on ink (kept) | 18.7:1 |
| `--on-ink-2` | `#B7BFCF` | Body on ink (lifted from `#AAB4C8`) | 10.1:1 on `--ink` |
| `--sky` | `#38BDF8` | Only for focus rings and the BorderBeam tail on ink (kept) | 8.7:1 |
| `--cream` | `#F7F3EA` | Section ground replacing `--mist` (thermal-paper warmth) | — |
| `--paper` | `#FFFFFF` | Cards, the phone ticket, pricing tiles (kept) | — |
| `--hairline` | `#E7E2D6` | Rules, card borders, perforation dots on cream | — |
| `--text-1` | `#0F172A` | Headings/body on cream and paper (kept) | 16.1:1 on cream |
| `--text-2` | `#475569` | Secondary text (kept) | 6.8:1 on cream |
| `--stamp` | `#B45309` | Amber-deep for small text/eyebrows on cream (replaces amber-on-cream, which fails) | 4.5:1 on cream |
| `--brand` | `#2563EB` | Primary buttons (white text) | 5.2:1 white-on-brand |
| `--brand-deep` | `#1D4ED8` | Button hover, links on cream | 6.1:1 on cream |

Rules: amber (`--led`) lives **only on ink/board**. On cream, "amber" becomes
`--stamp`. Never put `#D64545`-style stamp red on cream for text (3.95:1, fails).
The existing chip `#92400E` on `#FFF3D6` (6.4:1) stays for "Now serving" pills inside
vignettes.

---

## 3. Typography

**Pairing: Bricolage Grotesque (display) + Instrument Serif Italic (accent) + Inter (body).**

- **Bricolage Grotesque** (Google Fonts, OFL, variable `opsz 12–96`, `wdth 75–100`,
  `wght 200–800`). At optical size 96 and width 90 it turns into tight, slightly
  quirky signage lettering — the same family of shapes as a take-a-number dispenser
  or a departures board — while at opsz 12 it is a friendly, readable grotesque for
  eyebrows and ticket labels. One file, two personalities: that is the ticket-and-board
  duality of the product.
- **Instrument Serif Italic** (Google Fonts, OFL, one weight). Used for at most one
  word per heading: the *calm* in "Calmer lobbies". It is the human counter-note to
  the mechanical board — the reassurance the product is selling.
- **Inter** (already loaded by `src/index.css`; zero extra cost). Body, UI, the
  product mock. Keep the staff-dashboard mock in Inter + tabular numerals so it looks
  like the real app, not the poster.

Load (add to the existing `@import` in `src/index.css`, or a `<link>` in `index.html`
with `preconnect`):

```
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Instrument+Serif:ital@1&display=swap
```

Sizes (landing scope only, `.landing`):

| Role | Face | Size | Weight / axes | Tracking / leading |
|---|---|---|---|---|
| Board digits `A-042` | Bricolage | `clamp(72px, 16vw, 200px)` | 700, `opsz 96`, `wdth 80` | `-0.03em` / 0.9, `font-variant-numeric: tabular-nums` |
| Board label `NOW SERVING` | Bricolage | 14–18px | 700, `opsz 12`, `wdth 100` | `0.22em` uppercase |
| h1 | Bricolage | `clamp(44px, 7vw, 84px)` | 700, `opsz 96`, `wdth 90` | `-0.03em` / 1.0 |
| h1 accent word | Instrument Serif Italic | same size ×1.08 | 400 | `-0.01em` |
| h2 | Bricolage | `clamp(32px, 4.5vw, 52px)` | 600, `opsz 72`, `wdth 92` | `-0.025em` / 1.05 |
| h3 / card titles | Bricolage | 20–22px | 600, `opsz 20` | `-0.01em` / 1.25 |
| Eyebrow | Bricolage | 12px | 700, `opsz 12` | `0.16em` uppercase, colour `--led` on ink / `--stamp` on cream |
| Body | Inter | 17–18px | 400 | 0 / 1.6 |
| Ticket stub numerals | Bricolage | 26–34px | 700, `opsz 32`, `wdth 85` | `-0.02em`, tabular |

`font-variation-settings: "opsz" 96, "wdth" 90` is set per role in `landing.css`;
Tailwind v3 has no utility for these axes.

---

## 4. Texture

- **Grain** — `fx/Grain.tsx` (SVG feTurbulence, `mix-blend-mode: overlay`) at
  opacity 0.06 on ink sections, 0.035 on cream. Never on the product mock.
- **LED field** — `fx/FlickeringGrid.tsx` (canvas, lazy chunk) behind the board:
  `squareSize 3`, `gridGap 5`, `color #FFB020`, `maxOpacity 0.18`,
  `flickerChance 0.12`. On top, a `radial-gradient` amber glow behind the digits
  (`rgba(255,176,32,.35)` → transparent, `filter: blur(60px)`).
- **Dot-matrix digits** — render the `TicketNumber` in `--led` and clip it with a
  dot mask so it reads as an LED sign: `mask-image: radial-gradient(circle, #000 55%,
  transparent 60%)`, `mask-size: 8px 8px` (6px under 640px). With `-webkit-mask` prefix.
  Keep `aria-label` on the wrapper; the mask is purely visual.
- **Ticket paper** — the customer phone ticket and the "fit" chips get a perforated
  top edge: `mask-image: radial-gradient(circle at 6px 0, transparent 4px, #000 4.5px)`
  with `mask-size: 12px 100%`, plus a faint `box-shadow` inset for tooth. Cream
  ground (`--cream`), text `--text-1`.
- **Glass** — only the browser-frame chrome of the staff mock: `backdrop-blur`
  is not needed; keep the existing `bg-[--ink-2]` and add `fx/BorderBeam` (amber →
  sky) around the frame, one lap every 9s.

---

## 5. Motion system

**Library:** `motion` v13 via `LazyMotion` + `m` (`fx/MotionProvider.tsx`; wrap the
landing root once). Digits: `@number-flow/react` via `fx/TicketNumber.tsx`.
No GSAP, no Lenis, no three.js — native scroll, no pinning, nothing the page needs
that CSS/Motion cannot do.

**Easing vocabulary** (three curves, no others):

- `--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)` — reveals, 480–640 ms.
- `--ease-roll: cubic-bezier(0.2, 0.8, 0.2, 1)` — digit rolls, 700 ms (set in `TicketNumber`).
- Spring `stiffness 260, damping 26, mass 0.8` — the called words (set in `CalledWords`).

**On load (hero only, ≤ 1.4 s total):**

1. `t=0` Board panel is present (no fade — LCP element must paint immediately).
   Digits render at `A-041`.
2. `t=150 ms` `CalledWords` h1 starts: words rise 0.6em, un-blur, spring in,
   90 ms stagger. "Calmer" (the Instrument Serif word) is index-accented.
3. `t=600 ms` Subline + buttons: opacity 0→1, `y 12→0`, 480 ms `--ease-out-quart`.
4. `t=900 ms` Board rolls `A-041 → A-042` (first "call"), the product mock's top
   row highlights, the phone ticket's `#3` becomes `#2`. Then a 4 s interval.
5. Staff-mock frame: BorderBeam starts its lap.

**On scroll:**

- Every section keeps the existing `.reveal` IntersectionObserver system
  (`useReveal.ts`) — it is cheap and already reduced-motion safe. Do not replace it
  with `whileInView` everywhere; use `whileInView` only for `CalledWords` h2s.
- Board parallax: `useScroll` + `useTransform` on the hero board, `y: 0 → 80px`
  and `opacity 1 → 0.35` over the first 80 vh. Transform only (compositor).
- "How it works" step numbers are ticket stubs `01 02 03` that roll in with
  `TicketNumber` (`prefix ''`, `digits 2`) as each step enters view.
- The fit strip is a `Marquee` (departures-board style, `--duration: 38s`,
  `pauseOnHover`), sectors separated by a `--led` dot.

**On hover / press:**

- **Call next** (the real-looking button in the mock, `type="button"`,
  `aria-label` from `public.preview.callNext`): press → `scale 0.97` 120 ms, then the
  board rolls, the row shifts, the ticket updates. This is the only interactive
  element inside the mock; it does nothing but advance the example data.
- Bento tiles: existing `translateY(-2px)` + shadow, plus the tile's vignette number
  (`A-047` etc.) rolls +1 on hover via `TicketNumber` (one roll, not a loop).
- Buttons: existing `qf-btn` hover.

**Reduced motion (`prefers-reduced-motion: reduce`):** `MotionConfig
reducedMotion="user"` makes Motion skip transforms (opacity fades remain);
`TicketNumber`/NumberFlow swaps digits instantly; `FlickeringGrid` draws one static
frame; `Marquee` becomes a wrapping static row (see `fx/fx.css`); the 4 s interval
does not start (existing `ProductPreview` behaviour); BorderBeam holds still.
Nothing loops.

**Budget:** one `requestAnimationFrame` loop on the page (FlickeringGrid, only while
on screen and tab visible). NumberFlow and Marquee are CSS animations. No scroll
handlers besides Motion's passive `useScroll`.

---

## 6. Which tool does what

| Need | Tool | Component / API | Cost (gzip, measured in this repo) |
|---|---|---|---|
| Word-by-word "called" headline | motion (`m`, variants, `whileInView`) | `fx/CalledWords` | shared with the ~20 kB `m` + `domAnimation` |
| Reveal/parallax | motion | `useScroll`, `useTransform`, `m.div` | shared |
| Ticket digits rolling | @number-flow/react | `fx/TicketNumber` | ~6 kB |
| Frame beam on the staff mock | motion (`offsetDistance` keyframes) | `fx/BorderBeam` | shared |
| Sector strip | CSS keyframes (`animate-marquee` in `tailwind.config.js`) | `fx/Marquee` | ~0 |
| LED field | canvas | `fx/FlickeringGrid` (**React.lazy**) | 1.25 kB own chunk |
| Grain | inline SVG data URI | `fx/Grain` | ~0.6 kB |
| Existing reveals | IntersectionObserver | `useReveal.ts` | 0 (already there) |

Measured: main chunk `224.41 kB` → `258.05 kB` gzip with **every** primitive
imported (+33.6 kB), well under the 250 kB new-JS ceiling. To trim a further
~10 kB, load features lazily:
`<LazyMotion features={() => import('motion/react').then(m => m.domAnimation)}>`.

Tools evaluated and **not** used: GSAP (27 kB, free, but ScrollTrigger pinning is
not part of this concept); Lenis (5.5 kB, but hijacked scroll fights reduced-motion
and a GitHub Pages sub-path SPA gains nothing); three + R3F (182 + 52 kB — only the
alternate concept in the appendix would justify it); `@paper-design/shaders-react`
(80 kB for a mesh gradient — replaced by the LED field + CSS glow); split-type (4 kB —
`CalledWords` splits the translated string itself); react-wrap-balancer (1 kB — CSS
`text-wrap: balance` is already applied); Lottie (34 kB — nothing to play);
Aceternity UI (site is "All rights reserved", paid All-Access; only MIT Magic UI ports
were taken).

---

## 7. Section-by-section

Order unchanged: nav, hero, fit strip, how it works, capabilities bento, trust,
visitors (ServiceCardsGrid), pricing teaser, CTA, footer. Every heading keeps its
current i18n key; new keys are listed in §8.

### Nav (`LandingNav.tsx`)
Wordmark in Bricolage `opsz 32, wdth 85`. Nothing else changes. Under the nav a
1 px `--hairline` at 12 % white so the board appears to hang on the wall.

### Hero (`HeroSection.tsx`, `ProductPreview.tsx`) — gains the signature moment
- Ground `--ink` with `Grain 0.06`. The **board** is a full-width panel
  (`--board`, 24 px radius, 1 px `rgba(255,176,32,.18)` border) sitting behind the
  copy on desktop, above the copy on mobile (it is the first thing seen at 390 px).
  Contents: eyebrow `public.board.nowServing` in `--led`; `TicketNumber` at
  `clamp(72px, 16vw, 200px)` with the dot mask; right-aligned small line
  `public.board.counter {number: 3}` · `public.board.upNext` + next ticket.
  `FlickeringGrid` fills the panel, lazy-loaded inside `Suspense` with a plain
  `--board` fallback.
- Headline `public.hero.headline` ("Shorter lines. Calmer lobbies.") via
  `CalledWords as="h1"` — this is the page's one `h1`. Accent word index: the word
  containing "Calm" (compute by matching the translated string against
  `public.hero.headlineAccent`, new key, see §8, so ES/PT/HT can choose their own word).
- Subline, buttons, facts unchanged in copy. Facts become three ticket stubs on
  cream with perforated tops.
- **Staff dashboard mock is kept verbatim in structure** and staged: it moves to a
  12-col grid `lg:col-span-6`, gets `BorderBeam` on its frame, and the existing
  `head` state is lifted to the hero so board, mock and phone ticket share it. The
  "Call next" pill becomes a real `<button>` that increments `head`. The phone ticket
  stays overlapping bottom-left, on cream with the perforated edge.

### Fit strip (`FitStrip.tsx`) — gains motion and material
Cream ground. `Marquee` of the six `public.fit.*` chips as ticket stubs (perforated
tops, Bricolage 15 px), `--led`-coloured dot separators become `--stamp` on cream.
The `h2` eyebrow stays (sr-friendly, static, above the marquee).

### How it works (`HowItWorksSection.tsx`) — gains the ticket-stub numbering
Paper ground. Step circles become square ticket stubs (`--cream`, perforated) with
`TicketNumber prefix="" digits={2}` rolling `00 → 01/02/03` on entering view. The
desktop connector becomes a dashed `--hairline` "tear line". Titles in Bricolage `opsz 20`.

### Capabilities bento (`CapabilitiesBento.tsx`) — gains hover life and hierarchy
Cream ground, cards on paper. Vignettes unchanged in markup; every hard-coded
`A-042`/`A-047` string in a vignette becomes a `TicketNumber` that rolls +1 on tile
hover (`onMouseEnter`, one roll, keyboard `onFocus` too). The **Lobby signage** tile
reuses the hero board treatment at small scale (dot mask, `--led`) so the motif
closes the loop. Section `h2` via `CalledWords as="h2"`.

### Trust strip (`TrustStrip.tsx`) — gains the "stamp"
Row stays. Icons and the four facts unchanged; each cell gets a `--stamp` eyebrow
"01–04" in Bricolage `opsz 12` and a `--hairline` rule; the row's outer border becomes
a perforated ticket edge. No new claims.

### Visitors (`ServiceCardsGrid.tsx`) — gains contrast of purpose
Ink ground + `Grain` so it reads as the lobby wall (this is the customer block;
it must feel different from the buyer sections). Cards on paper with perforated tops.
Copy unchanged.

### Pricing teaser (`PricingTeaser.tsx`) — gains material only
Cream ground. The "Most popular" badge becomes a `--stamp`-on-cream stamp rotated
−4°. Titles in Bricolage. No motion beyond `.reveal`.

### CTA (`CTASection.tsx`) — gains the closing call
Ink + `Grain`. Above the headline a small board line: `public.board.nowServing` +
`TicketNumber` at 34 px that rolls **once** to the visitor's own "ticket" — the copy
line `public.cta.yourTurn` (new key: "Your turn.") replaces nothing; it sits above
`public.cta.headline`. The `h2` uses `CalledWords`. Buttons unchanged.

### Footer (`LandingFooter.tsx`)
Ink, hairline top, wordmark in Bricolage. Unchanged otherwise.

---

## 8. i18n

All landing copy stays in `public.*` and must exist in **all four** files:
`src/i18n/locales/en/public.json`, `src/i18n/locales/es.json`,
`src/i18n/locales/pt.json`, `src/i18n/locales/ht.json` (the three non-EN files hold
a top-level `public` object). Existing keys reused: `public.hero.*`,
`public.board.{nowServing,counter,upNext,example,location}`, `public.preview.*`,
`public.fit.*`, `public.howItWorks.*`, `public.capabilities.*`, `public.trust.*`,
`public.pricingTeaser.*`, `public.cta.*`.

New keys (add EN and translate for ES/PT/HT before merge):

| Key | EN |
|---|---|
| `public.hero.headlineAccent` | `Calmer` (the word of `public.hero.headline` to set in Instrument Serif Italic; each locale picks its own) |
| `public.board.ariaLive` | `Now serving {{ticket}} at counter {{number}}` (polite live region, announced only on the user-triggered "Call next", never on the interval) |
| `public.preview.callNextHint` | `Example only — advances the demo board` (`aria-describedby` on the button) |
| `public.cta.yourTurn` | `Your turn.` |
| `public.fit.marqueeLabel` | `Kinds of front desk QueueFlow is built for` (`aria-label` on the marquee region) |

---

## 9. Hard constraints (non-negotiable)

- **Truthful copy only.** No logos, testimonials, ratings, customer counts, or
  invented metrics. The board and mock are labelled `public.board.example`.
- One `h1` (the `CalledWords` headline). Section headings remain `h2`, tiles `h3`.
- Contrast ≥ 4.5:1 for all text (table in §2 — `--led` only on ink/board, `--stamp`
  on cream). Decorative LED dots/grain are non-text.
- Touch targets ≥ 44 px: buttons keep `qf-btn` (48 px), chips `min-h-11`, the
  "Call next" button ≥ 44 px tall.
- `prefers-reduced-motion`: §5 fallbacks; verify with the OS toggle that nothing loops
  and the board still shows a number.
- No horizontal overflow at 390 px: the board digits are `clamp`ed, `Marquee` and
  the mock live in `overflow-hidden` parents; test in Chrome device mode at 390 × 844.
- Performance: `FlickeringGrid` via `React.lazy`; fonts with `display=swap` and a
  `preconnect`; board digits are text (LCP-friendly); no images added; total new JS on
  the landing route ≤ 250 kB gzip (measured 33.6 kB). Run Lighthouse mobile before
  merge and keep Performance ≥ 90.
- The staff-dashboard product mock stays real product UI: same rows, stats,
  labels and `figure`/`figcaption` semantics as today.
- `tsc --noEmit -p tsconfig.app.json` and `vite build --base=/queueflow-demo/` must
  pass; `src/App.tsx` route structure untouched.

---

## Appendix — alternate direction: "The Ribbon" (3D, only if the client wants WebGL)

A single continuous strip of paper tickets (`A-040 … A-060`) rendered in
`@react-three/fiber` snakes from the top-right of the hero down into the staff-mock's
"Call next" button; scrolling advances the ribbon one ticket per 120 px, and the
ticket entering the button is the one the mock shows as "Now serving". Materials:
`MeshStandardMaterial` cream with a canvas texture per ticket (number drawn in
Bricolage), soft shadow, grain overlay. Cost: three `182 kB` + R3F `52 kB` gzip in a
lazy hero chunk (skip drei), fallback under reduced motion and on `webgl` failure to a
static CSS ribbon of three stacked stubs. It is more spectacular but costs ~230 kB,
needs a WebGL fallback path, and puts the signature in decoration rather than in the
product; "NOW SERVING" puts it in the product, for a tenth of the bytes.

---

## As built (branch `feat/landing-showstopper`)

Implemented section by section as specified above. Where the build differs from
the brief, the reason is recorded here.

**The Call.** `src/components/landing/useCallHeartbeat.ts` owns the single
`head` state (tickets called since load). `HeroSection` calls it once and passes
`head` to `LedBoard` (board digits + "up next"), to `ProductPreview` (queue rows,
now-serving row, figcaption, phone ticket position/ETA/progress) and renders the
polite live region. Timeline: A-041 at paint, first call at 900 ms, then every
4 s; the mock's real `<button>` calls immediately and restarts the clock;
`announcedHead` changes only on a press, so the live region never speaks for the
interval. Under `prefers-reduced-motion` the clock never starts and the page opens
on the settled state (A-042, "#2 in line"); a press still advances with instant
digit swaps.

**Phone ticket loop.** The customer's ticket walks 3 → 2 → 1 and is then reissued
three places back, so the mock never shows a served ticket. The rolling digit sits
inside the translated sentence via `useSplitTemplate`, which splits the active
locale's string around the `{{position}}` slot.

**Fonts.** Loaded in `src/index.css`:
`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,600..700&family=Instrument+Serif:ital@1&display=swap`.

**Deviations.**

- Bricolage is requested at `wght 600..700` instead of `200..800`: only 600 and
  700 are used, and a narrower range is a smaller variable file.
- No `<link rel="preconnect">`: `index.html` is outside the files this build was
  allowed to touch; the `@import` in `src/index.css` is kept.
- `FlickeringGrid` is not mounted under reduced motion at all (the `.qf-board`
  CSS dot field is the static frame), so the lazy chunk is never fetched there.
- `BorderBeam` gates itself on `useReducedMotion`: `offsetDistance` is not a
  transform, so `MotionConfig reducedMotion="user"` alone would let it loop. Its
  ring mask now uses two opaque layers (padding-box XOR border-box); the original
  transparent first layer left the whole box unmasked.
- The "Call next" accessible name is `Call next (Example)` with the hint sentence
  on `aria-describedby`, so the button says it is a demo without reading the hint
  twice.
- CTA board line is stacked (label above, `A-047` + *Your turn.* below) and the
  digits are 64–80 px rather than 34 px: under the 4 px dot mask, 34 px does not
  read as a number.
- Bento vignette numbers roll on `onMouseEnter`/`onFocus` of the tile; tiles are
  not made focusable (no `tabIndex`), so the keyboard path only fires when a tile
  gains a focusable child.
- Section `h2`s use `CalledWords` for Capabilities and the CTA only; the others
  keep the `.reveal` system, as §5 asks.

**Measured.** Main chunk gzip 223,876 B → 263,582 B (+39.7 kB; the brief budgeted
≤ 250 kB of new JS). `FlickeringGrid` chunk 1.25 kB gzip. `public.*` keys: 660 in
each of EN/ES/PT/HT. Desktop 1280×800: page 6,305 px, hero 1,199 px, one `h1`,
no horizontal overflow. Mobile 390×844: page 10,442 px, hero 1,962 px,
`scrollWidth` 390. Reduced motion: board A-042 at 0.4 s and still A-042 at 4.9 s
with zero running animations; marquee renders as a static wrapping row.
