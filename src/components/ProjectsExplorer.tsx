"use client";

import Link from "next/link";
import { useState } from "react";
import { projectCategories, projects, type Project, type ProjectCategory } from "@/content/projects";
import { ArrowRight, ArrowUpRight, Chevron } from "./Icons";
import { StatusBadge } from "./ui";

/** A designed visual (not a screenshot) so nothing looks like an interface that doesn't exist. */
function Glyph({ p }: { p: Project }) {
  const letters = p.name.replace(/[^A-Z]/g, "").slice(0, 2) || p.name.slice(0, 2);
  return (
    <div aria-hidden className="relative h-28 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-navy to-ink">
      <svg viewBox="0 0 200 80" className="absolute inset-0 size-full opacity-60" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 25} y1="80" x2={i * 25 + 40} y2="0" stroke={i % 3 === 0 ? "#14B8A6" : "rgb(237 237 237 / .08)"} strokeWidth="0.6" />
        ))}
      </svg>
      <span className="absolute bottom-2 right-4 font-brush text-5xl text-paper/15">{letters}</span>
      <span className="absolute left-4 top-3 text-[10px] font-semibold tracking-[0.25em] text-teal uppercase">{p.context}</span>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const [more, setMore] = useState(false);
  const preview = p.features.length > 6 && !more ? p.features.slice(0, 6) : p.features;
  return (
    <article id={p.id} className="card flex h-full scroll-mt-28 flex-col p-5 sm:p-6">
      {p.id === "manopix" && <span id="cpp" className="relative -top-28 block" />}
      <Glyph p={p} />
      <h3 className="mt-5 text-2xl font-bold">{p.name}</h3>
      <p className="text-sm text-muted">{p.subtitle}{p.team ? ` · ${p.team}` : ""}</p>
      <p className="mt-3 text-paper/80">{p.purpose}</p>

      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{p.featuresLabel ?? "Main functionality"}</p>
      <ul className={`mt-2 ${p.features.length > 6 ? "flex flex-wrap gap-1.5" : "space-y-1.5 text-sm text-paper/80"}`} id={`${p.id}-features`}>
        {preview.map((f) =>
          p.features.length > 6 ? (
            <li key={f} className="chip">{f}</li>
          ) : (
            <li key={f} className="flex gap-2"><span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-teal" />{f}</li>
          ),
        )}
      </ul>
      {p.features.length > 6 && (
        <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} aria-controls={`${p.id}-features`} className="mt-2 inline-flex items-center gap-1 self-start text-sm font-semibold text-teal">
          {more ? "Show fewer" : `Show all ${p.features.length}`} <Chevron className={`size-4 transition ${more ? "rotate-180" : ""}`} />
        </button>
      )}

      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">My role</p>
      <p className="mt-1 text-sm text-paper/80">{p.role.join(" · ")}</p>

      <div className="mt-auto pt-5">
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <StatusBadge tone={p.status.toLowerCase().includes("prototype") ? "amber" : "muted"}>{p.status}</StatusBadge>
          {p.caseStudy && (
            <Link href={p.caseStudy} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">Case study <ArrowRight /></Link>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">Repository <ArrowUpRight /></a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsExplorer() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const featured = projects.find((p) => p.featured)!;
  const rest = projects.filter((p) => !p.featured && (filter === "all" || p.categories.includes(filter)));
  const showFeatured = filter === "all" || featured.categories.includes(filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
        {projectCategories.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{rest.length + (showFeatured ? 1 : 0)} projects shown</p>

      {showFeatured && (
        <Link
          href="/projects/athathi"
          className="group relative mt-10 grid overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy via-surface to-ink p-7 transition hover:border-teal/60 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-10 grain"
        >
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-amber/10 blur-3xl" />
          <div className="relative">
            <p className="eyebrow">Featured case study · Startup</p>
            <h2 className="h-display mt-3 text-5xl sm:text-6xl">{featured.name}</h2>
            <p className="mt-2 text-muted">{featured.subtitle}</p>
            <p className="mt-5 max-w-xl text-lg text-paper/85">{featured.purpose}</p>
            <div className="mt-6"><StatusBadge tone="amber">{featured.status}</StatusBadge></div>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-teal">
              Read the full case study <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </div>
          <ul className="relative mt-8 space-y-3 lg:mt-0">
            {featured.features.map((f) => (
              <li key={f} className="rounded-xl border border-line bg-ink/50 px-4 py-3 text-sm text-paper/85">{f}</li>
            ))}
          </ul>
        </Link>
      )}

      <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.id}><ProjectCard p={p} /></li>
        ))}
      </ul>
    </div>
  );
}
