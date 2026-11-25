"use client";

import Link from "next/link";
import { useState } from "react";
import type { Content } from "@/content";
import type { DimensionId } from "@/content/types";
import { lh, type Lang } from "@/i18n/config";
import { ValueLoop } from "./ValueLoop";
import { SectionHead } from "../ui";
import { ArrowRight } from "../Icons";
import { ProjectCover } from "../ProjectCover";

/** Featured work first (what visitors came for), then the Value Loop that explains how it connects. */
export function LoopAndWork({ lang, home, dimensions, illustration }: { lang: Lang; home: Content["home"]; dimensions: Content["dimensions"]; illustration: string }) {
  const [selected, setSelected] = useState<DimensionId>("technology");
  const [highlight, setHighlight] = useState(false);
  const sel = dimensions.find((d) => d.id === selected) ?? dimensions[0];
  const f = home.featured;
  const L = home.loop;

  function choose(id: DimensionId) {
    setSelected(id);
    setHighlight(true);
  }

  return (
    <>
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="featured-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead id="featured-title" eyebrow={f.eyebrow} title={f.title} />
          <div className="flex items-center gap-3 text-sm" aria-live="polite">
            {highlight ? (
              <>
                <span className="text-muted">{f.highlighting} <b className="text-teal">{sel.label}</b></span>
                <button type="button" className="chip" onClick={() => setHighlight(false)}>{f.showAll}</button>
              </>
            ) : (
              <span className="text-muted">{f.hint}</span>
            )}
          </div>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-6">
          {f.items.map((it, i) => {
            const big = i === 0;
            const match = !highlight || it.dims.includes(selected);
            return (
              <li
                key={it.title}
                data-reveal
                className={`${big ? "md:col-span-6 lg:col-span-4 lg:row-span-2" : i < 3 ? "md:col-span-3 lg:col-span-2" : "md:col-span-3"} transition duration-500 ${match ? "opacity-100" : "opacity-35 saturate-0"}`}
              >
                <Link
                  href={lh(lang, it.href)}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/50 p-6 transition hover:-translate-y-0.5 hover:border-teal/60 ${
                    highlight && match ? "border-teal/50" : "border-line"
                  } ${big ? "lg:p-10" : ""}`}
                >
                  {big && <div aria-hidden className="pointer-events-none absolute -end-20 -top-20 size-72 rounded-full bg-amber/10 blur-3xl" />}
                  <span dir="auto" className="text-xs font-semibold tracking-wide text-muted uppercase">{it.kicker}</span>
                  <span className={`h-display mt-3 ${big ? "latin text-4xl lg:text-6xl" : "text-2xl"}`}>{it.title}</span>
                  <span className={`mt-3 text-paper/75 ${big ? "max-w-xl text-lg" : "text-sm"}`}>{it.why}</span>
                  {big && <ProjectCover id="athathi" label={illustration} className="mt-6 aspect-[16/7] w-full" />}
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                    <span className="flex flex-wrap gap-1.5">
                      {it.dims.map((d) => (
                        <span key={d} className={`tag ${highlight && d === selected ? "bg-teal/20 text-teal" : ""}`}>
                          {dimensions.find((x) => x.id === d)?.label ?? d}
                        </span>
                      ))}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      {it.cta} <ArrowRight className="size-4" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container-x mt-24 sm:mt-32" aria-labelledby="loop-title">
        <SectionHead
          id="loop-title"
          eyebrow={L.eyebrow}
          title={<>{L.titleBefore}<span className="text-teal">{L.titleHighlight}</span>{L.titleAfter}</>}
          lead={L.lead}
        />
        <div className="mt-12" data-reveal>
          <ValueLoop selected={selected} onSelect={choose} dimensions={dimensions} t={L} lang={lang} />
        </div>
      </section>
    </>
  );
}
