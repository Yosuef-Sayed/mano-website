import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { ChapterRail } from "@/components/ChapterRail";
import { ProjectCover } from "@/components/ProjectCover";
import { CtaBand, StatusBadge } from "@/components/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/athathi">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const a = getContent(lang).athathi;
  return pageMeta(lang, "/projects/athathi", a.metaTitle, a.metaDescription);
}

function Chapter({ id, n, title, word, next, nextTitle, children }: { id: string; n: number; title: string; word: string; next?: string; nextTitle?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-32 border-t border-line pt-12" data-reveal>
      <p className="text-sm font-bold text-amber">{word} <span className="latin">{String(n).padStart(2, "0")}</span></p>
      <h2 id={`${id}-h`} className="h-display mt-1 text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-paper/85">{children}</div>
      {next && (
        <a href={`#${next}`} className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-teal">
          <span aria-hidden>↓</span> {nextTitle}
        </a>
      )}
    </section>
  );
}

function Node({ title, sub, tone = "base" }: { title: string; sub?: string; tone?: "base" | "mine" }) {
  const cls = tone === "mine" ? "border-teal/60 bg-teal/10" : "border-line bg-surface/70";
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${cls}`}>
      <p className="text-sm font-bold text-paper">{title}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}
const Down = ({ dashed, label }: { dashed?: boolean; label?: string }) => (
  <div className="flex flex-col items-center py-1" aria-hidden>
    <span className={`h-6 w-px ${dashed ? "border-s border-dashed border-amber/70" : "bg-teal/60"}`} />
    {label && <span className="text-[10px] font-semibold tracking-wider text-amber uppercase">{label}</span>}
    <span className={`size-0 border-x-4 border-t-[6px] border-x-transparent ${dashed ? "border-t-amber/70" : "border-t-teal/60"}`} />
  </div>
);

export default async function Athathi({ params }: PageProps<"/[lang]/projects/athathi">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const a = c.athathi;
  const ch = a.chapters;
  const nx = (i: number) => (i + 1 < ch.length ? { next: ch[i + 1].id, nextTitle: `${a.next}: ${ch[i + 1].title}` } : {});
  const N = a.technical.nodes;

  return (
    <>
      <header className="relative overflow-hidden grain">
        <div aria-hidden className="pointer-events-none absolute -start-40 -top-24 size-[36rem] rounded-full bg-amber/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -end-40 top-20 size-[30rem] rounded-full bg-teal/10 blur-[120px]" />
        <div className="container-x relative grid items-end gap-10 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.3fr_1fr]">
          <div>
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href={lh(lang, "/projects")} className="hover:text-teal">{c.ui.breadcrumbProjects}</Link> <span aria-hidden>/</span> <span className="latin">ATHATHI</span>
          </nav>
          <p className="eyebrow mt-6">{a.eyebrow}</p>
          <h1 className="h-display latin mt-3 text-5xl sm:text-7xl">ATHATHI</h1>
          <p className="mt-4 max-w-3xl text-xl text-paper/85 sm:text-2xl">{a.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusBadge tone="amber">{a.status}</StatusBadge>
            <span className="tag">{a.roleTag}</span>
            <span className="tag">{a.teamTag}</span>
          </div>
          </div>
          <ProjectCover id="athathi" label={c.projects.illustration} className="hidden aspect-[4/3] lg:block" />
        </div>
      </header>

      <div className="container-x grid gap-12 lg:grid-cols-[240px_1fr]">
        <ChapterRail chapters={ch} label={a.chaptersLabel} chapterWord={a.chapterWord} />

        <article className="min-w-0 space-y-16">
          <Chapter id={ch[0].id} n={1} title={ch[0].title} word={a.chapterWord} {...nx(0)}>
            <p>{a.context.text}</p>
            <p className="text-base text-muted">{a.context.note}</p>
          </Chapter>

          <Chapter id={ch[1].id} n={2} title={ch[1].title} word={a.chapterWord} {...nx(1)}>
            <p>{a.problem.lead}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {a.problem.items.map((x) => <li key={x} className="rounded-xl border border-line bg-surface/40 px-4 py-3 text-base">{x}</li>)}
            </ul>
            <p>{a.problem.close}</p>
          </Chapter>

          <Chapter id={ch[2].id} n={3} title={ch[2].title} word={a.chapterWord} {...nx(2)}>
            <div className="grid gap-4 sm:grid-cols-2">
              {a.discovery.stats.map((s) => (
                <div key={s.label} className="card p-6">
                  <p dir="ltr" className="h-display text-5xl text-teal rtl:text-end">{s.value}</p>
                  <p className="mt-1 font-semibold">{s.label}</p>
                  <p className="text-sm text-muted">{s.note}</p>
                </div>
              ))}
            </div>
            <p>{a.discovery.text}</p>
          </Chapter>

          <Chapter id={ch[3].id} n={4} title={ch[3].title} word={a.chapterWord} {...nx(3)}>
            <p>{a.product.journeyLead}</p>
            <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              {a.product.journey.map((j, i) => (
                <li key={j} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-0">
                  <span className="flex w-full items-center justify-center rounded-xl border border-teal/40 bg-teal/10 px-3 py-3 text-base font-semibold">{j}</span>
                  {i < a.product.journey.length - 1 && <span aria-hidden className="text-teal sm:hidden">↓</span>}
                </li>
              ))}
            </ol>
            <div className="grid gap-4 sm:grid-cols-3">
              {a.product.segments.map((s) => <div key={s.title} className="card p-5"><p className="font-bold">{s.title}</p><p className="text-sm text-muted">{s.text}</p></div>)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {a.product.sides.map((s) => <div key={s.title} className="card p-5 text-base"><p className="eyebrow">{s.title}</p><p className="mt-2 text-paper/80">{s.text}</p></div>)}
            </div>
            <p className="text-base text-muted">{a.product.componentsLead}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {a.product.components.map((s) => <div key={s.title} className="card p-5 text-base"><p className="font-bold text-teal">{s.title}</p><p className="mt-2 text-paper/80">{s.text}</p></div>)}
            </div>
          </Chapter>

          <Chapter id={ch[4].id} n={5} title={ch[4].title} word={a.chapterWord} {...nx(4)}>
            <div className="card p-6">
              <p className="eyebrow">{a.technical.contributions[1].title}</p>
              <ul className="mt-4 grid gap-2.5 text-base sm:grid-cols-2">
                {a.technical.contributions[1].items.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-teal" /><span className="text-paper/85">{x}</span></li>)}
              </ul>
            </div>
          </Chapter>

          <Chapter id={ch[5].id} n={6} title={ch[5].title} word={a.chapterWord} {...nx(5)}>
            <div className="card p-6">
              <p className="eyebrow">{a.technical.contributions[0].title}</p>
              <ul className="mt-4 grid gap-2.5 text-base sm:grid-cols-2">
                {a.technical.contributions[0].items.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-teal" /><span className="text-paper/85">{x}</span></li>)}
              </ul>
            </div>
            <p className="rounded-xl border border-line bg-ink/50 p-4 text-base text-paper/80">{a.technical.boundary}</p>

            <h3 className="pt-4 text-2xl font-bold text-paper">{a.technical.archTitle}</h3>
            <p className="text-base text-muted">{a.technical.archNote}</p>
            <div className="card p-5 sm:p-8" role="img" aria-label={a.technical.archAria}>
              <div className="mx-auto max-w-2xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Node title={N.ui} sub={N.uiSub} />
                  <Node title={N.backend} sub={N.backendSub} />
                </div>
                <Down dashed label={N.integration} />
                <Node title={N.ai} sub={N.aiSub} tone="mine" />
                <Down />
                <Node title={N.agent} sub={N.agentSub} />
                <Down />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Node title={N.customer} tone="mine" />
                  <Node title={N.business} tone="mine" />
                  <Node title={N.rag} tone="mine" />
                </div>
                <Down dashed label={N.retrieval} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Node title={N.vector} sub={N.vectorSub} />
                  <Node title={N.tavily} sub={N.tavilySub} />
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted">
                <li className="flex items-center gap-2"><span className="size-3 rounded border border-teal/60 bg-teal/10" /> {N.legendMine}</li>
                <li className="flex items-center gap-2"><span className="size-3 rounded border border-line bg-surface" /> {N.legendTeam}</li>
                <li className="flex items-center gap-2"><span className="h-px w-5 border-t border-dashed border-amber" /> {N.legendPending}</li>
              </ul>
            </div>

            <p className="text-base text-muted">{a.technical.stackNote}</p>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line text-base">
              {a.technical.stack.map((r) => (
                <div key={r.k} className="grid gap-1 bg-surface/30 px-5 py-3 sm:grid-cols-[180px_1fr]">
                  <dt className="font-semibold">{r.k}</dt>
                  <dd className="text-paper/80">{r.v}</dd>
                </div>
              ))}
            </dl>
          </Chapter>

          <Chapter id={ch[6].id} n={7} title={ch[6].title} word={a.chapterWord} {...nx(6)}>
            <StatusBadge tone="amber">{a.status}</StatusBadge>
            <p>{a.prototype.lead}</p>
            <ul className="space-y-3 text-base">
              {a.prototype.challenges.map((x) => (
                <li key={x.title} className="rounded-xl border border-dashed border-amber/40 bg-amber/5 px-5 py-4"><b className="text-amber">{x.title}.</b> <span className="text-paper/85">{x.text}</span></li>
              ))}
            </ul>
            <p>{a.prototype.current}</p>
          </Chapter>

          <Chapter id={ch[7].id} n={8} title={ch[7].title} word={a.chapterWord}>
            <ul className="grid gap-3 text-base sm:grid-cols-2">
              {a.lessons.items.map((x) => <li key={x.title} className="card p-5"><p className="font-bold">{x.title}</p><p className="mt-1 text-sm text-muted">{x.text}</p></li>)}
            </ul>
            <h3 className="pt-2 text-xl font-bold text-paper">{a.lessons.nextTitle}</h3>
            <ol className="space-y-2 text-base">
              {a.lessons.next.map((x, i) => <li key={x} className="flex gap-3"><span className="latin font-bold text-teal">{i + 1}.</span>{x}</li>)}
            </ol>
          </Chapter>
        </article>
      </div>

      <CtaBand
        lang={lang}
        title={a.ctaTitle}
        text={a.ctaText}
        actions={[
          { label: c.cta.discuss, href: "/contact?intent=collaboration" },
          { label: c.cta.session, href: "/book" },
        ]}
      />
    </>
  );
}
