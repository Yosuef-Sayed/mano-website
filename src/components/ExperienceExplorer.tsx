"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, Chevron } from "./Icons";
import { StatusBadge } from "./ui";

type X = Content["experience"];

export function ExperienceExplorer({ lang, x }: { lang: Lang; x: X }) {
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<Set<string>>(() => new Set(["athathi"]));

  // Deep links like /experience#reds open and reveal that role.
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.slice(1);
      if (id && x.roles.some((e) => e.id === id)) {
        setFilter("all");
        setOpen((s) => new Set(s).add(id));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [x.roles]);

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const shown = x.roles.filter((e) => filter === "all" || e.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={x.filterLabel}>
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{x.filterAll}</button>
        {x.categories.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} {x.shown}</p>

      <ol className="mt-8 space-y-4">
        {shown.map((e) => {
          const isOpen = open.has(e.id);
          return (
            <li key={e.id} id={e.id} className="scroll-mt-28">
              <article className={`grid gap-4 rounded-2xl border p-5 transition sm:p-7 md:grid-cols-[170px_1fr] ${isOpen ? "border-teal/40 bg-surface/70" : "border-line bg-surface/40"}`}>
                <div className="flex flex-wrap items-center gap-3 md:block">
                  <p className="font-display text-sm font-bold text-paper/90">{e.dates}</p>
                  <p className="tag md:mt-2">{e.type}</p>
                </div>
                <div>
                  <button
                    type="button"
                    className="group flex w-full items-start justify-between gap-4 text-start"
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
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{x.whatIDid}</p>
                    <ul className="mt-2 space-y-2">
                      {e.did.map((d) => (
                        <li key={d} className="flex gap-3 text-paper/85">
                          <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-teal" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    {e.exposure.length > 0 && (
                      <>
                        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{x.exposure}</p>
                        <p className="mt-1 text-sm text-paper/75">{e.exposure.join(" · ")}</p>
                      </>
                    )}
                    {e.earlierRoles.length > 0 && (
                      <>
                        <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{x.earlier}</p>
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
                    <ul className="flex flex-wrap gap-1.5" aria-label={x.skills}>
                      {e.skills.map((s) => <li key={s} className="chip">{s}</li>)}
                    </ul>
                    {e.link.href && (
                      <Link href={lh(lang, e.link.href)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                        {e.link.label} <ArrowRight />
                      </Link>
                    )}
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
