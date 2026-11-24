import { NextResponse, type NextRequest } from "next/server";
import { fieldErrors, formTypes, meta, schemas, type FormType } from "@/lib/forms/schemas";
import { saveSubmission, storageMode } from "@/lib/storage";
import { acknowledgeVisitor, emailEnabled, notifyOwner } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { site } from "@/config/site";

export const runtime = "nodejs";

const MIN_FILL_MS = 2500; // humans take longer than this to fill a form

export async function POST(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  const { type } = await ctx.params;
  if (!formTypes.includes(type as FormType)) {
    return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 404 });
  }
  const formType = type as FormType;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const limit = rateLimit(`${ip}:${formType}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests from this connection. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const m = meta.safeParse(body);
  if (!m.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  // Honeypot filled → a bot. Respond quietly without storing anything.
  if (m.data.website) return NextResponse.json({ ok: true, ref: null });
  if (m.data.startedAt && Date.now() - m.data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: "That was very fast — please review the form and send again." }, { status: 400 });
  }

  const parsed = schemas[formType].safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const data = { ...(parsed.data as Record<string, unknown>), submittedFrom: req.headers.get("referer") || "" };

  if (storageMode === "none" && !emailEnabled) {
    // Honest failure: production without any configured delivery channel.
    return NextResponse.json(
      { ok: false, error: `The form isn't connected yet. Please email ${site.email} directly.` },
      { status: 503 },
    );
  }

  let id: string = crypto.randomUUID();
  let stored = false;
  let emailed = false;
  try {
    if (storageMode !== "none") {
      id = (await saveSubmission(formType, data)).id;
      stored = true;
    }
  } catch (e) {
    console.error("[forms] storage error", e);
  }
  try {
    emailed = await notifyOwner(formType, data, id);
  } catch (e) {
    console.error("[forms] email error", e);
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      { ok: false, error: `Something went wrong and your message was not sent. Please try again or email ${site.email}.` },
      { status: 502 },
    );
  }

  acknowledgeVisitor(formType, data).catch((e) => console.error("[forms] ack error", e));
  return NextResponse.json({ ok: true, ref: id.slice(0, 8).toUpperCase() });
}
