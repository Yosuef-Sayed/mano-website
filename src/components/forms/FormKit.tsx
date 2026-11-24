"use client";

import Link from "next/link";
import { createContext, useContext, useRef, useState, type FormEvent, type ReactNode } from "react";
import { fieldErrors, makeSchemas, type FormType } from "@/lib/forms/schemas";
import type { Content } from "@/content";
import { lh, type Lang } from "@/i18n/config";
import { Check } from "../Icons";

type F = Content["forms"];
type Ctx = { errors: Record<string, string>; formId: string; f: F | null; lang: Lang };
const FormCtx = createContext<Ctx>({ errors: {}, formId: "f", f: null, lang: "en" });

type State = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "done"; ref: string | null };

/**
 * Shared form shell: client-side validation with the same zod schema the server uses,
 * honeypot + timing anti-spam, and success shown ONLY after the server confirms.
 */
export function FormShell({
  type,
  lang,
  f,
  children,
  submitLabel,
  success,
  extra,
}: {
  type: FormType;
  lang: Lang;
  f: F;
  children: ReactNode;
  submitLabel: string;
  success: (ref: string | null) => ReactNode;
  extra?: () => Record<string, unknown>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const startedAt = useRef<number>(0);
  const formId = `form-${type}`;

  function collect(form: HTMLFormElement) {
    const fd = new FormData(form);
    const data: Record<string, unknown> = {};
    for (const [k, v] of fd.entries()) data[k] = typeof v === "string" ? v : "";
    data.consent = fd.get("consent") === "on";
    return { ...data, ...(extra?.() ?? {}) };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = collect(form);
    const parsed = makeSchemas(f.errors)[type].safeParse({ ...data, lang });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setState({ kind: "error", message: f.fixFields });
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    try {
      const res = await fetch(`/api/forms/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang, startedAt: startedAt.current || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setState({ kind: "done", ref: json.ref ?? null });
        form.reset();
        requestAnimationFrame(() => document.getElementById(`${formId}-done`)?.focus());
      } else {
        if (json.fields) setErrors(json.fields);
        setState({ kind: "error", message: json.error || f.generic });
      }
    } catch {
      setState({ kind: "error", message: f.network });
    }
  }

  if (state.kind === "done") {
    return (
      <div id={`${formId}-done`} tabIndex={-1} role="status" className="card border-teal/50 p-8 outline-none">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-teal text-ink"><Check className="size-5" /></span>
        <div className="mt-4 space-y-2 text-paper/85">{success(state.ref)}</div>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setState({ kind: "idle" })}>{f.sendAnother}</button>
      </div>
    );
  }

  return (
    <FormCtx.Provider value={{ errors, formId, f, lang }}>
      <form noValidate onSubmit={onSubmit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }} className="space-y-5" aria-describedby={`${formId}-status`}>
        {/* Honeypot: hidden from people and assistive tech. */}
        <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
        </div>
        {children}
        <Consent />
        <div id={`${formId}-status`} aria-live="assertive" className="min-h-6 text-sm">
          {state.kind === "error" && <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-200">{state.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state.kind === "sending"} aria-disabled={state.kind === "sending"}>
          {state.kind === "sending" ? f.sending : submitLabel}
        </button>
      </form>
    </FormCtx.Provider>
  );
}

function Consent() {
  const { errors, formId, f, lang } = useContext(FormCtx);
  const id = `${formId}-consent`;
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 text-sm text-paper/80">
        <input id={id} name="consent" type="checkbox" className="mt-1 size-4 accent-teal" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${id}-err` : undefined} />
        <span>
          {f?.consent}{" "}
          <Link href={lh(lang, "/privacy")} className="link">{f?.privacyLink}</Link>.
        </span>
      </label>
      {errors.consent && <p id={`${id}-err`} className="mt-1 text-sm text-red-300">{errors.consent}</p>}
    </div>
  );
}

type FieldProps = { name: string; label: string; hint?: string; required?: boolean; className?: string };

function Wrap({ name, label, hint, required, className = "", children }: FieldProps & { children: (a: Record<string, unknown>) => ReactNode }) {
  const { errors, formId, f } = useContext(FormCtx);
  const id = `${formId}-${name}`;
  const err = errors[name];
  const describedBy = [hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {required ? <span className="text-teal" aria-hidden>*</span> : <span className="font-normal text-muted">{f?.optional}</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-2">{children({ id, name, "aria-invalid": !!err, "aria-describedby": describedBy, "aria-required": required || undefined })}</div>
      {err && <p id={`${id}-err`} className="mt-1.5 text-sm text-red-300">{err}</p>}
    </div>
  );
}

export function TextField(p: FieldProps & { type?: string; autoComplete?: string; placeholder?: string; defaultValue?: string; min?: string; max?: string; onChange?: (v: string) => void }) {
  return (
    <Wrap {...p}>
      {(a) => (
        <input
          {...a}
          type={p.type ?? "text"}
          dir={p.type === "url" || p.type === "email" ? "ltr" : undefined}
          autoComplete={p.autoComplete}
          placeholder={p.placeholder}
          defaultValue={p.defaultValue}
          min={p.min}
          max={p.max}
          onChange={p.onChange ? (e) => p.onChange!(e.target.value) : undefined}
          className="input"
        />
      )}
    </Wrap>
  );
}

export function TextArea(p: FieldProps & { rows?: number; placeholder?: string }) {
  return <Wrap {...p}>{(a) => <textarea {...a} rows={p.rows ?? 5} placeholder={p.placeholder} className="input resize-y" />}</Wrap>;
}

export function Select(
  p: FieldProps & { options: { value: string; label: string; disabled?: boolean }[]; defaultValue?: string; value?: string; onChange?: (v: string) => void; placeholder?: string },
) {
  return (
    <Wrap {...p}>
      {(a) => (
        <select
          {...a}
          className="input"
          {...(p.value !== undefined ? { value: p.value } : { defaultValue: p.defaultValue ?? "" })}
          onChange={p.onChange ? (e) => p.onChange!(e.target.value) : undefined}
        >
          {p.placeholder !== undefined && <option value="">{p.placeholder}</option>}
          {p.options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
        </select>
      )}
    </Wrap>
  );
}

export function RadioCards({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string; hint?: string; disabled?: boolean; badge?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { errors, formId } = useContext(FormCtx);
  const err = errors[name];
  return (
    <fieldset aria-describedby={err ? `${formId}-${name}-err` : undefined}>
      <legend className="text-sm font-semibold">{legend} <span className="text-teal" aria-hidden>*</span></legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const id = `${formId}-${name}-${o.value}`;
          const on = value === o.value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal ${
                o.disabled ? "cursor-not-allowed opacity-50" : on ? "border-teal bg-teal/10" : "border-line bg-surface/40 hover:border-teal/50"
              }`}
            >
              <input id={id} type="radio" name={name} value={o.value} checked={on} disabled={o.disabled} onChange={() => onChange(o.value)} className="sr-only" />
              <span className="flex items-start justify-between gap-2">
                <span className="font-semibold">{o.label}</span>
                {o.badge && <span className="tag shrink-0">{o.badge}</span>}
              </span>
              {o.hint && <span className="mt-1 text-sm text-muted">{o.hint}</span>}
            </label>
          );
        })}
      </div>
      {err && <p id={`${formId}-${name}-err`} className="mt-1.5 text-sm text-red-300">{err}</p>}
    </fieldset>
  );
}
