# MANO — Business × Technology

Personal brand and portfolio website for **Abdelrahman Ayman Samir Elsayed (MANO)**.
Bilingual (English / Arabic, RTL). Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod and the Anthropic SDK.

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
| `src/config/site.ts` | Name, email, social links, CV path, domain |
| `src/content/en.ts`, `src/content/ar.ts` | Every visible word, in English and Arabic |
| `src/app/[lang]/*` | Pages, served at `/…` (English) and `/ar/…` (Arabic) via `src/proxy.ts` |
| `src/app/api/tools/*`, `src/lib/tools/*` | Free tools: SSRF-safe fetcher, checks, Claude calls, limits |
| `src/app/api/forms/[type]` | Form endpoint: validation, spam checks, storage, email |
| `src/app/[lang]/admin` | Private inbox (HTTP Basic auth, off unless `ADMIN_PASSWORD` is set) |
| `src/lib` | Storage (Supabase / local file), email (Resend), rate limiting, schemas |
| `public/files/…CV.pdf` | The CV served at `/cv` |

## Docs

- [CONTENT_GUIDE.md](CONTENT_GUIDE.md) — how to update text (English + Arabic), experience, timeline, projects, certificates, topics, links, CV and tools
- [docs/TOOLS-SPEC.md](docs/TOOLS-SPEC.md) — free tools: specification, security and costs
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — environment variables, Supabase/Resend setup, deploying, custom domain, verification checklist
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — tokens, typography, components, interaction rules
- [docs/ROADMAP.md](docs/ROADMAP.md) — calendar sync, payments, admin and other future features
- [docs/supabase.sql](docs/supabase.sql) — database table for submissions
