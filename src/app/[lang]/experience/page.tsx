import type { Metadata } from "next";
import { readdirSync } from "fs";
import path from "path";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { Timeline } from "@/components/Timeline";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { Download, FileIcon } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/experience">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const x = getContent(lang).experience;
  return pageMeta(lang, "/experience", x.metaTitle, x.metaDescription);
}

/** Official logos dropped into /public/images/logos/<key>.(svg|png|jpg|webp) replace the monogram marks automatically. */
function availableLogos(): Record<string, string> {
  try {
    const dir = path.join(process.cwd(), "public/images/logos");
    return Object.fromEntries(
      readdirSync(dir)
        .filter((f) => /\.(svg|png|jpe?g|webp)$/i.test(f))
        .map((f) => [f.replace(/\.[^.]+$/, ""), `/images/logos/${f}`]),
    );
  } catch {
    return {};
  }
}

export default async function ExperiencePage({ params }: PageProps<"/[lang]/experience">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const x = c.experience;
  return (
    <>
      <PageHero eyebrow={x.eyebrow} title={x.title} lead={x.lead}>
        <a href={site.cv.path} download className="btn btn-secondary"><Download /> {x.downloadCv}</a>
      </PageHero>

      <section className="container-x" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="sr-only">{x.timeline.title}</h2>
        <Timeline lang={lang} x={x} logos={availableLogos()} />
      </section>

      <section className="container-x mt-24" aria-labelledby="edu-title">
        <SectionHead id="edu-title" eyebrow={x.educationEyebrow} title={c.education.school} />
        <div className="card mt-8 p-6 sm:p-8" data-reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xl font-bold">{c.education.degree}</p>
            <p className="font-display font-bold text-teal">{c.education.expected}</p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {c.education.coursework.map((cw) => <li key={cw} className="chip">{cw}</li>)}
          </ul>
        </div>
      </section>

      <section id="training" className="container-x mt-24 scroll-mt-28" aria-labelledby="training-title">
        <SectionHead id="training-title" eyebrow={x.trainingEyebrow} title={x.trainingTitle} lead={x.trainingLead} />
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {x.training.map((t) => (
            <li key={t.name} className="grid gap-2 bg-surface/30 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-7" data-reveal>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted">{t.issuer} · {t.kind}</p>
              </div>
              {t.certificate ? (
                <a href={t.certificate} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                  <FileIcon /> {x.viewCertificate}
                </a>
              ) : <span />}
              <p className="font-display text-sm font-bold text-paper/80">{t.date}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{x.languages}</p>
      </section>

      <CtaBand
        lang={lang}
        title={x.ctaTitle}
        text={x.ctaText}
        actions={[
          { label: c.cta.discuss, href: "/contact?intent=hiring" },
          { label: c.ui.explore, href: "/projects" },
        ]}
      />
    </>
  );
}
