import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { FormType } from "./forms/schemas";

/**
 * Submission storage.
 *  - Supabase (recommended for production): set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *  - Local JSON file (development only): used automatically when Supabase is not configured
 *    and NODE_ENV !== "production". Never used in production, so nothing is silently lost.
 */

export const submissionStatuses = [
  "new",
  "under_review",
  "pending_confirmation",
  "awaiting_payment",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

export const statusNames: Record<SubmissionStatus, string> = {
  new: "New request",
  under_review: "Under review",
  pending_confirmation: "Pending confirmation",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type Submission = {
  id: string;
  type: FormType;
  status: SubmissionStatus;
  data: Record<string, unknown>;
  created_at: string;
  notes?: string | null;
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = process.env.SUPABASE_TABLE || "submissions";

export const storageMode: "supabase" | "file" | "none" =
  supabaseUrl && supabaseKey ? "supabase" : process.env.NODE_ENV !== "production" ? "file" : "none";

const FILE = path.join(process.cwd(), ".data", "submissions.json");

async function readFile(): Promise<Submission[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}
async function writeFile(rows: Submission[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}

function sbHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: supabaseKey!,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function saveSubmission(type: FormType, data: Record<string, unknown>): Promise<Submission> {
  const row: Submission = {
    id: randomUUID(),
    type,
    status: type === "booking" ? "pending_confirmation" : "new",
    data,
    created_at: new Date().toISOString(),
  };
  if (storageMode === "supabase") {
    const res = await fetch(`${supabaseUrl}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: sbHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
    return row;
  }
  if (storageMode === "file") {
    const rows = await readFile();
    rows.unshift(row);
    await writeFile(rows);
    return row;
  }
  throw new Error("No storage configured");
}

export async function listSubmissions(): Promise<Submission[]> {
  if (storageMode === "supabase") {
    const res = await fetch(`${supabaseUrl}/rest/v1/${TABLE}?select=*&order=created_at.desc&limit=500`, {
      headers: sbHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase select failed: ${res.status}`);
    return res.json();
  }
  if (storageMode === "file") return readFile();
  return [];
}

export async function updateSubmission(id: string, patch: { status?: SubmissionStatus; notes?: string }) {
  if (storageMode === "supabase") {
    const res = await fetch(`${supabaseUrl}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: sbHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify(patch),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase update failed: ${res.status}`);
    return;
  }
  if (storageMode === "file") {
    const rows = await readFile();
    const row = rows.find((r) => r.id === id);
    if (row) Object.assign(row, patch);
    await writeFile(rows);
  }
}
