# MANO design system

Derived from the MANO Brand Identity sheet: cinematic, dark, editorial. **Same DNA. Different stories.**

## Color tokens (`src/app/globals.css`, `@theme`)
| Token | Hex | Use |
|---|---|---|
| `ink` | #050B0A | Page background (near black) |
| `navy` | #081F2A | Deep surfaces, header menu, gradients |
| `surface` / `surface-2` | #0B2531 / #10303E | Cards and raised panels |
| `paper` | #EDEDED | Primary text |
| `muted` | #9FB0B6 | Supporting text (AA contrast on ink) |
| `teal` | #14B8A6 | Interaction: links, focus, selected nodes, primary buttons, underlines |
| `teal-soft` | #5EEAD4 | Primary button hover |
| `amber` | #FFB15A | Sparingly: step numbers, "in progress" status, warm glows |
| `line` | paper @ 10% | Borders and dividers |

Rules: no bright baby blue, no neon, amber is never a main color, and gradients are only soft background glows.

## Typography
| Role | Font | Notes |
|---|---|---|
| Body | Inter | 16–18px, relaxed leading |
| Headings (`h-display`, `font-display`) | Archivo 700–900 | Tight tracking, balanced wrapping |
| Brand accent (`font-brush`) | Permanent Marker | Only the "MANO" wordmark and project glyphs, never paragraphs or navigation |
| Arabic (`font-arabic`) | Lalezar | Name accent only, always with `lang="ar" dir="rtl"` |
| Labels (`eyebrow`) | Inter 600, uppercase, 0.22em tracking, teal | Section kickers |

## Components (classes in `globals.css`, React in `src/components`)
- **Buttons:** `btn btn-primary` (teal, one per area), `btn btn-secondary` (outline), `btn btn-ghost` (text). All have a 44px minimum height.
- **Chips:** `chip` for skills and filters. Filter chips use `aria-pressed`.
- **Tags:** `tag` for small uppercase metadata (type, technology).
- **Cards:** `card` (rounded-2xl, line border, translucent surface).
- **Status:** `<StatusBadge tone="teal|amber|muted">`. Amber means in progress or a prototype.
- **Sections:** `<PageHero>`, `<SectionHead>`, `<CtaBand>`, `<ArrowLink>` in `components/ui.tsx`.
- **Forms:** `FormShell`, `TextField`, `TextArea`, `Select` and `RadioCards` in `components/forms/FormKit.tsx`. Labels are always visible, errors appear inline with `aria-invalid` and `aria-describedby`, and there is a status region for screen readers.
- **Brush underline:** `brush-underline` for one key word per headline.

## Layout
- Container: `container-x` (max 72rem, 16px side gutter on mobile).
- Section rhythm: 96–128px between major sections (`mt-24 sm:mt-32`).
- Grids collapse to one column below 640px; two-column hero and case-study sidebar from 1024px.

## Interaction patterns
- **Value Loop:** a desktop radial with an ARIA tablist (arrow keys, Home, End). On mobile it becomes a vertical stepper (accordion). Selecting a node highlights the related Featured Work cards.
- **Experience:** category filters and expandable roles (`aria-expanded`). Deep links like `/experience#reds` open that role.
- **Projects:** category filters, "Show all" for long feature lists, case-study links.
- **Motion:** gentle reveal-on-scroll (content stays visible without JavaScript), a slow ring rotation and hover lifts. Everything is disabled under `prefers-reduced-motion`.
- **Focus:** a 2px teal outline on every interactive element, plus a skip link.
