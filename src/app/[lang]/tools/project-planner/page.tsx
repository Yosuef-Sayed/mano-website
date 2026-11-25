import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { lh } from "@/i18n/config";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { aiEnabled } from "@/lib/tools/config";
import { PageHero } from "@/components/ui";
import { ToolInfo } from "@/components/tools/ToolInfo";
import { PlannerTool } from "@/components/tools/PlannerTool";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools/project-planner">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const p = getContent(lang).tools.planner;
  return pageMeta(lang, "/tools/project-planner", p.name, p.metaDescription);
}

export default async function PlannerPage({ params }: PageProps<"/[lang]/tools/project-planner">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const t = c.tools;
  // Not listed or reachable until it can actually run (no placeholder page).
  if (!aiEnabled()) notFound();
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.planner.name} lead={t.planner.short}>
        <Link href={lh(lang, "/tools")} className="text-sm text-muted hover:text-teal">← {c.ui.nav.tools}</Link>
      </PageHero>
      <section className="container-x grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6 sm:p-8">
          <PlannerTool lang={lang} t={t} />
        </div>
        <aside><ToolInfo info={t.planner} labels={t.infoLabels} /></aside>
      </section>
    </>
  );
}
