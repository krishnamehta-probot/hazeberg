# Hazeberg Sitemap

Source: client spreadsheet, supplied 2026-09-17. This file is the structural source of
truth. Routes, page types and section anchors are settled here before any page is built.

**12 pages.** Client decisions of 2026-09-17 folded in.

---

## Routes

| Page | Route | Type |
|---|---|---|
| Home | `/` | Landing |
| Services | `/services` | Nav dropdown only - **confirmed: no page**. Redirects to `/` so a typed URL does not dead-end |
| Workday HCM | `/services/workday-hcm` | Landing |
| Workday Payroll | `/services/workday-payroll` | Landing |
| Workday Financials | `/services/workday-financials` | Landing |
| Workday Integrations | `/services/workday-integrations` | Landing |
| Workday Reporting & Analytics | `/services/workday-reporting-and-analytics` | Landing |
| Workday Extend | `/services/workday-extend` | Landing |
| What we do | `/what-we-do` | Consolidated landing, 8 sections, anchor-linked from the page's own rail. First in the nav, a plain link (2026-09-30) |
| About | `/about` | Consolidated landing, 6 sections, anchor-linked from the page's own rail. A plain nav link (2026-09-30) |
| Berg | `/berg` | Single page. A Hazeberg solution, not a sub-brand - no separate visual identity |
| Careers | `/careers` | Single page |
| Contact | `/contact` | Single page |

---

## Services - six separate landing pages

Nav dropdown with no parent destination. Each child is its own page. All six share one
template and one CMS document type - six documents, not six hand-built pages.

1. Workday HCM - `/services/workday-hcm` - **written**
2. Workday Payroll - `/services/workday-payroll` - scaffold
3. Workday Financials - `/services/workday-financials` - scaffold
4. Workday Integrations - `/services/workday-integrations` - scaffold
5. Workday Reporting & Analytics - `/services/workday-reporting-analytics` - scaffold
6. Workday Extend - `/services/workday-extend` - scaffold

Template built 2026-09-29: `app/services/[slug]/page.tsx` renders every one of the six
from `lib/service-content.ts`, which is the CMS document type standing in for Sanity until
Sanity exists. The seventh module, whenever it comes, is a content entry and not a build.

**Only Workday HCM is written.** The other five render their live opener - the client's
own copy, already on the home page - and then a clearly marked scaffold saying the rest is
not written, with a link to the finished one and the list of what each page needs. Five
copies of the HCM page with the nouns swapped is how a shared template turns into filler,
and a 404 would break six links that ship in the header.

Note the slug: the nav and `SERVICES.items` both use `workday-reporting-analytics`, not
`workday-reporting-and-analytics` as an earlier revision of this file had it. The routes
are generated from `SERVICES.items`, so the shipped list wins.

**Workday AMS is not in this list.** The client confirmed six Services pages, and AMS is
the only entry that the original seven had to lose to reach six. It lives on
`/what-we-do#ams` instead, which also matches the module-versus-engagement axis below.
Flagged rather than assumed: if AMS was meant to stay and something else was meant to
drop, say so and it moves back.

---

## What we do - one page, eight sections

Consolidated onto `/what-we-do`. Every section needs a stable anchor so the nav and
internal links can deep-link to it.

Built 2026-09-29. **DRAFT — roughly seven eighths of the prose is placeholder**, all of
it marked in `web/src/lib/what-we-do-content.ts`. Real: the eight names, the eight
one-line descriptions (live in the nav today), the Get-live / Stay-ahead split, the
figures, and the AMS paragraph, which is the client's own home-page copy.

Anchors corrected to the long forms `navigation.ts` has always linked - same call as
`/about`: the nav ships in the header today, so it is the contract. Grouped and ordered
as the nav's own two columns.

| Section | Anchor | Group |
|---|---|---|
| Workday Implementation | `#workday-implementation` | Get live |
| Payroll Transformation | `#payroll-transformation` | Get live |
| Integration Modernization | `#integration-modernization` | Get live |
| Workday Health Check | `#workday-health-check` | Get live |
| Workday Optimization | `#workday-optimization` | Stay ahead |
| Workday AMS | `#workday-ams` | Stay ahead |
| Release Management | `#release-management` | Stay ahead |
| Cost Optimization | `#cost-optimization` | Stay ahead |

The page is built around a sticky rail of its own eight sections that tracks the scroll -
`components/page/anchor-rail.tsx`, shared with the legal pages. Almost nobody opens this
page and reads it down; they click one engagement in the nav and land two thirds of the
way into it, and the rail is what tells them where that is.

---

## About - one page, six sections

Built 2026-09-29. **The page is a DRAFT and roughly half of it is placeholder** - see
the header of `web/src/lib/about-content.ts`, where every entry is marked `[live]`,
`[fact]`, `[DRAFT]` or `[EMPTY]` with what is missing and why it was not invented.

Four of the six anchors below were written short in an earlier revision of this file
(`#story`, `#life`, `#team`). **`navigation.ts` has always linked the long forms**, and
those links ship in the header today, so the nav is the contract and the table is
corrected to match it. Section order follows the nav's own reading order.

| Section | Anchor |
|---|---|
| Our story | `#our-story` |
| Leadership | `#leadership` |
| Our team | `#our-team` |
| Life at Hazeberg | `#life-at-hazeberg` |
| Certifications | `#certifications` |
| Rewards | `#rewards` |

**Real on the page**: the retired "Why choose Hazeberg" block (the client's own copy,
parked for this page when it came off the home page on 2026-09-23), the client quote that
came with it, the founder's name, the four delivery figures, and both certifications.

**Still needed**: the founding story (year, reason, first engagement); the founder's
biography and a real portrait photograph; Life-at-Hazeberg copy of its own - the Careers
page holds the culture writing and it must not be printed twice; every award for Rewards;
and the certificate paperwork (issuing body, number, valid-to date) for both marks.

One client figure was edited: the retired Why block says "11+ years" twice and every other
page now says 12+, revised by the client on 2026-09-25. The number is changed and nothing
else is.

---

## Berg

Single page. Audience: consulting firms and customers looking to extend delivery
capacity - i.e. delivery capacity as a service, not end-client implementation work.

"For Consultants" content deliberately does **not** live here. It sits on Careers,
because that audience is hiring-facing.

**The Berg logo is used twice**, at the client's request (2026-09-30): at the centre of
the hero's network scene, where the orb turns into it — glowing — when Berg is picked
(the orb is the resting state), and on the home page's Berg band. Its colours are exactly
Hazeberg's blue and amber, so it does not break "no separate visual identity". Traced to
SVG from the Berg app's PNG — `web/src/components/brand/berg-logo.tsx`.

---

## The axis that separates Services from What we do

Two different questions, which is why the overlap in names is not duplication:

- **Services** answers *which Workday module* - HCM, Payroll, Financials, Integrations,
  Reporting, Extend.
- **What we do** answers *what kind of engagement* - Implementation, Optimization, Cost
  Optimization, Release Management, Health Check.

Read that way, "Workday Payroll" (module) and "Payroll Transformation" (engagement) are
legitimately different pages, as are "Workday Integrations" and "Integration
Modernization". Only one entry breaks the axis: see below.

---

## Settled 2026-09-17

- **Berg is a solution**, not a sub-brand. It keeps its own page and its top-level nav
  slot, but takes the standard design system - no separate mark, accent or type
  treatment.
- **Services has no landing page.** Recommendation for a hub declined. `/services` will
  redirect rather than 404.
- **Six Services pages**, one shared template.
- **Workday AMS duplication**: client deferred ("not a major problem"). Resolved for now
  by the six-page count. The cost if it ever returns to both trees is two near-identical
  pages competing in search and two nav routes to one answer.

## Still open

### Legal pages are absent
Careers and Contact both collect personal data, which needs a Privacy Policy to point at
from the forms and the footer. Terms and a cookie notice are the usual companions.
Not in the client spec; flagging as a gap rather than assuming.

**Built 2026-09-28.** `/privacy` and `/terms` now exist, linked from the footer's legal
strip. No cookie notice, because the site sets no cookies and loads no trackers — that
fact is stated in the policy rather than papered over with a banner.

**Both documents are DRAFTS and have not been through a lawyer.** They are accurate about
what the site does — every claim was checked against the code — but accuracy is not
sufficiency. Two items are marked [CONFIRM] in `web/src/lib/legal-content.ts`: the hosting
provider to be named, and the governing jurisdiction.

## CMS note (Sanity)

The seven service pages are one document type with seven documents, not seven hand-built
pages. The What-we-do and About sections are best modelled as their own referenced
documents ordered on the parent page, rather than as blocks locked inside it - that way
the client can reorder them, and any section can later be promoted to its own page
without a content migration.


---

## Home page sections (as built, 2026-09-23)

Hero · Why Hazeberg · Impact · Services · Berg · Results · Case Studies · Engagement · Testimonials · Closing

**Berg band** (added 2026-09-30, client request): one card after Services pointing at Berg —
logo, the Berg page's own title and first sentence, the three groups, "Explore Berg" and
"Get Started". Copy from `BERG_HOME_BAND` in `web/src/lib/berg-content.ts`, not Sanity.

**Retired from the home page:** "Why choose Hazeberg" and the FAQ. The page ran to 18 screens;
these two came out. Both sets of copy are kept in `web/src/lib/home-content.ts` under a RETIRED
note — the Why copy has an obvious home on the About page, and an FAQ belongs on its own page.
