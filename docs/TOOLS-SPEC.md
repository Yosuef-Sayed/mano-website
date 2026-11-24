# Free tools: product & technical specification

Status, Nov 2026:

| Tool | Status |
|---|---|
| Website Clarity & SEO Audit | **Built** |
| Project Idea & Customer Discovery Planner | **Built** |
| Pitch Deck Clarity Review | Specified only |
| Brand Presence & CTA Review | Specified only |
| AI Use-Case Finder | Specified only |

## Shared platform (applies to every tool)

| Area | Decision |
|---|---|
| Model | `TOOLS_MODEL` (default `claude-opus-5-5`). Structured output (Zod schema), adaptive thinking at `medium` effort, server-side refusal fallback. |
| Keys | `ANTHROPIC_API_KEY`, server-only. Never sent to the browser. |
| Cost ceiling | `TOOLS_AI_DAILY_LIMIT` AI runs per day across all tools (default 60). Per visitor: `TOOLS_PER_VISITOR_DAILY` runs per tool per day (default 3). |
| Limits store | Upstash Redis (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`). **AI features are disabled in production without it**, because per-instance memory cannot enforce a daily ceiling on serverless hosting. |
| Prompt injection | All scanned/uploaded/user text is wrapped in data tags. The system prompt says it is data, not instructions. The model gets **no tools**, so injected instructions have nothing to act on. |
| Honesty | Code-measured checks are labelled "measured". AI parts are labelled "AI-assisted" and must quote evidence. No scores without a stated method. No fake progress stages. |
| Storage | Inputs and results are not stored by the site. Disclosed: AI parts go to Anthropic's API under its retention policy. |
| Spam | Hidden honeypot field + rate limits. Add Cloudflare Turnstile if abuse appears. |

---

## 1. Website Clarity & SEO Audit (built)

- **Problem:** owners can't tell whether their site explains what they offer, to whom, and what to do next.
- **Audience:** founders, freelancers and small businesses.

**Inputs**
- Public URL (required).
- Purpose, audience and main offer (optional, used only as context).

**Journey**
1. Visitor enters the URL.
2. The server fetches the home page plus up to 2 same-site pages (about/services/contact first), `robots.txt` and `sitemap.xml`.
3. Deterministic checks run.
4. If AI is enabled, a messaging review runs.
5. The report shows, with a CTA to the Clarity Session.

**Outputs**
- Measured checks:
  - Title and meta description length, H1 count, skipped heading levels.
  - `lang`, viewport, canonical (including pointing to another host), noindex, Open Graph.
  - Alt-text coverage, internal links, HTTPS, robots.txt, sitemap.
  - HTML size and one server response time, labelled "not Core Web Vitals".
- AI review:
  - Overview and what works.
  - Up to 6 findings, each with priority, verbatim evidence, why it matters, the fix and an example.
  - Headline and CTA suggestions, and limitations.

**Security (SSRF)**
- Scheme and port:
  - http/https only, on default ports.
  - No credentials in the URL.
  - Blocks `localhost`, `.local` and `.internal`-style hosts.
- IP checks:
  - Every DNS answer must be public. This blocks private, loopback, link-local and metadata (169.254.169.254), CGNAT, multicast, documentation, NAT64/6to4 and IPv4-mapped private addresses.
  - The socket connects to the **validated IP** (pinned lookup), which defeats DNS rebinding.
- Redirects: followed manually, max 3, each hop re-validated.
- Size and time: 10 s timeout, 2 MB decompressed cap, HTML content type only.

**Cost**

| Part | Cost |
|---|---|
| Checks without AI | Free |
| AI review (~15–25K input, ~5–8K output tokens on Opus 5.5) | ≈ $0.15–0.25 per run (estimate, not measured) |

**Non-goals**
- Rankings, traffic, backlinks, keyword positions, Core Web Vitals.
- Crawling beyond 3 pages.
- Logged-in areas.
- Rendering JavaScript-only sites.

**Acceptance**
- Blocks every private, metadata and redirect-to-private case (tested).
- Works on real public sites (tested).
- Shows checks without AI when no key is set (tested).
- Bilingual.

## 2. Project Idea & Customer Discovery Planner (built)

- **Problem:** students and early founders build before testing their riskiest assumptions.
- **Inputs:**
  - Required: problem, who has it, proposed solution.
  - Optional: context, current alternatives, stage, constraints.
- **Outputs:**
  - Problem statement and target-user hypothesis.
  - 4–7 assumptions ranked by risk, each with a test.
  - Neutral, past-behavior interview questions.
  - 2–4 cheap experiments.
  - MVP in/out scope, evidence to collect, next steps.
  - A clear "these are hypotheses" disclaimer.
- **Rules in the prompt:** no invented markets, competitors or statistics; no leading questions; answer in the page's language.
- **Cost:** ~2–3K input, ~4–6K output tokens ≈ $0.10–0.15 per run (estimate).
- **Without AI configured:** the page shows "not available", and the Tools hub marks the card as unavailable. Nothing breaks.
- **Acceptance:** schema-valid output, bilingual. *Not yet tested against the live model: no API key was available during the build.*

## 3. Pitch Deck Clarity Review (next candidate)

- **Inputs:**
  - A PDF of ≤ 4 MB and ≤ 25 pages. This sits under Vercel's ~4.5 MB request-body limit, so no file storage is needed.
  - Project name, audience, stage, industry, optional context.
- **Processing:**
  - Validate magic bytes (`%PDF-`), size and page count.
  - Send the PDF in memory as a `document` block. Claude reads both text and slide visuals.
  - Never write it to disk, never log its contents.
- **Outputs:**
  - Narrative review and slide-by-slide comments.
  - Missing information, contradictions, weak assumptions and evidence gaps, labelled as stated / assumed / missing / needs research.
  - Prioritized plan, suggested restructure.
  - SWOT only where evidence exists.
- **Privacy copy:** "Your file is sent to Anthropic's API for analysis and is not stored by this site. It is subject to Anthropic's API data-retention policy. Remove confidential numbers before uploading."
- **Cost:** ≈ $0.35–0.50 per 20-slide deck (estimate).
- **Non-goals:** investment, financial or legal advice; market-size or competitor facts.
- **Acceptance:**
  - Rejects non-PDF, oversized and over-long files.
  - Never claims deletion guarantees.
  - Quotes slide text as evidence.

## 4. Brand Presence & CTA Review (later)

- **Inputs:** public profile URL, bio text, audience, goal, and up to 4 screenshots (profile, cover, 2 posts).
- **Rules:**
  - No scraping of login-walled platforms.
  - Only user-provided text and images, plus public pages fetched with the same SSRF-safe fetcher.
  - Never estimate followers, engagement or demographics.
- **Outputs:** positioning clarity, bio and CTA clarity, visual consistency, content alignment, trust signals.

## 5. AI Use-Case Finder (future experiment)

- **Inputs:** business type, repeated tasks with volume, current tools, review needs, sensitive data.
- **Outputs:**
  - Ranked use cases.
  - A suggested workflow with human checkpoints.
  - Complexity and limitations.
  - One low-risk first experiment.
- **Non-goal:** presenting production automation as ready to deploy.

## Adding a new tool

1. Add its copy to `tools` in `src/content/en.ts` and `src/content/ar.ts`:
   - name, goal, short, cta, `forWho` / needs / analyzes / produces / cannot / privacy, report labels.
2. Create `src/app/api/tools/<id>/route.ts`. Validate with Zod, call `visitorLimit()` and `aiBudget()` from `src/lib/tools/guard.ts`, and call `runStructured()` from `src/lib/tools/ai.ts`.
3. Create `src/app/[lang]/tools/<id>/page.tsx` with `<ToolInfo>` and a client component in `src/components/tools/`.
4. Add it to the `tools` array in `src/components/tools/ToolPicker.tsx` and to `src/app/sitemap.ts`.
