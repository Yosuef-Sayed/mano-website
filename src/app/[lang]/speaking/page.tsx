import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SpeakingForm } from "@/components/forms/Forms";
import { PageHero, SectionHead } from "@/components/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/speaking">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const s = getContent(lang).speaking;
  return pageMeta(lang, "/speaking", s.metaTitle, s.metaDescription);
}

export default async function SpeakingPage({ params, searchParams }: PageProps<"/[lang]/speaking">) {
  const lang = await resolveLang(params);
  const sp = await searchParams;
  const topic = typeof sp.topic === "string" ? sp.topic : "";
  const format = sp.format === "workshop" ? "Workshop" : sp.format === "talk" ? "Talk" : "";
  const c = getContent(lang);
  const s = c.speaking;
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={<>{s.titleBefore}<span className="text-teal">{s.titleHighlight}</span></>} lead={s.lead}>
        <div className="flex flex-wrap gap-2">{c.forms.speaking.formats.map((f) => <span key={f.value} className="chip">{f.label}</span>)}</div>
      </PageHero>

      <section className="container-x" aria-labelledby="topics-title">
        <SectionHead id="topics-title" eyebrow={s.topicsEyebrow} title={s.topicsTitle} lead={s.topicsLead} />
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {s.topics.map((t, i) => (
            <li key={t.id} id={t.id} className="scroll-mt-28" data-reveal>
              <article className="card relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <span aria-hidden className="latin pointer-events-none absolute -end-2 -top-6 font-display text-[7rem] font-black text-paper/[0.04]">0{i + 1}</span>
                <span className="tag self-start">{s.proposed}</span>
                <h3 className="mt-3 text-xl font-bold">{t.title}</h3>
                <p className="mt-3 text-sm"><span className="text-muted">{s.forLabel}: </span>{t.audience.join(" · ")}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={s.coversLabel}>
                  {t.content.map((x) => <li key={x} className="chip">{x}</li>)}
                </ul>
                {t.subtopic.title && (
                  <div className="mt-5 rounded-xl border border-line bg-ink/50 p-4 text-sm">
                    <p className="font-semibold">{s.subtopic}: {t.subtopic.title}</p>
                    <p className="mt-1 text-muted">{t.subtopic.audience}. {t.subtopic.text}</p>
                  </div>
                )}
                <p className="mt-5 text-sm"><span className="text-muted">{s.formatsLabel}: </span>{t.formats.join(" · ")}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Link href={lh(lang, `/speaking?topic=${encodeURIComponent(t.title)}&format=talk#invite`)} scroll={false} className="btn btn-primary">{s.speak}</Link>
                  <Link href={lh(lang, `/speaking?topic=${encodeURIComponent(t.title)}&format=workshop#invite`)} scroll={false} className="btn btn-secondary">{s.workshop}</Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="invite" className="container-x mt-24 scroll-mt-28" aria-labelledby="invite-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead id="invite-title" eyebrow={s.formEyebrow} title={s.formTitle} lead={s.formLead} />
          <div className="card p-6 sm:p-8">
            <SpeakingForm key={`${topic}-${format}`} lang={lang} f={c.forms} initialTopic={topic} initialFormat={format} />
          </div>
        </div>
      </section>
    </>
  );
}
