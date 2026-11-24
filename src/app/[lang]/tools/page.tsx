import type { Metadata } from "next";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { aiEnabled } from "@/lib/tools/config";
import { PageHero } from "@/components/ui";
import { ToolPicker } from "@/components/tools/ToolPicker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const t = getContent(lang).tools;
  return pageMeta(lang, "/tools", t.metaTitle, t.metaDescription);
}

export default async function ToolsPage({ params }: PageProps<"/[lang]/tools">) {
  const lang = await resolveLang(params);
  const t = getContent(lang).tools;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
        <p className="text-sm text-muted">{t.freeNote}</p>
      </PageHero>
      <section className="container-x" aria-labelledby="picker-title">
        <ToolPicker lang={lang} t={t} plannerAvailable={aiEnabled()} />
      </section>
      <section className="container-x mt-20 max-w-3xl" aria-labelledby="faq-title">
        <h2 id="faq-title" className="h-display text-3xl">{t.faqTitle}</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
          {t.faq.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}<span aria-hidden className="text-teal transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-paper/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
