import type { Metadata } from "next";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { resolveLang } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactHub } from "@/components/forms/Forms";
import { PageHero } from "@/components/ui";
import { Download, Mail } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const k = getContent(lang).contact;
  return pageMeta(lang, "/contact", k.metaTitle, k.metaDescription);
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const lang = await resolveLang(params);
  const sp = await searchParams;
  const legacy: Record<string, string> = { career: "hiring", project: "collaboration", speaking: "speaking", general: "general" };
  const intent = typeof sp.intent === "string" ? sp.intent : typeof sp.topic === "string" ? legacy[sp.topic] ?? "" : "";
  const c = getContent(lang);
  const k = c.contact;
  return (
    <>
      <PageHero eyebrow={k.eyebrow} title={k.title} lead={k.lead} />
      <section className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="order-2 space-y-8 lg:order-1">
          <div>
            <p className="eyebrow">{k.direct}</p>
            <ul className="mt-4 space-y-3">
              <li><a href={`mailto:${site.email}`} className="link latin inline-flex items-center gap-2 break-all"><Mail /> {site.email}</a></li>
              <li><a href={site.cv.path} download className="link inline-flex items-center gap-2"><Download /> {c.ui.downloadCv} (PDF)</a></li>
            </ul>
            <p className="mt-4 text-sm text-muted">{k.based}</p>
          </div>
          <div>
            <p className="eyebrow">{k.social}</p>
            <SocialLinks variant="list" className="mt-4" label={c.ui.socialLabel} newTab={c.ui.opensNewTab} />
          </div>
        </aside>
        <div id="form" className="card order-1 scroll-mt-28 p-6 sm:p-8 lg:order-2">
          <ContactHub key={intent} lang={lang} f={c.forms} intents={k.intents} legend={k.intentLegend} initialIntent={intent} />
        </div>
      </section>
    </>
  );
}
