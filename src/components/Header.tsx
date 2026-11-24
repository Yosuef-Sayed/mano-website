"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { basePath, lh, switchHref, type Lang } from "@/i18n/config";
import type { Content } from "@/content";
import { Close, Globe, Menu } from "./Icons";
import { Logo } from "./Logo";

export function Header({ lang, ui }: { lang: Lang; ui: Content["ui"] }) {
  const rawPath = usePathname() || "/";
  const path = basePath(rawPath);
  // Open state is tied to the path it was opened on, so navigating closes it automatically.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === rawPath;
  const [scrolled, setScrolled] = useState(false);

  const items = [
    { label: ui.nav.about, href: "/about" },
    { label: ui.nav.experience, href: "/experience" },
    { label: ui.nav.projects, href: "/projects" },
    { label: ui.nav.speaking, href: "/speaking" },
    { label: ui.nav.tools, href: "/tools" },
    { label: ui.nav.contact, href: "/contact" },
  ];
  const active = (href: string) => path === href || path.startsWith(href + "/");
  const other: Lang = lang === "ar" ? "en" : "ar";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const langLink = (
    <Link
      href={switchHref(rawPath, other)}
      hrefLang={other}
      lang={other}
      aria-label={ui.langAria}
      className="btn btn-ghost gap-1.5 whitespace-nowrap px-2.5"
    >
      <Globe /> <span className={`${other === "en" ? "latin" : ""} xl:hidden 2xl:inline`}>{ui.langName}</span>
    </Link>
  );

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "bg-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-ink">
        {ui.skip}
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-3 lg:h-20">
        <Link href={lh(lang, "/")} aria-label={`${site.brand} — ${ui.nav.home}`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={lh(lang, it.href)}
                  aria-current={active(it.href) ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm transition hover:text-teal ${active(it.href) ? "text-teal" : "text-paper/80"}`}
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-1 xl:flex">
          {langLink}
          <a href={site.cv.path} className="btn btn-ghost whitespace-nowrap px-2.5" download>{ui.cv}</a>
          <Link href={lh(lang, "/contact?intent=hiring")} className="btn btn-primary whitespace-nowrap px-4">{ui.discuss}</Link>
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          {langLink}
          <button
            type="button"
            className="-me-2 inline-flex size-11 items-center justify-center rounded-full text-paper"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? ui.menuClose : ui.menuOpen}
            onClick={() => setOpenAt(open ? null : rawPath)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink xl:hidden">
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="space-y-1">
            {[{ label: ui.nav.home, href: "/" }, ...items].map((it) => (
              <li key={it.href}>
                <Link
                  href={lh(lang, it.href)}
                  aria-current={(it.href === "/" ? path === "/" : active(it.href)) ? "page" : undefined}
                  className="block rounded-xl px-3 py-3 text-lg font-semibold aria-[current=page]:text-teal"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href={lh(lang, "/contact?intent=hiring")} className="btn btn-primary w-full">{ui.discuss}</Link>
            <a href={site.cv.path} download className="btn btn-secondary w-full">{ui.downloadCv}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
