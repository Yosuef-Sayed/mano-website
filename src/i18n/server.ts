import { notFound } from "next/navigation";
import { isLang, type Lang } from "./config";

/** Resolve and validate the [lang] route parameter. */
export async function resolveLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}
