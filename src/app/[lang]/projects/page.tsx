import type { Metadata } from "next";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { CtaBand, PageHero } from "@/components/ui";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const p = getContent(lang).projects;
  return pageMeta(lang, "/projects", p.metaTitle, p.metaDescription);
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const lang = await resolveLang(params);
  const c = getContent(lang);
  const p = c.projects;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <section className="container-x" aria-label={p.eyebrow}>
        <ProjectsExplorer lang={lang} t={p} />
      </section>
      <CtaBand
        lang={lang}
        title={p.ctaTitle}
        actions={[
          { label: c.cta.discuss, href: "/contact?intent=collaboration" },
          { label: c.cta.session, href: "/book" },
        ]}
      />
    </>
  );
}
