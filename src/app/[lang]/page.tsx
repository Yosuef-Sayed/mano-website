import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { LoopAndWork } from "@/components/home/LoopAndWork";
import { CtaBand, SectionHead } from "@/components/ui";
import { ArrowRight, Download, LinkedIn } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  return { ...pageMeta(lang, "/", undefined, c.meta.description), title: { absolute: c.meta.defaultTitle } };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const h = c.home;
  const journey = c.experience.timeline.entries.filter((e) => ["reds", "athathi", "president"].includes(e.id));

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16 grain lg:-mt-20 lg:pt-20" aria-labelledby="hero-title">
        <div aria-hidden className="pointer-events-none absolute -start-48 top-10 size-[38rem] rounded-full bg-amber/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -end-40 top-40 size-[34rem] rounded-full bg-teal/10 blur-[120px]" />
        <div className="container-x relative grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="latin flex items-center gap-3 text-xs font-semibold tracking-[0.32em] text-teal uppercase" data-reveal>
              <span className="font-brush text-2xl tracking-normal text-paper normal-case">MANO</span>
              <span aria-hidden className="h-px w-8 bg-teal/60" />
              {h.eyebrow}
            </p>
            <h1 id="hero-title" className="mt-6" data-reveal>
              <span className="h-display block text-[2.6rem] leading-[1.1] sm:text-6xl lg:text-7xl">
                {lang === "ar" ? (
                  <>عبدالرحمن <span className="brush-underline">مانو</span></>
                ) : (
                  <>Abdelrahman <span className="brush-underline">MANO</span></>
                )}
              </span>
              <span className="mt-6 block text-2xl font-semibold leading-snug text-paper/90 sm:text-3xl">{c.identity.tagline}</span>
            </h1>
            <p className="mt-6 font-display text-lg font-bold text-teal sm:text-xl" data-reveal>{c.identity.role}</p>
            <p className="mt-1 text-xs font-semibold tracking-[0.28em] text-paper/60 uppercase sm:text-sm" data-reveal>{c.identity.supporting}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal>
              <Link href={lh(lang, "/contact?intent=hiring#form")} className="btn btn-primary">{c.ui.discuss} <ArrowRight /></Link>
              <Link href={lh(lang, "/projects")} className="btn btn-secondary">{c.ui.explore}</Link>
              <a href={site.cv.path} download className="btn btn-ghost"><Download /> {c.ui.downloadCv}</a>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label={`LinkedIn ${c.ui.opensNewTab}`}>
                <LinkedIn /> <span className="latin">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:order-2 lg:max-w-none" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line">
              <Image src="/images/mano-portrait.jpg" alt={h.portraitAlt} fill priority sizes="(min-width: 1024px) 40vw, (min-width: 640px) 400px, 320px" className="object-cover object-[50%_30%]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <p lang="ar" dir="rtl" className="absolute bottom-5 end-6 font-arabic text-3xl text-paper/90 sm:text-4xl">{site.nameArabic}</p>
            </div>
            <div className="absolute -start-3 top-6 hidden rounded-2xl border border-line bg-navy/90 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[11px] tracking-widest text-muted uppercase">{h.currently}</p>
              <p className="text-sm font-semibold">{h.currentlyText}</p>
            </div>
          </div>
        </div>
      </section>

      <LoopAndWork lang={lang} home={h} dimensions={c.dimensions} illustration={c.projects.illustration} />

      {/* JOURNEY TEASER */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="journey-title">
        <SectionHead id="journey-title" eyebrow={h.journey.eyebrow} title={h.journey.title} lead={h.journey.lead} />
        <ol className="relative mt-10 grid gap-5 md:grid-cols-3">
          <span aria-hidden className="absolute start-0 end-0 top-[7px] hidden h-px bg-gradient-to-r from-teal via-line to-amber md:block rtl:bg-gradient-to-l" />
          {journey.map((e) => (
            <li key={e.id} className="relative md:pt-8" data-reveal>
              <span aria-hidden className="absolute start-0 top-0 hidden size-[15px] rounded-full border-2 border-teal bg-ink md:block" />
              <p className="text-xs font-semibold text-teal">{e.date}</p>
              <p className="mt-1 text-lg font-bold">{e.role} · {e.org}</p>
              <p className="mt-1 text-sm text-paper/75">{e.result}</p>
            </li>
          ))}
        </ol>
        <Link href={lh(lang, "/experience")} className="btn btn-secondary mt-8">{h.journey.cta} <ArrowRight /></Link>
      </section>

      {/* PROOF */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="proof-title">
        <SectionHead id="proof-title" eyebrow={h.proof.eyebrow} title={h.proof.title} lead={h.proof.lead} />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {c.proofPoints.map((p) => (
            <li key={p.label} className="bg-ink p-6 sm:p-8" data-reveal>
              <p dir="ltr" className="h-display text-4xl text-teal sm:text-5xl rtl:text-end">{p.value}</p>
              <p className="mt-2 font-semibold">{p.label}</p>
              <p className="mt-1 text-sm text-muted">{p.context}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* AUDIENCE PATHWAYS */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="paths-title">
        <SectionHead id="paths-title" eyebrow={h.paths.eyebrow} title={h.paths.title} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {h.paths.items.map((p) => (
            <li key={p.who} data-reveal>
              <Link href={lh(lang, p.href)} className="card group flex h-full items-start justify-between gap-4 p-6 transition hover:border-teal/60">
                <span>
                  <span className="block text-lg font-bold">{p.who}</span>
                  <span className="mt-1 block text-sm text-paper/75">{p.text}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">{p.cta} <ArrowRight /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        lang={lang}
        title={c.cta.defaultTitle}
        text={c.cta.defaultText}
        actions={[
          { label: c.cta.discuss, href: "/contact?intent=hiring#form" },
          { label: c.cta.session, href: "/book#form" },
          { label: c.cta.contact, href: "/contact?intent=general#form" },
        ]}
      />
    </>
  );
}
