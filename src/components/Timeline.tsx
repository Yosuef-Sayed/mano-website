"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, Check, Chevron, FileIcon } from "./Icons";
import { OrgMark } from "./OrgMark";
import { StatusBadge } from "./ui";

type X = Content["experience"];
type Entry = X["timeline"]["entries"][number];
type Detail = X["details"][number];

const ym = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return y * 12 + (m - 1);
};

/**
 * Year-based career timeline: a central spine (start-aligned on mobile), year markers,
 * alternating milestone cards, a scroll-driven progress line and a highlighted active milestone.
 * Each milestone can expand to show what was actually done.
 */
export function Timeline({ lang, x, logos }: { lang: Lang; x: X; logos: Record<string, string> }) {
  const t = x.timeline;
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Set<string>>(new Set());

  const sorted = [...t.entries].sort((a, b) => ym(a.start) - ym(b.start));
  const years = Array.from(new Set(sorted.map((e) => e.start.slice(0, 4))));
  const detailOf = (e: Entry): Detail | undefined => (e.roleId ? x.details.find((d) => d.id === e.roleId) : undefined);
  const domId = (e: Entry) => e.roleId || e.id;

  // Scroll progress + active milestone.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * 0.55;
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, (line - r.top) / r.height))));
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-entry]"));
      const done = items.filter((i) => i.getBoundingClientRect().top < line).map((i) => i.dataset.entry!);
      setPassed((prev) => (prev.size === done.length ? prev : new Set(done)));
      setActive(done[done.length - 1] ?? "");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Deep links (/experience#reds) open that milestone's details.
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && t.entries.some((e) => domId(e) === id)) {
        setOpen((s) => new Set(s).add(id));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  let index = 0;
  return (
    <div ref={wrap} className="relative" style={{ ["--p" as string]: "0" }}>
      {/* Spine */}
      <div aria-hidden className="absolute inset-y-0 start-[21px] w-px bg-line md:start-1/2">
        <div className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-teal via-teal to-amber/80 transition-transform duration-150" style={{ transform: "scaleY(var(--p))" }} />
        <div
          className="absolute start-1/2 size-3 -translate-x-1/2 rounded-full bg-teal shadow-[0_0_18px_4px_rgba(20,184,166,.55)] rtl:translate-x-1/2"
          style={{ top: "calc(var(--p) * 100% - 6px)" }}
        />
      </div>

      {years.map((y) => (
        <section key={y} aria-labelledby={`year-${y}`} className="relative pb-6">
          <h3 id={`year-${y}`} className="relative z-10 mb-8 flex md:justify-center">
            <span className="latin rounded-full border border-teal/40 bg-ink px-4 py-1.5 font-display text-xl font-extrabold text-paper">{y}</span>
          </h3>
          <ol className="space-y-8 md:space-y-0">
            {sorted
              .filter((e) => e.start.startsWith(y))
              .map((e) => {
                const side = index++ % 2 === 0 ? "md:col-start-1" : "md:col-start-3";
                const id = domId(e);
                const d = detailOf(e);
                const isOpen = open.has(id);
                const isActive = active === e.id;
                const isPassed = passed.has(e.id);
                const isCase = e.href.startsWith("/projects");
                return (
                  <li key={e.id} id={id} data-entry={e.id} className="relative scroll-mt-28 md:grid md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:[&:not(:first-child)]:-mt-24">
                    {/* Dot on the spine */}
                    <span
                      aria-hidden
                      className={`absolute start-[15px] top-7 z-10 size-[13px] rounded-full border-2 transition duration-500 md:static md:col-start-2 md:row-start-1 md:mx-auto md:mt-7 ${
                        isActive ? "scale-125 border-teal bg-teal shadow-[0_0_14px_3px_rgba(20,184,166,.6)]" : isPassed ? "border-teal bg-teal/60" : "border-paper/30 bg-ink"
                      }`}
                    />
                    <article
                      data-reveal
                      className={`ms-12 rounded-2xl border bg-surface/50 p-5 text-start transition duration-500 sm:p-6 md:ms-0 md:row-start-1 ${side} ${
                        isActive ? "border-teal/50 bg-surface/80" : "border-line"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <OrgMark logoKey={e.logo} name={e.org} src={logos[e.logo]} />
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-paper/90">{e.org}</p>
                          <p className="text-xs font-semibold text-teal">{e.date}</p>
                        </div>
                        <span className="tag ms-auto shrink-0">{e.type}</span>
                      </div>
                      <h4 className="mt-4 text-xl font-bold">{e.role}</h4>
                      <p className="mt-1.5 text-sm text-paper/75">{e.text}</p>
                      <p className="mt-3 flex gap-2 text-sm text-paper/90">
                        <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                        <span>{e.result}</span>
                      </p>

                      {d && isOpen && (
                        <div id={`${id}-details`} className="mt-5 border-t border-line pt-4">
                          <ul className="space-y-2 text-sm">
                            {d.did.map((line) => (
                              <li key={line} className="flex gap-3 text-paper/85">
                                <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-teal" />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                          {d.exposure.length > 0 && <p className="mt-3 text-sm text-muted">{x.exposure}: {d.exposure.join(" · ")}</p>}
                          {d.earlierRoles.length > 0 && (
                            <div className="mt-3 text-sm">
                              <p className="text-muted">{x.earlier}</p>
                              <ul className="mt-1 space-y-0.5">
                                {d.earlierRoles.map((r) => <li key={r.role}><b>{r.role}</b> <span className="text-muted">· {r.dates}</span></li>)}
                              </ul>
                            </div>
                          )}
                          {d.status && <div className="mt-4"><StatusBadge tone="amber">{d.status}</StatusBadge></div>}
                          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={x.skills}>
                            {d.skills.map((s) => <li key={s} className="chip">{s}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
                        {d && (
                          <button type="button" onClick={() => toggle(id)} aria-expanded={isOpen} aria-controls={`${id}-details`} className="inline-flex items-center gap-1.5 text-teal">
                            {isOpen ? t.hideDetails : t.showDetails}
                            <Chevron className={`size-4 transition ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        )}
                        {isCase && (
                          <Link href={lh(lang, e.href)} className="inline-flex items-center gap-1.5 text-teal">{t.openCase} <ArrowRight /></Link>
                        )}
                        {"certificate" in e && e.certificate && (
                          <a href={e.certificate} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-paper/80 hover:text-teal">
                            <FileIcon /> {t.evidence}
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}
    </div>
  );
}
