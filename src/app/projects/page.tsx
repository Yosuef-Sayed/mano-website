import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects",
  description: "ATHATHI, MASROOFY, MANOPIX, MANOFY and MANO GAMEBOARD — purpose, role, technology and honest status.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="What I've built, and what each one is."
        lead="A startup prototype, team software and academic projects. Each shows its purpose, my actual role, the technology and its real status. Visuals are designed illustrations, not screenshots."
      />
      <section className="container-x" aria-label="Project list">
        <ProjectsExplorer />
      </section>
      <CtaBand title="Working on an early-stage project that needs both technical and business thinking?" />
    </>
  );
}
