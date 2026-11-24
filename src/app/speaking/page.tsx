import type { Metadata } from "next";
import Link from "next/link";
import { speakingFormats, speakingTopics } from "@/content/services";
import { SpeakingForm } from "@/components/forms/Forms";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Speaking & Workshops",
  description: "Invite MANO to speak or run a workshop on technology × business, practical AI applications, customer discovery and product thinking.",
  alternates: { canonical: "/speaking" },
};

export default async function SpeakingPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Speaking, workshops & knowledge sharing"
        title={<>Invite MANO to <span className="text-teal">your event.</span></>}
        lead="For student activities, communities, programs and companies. I speak from practical experience as a student founder and organization leader — not as an industry veteran."
      >
        <div className="flex flex-wrap gap-2">{speakingFormats.map((f) => <span key={f} className="chip">{f}</span>)}</div>
      </PageHero>

      <section className="container-x" aria-labelledby="topics-title">
        <SectionHead id="topics-title" eyebrow="Topics" title="What I can talk about" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakingTopics.map((t) => (
            <li key={t.title} data-reveal>
              <Link href={`/speaking?topic=${encodeURIComponent(t.title)}#invite`} scroll={false} className="card group block h-full p-6 transition hover:border-teal/60">
                <h3 className="text-lg font-bold transition group-hover:text-teal">{t.title}</h3>
                <p className="mt-2 text-sm text-muted">{t.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal">Request this topic →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Past speaking engagements will be listed here once they happen. Workshops for Star Union this season are being planned.
        </p>
      </section>

      <section id="invite" className="container-x mt-24 scroll-mt-28" aria-labelledby="invite-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead id="invite-title" eyebrow="Invitation" title="Event details" lead="Share what you have — I'll reply by email about availability and fit." />
          <div className="card p-6 sm:p-8">
            <SpeakingForm key={topic ?? "none"} initialTopic={topic ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}
