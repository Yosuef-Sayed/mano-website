import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { ToolInfo } from "@/components/tools/ToolInfo";
import { AuditTool } from "@/components/tools/AuditTool";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools/website-audit">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const a = getContent(lang).tools.audit;
  return pageMeta(lang, "/tools/website-audit", a.name, a.metaDescription);
}

export default async function AuditPage({ params }: PageProps<"/[lang]/tools/website-audit">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const t = c.tools;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.audit.name} lead={t.audit.short}>
        <Link href={lh(lang, "/tools")} className="text-sm text-muted hover:text-teal">← {c.ui.nav.tools}</Link>
      </PageHero>
      <section className="container-x grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6 sm:p-8">
          <AuditTool lang={lang} t={t} />
        </div>
        <aside><ToolInfo info={t.audit} labels={t.infoLabels} /></aside>
      </section>
    </>
  );
}
