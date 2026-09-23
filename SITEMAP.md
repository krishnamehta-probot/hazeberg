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
| What we do | `/what-we-do` | Consolidated landing, 8 sections, all anchor-linked from the nav dropdown |
| About | `/about` | Consolidated landing, 6 sections, all anchor-linked from the nav dropdown |
| Berg | `/berg` | Single page. A Hazeberg solution, not a sub-brand - no separate visual identity |
| Careers | `/careers` | Single page |
| Contact | `/contact` | Single page |

---

## Services - six separate landing pages

Nav dropdown with no parent destination. Each child is its own page. All six share one
template and one CMS document type - six documents, not six hand-built pages.

1. Workday HCM
2. Workday Payroll
3. Workday Financials
4. Workday Integrations
5. Workday Reporting & Analytics
6. Workday Extend

**Workday AMS is not in this list.** The client confirmed six Services pages, and AMS is
the only entry that the original seven had to lose to reach six. It lives on
`/what-we-do#ams` instead, which also matches the module-versus-engagement axis below.
Flagged rather than assumed: if AMS was meant to stay and something else was meant to
drop, say so and it moves back.

---

## What we do - one page, eight sections

Consolidated onto `/what-we-do`. Every section needs a stable anchor so the nav and
internal links can deep-link to it.

| Section | Anchor |
|---|---|
| Workday Implementation | `#implementation` |
| Workday Optimization | `#optimization` |
| Workday AMS | `#ams` |
| Cost Optimization | `#cost-optimization` |
| Integration Modernization | `#integration-modernization` |
| Payroll Transformation | `#payroll-transformation` |
| Release Management | `#release-management` |
| Workday Health Check | `#health-check` |

---

## About - one page, six sections

| Section | Anchor |
|---|---|
| Our story | `#story` |
| Life at Hazeberg | `#life` |
| Certifications | `#certifications` |
| Rewards | `#rewards` |
| Leadership | `#leadership` |
| Our Team | `#team` |

---

## Berg

Single page. Audience: consulting firms and customers looking to extend delivery
capacity - i.e. delivery capacity as a service, not end-client implementation work.

"For Consultants" content deliberately does **not** live here. It sits on Careers,
because that audience is hiring-facing.

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

## CMS note (Sanity)

The seven service pages are one document type with seven documents, not seven hand-built
pages. The What-we-do and About sections are best modelled as their own referenced
documents ordered on the parent page, rather than as blocks locked inside it - that way
the client can reorder them, and any section can later be promoted to its own page
without a content migration.


---

## Home page sections (as built, 2026-09-23)

Hero · Why Hazeberg · Impact · Services · Results · Case Studies · Engagement · Testimonials · Closing

**Retired from the home page:** "Why choose Hazeberg" and the FAQ. The page ran to 18 screens;
these two came out. Both sets of copy are kept in `web/src/lib/home-content.ts` under a RETIRED
note — the Why copy has an obvious home on the About page, and an FAQ belongs on its own page.
