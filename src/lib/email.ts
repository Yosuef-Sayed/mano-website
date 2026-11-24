import "server-only";
import { formTitles, type FormType } from "./forms/schemas";
import { site } from "@/config/site";

/**
 * Email notifications through Resend's HTTP API (no SDK needed).
 * Set RESEND_API_KEY, NOTIFY_EMAIL_TO and NOTIFY_EMAIL_FROM (a sender on a domain verified in Resend).
 * Set SEND_VISITOR_ACK=true to also send the visitor a short "request received" email.
 */

const key = process.env.RESEND_API_KEY;
const to = process.env.NOTIFY_EMAIL_TO;
const from = process.env.NOTIFY_EMAIL_FROM;

export const emailEnabled = Boolean(key && to && from);

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function send(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}

export async function notifyOwner(type: FormType, data: Record<string, unknown>, id: string) {
  if (!emailEnabled) return false;
  const rows = Object.entries(data)
    .filter(([k]) => k !== "consent")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top"><b>${esc(k)}</b></td><td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  await send({
    from,
    to: [to],
    reply_to: typeof data.email === "string" ? data.email : undefined,
    subject: `[${site.brand} website] ${formTitles[type]}${data.name ? ` from ${data.name}` : ""}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px"><p>New ${esc(formTitles[type]).toLowerCase()} (ref ${esc(id.slice(0, 8))}).</p><table>${rows}</table></div>`,
  });
  return true;
}

export async function acknowledgeVisitor(type: FormType, data: Record<string, unknown>) {
  if (!emailEnabled || process.env.SEND_VISITOR_ACK !== "true" || typeof data.email !== "string") return;
  const booking = type === "booking";
  await send({
    from,
    to: [data.email],
    subject: booking ? "Your session request was received — pending confirmation" : "Thanks — your message was received",
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">
      <p>Hi ${esc(data.name)},</p>
      <p>${booking
        ? "Thanks for your session request. It is <b>not confirmed yet</b>: I'll review it and reply by email to confirm a time (or suggest another one)."
        : "Thanks for reaching out. I've received your message and will reply by email."}</p>
      <p>— ${esc(site.shortName)} (${site.brand})</p></div>`,
  });
}
