# SaleUnion → Hazeberg: measured reference spec

Captured from `saleunion.webflow.io` at 1440px, computed styles rather than eyeballed.
The brief is to reproduce the layout, rhythm and motion exactly, in Hazeberg's brand.

Page height 12,126px · container **1296px** + 16px gutter · 140 IX2 animation nodes.

---

## Type — and the one substitution

| Role | SaleUnion | Hazeberg |
|---|---|---|
| H1 | Cambo serif · 76px / 76px · w400 · −0.04em | **Work Sans · 76px / 1.0 · w300 · −0.03em** |
| H2 | Cambo serif · 64px / 70.4px · w400 · −0.04em | Work Sans · 64px / 1.1 · w300 · −0.03em |
| H3 | Cambo serif · 54px / 59.4px · w400 · −0.03em | Work Sans · 54px / 1.1 · w300 · −0.03em |
| Section intro | Aspekta · 32px · w500 · −0.02em | Work Sans · 32px · w400 |
| Card title | Aspekta · 20px · w500 · −0.01em | Work Sans · 20px · w500 |
| Body | Aspekta · 16px / 22.4px · w400 | Work Sans · 16px / 1.4 · w400 |
| Eyebrow / button | **Geist Mono** · 14–16px · w500 · caps | **Work Sans · w600 · caps · 0.1em tracking** |

Two deliberate departures, both forced by locked decisions:

1. **No serif.** Work Sans only is locked. The reference gets its editorial weight from a
   serif at w400; we get it from Work Sans at **w300 with −0.03em tracking** at the same
   sizes. Large-and-light is the substitute for large-and-serif — going heavier is what
   would make it look like a template.
2. **No monospace.** The reference sets every eyebrow and button label in Geist Mono.
   Mono was rejected early in this project as a dev-tool tell. Work Sans 600 uppercase at
   0.1em tracking occupies the same slot.

---

## Colour translation

| SaleUnion | Hex | Hazeberg |
|---|---|---|
| Page ground | `#F8F7F7` | `--surface` `#F6F6F8` |
| Card ground | `#FFFFFF` | `--canvas` |
| Ink | `#161515` | `--ink` `#0B0B0C` |
| Muted body | `#555151` | `--ink-muted` `#55555B` |
| Subtle | `#B4B0B0` | `--ink-subtle` `#6F6F77` |
| Dark band (CTA, footer) | `#161515` | `--grad-ink` with grain |
| Mint chip | `#A4F7D2` | **yellow `#FEC00F`**, near-black type |
| Bright mint button | `#29F197` | **yellow `#FEC00F`** |
| Pink chip | `#F6CEF0` | **blue `#1972B9`**, white type |
| Neutral chip | `#EEEAEA` | `--surface-3` |

The reference spreads four pastels for variety. We have two brand colours, so variety
comes from **fill vs tint vs neutral** instead of from hue. Yellow never carries type on
a light ground (1.65:1); blue does (5.06:1).

---

## Radii

`100%` circles · `80px` pills · `32px` · `24px` (cards) · `20px` · `16px` · `12px`

Our scale already covers this: `--radius-md 12` / `lg 16` / `xl 20` / `2xl 28` / `pill`.
Card radius on this site is **24px** — sits between our `xl` and `2xl`; use `2xl`.

---

## Motion

IX2 reveals are authored as **`opacity: 0` → `1`** with a `translate3d` rise, staggered
per sibling card. Above-the-fold hero elements are revealed on load, not on scroll.
The logo marquee runs as a continuous `translate3d(-x%, 0, 0)`.

This maps onto the `Reveal` / `RevealGroup` / `RevealItem` primitives already in
`components/motion/` — no new animation engine needed. Nav dropdowns run `0.25s ease`.

---

## Section order and heights (1440px)

| # | Section | Height | Ground |
|---|---|---|---|
| 1 | Hero | 737 | surface |
| 2 | Logo marquee | — | surface |
| 3 | About us | 421 | surface |
| 4 | Impact | 1065 | surface |
| 5 | Services carousel | 841 | surface |
| 6 | Consulting result | 697 | surface |
| 7 | Case studies | 1673 | surface |
| 8 | Growth / stats | 620 | canvas |
| 9 | Engagement models | 1065 | canvas |
| 10 | Testimonials | 846 | surface |
| 11 | Why choose | 1238 | surface |
| 12 | FAQ | 792 | canvas |
| 13 | Insights | 625 | canvas |
| 14 | Final CTA | 613 | **ink** |
| 15 | Footer | 740 | **ink** |

Ground alternates surface → canvas → ink. No borders between sections; the ground change
*is* the separator.

---

## Hero anatomy

Two columns, roughly 45 / 48 with a gap.

**Left** — eyebrow caps · H1 on three lines · 16px muted lead · then one row holding a
dark pill button and, beside it, a 3-avatar overlap stack plus a caps trust label.

**Right** — image, radius 24px, with a **chamfered bottom-left corner**, and a white
testimonial card overlapping the bottom-right: 5 stars, an 18px w500 quote, name, role.

That chamfer is why `NotchCard` already exists in our component layer — the signature
shape is the same idea, so the hero reuses it rather than inventing a second one.

## Impact anatomy

Centred eyebrow → centred display → centred dark pill CTA. Below, two columns: a tall
media card (radius 24px) carrying a pastel tag chip top-left and a play control
bottom-right; beside it a white card holding a **2 × 2 feature grid** divided by
hairlines, each cell a 48px circular icon chip, a 20px title and muted body.
