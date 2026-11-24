# Content guide — how to update the MANO website

No admin dashboard or CMS is needed. Every word on the site lives in **two files**:

- `src/content/en.ts` — English
- `src/content/ar.ts` — Arabic (same structure, translated)

If you add something to one file and forget the other, `npm run build` fails and names the missing item. That's on purpose: the two languages can't drift apart.

Identity, links and the CV path (language-neutral) live in `src/config/site.ts`.

> After editing: run `npm run dev`, check the page at `/…` (English) and `/ar/…` (Arabic), then deploy.

---

## Quick reference

| I want to… | Edit |
|---|---|
| Change the hero text | `home.lead`, `identity.role`, `identity.supporting` in both content files |
| Add an experience entry | `experience.roles` (details) **and** `experience.timeline.entries` (timeline) |
| Add a timeline milestone only | `experience.timeline.entries` |
| Add a project | `projects.items` |
| Add a certificate | image in `public/images/certificates/` + `experience.training` |
| Add a workshop/speaking topic | `speaking.topics` |
| Record a delivered talk | see "Recording a delivered speaking engagement" below |
| Update social links or email | `src/config/site.ts` |
| Replace the CV | `public/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf` |
| Add a free tool | `docs/TOOLS-SPEC.md` → "Adding a new tool" |
| Change tool limits | environment variables (see `.env.example`) |

---

## Update the hero
In both content files:
- `identity.role` — the main line under the name ("AI Applications & Software Development")
- `identity.supporting` — the small line ("Product & Business Thinking")
- `home.lead` — the sentence below
- `meta.defaultTitle` / `meta.description` — what Google and LinkedIn show

## Add an experience entry
1. In `experience.roles`, copy an existing block and change it. Fields:
   - `id` (short, no spaces — also used in links like `/experience#reds`)
   - `role`, `org`, `orgNote`, `dates`, `type` (Employment / Internship / Early-stage venture / Leadership role / Student activity / Training / Personal project)
   - `category`: one of `startup`, `leadership`, `ml`, `marketing-sales`, `student`
   - `did` (what you actually did), `exposure` (what you learned about — not the same thing), `skills`, `status` (leave `""` if none)
   - `link: { label, href }` — leave both `""` for no link
2. Add the same block, translated, in `ar.ts`.

## Add a timeline milestone
In `experience.timeline.entries`:
```ts
{ id: "my-event", lane: "learning", start: "2027-02", end: "2027-02", date: "Feb 2027",
  role: "Event or role name", org: "Organizer", type: "Milestone",
  text: "One line describing it.", result: "One verified result.", href: "/experience#training" }
```
- `lane`: `work` (Work & Ventures), `leadership` (Leadership & Community), `learning` (Learning & Development)
- `start` / `end`: `YYYY-MM`. Use `end: ""` for something ongoing ("Present").
- Optional `certificate: "/images/certificates/file.jpg"` adds a "Certificate" link.
- The timeline sorts itself by date and groups by year. Its bar scale runs Nov 2024 – Dec 2026; to extend it, change `SCALE_LEN` and `NOW` at the top of `src/components/Timeline.tsx`.
- Keep certificates and one-off workshops in `experience.training`, not the timeline.

## Add a project
In `projects.items`, copy a block. Important fields:
- `labels`: e.g. `["Academic Project", "Code Project"]`, `["Team Project"]`, `["Early-stage Venture", "Prototype"]`
- `categories`: any of `ai`, `software`, `product`, `academic`
- `symbol`: cover graphic — `nodes`, `ledger`, `pixels`, `wave` or `grid`
- `status`: honest current state; `prototype: true` shows it in amber
- `repo`: only a verified, presentable repository URL (otherwise `""`)
- `caseStudy`: a page link if one exists (otherwise `""`)

Never add screenshots that aren't real. Covers are typographic on purpose.

## Add a certificate
1. Save the image as `public/images/certificates/name.jpg` (about 1400 px wide).
2. Add to `experience.training`: `{ name, issuer, kind, date, certificate: "/images/certificates/name.jpg" }`.
3. `kind` must say what it really is: "Certificate of completion", "Participation", "Attendance", or "Completed (no certificate issued)". Use `certificate: ""` if there's no image.

## Add a workshop or speaking topic
In `speaking.topics`: `id`, `title`, `audience` (list), `content` (list), `formats` (list), and `subtopic` (`{ title: "", audience: "", text: "" }` when there's none). Topics are always labelled "Proposed topic".

## Recording a delivered speaking engagement
Only after it has actually happened:
1. Add a timeline milestone (lane `learning` or `leadership`, type "Talk" or "Workshop") with the real date, organizer and a verified result (e.g. "Delivered to ~40 students" only if you know the number).
2. Optionally add a photo you own to `public/images/` and link it.
3. Update `speaking.topicsLead` so it no longer says "None has been delivered yet".

## Update social links and email
`src/config/site.ts` → `email` and `social`. Paste full URLs. `""` hides a platform everywhere (footer, contact, about). GitHub and Linktree are empty until you have presentable links.

## Update Arabic and English text
Edit the same item in both files. Keep `id`, `href`, `lane`, `category`, `symbol`, `dims` and dates in `start`/`end` identical — only translate visible text. Technical terms (RAG, FastAPI, LangChain…) stay in English. For "C++" inside Arabic sentences, keep the invisible direction marks already used in `ar.ts` (copy an existing "C++" from that file) so it doesn't display as "++C".

## Replace the CV PDF
Replace `public/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf`, keeping the exact filename. The links `/cv` and the download buttons update automatically.

## Add a new free tool
See `docs/TOOLS-SPEC.md` → "Adding a new tool". Add it to the navigation only once it works.

## Edit tool descriptions and limits
- Descriptions, "what it can't do" and privacy text: `tools.audit` / `tools.planner` in both content files.
- Limits (environment variables, no code change):
  - `TOOLS_PER_VISITOR_DAILY` — runs per visitor per tool per day (default 3)
  - `TOOLS_AI_DAILY_LIMIT` — total AI runs per day (default 60)
  - `TOOLS_AI_DISABLED=true` — switch AI off instantly (the audit keeps its measured checks)
