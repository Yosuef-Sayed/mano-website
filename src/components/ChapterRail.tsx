"use client";

import { useEffect, useState } from "react";

/** Sticky chapter navigation with the active chapter highlighted, plus a thin reading-progress bar. */
export function ChapterRail({ chapters, label, chapterWord }: { chapters: { id: string; title: string }[]; label: string; chapterWord: string }) {
  const [active, setActive] = useState(chapters[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const first = els[0];
        const last = els[els.length - 1];
        if (!first || !last) return;
        const start = first.getBoundingClientRect().top + window.scrollY - 120;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        setProgress(Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start))));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [chapters]);

  const idx = Math.max(0, chapters.findIndex((c) => c.id === active));

  return (
    <>
      {/* Mobile: compact progress bar with the current chapter */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-ink/90 px-4 py-2 backdrop-blur lg:hidden" aria-hidden>
        <p className="text-xs text-muted">
          {chapterWord} {idx + 1}/{chapters.length} · <span className="text-paper">{chapters[idx]?.title}</span>
        </p>
        <div className="mt-1.5 h-0.5 overflow-hidden rounded bg-paper/10">
          <div className="h-full origin-[0] bg-teal rtl:origin-[100%]" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>

      {/* Desktop: sticky rail */}
      <nav aria-label={label} className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow">{label}</p>
          <ol className="mt-4 space-y-1 border-s border-line text-sm">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={active === c.id ? "true" : undefined}
                  className="-ms-px flex gap-3 border-s-2 border-transparent py-1.5 ps-4 text-muted transition hover:text-paper aria-[current=true]:border-teal aria-[current=true]:text-paper"
                >
                  <span className="latin font-display text-xs font-bold text-amber">{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-6 h-1 overflow-hidden rounded bg-paper/10" aria-hidden>
            <div className="h-full origin-[0] bg-teal rtl:origin-[100%]" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
      </nav>
    </>
  );
}
