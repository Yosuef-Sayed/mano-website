# Deployment guide

## 1. Run locally
```bash
npm install
cp .env.example .env.local   # optional locally; forms fall back to .data/submissions.json
npm run dev
```

## 2. Build
```bash
npm run lint
npm run build
npm start                    # serves the production build on :3000
```

## 3. Deploy (recommended: Vercel)
1. Push the `mano-website` folder to a GitHub repository (private is fine).
2. In Vercel: **Add New → Project → Import** the repository. The framework is detected automatically.
3. Add the environment variables from `.env.example` (Settings → Environment Variables).
4. Deploy.

Any Node.js host that runs `npm run build && npm start` also works (Node 20+).

> **Rate limiting** is in-memory per server instance. That's fine for a personal site. If spam ever becomes a problem, add Cloudflare Turnstile or an Upstash rate limiter.

## 4. Make the forms deliver (required in production)
In production, a form only reports success after it has been **stored** or **emailed**. With neither configured, it tells visitors to email you directly instead of pretending to work.

### Supabase (storage + /admin inbox)
1. Create a free project at supabase.com.
2. SQL editor → run [`supabase.sql`](supabase.sql).
3. Project Settings → API: copy the **Project URL** to `SUPABASE_URL` and the **service_role** key to `SUPABASE_SERVICE_ROLE_KEY`. This key is server-only; it is never sent to the browser.

### Resend (email notifications)
1. Create an account at resend.com and verify your domain.
2. Set `RESEND_API_KEY`, `NOTIFY_EMAIL_TO` (your inbox) and `NOTIFY_EMAIL_FROM` (e.g. `MANO Website <hello@your-domain.com>`).
3. Optionally set `SEND_VISITOR_ACK=true` to send visitors a "received / pending confirmation" email.

### Admin inbox
Set `ADMIN_PASSWORD` (a long random string) and optionally `ADMIN_USER`. Then open `/admin`. Without a password, `/admin` returns 404.

## 5. Custom domain
1. Vercel → Project → Settings → Domains → add your domain, then follow the DNS instructions.
2. Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` and redeploy. This updates canonical URLs, the sitemap, Open Graph links and structured data.
3. In Resend, verify the same domain so notification emails come from it.

## 6. Update the CV
Replace `public/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf` (same filename) and redeploy. `/cv` always points to it.

## 7. Verify after each deploy
- [ ] Every nav link and dropdown item opens the right page; the mobile menu opens and closes.
- [ ] `/cv` downloads the latest PDF.
- [ ] Send a test from `/contact`: the success message appears, the row shows in `/admin`, and the email arrives.
- [ ] Send a test booking from `/book`: the success message says **pending confirmation**, and the status in `/admin` is "Pending confirmation".
- [ ] `/admin` asks for a password; `/sitemap.xml` and `/robots.txt` use the real domain.
- [ ] Share the home URL in LinkedIn's Post Inspector to check the preview image.
- [ ] Delete your test submissions in Supabase.
