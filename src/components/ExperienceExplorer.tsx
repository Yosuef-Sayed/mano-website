"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { experience, experienceCategories, type ExperienceCategory } from "@/content/experience";
import { ArrowRight, Chevron } from "./Icons";
import { StatusBadge } from "./ui";

export function ExperienceExplorer() {
  const [filter, setFilter] = useState<ExperienceCategory | "all">("all");
  const [open, setOpen] = useState<Set<string>>(() => new Set(["athathi"]));

  // Deep links like /experience#reds open and reveal that role.
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.slice(1);
      if (id && experience.some((e) => e.id === id)) {
        setFilter("all");
        setOpen((s) => new Set(s).add(id));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const shown = experience.filter((e) => filter === "all" || e.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter experience by category">
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
        {experienceCategories.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} roles shown</p>

      <ol className="mt-10 space-y-4">
        {shown.map((e) => {
          const isOpen = open.has(e.id);
          return (
            <li key={e.id} id={e.id} className="scroll-mt-28">
              <article className={`grid gap-4 rounded-2xl border p-5 transition sm:p-7 md:grid-cols-[170px_1fr] ${isOpen ? "border-teal/40 bg-surface/70" : "border-line bg-surface/40"}`}>
                <div className="flex items-center gap-3 md:block">
                  <p className="font-display text-sm font-bold text-paper/90">
                    {e.start}{e.end ? ` – ${e.end}` : ""}
                  </p>
                  <p className="tag md:mt-2">{e.type}</p>
                  {e.current && <p className="mt-0 text-xs font-semibold text-teal md:mt-2">● Current</p>}
                </div>
                <div>
                  <button
                    type="button"
                    className="group flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`${e.id}-details`}
                    onClick={() => toggle(e.id)}
                  >
                    <span>
                      <span className="block text-xl font-bold transition group-hover:text-teal sm:text-2xl">{e.role}</span>
                      <span className="mt-0.5 block text-paper/80">
                        {e.org}
                        {e.orgNote && <span className="text-muted"> · {e.orgNote}</span>}
                      </span>
                    </span>
                    <Chevron className={`mt-1.5 size-5 shrink-0 text-muted transition ${isOpen ? "rotate-180 text-teal" : ""}`} />
                  </button>
                  <p className="mt-3 text-paper/75">{e.summary}</p>

                  <div id={`${e.id}-details`} hidden={!isOpen} className="mt-5">
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">What I did</p>
                    <ul className="mt-2 space-y-2">
                      {e.did.map((d) => (
                        <li key={d} className="flex gap-3 text-paper/85">
                          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-teal" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    {e.exposure && (
                      <>
                        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Exposure</p>
                        <p className="mt-1 text-sm text-paper/75">{e.exposure.join(" · ")}</p>
                      </>
                    )}
                    {e.earlierRoles && (
                      <>
                        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Earlier roles in Star Union</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {e.earlierRoles.map((r) => (
                            <li key={r.role}><b>{r.role}</b> <span className="text-muted">· {r.dates}</span></li>
                          ))}
                        </ul>
                      </>
                    )}
                    {e.status && <div className="mt-5"><StatusBadge tone="amber">{e.status}</StatusBadge></div>}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
                      {e.skills.map((s) => <li key={s} className="chip">{s}</li>)}
                    </ul>
                    {e.links?.map((l) => (
                      <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                        {l.label} <ArrowRight />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
