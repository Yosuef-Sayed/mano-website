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
| Change the hero text | `identity.tagline`, `identity.role`, `identity.supporting` in both content files |
| Add an experience entry | `experience.timeline.entries` (+ optional `experience.details` for "What I did") |
| Add an organization logo | file in `public/images/logos/<key>.svg|png` — see below |
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
In both content files (order on the page: name → tagline → role → supporting line → buttons):
- `identity.tagline` — "I connect technology with the problems that matter."
- `identity.role` — "AI Applications & Software Development"
- `identity.supporting` — "Product & Business Thinking"
- `meta.defaultTitle` / `meta.description` — what Google and LinkedIn show

Writing style: short and direct. Show evidence (roles, numbers, projects) instead of adjectives, and don't add disclaimers about being a student or not an expert — Education lives in its own section.

## Add an experience entry (timeline)
The Experience page is one timeline. Each milestone is an item in `experience.timeline.entries`:
```ts
{ id: "my-role", logo: "my-org", roleId: "my-role", start: "2027-02", end: "", date: "Feb 2027 – Present",
  role: "Role title", org: "Organization", type: "Internship",
  text: "One line: what it was.", result: "One verified result.", href: "/experience#my-role" }
```
- `start` / `end`: `YYYY-MM`. Use `end: ""` for ongoing. The timeline sorts and groups by year itself.
- `type`: what kind of engagement it really was (Employment, Internship, Early-stage venture, Leadership role, Student activity, Training, Program, Milestone).
- `logo`: the organization key used for its mark/logo (see "Organization logos").
- `roleId`: links to a block in `experience.details` that shows under **What I did**. Use `""` for none.
- Optional `certificate: "/images/certificates/file.jpg"` adds a Certificate button (opens in the in-page viewer).
- Overlapping roles are fine: each card shows its real date range.

`experience.details` holds the expandable part: `{ id, did: [...], exposure: [...], skills: [...], status, link: { label, href }, earlierRoles: [...] }` (`exposure` = what you learned about, not what you did).

Add the same entry, translated, in `ar.ts` (keep `id`, `logo`, `roleId`, `start`, `end`, `href` identical).

## Organization logos
Until real logos are added, each organization shows a neutral initials mark (never presented as an official logo).
To use an official logo, save it as `public/images/logos/<logo key>.svg` (or `.png`, `.jpg`, `.webp`) — e.g. `star-union.png`, `reds.svg`, `athathi.png`, `plan-bee.png`, `nextgen.png`, `sbs.png`, `stp.png`, `tiec.png`. It replaces the mark automatically; no code change.

## Add a project
In `projects.items`, copy a block. Important fields:
- `labels`: e.g. `["Academic Project", "Code Project"]`, `["Team Project"]`, `["Early-stage Venture", "Prototype"]`
- `categories`: any of `ai`, `software`, `product`, `academic`
- `symbol`: cover graphic — `nodes`, `ledger`, `pixels`, `wave` or `grid`
- `status`: honest current state; `prototype: true` shows it in amber
- `repo`: only a verified, presentable repository URL (otherwise `""`)
- `caseStudy`: a page link if one exists (otherwise `""`)

Never add screenshots that aren't real. Each project has an original illustrated cover in `src/components/ProjectCover.tsx` (keyed by project `id`), labelled "Illustration". For a new project, add a small SVG function there; without one, the card shows a plain dark cover.

## Add a certificate
1. Save the image as `public/images/certificates/name.jpg` (about 1400 px wide).
2. Add to `experience.training`: `{ name, issuer, kind, date, certificate: "/images/certificates/name.jpg" }`. Images and PDFs both open in the in-page viewer (zoom + download), not a new tab.
3. `kind` must say what it really is: "Certificate of completion", "Participation", "Attendance", or "Completed (no certificate issued)". Use `certificate: ""` if there's no image.

## Add a workshop or speaking topic
In `speaking.topics`: `id`, `title`, `audience` (list), `content` (list), `formats` (list), and `subtopic` (`{ title: "", audience: "", text: "" }` when there's none). Each topic gets "Invite Me to Speak" and "Request a Workshop" buttons that open the form with the topic filled in.

## Recording a delivered speaking engagement
Only after it has actually happened:
1. Add a timeline milestone (type "Talk" or "Workshop") with the real date, organizer and a verified result (e.g. "Delivered to ~40 students" only if you know the number).
2. Optionally add a photo you own to `public/images/` and link it.
3. Optionally mention it in `speaking.lead`. Never list a talk that hasn't happened.

## Update social links and email
`src/config/site.ts` → `email` and `social`. Paste full URLs. `""` hides a platform everywhere (footer, contact, about). GitHub and Linktree are empty until you have presentable links.

## Update Arabic and English text
Edit the same item in both files. Keep `id`, `href`, `logo`, `roleId`, `symbol`, `dims` and dates in `start`/`end` identical — only translate visible text. Arabic is professional Egyptian Arabic (e.g. "شوف شغلي", "ناقش معايا فرصة"), not formal MSA. Technical terms (RAG, FastAPI, LangChain…) stay in English. For "C++" inside Arabic sentences, keep the invisible direction marks already used in `ar.ts` (copy an existing "C++" from that file) so it doesn't display as "++C".

## Replace the CV PDF
Replace `public/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf`, keeping the exact filename. The links `/cv` and the download buttons update automatically.

## Add a new free tool
See `docs/TOOLS-SPEC.md` → "Adding a new tool". The Tools page only lists tools that work: the Project Idea Planner stays hidden (its page returns 404) until `ANTHROPIC_API_KEY` and Upstash Redis are set, then appears automatically.

## Links that open a form
Use `#form` (Contact, Book) or `#invite` (Speaking) so visitors land on the form, e.g. `/contact?intent=hiring#form`, `/book#form`, `/speaking?topic=...&format=workshop#invite`. Intents: `hiring`, `collaboration`, `speaking`, `startup`, `general`.

## Edit tool descriptions and limits
- Descriptions, "what it can't do" and privacy text: `tools.audit` / `tools.planner` in both content files.
- Limits (environment variables, no code change):
  - `TOOLS_PER_VISITOR_DAILY` — runs per visitor per tool per day (default 3)
  - `TOOLS_AI_DAILY_LIMIT` — total AI runs per day (default 60)
  - `TOOLS_AI_DISABLED=true` — switch AI off instantly (the audit keeps its measured checks)
