import "server-only";

/**
 * Fixed-window rate limiting.
 *  - Upstash Redis (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN): shared across all serverless instances.
 *  - Otherwise an in-memory fallback, which only protects a single instance (fine locally, weak on Vercel).
 * AI tools refuse to run in production without Upstash, so costs can't run away.
 */
const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
export const sharedLimiter = Boolean(url && token);

const mem = new Map<string, { count: number; reset: number }>();

async function incr(key: string, windowSec: number): Promise<{ count: number; ttl: number }> {
  if (sharedLimiter) {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(windowSec), "NX"], ["TTL", key]]),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const out = (await res.json()) as { result: number }[];
    return { count: Number(out[0].result), ttl: Math.max(1, Number(out[2].result)) };
  }
  const now = Date.now();
  const cur = mem.get(key);
  if (!cur || cur.reset <= now) {
    mem.set(key, { count: 1, reset: now + windowSec * 1000 });
    if (mem.size > 10000) mem.clear();
    return { count: 1, ttl: windowSec };
  }
  cur.count++;
  return { count: cur.count, ttl: Math.ceil((cur.reset - now) / 1000) };
}

async function peek(key: string): Promise<number> {
  if (sharedLimiter) {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return 0;
    const out = (await res.json()) as { result: string | null };
    return Number(out.result || 0);
  }
  const cur = mem.get(key);
  return cur && cur.reset > Date.now() ? cur.count : 0;
}

export async function rateLimit(key: string, limit: number, windowSec: number) {
  try {
    const { count, ttl } = await incr(key, windowSec);
    return { ok: count <= limit, retryAfter: ttl, remaining: Math.max(0, limit - count) };
  } catch (e) {
    console.error("[rateLimit]", e);
    return { ok: true, retryAfter: 0, remaining: limit }; // fail open for forms; tools add their own guard
  }
}

/** Remaining runs for a key without consuming one. */
export async function remaining(key: string, limit: number) {
  try {
    return Math.max(0, limit - (await peek(key)));
  } catch {
    return limit;
  }
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
