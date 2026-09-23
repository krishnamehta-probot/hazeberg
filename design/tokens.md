# Hazeberg — Design Tokens (Phase 1 candidates)

Three candidate directions. **One will be selected**; the losing two get deleted and the
winner's table below becomes the single source of truth for every section thereafter.

All values below are **contrast-verified**: every ink/canvas, muted/canvas, primary/canvas,
label-on-button and focus-ring pair meets or exceeds WCAG 2.1 AA. See "Verification" at the end.

---

## Shared foundation (identical in all three directions)

These do not vary by direction — only colour and type do. Fixing them now is what makes
sections built weeks apart line up.

### Spacing scale (4px base)
`--s-1:4px` `--s-2:8px` `--s-3:12px` `--s-4:16px` `--s-5:20px` `--s-6:24px`
`--s-8:32px` `--s-10:40px` `--s-12:48px` `--s-16:64px` `--s-20:80px` `--s-24:96px` `--s-32:128px`

Section vertical rhythm: `--s-20` mobile, `--s-32` desktop. No arbitrary values — if a gap
isn't on this scale, it's a bug.

### Type scale (fluid, clamp-based)
| Token | Clamp | Use |
|---|---|---|
| `--t-xs` | 12px | Legal, captions |
| `--t-sm` | 14px | Meta, labels |
| `--t-base` | `clamp(15px, 0.95rem + 0.15vw, 17px)` | Body |
| `--t-lg` | `clamp(17px, 1rem + 0.4vw, 20px)` | Lead paragraph |
| `--t-xl` | `clamp(20px, 1.1rem + 0.7vw, 24px)` | Card titles |
| `--t-2xl` | `clamp(24px, 1.2rem + 1.2vw, 32px)` | H3 |
| `--t-3xl` | `clamp(28px, 1.3rem + 2vw, 40px)` | H2 |
| `--t-4xl` | `clamp(34px, 1.4rem + 3.2vw, 56px)` | H1 |
| `--t-5xl` | `clamp(40px, 1.5rem + 4.6vw, 72px)` | Hero display |

Body line-height 1.65. Heading line-height 1.1–1.2. Measure capped at `68ch`.

### Motion
`--ease: cubic-bezier(.2,.7,.3,1)` · fast 150ms · base 220ms · slow 380ms.
All motion wrapped in `@media (prefers-reduced-motion: reduce)` → animation/transition none.

### Breakpoints
`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

---

## Direction A — "Harbor"
*Evolution of the current identity. Enterprise, established, lowest risk.*
Radius `8px` · shadows soft and cool · Outfit headings + Inter body.

| Token | Light | Dark |
|---|---|---|
| `--canvas` | `#FFFFFF` | `#06182A` |
| `--surface` | `#F4F7FA` | `#0D2338` |
| `--ink` | `#0B2239` | `#E8F0F7` |
| `--ink-muted` | `#5B7183` | `#8CA3B8` |
| `--primary` | `#1A6FB5` | `#4A97D8` |
| `--primary-ink` | `#FFFFFF` | `#04121F` |
| `--accent` | `#F2A81D` | `#F2A81D` |
| `--accent-ink` | `#2A1C00` | `#2A1C00` |
| `--border` | `#CBD8E4` | `#1B3A54` |
| `--danger` | `#C62828` | `#FF8F8A` |

Derived from the live site's `#1972b9` and `#fec00f`. The amber is de-neoned; the blue
is deepened for AA compliance as body-copy link colour.

## Direction B — "Signal"
*Modern tech-consultancy. High contrast, product-grade, generous whitespace.*
Radius `10px` · near-flat, hairline borders over shadows · Geist + Geist Mono.

| Token | Light | Dark |
|---|---|---|
| `--canvas` | `#FFFFFF` | `#0A0A0B` |
| `--surface` | `#F6F7F9` | `#141417` |
| `--ink` | `#0A0A0B` | `#FAFAFA` |
| `--ink-muted` | `#687184` | `#9CA3AF` |
| `--primary` | `#1F5FE0` | `#5B8DEF` |
| `--primary-ink` | `#FFFFFF` | `#06101F` |
| `--accent` | `#00B3A4` | `#00B3A4` |
| `--accent-ink` | `#00201D` | `#00201D` |
| `--border` | `#D3D8E0` | `#26262B` |
| `--danger` | `#D32323` | `#F87171` |

Mono is used deliberately for stats, eyebrows and labels — it is what makes this
direction read as technical rather than generic-corporate.

## Direction C — "Atlas"
*Warm editorial. Blue as accent, not flood. The strongest "people-friendly" answer.*
Radius `6px` · rules and borders over shadows · Fraunces display + Inter body.

| Token | Light | Dark |
|---|---|---|
| `--canvas` | `#FBF9F5` | `#14130F` |
| `--surface` | `#F2EDE4` | `#1E1C17` |
| `--ink` | `#1C1A15` | `#F5F1E8` |
| `--ink-muted` | `#6E675A` | `#A39A88` |
| `--primary` | `#17548A` | `#5E9BD1` |
| `--primary-ink` | `#FFFFFF` | `#0A1520` |
| `--accent` | `#4A5D23` (olive) | `#A8BE6B` |
| `--accent-ink` | `#FFFFFF` | `#1A1F0B` |
| `--border` | `#D6CCBA` | `#2E2B23` |
| `--danger` | `#B3261E` | `#E89080` |

---

## The logo

`design/hazeberg-logo-source.svg` — recovered from the live site. Findings:

- **Monochrome**: a single `<g fill="#1972b9">` wrapping 12 paths. No multi-colour lockup.
- **Consequence**: it recolours freely via `fill: currentColor`. **No direction can clash
  with it** — the brand-fit risk identified at planning is resolved, and all three
  directions are viable.
- **Caveat**: it is a `potrace` auto-trace of a 130×34px raster, not a true vector original.
  Good enough to ship; a real vector from the designer is still worth requesting.
- Aspect ratio 300:78 (≈3.85:1), horizontal wordmark with a trailing period.

---

## Verification

Two layers, both re-runnable.

**1. Palette maths** — WCAG 2.1 relative-luminance contrast across 3 directions x 2 modes
x 10 pairs. Four failures were found and fixed during authoring rather than shipped:

| Was | Now | Why |
|---|---|---|
| Atlas accent `#C2603A` | `#4A5D23` | White on clay was 4.18:1, below AA. Also the single most over-used AI-design palette; olive is both compliant (7.29:1) and more distinctive. |
| Harbor border `#DCE5ED` | `#CBD8E4` | 1.27:1 - effectively invisible. Now 1.45:1. |
| Signal border `#E5E7EB` | `#D3D8E0` | 1.24:1 - invisible, and a default grey. Now 1.39:1 with a faint blue bias. |
| Atlas border `#E3DCD0` | `#D6CCBA` | 1.30:1 - marginal. Now 1.51:1. |

**2. Browser suite** — the showcase is driven in real Chrome (Playwright) and asserts:
contrast read back from rendered CSS; no horizontal overflow at 320/768/1024/1440/1920;
every interactive element has a >=44px *hit area* (measured by hit-testing, not by painted
height); all 6 direction/mode combinations produce a distinct canvas, proving no hardcoded
colour survives a switch; tab roving with arrow/Home/End keys; a visible focus ring; zero
external network requests; each direction s display face genuinely rendering rather than
silently falling back; and no mojibake.

Current status: **all checks passing**.

The showcase also recomputes contrast live from the rendered CSS and prints it on the page,
so the claim is checkable by anyone opening it rather than taken on trust.
