import "server-only";
import { parse, type HTMLElement } from "node-html-parser";
import { safeFetch, type SafeResponse } from "./safeFetch";

/**
 * Deterministic checks computed from the HTML itself — no AI involved.
 * Each check returns an id, a status and the raw values, so the UI can explain it in either language.
 */
export type CheckStatus = "pass" | "warn" | "fail" | "info";
export type Check = { id: string; status: CheckStatus; value?: string; n?: number; m?: number };

export type PageExtract = {
  url: string;
  title: string;
  description: string;
  h1: string[];
  headings: string[];
  ctas: string[];
  nav: string[];
  text: string;
};

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

export function extract(url: string, html: string): { root: HTMLElement; page: PageExtract } {
  const root = parse(html, { comment: false, blockTextElements: { script: false, style: false, noscript: false, pre: true } });
  const title = clean(root.querySelector("title")?.text || "");
  const description = clean(root.querySelector('meta[name="description" i]')?.getAttribute("content") || "");
  const h1 = root.querySelectorAll("h1").map((e) => clean(e.text)).filter(Boolean).slice(0, 5);
  const headings = root
    .querySelectorAll("h1, h2, h3")
    .map((e) => `${e.tagName.toLowerCase()}: ${clean(e.text)}`)
    .filter((h) => h.length > 4)
    .slice(0, 40);
  const ctas = Array.from(
    new Set(
      root
        .querySelectorAll('button, a[class*="btn" i], a[class*="button" i], a[role="button"], input[type="submit"]')
        .map((e) => clean(e.text || e.getAttribute("value") || ""))
        .filter((t) => t.length > 1 && t.length < 60),
    ),
  ).slice(0, 20);
  const nav = Array.from(new Set(root.querySelectorAll("nav a, header a").map((e) => clean(e.text)).filter((t) => t && t.length < 40))).slice(0, 25);
  const main = root.querySelector("main") || root.querySelector("body") || root;
  const text = clean(main.text).slice(0, 6000);
  return { root, page: { url, title, description, h1, headings, ctas, nav, text } };
}

export function headingSkips(root: HTMLElement): number {
  const levels = root.querySelectorAll("h1, h2, h3, h4, h5, h6").map((e) => Number(e.tagName[1]));
  let skips = 0;
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skips++;
  return skips;
}

export function internalLinks(root: HTMLElement, base: URL): URL[] {
  const out = new Map<string, URL>();
  for (const a of root.querySelectorAll("a[href]")) {
    try {
      const u = new URL(a.getAttribute("href") || "", base);
      if (u.origin !== base.origin || !/^https?:$/.test(u.protocol)) continue;
      u.hash = "";
      if (/\.(pdf|jpe?g|png|gif|svg|webp|zip|mp4|mp3)$/i.test(u.pathname)) continue;
      out.set(u.toString(), u);
    } catch {
      /* ignore bad hrefs */
    }
  }
  return [...out.values()];
}

/** Pick up to `n` extra pages that usually carry the core message (about, services, pricing, contact…). */
export function pickExtraPages(links: URL[], home: URL, n: number): URL[] {
  const prefer = /(about|service|product|pricing|solution|feature|work|contact|من-نحن|خدمات)/i;
  const candidates = links.filter((u) => u.pathname !== home.pathname && u.pathname.split("/").filter(Boolean).length <= 2);
  const ranked = [...candidates.filter((u) => prefer.test(decodeURIComponent(u.pathname))), ...candidates.filter((u) => !prefer.test(decodeURIComponent(u.pathname)))];
  return ranked.slice(0, n);
}

export function checksFor(res: SafeResponse, root: HTMLElement, page: PageExtract, base: URL): Check[] {
  const checks: Check[] = [];
  const tLen = page.title.length;
  checks.push({ id: "title", status: !tLen ? "fail" : tLen < 15 || tLen > 65 ? "warn" : "pass", value: page.title, n: tLen });
  const dLen = page.description.length;
  checks.push({ id: "description", status: !dLen ? "fail" : dLen < 50 || dLen > 170 ? "warn" : "pass", value: page.description, n: dLen });
  checks.push({ id: "h1", status: page.h1.length === 1 ? "pass" : page.h1.length === 0 ? "fail" : "warn", value: page.h1[0] || "", n: page.h1.length });
  const skips = headingSkips(root);
  checks.push({ id: "headings", status: skips ? "warn" : "pass", n: skips });
  const lang = root.querySelector("html")?.getAttribute("lang") || "";
  checks.push({ id: "lang", status: lang ? "pass" : "warn", value: lang });
  const viewport = root.querySelector('meta[name="viewport" i]')?.getAttribute("content") || "";
  checks.push({ id: "viewport", status: /width=device-width/i.test(viewport) ? "pass" : "fail", value: viewport });
  const canonical = root.querySelector('link[rel="canonical" i]')?.getAttribute("href") || "";
  let canonicalOther = false;
  try {
    canonicalOther = Boolean(canonical) && new URL(canonical, base).host !== base.host;
  } catch {
    canonicalOther = true;
  }
  // m=1 flags a canonical pointing to a different host (e.g. localhost left over from development).
  checks.push({ id: "canonical", status: !canonical || canonicalOther ? "warn" : "pass", value: canonical, m: canonicalOther ? 1 : 0 });
  const robotsMeta = (root.querySelector('meta[name="robots" i]')?.getAttribute("content") || "") + " " + String(res.headers["x-robots-tag"] || "");
  checks.push({ id: "indexable", status: /noindex/i.test(robotsMeta) ? "fail" : "pass", value: clean(robotsMeta) });
  const ogTitle = root.querySelector('meta[property="og:title" i]')?.getAttribute("content");
  const ogImage = root.querySelector('meta[property="og:image" i]')?.getAttribute("content");
  checks.push({ id: "og", status: ogTitle && ogImage ? "pass" : ogTitle || ogImage ? "warn" : "fail", n: Number(Boolean(ogTitle)) + Number(Boolean(ogImage)) });
  const imgs = root.querySelectorAll("img");
  const missing = imgs.filter((i) => i.getAttribute("alt") === undefined).length;
  checks.push({ id: "alt", status: !imgs.length ? "info" : missing === 0 ? "pass" : missing / imgs.length > 0.3 ? "fail" : "warn", n: missing, m: imgs.length });
  const links = internalLinks(root, base).length;
  checks.push({ id: "links", status: links >= 3 ? "pass" : "warn", n: links });
  checks.push({ id: "https", status: base.protocol === "https:" ? "pass" : "fail" });
  const kb = Math.round(Buffer.byteLength(res.body) / 1024);
  checks.push({ id: "size", status: kb > 1500 ? "warn" : "info", n: kb });
  checks.push({ id: "response", status: res.ms > 2500 ? "warn" : "info", n: res.ms });
  return checks;
}

export async function siteChecks(base: URL): Promise<Check[]> {
  const out: Check[] = [];
  try {
    const r = await safeFetch(new URL("/robots.txt", base).toString(), "text/plain,*/*;q=0.5");
    const blocksAll = r.status === 200 && /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*($|\n)/i.test(r.body);
    out.push({ id: "robots", status: r.status !== 200 ? "warn" : blocksAll ? "fail" : "pass", n: r.status });
  } catch {
    out.push({ id: "robots", status: "warn", n: 0 });
  }
  try {
    const r = await safeFetch(new URL("/sitemap.xml", base).toString(), "application/xml,text/xml,*/*;q=0.5");
    out.push({ id: "sitemap", status: r.status === 200 && /<(urlset|sitemapindex)/i.test(r.body) ? "pass" : "warn", n: r.status });
  } catch {
    out.push({ id: "sitemap", status: "warn", n: 0 });
  }
  return out;
}
