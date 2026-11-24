import Link from "next/link";
import { activeSocials, site } from "@/config/site";
import { Logo } from "./Logo";

const groups = [
  { title: "Work", links: [["Experience", "/experience"], ["Projects", "/projects"], ["ATHATHI case study", "/projects/athathi"], ["About", "/about"]] },
  { title: "Work together", links: [["Services", "/services"], ["Speaking", "/speaking"], ["Collaborate", "/collaborate"], ["Book a session", "/book"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-navy/40">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted">
            {site.name}. Computer Science student connecting technology, business and people. {site.location}.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="eyebrow">{g.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {g.links.map(([l, h]) => (
                <li key={h}><Link className="text-paper/80 transition hover:text-teal" href={h}>{l}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="eyebrow">Connect</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="text-paper/80 transition hover:text-teal" href="/contact">Contact</Link></li>
            <li><a className="text-paper/80 transition hover:text-teal" href={site.cv.path} download>Download CV</a></li>
            {activeSocials().map((s) => (
              <li key={s.key}>
                <a className="text-paper/80 transition hover:text-teal" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Same DNA. Different stories.</p>
        </div>
      </div>
    </footer>
  );
}
