import type { Metadata } from "next";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const p = getContent(lang).privacy;
  return pageMeta(lang, "/privacy", p.metaTitle, p.metaDescription);
}

export default async function Privacy({ params }: PageProps<"/[lang]/privacy">) {
  const lang = await resolveLang(params);
  const p = getContent(lang).privacy;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} />
      <section className="container-x max-w-3xl space-y-8 text-paper/85">
        {p.sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-xl font-bold text-paper">{s.title}</h2>
            <p className="mt-2">{s.text}</p>
          </div>
        ))}
        <p>{p.deleteBefore}<a className="link latin" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </section>
    </>
  );
}
