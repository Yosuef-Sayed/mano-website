import "server-only";
import dns from "dns";
import http from "http";
import https from "https";
import zlib from "zlib";
import net from "net";
import { isPublicIp } from "./ip";

/**
 * SSRF-hardened fetch for the website audit.
 * - Only http/https on default ports, no credentials in the URL.
 * - Every hostname is resolved here and ALL resolved addresses must be public; the socket then connects
 *   to the validated address (pinned lookup), so DNS rebinding can't switch it to a private IP.
 * - Redirects are followed manually (max 3) and every hop is re-validated.
 * - Hard limits: 10 s per request, 2 MB decompressed body.
 */
export class FetchBlockedError extends Error {}
export class FetchFailedError extends Error {}

export type SafeResponse = { url: string; status: number; contentType: string; body: string; ms: number; headers: http.IncomingHttpHeaders };

const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;
const UA = "MANO-Website-Clarity-Check/1.0 (free website review tool)";

export function validateUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new FetchBlockedError("invalid url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new FetchBlockedError("protocol");
  if (u.username || u.password) throw new FetchBlockedError("credentials");
  if (u.port && !["80", "443"].includes(u.port)) throw new FetchBlockedError("port");
  const host = u.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || host === "localhost" || /\.(localhost|local|internal|lan|home|corp|intranet)$/.test(host) || !host.includes(".") && !net.isIP(host)) {
    throw new FetchBlockedError("host");
  }
  if (net.isIP(host) && !isPublicIp(host)) throw new FetchBlockedError("private ip");
  return u;
}

async function resolvePublic(host: string): Promise<{ address: string; family: number }> {
  if (net.isIP(host)) {
    if (!isPublicIp(host)) throw new FetchBlockedError("private ip");
    return { address: host, family: net.isIP(host) };
  }
  const addrs = await dns.promises.lookup(host, { all: true, verbatim: true }).catch(() => {
    throw new FetchFailedError("dns");
  });
  if (!addrs.length) throw new FetchFailedError("dns");
  if (addrs.some((a) => !isPublicIp(a.address))) throw new FetchBlockedError("resolves to private ip");
  return addrs[0];
}

function requestOnce(u: URL, pinned: { address: string; family: number }, accept: string): Promise<SafeResponse & { location?: string }> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const mod = u.protocol === "https:" ? https : http;
    const lookup: net.LookupFunction = (_h, opts, cb) => {
      // Always hand back the pre-validated address, whatever the caller asks for.
      if ((opts as { all?: boolean }).all) (cb as unknown as (e: null, a: { address: string; family: number }[]) => void)(null, [pinned]);
      else cb(null, pinned.address, pinned.family);
    };
    const req = mod.request(
      {
        protocol: u.protocol,
        hostname: u.hostname.replace(/^\[|\]$/g, ""),
        port: u.port || (u.protocol === "https:" ? 443 : 80),
        path: `${u.pathname}${u.search}`,
        method: "GET",
        lookup,
        servername: net.isIP(u.hostname) ? undefined : u.hostname,
        headers: { "User-Agent": UA, Accept: accept, "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en,ar;q=0.8" },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          resolve({ url: u.toString(), status, contentType: "", body: "", ms: Date.now() - started, headers: res.headers, location: res.headers.location });
          return;
        }
        const enc = String(res.headers["content-encoding"] || "").toLowerCase();
        let stream: NodeJS.ReadableStream = res;
        if (enc.includes("br")) stream = res.pipe(zlib.createBrotliDecompress());
        else if (enc.includes("gzip")) stream = res.pipe(zlib.createGunzip());
        else if (enc.includes("deflate")) stream = res.pipe(zlib.createInflate());
        const chunks: Buffer[] = [];
        let size = 0;
        stream.on("data", (c: Buffer) => {
          size += c.length;
          if (size > MAX_BYTES) {
            req.destroy(new FetchFailedError("too large"));
            return;
          }
          chunks.push(c);
        });
        stream.on("end", () =>
          resolve({ url: u.toString(), status, contentType: String(res.headers["content-type"] || ""), body: Buffer.concat(chunks).toString("utf8"), ms: Date.now() - started, headers: res.headers }),
        );
        stream.on("error", (e) => reject(e instanceof FetchFailedError ? e : new FetchFailedError(String(e))));
      },
    );
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new FetchFailedError("timeout")));
    req.on("error", (e) => reject(e instanceof FetchFailedError || e instanceof FetchBlockedError ? e : new FetchFailedError(String(e))));
    req.end();
  });
}

export async function safeFetch(raw: string, accept = "text/html,application/xhtml+xml"): Promise<SafeResponse> {
  let u = validateUrl(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const pinned = await resolvePublic(u.hostname.replace(/^\[|\]$/g, ""));
    const res = await requestOnce(u, pinned, accept);
    if (res.location) {
      if (hop === MAX_REDIRECTS) throw new FetchFailedError("too many redirects");
      u = validateUrl(new URL(res.location, u).toString());
      continue;
    }
    return res;
  }
  throw new FetchFailedError("too many redirects");
}
