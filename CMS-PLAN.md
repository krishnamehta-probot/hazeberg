# CMS Plan — Sanity

Revised 2026-09-17 after the "why are we giving the client the upper hand" question.
The first draft modelled a page builder. That was over-specced; this is the correction.

Companion to `SITEMAP.md` (structure) and `PROJECT-RULES.md` (rules).

---

## The question is surface area, not yes-or-no

"Do they get a CMS" is the wrong frame. Sanity either exists or it doesn't, but the
decision that matters is **how much of the site it can reach**. There is a spectrum:

| Level | What the client controls | Verdict |
|---|---|---|
| 0 | Nothing. All in code | Breaks the brief |
| 1 | Volatile lists only — jobs, people, case studies | Too little; every typo is a ticket |
| **2** | **Lists, plus the words and images in fixed layouts** | **This one** |
| 3 | The above, plus section order per page | Unnecessary here |
| 4 | Full page builder — blocks, layouts, ordering | Never |

The first draft of this plan sat at 3, heading toward 4. A Workday consultancy publishes
rarely and has no content team. Level 3 costs real build time and buys a capability that
gets used roughly never, while carrying the entire risk of the design decaying.

**Level 2: the client edits words, images and lists. They cannot touch structure.**

---

## What actually changes on this site

The model should follow volatility, nothing else.

| How often | Content | Where it lives |
|---|---|---|
| Monthly or more | Job openings | CMS collection |
| A few times a year | Team members, case studies, the stat figures | CMS collection or field |
| Yearly or less | Service copy, About story, hero copy, certifications | CMS flat fields |
| Never after launch | Page structure, section order, navigation, layout | **Code** |

Everything in the bottom row is where the "client breaks the site" risk lives, and none
of it is content they have ever asked to change.

---

## Revised model

### Singletons — flat named fields, no block arrays

One document per page. The layout is fixed in code; the document supplies the words and
images for each named slot. The client edits the hero heading; they cannot move the hero.

`siteSettings` · `homePage` · `whatWeDoPage` · `aboutPage` · `bergPage` ·
`careersPage` · `contactPage`

SEO defaults and the contact details live on `siteSettings`. Certifications live as a
field on `aboutPage` — two items that change every few years do not need a collection.

### Collections — five, and each earns it

| Document | Why it is a collection |
|---|---|
| `servicePage` | 6 documents, one template. This is the "template for that will be there" already agreed |
| `solution` | The 8 What-we-do sections. Genuinely list-shaped and reorderable |
| `person` | Leadership and team. Adding a joiner should not need a deploy |
| `jobOpening` | Changes most often. The single strongest reason a CMS exists here |
| `caseStudy` | Referenced by the nav feature card, What we do, and service pages |

Cut from the first draft: `navigation`, `partnerLogo`, `certification`, `testimonial`,
`seoDefaults`. Partner names are a string array on a field — they are text chips, not
image records. The rest were collections with two or three entries that will never grow.

### Cut entirely: the section block system

No `heroSection` / `statRow` / `textMedia` vocabulary, no ordered arrays of blocks per
page. That was the expensive part to build and the dangerous part to hand over. Page
layouts are code.

---

## Navigation goes back into code

The first draft proposed a CMS-driven hybrid with its own `navigation` document. That
was solving a problem that does not exist — the client will add a seventh service maybe
once every two years, and when they do they will want the page designed anyway.

Instead, **the menus derive from the collections that already exist**:

- Services menu ← the `servicePage` collection, ordered by its `order` field
- What we do menu ← the `solution` collection
- About menu ← fixed anchors in code, because the About sections are fixed

Same practical benefit — a new service document appears in the menu automatically — with
one fewer document type, no separate nav editing surface, and no way to invent a fourth
top-level menu or orphan a page.

---

## Guardrails

Unchanged from the first draft, and they matter more now that the surface is smaller.

- **Character limits** on every heading and lede, set from the design's real line counts.
- **Required alt text** on every image. Rule 7 makes accessibility a gate; a required
  field is the only version of that rule that survives handover.
- **Fixed array lengths** where the design demands them — the stat row is exactly four.
- **Portable Text restricted** to bold, link and one list style. Not the default set with
  H1–H6 and blockquote that nothing is designed for.
- **No colour, font or spacing controls. Ever.**
- **Image aspect enforced** at render via hotspot and crop, so a bad upload can only be
  badly cropped, never break the grid.

Rule 8 (photography direction) cannot be validated. It goes in the field descriptions,
where the editor actually reads it.

---

## Sequencing

Deliberately not CMS-first.

| Phase | Work |
|---|---|
| **A** | Build the home page with content still in TS literals |
| **B** | Install Sanity. Derive the schema from the fields home actually uses. Seed from `home-content.ts` and `navigation.ts` so nothing is retyped |
| **C** | Wire home to Sanity, with Presentation and Next draft mode for preview |
| **D** | Remaining pages built against the schema |

The 509 lines already in `src/lib/` were written as data, not markup, which is why this
conversion is cheap. Home is the pilot; the rest is repetition.

---

## Practical items that bite later if skipped

1. **Project ownership.** Created in **Hazeberg's** Sanity organisation, or transferred
   before handover. Otherwise the client rents their own content from us.
2. **Studio at `/studio`** inside the Next app — one deploy, one domain, one handover.
3. **Roles.** Client editors get `editor`, not `administrator`.
4. **Plan limits.** Free-tier seats, bandwidth and asset allowances change; verify current
   numbers before promising. Team photos and job posts drive usage here.
5. **Structured desk** mirroring the sitemap, not the default flat list of types.
6. **Handover.** A short guide plus a screen recording. At level 2 this is a twenty-minute
   walkthrough, which is precisely the point — level 3 would not have been.

---

## The commercial note, said plainly

Less CMS surface means more change requests come back to us as billable support. That is
a business decision, not a technical one, and it should be made on purpose rather than
arrived at by accident.

Level 2 is the honest middle: the client can genuinely run the site day to day — post a
job, add a team member, fix a typo, swap a photo — without being handed the ability to
dismantle the design. Anything they cannot do at level 2 is work that needed a designer
anyway.

---

## Open questions for the client

1. **Sanity still the choice?** Last cheap moment to change it.
2. **Who actually edits?** One person or several — drives seats and roles.
3. **Scheduled publishing or multiple languages?** Both are paid tiers and both change
   this plan.
