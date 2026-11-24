"use client";

import Link from "next/link";
import { useState } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, ArrowUpRight, Chevron } from "./Icons";
import { StatusBadge } from "./ui";

type P = Content["projects"];
type Item = P["items"][number];

/** Restrained symbol per project. Decorative only — never presented as a screenshot. */
function Symbol({ kind }: { kind: string }) {
  const c = "#14B8A6";
  const dim = "rgb(237 237 237 / .18)";
  switch (kind) {
    case "grid":
      return (
        <svg viewBox="0 0 60 60" className="size-16">
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((q) => <rect key={`${r}${q}`} x={4 + q * 18} y={4 + r * 18} width="14" height="14" rx="2" fill="none" stroke={(r + q) % 4 === 0 ? c : dim} strokeWidth="1.5" />))}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 80 40" className="h-12 w-24">
          {[6, 14, 22, 30, 10, 26, 18, 8, 28, 16, 24, 12].map((h, i) => <rect key={i} x={2 + i * 6.5} y={20 - h / 2} width="3" height={h} rx="1.5" fill={i % 3 === 0 ? c : dim} />)}
        </svg>
      );
    case "pixels":
      return (
        <svg viewBox="0 0 60 60" className="size-16">
          {Array.from({ length: 36 }).map((_, i) => <rect key={i} x={(i % 6) * 10 + 1} y={Math.floor(i / 6) * 10 + 1} width="8" height="8" fill={[7, 14, 21, 28, 9, 16].includes(i) ? c : dim} opacity={0.4 + ((i * 7) % 6) / 10} />)}
        </svg>
      );
    case "ledger":
      return (
        <svg viewBox="0 0 60 60" className="size-16" fill="none" strokeWidth="1.5">
          {[12, 22, 32, 42].map((y, i) => <line key={y} x1="6" x2={i === 3 ? 34 : 54} y1={y} y2={y} stroke={i === 3 ? c : dim} />)}
          <path d="M40 46l6-6 6 6" stroke={c} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 60" className="h-14 w-20" fill="none" strokeWidth="1.5">
          {[[14, 30], [40, 12], [66, 30], [40, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" stroke={c} />)}
          <path d="M19 30h16M45 12l17 15M45 48l17-15M40 17v26" stroke={dim} />
        </svg>
      );
  }
}

function Cover({ p }: { p: Item }) {
  return (
    <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-line bg-gradient-to-br from-navy to-ink p-4">
      <div className="flex flex-wrap gap-1.5">
        {p.labels.map((l) => <span key={l} className="rounded bg-ink/70 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-teal uppercase">{l}</span>)}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="latin font-display text-2xl font-extrabold leading-none text-paper/90">{p.name}</span>
        <span aria-hidden className="shrink-0 opacity-90"><Symbol kind={p.symbol} /></span>
      </div>
    </div>
  );
}

function ProjectCard({ p, t, lang }: { p: Item; t: P; lang: Lang }) {
  const [more, setMore] = useState(false);
  const many = p.features.length > 6;
  const preview = many && !more ? p.features.slice(0, 6) : p.features;
  return (
    <article id={p.id} className="card flex h-full scroll-mt-28 flex-col p-5 sm:p-6">
      {p.id === "manopix" && <span id="cpp" className="relative -top-28 block" />}
      <Cover p={p} />
      <p className="mt-2 text-[11px] text-muted">{t.noDemo}</p>
      <h3 className="mt-3 text-2xl font-bold latin">{p.name}</h3>
      <p className="text-sm text-muted">{p.subtitle}{p.team ? ` · ${p.team}` : ""}</p>
      <p className="mt-3 text-paper/80">{p.purpose}</p>

      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{p.featuresLabel || t.mainFunctionality}</p>
      <ul className={`mt-2 ${many ? "flex flex-wrap gap-1.5" : "space-y-1.5 text-sm text-paper/80"}`} id={`${p.id}-features`}>
        {preview.map((f) =>
          many ? (
            <li key={f} className="chip">{f}</li>
          ) : (
            <li key={f} className="flex gap-2"><span aria-hidden className="mt-2.5 h-px w-2.5 shrink-0 bg-teal" />{f}</li>
          ),
        )}
      </ul>
      {many && (
        <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} aria-controls={`${p.id}-features`} className="mt-2 inline-flex items-center gap-1 self-start text-sm font-semibold text-teal">
          {more ? t.showFewer : `${t.showAll} (${p.features.length})`} <Chevron className={`size-4 transition ${more ? "rotate-180" : ""}`} />
        </button>
      )}

      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{t.myRole}</p>
      <p className="mt-1 text-sm text-paper/80">{p.role.join(" · ")}</p>

      <div className="mt-auto pt-5">
        <ul className="flex flex-wrap gap-1.5" aria-label={t.technologies}>
          {p.tech.map((x) => <li key={x} className="tag">{x}</li>)}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <StatusBadge tone={p.prototype ? "amber" : "muted"}>{p.status}</StatusBadge>
          {p.caseStudy && <Link href={lh(lang, p.caseStudy)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">{t.caseStudy} <ArrowRight /></Link>}
          {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">{t.repository} <ArrowUpRight /></a>}
        </div>
      </div>
    </article>
  );
}

export function ProjectsExplorer({ lang, t }: { lang: Lang; t: P }) {
  const [filter, setFilter] = useState<string>("all");
  const featured = t.items.find((p) => p.featured)!;
  const rest = t.items.filter((p) => !p.featured && (filter === "all" || p.categories.includes(filter)));
  const showFeatured = filter === "all" || featured.categories.includes(filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t.filterLabel}>
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{t.filterAll}</button>
        {t.categories.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{rest.length + (showFeatured ? 1 : 0)} {t.shown}</p>

      {showFeatured && (
        <Link
          href={lh(lang, "/projects/athathi")}
          className="group relative mt-10 grid overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy via-surface to-ink p-7 transition hover:border-teal/60 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-10 grain"
        >
          <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 size-96 rounded-full bg-amber/10 blur-3xl" />
          <div className="relative">
            <p className="eyebrow">{t.featuredEyebrow}</p>
            <h2 className="h-display latin mt-3 text-5xl sm:text-6xl">{featured.name}</h2>
            <p className="mt-2 text-muted">{featured.subtitle}</p>
            <p className="mt-5 max-w-xl text-lg text-paper/85">{featured.purpose}</p>
            <div className="mt-6"><StatusBadge tone="amber">{featured.status}</StatusBadge></div>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-teal">
              {t.readCaseStudy} <ArrowRight className="size-4" />
            </span>
          </div>
          <ul className="relative mt-8 space-y-3 lg:mt-0">
            {featured.features.map((f) => (
              <li key={f} className="rounded-xl border border-line bg-ink/50 px-4 py-3 text-sm text-paper/85">{f}</li>
            ))}
          </ul>
        </Link>
      )}

      <ul className="mt-6 grid gap-5 md:grid-cols-2">
        {rest.map((p) => (
          <li key={p.id}><ProjectCard p={p} t={t} lang={lang} /></li>
        ))}
      </ul>
    </div>
  );
}
