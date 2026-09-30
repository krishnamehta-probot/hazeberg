# Sanity CMS

The home page's words, photographs and lists live in Sanity. The Studio where
they are edited is part of this app, at **`/studio`** — same deploy, same domain.
Scope and reasoning: `../CMS-PLAN.md` (level 2: content is editable, structure
is not).

Until a project ID is set, nothing here is required: the site builds and shows
the copy that ships in `src/lib/home-content.ts`, and `/studio` says what is missing.

**Current project:** `Hazeberg`, ID `tgjfg4q8`, dataset `production` (public),
in Krishna Mehta's personal organisation. Transfer it to Hazeberg's organisation
before handover (sanity.io/manage → project → Settings), per `CMS-PLAN.md`.

---

## Setup

Steps 1–6 are done for `tgjfg4q8`; they are here for a rebuild or a new
environment. Run everything from `web/`.

1. **Log in to Sanity** (opens a browser): `npx sanity login`

2. **Create the project** — or skip if it exists. A new account needs an
   organisation first:

   ```bash
   npx sanity organizations create --name "<name>"
   npx sanity projects create "Hazeberg" --organization <org-id> --dataset production --dataset-visibility public --yes
   ```

   Keep the dataset **public**: published content is read without a token.
   Do **not** run `sanity init` in this folder — its Next.js flow installs
   Sanity 5 over the Sanity 6 this app uses.

3. **Create `web/.env.local`** from `.env.example`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — from step 2.
   - `SANITY_API_READ_TOKEN` — a **Viewer** token (`npx sanity tokens create "Next preview" --role viewer`).
     It must be Viewer: during preview the site hands this token to the editor's browser.

4. **Allow the site's origins** so the Studio and live updates can talk to Sanity:

   ```bash
   npx sanity cors add http://localhost:3000 --credentials
   npx sanity cors add https://hazeberg.vercel.app --credentials
   ```

   Add any other domain the Studio will be opened on (a custom domain, a Vercel preview URL).

5. **Put today's content into Sanity** — the home page, its photographs and the
   three case studies, exactly as they ship in code:

   ```bash
   npm run sanity:seed
   ```

   It only creates what is missing, so it is safe to run twice.
   `npm run sanity:seed -- --replace` resets the published home page and case
   studies to the shipped copy and **overwrites editors' published work** (open
   drafts are kept — discard them in the Studio if the reset should show there).

6. **The publish webhook — required.** The home page is cached with no expiry,
   and this is what tells the site a publish happened. Without it a publish only
   reaches the site if someone happens to have it open at that moment.

   For `tgjfg4q8` it exists: *Refresh the site on publish* → `https://hazeberg.vercel.app/api/revalidate`,
   with its secret in `web/.env.local`. To create it elsewhere: sanity.io/manage →
   API → Webhooks → Create, URL `https://<site>/api/revalidate`, trigger on
   Create/Update/Delete, filter `_type in ["homePage", "caseStudy"]`, projection
   `{_type}`, and a long random secret — the same value as `SANITY_REVALIDATE_SECRET`.

7. **Vercel** → Project → Settings → Environment Variables: add the four values
   from `web/.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
   `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`) for Production and
   Preview, then redeploy.

8. **Invite editors** at sanity.io/manage → Members, with the **Editor** role,
   not Administrator.

---

## For developers

| Command | Does |
|---|---|
| `npm run sanity:types` | Re-extracts the schema and regenerates `src/sanity/sanity.types.ts`. Run it after any schema or query change |
| `npm run sanity:seed` | Writes the shipped copy into the dataset (see above) |

| File | Holds |
|---|---|
| `sanity.config.ts` | The Studio: tools, singleton rules, Preview (Presentation) locations |
| `src/sanity/schemaTypes/` | The content model. `fields.ts` holds the shared guardrails — soft/hard length limits, page pickers, photo fields |
| `src/sanity/lib/queries.ts` | The one GROQ query the home page runs |
| `src/lib/home/normalize.ts` | CMS data → the shape the page renders, with per-section fallbacks |
| `src/lib/home/fallback.ts` | The shipped copy in that same shape |
| `src/app/studio/[[...tool]]` | The Studio route |
| `src/app/api/draft-mode/*` | Preview on/off, used by the Studio's Preview tool |
| `src/app/api/revalidate` | The publish webhook |

**How a publish reaches the site.** The home page is static, and its query is
cached under the tags `homePage`, `caseStudy` and Sanity's own sync tags, with
no expiry. Two things expire it:

- the **webhook** — Sanity calls `/api/revalidate` on every publish, and the next
  request renders fresh. This is the guarantee.
- **`<SanityLive />`** — a browser with a public page open hears the publish and
  refreshes it in about two seconds (measured: 2.2–2.4 s). It only acts on what
  it hears live, so it cannot replace the webhook.

**Why the Studio has its own layout.** The site's `globals.css` hides every
scrollbar and restyles focus, and Lenis eats wheel events. So the root layout
is bare; the public site gets its CSS and shell from `src/app/(site)/layout.tsx`
(and the 404 for unknown URLs from `src/app/global-not-found.tsx`), and the Studio
gets none of it.

**Keep Studio code out of the site.** Site code must never import `sanity`,
`sanity/*`, the schema or `sanity.config.ts` — only types from `sanity.types.ts`.

---

## For editors

Open **`<site>/studio`** and sign in with the account you were invited with.

**Editing the home page**

1. In the sidebar, open **Home page**. It has one tab per section of the page —
   Hero, About, Impact, Services, Results, Use cases, Engagement, Testimonials,
   Closing — in page order.
2. Change a field. Changes save automatically as a **draft**; visitors see nothing yet.
3. Click **Publish**. The live site updates within seconds — no developer, no redeploy.

**Seeing it before you publish.** Open **Preview** in the top bar: the real
site, with your unpublished changes, next to the form. Click any text on the
page and the Studio jumps to the field that holds it.

**Case studies** are their own documents, under **Case studies** in the
sidebar. The home page's Use cases tab chooses which three appear and in what
order. A case study that is not one of the three says so at the top.

**What the colours mean**

- **Red** — the Studio will not publish until it is fixed: a required field is
  empty, or the text is long enough to break the layout. The message says which.
- **Yellow** — worth a look, but you can publish. Most mean the text is longer
  than the design was measured for; check the preview. A few are there from
  day one on the approved copy, because each marks a real layout issue: the
  Impact button, the About paragraph, the Workday Integrations description and
  the "Streamlining Global Workforce Management…" case study title.
- **Placeholder** — quotes and figures written to fill the design, not yet
  approved. Switch the flag off once the words are final.
- **Stand-in photograph** — a comp or generated picture used while the design
  was built. Switch it off when you upload the real photograph.

**What you cannot change, on purpose:** the order of sections, the layout,
colours, fonts, the client logo rail, and how many items the fixed lists hold
(Impact always has four figures, the services wheel seven wedges). You can
reword and reorder those items, but not add or remove them — that is what keeps
every edit looking designed. Anything beyond that is a design change.

**Undo.** Every document keeps its full history: open the document's history
(the clock icon) to see earlier versions and restore one.
