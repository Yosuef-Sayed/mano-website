"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { ArrowRight } from "../Icons";

type T = Content["tools"];
type Check = { id: string; status: "pass" | "warn" | "fail" | "info"; value?: string; n?: number; m?: number };
type Finding = { title: string; area: string; priority: "high" | "medium" | "low"; evidence: string; why: string; fix: string; example: string };
type Ai = {
  overview: string; offerAsUnderstood: string; audienceAsUnderstood: string;
  works: { point: string; evidence: string }[]; findings: Finding[];
  headlineSuggestion: { text: string; rationale: string }; ctaSuggestion: { text: string; rationale: string }; limitations: string[];
};
type Result = { url: string; pages: { url: string; title: string }[]; checks: Check[]; ai: Ai | null; aiStatus: string; remaining: number };

const pill: Record<string, string> = {
  pass: "border-teal/40 bg-teal/10 text-teal",
  warn: "border-amber/40 bg-amber/10 text-amber",
  fail: "border-red-400/40 bg-red-400/10 text-red-300",
  info: "border-line bg-paper/5 text-paper/70",
};
const prio: Record<string, string> = { high: "text-red-300", medium: "text-amber", low: "text-paper/70" };

function fill(tpl: string, c: Check) {
  return tpl.replace(/\{n\}/g, String(c.n ?? "")).replace(/\{m\}/g, String(c.m ?? "")).replace(/\{value\}/g, c.value ?? "");
}

export function AuditTool({ lang, t }: { lang: Lang; t: T }) {
  const a = t.audit;
  const r = a.report;
  const [state, setState] = useState<"idle" | "running" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("url") || "").trim();
    if (url.length < 4) {
      setError(a.errors.url);
      setState("error");
      return;
    }
    setState("running");
    setError("");
    try {
      const res = await fetch("/api/tools/website-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, purpose: fd.get("purpose"), audience: fd.get("audience"), offer: fd.get("offer"), website: fd.get("website"), lang }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error || t.errors.failed);
        setState("error");
        return;
      }
      setResult(json);
      setState("done");
      requestAnimationFrame(() => reportRef.current?.focus());
    } catch {
      setError(t.errors.failed);
      setState("error");
    }
  }

  if (state === "done" && result) {
    const checks = a.checks as Record<string, Record<string, string>>;
    return (
      <div ref={reportRef} tabIndex={-1} className="space-y-10 outline-none" aria-labelledby="report-title">
        <div>
          <h2 id="report-title" className="h-display text-3xl">{r.title}</h2>
          <p className="mt-2 text-sm text-muted">{r.scanned}:</p>
          <ul className="mt-1 space-y-0.5 text-sm">
            {result.pages.map((p) => <li key={p.url} className="latin break-all text-paper/80" dir="ltr">{p.url}</li>)}
          </ul>
        </div>

        {result.ai && (
          <section className="space-y-6" aria-labelledby="ai-title">
            <div>
              <h3 id="ai-title" className="text-2xl font-bold">{r.ai}</h3>
              <p className="mt-1 text-sm text-muted">{r.aiNote}</p>
            </div>
            <div className="card p-6">
              <p className="eyebrow">{r.overview}</p>
              <p className="mt-2 text-paper/90">{result.ai.overview}</p>
            </div>
            {result.ai.works.length > 0 && (
              <div>
                <p className="eyebrow">{r.works}</p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {result.ai.works.map((w) => (
                    <li key={w.point} className="rounded-xl border border-teal/30 bg-teal/5 p-4 text-sm">
                      <p className="font-semibold">{w.point}</p>
                      <p className="mt-1 text-muted">“{w.evidence}”</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="eyebrow">{r.findings}</p>
              <ol className="mt-3 space-y-4">
                {result.ai.findings.map((f) => (
                  <li key={f.title} className="card p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold ${prio[f.priority]}`}>{r.priority[f.priority]}</span>
                      <span className="tag">{f.area}</span>
                    </div>
                    <h4 className="mt-2 text-lg font-bold">{f.title}</h4>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div><dt className="inline font-semibold text-muted">{r.evidence}: </dt><dd className="inline">“{f.evidence}”</dd></div>
                      <div><dt className="inline font-semibold text-muted">{r.why}: </dt><dd className="inline">{f.why}</dd></div>
                      <div><dt className="inline font-semibold text-teal">{r.fix}: </dt><dd className="inline">{f.fix}</dd></div>
                      {f.example && <div><dt className="inline font-semibold text-muted">{r.example}: </dt><dd className="inline">{f.example}</dd></div>}
                    </dl>
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[[r.headline, result.ai.headlineSuggestion], [r.ctaSuggestion, result.ai.ctaSuggestion]].map(([label, s]) => {
                const sug = s as { text: string; rationale: string };
                return (
                  <div key={label as string} className="card p-5">
                    <p className="eyebrow">{label as string}</p>
                    <p className="mt-2 text-lg font-semibold">{sug.text}</p>
                    <p className="mt-1 text-sm text-muted">{sug.rationale}</p>
                  </div>
                );
              })}
            </div>
            {result.ai.limitations.length > 0 && (
              <div>
                <p className="eyebrow">{r.limits}</p>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-muted">{result.ai.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            )}
          </section>
        )}
        {!result.ai && <p className="rounded-xl border border-line bg-ink/50 p-4 text-sm text-muted">{result.aiStatus === "budget" ? t.errors.budget : result.aiStatus === "refused" ? t.errors.refused : r.aiUnavailable}</p>}

        <section aria-labelledby="checks-title">
          <h3 id="checks-title" className="text-2xl font-bold">{r.checks}</h3>
          <p className="mt-1 text-sm text-muted">{r.checksNote}</p>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {result.checks.map((c) => {
              const d = checks[c.id];
              if (!d) return null;
              const msg = (c.id === "canonical" && c.m === 1 ? d.mismatch : d[c.status]) || "";
              return (
                <li key={c.id} className="grid gap-2 bg-surface/30 px-5 py-4 sm:grid-cols-[160px_1fr_auto] sm:items-start sm:gap-4">
                  <p className="font-semibold">{d.label}</p>
                  <div className="text-sm text-paper/80">
                    <p>{fill(msg, c)}</p>
                    {c.value && ["title", "description", "h1"].includes(c.id) && <p className="mt-1 break-words text-muted" dir="auto">“{c.value}”</p>}
                  </div>
                  <span className={`justify-self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pill[c.status]}`}>{r.status[c.status]}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="font-semibold">{r.next}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={lh(lang, "/book#form")} className="btn btn-primary">{r.nextCta} <ArrowRight /></Link>
            <button type="button" className="btn btn-secondary" onClick={() => setState("idle")}>{r.again}</button>
          </div>
        </div>
        <p className="text-xs text-muted">{t.limitsLabel}: {result.remaining} {t.runsLeft}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label htmlFor="audit-url" className="block text-sm font-semibold">{a.urlLabel} <span className="text-teal" aria-hidden>*</span></label>
        <p id="audit-url-hint" className="mt-0.5 text-xs text-muted">{a.urlHint}</p>
        <input id="audit-url" name="url" type="url" inputMode="url" dir="ltr" required placeholder="https://example.com" aria-describedby="audit-url-hint" className="input mt-2" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {([["purpose", a.purposeLabel], ["audience", a.audienceLabel], ["offer", a.offerLabel]] as const).map(([n, l]) => (
          <div key={n}>
            <label htmlFor={`audit-${n}`} className="block text-sm font-semibold">{l} <span className="font-normal text-muted">{lang === "ar" ? "(اختياري)" : "(optional)"}</span></label>
            <input id={`audit-${n}`} name={n} maxLength={300} className="input mt-2" />
          </div>
        ))}
      </div>
      <div aria-live="polite" className="min-h-6 text-sm">
        {state === "running" && <p className="text-muted">{a.running}</p>}
        {state === "error" && <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-200">{error}</p>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={state === "running"} aria-disabled={state === "running"}>
        {state === "running" ? "…" : a.submit}
      </button>
    </form>
  );
}
