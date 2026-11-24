import { z } from "zod";
import type { Content } from "@/content";

/**
 * Form schemas, shared by client and server so validation never drifts apart.
 * Messages come from the content file of the visitor's language.
 */
type E = Content["forms"]["errors"];

export const contactIntents = ["hiring", "collaboration", "general"] as const;
export const speakingFormatValues = ["Talk", "Workshop", "Interactive session", "Panel", "Online session", "Podcast / interview"] as const;
export const sessionIds = ["project-session", "intro"] as const;

export function makeSchemas(e: E) {
  const name = z.string({ error: e.name }).trim().min(2, e.name).max(120, e.nameLong);
  const email = z.string({ error: e.email }).trim().email(e.email).max(200, e.tooLong);
  const text = (min: number, max: number, msg: string) => z.string({ error: msg }).trim().min(min, msg).max(max, e.tooLong);
  const optional = (max: number) => z.string().trim().max(max, e.tooLong).optional().default("");
  const consent = z.literal(true, { error: e.consent });
  const lang = z.enum(["en", "ar"]).optional().default("en");

  const contact = z.object({
    intent: z.enum(contactIntents, { error: e.intent }),
    name,
    email,
    organization: optional(160),
    role: optional(160),
    link: z.union([z.literal(""), z.string().trim().url(e.link).max(400, e.tooLong)]).optional().default(""),
    message: text(10, 4000, e.message),
    consent,
    lang,
  });

  const speaking = z
    .object({
      organization: text(2, 160, e.organization),
      name,
      email,
      eventType: z.enum(speakingFormatValues, { error: e.eventType }),
      topic: text(2, 200, e.topic),
      date: optional(40),
      mode: z.enum(["Online", "Offline", "Not decided"], { error: e.mode }),
      location: optional(200),
      audience: optional(200),
      audienceSize: optional(60),
      message: optional(4000),
      consent,
      lang,
    })
    .refine((d) => d.mode !== "Offline" || d.location.length > 1, { path: ["location"], message: e.location });

  const booking = z.object({
    sessionType: z.enum(sessionIds, { error: e.session }),
    name,
    email,
    objective: text(20, 3000, e.objective),
    date: z.string({ error: e.date }).regex(/^\d{4}-\d{2}-\d{2}$/, e.date),
    timeWindow: z.string({ error: e.window }).min(1, e.window),
    timezone: z.string({ error: e.timezone }).min(2, e.timezone).max(80),
    alternative: optional(300),
    consent,
    lang,
  });

  return { contact, speaking, booking };
}

export type FormType = keyof ReturnType<typeof makeSchemas>;
export const formTypes: FormType[] = ["contact", "speaking", "booking"];

/** Admin labels (private inbox, English). Older submission types are kept so past rows still display. */
export const formTitles: Record<string, string> = {
  contact: "Contact",
  speaking: "Speaking invitation",
  booking: "Session request",
  collaborate: "Collaboration (legacy)",
  service: "Service inquiry (legacy)",
};

/** Turn a ZodError into { field: message } for inline display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
