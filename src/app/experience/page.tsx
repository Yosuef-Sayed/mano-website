import type { Metadata } from "next";
import { site } from "@/config/site";
import { education, training } from "@/content/experience";
import { ExperienceExplorer } from "@/components/ExperienceExplorer";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { Download } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Experience",
  description: "Startup, leadership, machine learning, marketing and sales experience — ATHATHI, Star Union, NextGen Institute, Plan Bee and REDS.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Startup, leadership, ML, marketing and sales — each labelled for what it is."
        lead="Employment, internships, a startup, leadership roles and student activities are tagged separately. Open any role to see what I actually did and what is still in progress."
      >
        <a href={site.cv.path} download className="btn btn-secondary"><Download /> Download the full CV</a>
      </PageHero>

      <section className="container-x" aria-label="Roles">
        <ExperienceExplorer />
      </section>

      <section className="container-x mt-24" aria-labelledby="edu-title">
        <SectionHead id="edu-title" eyebrow="Education" title={education.school} />
        <div className="card mt-8 p-6 sm:p-8" data-reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xl font-bold">{education.degree}</p>
            <p className="font-display font-bold text-teal">{education.expected}</p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {education.coursework.map((c) => <li key={c} className="chip">{c}</li>)}
          </ul>
        </div>
      </section>

      <section className="container-x mt-24" aria-labelledby="training-title">
        <SectionHead
          id="training-title"
          eyebrow="Certifications & training"
          title="Programs, hackathons and courses"
          lead="Each item states its real nature — completion, participation, attendance, or completed without a certificate."
        />
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {training.map((t) => (
            <li key={t.name} className="grid gap-1 bg-surface/30 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7" data-reveal>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted">{t.issuer} · {t.kind}</p>
              </div>
              <p className="font-display text-sm font-bold text-paper/80">{t.date}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Languages: Arabic (native) · English (professional working proficiency)</p>
      </section>

      <CtaBand title="Looking for an intern or junior teammate who works across tech and business?" text="I'm open to internships and early-career roles in AI, software, data, business development and marketing." />
    </>
  );
}
