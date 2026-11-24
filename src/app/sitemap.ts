import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const routes = ["", "/about", "/experience", "/projects", "/projects/athathi", "/services", "/speaking", "/collaborate", "/book", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/projects/athathi" || r === "/projects" ? 0.9 : 0.7,
  }));
}
