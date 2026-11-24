import type { Metadata } from "next";
import Link from "next/link";
import { services, statusLabel } from "@/content/services";
import { ServiceForm } from "@/components/forms/Forms";
import { PageHero, SectionHead, StatusBadge } from "@/components/ui";
import { Check, Minus } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Services",
  description: "Ways to work together: idea clarity sessions, AI product exploration, customer discovery, personal brand direction and project collaboration.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const visible = services.filter((s) => s.status !== "hidden");
  return (
    <>
      <PageHero
        eyebrow="Ways we can work together"
        title={<>From ideas to <span className="text-teal">practical direction.</span></>}
        lead="Structured sessions and collaboration grounded in what I've actually done — customer discovery, AI prototyping, content and team coordination. Each card says who it's for, what's included, and what isn't."
      >
        <p className="text-sm text-muted">No prices or packages are published yet. Every request is reviewed first, and scope is agreed before anything is confirmed.</p>
      </PageHero>

      <section className="container-x" aria-label="Services">
        <ul className="grid gap-6 lg:grid-cols-2">
          {visible.map((s) => (
            <li key={s.id} id={s.id} className="scroll-mt-28" data-reveal>
              <article className="card flex h-full flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold">{s.title}</h2>
                  <StatusBadge tone={s.status === "unavailable" ? "muted" : s.status === "pilot" ? "amber" : "teal"}>{statusLabel[s.status]}</StatusBadge>
                </div>
                <p className="mt-3 text-paper/80">{s.problem}</p>
                <p className="mt-4 text-sm"><span className="text-muted">For: </span>{s.forWho.join(" · ")}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Includes</p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {s.includes.map((i) => <li key={i} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />{i}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Not included</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-paper/70">
                      {s.notIncluded.map((i) => <li key={i} className="flex gap-2"><Minus className="mt-0.5 size-4 shrink-0 text-amber" />{i}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 rounded-xl bg-ink/50 px-4 py-3 text-sm"><span className="text-muted">Outcome: </span>{s.outcome}</p>
                <p className="mt-3 text-xs text-muted">Grounded in: {s.basedOn}</p>
                <div className="mt-auto pt-6">
                  {s.status === "unavailable" ? (
                    <span className="btn btn-secondary" aria-disabled="true">Temporarily unavailable</span>
                  ) : (
                    <Link href={`/services?service=${s.id}#request`} scroll={false} className="btn btn-primary">
                      {s.status === "inquiry" ? "Ask about availability" : s.id === "project-collaboration" ? "Discuss a project" : "Request a session"}
                    </Link>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="request" className="container-x mt-24 scroll-mt-28" aria-labelledby="request-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead
            id="request-title"
            eyebrow="Request"
            title="Tell me what you need"
            lead="I'll reply by email to say whether I can genuinely help, and suggest a format. Nothing is booked or charged by sending this."
          />
          <div className="card p-6 sm:p-8">
            <ServiceForm key={service ?? "none"} initialService={service ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}
