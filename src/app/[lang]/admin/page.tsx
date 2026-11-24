import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { listSubmissions, statusNames, storageMode, submissionStatuses, updateSubmission, type SubmissionStatus } from "@/lib/storage";
import { formTitles } from "@/lib/forms/schemas";
import { emailEnabled } from "@/lib/email";

export const metadata: Metadata = { title: "Inbox", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function assertAdmin() {
  const h = await headers();
  if (!isAdminAuthorized(h.get("authorization"))) notFound();
}

async function setStatus(formData: FormData) {
  "use server";
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as SubmissionStatus;
  const notes = String(formData.get("notes") || "").slice(0, 2000);
  if (!id || !submissionStatuses.includes(status)) return;
  await updateSubmission(id, { status, notes });
  revalidatePath("/admin");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await assertAdmin();
  const { type } = await searchParams;
  const all = await listSubmissions();
  const rows = type ? all.filter((r) => r.type === type) : all;

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-bold">Inbox</h1>
      <p className="mt-2 text-sm text-muted">
        Storage: <b>{storageMode}</b> · Email notifications: <b>{emailEnabled ? "on" : "off"}</b> · {all.length} total.
        Booking requests start as “Pending confirmation”. Confirm only after you have agreed a time, then email the meeting link.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Filter by form">
        <Link className="chip" href="/admin" aria-current={!type ? "true" : undefined}>All</Link>
        {Object.entries(formTitles).map(([k, v]) => (
          <Link key={k} className="chip" href={`/admin?type=${k}`} aria-current={type === k ? "true" : undefined}>{v}</Link>
        ))}
      </nav>
      <div className="mt-8 space-y-4">
        {rows.length === 0 && <p className="text-muted">No submissions yet.</p>}
        {rows.map((r) => (
          <article key={r.id} className="card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold">
                {formTitles[r.type] ?? r.type} · {String(r.data.name ?? r.data.organization ?? "")}{" "}
                <span className="text-muted font-normal">&lt;{String(r.data.email ?? "")}&gt;</span>
              </h2>
              <time className="text-xs text-muted" dateTime={r.created_at}>
                {new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })} (Cairo)
              </time>
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[160px_1fr]">
              {Object.entries(r.data)
                .filter(([k]) => !["consent", "name", "email"].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap break-words">{String(v)}</dd>
                  </div>
                ))}
            </dl>
            <form action={setStatus} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
              <input type="hidden" name="id" value={r.id} />
              <label className="text-sm">
                <span className="block text-xs text-muted">Status</span>
                <select name="status" defaultValue={r.status} className="input mt-1 py-2">
                  {submissionStatuses.map((s) => (
                    <option key={s} value={s}>{statusNames[s]}</option>
                  ))}
                </select>
              </label>
              <label className="min-w-[220px] flex-1 text-sm">
                <span className="block text-xs text-muted">Private notes</span>
                <input name="notes" defaultValue={r.notes ?? ""} className="input mt-1 py-2" />
              </label>
              <button className="btn btn-secondary py-2" type="submit">Save</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
