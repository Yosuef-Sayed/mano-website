import type { Metadata } from "next";
import Link from "next/link";
import { speakingFormats, speakingTopics } from "@/content/services";
import { SpeakingForm } from "@/components/forms/Forms";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Speaking & Workshops",
  description: "Proposed talks and workshops by Abdelrahman MANO: practical AI, AI as a co-pilot, from problem to product, and professional presence.",
  alternates: { canonical: "/speaking" },
};

export default async function SpeakingPage({ searchParams }: { searchParams: Promise<{ topic?: string; format?: string }> }) {
  const { topic, format } = await searchParams;
  const initialFormat = format === "workshop" ? "Workshop" : format === "talk" ? "Talk" : "";
  return (
    <>
      <PageHero
        eyebrow="Speaking, workshops & knowledge sharing"
        title={<>Invite MANO to <span className="text-teal">your event.</span></>}
        lead="For companies, communities, universities and student activities. These are proposed topics: I speak from hands-on experience building an early-stage venture and leading an organization — not as an industry veteran."
      >
        <div className="flex flex-wrap gap-2">{speakingFormats.map((f) => <span key={f} className="chip">{f}</span>)}</div>
      </PageHero>

      <section className="container-x" aria-labelledby="topics-title">
        <SectionHead
          id="topics-title"
          eyebrow="Proposed workshops & speaking topics"
          title="Topics I can deliver"
          lead="Proposed topics I'm open to presenting. None has been delivered yet; delivered talks and workshops will be listed here once they happen."
        />
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {speakingTopics.map((t) => (
            <li key={t.id} id={t.id} className="scroll-mt-28" data-reveal>
              <article className="card flex h-full flex-col p-6 sm:p-7">
                <span className="tag self-start">Proposed topic</span>
                <h3 className="mt-3 text-xl font-bold">{t.title}</h3>
                <p className="mt-3 text-sm"><span className="text-muted">For: </span>{t.audience.join(" · ")}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="What it covers">
                  {t.content.map((c) => <li key={c} className="chip">{c}</li>)}
                </ul>
                {t.subtopic && (
                  <div className="mt-5 rounded-xl border border-line bg-ink/50 p-4 text-sm">
                    <p className="font-semibold">Subtopic: {t.subtopic.title}</p>
                    <p className="mt-1 text-muted">For {t.subtopic.audience}. {t.subtopic.text}</p>
                  </div>
                )}
                <p className="mt-5 text-sm"><span className="text-muted">Formats: </span>{t.formats.join(" · ")}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Link href={`/speaking?topic=${encodeURIComponent(t.title)}&format=talk#invite`} scroll={false} className="btn btn-primary">Invite Me to Speak</Link>
                  <Link href={`/speaking?topic=${encodeURIComponent(t.title)}&format=workshop#invite`} scroll={false} className="btn btn-secondary">Request a Workshop</Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="invite" className="container-x mt-24 scroll-mt-28" aria-labelledby="invite-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead id="invite-title" eyebrow="Invitation" title="Event details" lead="Share what you have — I'll reply by email about availability and fit." />
          <div className="card p-6 sm:p-8">
            <SpeakingForm key={`${topic ?? "none"}-${initialFormat}`} initialTopic={topic ?? ""} initialFormat={initialFormat} />
          </div>
        </div>
      </section>
    </>
  );
}
