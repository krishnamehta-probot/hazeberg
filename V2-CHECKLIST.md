# Home v2 — the comp build, and the checklist for it

A **second version of the home page only**, at `/v2`, built to the supplied
full-page design comp. The existing home page at `/` is untouched.

Per project rule 4, verification is yours; this is the checklist, plus the
numbers the automated pass returns so you know what it should say.

---

## What was built

Ten bands, in the comp's order:

| # | Band | What it is |
|---|---|---|
| 1 | Hero | Copy left, photograph right, testimonial card overlapping its foot |
| 2 | Client strip | Thirteen marks on a slow rail that pauses under the pointer |
| 3 | About | A centred statement over three points on one hairline row |
| 4 | Impact | Centred head and button, photograph, a 2×2 divided panel |
| 5 | Services | The seven, as a full-bleed gallery. **Equal-size cards**; the frosted panel inside the active one expands |
| 6 | Consulting results | Four figures as **one joined strip** — amber gradient, white, blue gradient, white |
| 7 | Our work | Three engagements, one open and filled blue with chips |
| 8 | Engagement models | Three cards on grey, the middle one filled amber |
| 9 | Testimonials | The two approved quotes |
| 10 | Closing | Full-bleed photograph under the call to action |

Then the near-black footer: lockup, three link columns, both offices, phone
and email, legal strip.

### Brand

Locked palette only. White ground, cool neutrals, `#1972B9` leading,
`#FEC00F` as fill. Manrope throughout with Space Mono at micro-label scale,
which is the locked typeface decision.

Yellow carries a word in exactly one place — the footer's "that stays
engaged" — because that is the page's only dark surface, where it measures
11.26:1. Everywhere on the white page it is a fill with near-black on it
(9.59:1 at the gradient's darkest stop), never type (1.65:1).

The one departure from the site's display rule: the hero headline is weight
600. The site's rule is large-and-light, and the comp's hero is visibly the
heaviest type on its page. Every heading below it goes back to weight 400.

### Motion

One vocabulary, applied consistently rather than a set of effects:

- everything arrives **24px up**, fading, at one trigger line (a fifth of the
  way up the viewport) — v1's is 64px, which makes a dense card grid fly
- rows and grids **stagger by 70ms**
- the four figures **count up** on arrival
- three photographs **drift on scroll** — hero 40px, impact ±4%, closing ±7%
- hover: cards lift 4px, arrows travel out-and-in, service photos scale 1.04
- the services gallery **expands the panel inside** the card under the pointer,
  50px → 194px, while every card stays 300×360px
- **nothing pins and nothing hijacks the scroll.** Every effect above is
  dropped by `prefers-reduced-motion`

### Architecture

v2 is a separate tree: `src/app/v2/`, `src/components/v2/`, `src/lib/v2/`.
No component and no content module is shared with v1, so the two can change
independently. Two deliberate exceptions:

- the **brand wordmark**, which is the logo
- `CONTACT` and `OFFICES` from `lib/navigation.ts`, used by v2's footer.
  Those are facts about the company, and the site already treats that file as
  their single source of truth — a second copy of a phone number is how one
  of them goes out of date

Outside its own tree v2 touches exactly one file: the root layout, which
gained two `<ChromeGate>` wrappers so the site header and footer switch off
under `/v2`.

### New: the light logo set

Every supplied mark in `public/clients/` is painted white — they were
normalised for v1's near-black hero band — so on a white page the whole strip
renders as nothing. `scripts/logos-light.mjs` generates
`public/clients-light/` with the two roles swapped: the mark becomes
`#14181A`, and the knockouts in UPS and DocuSign become white.

A CSS filter cannot substitute. `brightness-0` flattens the mark *and* its
knockouts to the same black, which fills in the UPS shield and the DocuSign
tile.

```
npm run logos:light        # re-run after replacing any mark
```

---

## Second pass — what changed after your screenshots

**Services gallery.** The cards no longer resize. Every card is 300×360px at
rest *and* under the pointer; what opens is the frosted panel inside the
active one, 50px → 194px. The first cut widened the active card from 176px to
448px, which re-laid-out the whole rail on every pointer move — cards to the
right slid sideways under the cursor and the reading position jumped with
them. The number badge moved to the left, above the panel, and rides upward
as the panel grows. Badges now alternate **amber, blue, amber, blue** down the
row, which is the comp's rhythm.

**Consulting results.** The four figures are one joined strip — no gaps, no
per-cell radius, no per-cell shadow, four cells butted together inside a
single rounded bordered box with 1px hairlines between them. The heading is
also one block again: both sentences at the same size, weight and colour, with
the button beside their foot. The first cut set the second sentence as 14px
muted body, which broke the comp's proportion — that sentence is part of the
statement, not a footnote to it.

**Colour and mood.** The filled surfaces are the client's own gradients rather
than flat brand colour:

- amber `linear-gradient(135deg, #FFD34D, #FEC00F, #F1B403)` — the
  `--grad-cta` stops
- blue `linear-gradient(135deg, #1972B9, #1685DD, #008EFF)` under a 20% black
  veil — the `--grad-primary` stops

The veil is not cosmetic. White on #008EFF is 3.36:1, which clears the bar for
a 44px figure and fails it for the 12px sentence underneath, and these cells
carry both. The veil lifts the worst point to 4.91:1 while the cell still
reads as the client's blue.

Two bands that were plain white — Services and Consulting results — now carry
`.v2-tint`: a cool wash climbing out of the bottom left and a warm one off the
top right, both peaking at 6% and gone long before any column of type. The
page now runs washed → white → tinted → tinted → white → grey rather than
white all the way down to the grey half.

---

## Third pass — copy source, and two broken sections

### Copy now comes from `home-content.ts`, not a second copy of it

`lib/v2/content.ts` **no longer restates a single line of copy.** It imports
every string from `lib/home-content.ts` — the module the main home page
renders from — and holds only what is genuinely v2's: which photograph a card
uses, which cell is filled, which engagement opens first.

That was the root of "the content feels old". v2 had its own transcription of
the copy, and `home-content.ts` had moved on substantially since:

| | v2 was showing | `home-content.ts` now says |
|---|---|---|
| Hero lead | the untrimmed 27-word original | the trimmed version |
| About | a paragraph transcribed off the comp | the current body, **12+** years, and a **fourth** point ("Enterprise-Ready Integrations") |
| Impact cards | 40% / 30% / 100% / $500K with sources | 80%+ / <30 sec / Weekly / 100%, no sources |
| Consulting results | four counters | the figures moved **into the heading**; the cells are now four capabilities |
| Use cases | comp-transcribed titles, `tag`/`client`/`did`/`outcomes` | the same titles, with `challenge`/`approach`/`impact`/`capabilities` |

All of that now tracks automatically. Change the copy in one place and both
versions move together — the same argument that already governs `CONTACT` and
`OFFICES`.

Three consequences worth knowing:

- **The results band no longer counts anything.** Its big figure is the item's
  index (01–04), because the client moved 20+ / 200+ / 40+ / 100% up into the
  heading. The comp's strip survived the change untouched.
- **The About band has four points against three supplied marks.** The fourth
  gets a drawn glyph — `home-content.ts` deliberately leaves its `icon` off
  rather than reusing a client file, and v2 honours that.
- **No client name on the use-case cards.** The revised copy describes the
  engagements without naming who they were for, so nothing was put back.

### Use cases — the close button, and the dead CTA

Both reported, both fixed:

- **The × could not close.** It rotates from a + to an × on the open card, so
  it promises to close — and it was wired to `setOpen(i)`, the index it was
  already on, which does nothing. It now toggles to a real "all closed" state.
  The `onFocus` handler is gone too: focus-to-open and click-to-toggle fight
  each other, and with both wired a card could never be opened by clicking.
- **"View case study" is removed.** There is no case-study page —
  `home-content.ts` says so itself — and a link that goes nowhere is worse on
  a proof section than no link. The section now has **zero** links out of it,
  which the automated pass asserts.

### Consulting results — the layout fault

Two bugs, both measured:

- **The heading column was rendering at 455px and breaking into seven lines,**
  with the button stranded across a ~500px void. Cause: `max-w-[44ch]` on a
  wrapper whose own font-size was the inherited 14px, not the 34px heading
  inside it — so `ch` resolved to less than half the intended measure. It is
  now an explicit `rem` cap on a `flex-1` column: **832px, three lines, a
  172–212px gap to the button**, stable from 1280px to 1900px.
- **The cells bottom-aligned their body copy,** so a one-line sentence and a
  three-line sentence started at different heights and the row read as
  ragged. Now top-aligned with a fixed gap under the rule, and the figure row
  has a 60px floor: **rule tops and body tops both measure a spread of 0px
  across all four cells.**

---

## Fourth pass — one scale, one rhythm, one column

You flagged misalignment. An audit of the built page found it was systemic
rather than two spots, so the fix is a definition rather than a patch.

**What was actually wrong**

| Fault | Measured |
|---|---|
| Three sizes doing one job | section heads at **44px** on five bands, **34px** on Consulting results, **48px** on Closing |
| One band with no top padding | Impact at **0px**; every other band at 104px |
| An orphan row in About | **4 points in a 3-column grid.** `lg:first:pl-0` matches the first item in the LIST, not the first in each row — so the wrapped item kept its 32px left padding and its icon sat 32px right of the icon above it. `divide-x` (`& > * + *`) had the mirror problem: the orphan drew a rule with nothing to its left |

Both About bugs are the same bug — per-ROW rules written as per-ITEM rules.

**The fix**

`v2.css` now defines the scale once and the components name it:

```
.v2-h1       the hero, and only the hero          weight 600
.v2-h2       EVERY section head, closing included weight 400
.v2-lede     the About statement
.v2-figure   every large number
.v2-section  the only vertical padding any band uses
```

Each of those was previously a `clamp()` retyped into a component, and
retyped values drift. About went to four columns with the icon stacked above
the text, so every cell has the same measure and there is no second row to
misalign.

**Now measured, and checked on every run** (check 11):

```
content column   left 92px, right 1348px across all 10 bands
heading size     44px, one value
vertical padding 104/104 on every band
                 hero 156/104 — clears the fixed header, named exception
                 services 104/0 — splits across two shells, named exception
about points     4 items, 1 row, column edges 92 / 416 / 740 / 1064
impact cards     4 items, 2 rows, 2 per row
capability cells 4 items, 1 row, 93 / 407 / 721 / 1034
use cases        3 items, 1 row, 92 / 517 / 943
models           3 items, 1 row, 92 / 517 / 943
```

The grid check fails on any orphan row and on uneven column spacing, so a
fifth About point cannot ship as a 4+1 again. Engagement cards are `<article>`
now, matching the other two card rows.

---

## Copy status

Every string is the client's. Provenance is marked inline in
`web/src/lib/v2/content.ts` as `[doc]` (the copy document, verbatim),
`[comp]` (legible in the comp, treated as supplied) or `[?]` (not legible —
see below).

### Needs your sign-off

Now that v2 renders the main home page's copy, its sign-off list is the main
home page's list — there is no separate v2 wording to approve. What is still
outstanding and specific to v2:

1. **The DPIIT line.** The comp's bottom-left footer line reads as a
   government recognition. It is not in the copy document and the comp is not
   legible enough to transcribe it exactly, so **it is not printed**. Send the
   wording verbatim and it goes in.
2. **The figures**, as ever — your own note on the source document says to
   confirm each against approved documentation.

### Deliberately not carried over from the comp

- **The avatar cluster** beside "trusted by" is three real client marks in
  discs, not stock faces. Stock photos of people next to a trust claim would
  be the one invented thing on the page.
- **The four figures on the Impact cards.** The comp shows title and body
  only, and that is what was built — v1 prints 40% / 30% / 100% / $500K there,
  three of which come from a single engagement and all of which are awaiting
  the confirmation above.

### Still comp imagery

`/comp/*` and `/services/*` are placeholders carried over from v1 and are
replaced before launch per rule 8. The hero and impact photographs are
client-supplied.

`/v2` is marked `noindex` — two home pages in a search index is a duplicate a
crawler resolves by picking the wrong one.

---

## Run the automated pass

```
cd web
npm run build
npx next start -p 3125
npm run qa:v2                 # or V2_BASE=http://localhost:3000 npm run qa:v2
```

It exits non-zero on any failure. Current result: **all checks passed.**

| # | Check | Result |
|---|---|---|
| 1 | Horizontal overflow at 390 / 768 / 1280 / 1440 / 1600 | scrollWidth == clientWidth, 5/5 |
| 2 | Assets | 0 failed requests, 0 console errors, 0 images that fail to decode |
| 3 | Inventory | 13 marks ×2 + 3 hero, 4 about points, 4 impact, 7 services, 4 capability cells, 3 cases, 2 quotes |
| 4 | Services gallery | 7 cards all 300×360px at rest **and under the pointer**; panel 50px → 194px; badges alternate amber/blue; arrows page the rail |
| 4b | Results strip | cells joined (1px hairlines), no per-cell radius or shadow, all four on one row; rule and body tops spread 0px |
| 5 | Use cases | exactly one open at a time; opens the third; the × genuinely closes; **zero links out of the section** |
| 6 | Counters | the page's one counter (About, 12+) — visible figure == announced figure |
| 7 | Contrast | 17 samples, **lowest 4.91:1** — measured at each gradient's worst stop, not its base colour |
| 8 | Chrome gate | one header and one footer on both routes, v2's on `/v2`, v1's on `/` |
| 9 | Footer facts | all three offices, `tel:+919042200899`, `mailto:connect@hazebergconsulting.com` |
| 10 | Reduced motion | 0 text nodes stuck under 50% opacity |
| 11 | Alignment | one content column, one heading size, one rhythm, no orphan rows |

Contrast, measured against each element's own ground:

```
hero h1             #14181A on white          17.87:1
hero lead           #565F64 on white           6.53:1
about statement     #14181A on white          17.87:1
impact card body    #565F64 on white           6.53:1
use case title      #14181A on white          17.87:1
model title         #14181A on #F6F7F8        16.66:1
quote               #14181A on #F6F7F8        16.66:1
amber stat body     #14181A on #F1B403         9.59:1   (amber gradient's darkest stop)
blue stat body      #FFFFFF on rgb(0,114,204)  4.91:1   (blue gradient's lightest stop, under its veil)
open case outcome   #FFFFFF on rgb(0,114,204)  4.91:1
footer legal        #9AA5AA on #101416         7.35:1
footer accent       #FEC00F on #101416        11.26:1
closing h2          #FFFFFF through the scrim  6.83:1  (worst case: a pure white photo)
```

Three defects the pass caught and that are fixed:

- **Ten of thirteen client marks never decoded.** They sit outside the
  viewport *horizontally*, inside a rail 90 seconds from bringing them on
  screen, so the browser's lazy heuristic never fired and they popped in one
  at a time as the rail travelled. `loading="lazy"` removed from the strip.
- **Authored line breaks concatenated words in the text layer.** A `<br>`
  breaks the line visually but contributes nothing to `textContent`, so
  headings copied and searched as "bottlenecks.Stronger". A space now precedes
  every authored break.
- **The contrast pass was measuring the filled cells against their base
  colour, not their gradient.** Once the cells became gradients, the base
  `background-color` is only a fallback — the type has to clear the bar at the
  gradient's worst stop. The check now pins those two stops explicitly
  (`#F1B403` for amber, `rgb(0,114,204)` for the veiled blue) and re-measures
  against them. Both still hold: 9.59:1 and 4.91:1.

---

## What to check by hand

The pass cannot judge any of this.

**Header**
- [ ] The bar floats clear of every edge and gains a shadow, not a border, on scroll
- [ ] Services (the only dropdown since 2026-09-30) opens on hover and on click; Escape closes it
- [ ] The pointer can cross the gap from the chevron into the panel without it closing
- [ ] Below 1024px the drawer opens, the page behind it does not scroll

**Hero**
- [ ] The headline breaks after "expertise." at every width
- [ ] The photograph runs past the right edge of the content column on a wide screen
- [ ] The testimonial card overlaps the photograph on desktop and sits below it on a phone
- [ ] Scroll slowly: the photograph drifts, the copy does not

**Client strip**
- [ ] All thirteen marks are visible and evenly weighted — none twice the size of its neighbours
- [ ] The rail pauses when the pointer is on it
- [ ] The UPS shield and the DocuSign tile are not solid black blocks

**Consulting results**
- [ ] The four cells read as one strip, not four tiles — no gaps, no shadows between them
- [ ] The heading fills its column and does not strand the button across a void
- [ ] All four rules and all four sentences sit on the same line
- [ ] The amber and blue cells are visibly graded, not flat

**Use cases**
- [ ] The × on the open card actually closes it, and all three can be closed
- [ ] Nothing in the section links anywhere — there is no case-study page

**Impact**
- [ ] The 2×2 panel reads as one divided box, not four cards
- [ ] Hairlines stay 1px and do not double where cells meet

**Services**
- [ ] Sweeping the pointer across the row opens each card's panel in turn
- [ ] **The cards themselves never change size** — nothing slides sideways under the cursor
- [ ] The badge rides up as the panel grows, and the tones alternate amber/blue
- [ ] The open panel shows its sentence and its Explore button
- [ ] The arrows page the rail and disable at both ends
- [ ] On a phone it swipes and snaps

**Our work**
- [ ] The third card is open on arrival; clicking another opens that one instead
- [ ] The open card is blue with white text and shows its chips
- [ ] Tab through it: each card header is one focus stop

**Engagement / Testimonials**
- [ ] The grey band groups these two as the page's quieter half
- [ ] The middle model card is amber and reads as the recommended path
- [ ] The three model cards line their "Get a proposal" links up despite different body lengths

**Closing / Footer**
- [ ] White type is comfortable over the photograph at every width
- [ ] The phone number and email are correct and clickable
- [ ] Both office lines are right

**Everywhere**
- [ ] Every band's content starts on the same left edge
- [ ] Every section heading is the same size
- [ ] No row of cards leaves an orphan on a line of its own
- [ ] Nothing flies; blocks settle
- [ ] `/` still looks and behaves exactly as it did

---

## Open questions

1. **Is the comp reproduced closely enough**, and where does it differ in a
   way you do not want? The four deliberate departures are listed above.
2. **Does v2 replace v1, or stay a second page** for comparison?
3. **The DPIIT line** — send the wording and it goes in the footer.
