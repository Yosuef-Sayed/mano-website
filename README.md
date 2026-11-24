# MANO — Business × Technology

Personal brand and portfolio website for **Abdelrahman Ayman Samir Elsayed (MANO)**.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Zod.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Forms work locally with no setup: submissions are saved to `.data/submissions.json` (development only).

```bash
npm run build && npm start   # production build
npm run lint
```

## What's where

| Path | Purpose |
|---|---|
| `src/config/site.ts` | Name, email, social links, CV path, domain, navigation |
| `src/content/*.ts` | All page content: experience, projects, services, Value Loop, MANO content |
| `src/app/*` | Pages (`/`, `/about`, `/experience`, `/projects`, `/projects/athathi`, `/services`, `/speaking`, `/collaborate`, `/book`, `/contact`, `/privacy`) |
| `src/app/api/forms/[type]` | Form endpoint: validation, spam checks, storage, email |
| `src/app/admin` | Private inbox (HTTP Basic auth, off unless `ADMIN_PASSWORD` is set) |
| `src/lib` | Storage (Supabase / local file), email (Resend), rate limiting, schemas |
| `public/files/…CV.pdf` | The CV served at `/cv` |

## Docs

- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) — how to update the CV, experience, projects, services, links and booking settings
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — environment variables, Supabase/Resend setup, deploying, custom domain, verification checklist
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — tokens, typography, components, interaction rules
- [docs/ROADMAP.md](docs/ROADMAP.md) — calendar sync, payments, admin and other future features
- [docs/supabase.sql](docs/supabase.sql) — database table for submissions
