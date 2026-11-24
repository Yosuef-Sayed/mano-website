/**
 * Locale configuration.
 * English lives at the existing URLs (/about), Arabic under /ar (/ar/about).
 * src/proxy.ts rewrites unprefixed URLs to /en internally, so app/[lang] serves both.
 */
export const locales = ["en", "ar"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "en";

export const isLang = (v: string): v is Lang => (locales as readonly string[]).includes(v);
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

/** Localize an internal path: "/about" → "/ar/about" in Arabic. External, mailto, files and anchors pass through. */
export function lh(lang: Lang, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/files/") || href.startsWith("/images/") || href.startsWith("/api/")) {
    return href;
  }
  if (lang === "en") return href;
  return href === "/" ? "/ar" : `/ar${href}`;
}

/** Strip the locale prefix from a visible pathname: "/ar/about" → "/about". */
export function basePath(pathname: string): string {
  const p = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

/** The same page in the other language. */
export function switchHref(pathname: string, to: Lang): string {
  return lh(to, basePath(pathname));
}
