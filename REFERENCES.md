# Reference system

How every section from here on gets built: **you supply a reference, I measure it, we build.**
Nothing gets designed from my taste alone. This file is the running record.

---

## Round 2 direction (accepted)

Boss references: rootquotient.com · davidecattaneo.it/en · aspensearch.com · fmi-industries.com
Locked from round 1: Manrope + Space Mono · cool neutrals · blue leads, yellow is the CTA · Lenis smooth scroll

---

## Hero — art direction

Set by three reference frames supplied 2026-09-23 (blue chrome ribbons / backlit silhouette in
light rays / hand holding a glowing glass card).

### The rule those three share

Not "dark and blue" — that is the surface reading. The actual rule is:

1. **The human is anonymous.** A silhouette, a hand. No face, no eye contact, no smile.
   This is the single reason they do not read as stock. Every stock corporate frame sells you
   a person; these sell you a moment.
2. **The human is small.** Roughly 12–18% of frame height. The light is the subject; the
   person is scale reference.
3. **One light source, one colour.** Blue on near-black. No second hue anywhere.
4. **60%+ of the frame is empty.** Negative space is the composition, not leftover room.
5. **Volumetric, not lit.** Light is visible in the air — rays, bloom, specular streaks —
   not just falling on a surface.
6. **Grain.** All three carry visible film grain. It is what stops the render reading as CGI.

Anything that breaks 1 or 2 goes back to looking like the current hero.

### What got built

A shader, interactive — and then a second one, because the first was the wrong shape.

**v1 — radial light rays.** Close to reference frame 2, and wrong for this page: a starburst
puts its brightest point in the middle of the frame, which is exactly where a centred headline
wants to be. The type had to move out of the way of the picture.

**v2 — a horizon arc.** `src/components/motion/horizon-glow.tsx`. All the energy sits on one
curve low in the frame and the whole centre stays clear, which is what lets the copy be centred
and still read at 13:1. It is also the one place **both brand colours belong together** — the
ramp runs blue, through a near-white break, into amber. Two accents in one light source rather
than two accents competing.

Three things in it worth knowing:

- **The arc is a parabola, not a circle.** A circle's width and its depth are the same number, so
  the curve that reads as a horizon on a laptop closes into a narrow U on a phone. A parabola
  separates them, and both are then eased by aspect ratio.
- **It follows the pointer.** The hot spot on the rim tracks your x, halfway and clamped. The
  light is part of the composition, not a cursor toy.
- **It gives up cheaply.** `prefers-reduced-motion` draws one frame and stops; off-screen and
  hidden tabs cancel the loop; no WebGL leaves the same deep navy showing.

Yellow finally does what it could never do on white. `#FEC00F` is 1.65:1 on a white page, which
is why it has been a fill everywhere else. On this ground the accent half of the headline
measures **7.7–10.5:1** and carries real words.

**The silhouette slot is still open** — if you produce a cut-out figure it drops in over the
arc. The brief and prompts below still stand for that.

### If a figure or a flat image is ever wanted — the specs our layout needs

| | Desktop | Mobile |
|---|---|---|
| Size | **3840 × 2160** min | **1440 × 3120** min |
| Subject zone | Right 45%, upper two-thirds | Top 40% |
| Must stay empty | The centre — the copy lives there now | Middle 50% |
| Format | JPEG, flattened (or PNG with real alpha for a cut-out) | same |

**No accidental transparency.** The last PNGs carried a 167px transparent feather that showed as
a white border down the right edge. Flatten, or mean the alpha.

### Generation prompts

**Figure cut-out** (drops over the shader)
> Full-body silhouette of a single anonymous person standing, seen from behind at a distance,
> plain dark clothing, no face, no visible detail, pure black shape on a transparent background,
> sharp clean edges, full body from head to feet, centred, no shadow, no ground

**Desktop still** (only if the shader is ever ruled out)
> Cinematic wide shot, near-black studio void, a single anonymous human silhouette standing
> small in the right third, backlit by an intense electric blue volumetric light burst radiating
> outward, visible light rays in atmospheric haze, heavy negative space, deep blue and black
> only, fine film grain, 35mm, no face, no text, editorial, 16:9

---

## Client logos

Thirteen vectors supplied 2026-09-23. They live in the hero's own rail now — **the standalone
logo-wall section is gone**, per your call that the hero does not need a second section for it.

Two things were done to them, both of which matter if a file is ever replaced:

**Fills normalised.** Every painted fill forced to white. Every *dark* fill forced to `--void`
instead, because those are knockouts, not marks — painting them white too turned the UPS shield
into a blank slab and filled in the DocuSign tile. This is why the rail's band is fixed at
`--void` and is not a free colour choice.

**Sizes measured, not guessed.** Each file carries a different amount of empty space inside its
viewBox — Sandoz's wordmark fills 15% of its box height, Alcon's fills 100% — so one CSS height
gave thirteen different apparent sizes, and the first rail had marks at four times each other's
weight. `web/scripts/inkscale.mjs` renders each mark, measures its ink bounding box, and derives
the scale. **Re-run it if a logo is replaced; do not hand-tune the numbers.**

---

## Where to pull references from

| Source | Go straight to | Why this one |
|---|---|---|
| **godly.design** | `/websites/` and the **Hero** category in the top nav | Only gallery with a hero-specific feed — exactly what we need per section |
| **siteinspire.com** | Filter **Categories → Agencies & Consultancies** | Our actual vertical. Also **Minimal** and **Typographic** |
| **awwwards.com** | `/awwwards/collections/dark-mode/` and Sites of the Day | Best for motion — every entry has video |
| **reactbits.dev** | `Backgrounds` · `TextAnimations` | Not inspiration — shippable code. See table above |
| **HeroGrids** | Hero feed | Hero compositions only, at volume |

**How to send me one:** screenshot or URL + the one line of what you want from it
("this scroll", "this spacing", "just the colour"). I measure it in the browser — real numbers,
not eyeballing — then build. That is how the logo wall and services board got done.

---

## Structural consequence of a dark hero

The page is light throughout and the footer is already dark. A dark hero makes the page
**dark-bookended**, which is stronger structure, not weaker — but two things change:

1. **The header needs a dark-over-hero state**, flipping to the normal one once the hero passes.
2. **Yellow finally pays off.** `#FEC00F` is 1.65:1 on white — that is why it has been confined
   to a fill. On near-black it is **11.97:1**. A yellow CTA on a dark hero is the single
   highest-contrast element on the page, and it is our brand colour doing it.

Neither is a blocker. Both are mine to handle when the hero lands.

---

## Log

| Date | Section | Reference | Outcome |
|---|---|---|---|
| 2026-09-23 | Hero | 3 supplied frames (blue / silhouette / hand) | Art direction agreed |
| 2026-09-23 | Hero | — | Built: interactive WebGL light rays, headline + CTA, dark ground, header flips white over it |
| 2026-09-23 | Hero | Supplied comp (centred, horizon glow, yellow accent phrase) | **Rebuilt.** Parabolic blue-to-amber arc shader, centred copy, lead trimmed 27 → 19 words, white CTA, client rail moved into the hero |
| 2026-09-23 | Logos | 13 supplied SVGs | Normalised, ink-measured, rolling rail inside the hero. Standalone logo wall removed |
| 2026-09-23 | About | Your pinned-scene idea + the sphere reference | **Rebuilt as one pinned scene.** 280vh track, sticky pane; sphere is a second WebGL shader that turns with the scroll and carries one point at each of three checkpoints; progress arc above it. Desktop only — phones keep the plain list |
| 2026-09-23 | Footer | Agiloft reference | **Rebuilt:** mark and claim left, rule, four link columns right, offices, legal strip, and the name set huge at 3.5% white across the foot. No shader — the arc belongs to the panel above it |
| 2026-09-24 | Services | Shader pulled | The live ground added today is REMOVED; the section is back on its static `map-ground` / `bg-surface`. It never read as anything on a white section — every contrast reading pushed the pigment down until it was only there in the numbers |
| 2026-09-24 | Mobile | "keep everything which is there in desktop in mobile" | **About, Impact and Services now run their scenes on a phone.** The 1024px gate was there because a pinned frame fights a phone address bar — true of vh, not of svh, which is the height that does NOT change when the bar hides. What a phone needed was a smaller composition, not a different section |
| 2026-09-24 | Footer | Cut it back | Four columns to three. The six About in-page anchors are gone — a footer is a map of the site, not a copy of the nav — and Company plus More, which held one and two links between them, merged into one: About us, Berg, Contact. Services and What we do stay whole; those are the two things anyone is here to find. Phone and mail marks added to the two lines you can act on rather than navigate to. 29 links down to 22 |
| 2026-09-24 | Impact | Strands from the top on mobile | Narrow turned through ninety degrees: the four strands FALL from the top across the right half and land in a column down the left. Entry order matches endpoint order so none of them ever crosses another — the rule the whole picture rests on. The labels carry a scrim there: vertical strands and horizontal labels cannot both fit a 390px frame without meeting, and a label measured 2.90:1 over the lit hairline |
| 2026-09-24 | Impact | — | Narrow composition: the four dots come down the left edge of the upper half, labels sit beside them and wrap, copy takes the foot of the frame instead of the right half. A nowrap label centred on x=13% of 390px was half off the screen. Hover is a TAP there — attaching pointerenter/leave as well would open and close the card in one gesture |
| 2026-09-24 | Services | — | The picture panel was desktop-only, which left a phone with seven words and nothing happening. It runs everywhere; its description stays desktop-only because each row already carries its own |
| 2026-09-23 | Case studies | Drop the View pill, put the + there | **One control per card.** The + moved from floating over the photograph into the bar, where the View pill was — a pill that navigated away while sitting in the slot people reach for to open what they are looking at. Plus turns to cross by rotation, not by swapping glyphs. The photograph stays a pointer shortcut but is out of the tab order, so one card is one keyboard stop. The full study is now a text link at the foot of the open panel |
| 2026-09-23 | Buttons | The green | Blue and amber were being BLENDED — in the rim, the disc and the halo. Every sRGB path between them runs through grey-green. Rim now goes blue, white, amber, white, blue; the disc is blue only; the spill is blue only. Proved by switching the rim off and re-reading the same pixels: what is left is Chrome text antialiasing, identical with the rim gone |
| 2026-09-23 | Buttons | Inner glow | The face gloss is DELETED, not hidden — the ::after pseudo-element has no content at all |
| 2026-09-23 | Buttons | — | The arrow/plus disc is one rule (.disc-blue), not the same arbitrary value in three components. Deepened after measuring: the first stops put a white glyph at 2.98:1, right on the 3:1 line. Now 3.65:1 at the lightest point |
| 2026-09-23 | Buttons | Your four Figma frames + "no yellow CTAs" | **Amber fill removed from every CTA.** Black pill on white ground, white pill on the dark panels, header keeps its ghost state over the hero. The brand pair moved to the rim and to the arrow disc |
| 2026-09-23 | Buttons | "gradient border should be moving continuously" | Rim is a **rotating conic**, 7s, blue side and amber side. Needs the property registered as an <angle> — an unregistered custom property cannot be animated at all. Stops dead under reduced motion |
| 2026-09-23 | Impact | Move the eyebrow right | OUR IMPACT moved to the right gutter — the strands all draw from the left, so the label was sitting inside its own artwork |
| 2026-09-23 | Buttons | reactbits Specular Button, in amber + blue | **One specular treatment for every CTA on the site.** A 1px rim that always carries both brand colours, a white-hot core riding the pointer around it, a gloss on the face and a spill outside. Rest / hover / focus / press are ONE number (`--spec-on`) so they cannot drift apart. 11 buttons, one delegated listener |
| 2026-09-23 | Case studies | — | Found while measuring the above: a bare `grid` gave the card an IMPLICIT max-content column, so it came out **1201px wide inside a 390px phone** and put 831px of horizontal scroll on the whole document. `grid-cols-1` — 831px to 0 |
| 2026-09-23 | Closing CTA | Invert the circle | Arc **flipped to the top of the circle** — the hero opens on a horizon rising, the page closes under a dome coming down. Falloff swapped with it, or the glow lands on the copy |
| 2026-09-23 | Testimonials | Your card reference | Quote mark leads, alternating amber and blue; italic body; client first, role second, portrait right. Stars removed |
| 2026-09-23 | Closing CTA | — | Runs the hero's arc again, **interaction off**. The page is bookended by one shape |
| 2026-09-23 | Testimonials | — | Four PLACEHOLDER quotes added to fill the carousel. Flagged `placeholder: true` in the content — **must be replaced** |
| 2026-09-23 | Engagement models | Your box layout | **Three equal tabs over one panel**, on the same 7s timer as the services list. Copy left, photo right. Photos are COMP. 1083px to 869px |
| 2026-09-23 | Engagement models | — | Journey spine (superseded). Three stops on one line — Implement, Improve, Manage — drawn by the scroll, chosen by the pointer. Not pinned. 1083px to 902px |
| 2026-09-23 | Services | Ecosystem-blueprint brief + rotation notes | **Second view built.** Workday core with seven capabilities wiring themselves up, scroll-linked (not pinned), SVG on white. List view moved to click + a 7s rotation with a progress bar. A temporary switch between the two — **remove `ServicesSwitch` before launch** |
| 2026-09-23 | Services | Numbered-index reference | **Rebuilt as a sticky index.** Seven numbered rows; hover or focus swaps the photograph and description in a column that sticks. 1377px to 888px on a laptop, and no pin — Impact above and Results below are both pinned already |
| 2026-09-23 | Home | Page too long | **Why choose Hazeberg** and **FAQ** removed. 18.3 screens to 15.5 on a laptop, 11 sections to 9. Copy parked in `home-content.ts`, not deleted |
| 2026-09-23 | Impact | Converging-strands reference + your hover idea | **Built as a pinned scene on a dark ground.** Four SVG strands draw in, hold, then converge on one point; each label carries a figure and opens its full card on hover or focus; the outcome and CTA arrive at the meeting point. Desktop only |
| 2026-09-23 | About | Ring + copy size notes | Ring split into three brand-gradient segments on even thirds, closing exactly as the pin releases; left column scaled up on lg |
| 2026-09-23 | About | Your copy rewrite + ideas 1-3 | Number pulled out to lead and count up; paragraph fills in with the scroll; the filled mark follows the reader, hover overrides. Icons switched to CSS masks so the supplied artwork works in both states untouched |
| 2026-09-23 | Hero | Interactivity + mobile circle + CTA clash | Arc rebuilt as a true circle (radius tied to width, lower half only); four pointer interactions added; copy biased upward so the button clears the glow |
| 2026-09-23 | Hero | Your three fixes | Rail label moved left of the rail at lg; portrait curve flattened to a real horizon; the scroll-shrink frame removed, which is also what was making the arc flicker |
