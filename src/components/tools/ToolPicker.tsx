"use client";

import Link from "next/link";
import { useState } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight } from "../Icons";

/** Goal-first: the visitor picks what they want to do, and the matching tool is highlighted. */
export function ToolPicker({ lang, t, plannerAvailable }: { lang: Lang; t: Content["tools"]; plannerAvailable: boolean }) {
  // Only working tools are listed. The planner appears automatically once its AI key is configured.
  const tools = [
    { id: "website-audit", data: t.audit, available: true },
    ...(plannerAvailable ? [{ id: "project-planner", data: t.planner, available: true }] : []),
  ];
  const [sel, setSel] = useState("website-audit");
  return (
    <div>
      <h2 id="picker-title" className="text-xl font-bold">{t.pickerTitle}</h2>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.pickerTitle}>
        {tools.map((x) => (
          <button key={x.id} type="button" className="chip" aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>{x.data.goal}</button>
        ))}
      </div>
      <ul className={`mt-8 grid gap-5 ${tools.length > 1 ? "md:grid-cols-2" : "max-w-2xl"}`}>
        {tools.map((x) => {
          const on = sel === x.id;
          return (
            <li key={x.id}>
              <article className={`card flex h-full flex-col p-6 transition sm:p-8 ${on ? "border-teal/60 bg-surface/80" : "opacity-80"}`}>
                <span className="tag self-start">{x.available ? t.eyebrow : t.unavailable}</span>
                <h3 className="mt-3 text-2xl font-bold">{x.data.name}</h3>
                <p className="mt-2 text-paper/80">{x.data.short}</p>
                <p className="mt-4 text-sm text-muted">{x.data.cannot}</p>
                <div className="mt-auto pt-6">
                  {x.available ? (
                    <Link href={lh(lang, `/tools/${x.id}`)} className="btn btn-primary">{x.data.cta} <ArrowRight /></Link>
                  ) : (
                    <span className="btn btn-secondary" aria-disabled="true">{t.unavailable}</span>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
