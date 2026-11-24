# Content management guide

All content is plain TypeScript data. Edit a file, save, and the site updates (redeploy in production).
**Rule of thumb:** only publish facts that are in the latest CV or that you can prove.

## Update the CV
1. Export the new PDF.
2. Replace `public/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf` (keep the exact filename).
3. Optionally update `site.cv.updated` in `src/config/site.ts`.

The public links `/cv` and `/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf` never change, so links shared on LinkedIn keep working.

## Contact details and social links — `src/config/site.ts`
- `email`, `location`, `timezone`.
- `social`: paste a full URL to show a platform; leave `""` to hide it. Only LinkedIn is filled in now. Instagram, Facebook, TikTok, YouTube, GitHub and Linktree are empty because no verified URLs were supplied.
- Add GitHub only when 2–3 repositories are presentable.

## Experience — `src/content/experience.ts`
Each role has `did` (what you actually did), optional `exposure` (what you learned about), `status`, `skills`, `dimensions` (which Value Loop dimensions it supports) and a `type` tag (Employment, Internship, Startup, Leadership role, Student activity, Training, Personal project).

**When NextGen finishes:** set `end: "Nov 2026"`, remove `current: true`, replace the `status` line, and add one `did` line describing the final project and its result. Also update the Value Loop evidence text in `src/content/valueLoop.ts` ("Sep 2026 – Present").

Training items are in the same file (`training`). Keep the `kind` honest: completion, participation, attendance, or completed.

## Projects — `src/content/projects.ts`
- `features`, `role`, `tech`, `status`, `team`.
- `repo`: add a repository URL only when it is verified and presentable; a "Repository" link appears automatically.
- The ATHATHI case study text lives in `src/app/projects/athathi/page.tsx`. Its status line is the `STATUS` constant near the top — update it only when the evidence changes (e.g. frontend integration completed).

## Value Loop, proof numbers and approach — `src/content/valueLoop.ts`
- `dimensions[].evidence` controls what each node reveals and where it links.
- `proofPoints`: every number has its own context. Never add numbers together or add unverified metrics.

## Services, speaking, sessions — `src/content/services.ts`
Each service and session type has a `status`:

| Status | Effect |
|---|---|
| `published` | Shown, request button active |
| `inquiry` | Shown as "Inquiry only" |
| `pilot` | Shown as "Pilot" |
| `unavailable` | Shown, request disabled |
| `hidden` | Not shown anywhere (draft) |

No prices, packages or guarantees are published. Add them only when they are real decisions.

- `speakingTopics` — topics on `/speaking`. Add past talks to that page only once they have happened.
- `sessionTypes` — booking options on `/book`.
- `bookingSettings` — default meeting mode, minimum notice days, how far ahead visitors can request, and time windows.
- `collaborationTypes`, `careerAreas` — options on `/collaborate`.

## MANO content gallery — `src/content/brandContent.ts`
Add each **unique** video once in `contentItems` with its platform links (not one entry per platform). Put thumbnails in `public/images/content/`. The gallery appears on `/about#content` automatically once the list has items. Don't add follower, view or engagement numbers unless they are current and real.

## Images
- The portrait is `public/images/mano-portrait.jpg`. Replace it with the same filename to update it everywhere, including the social preview image.
- Never use generated photos of yourself or fake product screenshots. Project cards use designed illustrations on purpose.

## Managing inquiries and bookings
Go to `/admin` (set `ADMIN_PASSWORD` first). You can filter by form, change status (New → Under review → Pending confirmation → Awaiting payment → Confirmed → Completed / Cancelled) and keep private notes.
Bookings start as **Pending confirmation**. The visitor is told it is not confirmed. Confirm by email with the meeting link, then set the status to Confirmed.

## Arabic version
The site is English-first. The layout already sets `lang`/`dir` in `src/app/layout.tsx` and loads an Arabic display font (used for the name in the hero). For a full Arabic version, see [ROADMAP.md](ROADMAP.md#arabic-version). Don't add half-translated pages.
