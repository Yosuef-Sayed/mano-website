import type { Lang } from "@/i18n/config";
import { en } from "./en";
import { ar } from "./ar";
import type { DeepWiden } from "./types";

export type Content = DeepWiden<typeof en>;

const all: Record<Lang, Content> = { en, ar };

/** All visible text for a language. Edit src/content/en.ts and src/content/ar.ts. */
export function getContent(lang: Lang): Content {
  return all[lang];
}
