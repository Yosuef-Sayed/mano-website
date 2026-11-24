import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { activeSocials, site } from "@/config/site";
import { contentItems, contentSummary } from "@/content/brandContent";
import { education } from "@/content/experience";
import { ArrowLink, CtaBand, PageHero, SectionHead } from "@/components/ui";
import { ArrowUpRight, Download } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "About Abdelrahman MANO: AI applications and software development, shaped by customer, product and business experience.",
  alternates: { canonical: "/about" },
};

const story = [
  { title: "Customer understanding", where: "REDS", text: "Serving an average of 150+ customers a week taught me how people actually make buying decisions — what they ask, what worries them, what makes them say yes." },
  { title: "Market & product thinking", where: "ATHATHI", text: "ATHATHI turned that into structured discovery: 30+ customer interviews, 7+ furniture business interviews, segmentation and a business model." },
  { title: "Technology & implementation", where: "ATHATHI · FCAI · NextGen", text: "I contributed to the AI side — Customer and Business Assistants, a RAG recommendation workflow, FastAPI integration — while building my foundation through coursework and an ML internship." },
  { title: "Leadership & execution", where: "Star Union · ATHATHI", text: "Leading Star Union's five divisions and coordinating ATHATHI's team taught me that plans only matter once someone follows them through." },
  { title: "Communication & brand", where: "MANO · Plan Bee", text: "MANO is where I share what I learn about technology, business and careers — in public, in Arabic and English." },
];

const focus = [
  ["AI applications", "Assistants, agents, retrieval — building real prototypes."],
  ["Machine learning", "Currently through the NextGen internship and coursework."],
  ["Software development", "Stronger fundamentals in design, data and integration."],
  ["Product development", "Connecting what users need with what gets built."],
  ["Business & entrepreneurship", "Continuing ATHATHI's validation and business model."],
  ["Content & communication", "Sharing practical ideas through MANO."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={<>Technology, business and people — <span className="text-teal">one way of working.</span></>}
        lead={
          <p>
            I&apos;m {site.name} — known as <b className="text-paper">MANO</b>. I study Computer Science at Cairo University&apos;s Faculty of
            Computers and Artificial Intelligence, and I&apos;ve spent the last two years moving between sales floors, interviews, code and team meetings.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a href={site.cv.path} download className="btn btn-primary"><Download /> Download CV</a>
          <Link href="/experience" className="btn btn-secondary">See my experience</Link>
        </div>
      </PageHero>

      <section className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="who">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-line lg:sticky lg:top-28 lg:self-start" data-reveal>
          <Image src="/images/mano-portrait.jpg" alt="Abdelrahman MANO" fill sizes="(min-width:1024px) 380px, 90vw" className="object-cover" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-paper/85" data-reveal>
          <h2 id="who" className="h-display text-3xl text-paper">Who I am</h2>
          <p>
            I&apos;m not a senior engineer and I&apos;m not an AI expert. I&apos;m a student building a technical foundation — and, alongside it,
            unusually practical exposure to customers, startups, marketing and leadership.
          </p>
          <p>
            That combination is the point. Most problems worth solving aren&apos;t purely technical or purely commercial. They sit where a
            customer&apos;s frustration meets a business model meets something that has to be built and explained.
          </p>
          <h2 className="h-display pt-4 text-3xl text-paper">Why Technology × Business</h2>
          <p>
            Technology without customers is a demo. Business without technology misses what&apos;s now possible. I try to keep both in the
            room — asking <em>“who is this for?”</em> before <em>“how do we build it?”</em>, and then actually helping build it.
          </p>
          <div className="card p-6 text-base">
            <p className="eyebrow">Education</p>
            <p className="mt-2 font-semibold text-paper">{education.degree}</p>
            <p className="text-muted">{education.school} · {education.expected}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {education.coursework.map((c) => <li key={c} className="chip">{c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x mt-24" aria-labelledby="story-title">
        <SectionHead id="story-title" eyebrow="What I have worked on" title="One connected story" />
        <ol className="relative mt-12 space-y-10 border-l border-line pl-8 sm:pl-12">
          {story.map((s, i) => (
            <li key={s.title} className="relative" data-reveal>
              <span aria-hidden className={`absolute -left-[37px] top-1.5 size-3 rounded-full sm:-left-[53px] ${i === story.length - 1 ? "bg-amber" : "bg-teal"}`} />
              <p className="text-xs font-semibold tracking-widest text-muted uppercase">{s.where}</p>
              <h3 className="mt-1 text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 max-w-2xl text-paper/80">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x mt-24" aria-labelledby="how-title">
        <SectionHead
          id="how-title"
          eyebrow="How I approach problems"
          title="Start with people. Be honest about the stage."
          lead="I start with interviews and observation, map the options, design before building, and say clearly what works and what doesn't yet. ATHATHI's AI is a working terminal prototype with integration still in progress — and I'd rather say that than oversell it."
        />
        <ArrowLink href="/projects/athathi" className="mt-6">See this in the ATHATHI case study</ArrowLink>
      </section>

      <section className="container-x mt-24" aria-labelledby="focus-title">
        <SectionHead id="focus-title" eyebrow="Current focus" title="What I'm developing now" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {focus.map(([t, d]) => (
            <li key={t} className="card p-6" data-reveal>
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="content" className="container-x mt-24 scroll-mt-28" aria-labelledby="content-title">
        <SectionHead
          id="content-title"
          eyebrow="MANO: Business × Technology"
          title="Content as “Abdelrahman MANO”"
          lead="Short videos and visual posts on technology, AI, business, opportunities and career growth — published across LinkedIn, Instagram, Facebook, TikTok and YouTube."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
            {contentSummary.output.map((o) => (
              <li key={o.label} className="bg-ink p-6" data-reveal>
                <p className="h-display text-5xl text-teal">{o.value}</p>
                <p className="mt-1 font-semibold">{o.label}</p>
                <p className="text-sm text-muted">{o.note}</p>
              </li>
            ))}
          </ul>
          <div className="card p-6 sm:p-8" data-reveal>
            <p className="eyebrow">Themes</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {contentSummary.themes.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
            <p className="eyebrow mt-8">Platforms</p>
            <p className="mt-2 text-paper/80">{contentSummary.platforms.join(" · ")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {activeSocials().filter((s) => s.key !== "github").map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Follow on {s.label} <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>
        </div>
        {contentItems.length > 0 && (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contentItems.map((c) => (
              <li key={c.title} className="card overflow-hidden" data-reveal>
                {c.thumbnail && (
                  <div className="relative aspect-video">
                    <Image src={c.thumbnail} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="tag">{c.kind} · {c.theme}</p>
                  <h3 className="mt-3 font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {c.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link">{l.platform}</a>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CtaBand />
    </>
  );
}
