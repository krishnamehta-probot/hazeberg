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
| `CMS-PLAN.md` | Planned Sanity schema and migration approach |

## Running locally

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

## Scripts (run from `web/`)

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run qa:header` | Playwright header regression check |

## Deployment

Vercel builds from `web/` on every push to `main`. Pull requests get preview
deployments automatically.
