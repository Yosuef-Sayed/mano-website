import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { SocialLinks } from "@/components/SocialLinks";
import { Download } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const a = getContent(lang).about;
  return pageMeta(lang, "/about", a.metaTitle, a.metaDescription);
}

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const a = c.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={<>{a.titleBefore}<span className="text-teal">{a.titleHighlight}</span></>} lead={<p>{a.lead}</p>}>
        <div className="flex flex-wrap gap-3">
          <a href={site.cv.path} download className="btn btn-primary"><Download /> {c.ui.downloadCv}</a>
          <Link href={lh(lang, "/experience")} className="btn btn-secondary">{a.seeExperience}</Link>
        </div>
      </PageHero>

      <section className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="who">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-line lg:sticky lg:top-28 lg:self-start" data-reveal>
          <Image src="/images/mano-portrait.jpg" alt={a.portraitAlt} fill sizes="(min-width:1024px) 380px, 90vw" className="object-cover" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-paper/85" data-reveal>
          <h2 id="who" className="h-display text-3xl text-paper">{a.whoTitle}</h2>
          {a.who.map((p) => <p key={p}>{p}</p>)}
          <h2 className="h-display pt-4 text-3xl text-paper">{a.whyTitle}</h2>
          <p>{a.why}</p>
          <div className="card p-6 text-base">
            <p className="eyebrow">{a.educationLabel}</p>
            <p className="mt-2 font-semibold text-paper">{c.education.degree}</p>
            <p className="text-muted">{c.education.school} · {c.education.expected}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.education.coursework.map((x) => <li key={x} className="chip">{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x mt-24" aria-labelledby="story-title">
        <SectionHead id="story-title" eyebrow={a.storyEyebrow} title={a.storyTitle} />
        <ol className="relative mt-12 space-y-10 border-s border-line ps-8 sm:ps-12">
          {a.story.map((s, i) => (
            <li key={s.title} className="relative" data-reveal>
              <span aria-hidden className={`absolute -start-[37px] top-1.5 size-3 rounded-full sm:-start-[53px] ${i === a.story.length - 1 ? "bg-amber" : "bg-teal"}`} />
              <p className="latin text-xs font-semibold tracking-widest text-muted uppercase">{s.where}</p>
              <h3 className="mt-1 text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 max-w-2xl text-paper/80">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x mt-24" aria-labelledby="focus-title">
        <SectionHead id="focus-title" eyebrow={a.focusEyebrow} title={a.focusTitle} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {a.focus.map((f) => (
            <li key={f.title} className="card p-6" data-reveal>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="content" className="container-x mt-24 scroll-mt-28" aria-labelledby="content-title">
        <SectionHead id="content-title" eyebrow={a.contentEyebrow} title={a.contentTitle} lead={a.contentLead} />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
            {a.contentOutput.map((o) => (
              <li key={o.label} className="bg-ink p-6" data-reveal>
                <p className="h-display text-5xl text-teal">{o.value}</p>
                <p className="mt-1 font-semibold">{o.label}</p>
                <p className="text-sm text-muted">{o.note}</p>
              </li>
            ))}
          </ul>
          <div className="card p-6 sm:p-8" data-reveal>
            <p className="eyebrow">{a.themesLabel}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {a.themes.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
            <p className="eyebrow mt-8">{a.followLabel}</p>
            <SocialLinks variant="list" className="mt-4" label={c.ui.socialLabel} newTab={c.ui.opensNewTab} />
          </div>
        </div>
      </section>

      <CtaBand
        lang={lang}
        title={c.cta.defaultTitle}
        text={c.cta.defaultText}
        actions={[
          { label: c.cta.discuss, href: "/contact?intent=hiring" },
          { label: c.cta.speak, href: "/speaking" },
        ]}
      />
    </>
  );
}
