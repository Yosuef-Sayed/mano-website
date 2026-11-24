"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/config/site";
import { Chevron, Close, Menu } from "./Icons";
import { Logo } from "./Logo";

type NavItem = (typeof nav)[number];

function isActive(path: string, item: NavItem) {
  if ("children" in item && item.children) return item.children.some((c) => path === c.href || path.startsWith(c.href + "/"));
  return path === item.href || path.startsWith(item.href + "/");
}

function Dropdown({ item, path }: { item: Extract<NavItem, { children: unknown }>; path: string }) {
  // Open state is tied to the path it was opened on, so navigating closes it automatically.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenAt((cur) => ((typeof v === "function" ? v(cur === path) : v) ? path : null));
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpenAt(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const id = `menu-${item.label.toLowerCase()}`;
  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm transition hover:text-teal ${isActive(path, item) ? "text-teal" : "text-paper/80"}`}
      >
        {item.label}
        <Chevron className={`size-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2">
        <ul className="card overflow-hidden bg-navy/95 p-2 shadow-2xl backdrop-blur">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                aria-current={path === c.href ? "page" : undefined}
                className="block rounded-xl px-4 py-3 transition hover:bg-paper/5 aria-[current=page]:bg-teal/10"
              >
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block text-xs text-muted">{c.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Header() {
  const path = usePathname() || "/";
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenAt((cur) => ((typeof v === "function" ? v(cur === path) : v) ? path : null));
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "bg-transparent"}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" aria-label={`${site.brand} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/" aria-current={path === "/" ? "page" : undefined} className={`rounded-full px-3 py-2 text-sm transition hover:text-teal ${path === "/" ? "text-teal" : "text-paper/80"}`}>
                Home
              </Link>
            </li>
            {nav.map((item) =>
              "children" in item && item.children ? (
                <Dropdown key={item.label} item={item} path={path} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(path, item) ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-sm transition hover:text-teal ${isActive(path, item) ? "text-teal" : "text-paper/80"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={site.cv.path} className="btn btn-ghost" download>
            CV
          </a>
          <Link href="/book" className="btn btn-primary">
            Book a Session
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <div id="mobile-nav" hidden={!open} className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink lg:hidden">
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="space-y-1">
            <li>
              <Link href="/" className="block rounded-xl px-3 py-3 text-lg font-semibold">Home</Link>
            </li>
            {nav.map((item) =>
              "children" in item && item.children ? (
                <li key={item.label} className="pt-3">
                  <p className="eyebrow px-3 pb-1">{item.label}</p>
                  <ul>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} aria-current={path === c.href ? "page" : undefined} className="block rounded-xl px-3 py-3 text-lg font-semibold aria-[current=page]:text-teal">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(path, item) ? "page" : undefined} className="block rounded-xl px-3 py-3 text-lg font-semibold aria-[current=page]:text-teal">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link href="/book" className="btn btn-primary w-full">Book a Session</Link>
            <a href={site.cv.path} download className="btn btn-secondary w-full">Download CV</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
