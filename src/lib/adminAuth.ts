/**
 * Basic-auth check for the private /admin inbox.
 * Admin is disabled (404) unless ADMIN_PASSWORD is set. Username defaults to "admin".
 * Edge-safe (no Node APIs) so it can run in proxy.ts.
 */
export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function isAdminAuthorized(authHeader: string | null) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || !authHeader?.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = atob(authHeader.slice(6));
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  const user = decoded.slice(0, i);
  const pw = decoded.slice(i + 1);
  return safeEqual(user, process.env.ADMIN_USER || "admin") && safeEqual(pw, pass);
}
