"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * After a page renders (direct visit, refresh or client navigation), bring an explicit #anchor into view
 * below the sticky header (CSS scroll-margin handles the offset) and move keyboard focus to it.
 * Without a hash, Next.js already starts new pages at the top (see data-scroll-behavior on <html>).
 */
export function HashScroll() {
  const path = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      // Wait two frames so client components (forms, timeline) have rendered.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (!el) return;
          el.scrollIntoView({ block: "start" });
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }),
      );
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [path, params]);
  return null;
}
