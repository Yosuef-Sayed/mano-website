import type { Metadata } from "next";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { BookingForm } from "@/components/forms/Forms";
import { PageHero } from "@/components/ui";
import { Check, Minus } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/book">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const b = getContent(lang).book;
  return pageMeta(lang, "/book", b.metaTitle, b.metaDescription);
}

export default async function BookPage({ params, searchParams }: PageProps<"/[lang]/book">) {
  const lang = await resolveLang(params);
  const sp = await searchParams;
  const session = typeof sp.session === "string" ? sp.session : "project-session";
  const c = getContent(lang);
  const b = c.book;
  return (
    <>
      <PageHero eyebrow={b.eyebrow} title={b.title} lead={b.lead}>
        <ol className="grid gap-3 sm:grid-cols-3">
          {b.steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-surface/40 p-4">
              <p className="latin font-display text-sm font-bold text-amber">0{i + 1}</p>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </PageHero>
      <section className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="card p-6">
            <p className="eyebrow">{b.forLabel}</p>
            <p className="mt-2 text-paper/85">{b.forWho.join(" · ")}</p>
            <p className="eyebrow mt-6">{b.coversLabel}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {b.covers.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-teal" />{x}</li>)}
            </ul>
            <p className="eyebrow mt-6">{b.notLabel}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-paper/70">
              {b.not.map((x) => <li key={x} className="flex gap-2"><Minus className="mt-0.5 size-4 shrink-0 text-amber" />{x}</li>)}
            </ul>
          </div>
        </aside>
        <div className="card p-6 sm:p-8">
          <BookingForm key={session} lang={lang} f={c.forms} initialSession={session} />
        </div>
      </section>
    </>
  );
}
