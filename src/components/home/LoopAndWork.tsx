"use client";

import Link from "next/link";
import { useState } from "react";
import { dimensions, type DimensionId } from "@/content/valueLoop";
import { ValueLoop } from "./ValueLoop";
import { SectionHead } from "../ui";
import { ArrowRight } from "../Icons";

type Featured = { title: string; kicker: string; why: string; href: string; cta: string; dims: DimensionId[]; big?: boolean };

const featured: Featured[] = [
  {
    title: "ATHATHI",
    kicker: "Founder & CEO · Startup",
    why: "The clearest example of the whole loop: 30+ customer interviews shaped a business model, and I helped build the AI assistants that serve it — as a working prototype, with integration still in progress.",
    href: "/projects/athathi",
    cta: "Read the case study",
    dims: ["technology", "business", "people", "execution", "communication"],
    big: true,
  },
  {
    title: "Star Union",
    kicker: "President · Student organization",
    why: "Leading a 200+ member organization through VPs and heads across five divisions — planning, recruitment and external relations.",
    href: "/experience#star-union",
    cta: "See the role",
    dims: ["people", "execution", "communication"],
  },
  {
    title: "NextGen Institute",
    kicker: "ML Intern · In progress",
    why: "Building the ML foundation behind the AI work: preprocessing, regression and an applied project on business datasets.",
    href: "/experience#nextgen",
    cta: "See the internship",
    dims: ["technology"],
  },
  {
    title: "Software projects",
    kicker: "Java · C++ · Python",
    why: "MASROOFY's MVC design, a 14-variant game platform, an audio player and an image editor: the programming foundation.",
    href: "/projects",
    cta: "Browse projects",
    dims: ["technology", "execution"],
  },
  {
    title: "MANO content",
    kicker: "Personal brand",
    why: "Explaining technology, business and career growth in public: 6 short-form videos and 6 LinkedIn visual posts so far.",
    href: "/about#content",
    cta: "See the content",
    dims: ["communication"],
  },
];

export function LoopAndWork() {
  const [selected, setSelected] = useState<DimensionId>("technology");
  const [highlight, setHighlight] = useState(false);
  const sel = dimensions.find((d) => d.id === selected)!;

  function choose(id: DimensionId) {
    setSelected(id);
    setHighlight(true);
  }

  return (
    <>
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="loop-title">
        <SectionHead
          id="loop-title"
          eyebrow="The MANO Value Loop"
          title={<>How do we turn a real problem into something <span className="text-teal">valuable</span>?</>}
          lead="Not five separate careers — five ways of looking at the same problem. Choose a dimension to see the work behind it."
        />
        <div className="mt-12" data-reveal>
          <ValueLoop selected={selected} onSelect={choose} />
        </div>
      </section>

      <section className="container-x mt-24 sm:mt-32" aria-labelledby="featured-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead id="featured-title" eyebrow="Featured work" title="Where the loop shows up" />
          <div className="flex items-center gap-3 text-sm" aria-live="polite">
            {highlight ? (
              <>
                <span className="text-muted">Highlighting <b className="text-teal">{sel.label}</b></span>
                <button type="button" className="chip" onClick={() => setHighlight(false)}>Show all</button>
              </>
            ) : (
              <span className="text-muted">Select a dimension above to highlight related work.</span>
            )}
          </div>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-6">
          {featured.map((f, i) => {
            const match = !highlight || f.dims.includes(selected);
            return (
              <li
                key={f.title}
                data-reveal
                className={`${f.big ? "md:col-span-6 lg:col-span-4 lg:row-span-2" : i < 3 ? "md:col-span-3 lg:col-span-2" : "md:col-span-3"} transition duration-500 ${match ? "opacity-100" : "opacity-35 saturate-0"}`}
              >
                <Link
                  href={f.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/50 p-6 transition hover:-translate-y-0.5 hover:border-teal/60 ${
                    highlight && match ? "border-teal/50" : "border-line"
                  } ${f.big ? "lg:p-10" : ""}`}
                >
                  {f.big && <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber/10 blur-3xl" />}
                  <span className="text-xs font-semibold tracking-wide text-muted uppercase">{f.kicker}</span>
                  <span className={`h-display mt-3 ${f.big ? "text-4xl lg:text-6xl" : "text-2xl"}`}>{f.title}</span>
                  <span className={`mt-3 text-paper/75 ${f.big ? "max-w-xl text-lg" : "text-sm"}`}>{f.why}</span>
                  {f.big && (
                    <span className="mt-8 grid gap-3 sm:grid-cols-3">
                      {[["30+ / 7+", "customer / business interviews"], ["3", "AI components I worked on"], ["6 + ~25", "core team (incl. me) + contributors"]].map(([v, l]) => (
                        <span key={l} className="rounded-xl border border-line bg-ink/40 px-4 py-3">
                          <span className="block font-display text-2xl font-extrabold text-teal">{v}</span>
                          <span className="block text-xs text-muted">{l}</span>
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                    <span className="flex flex-wrap gap-1.5">
                      {f.dims.map((d) => (
                        <span key={d} className={`tag ${highlight && d === selected ? "bg-teal/20 text-teal" : ""}`}>{d}</span>
                      ))}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      {f.cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
