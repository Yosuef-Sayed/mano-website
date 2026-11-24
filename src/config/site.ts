/**
 * Central site configuration.
 * Edit this file to change identity, links, the CV file and the deployed domain.
 * Anything left empty ("") is hidden on the site; nothing is shown as a dead link.
 */

export const site = {
  /** Set NEXT_PUBLIC_SITE_URL in the environment once the real domain is live. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    // Fallback: Vercel's own production domain, so canonical/OG/sitemap never point to localhost.
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),

  brand: "MANO",
  tagline: "Business × Technology",
  /** Formal name: used in About, the CV and structured data. */
  name: "Abdelrahman Ayman Samir Elsayed",
  /** Public name: used in the hero, titles and footer. */
  publicName: "Abdelrahman MANO",
  nameArabic: "عبدالرحمن مانو",
  /** Primary professional direction. */
  role: "AI Applications & Software Development",
  /** Supporting perspective. */
  supporting: "Product & Business Thinking",
  location: "Cairo, Egypt",
  timezone: "Africa/Cairo",

  description:
    "Abdelrahman MANO works across AI applications and software development, connecting technical projects with customer needs, product thinking, and business context.",

  /** The CV lives at a stable URL. Replace the file in /public/files to update it. */
  cv: {
    path: "/files/Abdelrahman-Ayman-Samir-Elsayed-CV.pdf",
    shortLink: "/cv",
    updated: "November 2026",
  },

  email: "abdelrahman.man0.work@gmail.com",

  /**
   * Social links (verified, Nov 2026). This is the single source for every social link on the site.
   * Leave a value "" to hide that platform everywhere.
   */
  social: {
    linkedin: "https://www.linkedin.com/in/abdelrahman-man0/",
    instagram: "https://www.instagram.com/abdelrahman.man0/?hl=en",
    facebook: "https://www.facebook.com/abdelrahman.man0.page/",
    tiktok: "https://www.tiktok.com/@abdelrahman..man0",
    youtube: "https://www.youtube.com/@abdelrahman.man0.channel",
    github: "",
    linktree: "",
  },

  /** Public social page name used across platforms. */
  socialHandleName: "Abdelrahman MANO",
} as const;

export type SocialKey = keyof typeof site.social;

export const socialLabels: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  github: "GitHub",
  linktree: "Linktree",
};

export function activeSocials() {
  return (Object.keys(site.social) as SocialKey[])
    .filter((k) => site.social[k])
    .map((k) => ({ key: k, label: socialLabels[k], href: site.social[k] }));
}

export const nav = [
  { label: "About", href: "/about" },
  {
    label: "Work",
    href: "/projects",
    children: [
      { label: "Experience", href: "/experience", note: "Roles, leadership & timeline" },
      { label: "Projects", href: "/projects", note: "AI, software & academic work" },
      { label: "ATHATHI Case Study", href: "/projects/athathi", note: "Business × AI product story" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Speaking", href: "/speaking" },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Contact", href: "/contact", note: "General messages" },
      { label: "Collaborate", href: "/collaborate", note: "Jobs, projects & partnerships" },
      { label: "Book a Session", href: "/book", note: "Request an online meeting" },
    ],
  },
] as const;
