"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight } from "../Icons";

type T = Content["tools"];
type Plan = {
  problemStatement: string; targetUser: string;
  assumptions: { assumption: string; risk: "high" | "medium" | "low"; test: string }[];
  interviewQuestions: string[]; experiments: { name: string; how: string; signal: string }[];
  mvp: { in: string[]; out: string[] }; evidence: string[]; nextSteps: string[];
};
function List({ items }: { items: string[] }) {
  return <ul className="mt-2 list-disc space-y-1.5 ps-5 text-paper/85">{items.map((x) => <li key={x}>{x}</li>)}</ul>;
}
const riskTone: Record<string, string> = { high: "text-red-300", medium: "text-amber", low: "text-paper/70" };

export function PlannerTool({ lang, t }: { lang: Lang; t: T }) {
  const p = t.planner;
  const r = p.report;
  const [state, setState] = useState<"idle" | "running" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const opt = lang === "ar" ? "(اختياري)" : "(optional)";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(["problem", "user", "context", "alternatives", "solution", "stage", "constraints", "website"].map((k) => [k, String(fd.get(k) || "")]));
    if (body.problem.trim().length < 15 || body.user.trim().length < 3 || body.solution.trim().length < 10) {
      setError(p.errors.short);
      setState("error");
      return;
    }
    setState("running");
    setError("");
    try {
      const res = await fetch("/api/tools/project-planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, lang }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error || t.errors.failed);
        setState("error");
        return;
      }
      setPlan(json.plan);
      setRemaining(json.remaining ?? null);
      setState("done");
      requestAnimationFrame(() => ref.current?.focus());
    } catch {
      setError(t.errors.failed);
      setState("error");
    }
  }

  if (state === "done" && plan) {
    return (
      <div ref={ref} tabIndex={-1} className="space-y-8 outline-none">
        <div>
          <h2 className="h-display text-3xl">{r.title}</h2>
          <p className="mt-3 rounded-xl border border-amber/40 bg-amber/5 p-4 text-sm">{r.disclaimer}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5"><p className="eyebrow">{r.problem}</p><p className="mt-2">{plan.problemStatement}</p></div>
          <div className="card p-5"><p className="eyebrow">{r.user}</p><p className="mt-2">{plan.targetUser}</p></div>
        </div>
        <section>
          <h3 className="text-xl font-bold">{r.assumptions}</h3>
          <ol className="mt-3 space-y-3">
            {plan.assumptions.map((a) => (
              <li key={a.assumption} className="card p-4">
                <p className="font-semibold">{a.assumption}</p>
                <p className="mt-1 text-sm"><span className="text-muted">{r.risk}: </span><span className={riskTone[a.risk]}>{t.audit.report.priority[a.risk]}</span></p>
                <p className="mt-1 text-sm"><span className="text-muted">{r.test}: </span>{a.test}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="card p-5"><h3 className="text-xl font-bold">{r.questions}</h3><List items={plan.interviewQuestions} /></section>
        <section>
          <h3 className="text-xl font-bold">{r.experiments}</h3>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {plan.experiments.map((x) => (
              <li key={x.name} className="card p-4 text-sm"><p className="text-base font-semibold">{x.name}</p><p className="mt-1 text-paper/85">{x.how}</p><p className="mt-1 text-muted">→ {x.signal}</p></li>
            ))}
          </ul>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card p-5"><p className="eyebrow">{r.mvp} · {r.mvpIn}</p><List items={plan.mvp.in} /></div>
          <div className="card p-5"><p className="eyebrow">{r.mvp} · {r.mvpOut}</p><List items={plan.mvp.out} /></div>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="card p-5"><h3 className="font-bold">{r.evidence}</h3><List items={plan.evidence} /></div>
          <div className="card p-5"><h3 className="font-bold">{r.steps}</h3><List items={plan.nextSteps} /></div>
        </section>
        <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="font-semibold">{r.next}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={lh(lang, "/book#form")} className="btn btn-primary">{r.nextCta} <ArrowRight /></Link>
            <button type="button" className="btn btn-secondary" onClick={() => setState("idle")}>{r.again}</button>
          </div>
        </div>
        {remaining !== null && <p className="text-xs text-muted">{t.limitsLabel}: {remaining} {t.runsLeft}</p>}
      </div>
    );
  }

  const F = p.fields;
  const area = (name: string, label: string, required: boolean, rows = 3, max = 1200) => (
    <div>
      <label htmlFor={`pl-${name}`} className="block text-sm font-semibold">{label} {required ? <span className="text-teal" aria-hidden>*</span> : <span className="font-normal text-muted">{opt}</span>}</label>
      <textarea id={`pl-${name}`} name={name} rows={rows} maxLength={max} required={required} className="input mt-2 resize-y" />
    </div>
  );
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {area("problem", F.problem, true)}
      <div className="grid gap-5 md:grid-cols-2">
        {area("user", F.user, true, 2, 600)}
        {area("context", F.context, false, 2, 800)}
      </div>
      {area("alternatives", F.alternatives, false, 2, 800)}
      {area("solution", F.solution, true)}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="pl-stage" className="block text-sm font-semibold">{F.stage}</label>
          <select id="pl-stage" name="stage" className="input mt-2" defaultValue="idea">
            {F.stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        {area("constraints", F.constraints, false, 2, 600)}
      </div>
      <div aria-live="polite" className="min-h-6 text-sm">
        {state === "running" && <p className="text-muted">{p.running}</p>}
        {state === "error" && <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-200">{error}</p>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={state === "running"} aria-disabled={state === "running"}>{state === "running" ? "…" : p.submit}</button>
    </form>
  );
}
