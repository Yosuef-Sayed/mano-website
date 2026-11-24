import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { approach, proofPoints } from "@/content/valueLoop";
import { LoopAndWork } from "@/components/home/LoopAndWork";
import { CtaBand, SectionHead } from "@/components/ui";
import { ArrowRight, Download, LinkedIn } from "@/components/Icons";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16 grain lg:-mt-20 lg:pt-20" aria-labelledby="hero-title">
        <div aria-hidden className="pointer-events-none absolute -left-48 top-10 size-[38rem] rounded-full bg-amber/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-40 size-[34rem] rounded-full bg-teal/10 blur-[120px]" />
        <div className="container-x relative grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.32em] text-teal uppercase" data-reveal>
              <span className="font-brush text-2xl tracking-normal text-paper normal-case">MANO</span>
              <span aria-hidden className="h-px w-8 bg-teal/60" />
              Business × Technology
            </p>
            <h1 id="hero-title" className="h-display mt-6 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl" data-reveal>
              I connect technology with the <span className="brush-underline">problems</span> that matter.
            </h1>
            <p className="lead mt-6 max-w-xl" data-reveal>
              I&apos;m {site.shortName} — a Computer Science student at Cairo University working across AI, software, business and
              customers. I founded ATHATHI, lead Star Union, and care about one thing: turning real problems into something people can use.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal>
              <Link href="/projects" className="btn btn-primary">
                Explore My Work <ArrowRight />
              </Link>
              <Link href="/collaborate" className="btn btn-secondary">Work With Me</Link>
              <a href={site.cv.path} download className="btn btn-ghost">
                <Download /> Download CV
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label="LinkedIn profile (opens in a new tab)">
                <LinkedIn /> LinkedIn
              </a>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:order-2 lg:max-w-none" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line">
              <Image
                src="/images/mano-portrait.jpg"
                alt="Portrait of Abdelrahman Ayman (MANO) in a dark blazer, lit warm from the left and cool from the right"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 400px, 320px"
                className="object-cover object-[50%_30%]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <p lang="ar" dir="rtl" className="absolute bottom-5 right-6 font-arabic text-3xl text-paper/90 sm:text-4xl">
                {site.nameArabic}
              </p>
            </div>
            <div className="absolute -left-3 top-6 hidden rounded-2xl border border-line bg-navy/90 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[11px] tracking-widest text-muted uppercase">Currently</p>
              <p className="text-sm font-semibold">Founder, ATHATHI · President, Star Union</p>
            </div>
          </div>
        </div>
      </section>

      <LoopAndWork />

      {/* PROOF */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="proof-title">
        <SectionHead
          id="proof-title"
          eyebrow="Proof through experience"
          title="Numbers, with their context"
          lead="Each figure belongs to one specific experience. They are not added together."
        />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {proofPoints.map((p) => (
            <li key={p.label} className="bg-ink p-6 sm:p-8" data-reveal>
              <p className="h-display text-4xl text-teal sm:text-5xl">{p.value}</p>
              <p className="mt-2 font-semibold">{p.label}</p>
              <p className="mt-1 text-sm text-muted">{p.context}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* APPROACH */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="approach-title">
        <SectionHead
          id="approach-title"
          eyebrow="My approach"
          title="Understand → Explore → Design → Build → Communicate → Improve"
          lead="A loop, not a ladder. Each step is tied to something I've actually done."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approach.map((a, i) => (
            <li key={a.step} className="card relative p-6" data-reveal>
              <span className="font-display text-sm font-bold text-amber">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{a.step}</h3>
              <p className="mt-1 text-paper/80">{a.text}</p>
              <p className="mt-4 border-t border-line pt-4 text-sm text-muted">{a.example}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
