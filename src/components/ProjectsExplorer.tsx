"use client";

import Link from "next/link";
import { useState } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, ArrowUpRight, Chevron } from "./Icons";
import { StatusBadge } from "./ui";
import { ProjectCover } from "./ProjectCover";

type P = Content["projects"];
type Item = P["items"][number];

function ProjectCard({ p, t, lang }: { p: Item; t: P; lang: Lang }) {
  const [more, setMore] = useState(false);
  const many = p.features.length > 6;
  const preview = many && !more ? p.features.slice(0, 6) : p.features;
  return (
    <article id={p.id} className="card flex h-full scroll-mt-28 flex-col p-5 sm:p-6">
      {p.id === "manopix" && <span id="cpp" className="relative -top-28 block" />}
      <ProjectCover id={p.id} label={t.illustration} tags={p.labels} className="aspect-[16/9]" />
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
          <div className="relative mt-8 lg:mt-0">
            <ProjectCover id="athathi" label={t.illustration} tags={featured.labels} className="aspect-[16/10]" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {featured.features.map((f) => (
                <li key={f} className="rounded-xl border border-line bg-ink/50 px-3 py-2 text-xs text-paper/85">{f}</li>
              ))}
            </ul>
          </div>
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
