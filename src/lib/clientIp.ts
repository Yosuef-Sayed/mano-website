import "server-only";

/** Best-effort visitor IP (Vercel sets x-forwarded-for). Used only for rate limiting, never stored with submissions. */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
