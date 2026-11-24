import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { aiEnabled } from "@/lib/tools/config";

const routes = ["", "/about", "/experience", "/projects", "/projects/athathi", "/speaking", "/contact", "/book", "/tools", "/tools/website-audit", "/tools/project-planner", "/privacy"];

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // List the planner only when it is actually usable.
  return routes.filter((r) => r !== "/tools/project-planner" || aiEnabled()).flatMap((r) => {
    const en = `${site.url}${r || "/"}`;
    const ar = `${site.url}/ar${r}`;
    const alternates = { languages: { en, ar } };
    const priority = r === "" ? 1 : ["/projects", "/projects/athathi", "/experience"].includes(r) ? 0.9 : 0.7;
    return [
      { url: en, lastModified: now, changeFrequency: "monthly" as const, priority, alternates },
      { url: ar, lastModified: now, changeFrequency: "monthly" as const, priority: priority - 0.1, alternates },
    ];
  });
}
