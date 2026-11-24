import { z } from "zod";
import { collaborationTypes, sessionTypes, services, speakingFormats } from "@/content/services";

/** Shared by client and server so validation rules never drift apart. */

const name = z.string({ error: "Please enter your name." }).trim().min(2, "Please enter your name.").max(120, "That name is too long.");
const email = z.string({ error: "Please enter a valid email address." }).trim().email("Please enter a valid email address.").max(200);
const text = (min: number, max: number, msg: string) =>
  z.string({ error: msg }).trim().min(min, msg).max(max, `Please keep this under ${max} characters.`);
const optional = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().default("");
const consent = z.literal(true, { error: "Please confirm you agree to be contacted about this request." });

/** Anti-spam fields every form sends. */
export const meta = z.object({
  website: z.string().optional().default(""), // honeypot: must stay empty
  startedAt: z.number().optional(),
});

export const contactSchema = z.object({
  name,
  email,
  topic: z.enum(["career", "project", "speaking", "general"], { error: "Please choose a topic." }),
  message: text(10, 4000, "Please add a short message (at least 10 characters)."),
  consent,
});

const collabIds = collaborationTypes.map((c) => c.id) as [string, ...string[]];

export const collaborateSchema = z.object({
  type: z.enum(collabIds, { error: "Please choose what you'd like to collaborate on." }),
  name,
  email,
  organization: optional(160),
  role: optional(160), // job title or opportunity title
  area: optional(120),
  engagement: optional(60), // internship / full-time / part-time / project
  link: z.union([z.literal(""), z.string().trim().url("Please enter a full link starting with https://").max(400)]).optional().default(""),
  timeline: optional(120),
  message: text(20, 4000, "Please describe the opportunity in at least 20 characters."),
  consent,
});

export const speakingSchema = z.object({
  organization: text(2, 160, "Please enter the event or organization name."),
  name,
  email,
  eventType: z.enum(speakingFormats as [string, ...string[]], { error: "Please choose an event type." }),
  topic: text(2, 200, "Please share the topic you have in mind."),
  date: optional(40),
  mode: z.enum(["Online", "Offline", "Not decided"], { error: "Please choose a format." }),
  location: optional(200),
  audience: optional(200),
  audienceSize: optional(60),
  message: optional(4000),
  consent,
}).refine((d) => d.mode !== "Offline" || d.location.length > 1, {
  path: ["location"],
  message: "Please add the location for an in-person event.",
});

const sessionIds = sessionTypes.map((s) => s.id) as [string, ...string[]];

export const bookingSchema = z.object({
  sessionType: z.enum(sessionIds, { error: "Please choose a session type." }),
  name,
  email,
  objective: text(20, 3000, "Please describe your objective in at least 20 characters."),
  date: z.string({ error: "Please choose a preferred date." }).regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a preferred date."),
  timeWindow: z.string({ error: "Please choose a preferred time." }).min(1, "Please choose a preferred time."),
  timezone: z.string({ error: "Please choose your time zone." }).min(2).max(80),
  alternative: optional(300),
  consent,
});

const serviceIds = services.map((s) => s.id) as [string, ...string[]];

export const serviceSchema = z.object({
  service: z.enum(serviceIds, { error: "Please choose a service." }),
  name,
  email,
  context: optional(160), // student / founder / team / organization
  message: text(20, 4000, "Please describe what you need in at least 20 characters."),
  consent,
});

export const schemas = {
  contact: contactSchema,
  collaborate: collaborateSchema,
  speaking: speakingSchema,
  booking: bookingSchema,
  service: serviceSchema,
} as const;

export type FormType = keyof typeof schemas;
export const formTypes = Object.keys(schemas) as FormType[];

export const formTitles: Record<FormType, string> = {
  contact: "General contact",
  collaborate: "Collaboration / opportunity",
  speaking: "Speaking invitation",
  booking: "Session request",
  service: "Service inquiry",
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
