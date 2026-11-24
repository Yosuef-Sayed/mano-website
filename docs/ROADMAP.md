# Future roadmap (not built yet, on purpose)

The first version is focused on the portfolio, services inquiries, collaboration, speaking and meeting **requests**. The code is structured so the following can be added without a rebuild.

## 1. Calendar synchronization
- Add a `lib/calendar.ts` adapter (Google Calendar API, or Cal.com's API used only as a backend).
- Booking form: fetch real free/busy slots for the chosen date and replace the time-window select with real slots.
- On admin "Confirm", create the calendar event and email the meeting link.
- Until then, never show slots that are not live.

## 2. Payment integration (paid sessions)
- Statuses already exist: `awaiting_payment` → `confirmed`.
- Add `price` and `currency` to `sessionTypes` and `services` (show them only when set).
- Integrate a provider (e.g. Stripe Payment Links, or Paymob for Egypt) **server-side**: create a checkout link when a booking moves to Awaiting payment, and use a webhook to set Confirmed.
- Never collect card details in the site's own forms.

## 3. Admin dashboard
- Today: `/admin` with Basic auth, filters, status changes and notes.
- Next: Supabase Auth login, search, CSV export, email templates for confirm/decline, and a delete action for privacy requests.

## 4. Content publishing
- Fill `contentItems` with Reels and posts as they are published.
- Optional `/notes` articles from MDX files in the repository (no CMS needed).

## 5. Advanced inquiry management
- Auto-replies by inquiry type, tags, follow-up reminders, and Turnstile captcha if spam appears.

## Arabic version
- Move UI strings to `src/i18n/{en,ar}.ts` and duplicate content files per locale.
- Add a `[locale]` route segment with `lang="ar" dir="rtl"`, logical CSS properties (`ps-`/`pe-` instead of `pl-`/`pr-`) and an Arabic body font (e.g. IBM Plex Sans Arabic).
- Launch only when every page is translated. No partial switch.

## Other possibilities
Testimonials (only real, with permission), workshop registration, speaking materials, a newsletter and digital products.
