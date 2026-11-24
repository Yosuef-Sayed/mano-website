import type { ComponentType } from "react";
import { activeSocials, type SocialKey } from "@/config/site";
import { ArrowUpRight, Facebook, Instagram, LinkedIn, TikTok, YouTube } from "./Icons";

const icons: Partial<Record<SocialKey, ComponentType<{ className?: string }>>> = {
  linkedin: LinkedIn,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTok,
  youtube: YouTube,
};

/** Social links from the single config in src/config/site.ts. */
export function SocialLinks({ variant = "icons", className = "", label = "Social media", newTab = "(opens in a new tab)" }: { variant?: "icons" | "list"; className?: string; label?: string; newTab?: string }) {
  const items = activeSocials().filter((s) => s.key !== "github" && s.key !== "linktree");
  if (variant === "list") {
    return (
      <ul className={`space-y-3 ${className}`}>
        {items.map((s) => {
          const Icon = icons[s.key] ?? ArrowUpRight;
          return (
            <li key={s.key}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link latin inline-flex items-center gap-2">
                <Icon /> {s.label}
                <span className="sr-only"> {newTab}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={label}>
      {items.map((s) => {
        const Icon = icons[s.key] ?? ArrowUpRight;
        return (
          <li key={s.key}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label} ${newTab}`}
              title={s.label}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-paper/80 transition hover:border-teal hover:text-teal"
            >
              <Icon className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
