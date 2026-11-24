import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden grain">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-amber/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 size-[30rem] rounded-full bg-teal/10 blur-3xl" />
      <div className="container-x relative pb-14 pt-14 sm:pt-20 lg:pb-20">
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h1 className="h-display mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl" data-reveal>{title}</h1>
        {lead && <div className="lead mt-6 max-w-2xl" data-reveal>{lead}</div>}
        {children && <div className="mt-8" data-reveal>{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, id }: { eyebrow: string; title: ReactNode; lead?: ReactNode; id?: string }) {
  return (
    <div className="max-w-3xl" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h-display mt-3 text-3xl sm:text-4xl">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-sm font-semibold text-teal ${className}`}>
      <span className="underline decoration-teal/0 underline-offset-4 transition group-hover:decoration-teal">{children}</span>
      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function CtaBand({
  title = "Have a problem, project, opportunity, or idea worth exploring?",
  text = "Tell me what you're working on. Every message is read personally.",
}: { title?: string; text?: string }) {
  return (
    <section className="container-x mt-24" aria-labelledby="cta-title">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy via-surface to-ink p-8 sm:p-12 grain" data-reveal>
        <div aria-hidden className="pointer-events-none absolute -left-24 -bottom-24 size-80 rounded-full bg-amber/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-teal/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 id="cta-title" className="h-display text-3xl sm:text-4xl">{title}</h2>
          <p className="lead mt-4">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collaborate" className="btn btn-primary">Let&apos;s Collaborate</Link>
            <Link href="/book" className="btn btn-secondary">Book a Session</Link>
            <Link href="/contact" className="btn btn-ghost">Contact Me</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatusBadge({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "amber" | "muted" }) {
  const c = tone === "amber" ? "border-amber/40 bg-amber/10 text-amber" : tone === "muted" ? "border-line bg-paper/5 text-paper/70" : "border-teal/40 bg-teal/10 text-teal";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${c}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
