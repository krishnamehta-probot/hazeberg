# Hazeberg Website — Project Rules

Living document. Amended as the project grows; nothing here is final except the
"Locked decisions" table, which changes only by explicit agreement.

---

## Locked decisions

| Decision | Choice | Settled |
|---|---|---|
| Company name spelling | **Hazeberg** (matches domain and all existing collateral) | Phase 1 |
| Brand scope | Keep the existing logo; evolve the palette around it | Phase 1 |
| Framework | Next.js (App Router) + TypeScript | Phase 1 |
| CMS | Sanity | Phase 1 |
| Component library | shadcn/ui (Radix primitives + Tailwind v4) | Phase 1 |
| Icons | Lucide | Phase 1 |
| Animation | Motion | Phase 1 |
| Fonts | `next/font`, self-hosted — never a Google Fonts network request | Phase 1 |
| Typeface | **Manrope** (all copy) + **Space Mono** (micro-labels only) | Phase 3 |
| Neutrals | **Cool**, not warm - `#F4F6F6` / `#14181A` / `#4F585C`. Warm greys are what made it read as a different family of site | Phase 3 |
| Accent discipline | **Blue leads.** Yellow is the call to action and nothing else | Phase 3 |
| Motion | **Animation-first.** Lenis smooth scroll site-wide; subtle scroll-linked movement throughout | Phase 3 |
| References (round 2) | rootquotient.com, davidecattaneo.it, aspensearch.com, fmi-industries.com | Phase 3 |
| Logo | Live-site wordmark is canonical; the board 01 / board 03 lockups are rejected | Phase 1 |
| Direction deliverable | Art-directed moodboard, not a token/component spec sheet | Phase 1 |
| Palette roles | **Primary `#FFFFFF`** (ground) / **Secondary `#1972B9`** / **Accent `#FEC00F`** - per the client's moodboard | Phase 1 |
| Yellow | Fills only, never text (1.65:1 on white). Near-black on yellow reads 11.3:1 | Phase 1 |
| Blue | Carries every interactive and readable accent: links, pills, focus rings | Phase 1 |
| References | **rootquotient.com** — the design system is now built directly against it: 80px/84px display at weight 400, 47px at weight 300, 14px body, 12/20px radii, 1320px container, reveal-on-scroll | Phase 1, rebuilt Phase 2 |
| Design references | Client supplies templates and references; no guessing from my side | Phase 1 |
| Sitemap | Supplied 2026-09-17. 13 pages - see `SITEMAP.md`, the structural source of truth | Phase 2 |
| Verification | Client runs the tests; I supply the checklist | Phase 2 |
| Theme | **Light.** `color-scheme: light` pinned. The system was cut against rootquotient.com (a black site) and then converted; the conversion is not an inversion — saturated gradient panels keep white type via `--on-panel`, and yellow reverts to fill-only (1.65:1 as type on white) | Phase 2 |

---

## In exploration — NOT settled

Everything in this section is a working hypothesis built to be looked at and
argued with. It is deliberately outside the locked table. None of it survives
contact with a decision to go another way, and no later work should treat it as
a constraint.

| Hypothesis | Where it stands |
|---|---|
| Tinted page ground `#E9F2FC`, content floating as white cards inset by `--frame` | Built. Departs from the locked "Primary #FFFFFF (ground)" row — white is currently the *card* surface |
| **The notch** — a 28px-radius card with a bite carved out of one corner by a CSS mask, inner corner filleted, a block seated in the bite | Built and working. **No reference template uses anything like it** |
| Corner radius 28px on cards | Built. **Measured against the references, this is fine** — see the table below. An earlier note here claimed they sat at 4-12px; that came from a text summary, not measurement, and was wrong |
| Buttons as a pill carrying a square accent chip | Built |
| Nav collapsed to a glass pill over hero artwork, expanding on click and auto-expanding off the artwork | Built. **All four references use a conventional always-visible header** |

### The four reference templates (client-supplied)

| Template | Category | What it is doing |
|---|---|---|
| [SaleUnion](https://saleunion.webflow.io/) | Consultancy / agency | Aspekta + Geist Mono + Cambo. Radii 8/12/16/20/24/32/60/80px. **482 interaction events, 52 action lists, 140 animated elements** — by far the most animated of the four. Numbered services "01 /", counters, logo carousel |
| [CropIntel](https://cropintel.webflow.io/) | Agri-tech services | Inter. Radii 10px and 32px. **No Webflow interactions at all** — whatever motion it has is CSS |
| [Ekhane](https://ekhane.webflow.io/) | Investment / finance | Poppins. Radii 4/6/8px dominate, 16/24px occasionally — genuinely the sharpest of the four. 235 events, 59 action lists |
| [Pipely](https://pipely.webflow.io/) | Consulting | Inter. **16px dominates**, then 20/24px. 152 events, 32 action lists |

Radii measured directly from the rendered pages (elements over 80x40px, most
frequent first), not read off a description. Three of the four sit in the
12-32px band; only Ekhane is sharp. Our 28px is inside the reference range.

**What all four share:** a repeatable section anatomy — hero, client logo wall,
metrics counters, numbered services, case studies, FAQ, blog, closing CTA.
That rhythm is most of what makes them feel finished.

**Status:** the home page now reproduces CropIntel's anatomy in full (12
sections), on client instruction. Its motion was measured rather than guessed:
every reveal fires at `top 80%` from `opacity 0, translateY(64px)`, which is
the single rule behind all 42 of its scroll triggers. One swap — its
testimonial carousel became Hazeberg's three real case studies, since those
exist and testimonials do not.

**What all four have that the sitemap does not:** case studies and a blog as
first-class sections. Hazeberg already has three real case studies on the live
site, and they are the strongest proof it owns.

---

## The rules

### 1. One source of truth for style
Once a direction is chosen, its tokens live in a single Tailwind v4 `@theme` block
derived from `design/tokens.md`. Every colour, space, radius and font size in the site
resolves to a token.

**Never** write a raw hex, a one-off `px` gap, or an arbitrary font size in a component.
If a value you need isn't in the scale, that's a conversation about extending the scale,
not a licence to hardcode.

*Why:* it is the only thing that makes sections built weeks apart look like one site,
and the only way a restyle stays a one-file change.

### 2. Section-by-section, with a gate
Build one section at a time. A section is not "done" and the next does not start until
its Definition of Done (below) is met and you have signed it off.

### 3. Shared elements are built once
Anything appearing in two or more sections — buttons, cards, nav, footer, form controls,
stat blocks, section headers — goes in the shared component layer the first time it is
needed, and is *reused* thereafter, never re-implemented. Additions are recorded in the
Shared Component Register below.

*Why:* this is the concrete mechanism behind "seamless between sections". Two
near-identical cards written twice will drift apart; one card used twice cannot.

### 4. Test cases accompany every section; the client runs them
Each section ships with its own written checklist covering the Definition of Done. No
section is signed off on "it looks fine".

**Verification is the client's, not mine.** I write the checklist; they execute it. When
they say no screenshots or no test run, I do not take them. Screenshots remain fair game
for the things they are actually for - reading a reference site, inspecting a supplied
template - and for my own working process.

### 5. Content is supplied, not invented
Real copy comes from the client. Placeholders are explicitly marked as placeholder and
tracked — never quietly shipped as if final.

### 6. Yellow is a fill, never type
`#FEC00F` measures 1.65:1 against white — unreadable as text. It is only ever a
background: a button fill, a marker behind a word, a caption block, a tinted band, and
always with near-black (`#14130C`) on top, which reads 11.3:1. Blue carries anything
that must be read as text. On a dark ground yellow reaches 11.97:1 and may be used as
type there.

### 7. Accessibility is a gate, not a polish pass
AA contrast, keyboard operability and visible focus are acceptance criteria. A section
failing them is unfinished, not "to be revisited".

**One colour was added to the system for this**, and it is the only non-brand, non-neutral
value in it: `--danger: #B3261E`, 6.06:1 on white, for invalid form fields. Neither brand
colour can do the job — amber is 1.65:1 as type here and is the call to action, and blue
is every other interactive state on the page, so a blue error is indistinguishable from a
focus ring. It is UI only: never photography, never a panel, never a second accent. Error
state is never carried by colour alone — the message is text, `role="alert"`, and tied to
the control by `aria-describedby`.

### 8. Photography: bright, western, editorial, one dark note
Settled on the moodboard and binding for every section.

- **Bright daylight is the default.** At most one dark or night frame per page, and it
  earns its place by being warm (amber/tungsten), which rhymes with the accent.
- **No eye contact.** Nobody looks at the lens. This single rule does more than any
  camera setting to keep the set editorial rather than stock.
- **No renders.** Photographs only. One CGI frame among six photographs makes the whole
  page read as AI-assembled.
- **The palette colours the page; the photographs stay neutral.** If the imagery is
  already saturated blue, the brand blue stops functioning as an accent. Off-palette
  colour (red, rust, lush green) is out.
- **Buy the set, not the frame.** People shots come from one photographer's series, so
  the lighting agrees. Seven images picked individually will never match.
- Search discipline: never the words *business / corporate / teamwork / professional /
  success / collaboration*; sort Envato by Newest, not Popular; exclude AI on Freepik.

### 9. Specified means specified - but silence means decide
Design direction, feedback and references are implemented as given, on the first pass.
Not approximated, not "close enough", not a starting point to be corrected in review.

Where no direction has been given, **I decide and state the call** rather than stopping to
ask. Questions are reserved for decisions that are expensive to reverse: information
architecture, the stack, anything the client has already seen. Everything inside the
locked design system - layout, composition, motion, component form - is mine to take.

If direction is self-contradicting, I pick the reading that loses least, say which
reading I took, and keep moving. If direction is a mistake, I flag it in one sentence and
build it as specified anyway.

*Why:* a review round spent restating direction already given is a round spent on
nothing, and a turn spent asking about a two-line reversible change is worse.

### 10. Operating mode: design-led, no client checkpoints
Set 2026-09-17.

- **Design is the deliverable.** The client judges this on how it looks. Nothing is shown
  to them until it is ready, so there are no approval gates to pace the work against.
- **Creative freedom inside the locked system.** Palette, Work Sans, and the photography
  direction are fixed. Everything else - composition, motion, section form, the ambition
  level - is open, and the instruction is to push it rather than play safe.
- **Engineering quality still counts**, because this is a portfolio piece and the
  developed version is the real artefact. Accessibility, responsiveness and clean
  component structure stay non-negotiable even though no client will test them.
- **Design happens in code.** The built version is the final one, so the fastest route is
  to design directly in the real medium rather than mock and then rebuild.

---

## Definition of Done — every section

- [ ] Uses only design tokens — zero hardcoded colours or off-scale spacing
- [ ] Renders correctly at 320 / 768 / 1024 / 1440 / 1920px
- [ ] No horizontal body scroll; wide content scrolls inside its own container
- [ ] Light verified (there is no dark mode; the QA suite asserts none creeps back in)
- [ ] Text contrast >= 4.5:1 (>= 3:1 for large display text), measured not assumed
- [ ] Interactive elements have a >= 44px hit area
- [ ] Fully keyboard operable, with a visible `:focus-visible` ring
- [ ] Interactive states present: hover, focus, active, disabled
- [ ] Honours `prefers-reduced-motion`
- [ ] Images via `next/image`, correctly sized, with real `alt` text
- [ ] Editable fields are wired to Sanity — no copy baked into JSX
- [ ] Shared components reused, not re-implemented; register updated
- [ ] Section test checklist written and passing

---

## Shared Component Register

Populated as components are built. Before writing any new component, check here first.

| Component | Used by | Status |
|---|---|---|
| Button (primary/secondary/ghost/accent, 3 sizes) | nav, hero, cards, forms | prototyped in showcase |
| `Section` / `Eyebrow` / `SectionHead` (`components/ui/section.tsx`) | every section, every page | **built** — moved out of `sections/home.tsx` when Contact and Careers needed them. `SectionHead` gained `align`: the home page stays centred, inner pages lead left |
| Card / service card | services, insights | prototyped in showcase |
| Stat block | hero, about | prototyped in showcase |
| `TextField` / `TextareaField` / `SelectField` (`components/ui/field.tsx`) | contact form | **built** — one box, three controls, error state wired with `aria-invalid` + `aria-describedby`, native `<select>` kept on purpose |
| Accordion | FAQ, services | prototyped in showcase |
| Tabs | services | prototyped in showcase |
| Badge / pill | various | prototyped in showcase |
| Site nav (`components/site-header/`) | global | **built** — collapsing pill, mega panel, mobile drawer, 36-check QA suite |
| `NotchCard` (`components/ui/`) | every major block | **built** — the signature shape |
| `Reveal` / `RevealGroup` / `RevealItem` (`components/motion/`) | every section | **built** — the one scroll reveal, ported from CropIntel's measured values |
| `CtaPill` / `CtaButton` / `CtaMail` (`components/ui/cta-pill.tsx`) | every CTA on the site | **built** — one pill, three elements. A link navigates, a `<button type="submit">` submits the contact form, an `<a href="mailto:">` opens a mail client and carries an envelope instead of the arrow |
| `Counter`, `Eyebrow`, `MediaPlaceholder` (`components/ui/`) | many | **built** |
| `ChipButton` (`components/ui/`) | every CTA | **built** — 4 tones, all AA-verified |
| Logo wordmark (`components/brand/`) | nav, footer | **built** — inline SVG, `currentColor` |
| `LinkedInMark` (`components/brand/linkedin-mark.tsx`) | footer, contact | **built** — was private to the footer until Contact needed it |
| `PageHero` (`components/page/page-hero.tsx`) | contact, careers, and every inner page after them | **built** — the short dark opener: the hero's arc at a third the height, left-aligned, `interactive={false}`, `data-nav-dark` |
| `CrossLink` (`components/page/cross-link.tsx`) | contact, careers | **built** — the whole-row link that pairs the two pages |
| `ContactForm` (`components/contact/contact-form.tsx`) | contact | **built** — three states, and the third is a prefilled mail link so a failed send loses nothing |
| `OFFICES` (`lib/navigation.ts`) | footer, contact | **built** — the footer wants one line per office and Contact wants the whole address; two copies is how one goes stale |
| Page placeholder (`components/page-placeholder.tsx`) | every un-built route | **built** |
| Footer | global | prototyped in showcase |

"Prototyped in showcase" = the visual and states exist in `design/direction-showcase.html`
but have not yet been built as React components. They get built for real once a direction
is selected.

---

## Hero (locked)

- **Background is a shader, not an image.** `src/components/motion/horizon-glow.tsx` — raw WebGL,
  no renderer dependency. A true circle, radius tied to viewport WIDTH so the same share of it is
  on screen at any size; only its lower half is drawn. Blue on the left through amber on the
  right. Four interactions, all measured: the hot spot follows the pointer, the arc parallaxes
  against it, fast movement lifts the rim, and a click sends a pulse along it. All of it is off
  under `prefers-reduced-motion`, off-screen, and on a hidden tab.
- **Copy is centred and short:** eyebrow, one headline, one short lead, one button. The headline's
  second half carries the amber — yellow is 11.97:1 on this ground and is allowed to be type
  here and nowhere else.
- **The CTA is one button in two states.** Yellow fill on light grounds, white fill on dark. Same
  shape, same disc, same arrow swap. The header's CTA drops to an outline over the hero, so the
  screen only ever holds one filled call to action.
- **Any dark section carries `data-nav-dark`.** That attribute is what flips the header to white.
- **Nothing resizes the shader canvas.** No scroll-driven inset, no per-frame `resize()`. A WebGL
  drawing buffer re-allocated every frame flickers; `scripts`-side proof is the flicker suite.
- **Auto-rotation has three obligations.** It pauses while the pointer or focus is inside it, one
  deliberate click stops it permanently, and `prefers-reduced-motion` never starts it. It also
  has to show its own timer — a change nobody saw coming reads as a bug.
- **TEMPORARY: the services view switch.** `services-section.tsx` renders a two-button toggle so
  the index and the map can be compared live. It is a decision tool and comes out before launch.
- **A scene that assembles itself has to be pinned.** The services map was scroll-linked first, to
  avoid being a fourth pinned block, and it read as cheap: a diagram that builds while it is also
  travelling up the screen never gets a still frame to be looked at. Pinned, it holds.
  The page now pins About, Impact, Services (map view) and Results. **Results is the one to unpin**
  if that starts to feel like too much — 2428px of pin for four numbers.
- **A sticky COLUMN is not a pin.** The page keeps its own speed and only one column holds its
  place; the services list view uses that and costs the reader nothing.
- **Two pinned scenes in a row must not be the same scene.** About holds and swaps at three
  checkpoints over 280vh; Impact is one continuous converge over 230vh, and its detail is driven
  by the POINTER rather than the scroll. Same device twice reads as a trick.
- **Hover is never the only way to content.** Every strand label is a real button, focus opens
  the same card, and the full text is in the DOM for assistive technology regardless.
- **A pinned scene is a desktop layout.** Phones get the unpinned stack with the same content —
  a pin fights the mobile address bar and reads as a hijacked scroll. Anything a pinned scene
  reveals one item at a time also exists in full for assistive technology.
- **Type on a shader needs a guaranteed ground.** The About sphere holds its core in shadow by a
  radial value cut, so the white title clears AA at every angle it can turn to. Measured, not
  assumed: it read 2.21:1 before the cut existed.
- **A reveal must be legible before it fires.** Scroll-linked text animates COLOUR, not opacity:
  the resting state is `--ink-subtle` at 4.75:1, so a reader who lands mid-page or scrolls past
  the effect still has AA body text. Fading from zero would not.
- **Supplied assets are not rewritten in place.** Logos, photographs and icons are the client's
  files. Normalising colour for a dark ground is fine and reversible from `design/clients-source/`;
  redrawing geometry — cropping viewBoxes, recomposing artwork — is not, and layout problems get
  solved in CSS instead. The rail's row has a fixed height for exactly this reason: a mark whose
  viewBox is far taller than its ink overflows the row rather than setting it.
- **Client marks live in the hero rail only.** There is no separate logo section. The band is
  `--void` and that is load-bearing — the marks' knockouts are painted in it. Sizes come from
  `scripts/inkscale.mjs`, never by eye.

---

## Build order

1. **Phase 1 — Visual direction** *(complete, awaiting selection)*
2. **Phase 2 — Foundation** *(in progress)* — Next.js scaffolded, tokens ported into
   `@theme` (`web/src/app/globals.css`), Work Sans wired via `next/font`, site nav built.
   Still open: shadcn/ui install, the rest of the shared component layer, Sanity
3. **Phase 3 onward — Section by section**, driven by the sitemap you supply

---

## Open items

1. **Templates / references** — you supply these; the home page gets built from them, then every
   other page follows the home page
2. **Photography** — the client supplies images on request; ask with a Pinterest search term.
   Final image generation happens once the main design work is done. **Outstanding: the hero
   image** is in place but is only 1200x900, which is a ~2.4x upscale on a retina display and
   visibly soft. Request 2400x1800 minimum, as a JPEG. See `web/public/hero/README.md`
3. ~~**Sitemap**~~ — supplied and encoded in `web/src/lib/navigation.ts`. Open questions on it:
   - "Student Management" is on the live site but absent from the new sitemap — dropped?
   - Workday AMS appears twice (a Services page *and* a What-we-do section). Currently
     both exist and point at different URLs; confirm that is deliberate
   - Every nav `description` is placeholder copy derived from live-site keyword lists
4. **Logo vector** — the SVG in `design/` is a `potrace` auto-trace of a 130x34px raster, not a
   true vector original. It works, but a real vector from the designer would be better
5. **Hosting** — Vercel is the natural fit; confirm the client isn't tied to existing hosting
6. **Real content** — copy, client logos, team photos, case studies

---

## Reference files

| File | What it is |
|---|---|
| `REFERENCES.md` | **The reference system** — art direction per section, where to pull refs from, and the running log |
| `design/tokens.md` | The three candidate palettes, contrast-verified |
| `design/direction-showcase.html` | Built showcase — **do not edit directly**, it is generated |
| `design/build.js` | Assembles the showcase from its parts; run `node design/build.js` |
| `design/_*.html`, `design/_*.css` | The showcase's editable source parts |
| `design/hazeberg-logo-source.svg` | Logo recovered from the live site |
| `content/live-site-content.txt` | Full content of hazebergconsulting.com, captured 2026-09-16 |
| `content/assets-needed.md` | Generated list of the 10 outstanding photographs and the copy gaps |
| `web/src/lib/home-content.ts` | All home copy, each string tagged `[live]`, `[derived]` or `[PLACEHOLDER]` |
| `web/scripts/verify-header.mjs` | Header DoD suite — `npm run qa:header` (needs the app on :4317) |
| `web/scripts/inkscale.mjs` | Derives the client rail's optical scales from measured ink bounds |
| `design/clients-source/` | The 13 logos as supplied, before fill normalisation |
| `design/clients-legacy/` | The old scraped raster marks, retired when the vectors arrived |
| `web/public/hero/README.md` | Hero artwork spec, crop reasoning, and the outstanding resolution request |
| `design/_logo.clean.svg` | Same logo, `fill` forced to `currentColor` |
