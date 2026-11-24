"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import type { Content } from "@/content";
import type { DimensionId } from "@/content/types";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight, Chevron } from "../Icons";

type Dim = Content["dimensions"][number];
type LoopText = Content["home"]["loop"];

const R = 37; // ring radius in viewBox units
const pos = [0, 1, 2, 3, 4].map((i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
});

function Panel({ d, t, lang }: { d: Dim; t: LoopText; lang: Lang }) {
  return (
    <div>
      <p className="eyebrow">{d.label}</p>
      <p className="h-display mt-2 text-2xl sm:text-3xl">{d.question}</p>
      <p className="mt-3 text-paper/80">{d.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${d.label} — ${t.areas}`}>
        {d.areas.map((a) => (
          <li key={a} className="chip">{a}</li>
        ))}
      </ul>
      <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{t.evidence}</p>
      <ul className="mt-2 divide-y divide-line">
        {d.evidence.map((e) => (
          <li key={e.label}>
            <Link href={lh(lang, e.href)} className="group flex items-center justify-between gap-4 py-3">
              <span>
                <span className="block font-semibold text-paper transition group-hover:text-teal">{e.label}</span>
                <span className="block text-sm text-muted">{e.detail}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-teal transition group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ValueLoop({ selected, onSelect, dimensions, t, lang }: { selected: DimensionId; onSelect: (id: DimensionId) => void; dimensions: Dim[]; t: LoopText; lang: Lang }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = dimensions.findIndex((d) => d.id === selected);
  const sel = dimensions[idx] ?? dimensions[0];

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = dimensions.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      onSelect(dimensions[next].id as DimensionId);
      tabs.current[next]?.focus();
    }
  }

  return (
    <>
      {/* Desktop / tablet: connected loop */}
      <div dir="ltr" className="hidden items-center gap-12 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="relative mx-auto aspect-square w-full max-w-[500px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <radialGradient id="vl-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="22" fill="url(#vl-core)" />
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(237 237 237 / .12)" strokeWidth="0.35" />
            <circle
              cx="50" cy="50" r={R} fill="none" stroke="#14B8A6" strokeOpacity="0.55" strokeWidth="0.45"
              strokeDasharray="1.2 3.2" className="motion-safe:animate-[spin_60s_linear_infinite] origin-center"
              style={{ transformBox: "fill-box" }}
            />
            {pos.map((p, i) => (
              <line
                key={i} x1="50" y1="50" x2={p.x} y2={p.y}
                stroke={i === idx ? "#14B8A6" : "rgb(237 237 237 / .14)"}
                strokeWidth={i === idx ? 0.7 : 0.35}
                className="transition-all duration-500"
              />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-teal/40 bg-ink/80 text-center shadow-[0_0_60px_-10px_rgba(20,184,166,.5)]">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-teal uppercase">{t.outcome}</span>
            <span className="h-display mt-1 max-w-[80%] text-base leading-tight lg:text-lg">{t.value}</span>
          </div>
          <div role="tablist" aria-label={t.tablistLabel} aria-orientation="horizontal">
            {dimensions.map((d, i) => {
              const on = d.id === selected;
              return (
                <button
                  key={d.id}
                  ref={(el) => { tabs.current[i] = el; }}
                  role="tab"
                  id={`vl-tab-${d.id}`}
                  aria-selected={on}
                  aria-controls="vl-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => onSelect(d.id as DimensionId)}
                  onKeyDown={(e) => onKey(e, i)}
                  style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition duration-300 ${
                    on ? "scale-105 border-teal bg-teal text-ink shadow-[0_0_30px_-4px_rgba(20,184,166,.8)]" : "border-line bg-navy/90 text-paper hover:border-teal/70 hover:text-teal"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
        <div id="vl-panel" role="tabpanel" dir={lang === "ar" ? "rtl" : "ltr"} aria-labelledby={`vl-tab-${selected}`} className="card min-h-[420px] p-6 lg:p-8" aria-live="polite">
          <Panel d={sel} t={t} lang={lang} />
        </div>
      </div>

      {/* Mobile: vertical connected stepper */}
      <ol className="relative md:hidden" aria-label={t.tablistLabel}>
        <span aria-hidden className="absolute bottom-6 start-[15px] top-6 w-px bg-gradient-to-b from-teal/60 via-line to-amber/50" />
        {dimensions.map((d) => {
          const on = d.id === selected;
          return (
            <li key={d.id} className="relative ps-12">
              <span aria-hidden className={`absolute start-[9px] top-[22px] size-[13px] rounded-full border-2 transition ${on ? "border-teal bg-teal" : "border-paper/30 bg-ink"}`} />
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`vl-m-${d.id}`}
                onClick={() => onSelect(d.id as DimensionId)}
                className="flex w-full items-center justify-between py-4 text-start"
              >
                <span>
                  <span className={`block text-lg font-bold ${on ? "text-teal" : ""}`}>{d.label}</span>
                  <span className="block text-sm text-muted">{d.question}</span>
                </span>
                <Chevron className={`size-5 shrink-0 transition ${on ? "rotate-180 text-teal" : "text-muted"}`} />
              </button>
              <div id={`vl-m-${d.id}`} hidden={!on} className="card mb-4 p-5">
                <Panel d={d} t={t} lang={lang} />
              </div>
            </li>
          );
        })}
        <li className="relative ps-12 pt-2">
          <span aria-hidden className="absolute start-[7px] top-[14px] size-[17px] rounded-full border-2 border-amber bg-amber/30" />
          <p className="text-lg font-bold text-amber">{t.value}</p>
          <p className="text-sm text-muted">{t.valueNote}</p>
        </li>
      </ol>
    </>
  );
}
