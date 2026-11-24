"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, FileIcon } from "./Icons";

type T = Content["experience"]["timeline"];
type Entry = T["entries"][number];

const laneColor: Record<string, string> = { work: "bg-teal", leadership: "bg-amber", learning: "bg-paper/70" };
const laneText: Record<string, string> = { work: "text-teal", leadership: "text-amber", learning: "text-paper/80" };

// Scale: Nov 2024 (0) → Dec 2026 (25).
const SCALE_START = 2024 * 12 + 10;
const SCALE_LEN = 26;
const NOW = 2026 * 12 + 10; // Nov 2026: "Present" bars run to here.
const idx = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

function SpanBar({ e }: { e: Entry }) {
  const s = idx(e.start) - SCALE_START;
  const end = (e.end ? idx(e.end) : NOW) - SCALE_START + 1;
  const startPct = (s / SCALE_LEN) * 100;
  const widthPct = Math.max(((end - s) / SCALE_LEN) * 100, 2.5);
  return (
    <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-paper/10" aria-hidden>
      <div
        className={`absolute inset-y-0 rounded-full ${laneColor[e.lane]}`}
        style={{ insetInlineStart: `${startPct}%`, width: `${widthPct}%` }}
      />
    </div>
  );
}

/** Chronological journey with year markers, lanes, span bars (so overlaps are visible) and a scroll-progress spine. */
export function Timeline({ lang, t }: { lang: Lang; t: T }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty("--p", String(p));
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

  const sorted = [...t.entries].sort((a, b) => idx(a.start) - idx(b.start));
  const years = Array.from(new Set(sorted.map((e) => e.start.slice(0, 4))));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {(["work", "leadership", "learning"] as const).map((l) => (
          <span key={l} className="inline-flex items-center gap-2">
            <span aria-hidden className={`size-2.5 rounded-full ${laneColor[l]}`} />
            {t.lanes[l]}
          </span>
        ))}
        <span className="text-muted">{t.overlapNote}</span>
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-muted" aria-hidden>
        <span>{t.scaleStart}</span>
        <span>{t.scaleEnd}</span>
      </div>

      <div ref={ref} className="relative mt-8" style={{ ["--p" as string]: "0" }}>
        {/* Spine with scroll progress */}
        <div aria-hidden className="absolute inset-y-0 start-[11px] w-px bg-line sm:start-[15px]">
          <div className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-teal via-teal to-amber" style={{ height: "100%", transform: "scaleY(var(--p))" }} />
        </div>

        {years.map((y) => (
          <section key={y} aria-labelledby={`year-${y}`} className="relative">
            <h3 id={`year-${y}`} className="relative mb-6 flex items-center gap-4 ps-10 sm:ps-12">
              <span aria-hidden className="absolute start-[4px] top-1/2 size-[15px] -translate-y-1/2 rounded-full border-2 border-teal bg-ink sm:start-[8px]" />
              <span className="font-display text-3xl font-extrabold text-paper/90 latin">{y}</span>
            </h3>
            <ol className="space-y-5 pb-10">
              {sorted
                .filter((e) => e.start.startsWith(y))
                .map((e) => (
                  <li key={e.id} className="relative ps-10 sm:ps-12" data-reveal>
                    <span aria-hidden className={`absolute start-[7px] top-6 size-[9px] rounded-full ring-4 ring-ink sm:start-[11px] ${laneColor[e.lane]}`} />
                    <article className="card p-5 transition hover:border-teal/40 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-paper/5 px-2.5 py-0.5 text-xs font-semibold text-paper/90">{e.date}</span>
                        <span className="tag">{e.type}</span>
                        <span className={`text-xs font-semibold ${laneText[e.lane]}`}>{t.lanes[e.lane as keyof T["lanes"]]}</span>
                      </div>
                      <h4 className="mt-3 text-xl font-bold">{e.role}</h4>
                      <p className="text-paper/75">{e.org}</p>
                      <p className="mt-2 text-sm text-paper/80">{e.text}</p>
                      <p className="mt-2 text-sm"><span className="font-semibold text-teal">{t.result}: </span>{e.result}</p>
                      <SpanBar e={e} />
                      <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                        <Link href={lh(lang, e.href)} className="inline-flex items-center gap-1.5 text-teal">
                          {t.related} <ArrowRight />
                        </Link>
                        {"certificate" in e && e.certificate && (
                          <a href={e.certificate} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-paper/80 hover:text-teal">
                            <FileIcon /> {t.evidence}
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
