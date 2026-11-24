"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bookingSettings,
  careerAreas,
  collaborationTypes,
  services,
  sessionTypes,
  speakingFormats,
  statusLabel,
  type CollaborationTypeId,
} from "@/content/services";
import { site } from "@/config/site";
import { FormShell, RadioCards, Select, TextArea, TextField } from "./FormKit";

const Ref = ({ r }: { r: string | null }) => (r ? <p className="text-sm text-muted">Reference: <b className="text-paper">{r}</b></p> : null);

/* ───────────── General contact ───────────── */
export function ContactForm({ initialTopic = "general" }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic);
  return (
    <FormShell
      type="contact"
      submitLabel="Send message"
      success={(r) => (<><p className="text-2xl font-bold text-paper">Message sent.</p><p>Thanks — I read every message personally and reply by email.</p><Ref r={r} /></>)}
    >
      <RadioCards
        name="topic"
        legend="What is this about?"
        value={topic}
        onChange={setTopic}
        options={[
          { value: "career", label: "Career opportunity" },
          { value: "project", label: "Project collaboration" },
          { value: "speaking", label: "Speaking invitation" },
          { value: "general", label: "General contact" },
        ]}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" required autoComplete="name" />
        <TextField name="email" label="Email" type="email" required autoComplete="email" />
      </div>
      <TextArea name="message" label="Message" required rows={6} />
    </FormShell>
  );
}

/* ───────────── Collaboration & opportunities ───────────── */
export function CollaborateForm({ initialType = "" }: { initialType?: string }) {
  const valid = collaborationTypes.some((c) => c.id === initialType);
  const [type, setType] = useState<CollaborationTypeId | "">(valid ? (initialType as CollaborationTypeId) : "");
  const cfg = useMemo(() => {
    switch (type) {
      case "career":
        return { org: "Company / organization", role: "Role or opportunity title", area: true, engagement: true, link: "Job post or company link", msg: "Tell me about the role, team and what you're looking for." };
      case "freelance":
        return { org: "Company or project (if any)", role: "What do you need help with?", link: "Relevant link", timeline: true, msg: "Describe the project, the scope you have in mind and any constraints." };
      case "technical":
        return { org: "Project / startup name", role: "Your role in the project", link: "Project link or repository", timeline: true, msg: "What are you building, and where could I contribute?" };
      case "business":
        return { org: "Organization / startup", role: "Your role", link: "Website or deck link", msg: "What opportunity or problem would we explore together?" };
      case "content":
        return { org: "Brand / organization", role: "Type of content or campaign", link: "Brand or campaign link", timeline: true, msg: "Describe the content collaboration and your audience." };
      case "partnership":
        return { org: "Organization / community / program", role: "Your position", link: "Organization link", msg: "What kind of partnership are you proposing?" };
      case "media":
        return { org: "Outlet / podcast / publication", role: "Format (podcast, interview, article…)", link: "Link to the outlet", timeline: true, msg: "Tell me about the piece, the audience and the topic." };
      default:
        return null;
    }
  }, [type]);

  return (
    <FormShell
      type="collaborate"
      submitLabel="Send inquiry"
      extra={() => ({ type })}
      success={(r) => (<><p className="text-2xl font-bold text-paper">Inquiry received.</p><p>Thank you. I&apos;ll review it and reply by email. If it&apos;s not a fit, I&apos;ll still let you know.</p><Ref r={r} /></>)}
    >
      <RadioCards
        name="type"
        legend="What would you like to collaborate on?"
        value={type}
        onChange={(v) => setType(v as CollaborationTypeId)}
        options={collaborationTypes.map((c) => ({ value: c.id, label: c.label, hint: c.hint }))}
      />
      {cfg && (
        <div className="space-y-5 border-t border-line pt-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="name" label="Your name" required autoComplete="name" />
            <TextField name="email" label="Email" type="email" required autoComplete="email" />
            <TextField name="organization" label={cfg.org} autoComplete="organization" />
            <TextField name="role" label={cfg.role} />
            {"area" in cfg && cfg.area && (
              <Select name="area" label="Area" placeholder="Choose an area" options={careerAreas.map((a) => ({ value: a, label: a }))} />
            )}
            {"engagement" in cfg && cfg.engagement && (
              <Select name="engagement" label="Type" placeholder="Choose a type" options={["Internship", "Part-time", "Full-time", "Project-based"].map((a) => ({ value: a, label: a }))} />
            )}
            {"timeline" in cfg && cfg.timeline && <TextField name="timeline" label="Timeline" placeholder="e.g. starting next month" />}
            <TextField name="link" label={cfg.link} type="url" placeholder="https://" />
          </div>
          <TextArea name="message" label="Details" hint={cfg.msg} required rows={6} />
        </div>
      )}
      {!cfg && <p className="text-sm text-muted">Choose an option above to see the relevant questions.</p>}
    </FormShell>
  );
}

/* ───────────── Speaking invitation ───────────── */
export function SpeakingForm({ initialTopic = "", initialFormat = "" }: { initialTopic?: string; initialFormat?: string }) {
  const [mode, setMode] = useState("Online");
  return (
    <FormShell
      type="speaking"
      submitLabel="Send invitation"
      success={(r) => (<><p className="text-2xl font-bold text-paper">Invitation received.</p><p>Thank you for thinking of me. I&apos;ll check availability and fit, then reply by email.</p><Ref r={r} /></>)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="organization" label="Event or organization" required autoComplete="organization" />
        <TextField name="name" label="Contact person" required autoComplete="name" />
        <TextField name="email" label="Email" type="email" required autoComplete="email" />
        <Select name="eventType" label="Event type" required placeholder="Choose a type" defaultValue={speakingFormats.includes(initialFormat) ? initialFormat : ""} options={speakingFormats.map((f) => ({ value: f, label: f }))} />
        <TextField name="topic" label="Topic of interest" required defaultValue={initialTopic} className="sm:col-span-2" />
        <TextField name="date" label="Expected date" type="date" />
        <Select name="mode" label="Format" required value={mode} onChange={setMode} options={["Online", "Offline", "Not decided"].map((m) => ({ value: m, label: m === "Offline" ? "Offline (in person)" : m }))} />
        {mode === "Offline" && <TextField name="location" label="Location" required className="sm:col-span-2" />}
        <TextField name="audience" label="Expected audience" placeholder="e.g. CS students, founders" />
        <TextField name="audienceSize" label="Audience size, if known" />
      </div>
      <TextArea name="message" label="Additional details" rows={5} />
    </FormShell>
  );
}

/* ───────────── Service inquiry ───────────── */
export function ServiceForm({ initialService = "" }: { initialService?: string }) {
  const visible = services.filter((s) => s.status !== "hidden");
  return (
    <FormShell
      type="service"
      submitLabel="Request a session"
      success={(r) => (<><p className="text-2xl font-bold text-paper">Request received.</p><p>I&apos;ll review whether I can genuinely help and reply by email with next steps. Nothing is booked or charged yet.</p><Ref r={r} /></>)}
    >
      <Select
        name="service"
        label="Service"
        required
        placeholder="Choose a service"
        defaultValue={visible.some((s) => s.id === initialService) ? initialService : ""}
        options={visible.map((s) => ({ value: s.id, label: `${s.title}${s.status === "published" ? "" : ` — ${statusLabel[s.status]}`}`, disabled: s.status === "unavailable" }))}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" required autoComplete="name" />
        <TextField name="email" label="Email" type="email" required autoComplete="email" />
      </div>
      <Select name="context" label="You are…" placeholder="Choose one" options={["A student", "A graduation project team", "An early-stage founder", "A freelancer", "An organization", "Other"].map((v) => ({ value: v, label: v }))} />
      <TextArea name="message" label="What do you need?" hint="The problem, where you are now, and what a good outcome looks like." required rows={6} />
    </FormShell>
  );
}

/* ───────────── Booking request ───────────── */
const commonZones = [
  "Africa/Cairo", "Asia/Riyadh", "Asia/Dubai", "Asia/Kuwait", "Asia/Qatar", "Europe/London", "Europe/Berlin",
  "Europe/Paris", "America/New_York", "America/Chicago", "America/Los_Angeles", "Asia/Kolkata", "Asia/Singapore", "UTC",
];

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

/** "Cairo time" equivalent for a local date + hour in the visitor's zone. */
function toCairo(date: string, hour: number, tz: string) {
  if (!date) return "";
  try {
    // Find the UTC instant whose wall-clock time in `tz` is date@hour.
    const guess = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00Z`);
    // Parse both wall-clock strings the same way so the browser's own offset cancels out.
    const wallTz = new Date(guess.toLocaleString("en-US", { timeZone: tz })).getTime();
    const wallUtc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const instant = new Date(guess.getTime() - (wallTz - wallUtc));
    return instant.toLocaleTimeString("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function BookingForm({ initialSession = "" }: { initialSession?: string }) {
  const visible = sessionTypes.filter((s) => s.status !== "hidden");
  const [session, setSession] = useState(visible.some((s) => s.id === initialSession) ? initialSession : "");
  const [tz, setTz] = useState("Africa/Cairo");
  const [date, setDate] = useState("");
  const [win, setWin] = useState("");
  const [bounds, setBounds] = useState({ min: "", max: "" });

  useEffect(() => {
    // Client-only values: visitor's zone and today's date. Set after mount to avoid hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Cairo");
    setBounds({ min: isoDay(bookingSettings.minNoticeDays), max: isoDay(bookingSettings.maxDaysAhead) });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const zones = useMemo(() => Array.from(new Set([tz, ...commonZones])), [tz]);
  const chosen = visible.find((s) => s.id === session);
  const startHour = { morning: 9, afternoon: 12, evening: 17 }[win as "morning"] ?? null;
  const endHour = { morning: 12, afternoon: 17, evening: 21 }[win as "morning"] ?? null;
  const cairo = date && startHour !== null && tz !== site.timezone ? `${toCairo(date, startHour, tz)}–${toCairo(date, endHour!, tz)}` : "";

  return (
    <FormShell
      type="booking"
      submitLabel="Send session request"
      extra={() => ({ sessionType: session, timezone: tz })}
      success={(r) => (
        <>
          <p className="text-2xl font-bold text-paper">Request sent — pending confirmation.</p>
          <p>
            This is a <b className="text-paper">request, not a confirmed booking</b>. I&apos;ll review it and email you to confirm a time or suggest
            another one. The meeting link is sent only after confirmation.
          </p>
          <Ref r={r} />
        </>
      )}
    >
      <RadioCards
        name="sessionType"
        legend="1. Choose a session type"
        value={session}
        onChange={setSession}
        options={visible.map((s) => ({
          value: s.id,
          label: s.title,
          hint: `${s.duration} · ${s.description}`,
          disabled: s.status === "unavailable",
          badge: s.status === "published" ? undefined : statusLabel[s.status],
        }))}
      />
      {chosen && (
        <div className="rounded-xl border border-line bg-ink/50 p-4 text-sm">
          <p className="font-semibold">What this session covers</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-paper/80">{chosen.scope.map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="mt-3 text-muted">Format: {bookingSettings.defaultMode}. Pricing, if any, is agreed by email before confirmation.</p>
        </div>
      )}

      <fieldset className="space-y-5 border-t border-line pt-6">
        <legend className="text-sm font-semibold">2. Preferred time</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="date" label="Preferred date" type="date" required min={bounds.min} max={bounds.max} onChange={setDate} />
          <Select name="timeWindow" label="Preferred time (your time zone)" required placeholder="Choose a time window" value={win} onChange={setWin} options={bookingSettings.timeWindows.map((w) => ({ value: w.id, label: w.label }))} />
          <Select name="timezone" label="Your time zone" required value={tz} onChange={setTz} options={zones.map((z) => ({ value: z, label: z.replace(/_/g, " ") }))} className="sm:col-span-2" />
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          Times are in <b className="text-paper">{tz.replace(/_/g, " ")}</b>.{" "}
          {cairo ? <>That window is about <b className="text-paper">{cairo}</b> Cairo time.</> : tz === site.timezone ? "That's my local time zone too." : null}
        </p>
        <TextField name="alternative" label="Other times that work" placeholder="e.g. weekday evenings" />
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-6">
        <legend className="text-sm font-semibold">3. About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="name" label="Your name" required autoComplete="name" />
          <TextField name="email" label="Email" type="email" required autoComplete="email" />
        </div>
        <TextArea name="objective" label="What would you like to get out of this session?" required rows={5} />
      </fieldset>
    </FormShell>
  );
}
