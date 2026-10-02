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
| What we do | `/what-we-do` | Consolidated landing, 8 sections; the 8 capabilities are an accordion, each on its own anchor. First in the nav, a plain link (2026-09-30) |
| About | `/about` | Consolidated landing, 6 sections, anchor-linked from the page's own rail. A plain nav link (2026-09-30) |
| Berg | `/berg` | Single page. A Hazeberg solution, not a sub-brand - no separate visual identity |
| Careers | `/careers` | Single page |
| Contact | `/contact` | Single page |

---

## Services - six separate landing pages

Nav dropdown with no parent destination. Each child is its own page. All six share one
template and one CMS document type - six documents, not six hand-built pages.

1. Workday HCM - `/services/workday-hcm` - **written** (client doc, 2026-10-02)
2. Workday Payroll - `/services/workday-payroll` - **written** (client doc, 2026-10-02)
3. Workday Financials - `/services/workday-financials` - **written** (client doc, 2026-10-02)
4. Workday Integrations - `/services/workday-integrations` - **written** (client doc, 2026-10-02)
5. Workday Reporting & Analytics - `/services/workday-reporting-analytics` - scaffold
6. Workday Extend - `/services/workday-extend` - scaffold

Template built 2026-09-29, rebuilt 2026-10-02 on the client's four service documents:
`app/services/[slug]/page.tsx` renders every one of the six from `lib/service-content.ts`,
which is the CMS document type standing in for Sanity until Sanity exists. The seventh
module, whenever it comes, is a content entry and not a build.

All four documents share one structure, so the template does too - hero (with an outcome
strip and the module's six-stage cycle drawn as a ring), capabilities (`#capabilities`, each
stage on `#stage-<key>`), who it's built for (`#who-its-for`), how we engage
(`#how-we-engage`), one section of the module's own, a call to action with related
modules, and questions (`#questions`). The module's own section: Industries on HCM
(`#industries`), the two payroll models on Payroll (`#payroll-model`), connected finance on
Financials (`#connected-finance`), and what we connect on Integrations (`#what-we-connect`).

Reporting & Analytics and Extend have no document yet. They render their live opener and
a clearly marked scaffold, rather than borrowed copy or a 404 that would break the header.

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

Rebuilt 2026-10-01 on the client's own copy ("What We Do Content", every line of it -
see `web/src/lib/what-we-do-content.ts`). No placeholder prose is left on the page. Still
open: the hero's proof strip is built but switched off until the client confirms the four
figures (the document says so), and the photographs are comp stand-ins.

AI in the flow of work was added the same day from its own document ("AI in the Flow of
Work"), between the capabilities and How we work. That document drafts its head twice;
the first draft is on the page and the second is kept in the content file. Its four
figures are the client's illustrative targets and always carry the document's caveat.

| Section | Anchor |
|---|---|
| Who we are | `#who-we-are` |
| Wherever you are with Workday | `#your-journey` |
| How it fits together | `#how-it-fits` |
| Workday capabilities | `#capabilities` |
| AI in the flow of work | `#ai-in-the-flow-of-work` |
| How we work | `#how-we-work` |
| What we cover | `#what-we-cover` |

The eight capability anchors are unchanged and still a contract - other pages link four of
them. Each is now an accordion row inside `#capabilities`, and arriving on its hash opens
it:

`#workday-implementation` `#workday-optimization` `#workday-ams` `#cost-optimization`
`#integration-modernization` `#payroll-transformation` `#release-management`
`#workday-health-check`

Every mention of a capability anywhere on the page - the challenges, the journeys, the
lifecycle map - is a link to its row that opens it. The anchor rail is gone from this page;
it stays on the legal pages.

---

## About - one page, six sections

Rebuilt 2026-10-02 on the client's "About Page" document, every line of it - see
`web/src/lib/about-content.ts`. The draft it replaces (Life at Hazeberg, Our team, Rewards,
the placeholder founding story) is gone, because the document does not have those sections.
No nav link points into this page by hash, so the old anchors were free to go.

| Section | Anchor |
|---|---|
| Hero | - |
| Our story (with mission, vision, closing line) | `#our-story` |
| How we're built | `#how-were-built` |
| Meet the team | `#leadership` |
| Recognition | `#recognition` |
| Start a conversation | `#start-a-conversation` |

**Still needed**: portraits of the four leaders (the page draws their initials until they
arrive), and Workday's certification mark if the client wants it shown. **To confirm**: the
document's Coimbatore address (Annamalai Industrial Park, Kalapatti) differs from the one in
`navigation.ts` `OFFICES` (Ksquare Complex, Vinayagapuram); the page follows the document.

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
