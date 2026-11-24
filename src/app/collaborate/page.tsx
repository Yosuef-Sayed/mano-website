import type { Metadata } from "next";
import { collaborationTypes } from "@/content/services";
import { CollaborateForm } from "@/components/forms/Forms";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Collaborate",
  description: "Career opportunities, freelance work, technical, business, content, partnership and media collaboration with MANO.",
  alternates: { canonical: "/collaborate" },
};

export default async function CollaboratePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Opportunities & collaboration"
        title="What would you like to work on together?"
        lead="Pick a path and the form will ask only what's relevant. I'm open to internships and early-career roles across AI, software, data, business development, sales and marketing."
      />
      <section className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]" aria-label="Collaboration inquiry">
        <aside className="hidden lg:block">
          <ul className="sticky top-28 space-y-4">
            {collaborationTypes.map((c) => (
              <li key={c.id}>
                <p className="font-semibold">{c.label}</p>
                <p className="text-sm text-muted">{c.hint}</p>
              </li>
            ))}
          </ul>
        </aside>
        <div className="card p-6 sm:p-8">
          <CollaborateForm key={type ?? "none"} initialType={type ?? ""} />
        </div>
      </section>
    </>
  );
}
