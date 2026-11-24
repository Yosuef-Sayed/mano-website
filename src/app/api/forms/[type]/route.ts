import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { fieldErrors, formTypes, makeSchemas, type FormType } from "@/lib/forms/schemas";
import { saveSubmission, storageMode } from "@/lib/storage";
import { acknowledgeVisitor, emailEnabled, notifyOwner } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { clientIp } from "@/lib/clientIp";
import { site } from "@/config/site";
import { getContent } from "@/content";

export const runtime = "nodejs";

const MIN_FILL_MS = 2500; // humans take longer than this to fill a form
const meta = z.object({
  website: z.string().optional().default(""), // honeypot: must stay empty
  startedAt: z.number().optional(),
  lang: z.enum(["en", "ar"]).optional().default("en"),
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  const { type } = await ctx.params;
  if (!formTypes.includes(type as FormType)) {
    return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 404 });
  }
  const formType = type as FormType;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const m = meta.safeParse(body);
  if (!m.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  const e = getContent(m.data.lang).forms.errors;

  const limit = await rateLimit(`form:${formType}:${clientIp(req)}`, 5, 10 * 60);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: e.rate }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  // Honeypot filled → a bot. Respond quietly without storing anything.
  if (m.data.website) return NextResponse.json({ ok: true, ref: null });
  if (m.data.startedAt && Date.now() - m.data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: e.tooFast }, { status: 400 });
  }

  const parsed = makeSchemas(e)[formType].safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: getContent(m.data.lang).forms.fixFields, fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const data = { ...(parsed.data as Record<string, unknown>), submittedFrom: req.headers.get("referer") || "" };

  if (storageMode === "none" && !emailEnabled) {
    // Honest failure: production without any configured delivery channel.
    return NextResponse.json({ ok: false, error: `${e.notConnected} ${site.email}` }, { status: 503 });
  }

  let id: string = crypto.randomUUID();
  let stored = false;
  let emailed = false;
  try {
    if (storageMode !== "none") {
      id = (await saveSubmission(formType, data)).id;
      stored = true;
    }
  } catch (err) {
    console.error("[forms] storage error", err);
  }
  try {
    emailed = await notifyOwner(formType, data, id);
  } catch (err) {
    console.error("[forms] email error", err);
  }

  if (!stored && !emailed) {
    return NextResponse.json({ ok: false, error: `${e.failed} ${site.email}` }, { status: 502 });
  }

  acknowledgeVisitor(formType, data).catch((err) => console.error("[forms] ack error", err));
  return NextResponse.json({ ok: true, ref: id.slice(0, 8).toUpperCase() });
}
