import Link from "next/link";
import { site } from "@/config/site";
import { lh, type Lang } from "@/i18n/config";
import type { Content } from "@/content";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer({ lang, c }: { lang: Lang; c: Content }) {
  const u = c.ui;
  const groups = [
    { title: u.footer.work, links: [[u.nav.experience, "/experience"], [u.nav.projects, "/projects"], [u.footer.caseStudy, "/projects/athathi"], [u.nav.about, "/about"]] },
    { title: u.footer.together, links: [[u.nav.speaking, "/speaking"], [u.footer.clarity, "/book#form"], [u.nav.tools, "/tools"], [u.nav.contact, "/contact#form"]] },
  ];
  return (
    <footer className="mt-24 border-t border-line bg-navy/40">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted">
            <span className="font-semibold text-paper/90">{lang === "ar" ? "عبدالرحمن مانو" : site.publicName}</span> — {u.footer.tagline}
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="eyebrow">{g.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {g.links.map(([l, h]) => (
                <li key={h}><Link className="text-paper/80 transition hover:text-teal" href={lh(lang, h)}>{l}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="eyebrow">{u.footer.connect}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="text-paper/80 transition hover:text-teal" href={`mailto:${site.email}`} title={site.email}>{u.footer.email}</a></li>
            <li><a className="text-paper/80 transition hover:text-teal" href={site.cv.path} download>{u.downloadCv}</a></li>
          </ul>
          <SocialLinks className="mt-5" label={u.socialLabel} newTab={u.opensNewTab} />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>{u.footer.sameDna}</p>
        </div>
      </div>
    </footer>
  );
}
