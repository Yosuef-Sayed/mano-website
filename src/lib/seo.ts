import type { Metadata } from "next";
import type { Lang } from "@/i18n/config";
import { lh } from "@/i18n/config";

/** Per-page metadata with canonical URL and English/Arabic alternates. */
export function pageMeta(lang: Lang, path: string, title: string | undefined, description: string): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: lh(lang, path),
      languages: { en: path, ar: lh("ar", path), "x-default": path },
    },
    openGraph: { url: lh(lang, path), description, ...(title ? { title } : {}) },
  };
}
