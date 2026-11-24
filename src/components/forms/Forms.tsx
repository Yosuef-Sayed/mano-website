"use client";

import { useEffect, useMemo, useState } from "react";
import type { Content } from "@/content";
import type { Lang } from "@/i18n/config";
import { site } from "@/config/site";
import { FormShell, RadioCards, Select, TextArea, TextField } from "./FormKit";

type F = Content["forms"];
const Ref = ({ r, f }: { r: string | null; f: F }) => (r ? <p className="text-sm text-muted">{f.reference}: <b className="latin text-paper">{r}</b></p> : null);

/* ───────────── Contact (hiring, collaboration, general) ───────────── */
export function ContactForm({ lang, f, intent }: { lang: Lang; f: F; intent: "hiring" | "collaboration" | "general" }) {
  const t = f.contact;
  return (
    <FormShell
      type="contact"
      lang={lang}
      f={f}
      submitLabel={t.submit}
      extra={() => ({ intent })}
      success={(r) => (<><p className="text-2xl font-bold text-paper">{t.successTitle}</p><p>{t.successText}</p><Ref r={r} f={f} /></>)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label={f.yourName} required autoComplete="name" />
        <TextField name="email" label={f.email} type="email" required autoComplete="email" />
        {intent !== "general" && <TextField name="organization" label={t.organization} autoComplete="organization" />}
        <TextField name="role" label={t.role[intent]} />
        {intent !== "general" && <TextField name="link" label={t.link} type="url" placeholder="https://" className="sm:col-span-2" />}
      </div>
      <TextArea name="message" label={t.message} hint={t.messageHint[intent] || undefined} required rows={6} />
    </FormShell>
  );
}

/* ───────────── Speaking invitation ───────────── */
export function SpeakingForm({ lang, f, initialTopic = "", initialFormat = "" }: { lang: Lang; f: F; initialTopic?: string; initialFormat?: string }) {
  const t = f.speaking;
  const [mode, setMode] = useState("Online");
  return (
    <FormShell
      type="speaking"
      lang={lang}
      f={f}
      submitLabel={t.submit}
      success={(r) => (<><p className="text-2xl font-bold text-paper">{t.successTitle}</p><p>{t.successText}</p><Ref r={r} f={f} /></>)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="organization" label={t.organization} required autoComplete="organization" />
        <TextField name="name" label={t.contactPerson} required autoComplete="name" />
        <TextField name="email" label={f.email} type="email" required autoComplete="email" />
        <Select
          name="eventType"
          label={t.eventType}
          required
          placeholder={t.chooseType}
          defaultValue={t.formats.some((x) => x.value === initialFormat) ? initialFormat : ""}
          options={t.formats.map((x) => ({ value: x.value, label: x.label }))}
        />
        <TextField name="topic" label={t.topic} required defaultValue={initialTopic} className="sm:col-span-2" />
        <TextField name="date" label={t.date} type="date" />
        <Select name="mode" label={t.mode} required value={mode} onChange={setMode} options={t.modes.map((m) => ({ value: m.value, label: m.label }))} />
        {mode === "Offline" && <TextField name="location" label={t.location} required className="sm:col-span-2" />}
        <TextField name="audience" label={t.audience} placeholder={t.audienceHint} />
        <TextField name="audienceSize" label={t.audienceSize} />
      </div>
      <TextArea name="message" label={t.details} rows={5} />
    </FormShell>
  );
}

/* ───────────── Session request (Project & Startup Clarity Session) ───────────── */
const commonZones = [
  "Africa/Cairo", "Asia/Riyadh", "Asia/Dubai", "Asia/Kuwait", "Asia/Qatar", "Europe/London", "Europe/Berlin",
  "Europe/Paris", "America/New_York", "America/Chicago", "America/Los_Angeles", "Asia/Kolkata", "Asia/Singapore", "UTC",
];

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}

/** Cairo-time equivalent for a local date + hour in the visitor's zone. */
function toCairo(date: string, hour: number, tz: string) {
  if (!date) return "";
  try {
    const guess = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00Z`);
    const wallTz = new Date(guess.toLocaleString("en-US", { timeZone: tz })).getTime();
    const wallUtc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const instant = new Date(guess.getTime() - (wallTz - wallUtc));
    return instant.toLocaleTimeString("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const MIN_NOTICE_DAYS = 2;
const MAX_DAYS_AHEAD = 60;
const windowHours: Record<string, [number, number]> = { morning: [9, 12], afternoon: [12, 17], evening: [17, 21] };

export function BookingForm({ lang, f, initialSession = "project-session" }: { lang: Lang; f: F; initialSession?: string }) {
  const t = f.booking;
  const [session, setSession] = useState(t.sessions.some((s) => s.id === initialSession) ? initialSession : "project-session");
  const [tz, setTz] = useState("Africa/Cairo");
  const [date, setDate] = useState("");
  const [win, setWin] = useState("");
  const [bounds, setBounds] = useState({ min: "", max: "" });

  useEffect(() => {
    // Client-only values (visitor's zone, today's date), set after mount to avoid a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Cairo");
    setBounds({ min: isoDay(MIN_NOTICE_DAYS), max: isoDay(MAX_DAYS_AHEAD) });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const zones = useMemo(() => Array.from(new Set([tz, ...commonZones])), [tz]);
  const hours = windowHours[win];
  const cairo = date && hours && tz !== site.timezone ? `${toCairo(date, hours[0], tz)}–${toCairo(date, hours[1], tz)}` : "";

  return (
    <FormShell
      type="booking"
      lang={lang}
      f={f}
      submitLabel={t.submit}
      extra={() => ({ sessionType: session, timezone: tz })}
      success={(r) => (<><p className="text-2xl font-bold text-paper">{t.successTitle}</p><p>{t.successText}</p><Ref r={r} f={f} /></>)}
    >
      <RadioCards
        name="sessionType"
        legend={t.session}
        value={session}
        onChange={setSession}
        options={t.sessions.map((s) => ({ value: s.id, label: s.title, hint: `${s.duration} · ${s.description}` }))}
      />
      <p className="rounded-xl border border-line bg-ink/50 p-4 text-sm text-muted">{t.mode}</p>

      <fieldset className="space-y-5 border-t border-line pt-6">
        <legend className="text-sm font-semibold">{t.timeLegend}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="date" label={t.date} type="date" required min={bounds.min} max={bounds.max} onChange={setDate} />
          <Select name="timeWindow" label={t.window} required placeholder={t.chooseWindow} value={win} onChange={setWin} options={t.windows.map((w) => ({ value: w.id, label: w.label }))} />
          <Select name="timezone" label={t.timezone} required value={tz} onChange={setTz} options={zones.map((z) => ({ value: z, label: z.replace(/_/g, " ") }))} className="sm:col-span-2" />
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {t.timesIn} <b className="latin text-paper">{tz.replace(/_/g, " ")}</b>.{" "}
          {cairo ? <>{t.cairoIs} <b className="latin text-paper" dir="ltr">{cairo}</b> {t.cairoTime}</> : tz === site.timezone ? t.sameZone : null}
        </p>
        <TextField name="alternative" label={t.alternative} placeholder={t.alternativeHint} />
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-6">
        <legend className="text-sm font-semibold">{t.aboutLegend}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="name" label={f.yourName} required autoComplete="name" />
          <TextField name="email" label={f.email} type="email" required autoComplete="email" />
        </div>
        <TextArea name="objective" label={t.objective} required rows={5} />
      </fieldset>
    </FormShell>
  );
}

/* ───────────── Contact hub: one page, five intents ───────────── */
type Intent = "hiring" | "collaboration" | "speaking" | "startup" | "general";

export function ContactHub({ lang, f, intents, legend, initialIntent }: { lang: Lang; f: F; intents: Content["contact"]["intents"]; legend: string; initialIntent: string }) {
  const valid = intents.some((i) => i.id === initialIntent);
  const [intent, setIntent] = useState<Intent>((valid ? initialIntent : "hiring") as Intent);
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-sm font-semibold">{legend}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup">
          {intents.map((o) => {
            const on = intent === o.id;
            return (
              <label
                key={o.id}
                className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal ${on ? "border-teal bg-teal/10" : "border-line bg-surface/40 hover:border-teal/50"} ${o.id === "general" ? "sm:col-span-2" : ""}`}
              >
                <input type="radio" name="intent-picker" value={o.id} checked={on} onChange={() => setIntent(o.id as Intent)} className="sr-only" />
                <span className="font-semibold">{o.label}</span>
                <span className="mt-1 text-sm text-muted">{o.hint}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="border-t border-line pt-8">
        {intent === "speaking" ? (
          <SpeakingForm key="speaking" lang={lang} f={f} />
        ) : intent === "startup" ? (
          <BookingForm key="startup" lang={lang} f={f} />
        ) : (
          <ContactForm key={intent} lang={lang} f={f} intent={intent} />
        )}
      </div>
    </div>
  );
}
