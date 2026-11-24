import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "@/components/forms/Forms";
import { PageHero } from "@/components/ui";
import { Download, Mail } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Abdelrahman MANO about hiring and technical opportunities, project collaboration, speaking or anything else.",
  alternates: { canonical: "/contact" },
};

const routes = [
  ["Career opportunity", "/collaborate?type=career"],
  ["Project collaboration", "/collaborate?type=technical"],
  ["Speaking invitation", "/speaking#invite"],
  ["Book a session", "/book"],
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Contact" title="Have an opportunity, idea, or project worth discussing?" lead="Send a message here, or use a more specific route if it fits better." />
      <section className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Direct</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className="link inline-flex items-center gap-2 break-all"><Mail /> {site.email}</a>
              </li>
              <li>
                <a href={site.cv.path} download className="link inline-flex items-center gap-2"><Download /> Download CV (PDF)</a>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted">Based in {site.location} · Cairo time (UTC+2/+3).</p>
          </div>
          <div>
            <p className="eyebrow">Social</p>
            <SocialLinks variant="list" className="mt-4" />
          </div>
          <div>
            <p className="eyebrow">Specific routes</p>
            <ul className="mt-4 grid gap-2">
              {routes.map(([l, h]) => (
                <li key={h}><Link href={h} className="btn btn-secondary w-full justify-between">{l} <span aria-hidden>→</span></Link></li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="card p-6 sm:p-8">
          <ContactForm key={topic ?? "none"} initialTopic={["career", "project", "speaking", "general"].includes(topic ?? "") ? topic : "general"} />
        </div>
      </section>
    </>
  );
}
