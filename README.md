# Hazeberg

Marketing website for Hazeberg, a Workday consultancy.
Next.js (App Router) + TypeScript + Tailwind v4, deployed on Vercel.

## Repository layout

| Path | What it holds |
|---|---|
| `web/` | The Next.js application — this is the Vercel **root directory** |
| `design/` | Art direction source: moodboards, logo sources, hero renders, tokens |
| `content/` | Copy source captured from the live site, plus the outstanding asset list |
| `PROJECT-RULES.md` | Locked decisions and working rules. Read this first |
| `SITEMAP.md` | Structural source of truth — routes, page types, section anchors |
| `REFERENCES.md` / `REFERENCE-SPEC.md` | Reference-site analysis the design is built against |
| `CMS-PLAN.md` | Sanity scope and reasoning — what editors can and cannot change |
| `web/SANITY.md` | Sanity setup, the developer map, and the editors' guide |

## Running locally

```bash
cd web
npm install
npm run dev      # http://localhost:3000 — the Studio is at /studio
```

The site runs without any CMS settings (it shows the copy that ships in code).
To connect Sanity, copy `web/.env.example` to `web/.env.local` and follow
`web/SANITY.md`.

## Scripts (run from `web/`)

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run qa:header` | Playwright header regression check |
| `npm run sanity:types` | Regenerate the CMS types after a schema or query change |
| `npm run sanity:seed` | Write the shipped home copy and photographs into Sanity |

## Deployment

Vercel builds from `web/` on every push to `main`. Pull requests get preview
deployments automatically.
